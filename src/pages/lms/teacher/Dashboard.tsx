import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Eye, ArrowUpRight, Inbox, CheckCircle } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface RecentStudent {
  name: string; email: string; course: string; enrolled: string; progress: number;
}
interface CourseItem {
  id: string; title: string; status: string;
  enrollmentCount: number; completedCount: number; avgProgress: number;
}
interface CompletionBreakdown { completed: number; inProgress: number; notStarted: number; }
interface ActivityPoint { day: string; students: number; }
interface TeacherDashboardData {
  myCourses: number; totalStudents: number;
  recentStudents: RecentStudent[]; coursesList: CourseItem[];
  completionBreakdown: CompletionBreakdown; activityChart: ActivityPoint[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-UG', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getInitials(name: string | null) {
  if (!name) return '??';
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

const courseAccents = ['#023064', '#E11D48', '#059669', '#7c3aed', '#d97706'];

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#060e1f] text-white border border-white/10 rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="text-white/50 mb-0.5">{label}</p>
      <p className="font-bold">{payload[0].value} students</p>
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, value, label, badge, href, linkLabel, accentColor }:
  { icon: React.ElementType; value: string | number; label: string; badge?: string; href: string; linkLabel: string; accentColor: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3.5 hover:shadow-md hover:shadow-gray-100 transition-shadow group">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${accentColor}12` }}>
          <Icon className="w-4 h-4" style={{ color: accentColor }} />
        </div>
        {badge && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">{badge}</span>
        )}
      </div>
      <div>
        <p className="text-3xl font-bold text-gray-900 tracking-tight leading-none">{value}</p>
        <p className="text-sm text-gray-500 mt-1.5">{label}</p>
      </div>
      <Link to={href} className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-[#023064] transition-colors mt-auto pt-1.5 border-t border-gray-50 group-hover:border-gray-100">
        {linkLabel} <ArrowUpRight className="w-3 h-3" />
      </Link>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function TeacherDashboard() {
  const { user } = useAuth();
  const name = user?.name?.split(' ')[0] ?? 'Instructor';

  const [data,    setData]    = useState<TeacherDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const todayLabel = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];

  useEffect(() => {
    api.get<TeacherDashboardData>('/dashboard/teacher')
      .then(setData)
      .catch(err => setError(err.message ?? 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen p-6 space-y-6 bg-gray-50/40">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-gray-100 rounded-xl animate-pulse" />
          <div className="h-4 w-64 bg-gray-100 rounded-xl animate-pulse" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-40 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
        <div className="grid lg:grid-cols-5 gap-5">
          <div className="lg:col-span-3 h-72 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="lg:col-span-2 h-72 bg-gray-100 rounded-2xl animate-pulse" />
        </div>
        <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center bg-gray-50/40">
        <div className="text-center space-y-3">
          <p className="text-gray-400 text-sm">{error ?? 'Something went wrong'}</p>
          <button onClick={() => window.location.reload()} className="text-xs font-semibold text-[#023064] hover:underline">Retry</button>
        </div>
      </div>
    );
  }

  const { myCourses, totalStudents, recentStudents, coursesList, completionBreakdown, activityChart } = data;
  const { completed, inProgress, notStarted } = completionBreakdown;
  const totalEnrollments = coursesList.reduce((s, c) => s + c.enrollmentCount, 0);
  const totalCompletions  = coursesList.reduce((s, c) => s + c.completedCount, 0);

  return (
    <div className="min-h-screen p-6 space-y-6 bg-gray-50/40">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 leading-none">Hello, {name}</h1>
          <p className="text-sm text-gray-400 mt-1">Here's an overview of your teaching activity today.</p>
        </div>
        <Link to="/teacher/courses"
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#023064] text-white text-xs font-semibold hover:bg-[#031d4a] transition-colors shadow-sm shadow-[#023064]/20">
          <BookOpen className="w-3.5 h-3.5" /> Manage Courses
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BookOpen} value={myCourses}        label="My Courses"        badge="Active"  href="/teacher/courses"  linkLabel="View courses"    accentColor="#023064" />
        <StatCard icon={Users}    value={totalStudents}    label="Total Students"    href="/teacher/students" linkLabel="View students"   accentColor="#7c3aed" />
        <StatCard icon={Users}    value={totalEnrollments} label="Total Enrollments" href="/teacher/courses"  linkLabel="All enrollments" accentColor="#059669" />
        <StatCard icon={CheckCircle} value={totalCompletions} label="Completions"   href="/teacher/students" linkLabel="Student progress" accentColor="#d97706" />
      </div>

      {/* Row 2 */}
      <div className="grid lg:grid-cols-5 gap-5">

        {/* Activity chart */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="font-bold text-gray-900 text-base leading-none">Student Activity</h2>
              <p className="text-xs text-gray-400 mt-1.5">New enrollments per day this week</p>
            </div>
            <span className="text-[10px] font-semibold text-gray-400 bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1.5">This Week</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={activityChart} barSize={28} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} domain={[0, 'dataMax + 2']} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f8fafc', radius: 6 }} />
              <Bar dataKey="students" radius={[8, 8, 0, 0]}>
                {activityChart.map(entry => (
                  <Cell key={entry.day} fill={entry.day === todayLabel ? '#023064' : '#e8edf5'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Active courses + completion breakdown */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-900 text-sm leading-none">Active Courses</h2>
            <Link to="/teacher/courses" className="text-[10px] font-semibold text-[#023064] hover:underline flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {coursesList.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-300 gap-2 py-6">
              <BookOpen className="w-9 h-9" />
              <p className="text-sm text-gray-400">No courses yet</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {coursesList.slice(0, 3).map((c, idx) => {
                const accent = courseAccents[idx % courseAccents.length];
                return (
                  <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors group">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white text-[11px] font-bold"
                      style={{ background: `${accent}18`, color: accent }}>
                      {c.title.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">{c.title}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {c.enrollmentCount} student{c.enrollmentCount !== 1 ? 's' : ''} · {c.completedCount} done
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex-1 h-1 rounded-full bg-gray-100 overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${c.avgProgress}%`, backgroundColor: accent }} />
                        </div>
                        <span className="text-[10px] font-semibold shrink-0" style={{ color: accent }}>{c.avgProgress}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Completion breakdown */}
          <div className="pt-3 border-t border-gray-100 mt-auto">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">Completion Breakdown</p>
            <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
              <div className="rounded-l-full bg-emerald-500 transition-all" style={{ width: `${completed}%` }} />
              <div className="bg-[#023064] transition-all" style={{ width: `${inProgress}%` }} />
              <div className="rounded-r-full bg-gray-100 transition-all" style={{ width: `${Math.max(100 - completed - inProgress, 0)}%` }} />
            </div>
            <div className="flex gap-3 mt-2.5 flex-wrap">
              {[
                { label: 'Completed',   pct: completed,  dot: 'bg-emerald-500' },
                { label: 'In Progress', pct: inProgress, dot: 'bg-[#023064]' },
                { label: 'Not Started', pct: notStarted, dot: 'bg-gray-200' },
              ].map(({ label, pct, dot }) => (
                <div key={label} className="flex items-center gap-1.5 text-[10px] text-gray-500">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
                  {label} <span className="font-bold text-gray-700">{pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Students table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900 text-base leading-none">Recent Students</h2>
            <p className="text-xs text-gray-400 mt-1">Students who enrolled recently</p>
          </div>
          <Link to="/teacher/students" className="inline-flex items-center gap-1 text-xs font-semibold text-[#023064] hover:underline">
            All students <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {recentStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-36 text-gray-300 gap-2">
            <Inbox className="w-10 h-10" />
            <p className="text-sm text-gray-400">No students enrolled yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="px-5 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Student</th>
                  <th className="px-5 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Course</th>
                  <th className="px-5 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Enrolled</th>
                  <th className="px-5 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider min-w-[140px]">Progress</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {recentStudents.map((s, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#023064] to-[#034087] flex items-center justify-center shrink-0">
                          <span className="text-white text-[10px] font-bold">{getInitials(s.name)}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-xs leading-tight">{s.name}</p>
                          <p className="text-[10px] text-gray-400 leading-tight hidden lg:block">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span className="text-xs text-gray-500 truncate max-w-[140px] block">{s.course}</span>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className="text-xs text-gray-400">{formatDate(s.enrolled)}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden min-w-[60px]">
                          <div className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${s.progress}%`, background: 'linear-gradient(90deg, #023064, #034087)' }} />
                        </div>
                        <span className="text-xs font-bold text-gray-600 shrink-0 w-8 text-right">{s.progress}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <Link to="/teacher/students"
                        className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-[#023064] hover:text-white flex items-center justify-center text-gray-400 transition-all border border-gray-100 hover:border-[#023064]"
                        title="View student">
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
