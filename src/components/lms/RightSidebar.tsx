import { useState, useEffect } from 'react';
import {
  Calendar, Bell, Clock, BookOpen, Award, ChevronLeft, ChevronRight,
  ClipboardList, Users, TrendingUp, CheckCircle2, AlertCircle, Flame,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface UpcomingAssignment {
  id: string; title: string; course: string; dueDate: string; status: string;
}

interface RecentNotification {
  id: string; title: string; body: string; type: string; isRead: boolean; createdAt: string;
}

interface TeacherStats {
  totalCourses: number; totalStudents: number; avgProgress: number; completionRate: number;
}

interface StudentStats {
  totalCourses: number; completedCourses: number; avgProgress: number; totalAssignments: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatDueDate(iso: string): string {
  const due     = new Date(iso);
  const diffMs  = due.getTime() - Date.now();
  const diffDays = Math.ceil(diffMs / 86400000);
  if (diffMs   < 0)  return 'Past due';
  if (diffDays === 0) return 'Due today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays <= 7)  return `${diffDays}d left`;
  return due.toLocaleDateString('en-UG', { month: 'short', day: 'numeric' });
}

function urgencyColor(iso: string) {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff < 0)                         return { bg: 'bg-red-100',    text: 'text-red-600',    dot: 'bg-red-500' };
  if (diff < 3 * 24 * 60 * 60 * 1000)  return { bg: 'bg-amber-100',  text: 'text-amber-600',  dot: 'bg-amber-400' };
  return                                       { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-400' };
}

const notifDot: Record<string, string> = {
  INFO:    'bg-[#023064]',
  SUCCESS: 'bg-emerald-500',
  WARNING: 'bg-amber-400',
  ERROR:   'bg-red-500',
};

// ─── Stat Grid ────────────────────────────────────────────────────────────────

function StatItem({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string | number; color: string }) {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-3 text-center gap-1">
      <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', `${color}/10`)}>
        <Icon className={cn('w-3.5 h-3.5', color)} />
      </div>
      <p className="font-bold text-gray-800 text-sm leading-none">{value}</p>
      <p className="text-[10px] text-gray-400 leading-tight">{label}</p>
    </div>
  );
}

function TeacherStatGrid({ stats }: { stats: TeacherStats | null }) {
  if (!stats) return (
    <div className="grid grid-cols-2 gap-2">
      {[1,2,3,4].map(i => <div key={i} className="bg-gray-50 rounded-xl h-16 animate-pulse" />)}
    </div>
  );
  return (
    <div className="grid grid-cols-2 gap-2">
      <StatItem icon={BookOpen}   label="Courses"    value={stats.totalCourses}          color="text-[#023064]" />
      <StatItem icon={Users}      label="Students"   value={stats.totalStudents}         color="text-teal-600" />
      <StatItem icon={TrendingUp} label="Avg Progress" value={`${stats.avgProgress}%`}  color="text-amber-500" />
      <StatItem icon={Award}      label="Completion" value={`${stats.completionRate}%`} color="text-emerald-600" />
    </div>
  );
}

function StudentStatGrid({ stats }: { stats: StudentStats | null }) {
  if (!stats) return (
    <div className="grid grid-cols-2 gap-2">
      {[1,2,3,4].map(i => <div key={i} className="bg-gray-50 rounded-xl h-16 animate-pulse" />)}
    </div>
  );
  return (
    <div className="grid grid-cols-2 gap-2">
      <StatItem icon={BookOpen}      label="Enrolled"    value={stats.totalCourses}     color="text-[#023064]" />
      <StatItem icon={CheckCircle2}  label="Completed"   value={stats.completedCourses} color="text-emerald-600" />
      <StatItem icon={TrendingUp}    label="Progress"    value={`${stats.avgProgress}%`} color="text-amber-500" />
      <StatItem icon={ClipboardList} label="Assignments" value={stats.totalAssignments}  color="text-[#023064]" />
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function RightSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const role = user?.role?.toUpperCase() ?? 'STUDENT';

  const [assignments,    setAssignments]    = useState<UpcomingAssignment[]>([]);
  const [notifications,  setNotifications]  = useState<RecentNotification[]>([]);
  const [teacherStats,   setTeacherStats]   = useState<TeacherStats | null>(null);
  const [studentStats,   setStudentStats]   = useState<StudentStats | null>(null);
  const [loadingAssign,  setLoadingAssign]  = useState(true);
  const [loadingNotif,   setLoadingNotif]   = useState(true);
  const [loadingStats,   setLoadingStats]   = useState(true);

  useEffect(() => {
    if (!user) return;

    api.get<{ assignments: UpcomingAssignment[] }>('/assignments')
      .then(({ assignments }) => {
        const sorted = (assignments ?? [])
          .filter(a => a.status !== 'DRAFT')
          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
          .slice(0, 4);
        setAssignments(sorted);
      })
      .catch(() => {})
      .finally(() => setLoadingAssign(false));

    api.get<{ notifications: RecentNotification[] }>('/notifications')
      .then(({ notifications }) => setNotifications((notifications ?? []).slice(0, 5)))
      .catch(() => {})
      .finally(() => setLoadingNotif(false));

    if (role === 'TEACHER') {
      api.get<{ kpis: TeacherStats }>('/analytics/teacher')
        .then(({ kpis }) => setTeacherStats(kpis ?? null))
        .catch(() => setTeacherStats({ totalCourses: 0, totalStudents: 0, avgProgress: 0, completionRate: 0 }))
        .finally(() => setLoadingStats(false));
    } else if (role === 'STUDENT') {
      api.get<{ enrollments: { progressPercent: number; status: string }[] }>('/enrollments')
        .then(({ enrollments }) => {
          const enrs     = enrollments ?? [];
          const completed = enrs.filter(e => e.status === 'COMPLETED').length;
          const avg       = enrs.length > 0
            ? Math.round(enrs.reduce((s, e) => s + e.progressPercent, 0) / enrs.length)
            : 0;
          setStudentStats({ totalCourses: enrs.length, completedCourses: completed, avgProgress: avg, totalAssignments: 0 });
        })
        .catch(() => setStudentStats({ totalCourses: 0, completedCourses: 0, avgProgress: 0, totalAssignments: 0 }))
        .finally(() => setLoadingStats(false));
    } else {
      setLoadingStats(false);
    }
  }, [user, role]);

  useEffect(() => {
    if (role === 'STUDENT' && studentStats) {
      setStudentStats(prev => prev ? { ...prev, totalAssignments: assignments.length } : prev);
    }
  }, [assignments, role]);

  return (
    <aside className={cn(
      'hidden xl:flex flex-col h-full bg-white border-l border-gray-100 transition-all duration-300 shrink-0 overflow-hidden',
      collapsed ? 'w-12' : 'w-72'
    )}>

      {/* Header */}
      <div className="flex items-center justify-between h-16 px-3 border-b border-gray-100 shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-[#023064] to-[#E11D48]" />
            <span className="text-sm font-bold text-gray-800">Quick Overview</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-[#023064] hover:bg-[#023064]/6 transition-all',
            collapsed && 'mx-auto'
          )}
        >
          {collapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {!collapsed && (
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">

          {/* Stats */}
          {(role === 'TEACHER' || role === 'STUDENT') && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Flame className="w-3.5 h-3.5 text-[#E11D48]" />
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">
                  {role === 'TEACHER' ? 'My Overview' : 'My Progress'}
                </h3>
              </div>
              {role === 'TEACHER'
                ? <TeacherStatGrid stats={loadingStats ? null : teacherStats} />
                : <StudentStatGrid stats={loadingStats ? null : studentStats} />
              }
            </div>
          )}

          {/* Upcoming assignments */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-3.5 h-3.5 text-[#023064]" />
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">
                {role === 'TEACHER' ? 'My Assignments' : 'Upcoming'}
              </h3>
            </div>

            {loadingAssign ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-start gap-2.5 animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-gray-100 mt-1.5 shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-gray-100 rounded w-3/4" />
                      <div className="h-2.5 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : assignments.length === 0 ? (
              <div className="flex items-center gap-2 py-3 px-3 rounded-xl bg-gray-50 text-xs text-gray-400">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                No upcoming assignments
              </div>
            ) : (
              <div className="space-y-2">
                {assignments.map(a => {
                  const u = urgencyColor(a.dueDate);
                  return (
                    <div key={a.id} className="flex items-start gap-2.5 group">
                      <div className={cn('w-1.5 h-1.5 rounded-full mt-1.5 shrink-0', u.dot)} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-700 truncate leading-tight">{a.title}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[10px] text-gray-400 truncate">{a.course}</span>
                          <span className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-md text-center"
                            style={{ background: 'inherit' }}>
                            <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-md', u.bg, u.text)}>
                              {formatDueDate(a.dueDate)}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Bell className="w-3.5 h-3.5 text-[#023064]" />
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">
                Recent Activity
              </h3>
            </div>

            {loadingNotif ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-start gap-2 animate-pulse">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-100 mt-1.5 shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-gray-100 rounded w-4/5" />
                      <div className="h-2.5 bg-gray-100 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex items-center gap-2 py-3 px-3 rounded-xl bg-gray-50 text-xs text-gray-400">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                No recent activity
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map(n => (
                  <div key={n.id} className="flex items-start gap-2.5">
                    <div className={cn('w-1.5 h-1.5 rounded-full mt-1.5 shrink-0', notifDot[n.type] ?? 'bg-gray-300')} />
                    <div className="min-w-0">
                      <p className={cn('text-xs leading-snug line-clamp-2', n.isRead ? 'text-gray-500' : 'text-gray-700 font-medium')}>{n.title}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{timeAgo(n.createdAt)}</p>
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
