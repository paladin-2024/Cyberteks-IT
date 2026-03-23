import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell, CheckCheck, ExternalLink,
  Info, AlertTriangle, CheckCircle2, XCircle,
  Loader2,
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

const typeConfig: Record<string, { icon: React.ElementType; bg: string; border: string; iconColor: string }> = {
  INFO:    { icon: Info,          bg: 'bg-blue-50',    border: 'border-blue-100',    iconColor: 'text-blue-500' },
  SUCCESS: { icon: CheckCircle2,  bg: 'bg-emerald-50', border: 'border-emerald-100', iconColor: 'text-emerald-500' },
  WARNING: { icon: AlertTriangle, bg: 'bg-amber-50',   border: 'border-amber-100',   iconColor: 'text-amber-500' },
  ERROR:   { icon: XCircle,       bg: 'bg-red-50',     border: 'border-red-100',     iconColor: 'text-red-500' },
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function TeacherNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);
  const { refreshUnread } = useUnread();

  const load = useCallback(() => {
    setLoading(true);
    api.get<{ notifications?: Notification[] }>('/notifications')
      .then((data) => setNotifications(data.notifications ?? []))
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

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

  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6 max-w-3xl pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {unread > 0 ? `${unread} unread notification${unread !== 1 ? 's' : ''}` : 'All caught up'}
          </p>
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

      {/* Count chips */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-xl text-sm">
          <Bell className="w-4 h-4 text-primary-blue" />
          <span className="font-semibold text-foreground">{notifications.length}</span>
          <span className="text-muted-foreground">total</span>
        </div>
        {unread > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-red/10 border border-primary-red/20 rounded-xl text-sm">
            <span className="w-2 h-2 rounded-full bg-primary-red animate-pulse" />
            <span className="font-semibold text-primary-red">{unread}</span>
            <span className="text-primary-red/70">unread</span>
          </div>
        )}
      </div>

      {/* Body */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground gap-3">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading notifications…</span>
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 flex flex-col items-center gap-3 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-border flex items-center justify-center">
            <Bell className="w-6 h-6 text-slate-300" />
          </div>
          <p className="font-semibold text-muted-foreground">No notifications yet</p>
          <p className="text-sm text-muted-foreground">System alerts and admin messages will appear here.</p>
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
                  n.isRead
                    ? 'border-border opacity-70'
                    : 'border-border shadow-sm ring-1 ring-primary-blue/10'
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
                        {!n.isRead && (
                          <span className="ml-2 inline-block w-2 h-2 rounded-full bg-primary-red align-middle" />
                        )}
                      </p>
                      <span className="text-[11px] text-muted-foreground shrink-0">{timeAgo(n.createdAt)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5 leading-snug">{n.body}</p>
                    <div className="flex items-center gap-3 mt-3">
                      {n.link && (
                        <Link
                          to={n.link}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-blue hover:underline"
                        >
                          View Details <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                      {!n.isRead && (
                        <button
                          onClick={() => markRead(n.id)}
                          className="text-xs text-muted-foreground hover:text-muted-foreground transition-colors font-medium"
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

      <p className="text-xs text-muted-foreground text-center">
        Notifications from the admin and system will appear here.
      </p>
    </div>
  );
}
