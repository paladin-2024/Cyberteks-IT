import { useState, useEffect } from 'react';
import {
  Mail, Send, Users, Trash2, CheckCircle2, AlertCircle,
  Loader2, RefreshCw, Search,
} from 'lucide-react';
import { api } from '@/lib/api';

interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

export default function AdminNewsletter() {
  // ── Subscribers ───────────────────────────────────────────────────────────
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [search, setSearch] = useState('');

  const fetchSubscribers = async () => {
    setLoadingList(true);
    try {
      const data = await api.get<{ subscribers: Subscriber[] }>('/newsletter/subscribers');
      setSubscribers(data.subscribers ?? []);
    } catch { /* silent */ }
    finally { setLoadingList(false); }
  };

  useEffect(() => { fetchSubscribers(); }, []);

  const handleDelete = async (email: string) => {
    if (!confirm(`Remove ${email} from subscribers?`)) return;
    try {
      await api.delete(`/newsletter/subscribers/${encodeURIComponent(email)}`);
      setSubscribers(prev => prev.filter(s => s.email !== email));
    } catch {
      alert('Failed to remove subscriber.');
    }
  };

  // ── Broadcast form ────────────────────────────────────────────────────────
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent: number; failed: number } | null>(null);
  const [error, setError] = useState('');

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    setError('');
    setSending(true);
    try {
      const data = await api.post<{ sent: number; failed: number }>('/newsletter/broadcast', { subject, message });
      setResult({ sent: data.sent, failed: data.failed });
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setError(err?.message ?? 'Failed to send. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const filtered = subscribers.filter(s => s.email.includes(search.toLowerCase()));

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Newsletter</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Broadcast emails to all subscribers and manage your mailing list.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="font-heading text-2xl font-bold text-foreground">{subscribers.length}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Total Subscribers</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="font-heading text-2xl font-bold text-foreground">
            {subscribers.filter(s => {
              const d = new Date(s.subscribedAt);
              const now = new Date();
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            }).length}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">Joined This Month</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 col-span-2 sm:col-span-1">
          <p className="font-heading text-2xl font-bold text-foreground">
            {result ? result.sent : '—'}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">Last Broadcast Delivered</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        {/* ── Compose Broadcast ── */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-blue/10 flex items-center justify-center">
              <Send className="w-4 h-4 text-primary-blue" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground text-sm">Compose Broadcast</h2>
              <p className="text-xs text-muted-foreground">
                Will be sent to {subscribers.length} subscriber{subscribers.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {result && (
              <div className="flex items-start gap-3 bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Broadcast sent!</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {result.sent} delivered{result.failed > 0 ? `, ${result.failed} failed` : ''}
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-3 bg-destructive/10 border border-destructive/20 rounded-xl p-4">
                <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <form onSubmit={handleBroadcast} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="e.g. New Course Available — Web Design!"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={9}
                  placeholder="Write your newsletter message here..."
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={sending || subscribers.length === 0}
                className="w-full flex items-center justify-center gap-2 bg-primary-blue hover:bg-primary-blue/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
              >
                {sending
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                  : <><Send className="w-4 h-4" /> Send to {subscribers.length} Subscribers</>
                }
              </button>
            </form>
          </div>
        </div>

        {/* ── Subscribers List ── */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-blue/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-primary-blue" />
              </div>
              <h2 className="font-semibold text-foreground text-sm">
                Subscribers
                <span className="ml-2 text-xs font-normal bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                  {subscribers.length}
                </span>
              </h2>
            </div>
            <button
              onClick={fetchSubscribers}
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loadingList ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="px-4 py-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by email..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue"
              />
            </div>
          </div>

          <div className="overflow-y-auto max-h-[480px]">
            {loadingList ? (
              <div className="flex items-center justify-center py-14">
                <Loader2 className="w-6 h-6 animate-spin text-primary-blue" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-14">
                <Mail className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  {search ? 'No subscribers match your search.' : 'No subscribers yet.'}
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {filtered.map(s => (
                  <li key={s.id} className="flex items-center justify-between px-5 py-3 hover:bg-muted/50 group transition-colors">
                    <div>
                      <p className="text-sm font-medium text-foreground">{s.email}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Joined {new Date(s.subscribedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(s.email)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                      title="Remove subscriber"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
