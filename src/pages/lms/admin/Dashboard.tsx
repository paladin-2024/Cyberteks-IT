import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, BookOpen, FileText, TrendingUp,
  BarChart3, Star, Zap, CheckCircle, Inbox,
  ArrowUpRight, Activity,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from 'recharts';
import { api } from '@/lib/api';

// ─── Types ───────────────────────────────────────────────────────────────────

interface RecentApplication {
  id: string;
  fullName: string;
  email: string;
  programs: string[];
  status: string;
  createdAt: string;
}

interface EnrollmentPoint {
  month: string;
  enrollments: number;
}

interface AdminDashboardData {
  totalStudents: number;
  totalCourses: number;
  pendingApplications: number;
  monthlyRevenue: number;
  recentApplications: RecentApplication[];
  enrollmentChart: EnrollmentPoint[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatUGX(amount: number): string {
  if (amount >= 1_000_000) return `UGX ${(amount / 1_000_000).toFixed(1)}M`;
  return `UGX ${amount.toLocaleString('en-UG')}`;
}

function relativeTime(dateStr: string): string {
  const diffMins  = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays  = Math.floor(diffHours / 24);
  if (diffMins  < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays  === 1) return 'Yesterday';
  return `${diffDays}d ago`;
}

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

// ─── Status styles ───────────────────────────────────────────────────────────

const statusStyles: Record<string, { pill: string; dot: string }> = {
  PENDING:      { pill: 'bg-amber-50 text-amber-700 border border-amber-100',     dot: 'bg-amber-400' },
  UNDER_REVIEW: { pill: 'bg-blue-50 text-blue-700 border border-blue-100',        dot: 'bg-blue-400' },
  ACCEPTED:     { pill: 'bg-emerald-50 text-emerald-700 border border-emerald-100', dot: 'bg-emerald-400' },
  REJECTED:     { pill: 'bg-red-50 text-red-700 border border-red-100',           dot: 'bg-red-400' },
  WAITLISTED:   { pill: 'bg-purple-50 text-purple-700 border border-purple-100',  dot: 'bg-purple-400' },
};
const statusLabel: Record<string, string> = {
  PENDING: 'Pending', UNDER_REVIEW: 'In Review', ACCEPTED: 'Accepted',
  REJECTED: 'Rejected', WAITLISTED: 'Waitlisted',
};

// ─── Stat Card ───────────────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ElementType;
  value: string | number;
  label: string;
  badge: string;
  badgeVariant: 'blue' | 'green' | 'amber' | 'red';
  href: string;
  linkLabel: string;
  accentColor: string;
}

const badgeClasses: Record<string, string> = {
  blue:  'bg-[#023064]/8 text-[#023064] border border-[#023064]/12',
  green: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  amber: 'bg-amber-50 text-amber-700 border border-amber-100',
  red:   'bg-rose-50 text-rose-700 border border-rose-100',
};

function StatCard({ icon: Icon, value, label, badge, badgeVariant, href, linkLabel, accentColor }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-4 hover:shadow-md hover:shadow-gray-100 transition-shadow group">
      <div className="flex items-start justify-between">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${accentColor}12` }}>
          <Icon className="w-5 h-5" style={{ color: accentColor }} />
        </div>
        <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${badgeClasses[badgeVariant]}`}>
          {badge}
        </span>
      </div>
      <div>
        <p className="text-3xl font-bold text-gray-900 tracking-tight leading-none">{value}</p>
        <p className="text-sm text-gray-500 mt-1.5">{label}</p>
      </div>
      <Link
        to={href}
        className="inline-flex items-center gap-1 text-xs font-semibold mt-auto pt-2 border-t border-gray-50 text-gray-400 hover:text-[#023064] transition-colors group-hover:border-gray-100"
      >
        {linkLabel}
        <ArrowUpRight className="w-3 h-3" />
      </Link>
    </div>
  );
}

// ─── Custom Tooltip ──────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl px-3 py-2.5 shadow-lg shadow-gray-200/60">
      <p className="text-xs font-semibold text-gray-500 mb-1">{label}</p>
      <p className="text-base font-bold text-[#023064]">{payload[0].value} enrollments</p>
    </div>
  );
}

// ─── Loading skeleton ────────────────────────────────────────────────────────

function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse bg-gray-100 rounded-xl ${className}`} />;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [data, setData]       = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    api.get<AdminDashboardData>('/dashboard/admin')
      .then(setData)
      .catch((err) => setError(err.message ?? 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen p-6 space-y-6 bg-gray-50/40">
        <div className="flex items-center justify-between">
          <div className="space-y-2"><Skeleton className="h-7 w-40" /><Skeleton className="h-4 w-56" /></div>
          <Skeleton className="h-9 w-44 rounded-full" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-44 rounded-2xl" />)}
        </div>
        <div className="grid lg:grid-cols-5 gap-5">
          <Skeleton className="lg:col-span-3 h-72 rounded-2xl" />
          <Skeleton className="lg:col-span-2 h-72 rounded-2xl" />
        </div>
        <div className="grid lg:grid-cols-5 gap-5">
          <Skeleton className="lg:col-span-3 h-56 rounded-2xl" />
          <Skeleton className="lg:col-span-2 h-56 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center bg-gray-50/40">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto">
            <Activity className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-gray-500 text-sm">{error ?? 'Something went wrong'}</p>
          <button onClick={() => window.location.reload()}
            className="text-xs font-semibold text-[#023064] hover:underline">Retry</button>
        </div>
      </div>
    );
  }

  const { totalStudents, totalCourses, pendingApplications, monthlyRevenue, recentApplications, enrollmentChart } = data;

  const progressIndicators = [
    { label: 'Active Students',      value: totalStudents,       total: Math.max(totalStudents, 1) },
    { label: 'Active Courses',       value: totalCourses,        total: Math.max(totalCourses + 2, 1) },
    { label: 'Pending Applications', value: pendingApplications, total: Math.max(pendingApplications + 10, 1) },
  ];

  return (
    <div className="min-h-screen p-6 space-y-6 bg-gray-50/40">

      {/* ── Page header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 leading-none">Platform Overview</h1>
          <p className="text-sm text-gray-400 mt-1">Here's what's happening across your LMS today.</p>
        </div>
        <Link to="/admin/applications"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#023064] text-white text-xs font-semibold hover:bg-[#031d4a] transition-colors shadow-sm shadow-[#023064]/20">
          <Inbox className="w-3.5 h-3.5" />
          Applications
          {pendingApplications > 0 && (
            <span className="bg-[#E11D48] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
              {pendingApplications}
            </span>
          )}
        </Link>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Users}     value={totalStudents}          label="Total Students"       badge="Active learners" badgeVariant="blue"  href="/admin/users"         linkLabel="View all users"        accentColor="#023064" />
        <StatCard icon={BookOpen}  value={totalCourses}           label="Active Courses"       badge="Published"      badgeVariant="blue"  href="/admin/courses"       linkLabel="Manage courses"        accentColor="#023064" />
        <StatCard icon={FileText}  value={pendingApplications}    label="Pending Applications" badge={pendingApplications > 0 ? 'Needs Review' : 'All Clear'} badgeVariant="amber" href="/admin/applications" linkLabel="View applications" accentColor="#d97706" />
        <StatCard icon={TrendingUp} value={formatUGX(monthlyRevenue)} label="Monthly Revenue" badge="This month"     badgeVariant="green" href="/admin/invoices"      linkLabel="View invoices"         accentColor="#059669" />
      </div>

      {/* ── Row 2: Chart + Recent Applications ── */}
      <div className="grid lg:grid-cols-5 gap-5">

        {/* Enrollment chart */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="font-bold text-gray-900 text-base leading-none">Enrollment Analytics</h2>
              <p className="text-xs text-gray-400 mt-1.5">Monthly new student enrollments · Last 6 months</p>
            </div>
            <span className="text-[10px] font-semibold text-gray-400 bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1.5">6 Months</span>
          </div>

          {enrollmentChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={enrollmentChart} barCategoryGap="40%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f8fafc', radius: 8 }} />
                <Bar dataKey="enrollments" radius={[8, 8, 0, 0]}
                  fill="url(#barGradient)" />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#023064" stopOpacity={1} />
                    <stop offset="100%" stopColor="#023064" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex flex-col items-center justify-center text-gray-300 gap-2">
              <BarChart3 className="w-10 h-10" />
              <p className="text-sm text-gray-400">No enrollment data yet</p>
            </div>
          )}
        </div>

        {/* Recent Applications */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900 text-base leading-none">Recent Applications</h2>
            <Link to="/admin/applications"
              className="text-[10px] font-semibold text-[#023064] hover:underline flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {recentApplications.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-300 gap-2">
              <Inbox className="w-10 h-10" />
              <p className="text-sm text-gray-400">No applications yet</p>
            </div>
          ) : (
            <div className="space-y-4 flex-1">
              {recentApplications.map((app) => {
                const st = statusStyles[app.status] ?? statusStyles['PENDING'];
                return (
                  <div key={app.id} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#023064] to-[#034087] text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                      {getInitials(app.fullName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate leading-tight">{app.fullName}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{app.programs[0] ?? '—'}</p>
                    </div>
                    <div className="text-right shrink-0 space-y-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold block ${st.pill}`}>
                        {statusLabel[app.status] ?? app.status}
                      </span>
                      <p className="text-[10px] text-gray-400">{relativeTime(app.createdAt)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* ── Row 3: Activity feed + Platform Overview ── */}
      <div className="grid lg:grid-cols-5 gap-5">

        {/* Activity feed */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-xl bg-[#023064]/8 flex items-center justify-center">
              <Activity className="w-4 h-4 text-[#023064]" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base leading-none">Recent Activity</h2>
              <p className="text-xs text-gray-400 mt-0.5">Latest application submissions</p>
            </div>
          </div>

          {recentApplications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-300 gap-2">
              <Inbox className="w-10 h-10" />
              <p className="text-sm text-gray-400">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-0 divide-y divide-gray-50">
              {recentApplications.map((app) => {
                const st = statusStyles[app.status] ?? statusStyles['PENDING'];
                return (
                  <div key={app.id} className="flex items-start gap-3 py-3.5 first:pt-0">
                    <div className="mt-1 shrink-0">
                      <span className={`w-2 h-2 rounded-full block ${st.dot}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 leading-snug">
                        New application from{' '}
                        <span className="font-semibold text-gray-900">{app.fullName}</span>
                        {app.programs[0] ? <span className="text-gray-500"> · {app.programs[0]}</span> : ''}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{relativeTime(app.createdAt)}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 ${st.pill}`}>
                      {statusLabel[app.status] ?? app.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Platform Overview */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-xl bg-[#023064]/8 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-[#023064]" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base leading-none">Platform Overview</h2>
              <p className="text-xs text-gray-400 mt-0.5">Current platform metrics</p>
            </div>
          </div>

          {/* Highlight metrics */}
          <div className="grid grid-cols-3 gap-2.5 mb-6">
            {[
              { icon: Zap,         value: '99.9%',          label: 'Uptime',      color: 'text-emerald-500', bg: 'bg-emerald-50' },
              { icon: Star,        value: '4.8★',           label: 'Rating',      color: 'text-amber-500',   bg: 'bg-amber-50' },
              { icon: CheckCircle, value: totalStudents,    label: 'Active Users', color: 'text-[#023064]',  bg: 'bg-[#023064]/8' },
            ].map((m) => (
              <div key={m.label} className="text-center bg-gray-50/60 rounded-xl p-3">
                <div className={`w-7 h-7 rounded-lg ${m.bg} flex items-center justify-center mx-auto mb-2`}>
                  <m.icon className={`w-3.5 h-3.5 ${m.color}`} />
                </div>
                <p className="text-sm font-bold text-gray-800 leading-none">{m.value}</p>
                <p className="text-[10px] text-gray-400 mt-1">{m.label}</p>
              </div>
            ))}
          </div>

          {/* Progress bars */}
          <div className="space-y-4">
            {progressIndicators.map((item) => {
              const pct = Math.min(Math.round((item.value / item.total) * 100), 100);
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-gray-600">{item.label}</span>
                    <span className="text-xs font-bold text-[#023064]">{item.value}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        background: 'linear-gradient(90deg, #023064, #034087)',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
