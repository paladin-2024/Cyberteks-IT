import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, Search, Menu, CalendarDays, UserCircle, Sun, Moon } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { api } from '@/lib/api';

interface TopBarProps {
  onMenuToggle?: () => void;
}

function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function getInitials(name: string | null | undefined): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function TopBar({ onMenuToggle }: TopBarProps) {
  const { t } = useLanguage();
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { theme, toggle } = useTheme();
  const [unreadCount, setUnreadCount] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const initials = getInitials(user?.name);
  const roleKey = user?.role?.toLowerCase() ?? 'student';
  const currentMonthYear = formatMonthYear(new Date());

  const notifHref =
    roleKey === 'admin'   ? '/admin/notifications'   :
    roleKey === 'teacher' ? '/teacher/notifications' :
    '/student/notifications';

  const profileHref = `/${roleKey}/profile`;

  useEffect(() => {
    api.get<{ unreadCount: number }>('/notifications?limit=50')
      .then((data) => {
        if (typeof data.unreadCount === 'number') {
          setUnreadCount(data.unreadCount);
        }
      })
      .catch(() => null);
  }, [pathname]);

  const hasUnread = unreadCount === null || unreadCount > 0;

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-4 md:px-6 shrink-0 gap-3">
      {/* LEFT: hamburger (mobile) + search */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuToggle}
          aria-label="Toggle sidebar"
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-muted hover:bg-accent border border-border text-muted-foreground hover:text-foreground transition-all shrink-0"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`${t.lms.common.search.replace('...', '')}  /`}
            className="pl-9 pr-4 py-2 rounded-xl bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-[#023064]/20 focus:border-[#023064]/40 w-36 sm:w-64 md:w-80 transition-all"
          />
        </div>
      </div>

      {/* RIGHT: date pill + theme toggle + notifications + user */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Date pill */}
        <button
          type="button"
          className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-muted border border-border text-sm font-medium text-muted-foreground hover:bg-accent transition-all"
        >
          <CalendarDays className="w-4 h-4 text-[#023064] dark:text-blue-400" />
          <span>{currentMonthYear}</span>
        </button>

        {/* Dark / Light mode toggle */}
        <button
          onClick={toggle}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="w-9 h-9 rounded-xl flex items-center justify-center bg-muted hover:bg-accent border border-border text-muted-foreground hover:text-foreground transition-all"
        >
          {theme === 'dark'
            ? <Sun className="w-4 h-4 text-amber-400" />
            : <Moon className="w-4 h-4" />
          }
        </button>

        {/* Notification bell */}
        <Link
          to={notifHref}
          aria-label="Notifications"
          className="relative w-9 h-9 rounded-xl flex items-center justify-center bg-muted hover:bg-accent border border-border text-muted-foreground hover:text-foreground transition-all"
        >
          <Bell className="w-4 h-4" />
          {hasUnread && (
            <span className="absolute top-1.5 right-1.5 flex items-center justify-center min-w-[14px] h-[14px] rounded-full bg-primary-red ring-2 ring-background">
              {unreadCount !== null && unreadCount > 0 && (
                <span className="text-white text-[9px] font-bold px-0.5 leading-none">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </span>
          )}
        </Link>

        {/* Divider */}
        <div className="w-px h-6 bg-border" />

        {/* Avatar, click to go to profile */}
        <Link
          to={profileHref}
          aria-label="My Profile"
          title="My Profile"
          className="w-9 h-9 rounded-xl bg-[#023064] flex items-center justify-center shrink-0 shadow-sm overflow-hidden hover:ring-2 hover:ring-[#023064]/40 hover:ring-offset-1 transition-all"
        >
          {user?.image ? (
            <img
              src={user.image}
              alt={user.name ?? ''}
              className="w-full h-full object-cover"
            />
          ) : initials !== '?' ? (
            <span className="text-white text-xs font-bold">{initials}</span>
          ) : (
            <UserCircle className="w-5 h-5 text-white/80" />
          )}
        </Link>
      </div>
    </header>
  );
}
