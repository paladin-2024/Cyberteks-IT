import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Plus, Trash2, Edit3, Save, X, ChevronDown, ChevronRight,
  Video, FileText, ClipboardList, BookOpen, Users, Clock, Tag,
  GripVertical, Check, AlertCircle, Loader2,
} from 'lucide-react';
import { api } from '@/lib/api';

// ── Types ─────────────────────────────────────────────────────────────────────

type LessonType = 'VIDEO' | 'DOCUMENT' | 'QUIZ' | 'ASSIGNMENT' | 'LIVE_SESSION';

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  type: LessonType;
  content: string | null;
  duration: number | null;
  order: number;
  isFree: boolean;
  sectionId: string;
}

interface Section {
  id: string;
  title: string;
  order: number;
  courseId: string;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  category: string | null;
  level: string | null;
  duration: string | null;
  status: string;
  coverImage: string | null;
  _count: { enrollments: number; sections: number };
  teacher: { id: string; name: string };
  sections: Section[];
}

// ── Lesson type meta ──────────────────────────────────────────────────────────

const LESSON_TYPES: { value: LessonType; label: string; icon: React.ElementType; color: string }[] = [
  { value: 'VIDEO',        label: 'Video',       icon: Video,       color: 'text-blue-500' },
  { value: 'DOCUMENT',     label: 'Document',    icon: FileText,    color: 'text-emerald-500' },
  { value: 'QUIZ',         label: 'Quiz',        icon: ClipboardList, color: 'text-purple-500' },
  { value: 'ASSIGNMENT',   label: 'Assignment',  icon: BookOpen,    color: 'text-amber-500' },
  { value: 'LIVE_SESSION', label: 'Live Session',icon: Users,       color: 'text-rose-500' },
];

function getLessonIcon(type: LessonType) {
  const found = LESSON_TYPES.find((t) => t.value === type);
  if (!found) return null;
  const Icon = found.icon;
  return <Icon className={`w-3.5 h-3.5 ${found.color}`} />;
}

// ── Inline editable text ──────────────────────────────────────────────────────

function InlineEdit({
  value,
  onSave,
  className = '',
}: {
  value: string;
  onSave: (v: string) => Promise<void>;
  className?: string;
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
        className={`border border-blue-400 rounded px-2 py-0.5 text-sm outline-none bg-white ${className}`}
      />
      {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" /> : (
        <>
          <button onClick={save} className="text-emerald-600 hover:text-emerald-700"><Check className="w-3.5 h-3.5" /></button>
          <button onClick={cancel} className="text-slate-400 hover:text-slate-600"><X className="w-3.5 h-3.5" /></button>
        </>
      )}
    </span>
  );
}

// ── Lesson Editor Panel ───────────────────────────────────────────────────────

function LessonEditorPanel({
  lesson,
  onUpdate,
  onClose,
}: {
  lesson: Lesson;
  onUpdate: (updated: Lesson) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(lesson.title);
  const [type, setType] = useState<LessonType>(lesson.type);
  const [description, setDescription] = useState(lesson.description ?? '');
  const [content, setContent] = useState(lesson.content ?? '');
  const [duration, setDuration] = useState(lesson.duration?.toString() ?? '');
  const [isFree, setIsFree] = useState(lesson.isFree);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      const { lesson: updated } = await api.patch<{ lesson: Lesson }>(
        `/sections/lessons/${lesson.id}`,
        {
          title: title.trim(),
          type,
          description: description.trim() || null,
          content: content.trim() || null,
          duration: duration ? parseInt(duration) : null,
          isFree,
        }
      );
      onUpdate(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // silently fail — user can retry
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
        <h3 className="font-heading font-semibold text-slate-900 text-sm">Edit Lesson</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Lesson Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-[#023064] focus:ring-1 focus:ring-[#023064]/20"
            placeholder="e.g. Introduction to Networking"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Lesson Type</label>
          <div className="grid grid-cols-2 gap-2">
            {LESSON_TYPES.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.value}
                  onClick={() => setType(t.value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                    type === t.value
                      ? 'border-[#023064] bg-[#023064]/5 text-[#023064]'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
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
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-[#023064] focus:ring-1 focus:ring-[#023064]/20 resize-none"
            placeholder="Brief overview of this lesson…"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">
            {type === 'VIDEO' ? 'Video URL / Embed Code' : type === 'LIVE_SESSION' ? 'Meeting Link' : 'Notes & Content'}
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={type === 'DOCUMENT' || type === 'ASSIGNMENT' ? 8 : 4}
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-[#023064] focus:ring-1 focus:ring-[#023064]/20 resize-none font-mono"
            placeholder={
              type === 'VIDEO' ? 'https://youtube.com/watch?v=...' :
              type === 'LIVE_SESSION' ? 'https://meet.google.com/...' :
              'Write your notes, instructions, or content here…'
            }
          />
        </div>

        {/* Duration + Free */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Duration (minutes)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-[#023064]"
              placeholder="30"
              min={0}
            />
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => setIsFree(!isFree)}
                className={`w-9 h-5 rounded-full transition-all relative ${isFree ? 'bg-emerald-500' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${isFree ? 'left-4' : 'left-0.5'}`} />
              </div>
              <span className="text-xs font-medium text-slate-600">Free preview</span>
            </label>
          </div>
        </div>
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

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function TeacherCourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // UI state
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  // Add section form
  const [addingSection, setAddingSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [savingSection, setSavingSection] = useState(false);

  // Add lesson form
  const [addingLessonFor, setAddingLessonFor] = useState<string | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonType, setNewLessonType] = useState<LessonType>('VIDEO');
  const [savingLesson, setSavingLesson] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.get<{ course: Course }>(`/courses/${id}`)
      .then(({ course }) => {
        setCourse(course);
        if (course.sections.length > 0) {
          setExpandedSections(new Set([course.sections[0].id]));
        }
      })
      .catch(() => setError('Failed to load course'))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId); else next.add(sectionId);
      return next;
    });
  };

  const handleAddSection = async () => {
    if (!newSectionTitle.trim() || !course) return;
    setSavingSection(true);
    try {
      const { section } = await api.post<{ section: Section }>('/sections', {
        courseId: course.id,
        title: newSectionTitle.trim(),
        order: course.sections.length,
      });
      setCourse((prev) => prev ? { ...prev, sections: [...prev.sections, section] } : prev);
      setExpandedSections((prev) => new Set([...prev, section.id]));
      setNewSectionTitle('');
      setAddingSection(false);
    } finally {
      setSavingSection(false);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm('Delete this section and all its lessons?')) return;
    await api.delete(`/sections/${sectionId}`);
    setCourse((prev) => prev ? { ...prev, sections: prev.sections.filter((s) => s.id !== sectionId) } : prev);
    if (selectedLesson?.sectionId === sectionId) setSelectedLesson(null);
  };

  const handleRenameSection = async (sectionId: string, title: string) => {
    await api.patch(`/sections/${sectionId}`, { title });
    setCourse((prev) => prev ? {
      ...prev,
      sections: prev.sections.map((s) => s.id === sectionId ? { ...s, title } : s),
    } : prev);
  };

  const handleAddLesson = async (sectionId: string) => {
    if (!newLessonTitle.trim()) return;
    setSavingLesson(true);
    try {
      const section = course?.sections.find((s) => s.id === sectionId);
      const { lesson } = await api.post<{ lesson: Lesson }>(`/sections/${sectionId}/lessons`, {
        title: newLessonTitle.trim(),
        type: newLessonType,
        order: section?.lessons.length ?? 0,
      });
      setCourse((prev) => prev ? {
        ...prev,
        sections: prev.sections.map((s) =>
          s.id === sectionId ? { ...s, lessons: [...s.lessons, lesson] } : s
        ),
      } : prev);
      setNewLessonTitle('');
      setAddingLessonFor(null);
      setSelectedLesson(lesson);
    } finally {
      setSavingLesson(false);
    }
  };

  const handleDeleteLesson = async (sectionId: string, lessonId: string) => {
    if (!confirm('Delete this lesson?')) return;
    await api.delete(`/sections/lessons/${lessonId}`);
    setCourse((prev) => prev ? {
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId ? { ...s, lessons: s.lessons.filter((l) => l.id !== lessonId) } : s
      ),
    } : prev);
    if (selectedLesson?.id === lessonId) setSelectedLesson(null);
  };

  const handleLessonUpdate = (updated: Lesson) => {
    setSelectedLesson(updated);
    setCourse((prev) => prev ? {
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === updated.sectionId ? {
          ...s,
          lessons: s.lessons.map((l) => l.id === updated.id ? updated : l),
        } : s
      ),
    } : prev);
  };

  // ── Loading / Error ───────────────────────────────────────────────────────

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
        <p className="text-slate-500">{error || 'Course not found'}</p>
        <Link to="/teacher/courses" className="text-sm text-[#023064] hover:underline">← Back to Courses</Link>
      </div>
    );
  }

  const totalLessons = course.sections.reduce((sum, s) => sum + s.lessons.length, 0);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-7xl flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-start gap-4">
        <Link
          to="/teacher/courses"
          className="mt-0.5 w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#023064] hover:border-[#023064] transition-all shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="font-heading text-xl font-bold text-slate-900 leading-tight">{course.title}</h1>
            <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold shrink-0 ${
              course.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-600' :
              course.status === 'DRAFT'     ? 'bg-amber-50 text-amber-600' :
              'bg-slate-100 text-slate-400'
            }`}>
              {course.status.charAt(0) + course.status.slice(1).toLowerCase()}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {course._count.enrollments} students</span>
            <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {course.sections.length} sections · {totalLessons} lessons</span>
            {course.duration && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.duration}</span>}
            {course.category && <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> {course.category}</span>}
          </div>
        </div>
      </div>

      {/* Body — split: sidebar + editor */}
      <div className="grid lg:grid-cols-[340px_1fr] gap-5 items-start">

        {/* Left: Sections & Lessons sidebar */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Course Content</span>
            <button
              onClick={() => setAddingSection(true)}
              className="flex items-center gap-1 text-xs font-semibold text-[#023064] hover:text-[#012550] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Section
            </button>
          </div>

          {/* Add section input */}
          {addingSection && (
            <div className="px-4 py-3 border-b border-slate-100 bg-blue-50/40">
              <input
                autoFocus
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddSection(); if (e.key === 'Escape') { setAddingSection(false); setNewSectionTitle(''); } }}
                className="w-full text-sm border border-blue-300 rounded-lg px-3 py-1.5 outline-none focus:border-blue-500 bg-white mb-2"
                placeholder="Section title…"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddSection}
                  disabled={savingSection || !newSectionTitle.trim()}
                  className="flex-1 py-1.5 text-xs font-semibold bg-[#023064] text-white rounded-lg disabled:opacity-60 hover:bg-[#012550] transition-all"
                >
                  {savingSection ? 'Saving…' : 'Add Section'}
                </button>
                <button
                  onClick={() => { setAddingSection(false); setNewSectionTitle(''); }}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Empty state */}
          {course.sections.length === 0 && !addingSection && (
            <div className="py-12 flex flex-col items-center text-center px-6">
              <BookOpen className="w-8 h-8 text-slate-200 mb-3" />
              <p className="text-sm font-medium text-slate-600 mb-1">No sections yet</p>
              <p className="text-xs text-slate-400">Click "Add Section" to start building your course</p>
            </div>
          )}

          {/* Sections list */}
          <div className="divide-y divide-slate-50">
            {course.sections.map((section, sIdx) => {
              const expanded = expandedSections.has(section.id);
              return (
                <div key={section.id}>
                  {/* Section header */}
                  <div className="flex items-center gap-2 px-4 py-3 group hover:bg-slate-50/60 transition-colors">
                    <GripVertical className="w-3.5 h-3.5 text-slate-200 group-hover:text-slate-300 shrink-0 cursor-grab" />
                    <button onClick={() => toggleSection(section.id)} className="shrink-0 text-slate-400">
                      {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <InlineEdit
                        value={section.title}
                        onSave={(v) => handleRenameSection(section.id, v)}
                        className="text-sm font-semibold text-slate-800"
                      />
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Section {sIdx + 1} · {section.lessons.length} lesson{section.lessons.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteSection(section.id)}
                      className="shrink-0 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Lessons */}
                  {expanded && (
                    <div className="pb-2">
                      {section.lessons.map((lesson) => (
                        <button
                          key={lesson.id}
                          onClick={() => setSelectedLesson(selectedLesson?.id === lesson.id ? null : lesson)}
                          className={`w-full flex items-center gap-2.5 px-5 py-2.5 text-left group hover:bg-slate-50 transition-colors ${
                            selectedLesson?.id === lesson.id ? 'bg-blue-50/60' : ''
                          }`}
                        >
                          <div className="shrink-0">{getLessonIcon(lesson.type)}</div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-medium truncate ${selectedLesson?.id === lesson.id ? 'text-[#023064]' : 'text-slate-700'}`}>
                              {lesson.title}
                            </p>
                            {lesson.duration && (
                              <p className="text-[10px] text-slate-400">{lesson.duration} min</p>
                            )}
                          </div>
                          <div className="shrink-0 flex items-center gap-1.5 opacity-0 group-hover:opacity-100">
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedLesson(lesson); }}
                              className="text-slate-300 hover:text-[#023064] transition-colors"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDeleteLesson(section.id, lesson.id); }}
                              className="text-slate-300 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </button>
                      ))}

                      {/* Add lesson */}
                      {addingLessonFor === section.id ? (
                        <div className="px-5 py-3">
                          <input
                            autoFocus
                            value={newLessonTitle}
                            onChange={(e) => setNewLessonTitle(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleAddLesson(section.id); if (e.key === 'Escape') { setAddingLessonFor(null); setNewLessonTitle(''); } }}
                            className="w-full text-xs border border-blue-300 rounded-lg px-2.5 py-1.5 outline-none focus:border-blue-500 mb-2"
                            placeholder="Lesson title…"
                          />
                          <div className="flex flex-wrap gap-1 mb-2">
                            {LESSON_TYPES.map((t) => {
                              const Icon = t.icon;
                              return (
                                <button
                                  key={t.value}
                                  onClick={() => setNewLessonType(t.value)}
                                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium border transition-all ${
                                    newLessonType === t.value ? 'border-[#023064] bg-[#023064]/5 text-[#023064]' : 'border-slate-200 text-slate-400 hover:border-slate-300'
                                  }`}
                                >
                                  <Icon className="w-2.5 h-2.5" /> {t.label}
                                </button>
                              );
                            })}
                          </div>
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleAddLesson(section.id)}
                              disabled={savingLesson || !newLessonTitle.trim()}
                              className="flex-1 py-1.5 text-[11px] font-semibold bg-[#023064] text-white rounded-md disabled:opacity-60"
                            >
                              {savingLesson ? 'Adding…' : 'Add Lesson'}
                            </button>
                            <button
                              onClick={() => { setAddingLessonFor(null); setNewLessonTitle(''); }}
                              className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-500 rounded-md border border-slate-200 hover:bg-slate-50"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setAddingLessonFor(section.id); setNewLessonTitle(''); setNewLessonType('VIDEO'); }}
                          className="w-full flex items-center gap-2 px-5 py-2 text-xs font-medium text-slate-400 hover:text-[#023064] hover:bg-blue-50/40 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Lesson
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Lesson editor or empty state */}
        <div className="bg-white rounded-2xl shadow-sm min-h-[500px] flex flex-col overflow-hidden">
          {selectedLesson ? (
            <LessonEditorPanel
              key={selectedLesson.id}
              lesson={selectedLesson}
              onUpdate={handleLessonUpdate}
              onClose={() => setSelectedLesson(null)}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
                <Edit3 className="w-7 h-7 text-slate-200" />
              </div>
              <p className="font-heading font-semibold text-slate-700 mb-1">Select a lesson to edit</p>
              <p className="text-sm text-slate-400 max-w-xs">
                Click any lesson on the left to edit its title, type, content, and notes. Or add new sections and lessons.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
