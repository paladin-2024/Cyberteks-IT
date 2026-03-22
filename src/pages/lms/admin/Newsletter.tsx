import { useState, useEffect } from 'react';
import {
  Mail, Send, Users, Trash2, CheckCircle2, AlertCircle,
  Loader2, RefreshCw, Search,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

export default function AdminNewsletter() {
  const { token } = useAuth();
  const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';

  // ── Subscribers ───────────────────────────────────────────────────────────
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [search, setSearch] = useState('');

  const fetchSubscribers = async () => {
    setLoadingList(true);
    try {
      const res = await fetch(`${API}/newsletter/subscribers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSubscribers(data.subscribers ?? []);
    } catch {
      /* silent */
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => { fetchSubscribers(); }, []);

  const handleDelete = async (email: string) => {
    if (!confirm(`Remove ${email} from subscribers?`)) return;
    try {
      await fetch(`${API}/newsletter/subscribers/${encodeURIComponent(email)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
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
  const [error, setError]   = useState('');

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    setError('');
    setSending(true);
    try {
      const res = await fetch(`${API}/newsletter/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ subject, message }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Failed to send.'); return; }
      setResult({ sent: data.sent, failed: data.failed });
      setSubject('');
      setMessage('');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const filtered = subscribers.filter(s => s.email.includes(search.toLowerCase()));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Newsletter</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Broadcast emails to all subscribers and manage your list.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* ── Compose Broadcast ── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#102a83]/10 flex items-center justify-center">
              <Send className="w-5 h-5 text-[#102a83]" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">Send Broadcast</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {subscribers.length} subscriber{subscribers.length !== 1 ? 's' : ''} will receive this
              </p>
            </div>
          </div>

          {result && (
            <div className="flex items-start gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-5">
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-green-800 dark:text-green-300">Broadcast sent!</p>
                <p className="text-xs text-green-700 dark:text-green-400 mt-0.5">
                  {result.sent} delivered{result.failed > 0 ? `, ${result.failed} failed` : ''}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-5">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleBroadcast} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="e.g. New Course Available — Web Design!"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#102a83]/30 focus:border-[#102a83]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Message
              </label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={8}
                placeholder="Write your newsletter message here..."
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#102a83]/30 focus:border-[#102a83] resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={sending || subscribers.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-[#102a83] hover:bg-[#0d2270] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              {sending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Sending to {subscribers.length} subscribers...</>
              ) : (
                <><Send className="w-4 h-4" /> Send to {subscribers.length} Subscribers</>
              )}
            </button>
          </form>
        </div>

        {/* ── Subscribers List ── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#102a83]" />
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Subscribers
                <span className="ml-2 text-xs font-normal bg-[#102a83]/10 text-[#102a83] px-2 py-0.5 rounded-full">
                  {subscribers.length}
                </span>
              </h2>
            </div>
            <button
              onClick={fetchSubscribers}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search subscribers..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#102a83]/30"
              />
            </div>
          </div>

          <div className="overflow-y-auto max-h-[420px]">
            {loadingList ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-[#102a83]" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">
                  {search ? 'No subscribers match your search.' : 'No subscribers yet.'}
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                {filtered.map(s => (
                  <li key={s.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 group">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{s.email}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(s.subscribedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(s.email)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
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
