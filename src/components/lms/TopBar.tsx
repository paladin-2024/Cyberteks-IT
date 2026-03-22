import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, Search, Menu } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

interface TopBarProps {
  onMenuToggle?: () => void;
}

function getInitials(name: string | null | undefined): string {
  if (!name) return '?';
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
}

function greet(name: string | null | undefined): string {
  const hour = new Date().getHours();
  const first = name?.split(' ')[0] ?? 'there';
  if (hour < 12) return `Good morning, ${first}`;
  if (hour < 17) return `Good afternoon, ${first}`;
  return `Good evening, ${first}`;
}

export default function TopBar({ onMenuToggle }: TopBarProps) {
  const { t } = useLanguage();
  const { pathname } = useLocation();
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const initials  = getInitials(user?.name);
  const roleKey   = user?.role?.toLowerCase() ?? 'student';

  const notifHref =
    roleKey === 'admin'   ? '/admin/notifications'   :
    roleKey === 'teacher' ? '/teacher/notifications' :
    '/student/notifications';

  const profileHref = `/${roleKey}/profile`;

  useEffect(() => {
    api.get<{ unreadCount: number }>('/notifications?limit=50')
      .then((data) => { if (typeof data.unreadCount === 'number') setUnreadCount(data.unreadCount); })
      .catch(() => null);
  }, [pathname]);

  const hasUnread = unreadCount === null || unreadCount > 0;

  return (
    <header className="h-16 bg-white border-b border-gray-100/80 flex items-center justify-between px-4 md:px-6 shrink-0 gap-4 shadow-sm shadow-gray-100/60">

      {/* LEFT: hamburger + greeting / search */}
      <div className="flex items-center gap-3 flex-1 min-w-0">

        {/* Mobile hamburger */}
        <button
          onClick={onMenuToggle}
          aria-label="Toggle sidebar"
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200/80 text-gray-500 hover:text-gray-700 transition-all shrink-0"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Greeting (desktop) */}
        <div className="hidden md:block">
          <p className="text-sm font-semibold text-gray-800 leading-none">{greet(user?.name)}</p>
          <p className="text-xs text-gray-400 mt-0.5 leading-none">Welcome back to your dashboard</p>
        </div>

        {/* Search (desktop) */}
        <div className="relative hidden lg:block ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.lms.common.search.replace('...', '') + '…'}
            className="pl-9 pr-4 py-2 rounded-full bg-gray-50 border border-gray-200/80 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#023064]/15 focus:border-[#023064]/30 w-56 transition-all"
          />
        </div>
      </div>

      {/* RIGHT: notifications + divider + avatar */}
      <div className="flex items-center gap-2 shrink-0">

        {/* Notification bell */}
        <Link
          to={notifHref}
          aria-label="Notifications"
          className="relative w-9 h-9 rounded-xl flex items-center justify-center bg-gray-50 hover:bg-gray-100 border border-gray-200/80 text-gray-500 hover:text-[#023064] transition-all"
        >
          <Bell className="w-4 h-4" />
          {hasUnread && (
            <span className="absolute top-1.5 right-1.5 flex items-center justify-center min-w-[14px] h-[14px] rounded-full bg-[#E11D48] ring-2 ring-white">
              {unreadCount !== null && unreadCount > 0 && (
                <span className="text-white text-[9px] font-bold px-0.5 leading-none">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </span>
          )}
        </Link>

        {/* Divider */}
        <div className="w-px h-5 bg-gray-200" />

        {/* Avatar */}
        <Link
          to={profileHref}
          aria-label="My Profile"
          className="relative w-9 h-9 rounded-xl overflow-hidden shrink-0 ring-2 ring-transparent hover:ring-[#023064]/30 transition-all"
          style={{ background: 'linear-gradient(135deg, #023064, #E11D48)' }}
        >
          {user?.image ? (
            <img src={user.image} alt={user.name ?? ''} className="w-full h-full object-cover" />
          ) : (
            <span className="w-full h-full flex items-center justify-center text-white text-xs font-bold">{initials}</span>
          )}
        </Link>

        {/* Name (desktop) */}
        <Link to={profileHref} className="hidden lg:block text-left hover:opacity-75 transition-opacity">
          <p className="text-xs font-semibold text-gray-700 leading-none">{user?.name?.split(' ')[0] ?? 'User'}</p>
          <p className="text-[10px] text-gray-400 mt-0.5 leading-none capitalize">{roleKey}</p>
        </Link>
      </div>
    </header>
  );
}
