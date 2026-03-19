import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, Award, Clock, Calendar,
  Eye, MoreVertical, CheckSquare,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { useAuth } from '@/context/AuthContext';

// ─── Data ────────────────────────────────────────────────────────────────────

const studyData = [
  { day: 'Mon', hours: 3 },
  { day: 'Tue', hours: 5 },
  { day: 'Wed', hours: 4 },
  { day: 'Thu', hours: 7 },
  { day: 'Fri', hours: 6 },
  { day: 'Sat', hours: 2 },
  { day: 'Sun', hours: 4 },
];

const todayIndex = new Date().getDay(); // 0=Sun … 6=Sat
const dayOrder = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const todayLabel = dayOrder[todayIndex];

const liveSessions = [
  {
    subject: 'Web Development',
    initials: 'WD',
    subtitle: 'CSS Grid & Flexbox — Live',
    timeLeft: '2h 15m',
    pct: 62,
    color: '#023064',
  },
  {
    subject: 'Cybersecurity',
    initials: 'CS',
    subtitle: 'Network Threats — Coming up',
    timeLeft: '4h 00m',
    pct: 35,
    color: '#E11D48',
  },
];

const tableRows = [
  { id: 'CRS-001', subject: 'Web Development Fundamentals', date: 'Jan 12, 2026', progress: 72, instructor: 'CN' },
  { id: 'CRS-002', subject: 'Cybersecurity Essentials',     date: 'Jan 20, 2026', progress: 34, instructor: 'JK' },
  { id: 'CRS-003', subject: 'IT Support & Networking',      date: 'Feb 03, 2026', progress: 91, instructor: 'CN' },
  { id: 'CRS-004', subject: 'Introduction to AI',           date: 'Feb 18, 2026', progress: 18, instructor: 'MA' },
  { id: 'CRS-005', subject: 'Cloud Computing Basics',       date: 'Mar 01, 2026', progress: 55, instructor: 'BO' },
];

// assignment breakdown percentages
const assignBreakdown = { submitted: 48, inReview: 27, remaining: 25 };

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
    <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-3">
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
        <p className="font-display text-3xl font-extrabold text-slate-900 leading-none">{value}</p>
        <p className="text-xs font-medium text-slate-500 mt-1">{label}</p>
      </div>
      {progress !== undefined && (
        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-primary-blue transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      <Link
        to={link}
        className="text-xs font-semibold text-primary-blue hover:underline"
      >
        {linkLabel} →
      </Link>
    </div>
  );
}

type TabKey = 'Daily' | 'Weekly' | 'Monthly';

const tabData: Record<TabKey, typeof studyData> = {
  Daily: studyData,
  Weekly: [
    { day: 'W1', hours: 18 },
    { day: 'W2', hours: 24 },
    { day: 'W3', hours: 21 },
    { day: 'W4', hours: 30 },
  ],
  Monthly: [
    { day: 'Jan', hours: 72 },
    { day: 'Feb', hours: 88 },
    { day: 'Mar', hours: 65 },
  ],
};

function StudyAnalyticsCard() {
  const [tab, setTab] = useState<TabKey>('Daily');
  const data = tabData[tab];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-slate-900 text-base">Study Analytics</h2>
          <p className="text-xs text-slate-400 mt-0.5">Hours studied per session</p>
        </div>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
          {(['Daily', 'Weekly', 'Monthly'] as TabKey[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-[11px] font-semibold px-3 py-1 rounded-lg transition-all ${
                tab === t
                  ? 'bg-white text-primary-blue shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barSize={28} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
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
            formatter={(v: number) => [`${v}h`, 'Hours']}
          />
          <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.day}
                fill={entry.day === todayLabel ? '#023064' : '#e2e8f0'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function LiveSessionsCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-slate-900 text-sm">Live Sessions</h2>
        <Link to="/student/schedule" className="text-[11px] font-semibold text-primary-blue hover:underline">
          View Schedule →
        </Link>
      </div>
      <div className="space-y-3">
        {liveSessions.map((s) => (
          <div key={s.subject} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white text-xs font-bold"
              style={{ backgroundColor: s.color }}
            >
              {s.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate">{s.subject}</p>
              <p className="text-[10px] text-slate-400 truncate">{s.subtitle}</p>
              {/* battery-style bar */}
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${s.pct}%`, backgroundColor: s.color }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">{s.pct}%</span>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <Clock className="w-3 h-3" />
                {s.timeLeft}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AssignmentBreakdownCard() {
  const { submitted, inReview, remaining } = assignBreakdown;
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-3">
      <h2 className="font-display font-bold text-slate-900 text-sm">Assignment Breakdown</h2>
      {/* stacked bar */}
      <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
        <div className="rounded-l-full bg-emerald-500 transition-all" style={{ width: `${submitted}%` }} />
        <div className="bg-primary-blue transition-all" style={{ width: `${inReview}%` }} />
        <div className="rounded-r-full bg-slate-200 transition-all" style={{ width: `${remaining}%` }} />
      </div>
      <div className="space-y-1.5">
        {[
          { label: 'Submitted', pct: submitted, dot: 'bg-emerald-500' },
          { label: 'In Review', pct: inReview,  dot: 'bg-primary-blue' },
          { label: 'Remaining', pct: remaining, dot: 'bg-slate-300' },
        ].map(({ label, pct, dot }) => (
          <div key={label} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${dot}`} />
              <span className="text-slate-600">{label}</span>
            </div>
            <span className="font-semibold text-slate-800">{pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function StudentDashboard() {
  const { user } = useAuth();
  const name = user?.name?.split(' ')[0] ?? 'Student';

  const stats = [
    {
      label: 'Enrolled Courses',
      value: '5',
      icon: BookOpen,
      iconBg: 'bg-blue-50',
      iconColor: 'text-primary-blue',
      badge: { text: '● Active', color: 'bg-emerald-50 text-emerald-600' },
      progress: 55,
      link: '/student/courses',
      linkLabel: 'View All',
    },
    {
      label: 'Total Assignments',
      value: '12',
      icon: CheckSquare,
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600',
      link: '/student/courses',
      linkLabel: 'View All',
    },
    {
      label: 'Completed Courses',
      value: '3',
      icon: Award,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      link: '/student/certificates',
      linkLabel: 'View Courses',
    },
    {
      label: 'Upcoming Quiz',
      value: '3 Days',
      icon: Calendar,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      link: '/student/schedule',
      linkLabel: 'View Schedule',
    },
  ];

  return (
    <div className="min-h-full bg-[#f4f4f9] p-4 md:p-6 space-y-6">

      {/* Page title */}
      <div>
        <h1 className="font-display text-xl font-extrabold text-slate-900">
          Welcome back, {name} 👋
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">Here's what's happening with your learning today.</p>
      </div>

      {/* Row 1 — Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Row 2 — Charts + right panel */}
      <div className="grid lg:grid-cols-5 gap-5">
        {/* Study Analytics — 60% */}
        <div className="lg:col-span-3">
          <StudyAnalyticsCard />
        </div>

        {/* Right panel — 40% */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <LiveSessionsCard />
          <AssignmentBreakdownCard />
        </div>
      </div>

      {/* Row 3 — Continue Watching table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
          <h2 className="font-display font-bold text-slate-900 text-base">Continue Watching</h2>
          <Link to="/student/courses" className="text-xs font-semibold text-primary-blue hover:underline">
            View All →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="w-10 px-4 py-3">
                  <input type="checkbox" className="rounded border-slate-300 accent-primary-blue" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Subject</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide min-w-[160px]">Progress</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Instructor</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors"
                >
                  <td className="px-4 py-3.5 text-center">
                    <input type="checkbox" className="rounded border-slate-300 accent-primary-blue" />
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-mono text-slate-400">{row.id}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-medium text-slate-800 text-sm">{row.subject}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs text-slate-400">{row.date}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary-blue transition-all"
                          style={{ width: `${row.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-600 shrink-0 w-8 text-right">
                        {row.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="w-7 h-7 rounded-full bg-primary-blue flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">{row.instructor}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <Link
                        to="/student/courses"
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-primary-blue hover:text-white flex items-center justify-center text-slate-500 transition-colors"
                        title="View course"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
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
      </div>
    </div>
  );
}
