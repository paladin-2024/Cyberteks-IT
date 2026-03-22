import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell, CheckCheck, ExternalLink, Send,
  Info, AlertTriangle, CheckCircle2, XCircle,
  Loader2, Users, GraduationCap, BookOpen, User,
} from 'lucide-react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useUnread } from '@/context/UnreadContext';

interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  isRead: boolean;
  link: string | null;
  createdAt: string;
}

interface UserOption {
  id: string;
  name: string;
  email: string;
  role: string;
}

const typeConfig: Record<string, { icon: React.ElementType; bg: string; border: string; iconColor: string; label: string }> = {
  INFO:    { icon: Info,          bg: 'bg-blue-50',    border: 'border-blue-100',    iconColor: 'text-blue-500',    label: 'Info' },
  SUCCESS: { icon: CheckCircle2,  bg: 'bg-emerald-50', border: 'border-emerald-100', iconColor: 'text-emerald-500', label: 'Success' },
  WARNING: { icon: AlertTriangle, bg: 'bg-amber-50',   border: 'border-amber-100',   iconColor: 'text-amber-500',   label: 'Warning' },
  ERROR:   { icon: XCircle,       bg: 'bg-red-50',     border: 'border-red-100',     iconColor: 'text-red-500',     label: 'Error' },
};

const TARGET_OPTIONS = [
  { value: 'ALL',      label: 'All Users',    icon: Users },
  { value: 'STUDENTS', label: 'All Students', icon: GraduationCap },
  { value: 'TEACHERS', label: 'All Teachers', icon: BookOpen },
];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);
  const { refreshUnread } = useUnread();

  // Compose form state
  const [users, setUsers] = useState<UserOption[]>([]);
  const [target, setTarget] = useState('ALL');
  const [notifType, setNotifType] = useState<'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'>('INFO');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ ok: boolean; msg: string } | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    api.get<{ notifications?: Notification[] }>('/notifications')
      .then((data) => setNotifications(data.notifications ?? []))
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  // Load users for "specific user" target
  useEffect(() => {
    api.get<{ users: UserOption[] }>('/users')
      .then(d => setUsers(d.users ?? []))
      .catch(() => {});
  }, []);

  const markRead = async (id: string) => {
    await api.patch('/notifications', { ids: [id] });
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    refreshUnread();
  };

  const markAllRead = async () => {
    setMarkingAll(true);
    await api.patch('/notifications', { all: true });
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setMarkingAll(false);
    refreshUnread();
  };

  const handleSend = async () => {
    if (!title.trim() || !body.trim()) {
      setSendResult({ ok: false, msg: 'Title and message are required.' });
      return;
    }
    setSending(true);
    setSendResult(null);
    try {
      const res = await api.post<{ sent: number }>('/notifications/broadcast', { title, body, type: notifType, target });
      setSendResult({ ok: true, msg: `Sent to ${res.sent} user${res.sent !== 1 ? 's' : ''} successfully.` });
      setTitle('');
      setBody('');
    } catch {
      setSendResult({ ok: false, msg: 'Failed to send. Please try again.' });
    } finally {
      setSending(false);
    }
  };

  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6 max-w-3xl pb-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-xl font-bold text-foreground">Notifications</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Send notifications to users and view your inbox.</p>
      </div>

      {/* ── Compose Card ── */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-primary-blue/5">
          <div className="w-9 h-9 rounded-xl bg-primary-blue flex items-center justify-center shrink-0">
            <Send className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-heading font-semibold text-foreground text-sm">Send Notification</p>
            <p className="text-xs text-muted-foreground">Compose and broadcast a message to users</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Target + Type row */}
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Target audience */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Send To</label>
              <div className="flex flex-wrap gap-2">
                {TARGET_OPTIONS.map(opt => {
                  const Icon = opt.icon;
                  const active = target === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setTarget(opt.value)}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all',
                        active
                          ? 'bg-primary-blue text-white border-primary-blue'
                          : 'bg-card border-border text-muted-foreground hover:border-primary-blue/40',
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" /> {opt.label}
                    </button>
                  );
                })}
                {/* Specific user option */}
                <button
                  type="button"
                  onClick={() => setTarget('specific')}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all',
                    !['ALL','STUDENTS','TEACHERS'].includes(target)
                      ? 'bg-primary-blue text-white border-primary-blue'
                      : 'bg-card border-border text-muted-foreground hover:border-primary-blue/40',
                  )}
                >
                  <User className="w-3.5 h-3.5" /> Specific User
                </button>
              </div>
              {/* User select */}
              {!['ALL','STUDENTS','TEACHERS'].includes(target) && (
                <select
                  value={target === 'specific' ? '' : target}
                  onChange={e => setTarget(e.target.value)}
                  className="mt-2 w-full px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground outline-none focus:border-primary-blue"
                >
                  <option value="">Select a user…</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role.toLowerCase()}) — {u.email}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Type</label>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(typeConfig) as Array<keyof typeof typeConfig>).map(t => {
                  const cfg = typeConfig[t];
                  const Icon = cfg.icon;
                  const active = notifType === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNotifType(t as typeof notifType)}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all',
                        active
                          ? `${cfg.bg} ${cfg.border} ${cfg.iconColor}`
                          : 'bg-card border-border text-muted-foreground hover:border-border',
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" /> {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. New course available, System maintenance…"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/10"
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Message</label>
            <textarea
              rows={3}
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Write your notification message here…"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/10"
            />
          </div>

          {/* Result message */}
          {sendResult && (
            <div className={cn(
              'flex items-center gap-2 text-sm px-4 py-3 rounded-xl border',
              sendResult.ok
                ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                : 'bg-red-50 border-red-100 text-primary-red',
            )}>
              {sendResult.ok ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
              {sendResult.msg}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSend}
              disabled={sending || !title.trim() || !body.trim()}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary-blue text-white text-sm font-bold rounded-xl hover:bg-blue-900 transition-all shadow-sm disabled:opacity-50 disabled:pointer-events-none"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {sending ? 'Sending…' : 'Send Notification'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Inbox ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-semibold text-foreground">Your Inbox</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {unread > 0 ? `${unread} unread` : 'All caught up'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-xl text-sm">
            <Bell className="w-4 h-4 text-primary-blue" />
            <span className="font-semibold text-foreground">{notifications.length}</span>
            <span className="text-muted-foreground">total</span>
          </div>
          {unread > 0 && (
            <button
              onClick={markAllRead}
              disabled={markingAll}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-blue text-white text-sm font-bold rounded-xl hover:bg-blue-800 transition-all shadow-sm disabled:opacity-60"
            >
              {markingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCheck className="w-4 h-4" />}
              Mark all read
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground gap-3">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading…</span>
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 flex flex-col items-center gap-3 text-center">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
            <Bell className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="font-semibold text-muted-foreground">No notifications yet</p>
          <p className="text-sm text-muted-foreground">System and activity alerts will appear here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => {
            const cfg = typeConfig[n.type] ?? typeConfig.INFO;
            const Icon = cfg.icon;
            return (
              <div
                key={n.id}
                className={cn(
                  'bg-card border rounded-2xl p-4 transition-all',
                  n.isRead ? 'border-border opacity-70' : 'border-border shadow-sm ring-1 ring-primary-blue/10',
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border', cfg.bg, cfg.border)}>
                    <Icon className={cn('w-5 h-5', cfg.iconColor)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn('font-semibold text-sm', n.isRead ? 'text-muted-foreground' : 'text-foreground')}>
                        {n.title}
                        {!n.isRead && <span className="ml-2 inline-block w-2 h-2 rounded-full bg-primary-red align-middle" />}
                      </p>
                      <span className="text-[11px] text-muted-foreground shrink-0">{timeAgo(n.createdAt)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5 leading-snug">{n.body}</p>
                    <div className="flex items-center gap-3 mt-3">
                      {n.link && (
                        <Link to={n.link} className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-blue hover:underline">
                          View Details <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                      {!n.isRead && (
                        <button
                          onClick={() => markRead(n.id)}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
