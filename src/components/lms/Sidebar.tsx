import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Users, FileText, MessageSquare,
  Bell, Award, Settings, ChevronLeft, ChevronRight, LogOut,
  GraduationCap, Briefcase, Map, BarChart3, Calendar,
  ClipboardList, UserCheck, PieChart, X, HelpCircle, UserCircle, ListOrdered, Headphones,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useUnread } from '@/context/UnreadContext';

type NavItem  = { key: string; href: string; icon: React.ElementType; badge?: number };
type NavGroup = { label: string; items: NavItem[] };

const adminNavGroups: NavGroup[] = [
  {
    label: 'GENERAL',
    items: [
      { key: 'dashboard',    href: '/admin/dashboard',    icon: LayoutDashboard },
      { key: 'applications', href: '/admin/applications', icon: Briefcase },
      { key: 'itSupport',    href: '/admin/it-support',   icon: Headphones },
      { key: 'analytics',    href: '/admin/analytics',    icon: BarChart3 },
    ],
  },
  {
    label: 'MANAGEMENT',
    items: [
      { key: 'users',    href: '/admin/users',    icon: Users },
      { key: 'courses',  href: '/admin/courses',  icon: BookOpen },
      { key: 'invoices', href: '/admin/invoices', icon: FileText },
    ],
  },
  {
    label: 'COMMUNICATION',
    items: [
      { key: 'messages',      href: '/admin/messages',      icon: MessageSquare },
      { key: 'notifications', href: '/admin/notifications', icon: Bell },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { key: 'settings', href: '/admin/settings', icon: Settings },
    ],
  },
];

const teacherNavGroups: NavGroup[] = [
  {
    label: 'GENERAL',
    items: [
      { key: 'dashboard', href: '/teacher/dashboard', icon: LayoutDashboard },
      { key: 'analytics', href: '/teacher/analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'TEACHING',
    items: [
      { key: 'myCourses',   href: '/teacher/courses',    icon: BookOpen },
      { key: 'curriculum',  href: '/teacher/curriculum', icon: ListOrdered },
      { key: 'students',    href: '/teacher/students',   icon: UserCheck },
      { key: 'assignments', href: '/teacher/assignments', icon: ClipboardList },
    ],
  },
  {
    label: 'COMMUNICATION',
    items: [
      { key: 'messages',      href: '/teacher/messages',      icon: MessageSquare },
      { key: 'notifications', href: '/teacher/notifications', icon: Bell },
    ],
  },
];

const studentNavGroups: NavGroup[] = [
  {
    label: 'GENERAL',
    items: [
      { key: 'dashboard', href: '/student/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'LEARNING',
    items: [
      { key: 'myCourses',    href: '/student/courses',      icon: GraduationCap },
      { key: 'assignments',  href: '/student/assignments',  icon: ClipboardList },
      { key: 'plan',         href: '/student/plan',         icon: Map },
      { key: 'schedule',     href: '/student/schedule',     icon: Calendar },
      { key: 'progress',     href: '/student/progress',     icon: PieChart },
      { key: 'certificates', href: '/student/certificates', icon: Award },
    ],
  },
  {
    label: 'COMMUNICATION',
    items: [
      { key: 'messages',      href: '/student/messages',      icon: MessageSquare },
      { key: 'notifications', href: '/student/notifications', icon: Bell },
    ],
  },
];

const navByRole: Record<string, NavGroup[]> = {
  admin:   adminNavGroups,
  teacher: teacherNavGroups,
  student: studentNavGroups,
};

const roleConfig: Record<string, { label: string; accent: string; dot: string }> = {
  admin:   { label: 'Administrator', accent: 'text-rose-400',    dot: 'bg-rose-400' },
  teacher: { label: 'Instructor',    accent: 'text-sky-400',     dot: 'bg-sky-400' },
  student: { label: 'Student',       accent: 'text-emerald-400', dot: 'bg-emerald-400' },
};

const extraLabels: Record<string, string> = {
  analytics:     'Analytics',
  schedule:      'Schedule',
  progress:      'Progress',
  students:      'Students',
  assignments:   'Assignments',
  notifications: 'Notifications',
  itSupport:     'IT Support',
};

function getInitials(name: string | null | undefined): string {
  if (!name) return '?';
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
}

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ mobileOpen = false, onClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const role = user?.role?.toLowerCase() ?? 'student';
  const groups = navByRole[role] ?? studentNavGroups;
  const rc = roleConfig[role] ?? roleConfig.student;
  const sb = t.lms.sidebar;

  const getLabel = (key: string) =>
    (sb as Record<string, string>)[key] ?? extraLabels[key] ?? key;

  const handleLogout = () => { logout(); navigate('/'); };
  const profileHref = `/${role}/profile`;

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden" onClick={onClose} aria-hidden="true" />
      )}

      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col h-full transition-all duration-300 ease-in-out shrink-0 overflow-hidden',
          'bg-[#060e1f] border-r border-white/[0.06]',
          collapsed ? 'w-[64px]' : 'w-[240px]'
        )}
      >
        <SidebarContent
          user={user} rc={rc} groups={groups} collapsed={collapsed}
          pathname={pathname} getLabel={getLabel} signOutLabel={t.lms.common.signOut}
          profileHref={profileHref} onCollapseToggle={() => setCollapsed((v) => !v)}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex flex-col h-full w-[260px]',
          'bg-[#060e1f] border-r border-white/[0.06] shadow-2xl shadow-black/50',
          'transition-transform duration-300 ease-in-out lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 text-white/60 hover:bg-white/15 hover:text-white transition-all"
        >
          <X className="w-3.5 h-3.5" />
        </button>
        <SidebarContent
          user={user} rc={rc} groups={groups} collapsed={false}
          pathname={pathname} getLabel={getLabel} signOutLabel={t.lms.common.signOut}
          profileHref={profileHref} onCollapseToggle={undefined}
          onLinkClick={onClose} onLogout={handleLogout}
        />
      </aside>
    </>
  );
}

interface ContentProps {
  user: { name: string | null; email: string; role: string; image: string | null } | null;
  rc: { label: string; accent: string; dot: string };
  groups: NavGroup[];
  collapsed: boolean;
  pathname: string;
  getLabel: (key: string) => string;
  signOutLabel: string;
  profileHref: string;
  onCollapseToggle?: () => void;
  onLinkClick?: () => void;
  onLogout: () => void;
}

function SidebarContent({
  user, rc, groups, collapsed, pathname, getLabel,
  signOutLabel, profileHref, onCollapseToggle, onLinkClick, onLogout,
}: ContentProps) {
  const initials = getInitials(user?.name);
  const { unreadMessages, unreadNotifications } = useUnread();

  return (
    <div className="flex flex-col h-full">

      {/* ── Logo header ── */}
      <div className={cn(
        'flex items-center h-[64px] shrink-0 border-b border-white/[0.06]',
        collapsed ? 'justify-center px-0' : 'px-4 gap-3'
      )}>
        {collapsed ? (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E11D48] to-[#023064] flex items-center justify-center shadow-lg">
            <span className="text-white font-black text-sm tracking-tight">C</span>
          </div>
        ) : (
          <img
            src="/assets/cyberteks-it-logo-33783fbc-fb2c-484a-b670-9f269d8493cf.png"
            alt="CyberteksIT"
            className="h-9 w-auto object-contain brightness-0 invert"
          />
        )}
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto py-4 px-2.5 space-y-4 scrollbar-hide">
        {groups.map((group) => (
          <div key={group.label}>
            {!collapsed ? (
              <p className="text-[9px] font-bold text-white/25 uppercase tracking-[0.15em] px-2.5 mb-1.5">
                {group.label}
              </p>
            ) : (
              <div className="h-px bg-white/[0.07] mx-2 mb-2" />
            )}

            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + '/');
                const badgeCount =
                  item.key === 'messages'      ? unreadMessages :
                  item.key === 'notifications' ? unreadNotifications :
                  item.badge ?? 0;

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={onLinkClick}
                    title={collapsed ? getLabel(item.key) : undefined}
                    className={cn(
                      'relative flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-150 group',
                      collapsed ? 'justify-center px-0 py-2.5 mx-1' : 'px-3 py-2.5',
                      active
                        ? 'bg-white/10 text-white'
                        : 'text-white/45 hover:bg-white/[0.06] hover:text-white/80'
                    )}
                  >
                    {/* Active left bar */}
                    {active && !collapsed && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-[#E11D48]" />
                    )}

                    <item.icon className={cn(
                      'shrink-0 transition-colors',
                      collapsed ? 'w-5 h-5' : 'w-4 h-4',
                      active ? 'text-white' : 'text-white/35 group-hover:text-white/70'
                    )} />

                    {!collapsed && (
                      <>
                        <span className="truncate flex-1 leading-none">{getLabel(item.key)}</span>
                        {badgeCount > 0 && (
                          <span className={cn(
                            'text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center tabular-nums',
                            active ? 'bg-white/15 text-white' : 'bg-[#E11D48] text-white'
                          )}>
                            {badgeCount > 99 ? '99+' : badgeCount}
                          </span>
                        )}
                      </>
                    )}

                    {collapsed && badgeCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#E11D48] ring-2 ring-[#060e1f]" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Bottom section ── */}
      <div className="border-t border-white/[0.06] shrink-0">

        {/* User profile card */}
        {!collapsed && (
          <Link
            to={profileHref}
            onClick={onLinkClick}
            className="flex items-center gap-3 px-3 py-3 mx-2 mt-2 rounded-xl hover:bg-white/[0.06] transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#023064] to-[#E11D48] flex items-center justify-center shrink-0 shadow-md">
              {user?.image ? (
                <img src={user.image} alt="" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <span className="text-white text-xs font-bold">{initials}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white/90 truncate leading-tight">{user?.name ?? 'User'}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={cn('w-1.5 h-1.5 rounded-full', rc.dot)} />
                <span className={cn('text-[10px] font-medium leading-none', rc.accent)}>{rc.label}</span>
              </div>
            </div>
          </Link>
        )}

        {collapsed && (
          <div className="flex justify-center py-2">
            <Link to={profileHref} onClick={onLinkClick} title="My Profile"
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#023064] to-[#E11D48] flex items-center justify-center shadow-md hover:opacity-90 transition-opacity">
              {user?.image
                ? <img src={user.image} alt="" className="w-full h-full object-cover rounded-xl" />
                : <span className="text-white text-xs font-bold">{initials}</span>}
            </Link>
          </div>
        )}

        <div className="px-2 pb-2 space-y-0.5">
          {/* Help */}
          <Link to="/help" onClick={onLinkClick} title={collapsed ? 'Help Center' : undefined}
            className={cn(
              'flex items-center gap-3 w-full rounded-xl text-sm font-medium text-white/35 hover:bg-white/[0.06] hover:text-white/70 transition-all group',
              collapsed ? 'justify-center px-0 py-2.5 mx-1' : 'px-3 py-2'
            )}>
            <HelpCircle className={cn('shrink-0', collapsed ? 'w-5 h-5' : 'w-4 h-4')} />
            {!collapsed && <span>Help Center</span>}
          </Link>

          {/* Sign out */}
          <button onClick={onLogout} title={collapsed ? signOutLabel : undefined}
            className={cn(
              'flex items-center gap-3 w-full rounded-xl text-sm font-medium text-white/35 hover:bg-red-500/10 hover:text-red-400 transition-all group',
              collapsed ? 'justify-center px-0 py-2.5 mx-1' : 'px-3 py-2'
            )}>
            <LogOut className={cn('shrink-0', collapsed ? 'w-5 h-5' : 'w-4 h-4')} />
            {!collapsed && <span>{signOutLabel}</span>}
          </button>

          {/* Collapse toggle */}
          {onCollapseToggle && (
            <button onClick={onCollapseToggle}
              className="flex items-center justify-center w-full py-1.5 rounded-xl text-white/20 hover:bg-white/[0.05] hover:text-white/40 transition-all">
              {collapsed
                ? <ChevronRight className="w-3.5 h-3.5" />
                : <ChevronLeft  className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
