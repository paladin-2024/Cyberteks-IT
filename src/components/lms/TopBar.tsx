import { Bell, Search, ChevronRight, Home, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface TopBarProps {
  onMenuToggle?: () => void;
}

function useBreadcrumb(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  const crumbs: { label: string; href: string }[] = [];
  let path = '';
  for (const seg of segments) {
    path += '/' + seg;
    const label = seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' ');
    crumbs.push({ label, href: path });
  }
  return crumbs;
}

export default function TopBar({ onMenuToggle }: TopBarProps) {
  const { t } = useLanguage();
  const { pathname } = useLocation();
  const { user } = useAuth();
  const crumbs = useBreadcrumb(pathname);
  const [unreadCount, setUnreadCount] = useState<number | null>(null);

  const initials = user?.name
    ?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() ?? '?';

  const roleKey = user?.role?.toLowerCase() ?? 'student';

  const roleColors: Record<string, string> = {
    admin:   'bg-rose-100 text-rose-700',
    teacher: 'bg-blue-100 text-blue-700',
    student: 'bg-emerald-100 text-emerald-700',
  };
  const roleColor = roleColors[roleKey] ?? roleColors.student;

  const notifHref =
    roleKey === 'admin'   ? '/admin/notifications' :
    roleKey === 'teacher' ? '/teacher/messages'    :
    '/student/notifications';

  useEffect(() => {
    api.get<{ unreadCount: number }>('/notifications?limit=50')
      .then((data) => {
        if (typeof data.unreadCount === 'number') {
          setUnreadCount(data.unreadCount);
        }
      })
      .catch(() => null);
  }, [pathname]);

  return (
    <header className="h-[60px] border-b border-slate-100 bg-white flex items-center justify-between px-4 md:px-6 shrink-0 gap-3">
      {/* Left: hamburger (mobile) + breadcrumb */}
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={onMenuToggle}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 transition-all shrink-0"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm min-w-0">
          <Link to="/" className="text-slate-400 hover:text-slate-600 transition-colors shrink-0">
            <Home className="w-3.5 h-3.5" />
          </Link>
          {crumbs.map((c, i) => (
            <span key={c.href} className="flex items-center gap-1.5 min-w-0">
              <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
              {i === crumbs.length - 1 ? (
                <span className="font-semibold text-slate-800 truncate">{c.label}</span>
              ) : (
                <Link to={c.href} className="text-slate-400 hover:text-slate-600 transition-colors truncate hidden sm:inline">
                  {c.label}
                </Link>
              )}
            </span>
          ))}
        </nav>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            placeholder={t.lms.common.search}
            className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue w-44 transition-all"
          />
        </div>

        {/* Notifications */}
        <Link
          to={notifHref}
          className="relative w-9 h-9 rounded-xl flex items-center justify-center bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all text-slate-500 hover:text-slate-700"
        >
          <Bell className="w-4 h-4" />
          {(unreadCount === null || unreadCount > 0) && (
            <span className="absolute top-1.5 right-1.5 flex items-center justify-center min-w-[14px] h-[14px] rounded-full bg-primary-red ring-2 ring-white">
              {unreadCount !== null && unreadCount > 0 && (
                <span className="text-white text-[9px] font-bold px-0.5 leading-none">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </span>
          )}
        </Link>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-200" />

        {/* User */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl overflow-hidden bg-primary-blue flex items-center justify-center shrink-0">
            {user?.image ? (
              <img src={user.image} alt={user.name ?? ''} className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-xs font-bold">{initials}</span>
            )}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-800 leading-none">{user?.name}</p>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full mt-0.5 inline-block ${roleColor}`}>
              {user?.role?.charAt(0).toUpperCase()}{user?.role?.slice(1).toLowerCase()}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
