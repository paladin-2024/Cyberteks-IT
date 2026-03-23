import { useState, useEffect } from 'react';
import { Calendar, BookOpen, Clock, Video } from 'lucide-react';
import { api } from '@/lib/api';

interface Enrollment {
  id: string;
  status: string;
  progressPercent: number;
  course: {
    id: string;
    title: string;
    category: string | null;
    duration: string | null;
    teacher: { name: string };
  };
}

export default function SchedulePage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ enrollments: Enrollment[] }>('/enrollments')
      .then(({ enrollments }) => setEnrollments(enrollments.filter(e => e.status === 'ACTIVE')))
      .catch(() => setEnrollments([]))
      .finally(() => setLoading(false));
  }, []);

  const today = new Date();
  const weekLabel = today.toLocaleDateString('en-UG', { month: 'long', year: 'numeric' });

  const COURSE_COLORS = [
    { bg: 'bg-blue-50',    border: 'border-blue-200',  text: 'text-blue-700',    dot: 'bg-blue-500' },
    { bg: 'bg-teal-50',    border: 'border-teal-200',  text: 'text-teal-700',    dot: 'bg-teal-500' },
    { bg: 'bg-violet-50',  border: 'border-violet-200', text: 'text-violet-700', dot: 'bg-violet-500' },
    { bg: 'bg-amber-50',   border: 'border-amber-200', text: 'text-amber-700',   dot: 'bg-amber-500' },
    { bg: 'bg-rose-50',    border: 'border-rose-200',  text: 'text-rose-700',    dot: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-6 max-w-5xl pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-foreground">My Schedule</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Your active courses and learning overview</p>
        </div>
        <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-1.5 text-sm font-medium text-foreground">
          <Calendar className="w-4 h-4 text-primary-blue" />
          {weekLabel}
        </div>
      </div>

      {/* Notice banner */}
      <div className="flex items-start gap-3 bg-primary-blue/5 border border-primary-blue/20 rounded-2xl px-5 py-4">
        <Video className="w-5 h-5 text-primary-blue shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-primary-blue">Live sessions coming soon</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your teacher will schedule live sessions and assignments here. Check back regularly for updates.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-5 animate-pulse h-24" />
          ))}
        </div>
      ) : enrollments.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-16 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary-blue/10 flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-primary-blue" />
          </div>
          <p className="font-heading font-semibold text-foreground mb-1">No active courses</p>
          <p className="text-sm text-muted-foreground max-w-xs">
            Once you're enrolled in courses, your schedule will appear here.
          </p>
        </div>
      ) : (
        <>
          <h2 className="font-heading font-semibold text-foreground">Active Courses</h2>
          <div className="space-y-3">
            {enrollments.map((e, idx) => {
              const palette = COURSE_COLORS[idx % COURSE_COLORS.length];
              const progress = Math.round(e.progressPercent);
              return (
                <div key={e.id} className={`rounded-2xl border p-5 ${palette.bg} ${palette.border}`}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center shrink-0 shadow-sm">
                      <BookOpen className={`w-5 h-5 ${palette.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <p className={`font-semibold text-sm ${palette.text}`}>{e.course.title}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-card/70 ${palette.text} shrink-0`}>
                          {progress}% complete
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        {e.course.teacher.name}
                        {e.course.category ? ` · ${e.course.category}` : ''}
                      </p>
                      <div className="h-1.5 rounded-full bg-card/60 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${palette.dot}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      {e.course.duration && (
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {e.course.duration} total
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
