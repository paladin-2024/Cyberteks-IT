import { useState, useEffect } from 'react';
import {
  Calendar, Bell, Clock, BookOpen, Award, ChevronLeft, ChevronRight,
  ClipboardList, Users, TrendingUp, CheckCircle2, AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface UpcomingAssignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  status: string;
}

interface RecentNotification {
  id: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

interface TeacherStats {
  totalCourses: number;
  totalStudents: number;
  avgProgress: number;
  completionRate: number;
}

interface StudentStats {
  totalCourses: number;
  completedCourses: number;
  avgProgress: number;
  totalAssignments: number;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatDueDate(iso: string): string {
  const due = new Date(iso);
  const now = new Date();
  const diffMs = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs < 0) return 'Past due';
  if (diffDays === 0) return 'Due today';
  if (diffDays === 1) return 'Due tomorrow';
  if (diffDays <= 7) return `Due in ${diffDays}d`;
  return due.toLocaleDateString('en-UG', { month: 'short', day: 'numeric' });
}

function dueBg(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff < 0) return 'bg-red-500';
  if (diff < 3 * 24 * 60 * 60 * 1000) return 'bg-amber-500';
  return 'bg-emerald-500';
}

const notifColors: Record<string, string> = {
  INFO:    'bg-primary-blue',
  SUCCESS: 'bg-emerald-500',
  WARNING: 'bg-amber-500',
  ERROR:   'bg-red-500',
};

// ─── Teacher stats ────────────────────────────────────────────────────────────

function TeacherStatGrid({ stats }: { stats: TeacherStats | null }) {
  if (!stats) return (
    <div className="grid grid-cols-2 gap-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-muted rounded-xl p-3 h-16 animate-pulse" />
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-2">
      {[
        { icon: BookOpen,    label: 'Courses',    value: stats.totalCourses,        color: 'text-primary-blue' },
        { icon: Users,       label: 'Students',   value: stats.totalStudents,       color: 'text-teal-600' },
        { icon: TrendingUp,  label: 'Avg Progress', value: `${stats.avgProgress}%`, color: 'text-amber-500' },
        { icon: Award,       label: 'Completion', value: `${stats.completionRate}%`, color: 'text-emerald-600' },
      ].map((s) => (
        <div key={s.label} className="bg-muted rounded-xl p-3 text-center">
          <s.icon className={cn('w-4 h-4 mx-auto mb-1', s.color)} />
          <p className="font-bold text-foreground text-sm">{s.value}</p>
          <p className="text-xs text-muted-foreground leading-tight">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Student stats ────────────────────────────────────────────────────────────

function StudentStatGrid({ stats }: { stats: StudentStats | null }) {
  if (!stats) return (
    <div className="grid grid-cols-2 gap-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-muted rounded-xl p-3 h-16 animate-pulse" />
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-2">
      {[
        { icon: BookOpen,     label: 'Enrolled',   value: stats.totalCourses,    color: 'text-primary-blue' },
        { icon: CheckCircle2, label: 'Completed',  value: stats.completedCourses, color: 'text-emerald-600' },
        { icon: TrendingUp,   label: 'Progress',   value: `${stats.avgProgress}%`, color: 'text-amber-500' },
        { icon: ClipboardList,label: 'Assignments',value: stats.totalAssignments, color: 'text-primary-blue' },
      ].map((s) => (
        <div key={s.label} className="bg-muted rounded-xl p-3 text-center">
          <s.icon className={cn('w-4 h-4 mx-auto mb-1', s.color)} />
          <p className="font-bold text-foreground text-sm">{s.value}</p>
          <p className="text-xs text-muted-foreground leading-tight">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Main Sidebar ─────────────────────────────────────────────────────────────

export default function RightSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const role = user?.role?.toUpperCase() ?? 'STUDENT';

  const [assignments, setAssignments]     = useState<UpcomingAssignment[]>([]);
  const [notifications, setNotifications] = useState<RecentNotification[]>([]);
  const [teacherStats, setTeacherStats]   = useState<TeacherStats | null>(null);
  const [studentStats, setStudentStats]   = useState<StudentStats | null>(null);
  const [loadingAssign, setLoadingAssign] = useState(true);
  const [loadingNotif, setLoadingNotif]   = useState(true);
  const [loadingStats, setLoadingStats]   = useState(true);

  useEffect(() => {
    if (!user) return;

    // Assignments (teacher: their assignments, student: enrolled course assignments)
    api.get<{ assignments: UpcomingAssignment[] }>('/assignments')
      .then(({ assignments }) => {
        const sorted = (assignments ?? [])
          .filter((a) => a.status !== 'DRAFT')
          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
          .slice(0, 4);
        setAssignments(sorted);
      })
      .catch(() => {})
      .finally(() => setLoadingAssign(false));

    // Notifications
    api.get<{ notifications: RecentNotification[] }>('/notifications')
      .then(({ notifications }) => {
        setNotifications((notifications ?? []).slice(0, 5));
      })
      .catch(() => {})
      .finally(() => setLoadingNotif(false));

    // Role-specific stats
    if (role === 'TEACHER') {
      api.get<{ kpis: TeacherStats }>('/analytics/teacher')
        .then(({ kpis }) => setTeacherStats(kpis ?? null))
        .catch(() => setTeacherStats({ totalCourses: 0, totalStudents: 0, avgProgress: 0, completionRate: 0 }))
        .finally(() => setLoadingStats(false));
    } else if (role === 'STUDENT') {
      api.get<{ enrollments: { progressPercent: number; status: string }[] }>('/enrollments')
        .then(({ enrollments }) => {
          const enrs = enrollments ?? [];
          const completed = enrs.filter((e) => e.status === 'COMPLETED').length;
          const avg = enrs.length > 0
            ? Math.round(enrs.reduce((s, e) => s + e.progressPercent, 0) / enrs.length)
            : 0;
          setStudentStats({
            totalCourses:     enrs.length,
            completedCourses: completed,
            avgProgress:      avg,
            totalAssignments: 0, // will be updated from assignments
          });
        })
        .catch(() => setStudentStats({ totalCourses: 0, completedCourses: 0, avgProgress: 0, totalAssignments: 0 }))
        .finally(() => setLoadingStats(false));
    } else {
      setLoadingStats(false);
    }
  }, [user, role]);

  // Update student totalAssignments from loaded assignments
  useEffect(() => {
    if (role === 'STUDENT' && studentStats) {
      setStudentStats((prev) => prev ? { ...prev, totalAssignments: assignments.length } : prev);
    }
  }, [assignments, role]);

  return (
    <aside
      className={cn(
        'hidden xl:flex flex-col h-full bg-card border-l border-border transition-all duration-300 shrink-0 overflow-hidden',
        collapsed ? 'w-12' : 'w-72'
      )}
    >
      {/* Toggle */}
      <div className="flex items-center justify-between p-3 border-b border-border h-16">
        {!collapsed && <span className="text-sm font-semibold text-foreground">Overview</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all',
            collapsed && 'mx-auto'
          )}
        >
          {collapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {!collapsed && (
        <div className="flex-1 overflow-y-auto p-4 space-y-6">

          {/* Stats — role-specific */}
          {(role === 'TEACHER' || role === 'STUDENT') && (
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {role === 'TEACHER' ? 'My Overview' : 'My Progress'}
              </h3>
              {role === 'TEACHER'
                ? <TeacherStatGrid stats={loadingStats ? null : teacherStats} />
                : <StudentStatGrid stats={loadingStats ? null : studentStats} />
              }
            </div>
          )}

          {/* Upcoming assignments */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-primary-blue" />
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {role === 'TEACHER' ? 'My Assignments' : 'Upcoming'}
              </h3>
            </div>

            {loadingAssign ? (
              <div className="space-y-2.5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-muted mt-1.5 shrink-0 animate-pulse" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
                      <div className="h-2.5 bg-muted rounded w-1/2 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : assignments.length === 0 ? (
              <div className="flex items-center gap-2 py-3 px-3 rounded-xl bg-muted/60 text-xs text-muted-foreground">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                No upcoming assignments
              </div>
            ) : (
              <div className="space-y-2.5">
                {assignments.map((a) => (
                  <div key={a.id} className="flex items-start gap-2.5">
                    <div className={cn('w-2 h-2 rounded-full mt-1.5 shrink-0', dueBg(a.dueDate))} />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{a.title}</p>
                      <p className="text-[11px] text-muted-foreground">{a.course} · {formatDueDate(a.dueDate)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent notifications */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Bell className="w-4 h-4 text-primary-blue" />
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Recent Activity
              </h3>
            </div>

            {loadingNotif ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-muted mt-1.5 shrink-0 animate-pulse" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-muted rounded w-4/5 animate-pulse" />
                      <div className="h-2.5 bg-muted rounded w-1/3 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex items-center gap-2 py-3 px-3 rounded-xl bg-muted/60 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                No recent activity
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div key={n.id} className="flex items-start gap-2">
                    <div className={cn('w-1.5 h-1.5 rounded-full mt-1.5 shrink-0', notifColors[n.type] ?? 'bg-muted-foreground')} />
                    <div className="min-w-0">
                      <p className="text-xs text-foreground leading-snug line-clamp-2">{n.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{timeAgo(n.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}
    </aside>
  );
}
