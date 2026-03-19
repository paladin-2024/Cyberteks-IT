import { Link } from 'react-router-dom';
import {
  BookOpen, Users, Star, Eye,
  Clock, CheckSquare, AlertCircle, CheckCircle2,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { useAuth } from '@/context/AuthContext';

// ─── Data ────────────────────────────────────────────────────────────────────

const activityData = [
  { day: 'Mon', students: 12 },
  { day: 'Tue', students: 18 },
  { day: 'Wed', students: 15 },
  { day: 'Thu', students: 22 },
  { day: 'Fri', students: 19 },
  { day: 'Sat', students: 8 },
  { day: 'Sun', students: 5 },
];

const todayIndex = new Date().getDay();
const dayOrder = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const todayLabel = dayOrder[todayIndex];

const activeCourses = [
  {
    title: 'Web Development Fundamentals',
    initials: 'WD',
    subtitle: '84 students · Lesson 18',
    duration: '6h left',
    completion: 81,
    color: '#023064',
  },
  {
    title: 'Cybersecurity Essentials',
    initials: 'CS',
    subtitle: '62 students · Lesson 12',
    duration: '4h left',
    completion: 73,
    color: '#E11D48',
  },
  {
    title: 'IT Support & Networking',
    initials: 'IT',
    subtitle: '58 students · Lesson 22',
    duration: '2h left',
    completion: 90,
    color: '#059669',
  },
];

// completion breakdown for the bar
const courseCompletion = { completed: 55, inProgress: 30, notStarted: 15 };

const recentStudents = [
  { id: 'STU-001', name: 'Aisha Nakato',    course: 'Web Dev',       enrolled: 'Jan 12, 2026', progress: 72 },
  { id: 'STU-002', name: 'Moses Ssemakula', course: 'Cybersecurity', enrolled: 'Jan 20, 2026', progress: 45 },
  { id: 'STU-003', name: 'Grace Atuhaire',  course: 'Networking',    enrolled: 'Feb 03, 2026', progress: 91 },
  { id: 'STU-004', name: 'David Ochieng',   course: 'Web Dev',       enrolled: 'Feb 18, 2026', progress: 28 },
  { id: 'STU-005', name: 'Faith Akello',    course: 'AI Intro',      enrolled: 'Mar 01, 2026', progress: 18 },
];

interface Task {
  text: string;
  due: string;
  done: boolean;
  urgent: boolean;
}

const tasks: Task[] = [
  { text: 'Grade Quiz #4 — Cybersecurity',    due: 'Today',     done: false, urgent: true  },
  { text: 'Record Lesson 19 — CSS Grid',      due: 'Tomorrow',  done: false, urgent: false },
  { text: 'Reply to student messages (3)',    due: 'Today',     done: false, urgent: true  },
  { text: 'Update course outline — AI Intro', due: 'This week', done: true,  urgent: false },
  { text: 'Upload Q2 assignment rubric',      due: 'Fri, Mar 21', done: false, urgent: false },
];

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
      <Link to={link} className="text-xs font-semibold text-primary-blue hover:underline">
        {linkLabel} →
      </Link>
    </div>
  );
}

function StudentActivityChart() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-slate-900 text-base">Student Activity</h2>
          <p className="text-xs text-slate-400 mt-0.5">Daily active learners this week</p>
        </div>
        <Link
          to="/teacher/students"
          className="text-xs font-semibold text-primary-blue hover:underline"
        >
          View All →
        </Link>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={activityData} barSize={28} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
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
            domain={[0, 'dataMax + 4']}
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
            {activityData.map((entry) => (
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

function ActiveCoursesCard() {
  const { completed, inProgress, notStarted } = courseCompletion;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-4">
      {/* Course list */}
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-slate-900 text-sm">Active Courses</h2>
        <Link to="/teacher/courses" className="text-[11px] font-semibold text-primary-blue hover:underline">
          View All →
        </Link>
      </div>
      <div className="space-y-3">
        {activeCourses.map((c) => (
          <div
            key={c.title}
            className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white text-xs font-bold"
              style={{ backgroundColor: c.color }}
            >
              {c.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate">{c.title}</p>
              <p className="text-[10px] text-slate-400 truncate">{c.subtitle}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${c.completion}%`, backgroundColor: c.color }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">{c.completion}%</span>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <Clock className="w-3 h-3" />
                {c.duration}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Course Completion breakdown */}
      <div className="pt-2 border-t border-slate-100">
        <p className="text-xs font-semibold text-slate-700 mb-2">Course Completion</p>
        <div className="flex h-2.5 rounded-full overflow-hidden gap-0.5">
          <div className="rounded-l-full bg-emerald-500" style={{ width: `${completed}%` }} />
          <div className="bg-primary-blue" style={{ width: `${inProgress}%` }} />
          <div className="rounded-r-full bg-slate-200" style={{ width: `${notStarted}%` }} />
        </div>
        <div className="flex gap-4 mt-2">
          {[
            { label: 'Completed',    pct: completed,   dot: 'bg-emerald-500' },
            { label: 'In Progress',  pct: inProgress,  dot: 'bg-primary-blue' },
            { label: 'Not Started',  pct: notStarted,  dot: 'bg-slate-300' },
          ].map(({ label, pct, dot }) => (
            <div key={label} className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
              {label} <span className="font-semibold text-slate-700">{pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function TeacherDashboard() {
  const { user } = useAuth();
  const name = user?.name?.split(' ')[0] ?? 'Instructor';

  const stats: StatCardProps[] = [
    {
      label: 'My Courses',
      value: '4',
      icon: BookOpen,
      iconBg: 'bg-blue-50',
      iconColor: 'text-primary-blue',
      badge: { text: '● Active', color: 'bg-emerald-50 text-emerald-600' },
      link: '/teacher/courses',
      linkLabel: 'View All',
    },
    {
      label: 'Total Students',
      value: '204',
      icon: Users,
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600',
      link: '/teacher/students',
      linkLabel: 'View All',
    },
    {
      label: 'Pending Reviews',
      value: '7',
      icon: AlertCircle,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      link: '/teacher/assignments',
      linkLabel: 'View',
    },
    {
      label: 'Avg Rating',
      value: '4.8 ★',
      icon: Star,
      iconBg: 'bg-yellow-50',
      iconColor: 'text-yellow-500',
      link: '/teacher/courses',
      linkLabel: 'View Feedback',
    },
  ];

  return (
    <div className="min-h-full bg-[#f4f4f9] p-4 md:p-6 space-y-6">

      {/* Page title */}
      <div>
        <h1 className="font-display text-xl font-extrabold text-slate-900">
          Hello, {name} 👋
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">Here's an overview of your teaching activity.</p>
      </div>

      {/* Row 1 — Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Row 2 — Chart + Active Courses */}
      <div className="grid lg:grid-cols-5 gap-5">
        {/* Student Activity chart — 60% */}
        <div className="lg:col-span-3">
          <StudentActivityChart />
        </div>
        {/* Active Courses + breakdown — 40% */}
        <div className="lg:col-span-2">
          <ActiveCoursesCard />
        </div>
      </div>

      {/* Row 3 — Recent Students table + Tasks */}
      <div className="grid lg:grid-cols-5 gap-5">

        {/* Recent Students table — 60% */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
            <h2 className="font-display font-bold text-slate-900 text-base">Recent Students</h2>
            <Link to="/teacher/students" className="text-xs font-semibold text-primary-blue hover:underline">
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
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Course</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Enrolled</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide min-w-[120px]">Progress</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">View</th>
                </tr>
              </thead>
              <tbody>
                {recentStudents.map((s) => (
                  <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3.5 text-center">
                      <input type="checkbox" className="rounded border-slate-300 accent-primary-blue" />
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-mono text-slate-400">{s.id}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary-blue flex items-center justify-center shrink-0">
                          <span className="text-white text-[10px] font-bold">
                            {s.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <span className="font-medium text-slate-800 text-xs whitespace-nowrap">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-slate-500 whitespace-nowrap">{s.course}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-slate-400 whitespace-nowrap">{s.enrolled}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary-blue transition-all"
                            style={{ width: `${s.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-slate-600 shrink-0 w-7 text-right">
                          {s.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <Link
                        to="/teacher/students"
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-primary-blue hover:text-white flex items-center justify-center text-slate-500 transition-colors"
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
        </div>

        {/* Tasks — 40% */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
            <h2 className="font-display font-bold text-slate-900 text-base">Tasks</h2>
            <Link to="/teacher/assignments" className="text-xs font-semibold text-primary-blue hover:underline">
              View All →
            </Link>
          </div>
          <div className="p-4 space-y-2">
            {tasks.map((task, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
                  task.done
                    ? 'opacity-50'
                    : task.urgent
                    ? 'bg-red-50 border border-red-100'
                    : 'hover:bg-slate-50 border border-transparent'
                }`}
              >
                {/* checkbox circle */}
                <div
                  className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                    task.done
                      ? 'bg-emerald-500 border-emerald-500'
                      : task.urgent
                      ? 'border-primary-red'
                      : 'border-slate-300'
                  }`}
                >
                  {task.done && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs font-medium leading-snug ${
                      task.done ? 'line-through text-slate-400' : 'text-slate-700'
                    }`}
                  >
                    {task.text}
                  </p>
                  <div className="flex items-center justify-between mt-1 gap-2">
                    <p
                      className={`text-[10px] ${
                        task.urgent && !task.done ? 'text-primary-red font-semibold' : 'text-slate-400'
                      }`}
                    >
                      Due: {task.due}
                    </p>
                    {task.urgent && !task.done && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-red-100 text-primary-red shrink-0">
                        Urgent
                      </span>
                    )}
                    {task.done && (
                      <span className="flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600 shrink-0">
                        <CheckSquare className="w-3 h-3" /> Done
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
