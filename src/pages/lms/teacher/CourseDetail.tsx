import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Plus, Trash2, Edit3, Save, X, ChevronDown, ChevronRight,
  Video, FileText, BookOpen, Users, Clock, Tag,
  GripVertical, Check, AlertCircle, Loader2, Presentation,
  Paperclip, UploadCloud, Calendar, Link2,
} from 'lucide-react';
import { api } from '@/lib/api';

// ── Types ─────────────────────────────────────────────────────────────────────

type TopicType = 'lecture' | 'lab' | 'video' | 'document' | 'assignment' | 'live_session';

interface Topic {
  id: string;
  title: string;
  description: string | null;
  duration: string | null;
  type: TopicType;
  order: number;
  weekId: string;
  attachmentUrl: string | null;
  attachmentName: string | null;
  meetLink: string | null;
  dueDate: string | null;
  maxScore: number | null;
  assignmentId: string | null;
}

interface Week {
  id: string;
  weekNumber: number;
  title: string;
  topics: Topic[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  category: string | null;
  level: string | null;
  duration: string | null;
  status: string;
  _count: { enrollments: number; sections: number };
  teacher: { id: string; name: string };
}

// ── Topic type meta ────────────────────────────────────────────────────────────

const TOPIC_TYPES: { value: TopicType; label: string; icon: React.ElementType; color: string }[] = [
  { value: 'lecture',      label: 'Lecture',      icon: Presentation, color: 'text-blue-500'    },
  { value: 'lab',          label: 'Lab',          icon: BookOpen,     color: 'text-teal-500'    },
  { value: 'video',        label: 'Video',        icon: Video,        color: 'text-rose-500'    },
  { value: 'document',     label: 'Document',     icon: FileText,     color: 'text-emerald-500' },
  { value: 'assignment',   label: 'Assignment',   icon: BookOpen,     color: 'text-amber-500'   },
  { value: 'live_session', label: 'Live Session', icon: Users,        color: 'text-purple-500'  },
];

function getTopicIcon(type: TopicType) {
  const found = TOPIC_TYPES.find((t) => t.value === type);
  if (!found) return null;
  const Icon = found.icon;
  return <Icon className={`w-3.5 h-3.5 ${found.color}`} />;
}

// ── Upload helper ──────────────────────────────────────────────────────────────

async function uploadFile(file: File): Promise<{ url: string; fileName: string }> {
  const token = localStorage.getItem('token');
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch(`${import.meta.env.VITE_API_URL ?? ''}/api/upload/submission`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: fd,
  });
  if (!res.ok) throw new Error('Upload failed');
  const data = await res.json() as { url: string; fileName: string };
  return { url: data.url, fileName: file.name };
}

// ── File upload field ──────────────────────────────────────────────────────────

function FileUploadField({
  url, name, onChange, label = 'Attach document',
}: {
  url: string; name: string;
  onChange: (url: string, name: string) => void;
  label?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handle = async (file: File) => {
    setUploading(true); setError('');
    try {
      const result = await uploadFile(file);
      onChange(result.url, result.fileName);
    } catch {
      setError('Upload failed. Please try again.');
    } finally { setUploading(false); }
  };

  if (url) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-muted/40 text-sm">
        <Paperclip className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        <span className="flex-1 truncate text-foreground text-xs">{name || 'Attached file'}</span>
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-[#023064] text-xs hover:underline shrink-0">View</a>
        <button type="button" onClick={() => onChange('', '')} className="text-muted-foreground hover:text-red-400 transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <input ref={ref} type="file" className="sr-only" onChange={e => { const f = e.target.files?.[0]; if (f) handle(f); }} />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        disabled={uploading}
        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border-2 border-dashed border-border hover:border-[#023064]/40 transition-all text-xs font-semibold text-muted-foreground hover:text-[#023064] disabled:opacity-50"
      >
        {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
        {uploading ? 'Uploading…' : label}
      </button>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

// ── Inline editable text ───────────────────────────────────────────────────────

function InlineEdit({
  value, onSave, className = '',
}: {
  value: string; onSave: (v: string) => Promise<void>; className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const start = () => { setDraft(value); setEditing(true); setTimeout(() => inputRef.current?.focus(), 0); };
  const cancel = () => { setEditing(false); setDraft(value); };
  const save = async () => {
    if (!draft.trim() || draft.trim() === value) { cancel(); return; }
    setSaving(true);
    await onSave(draft.trim());
    setSaving(false);
    setEditing(false);
  };

  if (!editing) {
    return (
      <span className={`cursor-pointer hover:underline decoration-dashed ${className}`} onClick={start}>
        {value}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1">
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') cancel(); }}
        className={`border border-blue-400 rounded px-2 py-0.5 text-sm outline-none bg-card ${className}`}
      />
      {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" /> : (
        <>
          <button onClick={save} className="text-emerald-600 hover:text-emerald-700"><Check className="w-3.5 h-3.5" /></button>
          <button onClick={cancel} className="text-muted-foreground hover:text-muted-foreground"><X className="w-3.5 h-3.5" /></button>
        </>
      )}
    </span>
  );
}

// ── Topic Editor Panel ─────────────────────────────────────────────────────────

function TopicEditorPanel({
  topic, onUpdate, onClose,
}: {
  topic: Topic; onUpdate: (updated: Topic) => void; onClose: () => void;
}) {
  const [title, setTitle] = useState(topic.title);
  const [type, setType] = useState<TopicType>(topic.type);
  const [description, setDescription] = useState(topic.description ?? '');
  const [duration, setDuration] = useState(topic.duration ?? '');
  const [meetLink, setMeetLink] = useState(topic.meetLink ?? '');
  const [attachmentUrl, setAttachmentUrl] = useState(topic.attachmentUrl ?? '');
  const [attachmentName, setAttachmentName] = useState(topic.attachmentName ?? '');
  const [dueDate, setDueDate] = useState(
    topic.dueDate ? new Date(topic.dueDate).toISOString().slice(0, 16) : ''
  );
  const [maxScore, setMaxScore] = useState(topic.maxScore?.toString() ?? '100');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      const { topic: updated } = await api.patch<{ topic: Topic }>(
        `/curriculum/topics/${topic.id}`,
        {
          title: title.trim(),
          type,
          description: description.trim() || null,
          duration: duration.trim() || null,
          meetLink: meetLink.trim() || null,
          attachmentUrl: attachmentUrl || null,
          attachmentName: attachmentName || null,
          dueDate: dueDate || null,
          maxScore: maxScore ? parseInt(maxScore) : null,
        }
      );
      onUpdate(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // user can retry
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
        <h3 className="font-heading font-semibold text-foreground text-sm">Edit Topic</h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Topic Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-sm border border-border rounded-lg px-3 py-2 outline-none focus:border-[#023064] focus:ring-1 focus:ring-[#023064]/20"
            placeholder="e.g. Introduction to Networking"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Topic Type</label>
          <div className="grid grid-cols-2 gap-2">
            {TOPIC_TYPES.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.value}
                  onClick={() => setType(t.value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                    type === t.value
                      ? 'border-[#023064] bg-[#023064]/5 text-[#023064]'
                      : 'border-border text-muted-foreground hover:border-slate-300'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${type === t.value ? 'text-[#023064]' : t.color}`} />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full text-sm border border-border rounded-lg px-3 py-2 outline-none focus:border-[#023064] focus:ring-1 focus:ring-[#023064]/20 resize-none"
            placeholder="Brief overview of this topic…"
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Duration</label>
          <input
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full text-sm border border-border rounded-lg px-3 py-2 outline-none focus:border-[#023064]"
            placeholder="e.g. 45 min"
          />
        </div>

        {/* Meet link for lecture / lab / live_session */}
        {(type === 'lecture' || type === 'lab' || type === 'live_session') && (
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
              {type === 'live_session' ? 'Meeting Link' : 'Meet Link (optional)'}
            </label>
            <div className="flex items-center gap-2">
              <Link2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <input
                value={meetLink}
                onChange={(e) => setMeetLink(e.target.value)}
                className="flex-1 text-sm border border-border rounded-lg px-3 py-2 outline-none focus:border-[#023064]"
                placeholder="https://meet.google.com/..."
              />
            </div>
          </div>
        )}

        {/* File uploader for document */}
        {type === 'document' && (
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Document File</label>
            <FileUploadField
              url={attachmentUrl}
              name={attachmentName}
              onChange={(url, name) => { setAttachmentUrl(url); setAttachmentName(name); }}
              label="Attach document"
            />
          </div>
        )}

        {/* Assignment extra fields */}
        {type === 'assignment' && (
          <>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Assignment File / Instructions</label>
              <FileUploadField
                url={attachmentUrl}
                name={attachmentName}
                onChange={(url, name) => { setAttachmentUrl(url); setAttachmentName(name); }}
                label="Upload assignment document"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Due Date</label>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <input
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="flex-1 text-sm border border-border rounded-lg px-3 py-2 outline-none focus:border-[#023064]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Max Score</label>
                <input
                  type="number"
                  min={1}
                  value={maxScore}
                  onChange={(e) => setMaxScore(e.target.value)}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2 outline-none focus:border-[#023064]"
                  placeholder="100"
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Save button */}
      <div className="px-5 py-3 border-t border-slate-100">
        <button
          onClick={handleSave}
          disabled={saving || !title.trim()}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-[#023064] text-white text-sm font-semibold hover:bg-[#012550] disabled:opacity-60 transition-all"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function TeacherCourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // UI state
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(new Set());
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  // Add week form
  const [addingWeek, setAddingWeek] = useState(false);
  const [newWeekTitle, setNewWeekTitle] = useState('');
  const [savingWeek, setSavingWeek] = useState(false);

  // Add topic form
  const [addingTopicFor, setAddingTopicFor] = useState<string | null>(null);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicType, setNewTopicType] = useState<TopicType>('lecture');
  const [savingTopic, setSavingTopic] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      api.get<{ course: Course }>(`/courses/${id}`),
      api.get<{ weeks: Week[] }>(`/curriculum?courseId=${id}`),
    ])
      .then(([{ course }, { weeks }]) => {
        setCourse(course);
        setWeeks(weeks);
        if (weeks.length > 0) setExpandedWeeks(new Set([weeks[0].id]));
      })
      .catch(() => setError('Failed to load course'))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleWeek = (weekId: string) => {
    setExpandedWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(weekId)) next.delete(weekId); else next.add(weekId);
      return next;
    });
  };

  const handleAddWeek = async () => {
    if (!newWeekTitle.trim() || !id) return;
    setSavingWeek(true);
    try {
      const { week } = await api.post<{ week: Week }>('/curriculum/weeks', {
        courseId: id,
        title: newWeekTitle.trim(),
        weekNumber: weeks.length + 1,
      });
      setWeeks((prev) => [...prev, week]);
      setExpandedWeeks((prev) => new Set([...prev, week.id]));
      setNewWeekTitle('');
      setAddingWeek(false);
    } finally {
      setSavingWeek(false);
    }
  };

  const handleDeleteWeek = async (weekId: string) => {
    if (!confirm('Delete this week and all its topics?')) return;
    await api.delete(`/curriculum/weeks/${weekId}`);
    setWeeks((prev) => prev.filter((w) => w.id !== weekId));
    if (selectedTopic?.weekId === weekId) setSelectedTopic(null);
  };

  const handleRenameWeek = async (weekId: string, title: string) => {
    await api.patch(`/curriculum/weeks/${weekId}`, { title });
    setWeeks((prev) => prev.map((w) => w.id === weekId ? { ...w, title } : w));
  };

  const handleAddTopic = async (weekId: string) => {
    if (!newTopicTitle.trim()) return;
    setSavingTopic(true);
    try {
      const week = weeks.find((w) => w.id === weekId);
      const { topic } = await api.post<{ topic: Topic }>('/curriculum/topics', {
        weekId,
        title: newTopicTitle.trim(),
        type: newTopicType,
        order: week?.topics.length ?? 0,
      });
      setWeeks((prev) => prev.map((w) =>
        w.id === weekId ? { ...w, topics: [...w.topics, topic] } : w
      ));
      setNewTopicTitle('');
      setAddingTopicFor(null);
      setSelectedTopic(topic);
    } finally {
      setSavingTopic(false);
    }
  };

  const handleDeleteTopic = async (weekId: string, topicId: string) => {
    if (!confirm('Delete this topic?')) return;
    await api.delete(`/curriculum/topics/${topicId}`);
    setWeeks((prev) => prev.map((w) =>
      w.id === weekId ? { ...w, topics: w.topics.filter((t) => t.id !== topicId) } : w
    ));
    if (selectedTopic?.id === topicId) setSelectedTopic(null);
  };

  const handleTopicUpdate = (updated: Topic) => {
    setSelectedTopic(updated);
    setWeeks((prev) => prev.map((w) =>
      w.id === updated.weekId
        ? { ...w, topics: w.topics.map((t) => t.id === updated.id ? updated : t) }
        : w
    ));
  };

  // ── Loading / Error ────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex flex-col items-center gap-3 py-20">
        <AlertCircle className="w-10 h-10 text-red-400" />
        <p className="text-muted-foreground">{error || 'Course not found'}</p>
        <Link to="/teacher/courses" className="text-sm text-[#023064] hover:underline">← Back to Courses</Link>
      </div>
    );
  }

  const totalTopics = weeks.reduce((sum, w) => sum + w.topics.length, 0);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-7xl flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-start gap-4">
        <Link
          to="/teacher/courses"
          className="mt-0.5 w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-[#023064] hover:border-[#023064] transition-all shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="font-heading text-xl font-bold text-foreground leading-tight">{course.title}</h1>
            <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold shrink-0 ${
              course.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-600' :
              course.status === 'DRAFT'     ? 'bg-amber-50 text-amber-600' :
              'bg-slate-100 text-muted-foreground'
            }`}>
              {course.status.charAt(0) + course.status.slice(1).toLowerCase()}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {course._count.enrollments} students</span>
            <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {weeks.length} week{weeks.length !== 1 ? 's' : ''} · {totalTopics} topic{totalTopics !== 1 ? 's' : ''}</span>
            {course.duration && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.duration}</span>}
            {course.category && <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> {course.category}</span>}
          </div>
        </div>
      </div>

      {/* Body: sidebar + editor */}
      <div className="grid lg:grid-cols-[340px_1fr] gap-5 items-start">

        {/* Left: Weeks & Topics */}
        <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Course Content</span>
            <button
              onClick={() => setAddingWeek(true)}
              className="flex items-center gap-1 text-xs font-semibold text-[#023064] hover:text-[#012550] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Week
            </button>
          </div>

          {/* Add week input */}
          {addingWeek && (
            <div className="px-4 py-3 border-b border-slate-100 bg-blue-50/40">
              <input
                autoFocus
                value={newWeekTitle}
                onChange={(e) => setNewWeekTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddWeek(); if (e.key === 'Escape') { setAddingWeek(false); setNewWeekTitle(''); } }}
                className="w-full text-sm border border-blue-300 rounded-lg px-3 py-1.5 outline-none focus:border-blue-500 bg-card mb-2"
                placeholder="Week title…"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddWeek}
                  disabled={savingWeek || !newWeekTitle.trim()}
                  className="flex-1 py-1.5 text-xs font-semibold bg-[#023064] text-white rounded-lg disabled:opacity-60 hover:bg-[#012550] transition-all"
                >
                  {savingWeek ? 'Saving…' : 'Add Week'}
                </button>
                <button
                  onClick={() => { setAddingWeek(false); setNewWeekTitle(''); }}
                  className="px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground rounded-lg border border-border hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Empty state */}
          {weeks.length === 0 && !addingWeek && (
            <div className="py-12 flex flex-col items-center text-center px-6">
              <BookOpen className="w-8 h-8 text-slate-200 mb-3" />
              <p className="text-sm font-medium text-muted-foreground mb-1">No weeks yet</p>
              <p className="text-xs text-muted-foreground">Click "Add Week" to start building your course</p>
            </div>
          )}

          {/* Weeks list */}
          <div className="divide-y divide-slate-50">
            {weeks.map((week, wIdx) => {
              const expanded = expandedWeeks.has(week.id);
              return (
                <div key={week.id}>
                  {/* Week header */}
                  <div className="flex items-center gap-2 px-4 py-3 group hover:bg-slate-50/60 transition-colors">
                    <GripVertical className="w-3.5 h-3.5 text-slate-200 group-hover:text-slate-300 shrink-0 cursor-grab" />
                    <button onClick={() => toggleWeek(week.id)} className="shrink-0 text-muted-foreground">
                      {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <InlineEdit
                        value={week.title}
                        onSave={(v) => handleRenameWeek(week.id, v)}
                        className="text-sm font-semibold text-foreground"
                      />
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Week {wIdx + 1} · {week.topics.length} topic{week.topics.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteWeek(week.id)}
                      className="shrink-0 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Topics */}
                  {expanded && (
                    <div className="pb-2">
                      {week.topics.map((topic) => (
                        <button
                          key={topic.id}
                          onClick={() => setSelectedTopic(selectedTopic?.id === topic.id ? null : topic)}
                          className={`w-full flex items-center gap-2.5 px-5 py-2.5 text-left group hover:bg-slate-50 transition-colors ${
                            selectedTopic?.id === topic.id ? 'bg-blue-50/60' : ''
                          }`}
                        >
                          <div className="shrink-0">{getTopicIcon(topic.type)}</div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-medium truncate ${selectedTopic?.id === topic.id ? 'text-[#023064]' : 'text-foreground'}`}>
                              {topic.title}
                            </p>
                            {topic.duration && (
                              <p className="text-[10px] text-muted-foreground">{topic.duration}</p>
                            )}
                          </div>
                          <div className="shrink-0 flex items-center gap-1.5 opacity-0 group-hover:opacity-100">
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedTopic(topic); }}
                              className="text-slate-300 hover:text-[#023064] transition-colors"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDeleteTopic(week.id, topic.id); }}
                              className="text-slate-300 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </button>
                      ))}

                      {/* Add topic */}
                      {addingTopicFor === week.id ? (
                        <div className="px-5 py-3">
                          <input
                            autoFocus
                            value={newTopicTitle}
                            onChange={(e) => setNewTopicTitle(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleAddTopic(week.id); if (e.key === 'Escape') { setAddingTopicFor(null); setNewTopicTitle(''); } }}
                            className="w-full text-xs border border-blue-300 rounded-lg px-2.5 py-1.5 outline-none focus:border-blue-500 mb-2"
                            placeholder="Topic title…"
                          />
                          <div className="flex flex-wrap gap-1 mb-2">
                            {TOPIC_TYPES.map((t) => {
                              const Icon = t.icon;
                              return (
                                <button
                                  key={t.value}
                                  onClick={() => setNewTopicType(t.value)}
                                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium border transition-all ${
                                    newTopicType === t.value ? 'border-[#023064] bg-[#023064]/5 text-[#023064]' : 'border-border text-muted-foreground hover:border-slate-300'
                                  }`}
                                >
                                  <Icon className="w-2.5 h-2.5" /> {t.label}
                                </button>
                              );
                            })}
                          </div>
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleAddTopic(week.id)}
                              disabled={savingTopic || !newTopicTitle.trim()}
                              className="flex-1 py-1.5 text-[11px] font-semibold bg-[#023064] text-white rounded-md disabled:opacity-60"
                            >
                              {savingTopic ? 'Adding…' : 'Add Topic'}
                            </button>
                            <button
                              onClick={() => { setAddingTopicFor(null); setNewTopicTitle(''); }}
                              className="px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground rounded-md border border-border hover:bg-slate-50"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setAddingTopicFor(week.id); setNewTopicTitle(''); setNewTopicType('lecture'); }}
                          className="w-full flex items-center gap-2 px-5 py-2 text-xs font-medium text-muted-foreground hover:text-[#023064] hover:bg-blue-50/40 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Topic
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Topic editor or empty state */}
        <div className="bg-card rounded-2xl shadow-sm min-h-[500px] flex flex-col overflow-hidden">
          {selectedTopic ? (
            <TopicEditorPanel
              key={selectedTopic.id}
              topic={selectedTopic}
              onUpdate={handleTopicUpdate}
              onClose={() => setSelectedTopic(null)}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
                <Edit3 className="w-7 h-7 text-slate-200" />
              </div>
              <p className="font-heading font-semibold text-foreground mb-1">Select a topic to edit</p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Click any topic on the left to edit its title, type, files, and details. Or add new weeks and topics.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
