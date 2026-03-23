import { useState, useEffect, useCallback } from 'react';
import {
  Search, Monitor, Clock, Mail, Phone, MapPin, AlertTriangle,
  CheckCircle2, RefreshCw, X, ChevronRight, Send, Loader2,
  Building2, Wifi, MessageSquare, ExternalLink,
} from 'lucide-react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

interface SupportRequest {
  id: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  fullName: string;
  email: string;
  phone: string | null;
  company: string | null;
  location: string | null;
  deviceType: string | null;
  os: string | null;
  problemCategory: string | null;
  problemDescription: string;
  errorMessages: string | null;
  urgency: string;
  remoteTool: string | null;
  remoteId: string | null;
  availableTime: string | null;
  adminNotes: string | null;
  repliedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

const STATUS_META: Record<string, { label: string; color: string; dot: string }> = {
  OPEN:        { label: 'Open',        color: 'bg-amber-100 text-amber-700 border border-amber-200',  dot: 'bg-amber-500' },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-blue-100 text-blue-700 border border-blue-200',    dot: 'bg-blue-500' },
  RESOLVED:    { label: 'Resolved',    color: 'bg-green-100 text-green-700 border border-green-200', dot: 'bg-green-500' },
  CLOSED:      { label: 'Closed',      color: 'bg-gray-100 text-gray-600 border border-border',    dot: 'bg-gray-400' },
};

const URGENCY_META: Record<string, { color: string }> = {
  Low:      { color: 'bg-green-100 text-green-700' },
  Medium:   { color: 'bg-amber-100 text-amber-700' },
  High:     { color: 'bg-orange-100 text-orange-700' },
  Critical: { color: 'bg-red-100 text-red-700' },
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 2)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function DetailRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">{label}</p>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  );
}

export default function AdminITSupport() {
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState<SupportRequest | null>(null);
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState<string>('ALL');

  // Reply form
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [replying,     setReplying]     = useState(false);
  const [replyDone,    setReplyDone]    = useState(false);
  const [replyError,   setReplyError]   = useState('');

  // Notes
  const [adminNotes,    setAdminNotes]    = useState('');
  const [savingNotes,   setSavingNotes]   = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<{ requests: SupportRequest[] }>('/get-started');
      setRequests(data.requests ?? []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const selectRequest = (r: SupportRequest) => {
    setSelected(r);
    setAdminNotes(r.adminNotes ?? '');
    setReplySubject('');
    setReplyMessage('');
    setReplyDone(false);
    setReplyError('');
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const data = await api.patch<{ request: SupportRequest }>(`/get-started/${id}`, { status });
      setRequests((prev) => prev.map((r) => r.id === id ? data.request : r));
      if (selected?.id === id) setSelected(data.request);
    } catch { /* ignore */ }
  };

  const saveNotes = async () => {
    if (!selected) return;
    setSavingNotes(true);
    try {
      const data = await api.patch<{ request: SupportRequest }>(`/get-started/${selected.id}`, { adminNotes });
      setRequests((prev) => prev.map((r) => r.id === selected.id ? data.request : r));
      setSelected(data.request);
    } catch { /* ignore */ }
    setSavingNotes(false);
  };

  const sendReply = async () => {
    if (!selected || !replyMessage.trim()) return;
    setReplying(true);
    setReplyError('');
    try {
      const data = await api.post<{ request: SupportRequest; emailSent: boolean; emailError: string | null }>(`/get-started/${selected.id}/reply`, {
        subject: replySubject || undefined,
        message: replyMessage,
      });
      setReplyDone(true);
      setRequests((prev) => prev.map((r) => r.id === selected.id ? data.request : r));
      setSelected(data.request);
      if (!data.emailSent && data.emailError) {
        setReplyError(`Reply saved, but email delivery failed: ${data.emailError}`);
      }
    } catch (err: unknown) {
      setReplyError(err instanceof Error ? err.message : 'Failed to send reply');
    } finally {
      setReplying(false);
    }
  };

  const filtered = requests.filter((r) => {
    const matchesFilter = filter === 'ALL' || r.status === filter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      r.fullName.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      (r.problemCategory ?? '').toLowerCase().includes(q) ||
      r.problemDescription.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const counts = {
    ALL:        requests.length,
    OPEN:       requests.filter((r) => r.status === 'OPEN').length,
    IN_PROGRESS:requests.filter((r) => r.status === 'IN_PROGRESS').length,
    RESOLVED:   requests.filter((r) => r.status === 'RESOLVED').length,
    CLOSED:     requests.filter((r) => r.status === 'CLOSED').length,
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-border shrink-0">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-bold text-foreground">Remote IT Support Requests</h1>
          <button
            onClick={load}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw className={cn('w-3.5 h-3.5', loading && 'animate-spin')} />
            Refresh
          </button>
        </div>
        <p className="text-sm text-muted-foreground">Review and respond to incoming IT support requests</p>

        {/* Tabs */}
        <div className="flex gap-1 mt-4 flex-wrap">
          {(['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                filter === s
                  ? 'bg-[#023064] text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {s === 'ALL' ? 'All' : (STATUS_META[s]?.label ?? s)}{' '}
              <span className={cn(
                'ml-1 px-1.5 py-0.5 rounded-full text-[10px]',
                filter === s ? 'bg-card/20 text-white' : 'bg-background text-foreground'
              )}>
                {counts[s]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* List */}
        <div className={cn(
          'flex flex-col border-r border-border bg-muted/30 shrink-0 overflow-hidden transition-all',
          selected ? 'w-[340px] hidden lg:flex' : 'w-full lg:w-[400px] flex'
        )}>
          {/* Search */}
          <div className="px-4 py-3 border-b border-border shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, problem…"
                className="w-full pl-8 pr-3 py-2 text-sm rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#023064]/20"
              />
            </div>
          </div>

          {/* Request list */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-center px-6">
                <Monitor className="w-8 h-8 text-muted-foreground/40 mb-2" />
                <p className="text-sm text-muted-foreground">No requests found</p>
              </div>
            ) : (
              filtered.map((r) => {
                const sm = STATUS_META[r.status] ?? STATUS_META.OPEN;
                const um = URGENCY_META[r.urgency] ?? URGENCY_META.Medium;
                const isActive = selected?.id === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => selectRequest(r)}
                    className={cn(
                      'w-full text-left px-4 py-3.5 border-b border-border/60 transition-colors hover:bg-muted/60',
                      isActive && 'bg-[#023064]/5 border-l-2 border-l-[#023064]'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#023064]/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Monitor className="w-4 h-4 text-[#023064]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-semibold text-foreground truncate">{r.fullName}</span>
                          <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0', um.color)}>
                            {r.urgency}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mb-1.5">
                          {r.problemCategory || r.problemDescription}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className={cn('inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full', sm.color)}>
                            <span className={cn('w-1.5 h-1.5 rounded-full', sm.dot)} />
                            {sm.label}
                          </span>
                          <span className="text-[10px] text-muted-foreground">{timeAgo(r.createdAt)}</span>
                          {r.repliedAt && (
                            <span className="text-[10px] text-green-600 flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3" /> Replied
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-2" />
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Detail panel */}
        {selected ? (
          <div className="flex-1 min-w-0 overflow-y-auto">
            {/* Detail header */}
            <div className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4 flex items-center gap-3">
              <button
                onClick={() => setSelected(null)}
                className="lg:hidden p-1.5 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-bold text-foreground truncate">{selected.fullName}</h2>
                <p className="text-xs text-muted-foreground">{selected.email}</p>
              </div>
              {/* Status selector */}
              <select
                value={selected.status}
                onChange={(e) => updateStatus(selected.id, e.target.value)}
                className={cn(
                  'text-xs font-medium px-2.5 py-1.5 rounded-lg border cursor-pointer focus:outline-none',
                  STATUS_META[selected.status]?.color ?? ''
                )}
              >
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>

            <div className="px-6 py-5 space-y-6">
              {/* Contact info */}
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Contact Information</h3>
                <div className="bg-muted/40 rounded-2xl p-4 grid grid-cols-2 gap-3">
                  <div className="flex items-start gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[11px] text-muted-foreground">Email</p>
                      <a href={`mailto:${selected.email}`} className="text-sm text-[#023064] hover:underline">
                        {selected.email}
                      </a>
                    </div>
                  </div>
                  {selected.phone && (
                    <div className="flex items-start gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[11px] text-muted-foreground">Phone</p>
                        <p className="text-sm">{selected.phone}</p>
                      </div>
                    </div>
                  )}
                  {selected.company && (
                    <div className="flex items-start gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[11px] text-muted-foreground">Company</p>
                        <p className="text-sm">{selected.company}</p>
                      </div>
                    </div>
                  )}
                  {selected.location && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[11px] text-muted-foreground">Location</p>
                        <p className="text-sm">{selected.location}</p>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Device & problem */}
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Device & Problem</h3>
                <div className="bg-muted/40 rounded-2xl p-4 space-y-3">
                  <div className="flex gap-4 flex-wrap">
                    {selected.deviceType && (
                      <div className="flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{selected.deviceType}</span>
                      </div>
                    )}
                    {selected.os && (
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{selected.os}</span>
                      </div>
                    )}
                    <div className={cn('text-xs font-medium px-2 py-0.5 rounded-full', URGENCY_META[selected.urgency]?.color ?? URGENCY_META.Medium.color)}>
                      {selected.urgency} priority
                    </div>
                  </div>
                  {selected.problemCategory && (
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">Category</p>
                      <p className="text-sm font-medium text-foreground">{selected.problemCategory}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">Description</p>
                    <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{selected.problemDescription}</p>
                  </div>
                  {selected.errorMessages && (
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">Error Messages</p>
                      <p className="text-sm text-foreground whitespace-pre-wrap font-mono bg-muted rounded-xl p-2.5">{selected.errorMessages}</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Remote access */}
              {(selected.remoteTool || selected.remoteId || selected.availableTime) && (
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Remote Access</h3>
                  <div className="bg-muted/40 rounded-2xl p-4 space-y-3">
                    <DetailRow label="Remote Tool" value={selected.remoteTool} />
                    {selected.remoteId && (
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">Remote ID</p>
                        <code className="text-sm bg-muted px-2 py-1 rounded-lg font-mono">{selected.remoteId}</code>
                      </div>
                    )}
                    {selected.availableTime && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-[11px] text-muted-foreground">Available Time</p>
                          <p className="text-sm">{selected.availableTime}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Meta */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>Submitted {new Date(selected.createdAt).toLocaleString()}</span>
                {selected.repliedAt && (
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle2 className="w-3 h-3" />
                    Replied {new Date(selected.repliedAt).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Admin notes */}
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Internal Notes</h3>
                <div className="space-y-2">
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={3}
                    placeholder="Add internal notes (not sent to client)…"
                    className="w-full text-sm rounded-xl border border-border bg-background px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#023064]/20 resize-none"
                  />
                  <button
                    onClick={saveNotes}
                    disabled={savingNotes}
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-colors disabled:opacity-50"
                  >
                    {savingNotes ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MessageSquare className="w-3.5 h-3.5" />}
                    Save Notes
                  </button>
                </div>
              </section>

              {/* Email reply */}
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Reply to Client</h3>
                {replyDone ? (
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Reply sent successfully</p>
                      <p className="text-xs text-green-700 mt-0.5">Email delivered to {selected.email}</p>
                    </div>
                    <button
                      onClick={() => { setReplyDone(false); setReplyMessage(''); setReplySubject(''); }}
                      className="ml-auto text-xs text-green-700 hover:text-green-900 underline"
                    >
                      Send another
                    </button>
                  </div>
                ) : (
                  <div className="bg-muted/40 rounded-2xl p-4 space-y-3">
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground block mb-1">
                        Subject (optional)
                      </label>
                      <input
                        value={replySubject}
                        onChange={(e) => setReplySubject(e.target.value)}
                        placeholder={`Re: Your IT Support Request — CyberteksIT`}
                        className="w-full text-sm rounded-xl border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#023064]/20"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground block mb-1">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        rows={6}
                        placeholder={`Hi ${selected.fullName},\n\nThank you for reaching out. Here's what we found…`}
                        className="w-full text-sm rounded-xl border border-border bg-background px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#023064]/20 resize-y"
                      />
                    </div>
                    {replyError && (
                      <p className="text-xs text-red-600 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" /> {replyError}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" />
                        Sending to <strong className="ml-1">{selected.email}</strong>
                      </p>
                      <button
                        onClick={sendReply}
                        disabled={replying || !replyMessage.trim()}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#023064] text-white text-sm font-medium hover:bg-[#023064]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {replying ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        {replying ? 'Sending…' : 'Send Reply'}
                      </button>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </div>
        ) : (
          <div className="hidden lg:flex flex-1 items-center justify-center text-center p-8">
            <div>
              <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto mb-4">
                <Wifi className="w-8 h-8 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">Select a request</p>
              <p className="text-xs text-muted-foreground">Click any request on the left to view details and reply</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
