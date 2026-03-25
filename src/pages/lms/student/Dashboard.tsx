import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, Award, Eye, MoreVertical, Inbox, MessageCircle, Rocket,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ActiveBootcamp {
  id: string;
  title: string;
  description: string;
  groupChatLink: string | null;
  expiresAt: string;
}

interface EnrollmentRow {
  id: string;
  courseId: string;
  title: string;
  instructor: string;
  startedAt: string;
  progress: number;
  status: string;
}

interface StudyPoint {
  day: string;
  hours: number;
}

interface StudentDashboardData {
  enrolledCount: number;
  completedCount: number;
  enrollments: EnrollmentRow[];
  studyChart: StudyPoint[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-UG', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function SkeletonBox({ className }: { className: string }) {
  return <div className={`animate-pulse bg-slate-100 rounded-xl ${className}`} />;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  badge,
  progress,
  link,
  linkLabel,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  badge?: { text: string; color: string };
  progress?: number;
  link: string;
  linkLabel: string;
}) {
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
      {progress !== undefined && (
        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-primary-blue transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      <Link to={link} className="text-xs font-semibold text-primary-blue hover:underline">
        {linkLabel} →
      </Link>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function StudentDashboard() {
  const { user } = useAuth();
  const name = user?.name?.split(' ')[0] ?? 'Student';

  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bootcamps, setBootcamps] = useState<ActiveBootcamp[]>([]);

  const todayIndex = new Date().getDay();
  const dayOrder = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayLabel = dayOrder[todayIndex];

  useEffect(() => {
    api.get<StudentDashboardData>('/dashboard/student')
      .then(setData)
      .catch((err) => setError(err.message ?? 'Failed to load dashboard'))
      .finally(() => setLoading(false));

    fetch(`${import.meta.env.VITE_API_URL ?? ''}/api/bootcamps`)
      .then(r => r.json())
      .then(d => setBootcamps(d.bootcamps ?? []))
      .catch(() => {});
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

  const { enrolledCount, completedCount, enrollments, studyChart } = data;

  // avg progress across active enrollments
  const activeEnrollments = enrollments.filter((e) => e.status === 'ACTIVE');
  const avgProgress = activeEnrollments.length
    ? Math.round(activeEnrollments.reduce((s, e) => s + e.progress, 0) / activeEnrollments.length)
    : 0;

  const stats = [
    {
      label: 'Enrolled Courses',
      value: String(enrolledCount),
      icon: BookOpen,
      iconBg: 'bg-blue-50',
      iconColor: 'text-primary-blue',
      badge: { text: '● Active', color: 'bg-emerald-50 text-emerald-600' },
      progress: avgProgress,
      link: '/student/courses',
      linkLabel: 'View All',
    },
    {
      label: 'Completed Courses',
      value: String(completedCount),
      icon: Award,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      link: '/student/certificates',
      linkLabel: 'View Courses',
    },
  ];

  return (
    <div className="min-h-full bg-card p-4 md:p-6 space-y-6">

      {/* Page title */}
      <div>
        <h1 className="font-display text-xl font-extrabold text-foreground">
          Welcome back, {name} 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">Here's what's happening with your learning today.</p>
      </div>

      {/* Free Bootcamp WhatsApp banner */}
      {bootcamps.map(bc => (
        <div key={bc.id} className="rounded-2xl bg-gradient-to-r from-[#023064] to-[#0a1f5c] p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#E11D48] flex items-center justify-center shrink-0">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-bold bg-[#E11D48] text-white px-2 py-0.5 rounded-full uppercase tracking-wide">Free Bootcamp</span>
            </div>
            <p className="font-bold text-white text-sm">{bc.title}</p>
            <p className="text-blue-200 text-xs mt-0.5 line-clamp-1">{bc.description}</p>
          </div>
          {bc.groupChatLink && (
            <a href={bc.groupChatLink} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap shrink-0">
              <MessageCircle className="w-4 h-4" /> Join WhatsApp Group
            </a>
          )}
        </div>
      ))}

      {/* Row 1, Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}

        {/* Avg progress card */}
        <div className="bg-card rounded-2xl shadow-sm p-5 flex flex-col gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-violet-50">
            <BookOpen className="w-4 h-4 text-violet-600" />
          </div>
          <div>
            <p className="font-display text-3xl font-extrabold text-foreground leading-none">{avgProgress}%</p>
            <p className="text-xs font-medium text-muted-foreground mt-1">Avg Progress</p>
          </div>
          <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full rounded-full bg-violet-500 transition-all" style={{ width: `${avgProgress}%` }} />
          </div>
          <span className="text-xs text-muted-foreground">Across active courses</span>
        </div>

        {/* Total enrollments card */}
        <div className="bg-card rounded-2xl shadow-sm p-5 flex flex-col gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-amber-50">
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <p className="font-display text-3xl font-extrabold text-foreground leading-none">{enrollments.length}</p>
            <p className="text-xs font-medium text-muted-foreground mt-1">Total Enrollments</p>
          </div>
          <span className="text-xs text-muted-foreground">All time</span>
        </div>
      </div>

      {/* Row 2, Study chart + No upcoming sessions */}
      <div className="grid lg:grid-cols-5 gap-5">

        {/* Study Analytics, 60% */}
        <div className="lg:col-span-3 bg-card rounded-2xl shadow-sm p-6 flex flex-col gap-4">
          <div>
            <h2 className="font-display font-bold text-foreground text-base">Study Analytics</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Hours studied this week</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={studyChart} barSize={28} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
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
                domain={[0, 'dataMax + 1']}
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
                formatter={(v: number) => [`${v}h`, 'Hours']}
              />
              <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                {studyChart.map((entry) => (
                  <Cell
                    key={entry.day}
                    fill={entry.day === todayLabel ? '#023064' : '#e2e8f0'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Right panel, 40%: no live sessions, no assignment breakdown */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Upcoming Sessions, empty state */}
          <div className="bg-card rounded-2xl shadow-sm p-5 flex flex-col gap-3 flex-1">
            <h2 className="font-display font-bold text-foreground text-sm">Upcoming Sessions</h2>
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-2 py-6">
              <Inbox className="w-8 h-8 opacity-30" />
              <p className="text-sm">No upcoming sessions</p>
              <p className="text-xs text-center">Live sessions will appear here when scheduled.</p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="bg-card rounded-2xl shadow-sm p-5 space-y-3">
            <h2 className="font-display font-bold text-foreground text-sm">Progress Summary</h2>
            {activeEnrollments.length === 0 ? (
              <p className="text-xs text-muted-foreground">No active courses.</p>
            ) : (
              activeEnrollments.slice(0, 3).map((e) => (
                <div key={e.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground truncate max-w-[140px]">{e.title}</span>
                    <span className="text-xs font-semibold text-foreground">{e.progress}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary-blue transition-all"
                      style={{ width: `${e.progress}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Row 3, Continue Watching table */}
      <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
          <h2 className="font-display font-bold text-foreground text-base">Continue Watching</h2>
          <Link to="/student/courses" className="text-xs font-semibold text-primary-blue hover:underline">
            View All →
          </Link>
        </div>

        {enrollments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground gap-2">
            <BookOpen className="w-8 h-8 opacity-30" />
            <p className="text-sm">No courses enrolled yet</p>
            <Link to="/student/courses" className="text-xs font-semibold text-primary-blue hover:underline">
              Browse Courses →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="w-10 px-4 py-3">
                    <input type="checkbox" className="rounded border-slate-300 accent-primary-blue" />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Subject</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Started</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide min-w-[160px]">Progress</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Instructor</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((row) => (
                  <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3.5 text-center">
                      <input type="checkbox" className="rounded border-slate-300 accent-primary-blue" />
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-medium text-foreground text-sm">{row.title}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-muted-foreground">{formatDate(row.startedAt)}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary-blue transition-all"
                            style={{ width: `${row.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-muted-foreground shrink-0 w-8 text-right">
                          {row.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="w-7 h-7 rounded-full bg-primary-blue flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold">{getInitials(row.instructor)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <Link
                          to="/student/courses"
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-primary-blue hover:text-white flex items-center justify-center text-muted-foreground transition-colors"
                          title="View course"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-muted-foreground transition-colors"
                          title="More options"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
