import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, CheckCircle, Globe, ShieldCheck, Network, Database, Brain } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';

const categoryConfig: Record<string, { gradient: string; Icon: React.ElementType }> = {
  'Web Development': { gradient: 'from-blue-500 to-indigo-600',   Icon: Globe       },
  Cybersecurity:     { gradient: 'from-red-500 to-rose-600',      Icon: ShieldCheck },
  Networking:        { gradient: 'from-teal-500 to-cyan-600',     Icon: Network     },
  Data:              { gradient: 'from-violet-500 to-purple-600', Icon: Database    },
  AI:                { gradient: 'from-amber-500 to-orange-600',  Icon: Brain       },
  Other:             { gradient: 'from-slate-400 to-slate-600',   Icon: BookOpen    },
};

function getCategoryConfig(category: string | null) {
  return categoryConfig[category ?? ''] ?? { gradient: 'from-[#023064] to-blue-800', Icon: BookOpen };
}

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
    level: string | null;
    coverImage: string | null;
    _count: { sections: number };
    teacher: { id: string; name: string };
  };
}

export default function StudentCoursesPage() {
  const { t } = useLanguage();
  const d = t.lms.student.courses;

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ enrollments: Enrollment[] }>('/enrollments')
      .then(({ enrollments }) => setEnrollments(enrollments))
      .catch(() => setEnrollments([]))
      .finally(() => setLoading(false));
  }, []);

  const statusCls: Record<string, string> = {
    ACTIVE:    'bg-blue-100 text-blue-700 border border-blue-200',
    COMPLETED: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    SUSPENDED: 'bg-red-100 text-red-700 border border-red-200',
    DROPPED:   'bg-muted text-muted-foreground border border-border',
  };

  const statusLabel: Record<string, string> = {
    ACTIVE:    t.lms.status.inProgress,
    COMPLETED: t.lms.status.completed,
    SUSPENDED: t.lms.status.suspended,
    DROPPED:   'Dropped',
  };

  if (loading) {
    return (
      <div className="space-y-4 max-w-6xl">
        <div className="h-8 w-48 bg-slate-100 rounded animate-pulse" />
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
              <div className="h-28 bg-muted" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/3" />
                <div className="h-1.5 bg-muted rounded-full w-full" />
                <div className="h-9 bg-muted rounded-xl w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">{d.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {enrollments.length} {d.enrolled}
        </p>
      </div>

      {enrollments.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-16 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-primary-blue" />
          </div>
          <p className="font-heading font-semibold text-foreground mb-1">No courses yet</p>
          <p className="text-sm text-muted-foreground max-w-xs">
            You haven't been enrolled in any courses. Contact an admin to get started.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {enrollments.map((e) => {
            const progress = Math.round(e.progressPercent);
            const isCompleted = e.status === 'COMPLETED';
            const { gradient, Icon } = getCategoryConfig(e.course.category);

            return (
              <div key={e.id} className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition-all group flex flex-col">

                {/* Gradient header */}
                <div className={`h-28 bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden`}>
                  {e.course.coverImage
                    ? <img src={e.course.coverImage} alt={e.course.title} className="absolute inset-0 w-full h-full object-cover" />
                    : isCompleted
                    ? <CheckCircle className="w-12 h-12 text-white/80" />
                    : <Icon className="w-12 h-12 text-white/80" />
                  }
                  <div className="absolute top-3 right-3">
                    <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${statusCls[e.status] ?? 'bg-slate-100 text-slate-400'}`}>
                      {statusLabel[e.status] ?? e.status}
                    </span>
                  </div>
                  {/* Progress overlay at bottom */}
                  <div className="absolute bottom-0 inset-x-0 h-1 bg-black/20">
                    <div className="h-full bg-white/70 transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-heading font-semibold text-foreground mb-1 group-hover:text-primary-blue transition-colors leading-snug line-clamp-2">
                    {e.course.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {e.course.teacher.name}
                    {e.course.category ? ` · ${e.course.category}` : ''}
                    {e.course.level ? ` · ${e.course.level}` : ''}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                    <span>{e.course._count.sections} sections</span>
                    <span className="font-semibold text-foreground">{progress}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-4">
                    <div className="h-full rounded-full bg-primary-blue transition-all" style={{ width: `${progress}%` }} />
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                    {e.course.duration && (
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {e.course.duration}</span>
                    )}
                    <span>Started {new Date(e.startedAt).toLocaleDateString('en-UG', { month: 'short', year: 'numeric' })}</span>
                  </div>

                  <div className="mt-auto">
                    {!isCompleted ? (
                      <Link
                        to={`/student/courses/${e.course.id}`}
                        className="flex items-center justify-center w-full py-2.5 text-xs font-semibold bg-primary-blue text-white rounded-xl hover:bg-blue-900 transition-colors"
                      >
                        {d.continue}
                      </Link>
                    ) : (
                      <Link
                        to={`/student/courses/${e.course.id}`}
                        className="flex items-center justify-center w-full py-2.5 text-xs font-semibold border border-border text-muted-foreground rounded-xl hover:bg-muted/50 transition-colors"
                      >
                        {d.review}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
