import { useState, useEffect } from 'react';
import {
  FileText, Download, Eye, CheckCircle, XCircle, Clock, Search,
  X, AlertTriangle, Loader2, ExternalLink, Award,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';

interface Invoice {
  id: string;
  invoiceNo: string;
  amount: number;
  currency: string;
  status: string;
  dueDate: string | null;
  paidAt: string | null;
  createdAt: string;
  type: string | null;
  notes: string | null;
  guestName: string | null;
  guestEmail: string | null;
  paymentProofUrl: string | null;
  rejectionReason: string | null;
  reviewedAt: string | null;
  accessDurationDays: number | null;
  user: { id: string; name: string; email: string } | null;
  course: { id: string; title: string; duration: string | null } | null;
}

const STATUS_META: Record<string, { label: string; cls: string }> = {
  PAID:           { label: 'Paid',           cls: 'bg-green-100 text-green-700' },
  SENT:           { label: 'Sent',           cls: 'bg-blue-100 text-blue-700' },
  OVERDUE:        { label: 'Overdue',        cls: 'bg-red-100 text-red-700' },
  DRAFT:          { label: 'Draft',          cls: 'bg-muted text-muted-foreground' },
  CANCELLED:      { label: 'Cancelled',      cls: 'bg-muted text-muted-foreground' },
  PENDING_REVIEW: { label: 'Pending Review', cls: 'bg-amber-100 text-amber-700' },
};

const STATUS_FILTERS = ['ALL', 'PENDING_REVIEW', 'PAID', 'SENT', 'OVERDUE', 'DRAFT', 'CANCELLED'];

// ── Proof Preview Modal ────────────────────────────────────────────────────────

function ProofModal({ url, invoiceNo, onClose }: {
  url: string;
  invoiceNo: string;
  onClose: () => void;
}) {
  const isImage = /\.(jpg|jpeg|png|webp|heic|gif)$/i.test(url);
  const isPdf   = /\.pdf$/i.test(url);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Payment Proof</p>
            <p className="font-mono text-sm font-bold text-foreground">{invoiceNo}</p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 transition-colors text-foreground"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Open Full
            </a>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto flex items-center justify-center bg-slate-50 p-4">
          {isImage ? (
            <img
              src={url}
              alt="Payment proof"
              className="max-w-full max-h-[65vh] object-contain rounded-lg shadow"
            />
          ) : isPdf ? (
            <iframe src={url} className="w-full h-[65vh] rounded-lg" title="Payment proof PDF" />
          ) : (
            <div className="text-center text-muted-foreground py-12">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Preview not available for this file type.</p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-blue hover:underline"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Open File
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Reject Modal ──────────────────────────────────────────────────────────────

function RejectModal({ invoiceNo, onConfirm, onCancel, loading }: {
  invoiceNo: string;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [reason, setReason] = useState('');

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
            <XCircle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">Reject Payment</p>
            <p className="text-xs text-muted-foreground font-mono">{invoiceNo}</p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            The student will be notified and asked to resubmit their proof. You can optionally provide a reason.
          </p>
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Reason (optional) — e.g. 'Screenshot is unclear' or 'Amount doesn't match'"
            rows={3}
            className="w-full px-3 py-2.5 rounded-xl border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-red/20 resize-none"
          />
        </div>
        <div className="px-6 pb-6 flex items-center gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-muted/40 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reason)}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Reject Payment'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function InvoicesPage() {
  const { t } = useLanguage();
  const d  = t.lms.admin.invoices;

  const [invoices, setInvoices]               = useState<Invoice[]>([]);
  const [loading, setLoading]                 = useState(true);
  const [totalRevenue, setTotalRevenue]       = useState(0);
  const [totalPending, setTotalPending]       = useState(0);
  const [totalOverdue, setTotalOverdue]       = useState(0);
  const [totalPendingReview, setTotalPendingReview] = useState(0);
  const [activeFilter, setActiveFilter]       = useState('ALL');
  const [search, setSearch]                   = useState('');

  const [proofModal, setProofModal]           = useState<{ url: string; invoiceNo: string } | null>(null);
  const [rejectModal, setRejectModal]         = useState<Invoice | null>(null);
  const [actionLoading, setActionLoading]     = useState<string | null>(null);

  function fetchInvoices(status = activeFilter, q = search) {
    setLoading(true);
    const params = new URLSearchParams();
    if (status !== 'ALL') params.set('status', status);
    if (q.trim()) params.set('search', q.trim());
    api.get<{
      invoices: Invoice[];
      totalRevenue: number;
      totalPending: number;
      totalOverdue: number;
      totalPendingReview: number;
    }>(`/invoices?${params}`)
      .then(({ invoices, totalRevenue, totalPending, totalOverdue, totalPendingReview }) => {
        setInvoices(invoices);
        setTotalRevenue(totalRevenue);
        setTotalPending(totalPending);
        setTotalOverdue(totalOverdue);
        setTotalPendingReview(totalPendingReview);
      })
      .catch(() => setInvoices([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchInvoices(); }, []);

  function handleFilterChange(f: string) {
    setActiveFilter(f);
    fetchInvoices(f, search);
  }

  function handleSearch(q: string) {
    setSearch(q);
    fetchInvoices(activeFilter, q);
  }

  async function handleApprove(inv: Invoice) {
    setActionLoading(inv.id + '_approve');
    try {
      await api.patch(`/invoices/${inv.id}/approve`, {});
      fetchInvoices();
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReject(inv: Invoice, reason: string) {
    setActionLoading(inv.id + '_reject');
    try {
      await api.patch(`/invoices/${inv.id}/reject`, { reason });
      setRejectModal(null);
      fetchInvoices();
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  }

  function downloadPdf(inv: Invoice) {
    const token = localStorage.getItem('token');
    const BASE  = (import.meta.env.VITE_API_URL ?? '') + '/api';
    fetch(`${BASE}/invoices/${inv.id}/pdf`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(r => r.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a   = document.createElement('a');
        a.href     = url;
        a.download = `invoice-${inv.invoiceNo}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      })
      .catch(err => console.error('[downloadPdf]', err));
  }

  function formatDate(iso: string | null) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-UG', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  const pendingReviewInvoices = invoices.filter(i => i.status === 'PENDING_REVIEW');

  return (
    <div className="space-y-6 max-w-7xl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">{d.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {loading ? 'Loading…' : `${invoices.length} record${invoices.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        {totalPendingReview > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-bold text-amber-700">
              {totalPendingReview} payment{totalPendingReview !== 1 ? 's' : ''} awaiting review
            </span>
          </div>
        )}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: d.collected,       value: `UGX ${totalRevenue.toLocaleString()}`,    color: 'text-green-600', sub: 'Collected' },
          { label: d.pending,         value: `UGX ${totalPending.toLocaleString()}`,    color: 'text-blue-600',  sub: 'Pending' },
          { label: d.overdue,         value: `UGX ${totalOverdue.toLocaleString()}`,    color: 'text-red-600',   sub: 'Overdue' },
          { label: 'Pending Review',  value: String(totalPendingReview),                 color: 'text-amber-600', sub: 'Need review' },
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

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Status filter tabs */}
        <div className="flex items-center gap-1 flex-wrap">
          {STATUS_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => handleFilterChange(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                activeFilter === f
                  ? 'bg-primary-blue text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {f === 'ALL' ? 'All' : (STATUS_META[f]?.label ?? f)}
              {f === 'PENDING_REVIEW' && totalPendingReview > 0 && (
                <span className="ml-1.5 bg-amber-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
                  {totalPendingReview}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative sm:ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search name, email, invoice…"
            className="pl-9 pr-4 py-2 rounded-xl border border-border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-blue/20 w-64"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {loading ? (
          <div className="divide-y divide-border/50">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-5 py-4 flex items-center gap-4 animate-pulse">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-4 w-32 bg-muted rounded flex-1" />
                <div className="h-4 w-20 bg-muted rounded" />
                <div className="h-6 w-20 bg-muted rounded-full" />
                <div className="h-8 w-24 bg-muted rounded-xl" />
              </div>
            ))}
          </div>
        ) : invoices.length === 0 ? (
          <div className="p-16 text-center text-muted-foreground text-sm">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-20" />
            No invoices found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-5 py-3.5 text-muted-foreground font-semibold">Invoice</th>
                  <th className="text-left px-5 py-3.5 text-muted-foreground font-semibold">Student</th>
                  <th className="text-left px-5 py-3.5 text-muted-foreground font-semibold hidden md:table-cell">Type</th>
                  <th className="text-right px-5 py-3.5 text-muted-foreground font-semibold">Amount</th>
                  <th className="text-left px-5 py-3.5 text-muted-foreground font-semibold">Status</th>
                  <th className="text-left px-5 py-3.5 text-muted-foreground font-semibold hidden sm:table-cell">Date</th>
                  <th className="px-5 py-3.5 text-muted-foreground font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => {
                  const meta         = STATUS_META[inv.status] ?? { label: inv.status, cls: 'bg-muted text-muted-foreground' };
                  const isPending    = inv.status === 'PENDING_REVIEW';
                  const isPaid       = inv.status === 'PAID';
                  const approvingKey = inv.id + '_approve';
                  const rejectingKey = inv.id + '_reject';

                  return (
                    <tr key={inv.id} className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${isPending ? 'bg-amber-50/30' : ''}`}>
                      {/* Invoice No */}
                      <td className="px-5 py-4 font-mono text-xs font-semibold text-foreground whitespace-nowrap">
                        {inv.invoiceNo}
                      </td>

                      {/* Student */}
                      <td className="px-5 py-4">
                        <p className="font-medium text-foreground">{inv.user?.name ?? inv.guestName ?? '—'}</p>
                        <p className="text-xs text-muted-foreground">{inv.user?.email ?? inv.guestEmail ?? ''}</p>
                      </td>

                      {/* Type */}
                      <td className="px-5 py-4 hidden md:table-cell">
                        {inv.type === 'MENTORSHIP_HUB' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#E11D48]/10 text-[#E11D48]">
                            <Award className="w-3 h-3" /> Mentorship Hub
                          </span>
                        ) : inv.course?.title ? (
                          <span className="text-sm text-muted-foreground">{inv.course.title}</span>
                        ) : inv.notes ? (
                          <span className="text-xs text-muted-foreground truncate max-w-[160px] block">{inv.notes}</span>
                        ) : (
                          <span className="text-sm text-muted-foreground">Course Payment</span>
                        )}
                        {(isPaid || isPending) && inv.course?.duration && (
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            <Clock className="w-2.5 h-2.5 inline mr-0.5" />
                            {inv.course.duration}
                          </p>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-4 text-right font-semibold text-foreground whitespace-nowrap">
                        {inv.currency} {inv.amount.toLocaleString()}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${meta.cls}`}>
                          {meta.label}
                        </span>
                        {isPending && (
                          <p className="text-[10px] text-amber-600 mt-1 font-medium">Proof uploaded</p>
                        )}
                        {isPaid && inv.paidAt && (
                          <p className="text-[10px] text-muted-foreground mt-1">{formatDate(inv.paidAt)}</p>
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-muted-foreground text-xs hidden sm:table-cell whitespace-nowrap">
                        {formatDate(inv.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 justify-end flex-wrap">
                          {/* View proof */}
                          {inv.paymentProofUrl && (
                            <button
                              onClick={() => setProofModal({ url: inv.paymentProofUrl!, invoiceNo: inv.invoiceNo })}
                              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 transition-colors text-foreground"
                              title="View payment proof"
                            >
                              <Eye className="w-3.5 h-3.5" /> Proof
                            </button>
                          )}

                          {/* Approve */}
                          {isPending && (
                            <button
                              onClick={() => handleApprove(inv)}
                              disabled={actionLoading === approvingKey}
                              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-green-500 hover:bg-green-600 text-white transition-colors disabled:opacity-60"
                              title="Approve payment"
                            >
                              {actionLoading === approvingKey
                                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                : <CheckCircle className="w-3.5 h-3.5" />
                              }
                              Approve
                            </button>
                          )}

                          {/* Reject */}
                          {isPending && (
                            <button
                              onClick={() => setRejectModal(inv)}
                              disabled={!!actionLoading}
                              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors disabled:opacity-60"
                              title="Reject payment"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Reject
                            </button>
                          )}

                          {/* Download PDF */}
                          {isPaid && (
                            <button
                              onClick={() => downloadPdf(inv)}
                              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-primary-blue/10 hover:bg-primary-blue/20 text-primary-blue transition-colors"
                              title="Download invoice PDF"
                            >
                              <Download className="w-3.5 h-3.5" /> PDF
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Proof preview modal */}
      {proofModal && (
        <ProofModal
          url={proofModal.url}
          invoiceNo={proofModal.invoiceNo}
          onClose={() => setProofModal(null)}
        />
      )}

      {/* Reject modal */}
      {rejectModal && (
        <RejectModal
          invoiceNo={rejectModal.invoiceNo}
          loading={actionLoading === rejectModal.id + '_reject'}
          onConfirm={(reason) => handleReject(rejectModal, reason)}
          onCancel={() => setRejectModal(null)}
        />
      )}
    </div>
  );
}
