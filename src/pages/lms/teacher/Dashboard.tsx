import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, Users, Eye, Clock,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface RecentStudent {
  name: string;
  email: string;
  course: string;
  enrolled: string;
  progress: number;
}

interface CourseItem {
  id: string;
  title: string;
  status: string;
  enrollmentCount: number;
  completedCount: number;
  avgProgress: number;
}

interface CompletionBreakdown {
  completed: number;
  inProgress: number;
  notStarted: number;
}

interface ActivityPoint {
  day: string;
  students: number;
}

interface TeacherDashboardData {
  myCourses: number;
  totalStudents: number;
  recentStudents: RecentStudent[];
  coursesList: CourseItem[];
  completionBreakdown: CompletionBreakdown;
  activityChart: ActivityPoint[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-UG', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function getInitials(name: string | null): string {
  if (!name) return '??';
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

const courseColors = ['#023064', '#E11D48', '#059669', '#7c3aed', '#d97706'];

// ─── Skeleton ────────────────────────────────────────────────────────────────

function SkeletonBox({ className }: { className: string }) {
  return <div className={`animate-pulse bg-slate-100 rounded-xl ${className}`} />;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  badge?: { text: string; color: string };
  link: string;
  linkLabel: string;
}

function StatCard({ label, value, icon: Icon, iconBg, iconColor, badge, link, linkLabel }: StatCardProps) {
  return (
    <div className="bg-card rounded-2xl shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        {badge && (
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badge.color}`}>
            {badge.text}
          </span>
        )}
      </div>
      <div>
        <p className="font-display text-3xl font-extrabold text-foreground leading-none">{value}</p>
        <p className="text-xs font-medium text-muted-foreground mt-1">{label}</p>
      </div>
      <Link to={link} className="text-xs font-semibold text-primary-blue hover:underline">
        {linkLabel} →
      </Link>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function TeacherDashboard() {
  const { user } = useAuth();
  const name = user?.name?.split(' ')[0] ?? 'Instructor';

  const [data, setData] = useState<TeacherDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const todayIndex = new Date().getDay();
  const dayOrder = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayLabel = dayOrder[todayIndex];

  useEffect(() => {
    api.get<TeacherDashboardData>('/dashboard/teacher')
      .then(setData)
      .catch((err) => setError(err.message ?? 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-full bg-card p-4 md:p-6 space-y-6">
        <SkeletonBox className="h-10 w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <SkeletonBox key={i} className="h-32" />)}
        </div>
        <div className="grid lg:grid-cols-5 gap-5">
          <SkeletonBox className="lg:col-span-3 h-72" />
          <SkeletonBox className="lg:col-span-2 h-72" />
        </div>
        <SkeletonBox className="h-64" />
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error || !data) {
    return (
      <div className="min-h-full bg-card p-6 flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground text-sm">{error ?? 'Something went wrong'}</p>
          <button onClick={() => window.location.reload()} className="text-xs font-semibold text-primary-blue hover:underline">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { myCourses, totalStudents, recentStudents, coursesList, completionBreakdown, activityChart } = data;
  const { completed, inProgress, notStarted } = completionBreakdown;

  const stats: StatCardProps[] = [
    {
      label: 'My Courses',
      value: String(myCourses),
      icon: BookOpen,
      iconBg: 'bg-blue-50',
      iconColor: 'text-primary-blue',
      badge: { text: '● Active', color: 'bg-emerald-50 text-emerald-600' },
      link: '/teacher/courses',
      linkLabel: 'View All',
    },
    {
      label: 'Total Students',
      value: String(totalStudents),
      icon: Users,
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600',
      link: '/teacher/students',
      linkLabel: 'View All',
    },
  ];

  return (
    <div className="min-h-full bg-card p-4 md:p-6 space-y-6">

      {/* Page title */}
      <div>
        <h1 className="font-display text-xl font-extrabold text-foreground">
          Hello, {name} 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">Here's an overview of your teaching activity.</p>
      </div>

      {/* Row 1, Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
        {/* Total enrollments card */}
        <div className="bg-card rounded-2xl shadow-sm p-5 flex flex-col gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-emerald-50">
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <p className="font-display text-3xl font-extrabold text-foreground leading-none">
              {coursesList.reduce((s, c) => s + c.enrollmentCount, 0)}
            </p>
            <p className="text-xs font-medium text-muted-foreground mt-1">Total Enrollments</p>
          </div>
          <span className="text-xs text-muted-foreground">Across all courses</span>
        </div>
        {/* Completed card */}
        <div className="bg-card rounded-2xl shadow-sm p-5 flex flex-col gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-amber-50">
            <BookOpen className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <p className="font-display text-3xl font-extrabold text-foreground leading-none">
              {coursesList.reduce((s, c) => s + c.completedCount, 0)}
            </p>
            <p className="text-xs font-medium text-muted-foreground mt-1">Completions</p>
          </div>
          <span className="text-xs text-muted-foreground">Students finished</span>
        </div>
      </div>

      {/* Row 2, Activity chart + Active Courses */}
      <div className="grid lg:grid-cols-5 gap-5">

        {/* Student Activity chart, 60% */}
        <div className="lg:col-span-3 bg-card rounded-2xl shadow-sm p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-foreground text-base">Student Activity</h2>
              <p className="text-xs text-muted-foreground mt-0.5">New enrollments per day this week</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={activityChart} barSize={28} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#94a3b8' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                domain={[0, 'dataMax + 2']}
              />
              <Tooltip
                cursor={{ fill: 'transparent' }}
                contentStyle={{
                  background: '#1e293b',
                  border: 'none',
                  borderRadius: 8,
                  color: '#f8fafc',
                  fontSize: 12,
                }}
                formatter={(v: number) => [`${v} students`, 'Active']}
              />
              <Bar dataKey="students" radius={[6, 6, 0, 0]}>
                {activityChart.map((entry) => (
                  <Cell
                    key={entry.day}
                    fill={entry.day === todayLabel ? '#023064' : '#e2e8f0'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Active Courses + completion breakdown, 40% */}
        <div className="lg:col-span-2 bg-card rounded-2xl shadow-sm p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-foreground text-sm">Active Courses</h2>
            <Link to="/teacher/courses" className="text-[11px] font-semibold text-primary-blue hover:underline">
              View All →
            </Link>
          </div>

          {coursesList.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-2 py-6">
              <BookOpen className="w-8 h-8 opacity-30" />
              <p className="text-sm">No courses yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {coursesList.slice(0, 3).map((c, idx) => (
                <div
                  key={c.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-border transition-colors"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white text-xs font-bold"
                    style={{ backgroundColor: courseColors[idx % courseColors.length] }}
                  >
                    {c.title.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{c.title}</p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {c.enrollmentCount} student{c.enrollmentCount !== 1 ? 's' : ''} · {c.completedCount} completed
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${c.avgProgress}%`, backgroundColor: courseColors[idx % courseColors.length] }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground shrink-0">{c.avgProgress}%</span>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {c.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Course Completion breakdown */}
          <div className="pt-2 border-t border-slate-100">
            <p className="text-xs font-semibold text-foreground mb-2">Course Completion</p>
            <div className="flex h-2.5 rounded-full overflow-hidden gap-0.5">
              <div className="rounded-l-full bg-emerald-500" style={{ width: `${completed}%` }} />
              <div className="bg-primary-blue" style={{ width: `${inProgress}%` }} />
              <div className="rounded-r-full bg-slate-200" style={{ width: `${notStarted || Math.max(100 - completed - inProgress, 0)}%` }} />
            </div>
            <div className="flex gap-4 mt-2">
              {[
                { label: 'Completed',   pct: completed,   dot: 'bg-emerald-500' },
                { label: 'In Progress', pct: inProgress,  dot: 'bg-primary-blue' },
                { label: 'Not Started', pct: notStarted,  dot: 'bg-slate-300' },
              ].map(({ label, pct, dot }) => (
                <div key={label} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
                  {label} <span className="font-semibold text-foreground">{pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3, Recent Students table */}
      <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
          <h2 className="font-display font-bold text-foreground text-base">Recent Students</h2>
          <Link to="/teacher/students" className="text-xs font-semibold text-primary-blue hover:underline">
            View All →
          </Link>
        </div>

        {recentStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground gap-2">
            <Users className="w-8 h-8 opacity-30" />
            <p className="text-sm">No students enrolled yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Course</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Enrolled</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide min-w-[120px]">Progress</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">View</th>
                </tr>
              </thead>
              <tbody>
                {recentStudents.map((s, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary-blue flex items-center justify-center shrink-0">
                          <span className="text-white text-[10px] font-bold">{getInitials(s.name)}</span>
                        </div>
                        <span className="font-medium text-foreground text-xs whitespace-nowrap">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{s.course}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(s.enrolled)}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary-blue transition-all"
                            style={{ width: `${s.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-muted-foreground shrink-0 w-7 text-right">
                          {s.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <Link
                        to="/teacher/students"
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-primary-blue hover:text-white flex items-center justify-center text-muted-foreground transition-colors"
                        title="View student"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
