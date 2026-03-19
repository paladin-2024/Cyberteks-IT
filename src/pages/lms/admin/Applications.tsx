import { Search, Filter } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const applications = [
  { id: '1', name: 'Aisha Nakato',     email: 'aisha@email.com',     program: 'Web Development',         education: 'Undergraduate', hours: '5–10 hrs', status: 'PENDING',      date: 'Mar 12, 2026' },
  { id: '2', name: 'David Ochieng',    email: 'david@email.com',     program: 'Cybersecurity',            education: 'Diploma',       hours: '10+ hrs',  status: 'UNDER_REVIEW', date: 'Mar 11, 2026' },
  { id: '3', name: 'Grace Atuhaire',   email: 'grace@email.com',     program: 'Data Analysis',            education: 'Graduate',      hours: '5–10 hrs', status: 'ACCEPTED',     date: 'Mar 10, 2026' },
  { id: '4', name: 'Moses Ssemakula',  email: 'moses@email.com',     program: 'AI & ML',                  education: 'Undergraduate', hours: '2–4 hrs',  status: 'PENDING',      date: 'Mar 9, 2026' },
  { id: '5', name: 'Priscilla Akello', email: 'priscilla@email.com', program: 'IT Support & Networking',  education: 'High School',   hours: '5–10 hrs', status: 'REJECTED',     date: 'Mar 8, 2026' },
  { id: '6', name: 'Samuel Byamugisha',email: 'samuel@email.com',    program: 'Digital Marketing',        education: 'Undergraduate', hours: '2–4 hrs',  status: 'WAITLISTED',   date: 'Mar 7, 2026' },
];

const statusCls: Record<string, string> = {
  PENDING:      'bg-amber-100 text-amber-700',
  UNDER_REVIEW: 'bg-blue-100 text-blue-700',
  ACCEPTED:     'bg-green-100 text-green-700',
  REJECTED:     'bg-red-100 text-red-700',
  WAITLISTED:   'bg-purple-100 text-purple-700',
};

export default function ApplicationsPage() {
  const { t } = useLanguage();
  const d = t.lms.admin.applications;
  const st = t.lms.status;

  const statusLabel: Record<string, string> = {
    PENDING:      st.pending,
    UNDER_REVIEW: st.underReview,
    ACCEPTED:     st.accepted,
    REJECTED:     st.rejected,
    WAITLISTED:   st.waitlisted,
  };

  const statusSummary = Object.keys(statusCls).map((key) => ({
    key,
    label: statusLabel[key],
    cls: statusCls[key],
    count: applications.filter(a => a.status === key).length,
  }));

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">{d.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{applications.length} {d.total.toLowerCase()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            placeholder={d.search}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue"
          />
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:bg-muted transition-all">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {statusSummary.map(({ key, label, cls, count }) => (
          <div key={key} className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="font-heading text-xl font-bold text-foreground">{count}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${cls}`}>{label}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-5 py-3.5 text-muted-foreground font-semibold">{t.lms.admin.users.name}</th>
                <th className="text-left px-5 py-3.5 text-muted-foreground font-semibold">{t.lms.sidebar.courses}</th>
                <th className="text-left px-5 py-3.5 text-muted-foreground font-semibold hidden md:table-cell">Education</th>
                <th className="text-left px-5 py-3.5 text-muted-foreground font-semibold hidden lg:table-cell">Availability</th>
                <th className="text-left px-5 py-3.5 text-muted-foreground font-semibold">{t.lms.admin.users.status}</th>
                <th className="text-left px-5 py-3.5 text-muted-foreground font-semibold hidden sm:table-cell">Date</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-foreground">{app.name}</p>
                    <p className="text-xs text-muted-foreground">{app.email}</p>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{app.program}</td>
                  <td className="px-5 py-4 text-muted-foreground hidden md:table-cell">{app.education}</td>
                  <td className="px-5 py-4 text-muted-foreground hidden lg:table-cell">{app.hours}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusCls[app.status]}`}>
                      {statusLabel[app.status]}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground hidden sm:table-cell">{app.date}</td>
                  <td className="px-5 py-4">
                    <button className="text-xs font-semibold text-primary-blue hover:text-primary-red transition-colors">
                      {d.review}
                    </button>
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
