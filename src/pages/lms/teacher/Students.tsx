import { Users, TrendingUp, Clock, Search, MessageSquare } from 'lucide-react';

const students = [
  { name: 'Aisha Nakato',      email: 'aisha@example.com',     course: 'Web Development', progress: 72, score: 84, hours: 16, lastSeen: '2 hrs ago',  status: 'active' },
  { name: 'David Ochieng',     email: 'david@example.com',     course: 'Web Development', progress: 28, score: 61, hours: 6,  lastSeen: '3 days ago', status: 'at-risk' },
  { name: 'Grace Atuhaire',    email: 'grace@example.com',     course: 'Networking',       progress: 91, score: 96, hours: 20, lastSeen: 'Yesterday',  status: 'top' },
  { name: 'Moses Ssemakula',   email: 'moses@example.com',     course: 'Cybersecurity',    progress: 45, score: 72, hours: 10, lastSeen: 'Today',      status: 'active' },
  { name: 'Priscilla Akello',  email: 'priscilla@example.com', course: 'Networking',       progress: 67, score: 79, hours: 14, lastSeen: '1 day ago',  status: 'active' },
  { name: 'Ivan Kyeyune',      email: 'ivan@example.com',      course: 'Web Development', progress: 15, score: 52, hours: 3,  lastSeen: '1 week ago', status: 'inactive' },
  { name: 'Fatuma Nalwanga',   email: 'fatuma@example.com',    course: 'Cybersecurity',    progress: 82, score: 88, hours: 18, lastSeen: 'Today',      status: 'active' },
  { name: 'Ronald Byaruhanga', email: 'ronald@example.com',    course: 'Networking',       progress: 55, score: 74, hours: 12, lastSeen: '2 days ago', status: 'active' },
];

const statusConfig: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  active:   { label: 'Active',   bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-500' },
  top:      { label: 'Top',      bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'at-risk':{ label: 'At Risk',  bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500' },
  inactive: { label: 'Inactive', bg: 'bg-slate-100',  text: 'text-slate-500',   dot: 'bg-slate-400' },
};

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
    </div>
  );
}

export default function StudentsPage() {
  const total       = students.length;
  const active      = students.filter(s => s.status === 'active' || s.status === 'top').length;
  const atRisk      = students.filter(s => s.status === 'at-risk').length;
  const avgProgress = Math.round(students.reduce((a, s) => a + s.progress, 0) / total);

  return (
    <div className="space-y-6 max-w-6xl pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-900">Students</h1>
          <p className="text-slate-500 text-sm mt-0.5">Monitor progress, engagement, and performance</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Students',  value: total,          icon: Users,      iconBg: 'bg-blue-50',    iconColor: 'text-blue-600' },
          { label: 'Active Learners', value: active,         icon: TrendingUp, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
          { label: 'At Risk',         value: atRisk,         icon: Clock,      iconBg: 'bg-amber-50',   iconColor: 'text-amber-600' },
          { label: 'Avg. Progress',   value: `${avgProgress}%`, icon: TrendingUp, iconBg: 'bg-violet-50', iconColor: 'text-violet-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${s.iconBg}`}>
              <s.icon className={`w-4 h-4 ${s.iconColor}`} />
            </div>
            <p className="font-display text-2xl font-extrabold text-slate-900 leading-none">{s.value}</p>
            <p className="text-xs font-medium text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-display font-bold text-slate-900 text-base">All Students</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              placeholder="Search students..."
              className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue w-44 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Student</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Course</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Progress</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Score</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Hours</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Last Seen</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {students.map((s) => {
                const cfg = statusConfig[s.status];
                const barColor = s.progress >= 80 ? 'bg-emerald-500' : s.progress >= 50 ? 'bg-blue-500' : 'bg-amber-500';
                const initials = s.name.split(' ').map(n => n[0]).join('').slice(0, 2);
                return (
                  <tr key={s.email} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-primary-blue flex items-center justify-center shrink-0">
                          <span className="text-white text-[10px] font-bold">{initials}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{s.name}</p>
                          <p className="text-xs text-slate-400">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-600 text-sm">{s.course}</td>
                    <td className="px-4 py-4">
                      <div className="w-24 mx-auto">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-400">{s.progress}%</span>
                        </div>
                        <ProgressBar value={s.progress} color={barColor} />
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`font-bold text-sm ${s.score >= 80 ? 'text-emerald-600' : s.score >= 65 ? 'text-slate-700' : 'text-amber-600'}`}>
                        {s.score}%
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center text-slate-500 text-sm">{s.hours}h</td>
                    <td className="px-4 py-4 text-slate-400 text-xs">{s.lastSeen}</td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} shrink-0`} />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button className="w-7 h-7 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-primary-blue hover:border-primary-blue hover:text-white text-slate-400 transition-all mx-auto">
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Showing {students.length} students</span>
          <span>Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
}
