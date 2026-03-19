import { TrendingUp, TrendingDown, Users, BookOpen, DollarSign, Target } from 'lucide-react';
import { ChartArea, ChartBar, ChartLine, ChartPie } from '@/components/ui/chart';

const monthlyEnrollment = [
  { month: 'Jan', students: 18 }, { month: 'Feb', students: 25 }, { month: 'Mar', students: 32 },
  { month: 'Apr', students: 28 }, { month: 'May', students: 41 }, { month: 'Jun', students: 38 },
  { month: 'Jul', students: 52 }, { month: 'Aug', students: 47 }, { month: 'Sep', students: 60 },
  { month: 'Oct', students: 55 }, { month: 'Nov', students: 68 }, { month: 'Dec', students: 72 },
];

const revenueHistory = [
  { month: 'Jan', revenue: 1200000 }, { month: 'Feb', revenue: 1800000 },
  { month: 'Mar', revenue: 2400000 }, { month: 'Apr', revenue: 2100000 },
  { month: 'May', revenue: 3200000 }, { month: 'Jun', revenue: 2900000 },
  { month: 'Jul', revenue: 3800000 }, { month: 'Aug', revenue: 3500000 },
  { month: 'Sep', revenue: 4200000 }, { month: 'Oct', revenue: 4100000 },
  { month: 'Nov', revenue: 5000000 }, { month: 'Dec', revenue: 5400000 },
];

const completionByProgram = [
  { program: 'Web Dev', rate: 81 }, { program: 'Cyber', rate: 73 },
  { program: 'Networking', rate: 90 }, { program: 'AI/ML', rate: 62 }, { program: 'Data', rate: 75 },
];

const retentionData = [
  { month: 'Jul', retained: 94 }, { month: 'Aug', retained: 91 },
  { month: 'Sep', retained: 88 }, { month: 'Oct', retained: 93 },
  { month: 'Nov', retained: 96 }, { month: 'Dec', retained: 95 },
];

const programShare = [
  { name: 'Web Dev', value: 34 }, { name: 'Cybersecurity', value: 22 },
  { name: 'Networking', value: 18 }, { name: 'AI & ML', value: 14 }, { name: 'Data Analysis', value: 12 },
];

const kpis = [
  { label: 'Total Students', value: '248',  change: '+12%', up: true,  icon: Users,      iconBg: 'bg-blue-50',    iconColor: 'text-blue-600' },
  { label: 'Total Revenue',  value: '42.1M', change: '+28%', up: true, icon: DollarSign, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', note: 'UGX YTD' },
  { label: 'Avg Completion', value: '76%',  change: '+4%',  up: true,  icon: Target,     iconBg: 'bg-violet-50',  iconColor: 'text-violet-600' },
  { label: 'Retention Rate', value: '93%',  change: '-2%',  up: false, icon: BookOpen,   iconBg: 'bg-amber-50',   iconColor: 'text-amber-600' },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 max-w-7xl pb-8">

      {/* Header */}
      <div>
        <h1 className="font-display text-xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-500 text-sm mt-0.5">Platform-wide performance metrics and trends</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${k.iconBg}`}>
                <k.icon className={`w-4 h-4 ${k.iconColor}`} />
              </div>
              <span className={`flex items-center gap-1 text-xs font-semibold ${k.up ? 'text-emerald-600' : 'text-red-500'}`}>
                {k.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {k.change}
              </span>
            </div>
            <p className="font-display text-2xl font-extrabold text-slate-900 leading-none">{k.value}</p>
            <p className="text-xs font-medium text-slate-500 mt-1">{k.label}</p>
            {k.note && <p className="text-[10px] text-slate-400">{k.note}</p>}
          </div>
        ))}
      </div>

      {/* Row 1 */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="font-display font-bold text-slate-900 text-base mb-1">Monthly Enrollments</h2>
          <p className="text-xs text-slate-400 mb-5">New students enrolled per month (full year)</p>
          <ChartArea data={monthlyEnrollment} dataKeys={['students']} xKey="month" height={240} />
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="font-display font-bold text-slate-900 text-base mb-1">Program Distribution</h2>
          <p className="text-xs text-slate-400 mb-4">Students by program</p>
          <ChartPie data={programShare} donut height={240} />
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="font-display font-bold text-slate-900 text-base mb-1">Revenue (UGX)</h2>
          <p className="text-xs text-slate-400 mb-5">Monthly revenue — full year</p>
          <ChartBar data={revenueHistory} dataKeys={['revenue']} xKey="month" ugxFormat height={230} />
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="font-display font-bold text-slate-900 text-base mb-1">Student Retention</h2>
          <p className="text-xs text-slate-400 mb-5">Monthly retention rate (%)</p>
          <ChartLine data={retentionData} dataKeys={['retained']} xKey="month" height={230} />
        </div>
      </div>

      {/* Completion by program */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h2 className="font-display font-bold text-slate-900 text-base mb-1">Completion Rate by Program</h2>
        <p className="text-xs text-slate-400 mb-6">% of enrolled students who completed the course</p>
        <div className="space-y-4">
          {completionByProgram.map((p) => (
            <div key={p.program}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-slate-700">{p.program}</span>
                <span className="text-sm font-bold text-slate-900">{p.rate}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${p.rate >= 85 ? 'bg-emerald-500' : p.rate >= 70 ? 'bg-blue-500' : 'bg-amber-500'}`}
                  style={{ width: `${p.rate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-6 mt-5 pt-4 border-t border-slate-100 text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" /> Excellent ≥ 85%</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" /> Good 70–84%</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" /> Needs attention &lt;70%</span>
        </div>
      </div>
    </div>
  );
}
