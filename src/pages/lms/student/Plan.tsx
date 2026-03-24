import { useState, useEffect } from 'react';
import {
  BookOpen, CheckCircle, Circle, Clock, Target, TrendingUp,
  Award, ChevronRight, Lock,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
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
    _count: { sections: number };
    teacher: { name: string };
  };
}

export default function PlanPage() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] ?? 'Student';

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [certCount, setCertCount] = useState(0);
  const [avgProgress, setAvgProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{
      enrollments: Enrollment[];
      certCount: number;
      avgProgress: number;
      totalEnrollments: number;
      completed: number;
    }>('/enrollments/progress')
      .then(({ enrollments, certCount, avgProgress }) => {
        setEnrollments(enrollments);
        setCertCount(certCount);
        setAvgProgress(avgProgress);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const active    = enrollments.filter(e => e.status === 'ACTIVE').length;
  const completed = enrollments.filter(e => e.status === 'COMPLETED').length;

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-4 animate-pulse h-24" />
          ))}
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-4 h-28 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Learning Plan</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Your personalised roadmap to ICT mastery, {firstName}.
        </p>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Overall Progress',    value: `${avgProgress}%`, icon: TrendingUp, color: 'text-primary-blue bg-primary-blue/10' },
          { label: 'Courses Active',      value: active,             icon: BookOpen,   color: 'text-teal-600 bg-teal-100' },
          { label: 'Completed',           value: completed,          icon: Clock,      color: 'text-amber-600 bg-amber-100' },
          { label: 'Certificates Earned', value: certCount,          icon: Award,      color: 'text-primary-red bg-primary-red/10' },
        ].map((s) => (
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
          <p className="font-heading font-semibold text-foreground mb-1">No courses assigned yet</p>
          <p className="text-sm text-muted-foreground max-w-xs">
            Your learning plan will appear here once you've been enrolled in courses by an admin.
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Learning Roadmap */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-heading font-semibold text-foreground">Learning Roadmap</h2>

            <div className="relative">
              <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-border" />
              <div className="space-y-4">
                {enrollments.map((e, pi) => {
                  const isCompleted = e.status === 'COMPLETED';
                  const isActive    = e.status === 'ACTIVE';
                  const progress    = Math.round(e.progressPercent);
                  return (
                    <div key={e.id} className="relative">
                      <div className={`absolute left-4 top-5 w-4 h-4 rounded-full border-2 z-10 ${
                        isCompleted ? 'bg-green-500 border-green-500'
                        : isActive  ? 'bg-primary-blue border-primary-blue'
                        : 'bg-background border-border'
                      }`} />

                      <div className="ml-12">
                        <div className={`bg-card border border-border rounded-2xl p-4 ${!isActive && !isCompleted ? 'opacity-60' : ''}`}>
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                  Course {pi + 1}
                                </span>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                  isCompleted ? 'bg-green-100 text-green-700'
                                  : isActive  ? 'bg-primary-blue/10 text-primary-blue'
                                  : 'bg-muted text-muted-foreground'
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
                                {e.course._count.sections} sections
                                {e.course.category ? ` · ${e.course.category}` : ''}
                              </p>
                            </div>
                            {progress > 0 && (
                              <div className="w-20 shrink-0">
                                <span className="text-xs text-muted-foreground">{progress}%</span>
                                <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                                  <div
                                    className={`h-full rounded-full transition-all ${isCompleted ? 'bg-green-500' : 'bg-primary-blue'}`}
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                              </div>
                            )}
                            {(isActive || isCompleted) && (
                              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
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

          {/* Right col, Overall progress */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-4">
              <h2 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
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
                  { label: 'Total',     value: enrollments.length, color: 'bg-muted-foreground' },
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
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span className="font-heading font-semibold text-amber-800 text-sm">Certificates Earned</span>
                </div>
                <p className="font-heading text-3xl font-extrabold text-amber-700">{certCount}</p>
                <p className="text-xs text-amber-600 mt-0.5">Keep going to earn more!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
