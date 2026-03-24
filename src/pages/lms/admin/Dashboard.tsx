import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, BookOpen, FileText, TrendingUp,
  Activity, BarChart3, Star, Zap, CheckCircle, Inbox,
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
  if (amount >= 1_000_000) {
    return `UGX ${(amount / 1_000_000).toFixed(1)}M`;
  }
  return `UGX ${amount.toLocaleString('en-UG')}`;
}

function relativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays} days ago`;
}

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

// ─── Status badge styles ────────────────────────────────────────────────────

const statusStyles: Record<string, string> = {
  PENDING:      'bg-amber-50  text-amber-700  border border-amber-100',
  UNDER_REVIEW: 'bg-blue-50   text-blue-700   border border-blue-100',
  ACCEPTED:     'bg-emerald-50 text-emerald-700 border border-emerald-100',
  REJECTED:     'bg-red-50    text-red-700    border border-red-100',
  WAITLISTED:   'bg-purple-50 text-purple-700 border border-purple-100',
};
const statusLabel: Record<string, string> = {
  PENDING:      'Pending',
  UNDER_REVIEW: 'Under Review',
  ACCEPTED:     'Accepted',
  REJECTED:     'Rejected',
  WAITLISTED:   'Waitlisted',
};

// ─── Skeleton helpers ────────────────────────────────────────────────────────

function SkeletonBox({ className }: { className: string }) {
  return <div className={`animate-pulse bg-slate-100 rounded-xl ${className}`} />;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const now = new Date().toLocaleString('en-UG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  useEffect(() => {
    api.get<AdminDashboardData>('/dashboard/admin')
      .then(setData)
      .catch((err) => setError(err.message ?? 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="bg-background min-h-screen p-6 space-y-6">
        <div className="flex items-center justify-between">
          <SkeletonBox className="h-8 w-40" />
          <SkeletonBox className="h-7 w-44" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card rounded-2xl shadow-sm p-6 space-y-3">
              <SkeletonBox className="h-10 w-10" />
              <SkeletonBox className="h-9 w-24" />
              <SkeletonBox className="h-4 w-32" />
              <SkeletonBox className="h-5 w-20" />
            </div>
          ))}
        </div>
        <div className="grid lg:grid-cols-5 gap-5">
          <SkeletonBox className="lg:col-span-3 h-72" />
          <SkeletonBox className="lg:col-span-2 h-72" />
        </div>
        <div className="grid lg:grid-cols-5 gap-5">
          <SkeletonBox className="lg:col-span-3 h-56" />
          <SkeletonBox className="lg:col-span-2 h-56" />
        </div>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (error || !data) {
    return (
      <div className="bg-background min-h-screen p-6 flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground text-sm">{error ?? 'Something went wrong'}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-xs font-semibold text-[#023064] hover:underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { totalStudents, totalCourses, pendingApplications, monthlyRevenue, recentApplications, enrollmentChart } = data;

  // Platform overview progress bars (real data)
  const progressIndicators = [
    { label: 'Active Students',       value: totalStudents,        total: Math.max(totalStudents, 1) },
    { label: 'Active Courses',        value: totalCourses,         total: Math.max(totalCourses + 2, 1) },
    { label: 'Pending Applications',  value: pendingApplications,  total: Math.max(pendingApplications + 10, 1) },
  ];

  return (
    <div className="bg-background min-h-screen p-6 space-y-6">

      {/* ── Page title ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#023064]">Dashboard</h1>
        <span className="text-xs text-muted-foreground bg-card border border-border rounded-xl px-3 py-1.5">
          Last updated: {now}
        </span>
      </div>

      {/* ── Row 1, Stat cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        {/* Total Students */}
        <div className="bg-card rounded-2xl shadow-sm p-6 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Users className="w-5 h-5 text-[#023064]" />
          </div>
          <p className="text-3xl font-extrabold text-[#023064]">{totalStudents}</p>
          <p className="text-sm font-medium text-muted-foreground">Total Students</p>
          <span className="inline-block text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full px-2 py-0.5 w-fit">
            Active learners
          </span>
          <Link to="/admin/users" className="text-xs font-semibold text-[#023064] hover:underline mt-auto">
            View All →
          </Link>
        </div>

        {/* Active Courses */}
        <div className="bg-card rounded-2xl shadow-sm p-6 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-[#023064]" />
          </div>
          <p className="text-3xl font-extrabold text-[#023064]">{totalCourses}</p>
          <p className="text-sm font-medium text-muted-foreground">Active Courses</p>
          <span className="inline-block text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2 py-0.5 w-fit">
            Published
          </span>
          <Link to="/admin/courses" className="text-xs font-semibold text-[#023064] hover:underline mt-auto">
            View All →
          </Link>
        </div>

        {/* Pending Applications */}
        <div className="bg-card rounded-2xl shadow-sm p-6 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <FileText className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-extrabold text-[#023064]">{pendingApplications}</p>
          <p className="text-sm font-medium text-muted-foreground">Pending Applications</p>
          <span className="inline-block text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100 rounded-full px-2 py-0.5 w-fit">
            {pendingApplications > 0 ? 'Needs Review' : 'All Clear'}
          </span>
          <Link to="/admin/applications" className="text-xs font-semibold text-[#023064] hover:underline mt-auto">
            View Applications →
          </Link>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-card rounded-2xl shadow-sm p-6 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-[#023064]">{formatUGX(monthlyRevenue)}</p>
          <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
          <span className="inline-block text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full px-2 py-0.5 w-fit">
            This month
          </span>
          <Link to="/admin/invoices" className="text-xs font-semibold text-[#023064] hover:underline mt-auto">
            View Invoices →
          </Link>
        </div>

      </div>

      {/* ── Row 2, Enrollment chart + Recent Applications ─────────── */}
      <div className="grid lg:grid-cols-5 gap-5">

        {/* Enrollment Analytics (60%) */}
        <div className="lg:col-span-3 bg-card rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-bold text-[#023064] text-base">Enrollment Analytics</h2>
            <span className="text-xs text-muted-foreground bg-slate-100 rounded-lg px-2 py-1 font-medium">Last 6 Months</span>
          </div>
          <p className="text-xs text-muted-foreground mb-5">Monthly new student enrollments</p>
          {enrollmentChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={enrollmentChart} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                  cursor={{ fill: '#f4f4f9' }}
                />
                <Bar dataKey="enrollments" fill="#023064" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex flex-col items-center justify-center text-muted-foreground gap-2">
              <BarChart3 className="w-8 h-8 opacity-30" />
              <p className="text-sm">No enrollment data yet</p>
            </div>
          )}
        </div>

        {/* Recent Applications (40%) */}
        <div className="lg:col-span-2 bg-card rounded-2xl shadow-sm p-6 flex flex-col">
          <h2 className="font-bold text-[#023064] text-base mb-4">Recent Applications</h2>
          {recentApplications.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-2">
              <Inbox className="w-8 h-8 opacity-30" />
              <p className="text-sm">No applications yet</p>
            </div>
          ) : (
            <div className="space-y-3 flex-1">
              {recentApplications.map((app) => (
                <div key={app.id} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#023064] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {getInitials(app.fullName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{app.fullName}</p>
                    <p className="text-xs text-muted-foreground truncate">{app.programs[0] ?? '—'}</p>
                  </div>
                  <div className="text-right shrink-0 space-y-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold block ${statusStyles[app.status] ?? statusStyles['PENDING']}`}>
                      {statusLabel[app.status] ?? app.status}
                    </span>
                    <p className="text-[10px] text-muted-foreground">{relativeTime(app.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Link
            to="/admin/applications"
            className="mt-4 text-xs font-semibold text-[#023064] hover:underline"
          >
            View All Applications →
          </Link>
        </div>

      </div>

      {/* ── Row 3, Recent Activity (from applications) + Platform Overview ── */}
      <div className="grid lg:grid-cols-5 gap-5">

        {/* Recent Activity, applications feed (60%) */}
        <div className="lg:col-span-3 bg-card rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <Activity className="w-4 h-4 text-[#023064]" />
            <h2 className="font-bold text-[#023064] text-base">Recent Activity</h2>
          </div>
          {recentApplications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground gap-2">
              <Inbox className="w-8 h-8 opacity-30" />
              <p className="text-sm">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentApplications.map((app) => {
                const dotColor =
                  app.status === 'ACCEPTED' ? 'bg-emerald-500' :
                  app.status === 'REJECTED' ? 'bg-red-500' :
                  app.status === 'UNDER_REVIEW' ? 'bg-blue-500' :
                  app.status === 'WAITLISTED' ? 'bg-purple-500' :
                  'bg-amber-500';
                return (
                  <div key={app.id} className="flex items-start gap-3">
                    <span className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${dotColor}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground leading-snug">
                        New application from <span className="font-semibold">{app.fullName}</span>
                        {app.programs[0] ? `, ${app.programs[0]}` : ''}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{relativeTime(app.createdAt)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Platform Overview (40%) */}
        <div className="lg:col-span-2 bg-card rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="w-4 h-4 text-[#023064]" />
            <h2 className="font-bold text-[#023064] text-base">Platform Overview</h2>
          </div>

          {/* 3 big stat highlights */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="text-center bg-card rounded-xl p-3">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Zap className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <p className="text-lg font-extrabold text-[#023064]">99.9%</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Uptime</p>
            </div>
            <div className="text-center bg-card rounded-xl p-3">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <p className="text-lg font-extrabold text-[#023064]">4.8 ★</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Rating</p>
            </div>
            <div className="text-center bg-card rounded-xl p-3">
              <div className="flex items-center justify-center gap-1 mb-1">
                <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <p className="text-lg font-extrabold text-[#023064]">{totalStudents}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Active Users</p>
            </div>
          </div>

          {/* Progress bars */}
          <div className="space-y-3">
            {progressIndicators.map((item) => {
              const pct = Math.min(Math.round((item.value / item.total) * 100), 100);
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
                    <span className="text-xs font-bold text-[#023064]">{item.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#023064] transition-all"
                      style={{ width: `${pct}%` }}
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
