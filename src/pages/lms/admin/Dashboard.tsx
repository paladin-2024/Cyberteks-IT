import { Link } from 'react-router-dom';
import {
  Users, BookOpen, FileText, TrendingUp,
  Activity, BarChart3, Star, Zap, CheckCircle,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from 'recharts';

// ─── Data ──────────────────────────────────────────────────────────────────

const enrollmentData = [
  { month: 'Jan', enrollments: 18 },
  { month: 'Feb', enrollments: 25 },
  { month: 'Mar', enrollments: 32 },
  { month: 'Apr', enrollments: 28 },
  { month: 'May', enrollments: 41 },
  { month: 'Jun', enrollments: 38 },
];

const recentApplications = [
  { name: 'Aisha Nakato',     initials: 'AN', program: 'Web Development',  status: 'PENDING',      date: 'Today, 9:14 AM' },
  { name: 'David Ochieng',    initials: 'DO', program: 'Cybersecurity',    status: 'UNDER_REVIEW', date: 'Yesterday' },
  { name: 'Grace Atuhaire',   initials: 'GA', program: 'Data Analysis',    status: 'ACCEPTED',     date: '2 days ago' },
  { name: 'Moses Ssemakula',  initials: 'MS', program: 'AI & ML',          status: 'PENDING',      date: '3 days ago' },
  { name: 'Priscilla Akello', initials: 'PA', program: 'Networking',       status: 'REJECTED',     date: '4 days ago' },
];

const activityFeed = [
  { dot: 'bg-blue-500',    text: 'New student enrolled in Web Dev',       time: '2 hours ago' },
  { dot: 'bg-emerald-500', text: 'Application approved — Grace Atuhaire', time: '3 hours ago' },
  { dot: 'bg-amber-500',   text: 'Payment overdue — Invoice #1042',       time: '5 hours ago' },
  { dot: 'bg-violet-500',  text: 'New course published: AI & Robotics',   time: '8 hours ago' },
  { dot: 'bg-blue-400',    text: '12 new registrations this week',        time: 'Today' },
];

const progressIndicators = [
  { label: 'Students',               value: 204, total: 248 },
  { label: 'Courses Active',         value: 14,  total: 20  },
  { label: 'Applications Pending',   value: 37,  total: 50  },
  { label: 'Revenue (% of target)',  value: 82,  total: 100 },
];

// ─── Status badge styles ────────────────────────────────────────────────────

const statusStyles: Record<string, string> = {
  PENDING:      'bg-amber-50  text-amber-700  border border-amber-100',
  UNDER_REVIEW: 'bg-blue-50   text-blue-700   border border-blue-100',
  ACCEPTED:     'bg-emerald-50 text-emerald-700 border border-emerald-100',
  REJECTED:     'bg-red-50    text-red-700    border border-red-100',
};
const statusLabel: Record<string, string> = {
  PENDING:      'Pending',
  UNDER_REVIEW: 'Under Review',
  ACCEPTED:     'Accepted',
  REJECTED:     'Rejected',
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const now = new Date().toLocaleString('en-UG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className="bg-[#f4f4f9] min-h-screen p-6 space-y-6">

      {/* ── Page title ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#023064]">Dashboard</h1>
        <span className="text-xs text-slate-500 bg-white border border-slate-200 rounded-xl px-3 py-1.5">
          Last updated: {now}
        </span>
      </div>

      {/* ── Row 1 — Stat cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        {/* Total Students */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Users className="w-5 h-5 text-[#023064]" />
          </div>
          <p className="text-3xl font-extrabold text-[#023064]">248</p>
          <p className="text-sm font-medium text-slate-500">Total Students</p>
          <span className="inline-block text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full px-2 py-0.5 w-fit">
            ↑ +12 this month
          </span>
          <Link to="/admin/users" className="text-xs font-semibold text-[#023064] hover:underline mt-auto">
            View All →
          </Link>
        </div>

        {/* Active Courses */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-[#023064]" />
          </div>
          <p className="text-3xl font-extrabold text-[#023064]">14</p>
          <p className="text-sm font-medium text-slate-500">Active Courses</p>
          <span className="inline-block text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2 py-0.5 w-fit">
            ↑ +2 this month
          </span>
          <Link to="/admin/courses" className="text-xs font-semibold text-[#023064] hover:underline mt-auto">
            View All →
          </Link>
        </div>

        {/* Pending Applications */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <FileText className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-extrabold text-[#023064]">37</p>
          <p className="text-sm font-medium text-slate-500">Pending Applications</p>
          <span className="inline-block text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100 rounded-full px-2 py-0.5 w-fit">
            Needs Review
          </span>
          <Link to="/admin/applications" className="text-xs font-semibold text-[#023064] hover:underline mt-auto">
            View Applications →
          </Link>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-[#023064]">UGX 12.4M</p>
          <p className="text-sm font-medium text-slate-500">Monthly Revenue</p>
          <span className="inline-block text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full px-2 py-0.5 w-fit">
            ↑ This month
          </span>
          <Link to="/admin/invoices" className="text-xs font-semibold text-[#023064] hover:underline mt-auto">
            View Invoices →
          </Link>
        </div>

      </div>

      {/* ── Row 2 — Enrollment chart + Recent Applications ─────────── */}
      <div className="grid lg:grid-cols-5 gap-5">

        {/* Enrollment Analytics (60%) */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-bold text-[#023064] text-base">Enrollment Analytics</h2>
            <span className="text-xs text-slate-400 bg-slate-100 rounded-lg px-2 py-1 font-medium">This Year</span>
          </div>
          <p className="text-xs text-slate-400 mb-5">Monthly new student enrollments (Jan – Jun)</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={enrollmentData} barCategoryGap="35%">
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
        </div>

        {/* Recent Applications (40%) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 flex flex-col">
          <h2 className="font-bold text-[#023064] text-base mb-4">Recent Applications</h2>
          <div className="space-y-3 flex-1">
            {recentApplications.map((app) => (
              <div key={app.name} className="flex items-center gap-3">
                {/* Initials avatar */}
                <div className="w-9 h-9 rounded-full bg-[#023064] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {app.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{app.name}</p>
                  <p className="text-xs text-slate-400 truncate">{app.program}</p>
                </div>
                <div className="text-right shrink-0 space-y-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold block ${statusStyles[app.status]}`}>
                    {statusLabel[app.status]}
                  </span>
                  <p className="text-[10px] text-slate-400">{app.date}</p>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/admin/applications"
            className="mt-4 text-xs font-semibold text-[#023064] hover:underline"
          >
            View All Applications →
          </Link>
        </div>

      </div>

      {/* ── Row 3 — Recent Activity + Platform Overview ─────────────── */}
      <div className="grid lg:grid-cols-5 gap-5">

        {/* Recent Activity (60%) */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <Activity className="w-4 h-4 text-[#023064]" />
            <h2 className="font-bold text-[#023064] text-base">Recent Activity</h2>
          </div>
          <div className="space-y-4">
            {activityFeed.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${item.dot}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 leading-snug">{item.text}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Overview (40%) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="w-4 h-4 text-[#023064]" />
            <h2 className="font-bold text-[#023064] text-base">Platform Overview</h2>
          </div>

          {/* 3 big stat highlights */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="text-center bg-[#f4f4f9] rounded-xl p-3">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Zap className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <p className="text-lg font-extrabold text-[#023064]">99.9%</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Uptime</p>
            </div>
            <div className="text-center bg-[#f4f4f9] rounded-xl p-3">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <p className="text-lg font-extrabold text-[#023064]">4.8 ★</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Rating</p>
            </div>
            <div className="text-center bg-[#f4f4f9] rounded-xl p-3">
              <div className="flex items-center justify-center gap-1 mb-1">
                <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <p className="text-lg font-extrabold text-[#023064]">248</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Active Users</p>
            </div>
          </div>

          {/* Progress bars */}
          <div className="space-y-3">
            {progressIndicators.map((item) => {
              const pct = Math.round((item.value / item.total) * 100);
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-600">{item.label}</span>
                    <span className="text-xs font-bold text-[#023064]">{pct}%</span>
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
