import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, Search, Menu, CalendarDays } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
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
  const [unreadCount, setUnreadCount] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const initials = getInitials(user?.name);
  const roleKey = user?.role?.toLowerCase() ?? 'student';
  const currentMonthYear = formatMonthYear(new Date());

  const roleLabels: Record<string, string> = {
    admin:   'Administrator',
    teacher: 'Instructor',
    student: 'Student',
  };
  const roleColors: Record<string, string> = {
    admin:   'bg-rose-50 text-rose-600',
    teacher: 'bg-blue-50 text-[#023064]',
    student: 'bg-emerald-50 text-emerald-600',
  };
  const roleLabel = roleLabels[roleKey] ?? 'Student';
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

  const hasUnread = unreadCount === null || unreadCount > 0;

  return (
    <header className="h-16 border-b border-gray-100 bg-white flex items-center justify-between px-4 md:px-6 shrink-0 gap-3">
      {/* LEFT: hamburger (mobile) + search */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuToggle}
          aria-label="Toggle sidebar"
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-500 hover:text-gray-700 transition-all shrink-0"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`${t.lms.common.search.replace('...', '')}  /`}
            className="pl-9 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#023064]/20 focus:border-[#023064]/40 w-64 md:w-80 transition-all"
          />
        </div>
      </div>

      {/* RIGHT: date pill + notifications + user */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Date pill */}
        <button
          type="button"
          className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all"
        >
          <CalendarDays className="w-4 h-4 text-[#023064]" />
          <span>{currentMonthYear}</span>
        </button>

        {/* Notification bell */}
        <Link
          to={notifHref}
          aria-label="Notifications"
          className="relative w-9 h-9 rounded-xl flex items-center justify-center bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-500 hover:text-gray-700 transition-all"
        >
          <Bell className="w-4 h-4" />
          {hasUnread && (
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
        <div className="w-px h-6 bg-gray-200" />

        {/* User profile */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#023064] flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name ?? ''}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white text-xs font-bold">{initials}</span>
            )}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800 leading-tight">
              {user?.name ?? 'User'}
            </p>
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full mt-0.5 inline-block ${roleColor}`}
            >
              {roleLabel}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
