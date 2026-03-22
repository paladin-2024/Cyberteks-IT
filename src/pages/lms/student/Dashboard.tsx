import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, Award, Eye, Inbox, ArrowUpRight, TrendingUp, GraduationCap, Flame,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface EnrollmentRow {
  id: string; courseId: string; title: string; instructor: string;
  startedAt: string; progress: number; status: string;
}

interface StudyPoint { day: string; hours: number; }

interface StudentDashboardData {
  enrolledCount: number; completedCount: number;
  enrollments: EnrollmentRow[]; studyChart: StudyPoint[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-UG', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#060e1f] text-white border border-white/10 rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="text-white/50 mb-0.5">{label}</p>
      <p className="font-bold">{payload[0].value}h studied</p>
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, value, label, badge, href, linkLabel, accentColor, progress }:
  { icon: React.ElementType; value: string | number; label: string; badge?: string; href: string; linkLabel: string; accentColor: string; progress?: number }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3.5 hover:shadow-md hover:shadow-gray-100 transition-shadow group">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${accentColor}12` }}>
          <Icon className="w-4.5 h-4.5" style={{ color: accentColor }} />
        </div>
        {badge && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">{badge}</span>
        )}
      </div>
      <div>
        <p className="text-3xl font-bold text-gray-900 tracking-tight leading-none">{value}</p>
        <p className="text-sm text-gray-500 mt-1.5">{label}</p>
      </div>
      {progress !== undefined && (
        <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${accentColor}, ${accentColor}99)` }} />
        </div>
      )}
      <Link to={href} className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-[#023064] transition-colors mt-auto pt-1.5 border-t border-gray-50 group-hover:border-gray-100">
        {linkLabel} <ArrowUpRight className="w-3 h-3" />
      </Link>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function StudentDashboard() {
  const { user } = useAuth();
  const name = user?.name?.split(' ')[0] ?? 'Student';

  const [data,    setData]    = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const todayLabel = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];

  useEffect(() => {
    api.get<StudentDashboardData>('/dashboard/student')
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

  const { enrolledCount, completedCount, enrollments, studyChart } = data;
  const activeEnrollments = enrollments.filter(e => e.status === 'ACTIVE');
  const avgProgress = activeEnrollments.length
    ? Math.round(activeEnrollments.reduce((s, e) => s + e.progress, 0) / activeEnrollments.length)
    : 0;

  return (
    <div className="min-h-screen p-6 space-y-6 bg-gray-50/40">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 leading-none">Welcome back, {name}</h1>
          <p className="text-sm text-gray-400 mt-1">Keep the momentum going — your progress is looking great.</p>
        </div>
        {avgProgress > 0 && (
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-[#023064]/6 border border-[#023064]/10">
            <Flame className="w-3.5 h-3.5 text-[#E11D48]" />
            <span className="text-xs font-semibold text-[#023064]">{avgProgress}% avg progress</span>
          </div>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BookOpen}     value={enrolledCount}   label="Enrolled Courses"  badge="Active"    href="/student/courses"      linkLabel="View courses"  accentColor="#023064" progress={avgProgress} />
        <StatCard icon={Award}        value={completedCount}  label="Completed Courses" href="/student/certificates"  linkLabel="Certificates"  accentColor="#059669" />
        <StatCard icon={TrendingUp}   value={`${avgProgress}%`} label="Avg Progress"   href="/student/progress"      linkLabel="Full progress" accentColor="#7c3aed" progress={avgProgress} />
        <StatCard icon={GraduationCap} value={enrollments.length} label="Total Enrollments" href="/student/courses" linkLabel="Browse all"    accentColor="#d97706" />
      </div>

      {/* Row 2 */}
      <div className="grid lg:grid-cols-5 gap-5">

        {/* Study Analytics */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="font-bold text-gray-900 text-base leading-none">Study Analytics</h2>
              <p className="text-xs text-gray-400 mt-1.5">Hours studied this week</p>
            </div>
            <span className="text-[10px] font-semibold text-gray-400 bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1.5">This Week</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={studyChart} barSize={28} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} domain={[0, 'dataMax + 1']} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f8fafc', radius: 6 }} />
              <Bar dataKey="hours" radius={[8, 8, 0, 0]}>
                {studyChart.map(entry => (
                  <Cell key={entry.day} fill={entry.day === todayLabel ? '#023064' : '#e8edf5'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Progress Summary */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 text-sm leading-none">Progress Summary</h2>
              <Link to="/student/progress" className="text-[10px] font-semibold text-[#023064] hover:underline flex items-center gap-1">
                Full view <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            {activeEnrollments.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-24 text-gray-300 gap-2">
                <BookOpen className="w-8 h-8" />
                <p className="text-xs text-gray-400">No active courses</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeEnrollments.slice(0, 4).map(e => (
                  <div key={e.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-gray-700 font-medium truncate max-w-[140px]">{e.title}</span>
                      <span className="text-xs font-bold text-gray-700 shrink-0">{e.progress}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${e.progress}%`, background: 'linear-gradient(90deg, #023064, #034087)' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Continue Learning table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900 text-base leading-none">Continue Learning</h2>
            <p className="text-xs text-gray-400 mt-1">Pick up where you left off</p>
          </div>
          <Link to="/student/courses" className="inline-flex items-center gap-1 text-xs font-semibold text-[#023064] hover:underline">
            All courses <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {enrollments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-36 text-gray-300 gap-2">
            <Inbox className="w-10 h-10" />
            <p className="text-sm text-gray-400">No courses enrolled yet</p>
            <Link to="/student/courses" className="text-xs font-semibold text-[#023064] hover:underline">Browse Courses</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="px-5 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Course</th>
                  <th className="px-5 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Started</th>
                  <th className="px-5 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider min-w-[160px]">Progress</th>
                  <th className="px-5 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Instructor</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {enrollments.map(row => (
                  <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-gray-800 text-sm">{row.title}</span>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span className="text-xs text-gray-400">{formatDate(row.startedAt)}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden min-w-[80px]">
                          <div className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${row.progress}%`, background: 'linear-gradient(90deg, #023064, #034087)' }} />
                        </div>
                        <span className="text-xs font-bold text-gray-600 shrink-0 w-8 text-right">{row.progress}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#023064] to-[#034087] flex items-center justify-center shrink-0">
                          <span className="text-white text-[10px] font-bold">{getInitials(row.instructor)}</span>
                        </div>
                        <span className="text-xs text-gray-500 truncate max-w-[80px]">{row.instructor}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <Link to="/student/courses"
                        className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-[#023064] hover:text-white flex items-center justify-center text-gray-400 transition-all border border-gray-100 hover:border-[#023064]"
                        title="View course">
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
