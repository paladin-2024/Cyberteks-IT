import { useState, useEffect } from 'react';
import { FileText, Download } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';

interface Invoice {
  id: string;
  invoiceNo: string;
  amount: number;
  currency: string;
  status: string;
  dueDate: string | null;
  createdAt: string;
  user: { id: string; name: string; email: string };
  course: { id: string; title: string } | null;
}

const statusCls: Record<string, string> = {
  PAID:      'bg-green-100 text-green-700',
  SENT:      'bg-blue-100 text-blue-700',
  OVERDUE:   'bg-red-100 text-red-700',
  DRAFT:     'bg-muted text-muted-foreground',
  CANCELLED: 'bg-muted text-muted-foreground',
};

export default function InvoicesPage() {
  const { t } = useLanguage();
  const d = t.lms.admin.invoices;
  const st = t.lms.status;

  const statusLabel: Record<string, string> = {
    PAID: st.paid, SENT: st.sent, OVERDUE: st.overdue,
    DRAFT: st.draft, CANCELLED: st.cancelled,
  };

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [totalOverdue, setTotalOverdue] = useState(0);

  useEffect(() => {
    api.get<{ invoices: Invoice[]; totalRevenue: number; totalPending: number; totalOverdue: number }>('/invoices')
      .then(({ invoices, totalRevenue, totalPending, totalOverdue }) => {
        setInvoices(invoices);
        setTotalRevenue(totalRevenue);
        setTotalPending(totalPending);
        setTotalOverdue(totalOverdue);
      })
      .catch(() => setInvoices([]))
      .finally(() => setLoading(false));
  }, []);

  function formatDate(iso: string | null) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-UG', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">{d.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {loading ? 'Loading…' : `${invoices.length} ${d.title.toLowerCase()}`}
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-blue text-white text-sm font-semibold rounded-xl hover:bg-blue-900 transition-all opacity-50 cursor-not-allowed" disabled>
          <FileText className="w-4 h-4" /> {d.invoice}
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: d.collected, value: `UGX ${totalRevenue.toLocaleString()}`, color: 'text-green-600' },
          { label: d.pending,   value: `UGX ${totalPending.toLocaleString()}`, color: 'text-blue-600' },
          { label: d.overdue,   value: `UGX ${totalOverdue.toLocaleString()}`, color: 'text-red-600' },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-5">
            {loading
              ? <div className="h-7 w-32 bg-muted rounded animate-pulse mb-1" />
              : <p className={`font-heading text-xl font-bold ${s.color}`}>{s.value}</p>
            }
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {loading ? (
          <div className="divide-y divide-border/50">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="px-5 py-4 flex items-center gap-4 animate-pulse">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-4 w-32 bg-muted rounded flex-1" />
                <div className="h-4 w-20 bg-muted rounded" />
                <div className="h-6 w-16 bg-muted rounded-full" />
              </div>
            ))}
          </div>
        ) : invoices.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground text-sm">No invoices found.</div>
        ) : (
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
                    <td className="px-5 py-4 font-mono text-xs font-semibold text-foreground">{inv.invoiceNo}</td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-foreground">{inv.user.name}</p>
                      <p className="text-xs text-muted-foreground">{inv.user.email}</p>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground hidden md:table-cell">
                      {inv.course?.title ?? '—'}
                    </td>
                    <td className="px-5 py-4 text-right font-semibold text-foreground">
                      {inv.currency} {inv.amount.toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusCls[inv.status] ?? 'bg-muted text-muted-foreground'}`}>
                        {statusLabel[inv.status] ?? inv.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground hidden sm:table-cell">
                      {formatDate(inv.dueDate)}
                    </td>
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
        )}
      </div>
    </div>
  );
}
