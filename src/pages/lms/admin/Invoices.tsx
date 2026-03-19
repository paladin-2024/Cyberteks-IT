import { FileText, Download } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const invoices = [
  { id: 'INV-001', student: 'Aisha Nakato',     course: 'Web Development Fundamentals', amount: 450000, status: 'PAID',    date: 'Mar 1, 2026' },
  { id: 'INV-002', student: 'David Ochieng',    course: 'Cybersecurity Essentials',     amount: 380000, status: 'SENT',    date: 'Mar 3, 2026' },
  { id: 'INV-003', student: 'Grace Atuhaire',   course: 'Data Analysis',                amount: 350000, status: 'PAID',    date: 'Feb 28, 2026' },
  { id: 'INV-004', student: 'Moses Ssemakula',  course: 'IT Support & Networking',      amount: 320000, status: 'OVERDUE', date: 'Feb 15, 2026' },
  { id: 'INV-005', student: 'Priscilla Akello', course: 'AI & Machine Learning',        amount: 500000, status: 'DRAFT',   date: 'Mar 10, 2026' },
];

const statusCls: Record<string, string> = {
  PAID:      'bg-green-100 text-green-700',
  SENT:      'bg-blue-100 text-blue-700',
  OVERDUE:   'bg-red-100 text-red-700',
  DRAFT:     'bg-muted text-muted-foreground',
  CANCELLED: 'bg-muted text-muted-foreground',
};

const totalRevenue = invoices.filter(i => i.status === 'PAID').reduce((s, i) => s + i.amount, 0);
const totalPending = invoices.filter(i => i.status === 'SENT').reduce((s, i) => s + i.amount, 0);
const totalOverdue = invoices.filter(i => i.status === 'OVERDUE').reduce((s, i) => s + i.amount, 0);

export default function InvoicesPage() {
  const { t } = useLanguage();
  const d = t.lms.admin.invoices;
  const st = t.lms.status;

  const statusLabel: Record<string, string> = {
    PAID:      st.paid,
    SENT:      st.sent,
    OVERDUE:   st.overdue,
    DRAFT:     st.draft,
    CANCELLED: st.cancelled,
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">{d.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{invoices.length} {d.title.toLowerCase()}</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-blue text-white text-sm font-semibold rounded-xl hover:bg-blue-900 transition-all">
          <FileText className="w-4 h-4" /> {d.invoice}
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: d.collected, value: `UGX ${totalRevenue.toLocaleString()}`, color: 'text-green-600' },
          { label: d.pending,   value: `UGX ${totalPending.toLocaleString()}`, color: 'text-blue-600' },
          { label: d.overdue,   value: `UGX ${totalOverdue.toLocaleString()}`, color: 'text-red-600' },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-5">
            <p className={`font-heading text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-5 py-3.5 text-muted-foreground font-semibold">{d.invoice}</th>
                <th className="text-left px-5 py-3.5 text-muted-foreground font-semibold">{d.student}</th>
                <th className="text-left px-5 py-3.5 text-muted-foreground font-semibold hidden md:table-cell">{d.course}</th>
                <th className="text-right px-5 py-3.5 text-muted-foreground font-semibold">{d.amount}</th>
                <th className="text-left px-5 py-3.5 text-muted-foreground font-semibold">{d.status}</th>
                <th className="text-left px-5 py-3.5 text-muted-foreground font-semibold hidden sm:table-cell">{d.due}</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs font-semibold text-foreground">{inv.id}</td>
                  <td className="px-5 py-4 font-medium text-foreground">{inv.student}</td>
                  <td className="px-5 py-4 text-muted-foreground hidden md:table-cell">{inv.course}</td>
                  <td className="px-5 py-4 text-right font-semibold text-foreground">UGX {inv.amount.toLocaleString()}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusCls[inv.status]}`}>
                      {statusLabel[inv.status]}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground hidden sm:table-cell">{inv.date}</td>
                  <td className="px-5 py-4">
                    <button className="text-muted-foreground hover:text-foreground transition-colors" title={d.download}>
                      <Download className="w-4 h-4" />
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
