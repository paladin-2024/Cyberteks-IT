import { Link } from 'react-router-dom';
import {
  Users, BookOpen, FileText, Briefcase,
  TrendingUp, TrendingDown, ArrowUpRight,
  Clock, CheckCircle2, AlertCircle, UserPlus,
  BarChart3, Activity,
} from 'lucide-react';
import { ChartArea, ChartBar, ChartPie } from '@/components/ui/chart';
import { useLanguage } from '@/context/LanguageContext';

const enrollmentData = [
  { month: 'Jan', students: 18 }, { month: 'Feb', students: 25 }, { month: 'Mar', students: 32 },
  { month: 'Apr', students: 28 }, { month: 'May', students: 41 }, { month: 'Jun', students: 38 },
  { month: 'Jul', students: 52 }, { month: 'Aug', students: 47 }, { month: 'Sep', students: 60 },
  { month: 'Oct', students: 55 }, { month: 'Nov', students: 68 }, { month: 'Dec', students: 72 },
];

const revenueData = [
  { month: 'Jan', revenue: 1200000 }, { month: 'Feb', revenue: 1800000 }, { month: 'Mar', revenue: 2400000 },
  { month: 'Apr', revenue: 2100000 }, { month: 'May', revenue: 3200000 }, { month: 'Jun', revenue: 2900000 },
];

const courseData = [
  { name: 'Web Dev', value: 68 }, { name: 'Cybersecurity', value: 45 },
  { name: 'Networking', value: 52 }, { name: 'Data Analysis', value: 38 }, { name: 'AI & ML', value: 29 },
];

const recentApplications = [
  { name: 'Aisha Nakato',     program: 'Web Development',  status: 'PENDING',      date: 'Today, 9:14 AM' },
  { name: 'David Ochieng',    program: 'Cybersecurity',    status: 'UNDER_REVIEW', date: 'Yesterday' },
  { name: 'Grace Atuhaire',   program: 'Data Analysis',    status: 'ACCEPTED',     date: '2 days ago' },
  { name: 'Moses Ssemakula',  program: 'AI & ML',          status: 'PENDING',      date: '3 days ago' },
  { name: 'Priscilla Akello', program: 'Networking',       status: 'REJECTED',     date: '4 days ago' },
];

const activity = [
  { icon: UserPlus,     text: 'New student enrolled in Web Dev',        time: '2 min ago',  color: 'text-blue-500',    bg: 'bg-blue-50' },
  { icon: CheckCircle2, text: 'Application approved — Grace Atuhaire',  time: '18 min ago', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { icon: AlertCircle,  text: 'Payment overdue — Invoice #1042',        time: '1 hr ago',   color: 'text-amber-500',   bg: 'bg-amber-50' },
  { icon: BookOpen,     text: 'New course published: AI & Robotics',    time: '3 hrs ago',  color: 'text-violet-500',  bg: 'bg-violet-50' },
  { icon: Users,        text: '12 new registrations this week',         time: 'Today',      color: 'text-blue-500',    bg: 'bg-blue-50' },
];

const statusStyles: Record<string, string> = {
  PENDING:      'bg-amber-50 text-amber-700 border border-amber-100',
  UNDER_REVIEW: 'bg-blue-50 text-blue-700 border border-blue-100',
  ACCEPTED:     'bg-emerald-50 text-emerald-700 border border-emerald-100',
  REJECTED:     'bg-red-50 text-red-700 border border-red-100',
};
const statusLabel: Record<string, string> = {
  PENDING:      'Pending',
  UNDER_REVIEW: 'Under Review',
  ACCEPTED:     'Accepted',
  REJECTED:     'Rejected',
};

const quickActions = [
  { label: 'New Application', to: '/admin/applications', icon: Briefcase,  color: 'bg-blue-600 hover:bg-blue-700' },
  { label: 'Add User',        to: '/admin/users',        icon: UserPlus,   color: 'bg-emerald-600 hover:bg-emerald-700' },
  { label: 'Add Course',      to: '/admin/courses',      icon: BookOpen,   color: 'bg-violet-600 hover:bg-violet-700' },
  { label: 'Analytics',       to: '/admin/analytics',    icon: BarChart3,  color: 'bg-slate-700 hover:bg-slate-800' },
];

export default function AdminDashboard() {
  const { t } = useLanguage();
  const d = t.lms.admin.dashboard;

  const stats = [
    {
      label: d.stats.students, value: '248', change: '+12%', up: true,
      icon: Users, iconColor: 'text-blue-600', iconBg: 'bg-blue-50',
      desc: '30 new this month',
    },
    {
      label: d.stats.courses, value: '14', change: '+2 this month', up: true,
      icon: BookOpen, iconColor: 'text-violet-600', iconBg: 'bg-violet-50',
      desc: '11 published, 3 drafts',
    },
    {
      label: d.stats.applications, value: '37', change: '+8 pending', up: true,
      icon: Briefcase, iconColor: 'text-amber-600', iconBg: 'bg-amber-50',
      desc: '8 need review',
    },
    {
      label: d.stats.revenue, value: 'UGX 12.4M', change: '-3% vs last month', up: false,
      icon: FileText, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50',
      desc: 'Monthly revenue',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl pb-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-900">{d.title}</h1>
          <p className="text-slate-500 text-sm mt-0.5 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            {d.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 rounded-xl px-3 py-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>Last updated: just now</span>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2">
        {quickActions.map(({ label, to, icon: Icon, color }) => (
          <Link
            key={label}
            to={to}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all ${color} shadow-sm`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </Link>
        ))}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.iconBg}`}>
                <s.icon className={`w-4 h-4 ${s.iconColor}`} />
              </div>
              <span className={`inline-flex items-center gap-1 text-xs font-semibold ${s.up ? 'text-emerald-600' : 'text-red-500'}`}>
                {s.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {s.change}
              </span>
            </div>
            <div>
              <p className="font-display text-2xl font-extrabold text-slate-900 leading-none">{s.value}</p>
              <p className="text-xs font-medium text-slate-500 mt-1">{s.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display font-bold text-slate-900 text-base">{d.enrollments}</h2>
              <p className="text-xs text-slate-400 mt-0.5">Monthly new student enrollments</p>
            </div>
            <Link to="/admin/analytics" className="flex items-center gap-1 text-xs font-semibold text-primary-blue hover:text-blue-800 transition-colors">
              Full report <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <ChartArea data={enrollmentData} dataKeys={['students']} xKey="month" height={230} />
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="font-display font-bold text-slate-900 text-base mb-1">{d.enrollmentsByProgram}</h2>
          <p className="text-xs text-slate-400 mb-4">Distribution across programs</p>
          <ChartPie data={courseData} donut height={230} />
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display font-bold text-slate-900 text-base">{d.revenueChart}</h2>
              <p className="text-xs text-slate-400 mt-0.5">Revenue in UGX (last 6 months)</p>
            </div>
            <Link to="/admin/invoices" className="flex items-center gap-1 text-xs font-semibold text-primary-blue hover:text-blue-800 transition-colors">
              View invoices <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <ChartBar data={revenueData} dataKeys={['revenue']} xKey="month" ugxFormat height={220} />
        </div>

        {/* Recent Applications */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-slate-900 text-base">{d.recentApplications}</h2>
            <Link to="/admin/applications" className="text-xs font-semibold text-primary-blue hover:text-blue-800 transition-colors">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentApplications.map((a) => (
              <div key={a.name} className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{a.name}</p>
                  <p className="text-xs text-slate-400 truncate">{a.program}</p>
                </div>
                <div className="text-right shrink-0 space-y-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold block ${statusStyles[a.status]}`}>
                    {statusLabel[a.status]}
                  </span>
                  <p className="text-[10px] text-slate-400">{a.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row: Activity + Summary */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Activity feed */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="font-display font-bold text-slate-900 text-base mb-5">Recent Activity</h2>
          <div className="space-y-4">
            {activity.map(({ icon: Icon, text, time, color, bg }, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 leading-snug">{text}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform summary */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="font-display font-bold text-slate-900 text-base mb-5">Platform Overview</h2>
          <div className="space-y-4">
            {[
              { label: 'Active Students',       value: 204, total: 248, color: 'bg-blue-500' },
              { label: 'Course Completion',     value: 76,  total: 100, color: 'bg-emerald-500' },
              { label: 'Applications Reviewed', value: 29,  total: 37,  color: 'bg-amber-500' },
              { label: 'Revenue Target',        value: 82,  total: 100, color: 'bg-violet-500' },
            ].map((item) => {
              const pct = Math.round((item.value / item.total) * 100);
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-slate-600">{item.label}</span>
                    <span className="text-sm font-bold text-slate-800">
                      {item.label.includes('Rate') || item.label.includes('Target') ? `${pct}%` : `${item.value}/${item.total}`}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full rounded-full ${item.color} transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-3 gap-4 text-center">
            {[
              { label: 'Uptime',     value: '99.9%' },
              { label: 'Avg. Rating', value: '4.8' },
              { label: 'Support SLA', value: '98%' },
            ].map((m) => (
              <div key={m.label}>
                <p className="font-display font-extrabold text-xl text-slate-900">{m.value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
