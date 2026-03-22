import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, CartesianGrid,
} from 'recharts';
import { BookOpen, Users, TrendingUp, Award, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface KPIs {
  totalCourses: number;
  totalStudents: number;
  avgProgress: number;
  completionRate: number;
  retentionRate: number;
}

interface ChartPoint {
  month: string;
  students: number;
}

interface CompletionPoint {
  program: string;
  rate: number;
}

interface AnalyticsData {
  kpis: KPIs;
  enrollmentChart: ChartPoint[];
  completionByProgram: CompletionPoint[];
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({
  icon: Icon,
  label,
  value,
  unit,
  iconBg,
  iconColor,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  unit?: string;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-3">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}>
        <Icon className={`w-4 h-4 ${iconColor}`} />
      </div>
      <div>
        <p className="font-display text-3xl font-extrabold text-slate-900 leading-none">
          {value}{unit}
        </p>
        <p className="text-xs font-medium text-slate-500 mt-1">{label}</p>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function TeacherAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<AnalyticsData>('/analytics/teacher')
      .then(setData)
      .catch((err) => setError(err.message ?? 'Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-slate-400 gap-3">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Loading analytics…</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-slate-400 flex-col gap-2">
        <p className="text-sm">{error ?? 'Something went wrong'}</p>
        <button onClick={() => window.location.reload()} className="text-xs font-semibold text-primary-blue hover:underline">
          Retry
        </button>
      </div>
    );
  }

  const { kpis, enrollmentChart, completionByProgram } = data;

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-xl font-extrabold text-slate-900">Analytics</h1>
        <p className="text-sm text-slate-500 mt-0.5">Performance overview across all your courses</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={BookOpen} label="My Courses"    value={kpis.totalCourses}    iconBg="bg-blue-50"    iconColor="text-primary-blue" />
        <KpiCard icon={Users}    label="Total Students" value={kpis.totalStudents}   iconBg="bg-violet-50"  iconColor="text-violet-600"  />
        <KpiCard icon={TrendingUp} label="Avg Progress"  value={kpis.avgProgress}   unit="%" iconBg="bg-amber-50"  iconColor="text-amber-600"  />
        <KpiCard icon={Award}    label="Completion Rate" value={kpis.completionRate} unit="%" iconBg="bg-emerald-50" iconColor="text-emerald-600" />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Monthly enrollments */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="mb-5">
            <h2 className="font-display font-bold text-slate-900 text-base">Monthly Enrollments</h2>
            <p className="text-xs text-slate-400 mt-0.5">New students per month (last 6 months)</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={enrollmentChart} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} domain={[0, 'dataMax + 2']} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: '#f8fafc', fontSize: 12 }}
                formatter={(v: number) => [`${v} students`, 'Enrolled']}
              />
              <Line type="monotone" dataKey="students" stroke="#023064" strokeWidth={2.5} dot={{ r: 4, fill: '#023064' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Completion by course */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="mb-5">
            <h2 className="font-display font-bold text-slate-900 text-base">Completion by Course</h2>
            <p className="text-xs text-slate-400 mt-0.5">% of students who completed each course</p>
          </div>
          {completionByProgram.length === 0 ? (
            <div className="flex items-center justify-center h-[200px] text-slate-400 text-sm">
              No data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={completionByProgram} layout="vertical" barSize={16} margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
                <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="program" width={120} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: '#f8fafc', fontSize: 12 }}
                  formatter={(v: number) => [`${v}%`, 'Completion']}
                />
                <Bar dataKey="rate" radius={[0, 6, 6, 0]}>
                  {completionByProgram.map((_, i) => (
                    <Cell key={i} fill={i % 2 === 0 ? '#023064' : '#E11D48'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>

      {/* Retention bar */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-display font-bold text-slate-900 text-base mb-4">Student Retention</h2>
        <div className="flex items-center gap-4">
          <div className="flex-1 h-3 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-700"
              style={{ width: `${kpis.retentionRate}%` }}
            />
          </div>
          <span className="text-xl font-extrabold text-slate-900 shrink-0">{kpis.retentionRate}%</span>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Students still actively enrolled (not dropped or suspended)
        </p>
      </div>
    </div>
  );
}
