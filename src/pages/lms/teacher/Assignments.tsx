import { ClipboardList, CheckCircle2, Clock, AlertCircle, Plus } from 'lucide-react';

type AssignmentStatus = 'graded' | 'pending' | 'overdue';

interface Assignment {
  title: string;
  course: string;
  dueDate: string;
  submitted: number;
  total: number;
  graded: number;
  status: AssignmentStatus;
}

const assignments: Assignment[] = [
  { title: 'HTML & CSS Portfolio Page',    course: 'Web Development', dueDate: 'Mar 10, 2026', submitted: 78, total: 84, graded: 78, status: 'graded' },
  { title: 'JavaScript DOM Project',       course: 'Web Development', dueDate: 'Mar 20, 2026', submitted: 65, total: 84, graded: 30, status: 'pending' },
  { title: 'Firewall Configuration Lab',   course: 'Cybersecurity',   dueDate: 'Mar 15, 2026', submitted: 58, total: 62, graded: 58, status: 'graded' },
  { title: 'Network Topology Report',      course: 'Networking',      dueDate: 'Mar 12, 2026', submitted: 50, total: 58, graded: 0,  status: 'overdue' },
  { title: 'Penetration Testing Exercise', course: 'Cybersecurity',   dueDate: 'Mar 25, 2026', submitted: 12, total: 62, graded: 0,  status: 'pending' },
  { title: 'Responsive Website Project',   course: 'Web Development', dueDate: 'Apr 1, 2026',  submitted: 0,  total: 84, graded: 0,  status: 'pending' },
];

const statusConfig: Record<AssignmentStatus, { label: string; icon: React.ElementType; bg: string; border: string; text: string; iconColor: string }> = {
  graded:  { label: 'Graded',  icon: CheckCircle2, bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-700', iconColor: 'text-emerald-500' },
  pending: { label: 'Pending', icon: Clock,        bg: 'bg-amber-50',   border: 'border-amber-100',   text: 'text-amber-700',   iconColor: 'text-amber-500' },
  overdue: { label: 'Overdue', icon: AlertCircle,  bg: 'bg-red-50',     border: 'border-red-100',     text: 'text-red-700',     iconColor: 'text-red-500' },
};

export default function AssignmentsPage() {
  const total   = assignments.length;
  const graded  = assignments.filter(a => a.status === 'graded').length;
  const pending = assignments.filter(a => a.status === 'pending').length;
  const overdue = assignments.filter(a => a.status === 'overdue').length;

  return (
    <div className="space-y-6 max-w-5xl pb-8">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-900">Assignments</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage and grade student submissions</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary-blue text-white text-sm font-bold rounded-xl hover:bg-blue-800 transition-all shadow-sm">
          <Plus className="w-4 h-4" />
          New Assignment
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total',   value: total,   iconBg: 'bg-slate-50',   iconColor: 'text-slate-600',   icon: ClipboardList },
          { label: 'Graded',  value: graded,  iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', icon: CheckCircle2 },
          { label: 'Pending', value: pending, iconBg: 'bg-amber-50',   iconColor: 'text-amber-600',   icon: Clock },
          { label: 'Overdue', value: overdue, iconBg: 'bg-red-50',     iconColor: 'text-red-600',     icon: AlertCircle },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${s.iconBg}`}>
              <s.icon className={`w-4 h-4 ${s.iconColor}`} />
            </div>
            <p className="font-display text-2xl font-extrabold text-slate-900 leading-none">{s.value}</p>
            <p className="text-xs font-medium text-slate-500 mt-1">{s.label} Assignments</p>
          </div>
        ))}
      </div>

      {/* Assignment cards */}
      <div className="space-y-3">
        {assignments.map((a) => {
          const cfg = statusConfig[a.status];
          const Icon = cfg.icon;
          const submissionPct = a.total > 0 ? Math.round((a.submitted / a.total) * 100) : 0;
          const gradedPct     = a.submitted > 0 ? Math.round((a.graded / a.submitted) * 100) : 0;

          return (
            <div key={a.title} className={`bg-white border rounded-2xl p-5 hover:shadow-sm transition-all ${a.status === 'overdue' ? 'border-red-200' : 'border-slate-200'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg} border ${cfg.border}`}>
                    <Icon className={`w-5 h-5 ${cfg.iconColor}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 text-sm">{a.title}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-400">
                      <span>{a.course}</span>
                      <span>·</span>
                      <span>Due: {a.dueDate}</span>
                    </div>
                  </div>
                </div>
                <span className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                  {cfg.label}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-500 font-medium">Submissions</span>
                    <span className="font-bold text-slate-700">{a.submitted}/{a.total}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full bg-blue-500" style={{ width: `${submissionPct}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-500 font-medium">Graded</span>
                    <span className="font-bold text-slate-700">{a.graded}/{a.submitted}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full rounded-full ${gradedPct === 100 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${gradedPct}%` }} />
                  </div>
                </div>
              </div>

              {(a.status === 'pending' || a.status === 'overdue') && a.submitted > 0 && (
                <div className="mt-4 flex gap-2">
                  <button className="px-4 py-1.5 bg-primary-blue text-white text-xs font-bold rounded-xl hover:bg-blue-800 transition-all">
                    Grade Submissions ({a.submitted - a.graded} remaining)
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
