import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Clock, BookOpen, Award, Target, ArrowUpRight } from 'lucide-react';
import { api } from '@/lib/api';

interface Enrollment {
  id: string;
  status: string;
  progressPercent: number;
  startedAt: string;
  completedAt: string | null;
  course: {
    id: string;
    title: string;
    category: string | null;
    duration: string | null;
    teacher: { name: string };
  };
}

const COURSE_COLORS = [
  { color: 'bg-blue-500',    textColor: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-100' },
  { color: 'bg-rose-500',    textColor: 'text-rose-600',    bg: 'bg-rose-50',    border: 'border-rose-100' },
  { color: 'bg-emerald-500', textColor: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  { color: 'bg-violet-500',  textColor: 'text-violet-600',  bg: 'bg-violet-50',  border: 'border-violet-100' },
  { color: 'bg-amber-500',   textColor: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-100' },
];

export default function ProgressPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [certCount, setCertCount] = useState(0);
  const [totalEnrollments, setTotalEnrollments] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [avgProgress, setAvgProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{
      enrollments: Enrollment[];
      certCount: number;
      totalEnrollments: number;
      completed: number;
      avgProgress: number;
    }>('/enrollments/progress')
      .then(({ enrollments, certCount, totalEnrollments, completed, avgProgress }) => {
        setEnrollments(enrollments);
        setCertCount(certCount);
        setTotalEnrollments(totalEnrollments);
        setCompleted(completed);
        setAvgProgress(avgProgress);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl pb-8">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-5 animate-pulse">
              <div className="w-9 h-9 rounded-xl bg-muted mb-3" />
              <div className="h-7 bg-muted rounded w-16 mb-1" />
              <div className="h-3 bg-muted rounded w-24" />
            </div>
          ))}
        </div>
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-5 h-36 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (enrollments.length === 0) {
    return (
      <div className="max-w-5xl pb-8">
        <h1 className="font-heading text-2xl font-bold text-foreground mb-2">My Progress</h1>
        <p className="text-muted-foreground text-sm mb-8">Your detailed learning analytics and course progress</p>
        <div className="bg-card border border-border rounded-2xl p-16 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary-blue/10 flex items-center justify-center mb-4">
            <TrendingUp className="w-8 h-8 text-primary-blue" />
          </div>
          <p className="font-heading font-semibold text-foreground mb-1">No progress data yet</p>
          <p className="text-sm text-muted-foreground max-w-xs">
            Enrol in a course to start tracking your progress here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl pb-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">My Progress</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Your learning analytics and course progress</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Enrolled Courses', value: totalEnrollments, icon: BookOpen, iconBg: 'bg-blue-50',    iconColor: 'text-blue-600' },
          { label: 'Completed',        value: completed,         icon: Target,   iconBg: 'bg-violet-50',  iconColor: 'text-violet-600' },
          { label: 'Avg. Progress',    value: `${avgProgress}%`, icon: TrendingUp, iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
          { label: 'Certificates',     value: certCount,         icon: Award,    iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${s.iconBg}`}>
              <s.icon className={`w-4 h-4 ${s.iconColor}`} />
            </div>
            <p className="font-heading text-2xl font-extrabold text-foreground leading-none">{s.value}</p>
            <p className="text-xs font-medium text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Per-course breakdown */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="font-heading font-bold text-foreground text-base mb-5">Course Breakdown</h2>
        <div className="space-y-5">
          {enrollments.map((e, idx) => {
            const palette = COURSE_COLORS[idx % COURSE_COLORS.length];
            const progress = Math.round(e.progressPercent);
            const isCompleted = e.status === 'COMPLETED';
            return (
              <div key={e.id} className={`rounded-2xl border p-5 ${palette.bg} ${palette.border}`}>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className={`font-bold text-sm ${palette.textColor}`}>{e.course.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {e.course.teacher.name}
                      {e.course.category ? ` · ${e.course.category}` : ''}
                    </p>
                  </div>
                  {!isCompleted && (
                    <Link
                      to="/student/courses"
                      className={`flex items-center gap-1 text-xs font-semibold ${palette.textColor} hover:opacity-80 transition-opacity shrink-0`}
                    >
                      Continue <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div>
                    <p className="font-bold text-lg text-foreground">{progress}%</p>
                    <p className="text-[10px] text-muted-foreground">Complete</p>
                  </div>
                  <div>
                    <p className="font-bold text-lg text-foreground">
                      {isCompleted ? '✓' : `${progress}%`}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{isCompleted ? 'Finished' : 'Progress'}</p>
                  </div>
                  <div>
                    <p className="font-bold text-lg text-foreground">
                      {e.course.duration ?? '—'}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Duration</p>
                  </div>
                </div>

                <div className="h-2 rounded-full bg-white/60 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${isCompleted ? 'bg-emerald-500' : palette.color}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {isCompleted && e.completedAt && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Completed {new Date(e.completedAt).toLocaleDateString('en-UG', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading font-bold text-foreground text-base">Overall Completion</h2>
          <span className="font-heading text-2xl font-extrabold text-primary-blue">{avgProgress}%</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-primary-blue transition-all"
            style={{ width: `${avgProgress}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {completed} of {totalEnrollments} course{totalEnrollments !== 1 ? 's' : ''} completed
        </p>
      </div>
    </div>
  );
}
