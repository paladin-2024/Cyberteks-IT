import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, BookOpen, Clock, Tag, Users, CheckCircle, Circle,
  Video, FileText, ClipboardList, AlertCircle, Loader2, Lock,
  ChevronDown, ChevronRight, PlayCircle, ExternalLink,
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

interface Enrollment {
  id: string;
  status: string;
  progressPercent: number;
  startedAt: string;
  completedAt: string | null;
}

interface ProgressEntry {
  completed: boolean;
  watchedSecs: number;
}

// ── Lesson type helpers ───────────────────────────────────────────────────────

const LESSON_META: Record<LessonType, { icon: React.ElementType; color: string; label: string }> = {
  VIDEO:        { icon: Video,       color: 'text-blue-500',   label: 'Video' },
  DOCUMENT:     { icon: FileText,    color: 'text-emerald-500', label: 'Document' },
  QUIZ:         { icon: ClipboardList, color: 'text-purple-500', label: 'Quiz' },
  ASSIGNMENT:   { icon: BookOpen,    color: 'text-amber-500',  label: 'Assignment' },
  LIVE_SESSION: { icon: Users,       color: 'text-rose-500',   label: 'Live' },
};

function LessonIcon({ type }: { type: LessonType }) {
  const meta = LESSON_META[type];
  const Icon = meta.icon;
  return <Icon className={`w-3.5 h-3.5 ${meta.color}`} />;
}

// ── Content Viewer ────────────────────────────────────────────────────────────

function ContentViewer({ lesson, isCompleted, onMarkComplete }: {
  lesson: Lesson;
  isCompleted: boolean;
  onMarkComplete: () => void;
}) {
  const isVideo = lesson.type === 'VIDEO';
  const isLive = lesson.type === 'LIVE_SESSION';

  // Detect YouTube embed
  const isYoutube = lesson.content && (
    lesson.content.includes('youtube.com') || lesson.content.includes('youtu.be')
  );
  const youtubeId = isYoutube && lesson.content
    ? (lesson.content.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1] ?? null)
    : null;

  return (
    <div className="flex flex-col h-full">
      {/* Lesson header */}
      <div className="px-6 py-4 border-b border-slate-100">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <LessonIcon type={lesson.type} />
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                {LESSON_META[lesson.type].label}
              </span>
              {lesson.duration && (
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {lesson.duration} min
                </span>
              )}
            </div>
            <h2 className="font-heading font-bold text-slate-900 text-lg leading-snug">{lesson.title}</h2>
            {lesson.description && (
              <p className="text-sm text-slate-400 mt-1">{lesson.description}</p>
            )}
          </div>
          <button
            onClick={onMarkComplete}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isCompleted
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                : 'bg-slate-100 text-slate-500 hover:bg-[#023064] hover:text-white border border-slate-200'
            }`}
          >
            {isCompleted ? <CheckCircle className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
            {isCompleted ? 'Completed' : 'Mark Complete'}
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto p-6">
        {!lesson.content ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
              <LessonIcon type={lesson.type} />
            </div>
            <p className="font-heading font-semibold text-slate-600 mb-1">Content coming soon</p>
            <p className="text-sm text-slate-400">Your teacher will add content to this lesson shortly.</p>
          </div>
        ) : isVideo ? (
          youtubeId ? (
            <div className="aspect-video rounded-xl overflow-hidden bg-black mb-4">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="mb-4">
              <div className="flex items-center justify-center aspect-video rounded-xl bg-slate-50 border border-slate-200 mb-3">
                <PlayCircle className="w-12 h-12 text-slate-300" />
              </div>
              <a
                href={lesson.content}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#023064] hover:underline"
              >
                <ExternalLink className="w-4 h-4" /> Open video link
              </a>
            </div>
          )
        ) : isLive ? (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 mb-4">
            <p className="text-sm font-semibold text-rose-700 mb-2">Live Session Link</p>
            <a
              href={lesson.content}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-rose-600 hover:underline"
            >
              <ExternalLink className="w-4 h-4" /> Join Meeting
            </a>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none">
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">{lesson.content}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function StudentCourseDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [progressMap, setProgressMap] = useState<Record<string, ProgressEntry>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [markingLesson, setMarkingLesson] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    api.get<{ course: Course; enrollment: Enrollment; progressMap: Record<string, ProgressEntry> }>(
      `/courses/${id}`
    )
      .then(({ course, enrollment, progressMap }) => {
        setCourse(course);
        setEnrollment(enrollment);
        setProgressMap(progressMap);
        // Auto-expand first section and select first lesson
        if (course.sections.length > 0) {
          setExpandedSections(new Set([course.sections[0].id]));
          const first = course.sections[0].lessons[0];
          if (first) setSelectedLesson(first);
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

  const handleMarkComplete = async (lesson: Lesson) => {
    const current = progressMap[lesson.id];
    const newCompleted = !current?.completed;
    setMarkingLesson(lesson.id);
    try {
      const { progressPercent } = await api.post<{ progress: ProgressEntry; progressPercent: number }>(
        `/sections/lessons/${lesson.id}/progress`,
        { completed: newCompleted }
      );
      setProgressMap((prev) => ({
        ...prev,
        [lesson.id]: { ...prev[lesson.id], completed: newCompleted, watchedSecs: prev[lesson.id]?.watchedSecs ?? 0 },
      }));
      if (enrollment) {
        setEnrollment((prev) => prev ? {
          ...prev,
          progressPercent,
          status: progressPercent >= 100 ? 'COMPLETED' : prev.status,
        } : prev);
      }
    } finally {
      setMarkingLesson(null);
    }
  };

  // ── Loading / Error ───────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
      </div>
    );
  }

  if (error || !course || !enrollment) {
    return (
      <div className="flex flex-col items-center gap-3 py-20">
        <AlertCircle className="w-10 h-10 text-red-400" />
        <p className="text-slate-500">{error || 'Course not found'}</p>
        <Link to="/student/courses" className="text-sm text-[#023064] hover:underline">← Back to Courses</Link>
      </div>
    );
  }

  const totalLessons = course.sections.reduce((sum, s) => sum + s.lessons.length, 0);
  const completedCount = Object.values(progressMap).filter((p) => p.completed).length;
  const progress = Math.round(enrollment.progressPercent);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-7xl flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-start gap-4">
        <Link
          to="/student/courses"
          className="mt-0.5 w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#023064] hover:border-[#023064] transition-all shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="font-heading text-xl font-bold text-slate-900 leading-tight mb-1">{course.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mb-3">
            <span>{course.teacher.name}</span>
            {course.category && <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {course.category}</span>}
            {course.level && <span>{course.level}</span>}
            {course.duration && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.duration}</span>}
            <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {totalLessons} lessons</span>
          </div>
          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 max-w-xs h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-[#023064] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-600">
              {completedCount}/{totalLessons} lessons · {progress}%
            </span>
            {enrollment.status === 'COMPLETED' && (
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <CheckCircle className="w-3 h-3" /> Completed
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="grid lg:grid-cols-[320px_1fr] gap-5 items-start">

        {/* Left sidebar — sections & lessons */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Course Content</span>
          </div>

          {course.sections.length === 0 ? (
            <div className="py-12 flex flex-col items-center text-center px-6">
              <BookOpen className="w-8 h-8 text-slate-200 mb-3" />
              <p className="text-sm text-slate-500">No content yet</p>
              <p className="text-xs text-slate-400 mt-1">Your teacher is building this course. Check back soon.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {course.sections.map((section, sIdx) => {
                const expanded = expandedSections.has(section.id);
                const sectionCompleted = section.lessons.length > 0 &&
                  section.lessons.every((l) => progressMap[l.id]?.completed);

                return (
                  <div key={section.id}>
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center gap-2.5 px-4 py-3 hover:bg-slate-50/60 transition-colors text-left"
                    >
                      {sectionCompleted
                        ? <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                        : (expanded ? <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />)
                      }
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 leading-snug">{section.title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Section {sIdx + 1} · {section.lessons.filter((l) => progressMap[l.id]?.completed).length}/{section.lessons.length} done
                        </p>
                      </div>
                    </button>

                    {expanded && (
                      <div className="pb-1">
                        {section.lessons.map((lesson) => {
                          const done = progressMap[lesson.id]?.completed ?? false;
                          const isActive = selectedLesson?.id === lesson.id;
                          return (
                            <button
                              key={lesson.id}
                              onClick={() => setSelectedLesson(lesson)}
                              className={`w-full flex items-center gap-2.5 px-5 py-2.5 text-left transition-colors ${
                                isActive ? 'bg-[#023064]/5' : 'hover:bg-slate-50'
                              }`}
                            >
                              <div className="shrink-0 mt-0.5">
                                {markingLesson === lesson.id
                                  ? <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-300" />
                                  : done
                                  ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                                  : <Circle className="w-3.5 h-3.5 text-slate-200" />
                                }
                              </div>
                              <LessonIcon type={lesson.type} />
                              <div className="flex-1 min-w-0">
                                <p className={`text-xs font-medium truncate ${isActive ? 'text-[#023064]' : done ? 'text-slate-400' : 'text-slate-700'}`}>
                                  {lesson.title}
                                </p>
                                {lesson.duration && (
                                  <p className="text-[10px] text-slate-400">{lesson.duration} min</p>
                                )}
                              </div>
                              {lesson.isFree && (
                                <span className="shrink-0 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">FREE</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: lesson content */}
        <div className="bg-white rounded-2xl shadow-sm min-h-[500px] flex flex-col overflow-hidden">
          {selectedLesson ? (
            <ContentViewer
              key={selectedLesson.id}
              lesson={selectedLesson}
              isCompleted={progressMap[selectedLesson.id]?.completed ?? false}
              onMarkComplete={() => handleMarkComplete(selectedLesson)}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                <PlayCircle className="w-7 h-7 text-[#023064]/30" />
              </div>
              <p className="font-heading font-semibold text-slate-700 mb-1">Select a lesson to start</p>
              <p className="text-sm text-slate-400 max-w-xs">
                Choose a lesson from the course content on the left to view it here.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
