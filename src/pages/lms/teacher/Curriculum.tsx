import { useState, useEffect, useCallback, useRef } from 'react';
import {
  BookOpen, Plus, Trash2, ChevronDown, ChevronUp,
  Pencil, Check, X, Clock, Video, FileText,
  ClipboardList, Presentation, Loader2, GraduationCap, Link2,
  Paperclip, UploadCloud, Calendar, Globe, ShieldCheck, Network, Database, Brain,
} from 'lucide-react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Topic {
  id: string;
  title: string;
  description: string | null;
  duration: string | null;
  type: string;
  order: number;
  meetLink: string | null;
  meetScheduledAt: string | null;
  attachmentUrl: string | null;
  attachmentName: string | null;
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
  category: string | null;
  _count?: { sections: number };
}

type TopicForm = {
  title: string; description: string; duration: string; type: string;
  meetLink: string; attachmentUrl: string; attachmentName: string;
  dueDate: string; maxScore: number;
};

const EMPTY_FORM: TopicForm = {
  title: '', description: '', duration: '', type: 'lecture',
  meetLink: '', attachmentUrl: '', attachmentName: '', dueDate: '', maxScore: 100,
};

// ── Constants ─────────────────────────────────────────────────────────────────

const TOPIC_TYPES = [
  { value: 'lecture',    label: 'Lecture',      icon: Presentation },
  { value: 'lab',        label: 'Lab',          icon: BookOpen     },
  { value: 'video',      label: 'Video',        icon: Video        },
  { value: 'document',   label: 'Document',     icon: Paperclip    },
  { value: 'quiz',       label: 'Quiz',         icon: ClipboardList },
  { value: 'assignment', label: 'Assignment',   icon: FileText     },
];

const TYPE_COLORS: Record<string, string> = {
  lecture:    'bg-blue-50 text-blue-700 border-blue-100',
  lab:        'bg-teal-50 text-teal-700 border-teal-100',
  video:      'bg-rose-50 text-rose-700 border-rose-100',
  document:   'bg-purple-50 text-purple-700 border-purple-100',
  quiz:       'bg-amber-50 text-amber-700 border-amber-100',
  assignment: 'bg-violet-50 text-violet-700 border-violet-100',
};

const CATEGORY_CONFIG: Record<string, { gradient: string; Icon: React.ElementType }> = {
  'Web Development': { gradient: 'from-blue-500 to-indigo-600',   Icon: Globe       },
  Cybersecurity:     { gradient: 'from-red-500 to-rose-600',      Icon: ShieldCheck },
  Networking:        { gradient: 'from-teal-500 to-cyan-600',     Icon: Network     },
  Data:              { gradient: 'from-violet-500 to-purple-600', Icon: Database    },
  AI:                { gradient: 'from-amber-500 to-orange-600',  Icon: Brain       },
};

function getCategoryConfig(cat: string | null) {
  return CATEGORY_CONFIG[cat ?? ''] ?? { gradient: 'from-[#102a83] to-blue-700', Icon: BookOpen };
}

// ── Helper components ─────────────────────────────────────────────────────────

function TopicBadge({ type }: { type: string }) {
  const cfg = TOPIC_TYPES.find(t => t.value === type) ?? TOPIC_TYPES[0];
  const Icon = cfg.icon;
  return (
    <span className={cn('inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border', TYPE_COLORS[type] ?? TYPE_COLORS.lecture)}>
      <Icon className="w-2.5 h-2.5" /> {cfg.label}
    </span>
  );
}

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

// ── File upload field ─────────────────────────────────────────────────────────

function FileUploadField({
  url, name, onChange,
}: {
  url: string; name: string;
  onChange: (url: string, name: string) => void;
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
        <button
          type="button"
          onClick={() => onChange('', '')}
          className="text-muted-foreground hover:text-primary-red transition-colors"
        >
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
        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border-2 border-dashed border-border hover:border-primary-blue/40 transition-all text-xs font-semibold text-muted-foreground hover:text-primary-blue disabled:opacity-50"
      >
        {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
        {uploading ? 'Uploading…' : 'Attach document'}
      </button>
      {error && <p className="text-xs text-primary-red mt-1">{error}</p>}
    </div>
  );
}

// ── Topic form fields ─────────────────────────────────────────────────────────

function TopicFormFields({
  form, setForm, onSave, onCancel, saving, saveLabel = 'Add',
}: {
  form: TopicForm;
  setForm: React.Dispatch<React.SetStateAction<TopicForm>>;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  saveLabel?: string;
}) {
  const set = (k: keyof TopicForm, v: string | number) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          autoFocus
          value={form.title}
          onChange={e => set('title', e.target.value)}
          placeholder="Title *"
          className="px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground outline-none focus:border-primary-blue"
        />
        <input
          value={form.duration}
          onChange={e => set('duration', e.target.value)}
          placeholder="Duration (e.g. 45 min)"
          className="px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground outline-none focus:border-primary-blue"
        />
      </div>

      <input
        value={form.description}
        onChange={e => set('description', e.target.value)}
        placeholder="Description (optional)"
        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground outline-none focus:border-primary-blue"
      />

      {/* Meet link for lecture/lab */}
      {(form.type === 'lecture' || form.type === 'lab') && (
        <div className="flex items-center gap-2">
          <Link2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <input
            value={form.meetLink}
            onChange={e => set('meetLink', e.target.value)}
            placeholder="Google Meet link (optional)"
            className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground outline-none focus:border-primary-blue"
          />
        </div>
      )}

      {/* File uploader for document type */}
      {form.type === 'document' && (
        <FileUploadField
          url={form.attachmentUrl}
          name={form.attachmentName}
          onChange={(url, name) => setForm(f => ({ ...f, attachmentUrl: url, attachmentName: name }))}
        />
      )}

      {/* Assignment extra fields */}
      {form.type === 'assignment' && (
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <input
              type="datetime-local"
              value={form.dueDate}
              onChange={e => set('dueDate', e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground outline-none focus:border-primary-blue"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground shrink-0">Max score</span>
            <input
              type="number"
              min={1}
              value={form.maxScore}
              onChange={e => set('maxScore', parseInt(e.target.value) || 100)}
              className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground outline-none focus:border-primary-blue"
            />
          </div>
        </div>
      )}

      {/* Type selector */}
      <div className="flex items-center gap-2 flex-wrap">
        {TOPIC_TYPES.map(t => (
          <button
            key={t.value}
            type="button"
            onClick={() => set('type', t.value)}
            className={cn(
              'flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all',
              form.type === t.value
                ? 'bg-primary-blue text-white border-primary-blue'
                : 'border-border text-muted-foreground hover:border-primary-blue/40',
            )}
          >
            <t.icon className="w-3 h-3" /> {t.label}
          </button>
        ))}

        <div className="ml-auto flex gap-2">
          <button
            onClick={onSave}
            disabled={saving || !form.title.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-blue text-white text-xs font-bold rounded-lg hover:bg-blue-900 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
            {saveLabel}
          </button>
          <button
            onClick={onCancel}
            className="px-3 py-1.5 border border-border text-xs rounded-lg text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function CurriculumPage() {
  const [courses, setCourses]         = useState<Course[]>([]);
  const [selectedCourse, setSelected] = useState<string>('');
  const [weeks, setWeeks]             = useState<Week[]>([]);
  const [loading, setLoading]         = useState(false);
  const [expanded, setExpanded]       = useState<Set<string>>(new Set());

  // Add week
  const [addingWeek, setAddingWeek]   = useState(false);
  const [weekTitle, setWeekTitle]     = useState('');
  const [savingWeek, setSavingWeek]   = useState(false);

  // Edit week
  const [editWeekId, setEditWeekId]         = useState<string | null>(null);
  const [editWeekTitle, setEditWeekTitle]   = useState('');

  // Add topic
  const [addingTopicWeekId, setAddingTopicWeekId] = useState<string | null>(null);
  const [topicForm, setTopicForm]                 = useState<TopicForm>(EMPTY_FORM);
  const [savingTopic, setSavingTopic]             = useState(false);

  // Edit topic
  const [editTopicId, setEditTopicId]     = useState<string | null>(null);
  const [editTopicForm, setEditTopicForm] = useState<TopicForm>(EMPTY_FORM);
  const [savingEdit, setSavingEdit]       = useState(false);

  // Recent activity feed
  type ActivityEntry = { id: number; text: string; time: Date };
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const activityIdRef = useRef(0);
  const logActivity = (text: string) => {
    const id = ++activityIdRef.current;
    setActivity(prev => [{ id, text, time: new Date() }, ...prev].slice(0, 20));
  };

  // Load courses
  useEffect(() => {
    api.get<{ courses: Course[] }>('/courses/my')
      .then(d => {
        setCourses(d.courses ?? []);
        if (d.courses?.length) setSelected(d.courses[0].id);
      })
      .catch(() => {});
  }, []);

  // Load curriculum
  const loadCurriculum = useCallback(() => {
    if (!selectedCourse) return;
    setLoading(true);
    api.get<{ weeks: Week[] }>(`/curriculum?courseId=${selectedCourse}`)
      .then(d => {
        setWeeks(d.weeks ?? []);
        setExpanded(new Set((d.weeks ?? []).map((w: Week) => w.id)));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedCourse]);

  useEffect(() => { loadCurriculum(); }, [loadCurriculum]);

  // ── Week actions ──────────────────────────────────────────────────────────

  const addWeek = async () => {
    if (!weekTitle.trim()) return;
    setSavingWeek(true);
    try {
      const next = (weeks.at(-1)?.weekNumber ?? 0) + 1;
      const res = await api.post<{ week: Week }>('/curriculum/weeks', {
        courseId: selectedCourse, weekNumber: next, title: weekTitle.trim(),
      });
      setWeeks(w => [...w, res.week]);
      setExpanded(e => new Set([...e, res.week.id]));
      logActivity(`Added week "${res.week.title}"`);
      setWeekTitle(''); setAddingWeek(false);
    } catch { /* noop */ } finally { setSavingWeek(false); }
  };

  const saveEditWeek = async (id: string) => {
    if (!editWeekTitle.trim()) return;
    try {
      const res = await api.patch<{ week: Week }>(`/curriculum/weeks/${id}`, { title: editWeekTitle });
      setWeeks(w => w.map(x => x.id === id ? res.week : x));
      logActivity(`Renamed week to "${res.week.title}"`);
      setEditWeekId(null);
    } catch { /* noop */ }
  };

  const deleteWeek = async (id: string) => {
    const week = weeks.find(w => w.id === id);
    if (!confirm('Delete this week and all its topics?')) return;
    try {
      await api.delete(`/curriculum/weeks/${id}`);
      setWeeks(w => w.filter(x => x.id !== id));
      if (week) logActivity(`Deleted week "${week.title}"`);
    } catch { /* noop */ }
  };

  // ── Topic actions ─────────────────────────────────────────────────────────

  const addTopic = async (weekId: string) => {
    if (!topicForm.title.trim()) return;
    setSavingTopic(true);
    try {
      const res = await api.post<{ topic: Topic }>('/curriculum/topics', {
        weekId,
        title:         topicForm.title,
        description:   topicForm.description || undefined,
        duration:      topicForm.duration    || undefined,
        type:          topicForm.type,
        meetLink:      topicForm.meetLink    || undefined,
        attachmentUrl: topicForm.attachmentUrl || undefined,
        attachmentName: topicForm.attachmentName || undefined,
        dueDate:       topicForm.dueDate     || undefined,
        maxScore:      topicForm.type === 'assignment' ? topicForm.maxScore : undefined,
      });
      setWeeks(w => w.map(x => x.id === weekId ? { ...x, topics: [...x.topics, res.topic] } : x));
      const weekTitle = weeks.find(w => w.id === weekId)?.title ?? '';
      logActivity(`Added "${res.topic.title}" (${res.topic.type}) to ${weekTitle}`);
      setTopicForm(EMPTY_FORM);
      setAddingTopicWeekId(null);
    } catch { /* noop */ } finally { setSavingTopic(false); }
  };

  const saveEditTopic = async (topicId: string, weekId: string) => {
    if (!editTopicForm.title.trim()) return;
    setSavingEdit(true);
    try {
      const res = await api.patch<{ topic: Topic }>(`/curriculum/topics/${topicId}`, {
        title:         editTopicForm.title,
        description:   editTopicForm.description || undefined,
        duration:      editTopicForm.duration    || undefined,
        type:          editTopicForm.type,
        meetLink:      editTopicForm.meetLink    || null,
        attachmentUrl: editTopicForm.attachmentUrl || null,
        attachmentName: editTopicForm.attachmentName || null,
        dueDate:       editTopicForm.dueDate     || null,
        maxScore:      editTopicForm.type === 'assignment' ? editTopicForm.maxScore : undefined,
      });
      setWeeks(w => w.map(x => x.id === weekId
        ? { ...x, topics: x.topics.map(t => t.id === topicId ? res.topic : t) }
        : x,
      ));
      logActivity(`Updated "${res.topic.title}"`);
      setEditTopicId(null);
    } catch { /* noop */ } finally { setSavingEdit(false); }
  };

  const deleteTopic = async (topicId: string, weekId: string) => {
    const topic = weeks.find(w => w.id === weekId)?.topics.find(t => t.id === topicId);
    try {
      await api.delete(`/curriculum/topics/${topicId}`);
      setWeeks(w => w.map(x => x.id === weekId
        ? { ...x, topics: x.topics.filter(t => t.id !== topicId) }
        : x,
      ));
      if (topic) logActivity(`Removed "${topic.title}"`);
    } catch { /* noop */ }
  };

  const moveTopic = async (topic: Topic, weekId: string, dir: 'up' | 'down') => {
    const week = weeks.find(w => w.id === weekId);
    if (!week) return;
    const idx     = week.topics.findIndex(t => t.id === topic.id);
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= week.topics.length) return;
    const updated = [...week.topics];
    [updated[idx], updated[swapIdx]] = [updated[swapIdx], updated[idx]];
    await Promise.all([
      api.patch(`/curriculum/topics/${updated[idx].id}`,    { order: idx }),
      api.patch(`/curriculum/topics/${updated[swapIdx].id}`, { order: swapIdx }),
    ]).catch(() => {});
    setWeeks(w => w.map(x => x.id === weekId
      ? { ...x, topics: updated.map((t, i) => ({ ...t, order: i })) }
      : x,
    ));
  };

  const selectedCourseObj = courses.find(c => c.id === selectedCourse);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col lg:flex-row gap-5 max-w-6xl pb-10 h-full">

      {/* ── Left: Course list ─────────────────────────────────────────────── */}
      <div className="lg:w-64 shrink-0 space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1 mb-3">Your Courses</h2>

        {courses.length === 0 && (
          <div className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center text-center">
            <GraduationCap className="w-8 h-8 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No courses assigned yet</p>
          </div>
        )}

        {/* Mobile: horizontal scroll */}
        <div className="flex lg:flex-col gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-hide">
          {courses.map(course => {
            const { gradient, Icon } = getCategoryConfig(course.category);
            const active = course.id === selectedCourse;
            return (
              <button
                key={course.id}
                onClick={() => { setSelected(course.id); setAddingWeek(false); setAddingTopicWeekId(null); setEditTopicId(null); }}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all shrink-0 lg:shrink w-60 lg:w-full',
                  active
                    ? 'bg-primary-blue/5 border-primary-blue/30 text-primary-blue'
                    : 'bg-card border-border hover:bg-muted/50',
                )}
              >
                <div className={cn('w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0', gradient)}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={cn('text-sm font-semibold truncate', active ? 'text-primary-blue' : 'text-foreground')}>
                    {course.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {course.category ?? 'General'}
                  </p>
                </div>
                {active && <div className="w-1.5 h-1.5 rounded-full bg-primary-blue shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Recent Activity */}
        {activity.length > 0 && (
          <div className="mt-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1 mb-2">Recent Activity</h2>
            <div className="space-y-1.5">
              {activity.map(entry => (
                <div key={entry.id} className="flex items-start gap-2 px-3 py-2 rounded-xl bg-card border border-border">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-blue mt-1.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-foreground leading-snug">{entry.text}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {entry.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Right: Curriculum editor ──────────────────────────────────────── */}
      <div className="flex-1 min-w-0 space-y-4">

        {/* Header */}
        <div>
          <h1 className="font-heading text-xl font-bold text-foreground">Curriculum Builder</h1>
          {selectedCourseObj && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {selectedCourseObj.title} — {weeks.length} week{weeks.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* No course selected */}
        {!selectedCourse && courses.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-16 flex flex-col items-center text-center">
            <BookOpen className="w-10 h-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">Select a course on the left to manage its curriculum</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center gap-3 justify-center py-16 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading…
          </div>
        )}

        {!loading && selectedCourse && (
          <>
            {/* Weeks */}
            <div className="space-y-4">
              {weeks.map((week) => {
                const isOpen = expanded.has(week.id);
                return (
                  <div key={week.id} className="bg-card border border-border rounded-2xl overflow-hidden">

                    {/* Week header */}
                    <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-muted/30">
                      <div className="w-8 h-8 rounded-xl bg-primary-blue flex items-center justify-center shrink-0 text-xs font-bold text-white">
                        {week.weekNumber}
                      </div>

                      {editWeekId === week.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            autoFocus
                            value={editWeekTitle}
                            onChange={e => setEditWeekTitle(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') saveEditWeek(week.id); if (e.key === 'Escape') setEditWeekId(null); }}
                            className="flex-1 px-3 py-1.5 rounded-lg border border-border bg-background text-sm text-foreground outline-none focus:border-primary-blue"
                          />
                          <button onClick={() => saveEditWeek(week.id)} className="p-1.5 rounded-lg bg-primary-blue text-white hover:bg-blue-900"><Check className="w-3.5 h-3.5" /></button>
                          <button onClick={() => setEditWeekId(null)} className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground"><X className="w-3.5 h-3.5" /></button>
                        </div>
                      ) : (
                        <div className="flex-1 min-w-0">
                          <p className="font-heading font-semibold text-foreground text-sm">{week.title}</p>
                          <p className="text-xs text-muted-foreground">{week.topics.length} topic{week.topics.length !== 1 ? 's' : ''}</p>
                        </div>
                      )}

                      {editWeekId !== week.id && (
                        <div className="flex items-center gap-1 shrink-0">
                          <button onClick={() => { setEditWeekId(week.id); setEditWeekTitle(week.title); }}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => deleteWeek(week.id)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-primary-red hover:bg-red-50 transition-all">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setExpanded(e => { const n = new Set(e); isOpen ? n.delete(week.id) : n.add(week.id); return n; })}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
                            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Topics */}
                    {isOpen && (
                      <div className="divide-y divide-border">
                        {week.topics.length === 0 && addingTopicWeekId !== week.id && (
                          <p className="px-5 py-4 text-sm text-muted-foreground italic">No topics yet. Add one below.</p>
                        )}

                        {week.topics.map((topic, ti) => (
                          <div key={topic.id} className="px-5 py-3">
                            {editTopicId === topic.id ? (
                              <div className="space-y-3 py-1">
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Edit Topic</p>
                                <TopicFormFields
                                  form={editTopicForm}
                                  setForm={setEditTopicForm}
                                  onSave={() => saveEditTopic(topic.id, week.id)}
                                  onCancel={() => setEditTopicId(null)}
                                  saving={savingEdit}
                                  saveLabel="Save"
                                />
                              </div>
                            ) : (
                              <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-lg bg-muted flex items-center justify-center shrink-0 text-[10px] font-bold text-muted-foreground mt-0.5">
                                  {ti + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <p className="font-medium text-sm text-foreground">{topic.title}</p>
                                    <TopicBadge type={topic.type} />
                                    {topic.duration && (
                                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                        <Clock className="w-2.5 h-2.5" />{topic.duration}
                                      </span>
                                    )}
                                    {topic.dueDate && (
                                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                        <Calendar className="w-2.5 h-2.5" />
                                        Due {new Date(topic.dueDate).toLocaleDateString('en-UG', { day: 'numeric', month: 'short' })}
                                      </span>
                                    )}
                                    {topic.meetLink && (
                                      <a href={topic.meetLink} target="_blank" rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors">
                                        <Link2 className="w-2.5 h-2.5" /> Join Call
                                      </a>
                                    )}
                                    {topic.attachmentUrl && (
                                      <a href={topic.attachmentUrl} target="_blank" rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors">
                                        <Paperclip className="w-2.5 h-2.5" /> {topic.attachmentName ?? 'File'}
                                      </a>
                                    )}
                                    {topic.assignmentId && (
                                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                                        Synced to Assignments
                                      </span>
                                    )}
                                  </div>
                                  {topic.description && (
                                    <p className="text-xs text-muted-foreground mt-0.5">{topic.description}</p>
                                  )}
                                  {topic.maxScore && (
                                    <p className="text-[11px] text-muted-foreground mt-0.5">Max score: {topic.maxScore}</p>
                                  )}
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                  <button onClick={() => moveTopic(topic, week.id, 'up')} disabled={ti === 0}
                                    className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none">
                                    <ChevronUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button onClick={() => moveTopic(topic, week.id, 'down')} disabled={ti === week.topics.length - 1}
                                    className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none">
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEditTopicId(topic.id);
                                      setEditTopicForm({
                                        title:          topic.title,
                                        description:    topic.description ?? '',
                                        duration:       topic.duration ?? '',
                                        type:           topic.type,
                                        meetLink:       topic.meetLink ?? '',
                                        attachmentUrl:  topic.attachmentUrl ?? '',
                                        attachmentName: topic.attachmentName ?? '',
                                        dueDate:        topic.dueDate ? topic.dueDate.slice(0, 16) : '',
                                        maxScore:       topic.maxScore ?? 100,
                                      });
                                    }}
                                    className="p-1 rounded text-muted-foreground hover:text-foreground transition-all">
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                  <button onClick={() => deleteTopic(topic.id, week.id)}
                                    className="p-1 rounded text-muted-foreground hover:text-primary-red transition-all">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}

                        {/* Add topic form */}
                        {addingTopicWeekId === week.id ? (
                          <div className="px-5 py-4 bg-muted/20 space-y-3">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">New Topic</p>
                            <TopicFormFields
                              form={topicForm}
                              setForm={setTopicForm}
                              onSave={() => addTopic(week.id)}
                              onCancel={() => { setAddingTopicWeekId(null); setTopicForm(EMPTY_FORM); }}
                              saving={savingTopic}
                              saveLabel="Add"
                            />
                          </div>
                        ) : (
                          <div className="px-5 py-3">
                            <button
                              onClick={() => { setAddingTopicWeekId(week.id); setTopicForm(EMPTY_FORM); }}
                              className="flex items-center gap-1.5 text-xs font-semibold text-primary-blue hover:text-blue-900 transition-all"
                            >
                              <Plus className="w-3.5 h-3.5" /> Add Topic
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add week */}
            {addingWeek ? (
              <div className="bg-card border border-dashed border-primary-blue/40 rounded-2xl p-5 space-y-3">
                <p className="text-sm font-semibold text-foreground">Week {(weeks.at(-1)?.weekNumber ?? 0) + 1}</p>
                <input
                  autoFocus
                  value={weekTitle}
                  onChange={e => setWeekTitle(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') addWeek(); if (e.key === 'Escape') { setAddingWeek(false); setWeekTitle(''); } }}
                  placeholder="e.g. Introduction to HTML & CSS"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground outline-none focus:border-primary-blue"
                />
                <div className="flex gap-2">
                  <button onClick={addWeek} disabled={savingWeek || !weekTitle.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-blue text-white text-sm font-bold rounded-xl hover:bg-blue-900 disabled:opacity-50">
                    {savingWeek ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Save Week
                  </button>
                  <button onClick={() => { setAddingWeek(false); setWeekTitle(''); }}
                    className="px-4 py-2 border border-border text-sm rounded-xl text-muted-foreground hover:text-foreground">Cancel</button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setAddingWeek(true)}
                className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-border rounded-2xl text-sm font-semibold text-muted-foreground hover:border-primary-blue/40 hover:text-primary-blue transition-all"
              >
                <Plus className="w-4 h-4" /> Add Week
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
