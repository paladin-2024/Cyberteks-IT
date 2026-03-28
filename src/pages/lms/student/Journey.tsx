import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, TrendingUp, Award, CheckCircle, Circle, Clock, Target,
  Calendar, Video, ClipboardList, FileText, Beaker, MonitorPlay,
  ChevronDown, ChevronRight, ArrowUpRight, Lock, ExternalLink, Layers,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

// ── Types ─────────────────────────────────────────────────────────────────────

interface CurriculumTopic {
  id: string;
  title: string;
  type: string;
  duration: string | null;
  meetLink: string | null;
  meetScheduledAt: string | null;
  dueDate: string | null;
  maxScore: number | null;
  order: number;
}

interface CurriculumWeek {
  id: string;
  weekNumber: number;
  title: string;
  courseId: string;
  topics: CurriculumTopic[];
}

interface Enrollment {
  id: string;
  status: string;
  progressPercent: number;
  startedAt: string;
  completedAt: string | null;
  courseId: string;
  course: {
    id: string;
    title: string;
    category: string | null;
    duration: string | null;
    _count: { sections: number };
    teacher: { name: string };
  };
  curriculumWeeks: CurriculumWeek[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const PALETTE = [
  { bar: 'bg-blue-500',    text: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-100',   badge: 'bg-blue-100 text-blue-700'   },
  { bar: 'bg-rose-500',    text: 'text-rose-600',    bg: 'bg-rose-50',    border: 'border-rose-100',   badge: 'bg-rose-100 text-rose-700'   },
  { bar: 'bg-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', badge: 'bg-emerald-100 text-emerald-700' },
  { bar: 'bg-violet-500',  text: 'text-violet-600',  bg: 'bg-violet-50',  border: 'border-violet-100', badge: 'bg-violet-100 text-violet-700' },
  { bar: 'bg-amber-500',   text: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-100',  badge: 'bg-amber-100 text-amber-700'  },
];

function topicIcon(type: string) {
  switch (type) {
    case 'video':       return <Video       className="w-3.5 h-3.5" />;
    case 'assignment':  return <ClipboardList className="w-3.5 h-3.5" />;
    case 'live_session': return <MonitorPlay className="w-3.5 h-3.5" />;
    case 'lab':         return <Beaker      className="w-3.5 h-3.5" />;
    case 'document':    return <FileText    className="w-3.5 h-3.5" />;
    default:            return <BookOpen    className="w-3.5 h-3.5" />;
  }
}

function topicTypeColor(type: string) {
  switch (type) {
    case 'video':        return 'bg-blue-100 text-blue-700';
    case 'assignment':   return 'bg-amber-100 text-amber-700';
    case 'live_session': return 'bg-rose-100 text-rose-700';
    case 'lab':          return 'bg-violet-100 text-violet-700';
    case 'document':     return 'bg-slate-100 text-slate-700';
    default:             return 'bg-emerald-100 text-emerald-700';
  }
}

function topicTypeLabel(type: string) {
  const map: Record<string, string> = {
    lecture: 'Lecture', video: 'Video', assignment: 'Assignment',
    live_session: 'Live Session', lab: 'Lab', document: 'Document',
  };
  return map[type] ?? type;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-UG', { weekday: 'short', month: 'short', day: 'numeric' });
}
function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-UG', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="space-y-6 max-w-5xl pb-8">
      <div className="h-8 w-56 bg-muted rounded animate-pulse" />
      <div className="flex gap-2">
        {[1,2,3].map(i => <div key={i} className="h-9 w-28 bg-muted rounded-xl animate-pulse" />)}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="h-24 bg-card border border-border rounded-2xl animate-pulse" />)}
      </div>
      {[1,2].map(i => <div key={i} className="h-36 bg-card border border-border rounded-2xl animate-pulse" />)}
    </div>
  );
}

// ── Tabs ──────────────────────────────────────────────────────────────────────

type Tab = 'overview' | 'roadmap' | 'schedule';

// ── Main component ────────────────────────────────────────────────────────────

export default function JourneyPage() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] ?? 'Student';

  const [enrollments, setEnrollments]   = useState<Enrollment[]>([]);
  const [certCount, setCertCount]       = useState(0);
  const [avgProgress, setAvgProgress]   = useState(0);
  const [completed, setCompleted]       = useState(0);
  const [total, setTotal]               = useState(0);
  const [loading, setLoading]           = useState(true);
  const [tab, setTab]                   = useState<Tab>('overview');
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(new Set());

  useEffect(() => {
    api.get<{
      enrollments: Enrollment[];
      certCount: number;
      avgProgress: number;
      completed: number;
      totalEnrollments: number;
    }>('/enrollments/journey')
      .then(({ enrollments, certCount, avgProgress, completed, totalEnrollments }) => {
        setEnrollments(enrollments);
        setCertCount(certCount);
        setAvgProgress(avgProgress);
        setCompleted(completed);
        setTotal(totalEnrollments);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const active = enrollments.filter(e => e.status === 'ACTIVE').length;

  // All live sessions and assignments from all curriculum weeks
  const liveSessions: Array<{ topic: CurriculumTopic; courseTitle: string; courseId: string }> = [];
  const assignments:  Array<{ topic: CurriculumTopic; courseTitle: string; courseId: string }> = [];
  for (const e of enrollments) {
    for (const week of e.curriculumWeeks) {
      for (const topic of week.topics) {
        if (topic.type === 'live_session' && topic.meetScheduledAt) {
          liveSessions.push({ topic, courseTitle: e.course.title, courseId: e.courseId });
        }
        if (topic.type === 'assignment' && topic.dueDate) {
          assignments.push({ topic, courseTitle: e.course.title, courseId: e.courseId });
        }
      }
    }
  }
  liveSessions.sort((a, b) => new Date(a.topic.meetScheduledAt!).getTime() - new Date(b.topic.meetScheduledAt!).getTime());
  assignments.sort((a, b)  => new Date(a.topic.dueDate!).getTime()         - new Date(b.topic.dueDate!).getTime());

  function toggleWeek(id: string) {
    setExpandedWeeks(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  if (loading) return <Skeleton />;

  // ── Stat cards (shared between tabs) ───────────────────────────────────────
  const statCards = [
    { label: 'Overall Progress',    value: `${avgProgress}%`, icon: TrendingUp, color: 'text-primary-blue bg-primary-blue/10' },
    { label: 'Active Courses',      value: active,             icon: BookOpen,   color: 'text-teal-600 bg-teal-100'           },
    { label: 'Completed',           value: completed,          icon: CheckCircle, color: 'text-green-600 bg-green-100'         },
    { label: 'Certificates Earned', value: certCount,          icon: Award,      color: 'text-amber-600 bg-amber-100'         },
  ];

  return (
    <div className="space-y-6 max-w-5xl pb-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">My Learning Journey</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Your personalised roadmap, schedule, and progress — all in one place, {firstName}.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 bg-muted/50 p-1 rounded-xl w-fit">
        {([['overview', 'Overview'], ['roadmap', 'Roadmap'], ['schedule', 'Schedule']] as [Tab, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              tab === key
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ────────────────────────────────────────────────────── */}
      {tab === 'overview' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((s) => (
              <div key={s.label} className="bg-card border border-border rounded-2xl p-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <p className="font-heading text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {enrollments.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-16 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary-blue/10 flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-primary-blue" />
              </div>
              <p className="font-heading font-semibold text-foreground mb-1">No courses yet</p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Your learning journey will appear here once you've been enrolled in courses.
              </p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Learning Roadmap timeline */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="font-heading font-semibold text-foreground text-sm uppercase tracking-wide text-muted-foreground">Learning Roadmap</h2>
                <div className="relative">
                  <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-border" />
                  <div className="space-y-4">
                    {enrollments.map((e, pi) => {
                      const isCompleted = e.status === 'COMPLETED';
                      const isActive    = e.status === 'ACTIVE';
                      const progress    = Math.round(e.progressPercent);
                      const palette     = PALETTE[pi % PALETTE.length];
                      return (
                        <div key={e.id} className="relative">
                          <div className={`absolute left-4 top-5 w-4 h-4 rounded-full border-2 z-10 ${
                            isCompleted ? 'bg-green-500 border-green-500'
                            : isActive  ? 'bg-primary-blue border-primary-blue'
                            :             'bg-background border-border'
                          }`} />
                          <div className="ml-12">
                            <div className={`bg-card border border-border rounded-2xl p-4 ${!isActive && !isCompleted ? 'opacity-60' : ''}`}>
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                      Course {pi + 1}
                                    </span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                      isCompleted ? 'bg-green-100 text-green-700'
                                      : isActive  ? 'bg-primary-blue/10 text-primary-blue'
                                      :             'bg-muted text-muted-foreground'
                                    }`}>
                                      {isCompleted ? 'Completed' : isActive ? 'In Progress' : e.status}
                                    </span>
                                  </div>
                                  <h3 className="font-heading font-bold text-foreground mt-0.5">{e.course.title}</h3>
                                </div>
                                {e.course.duration && (
                                  <p className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
                                    <Clock className="w-3 h-3" /> {e.course.duration}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-3 py-2 px-3 rounded-xl bg-muted/50">
                                <div className="shrink-0">
                                  {isCompleted
                                    ? <CheckCircle className="w-4 h-4 text-green-500" />
                                    : isActive
                                    ? <Circle className="w-4 h-4 text-primary-blue" />
                                    : <Lock className="w-4 h-4 text-muted-foreground" />
                                  }
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-foreground truncate">{e.course.teacher.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {e.curriculumWeeks.length > 0
                                      ? `${e.curriculumWeeks.length} week${e.curriculumWeeks.length !== 1 ? 's' : ''} · ${e.curriculumWeeks.reduce((s, w) => s + w.topics.length, 0)} lessons`
                                      : `${e.course._count.sections} sections`
                                    }
                                    {e.course.category ? ` · ${e.course.category}` : ''}
                                  </p>
                                </div>
                                {progress > 0 && (
                                  <div className="w-20 shrink-0">
                                    <span className="text-xs text-muted-foreground">{progress}%</span>
                                    <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                                      <div
                                        className={`h-full rounded-full transition-all ${isCompleted ? 'bg-green-500' : palette.bar}`}
                                        style={{ width: `${progress}%` }}
                                      />
                                    </div>
                                  </div>
                                )}
                                {(isActive || isCompleted) && (
                                  <Link to={`/student/courses/${e.courseId}`}>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right col */}
              <div className="space-y-5">
                {/* Circular progress */}
                <div className="bg-card border border-border rounded-2xl p-4">
                  <h2 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-primary-blue" /> Overall Progress
                  </h2>
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative w-24 h-24">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted" />
                        <circle
                          cx="18" cy="18" r="15.9" fill="none"
                          stroke="currentColor" strokeWidth="2"
                          strokeDasharray={`${avgProgress} 100`}
                          className="text-primary-blue transition-all"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-heading text-xl font-bold text-foreground">{avgProgress}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: 'Active',    value: active,    color: 'bg-primary-blue' },
                      { label: 'Completed', value: completed, color: 'bg-green-500' },
                      { label: 'Total',     value: total,     color: 'bg-muted-foreground' },
                    ].map((s) => (
                      <div key={s.label} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${s.color}`} />
                          <span className="text-muted-foreground">{s.label}</span>
                        </div>
                        <span className="font-semibold text-foreground">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {certCount > 0 && (
                  <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span className="font-heading font-semibold text-amber-800 text-sm">Certificates</span>
                    </div>
                    <p className="font-heading text-3xl font-extrabold text-amber-700">{certCount}</p>
                    <p className="text-xs text-amber-600 mt-0.5">Keep going to earn more!</p>
                    <Link to="/student/certificates" className="inline-flex items-center gap-1 text-xs text-amber-700 font-semibold mt-2 hover:underline">
                      View all <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}

                {/* Per-course breakdown */}
                <div className="bg-card border border-border rounded-2xl p-4">
                  <h2 className="font-heading font-semibold text-foreground text-sm mb-3">Course Breakdown</h2>
                  <div className="space-y-3">
                    {enrollments.map((e, idx) => {
                      const palette   = PALETTE[idx % PALETTE.length];
                      const progress  = Math.round(e.progressPercent);
                      const isDone    = e.status === 'COMPLETED';
                      return (
                        <div key={e.id}>
                          <div className="flex justify-between items-center mb-1">
                            <p className={`text-xs font-semibold truncate max-w-[160px] ${palette.text}`}>{e.course.title}</p>
                            <span className="text-xs text-muted-foreground shrink-0">{progress}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${isDone ? 'bg-green-500' : palette.bar}`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── ROADMAP TAB ─────────────────────────────────────────────────────── */}
      {tab === 'roadmap' && (
        <div className="space-y-6">
          {enrollments.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-16 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary-blue/10 flex items-center justify-center mb-4">
                <Layers className="w-8 h-8 text-primary-blue" />
              </div>
              <p className="font-heading font-semibold text-foreground mb-1">No courses yet</p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Enrol in a course to see your curriculum roadmap here.
              </p>
            </div>
          ) : (
            enrollments.map((e, idx) => {
              const palette  = PALETTE[idx % PALETTE.length];
              const progress = Math.round(e.progressPercent);
              const isDone   = e.status === 'COMPLETED';
              return (
                <div key={e.id} className="bg-card border border-border rounded-2xl overflow-hidden">
                  {/* Course header */}
                  <div className={`flex items-center justify-between gap-4 px-5 py-4 ${palette.bg} border-b ${palette.border}`}>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${palette.badge}`}>
                          {isDone ? 'Completed' : 'In Progress'}
                        </span>
                        <h3 className={`font-heading font-bold text-sm ${palette.text}`}>{e.course.title}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {e.course.teacher.name}
                        {e.course.category ? ` · ${e.course.category}` : ''}
                      </p>
                    </div>
                    <div className="shrink-0 flex items-center gap-3">
                      <div className="text-right">
                        <p className={`text-sm font-bold ${palette.text}`}>{progress}%</p>
                        <div className="h-1.5 w-20 rounded-full bg-white/60 overflow-hidden mt-0.5">
                          <div className={`h-full rounded-full ${isDone ? 'bg-green-500' : palette.bar}`} style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                      <Link
                        to={`/student/courses/${e.courseId}`}
                        className={`text-xs font-semibold flex items-center gap-1 ${palette.text} hover:opacity-80`}
                      >
                        Open <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Weeks */}
                  {e.curriculumWeeks.length === 0 ? (
                    <div className="px-5 py-6 text-center text-sm text-muted-foreground">
                      No curriculum weeks added yet by your teacher.
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {e.curriculumWeeks.map((week) => {
                        const isOpen = expandedWeeks.has(week.id);
                        return (
                          <div key={week.id}>
                            <button
                              onClick={() => toggleWeek(week.id)}
                              className="w-full flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-muted/30 transition-colors text-left"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${palette.badge}`}>
                                  Week {week.weekNumber}
                                </span>
                                <span className="font-medium text-sm text-foreground truncate">{week.title}</span>
                                <span className="text-xs text-muted-foreground shrink-0 hidden sm:block">
                                  {week.topics.length} lesson{week.topics.length !== 1 ? 's' : ''}
                                </span>
                              </div>
                              {isOpen
                                ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                                : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                              }
                            </button>
                            {isOpen && (
                              <div className="px-5 pb-4 space-y-2">
                                {week.topics.length === 0 ? (
                                  <p className="text-xs text-muted-foreground py-2">No lessons in this week yet.</p>
                                ) : (
                                  week.topics.map((topic) => (
                                    <div key={topic.id} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${topicTypeColor(topic.type)}`}>
                                        {topicIcon(topic.type)} {topicTypeLabel(topic.type)}
                                      </span>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground">{topic.title}</p>
                                        <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                                          {topic.duration && (
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                              <Clock className="w-3 h-3" /> {topic.duration}
                                            </span>
                                          )}
                                          {topic.meetScheduledAt && (
                                            <span className="text-xs text-rose-600 font-medium flex items-center gap-1">
                                              <Calendar className="w-3 h-3" /> {fmtDateTime(topic.meetScheduledAt)}
                                            </span>
                                          )}
                                          {topic.dueDate && (
                                            <span className="text-xs text-amber-600 font-medium flex items-center gap-1">
                                              <ClipboardList className="w-3 h-3" /> Due {fmtDate(topic.dueDate)}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      {topic.meetLink && (
                                        <a
                                          href={topic.meetLink}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-xs font-semibold text-rose-600 flex items-center gap-1 shrink-0 hover:underline"
                                        >
                                          Join <ExternalLink className="w-3 h-3" />
                                        </a>
                                      )}
                                    </div>
                                  ))
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ── SCHEDULE TAB ────────────────────────────────────────────────────── */}
      {tab === 'schedule' && (
        <div className="space-y-6">
          {/* Live sessions */}
          <div>
            <h2 className="font-heading font-semibold text-foreground text-sm uppercase tracking-wide text-muted-foreground mb-3">
              Live Sessions
            </h2>
            {liveSessions.length === 0 ? (
              <div className="bg-muted/30 border border-border rounded-2xl px-5 py-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                  <Video className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">No live sessions scheduled yet</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Your teacher will schedule live sessions — check back for updates.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {liveSessions.map(({ topic, courseTitle, courseId }) => {
                  const isUpcoming = new Date(topic.meetScheduledAt!) > new Date();
                  return (
                    <div key={topic.id} className={`rounded-2xl border p-4 flex items-start gap-4 ${isUpcoming ? 'bg-rose-50 border-rose-100' : 'bg-card border-border opacity-70'}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isUpcoming ? 'bg-rose-100' : 'bg-muted'}`}>
                        <MonitorPlay className={`w-5 h-5 ${isUpcoming ? 'text-rose-600' : 'text-muted-foreground'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground">{topic.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{courseTitle}</p>
                        <p className={`text-xs font-medium mt-1 flex items-center gap-1 ${isUpcoming ? 'text-rose-600' : 'text-muted-foreground'}`}>
                          <Calendar className="w-3 h-3" /> {fmtDateTime(topic.meetScheduledAt!)}
                          {isUpcoming && <span className="ml-1 bg-rose-100 text-rose-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">Upcoming</span>}
                        </p>
                      </div>
                      <div className="shrink-0 flex flex-col items-end gap-2">
                        <Link to={`/student/courses/${courseId}`} className="text-xs text-primary-blue font-semibold hover:underline flex items-center gap-1">
                          Course <ArrowUpRight className="w-3 h-3" />
                        </Link>
                        {topic.meetLink && isUpcoming && (
                          <a
                            href={topic.meetLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-rose-600 bg-rose-100 px-3 py-1 rounded-lg hover:bg-rose-200 transition-colors flex items-center gap-1"
                          >
                            Join <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Assignments */}
          <div>
            <h2 className="font-heading font-semibold text-foreground text-sm uppercase tracking-wide text-muted-foreground mb-3">
              Assignments &amp; Deadlines
            </h2>
            {assignments.length === 0 ? (
              <div className="bg-muted/30 border border-border rounded-2xl px-5 py-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                  <ClipboardList className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">No assignments scheduled yet</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Assignments with due dates will appear here.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {assignments.map(({ topic, courseTitle, courseId }) => {
                  const due       = new Date(topic.dueDate!);
                  const now       = new Date();
                  const isPast    = due < now;
                  const daysLeft  = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                  const isUrgent  = !isPast && daysLeft <= 3;
                  return (
                    <div key={topic.id} className={`rounded-2xl border p-4 flex items-start gap-4 ${
                      isPast    ? 'bg-card border-border opacity-60'
                      : isUrgent ? 'bg-amber-50 border-amber-200'
                      :            'bg-card border-border'
                    }`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isPast ? 'bg-muted' : isUrgent ? 'bg-amber-100' : 'bg-primary-blue/10'
                      }`}>
                        <ClipboardList className={`w-5 h-5 ${isPast ? 'text-muted-foreground' : isUrgent ? 'text-amber-600' : 'text-primary-blue'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground">{topic.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{courseTitle}</p>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <p className={`text-xs font-medium flex items-center gap-1 ${isPast ? 'text-muted-foreground' : isUrgent ? 'text-amber-600' : 'text-foreground'}`}>
                            <Clock className="w-3 h-3" /> Due {fmtDate(topic.dueDate!)}
                          </p>
                          {!isPast && (
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                              isUrgent ? 'bg-amber-100 text-amber-700' : 'bg-primary-blue/10 text-primary-blue'
                            }`}>
                              {daysLeft === 0 ? 'Due today' : daysLeft === 1 ? '1 day left' : `${daysLeft} days left`}
                            </span>
                          )}
                          {isPast && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">Past due</span>}
                          {topic.maxScore && <span className="text-xs text-muted-foreground">{topic.maxScore} pts</span>}
                        </div>
                      </div>
                      <Link to={`/student/courses/${courseId}`} className="text-xs text-primary-blue font-semibold hover:underline flex items-center gap-1 shrink-0">
                        View <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
