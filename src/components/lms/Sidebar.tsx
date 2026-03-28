import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Users, FileText, MessageSquare,
  Bell, Award, Settings, ChevronLeft, ChevronRight, LogOut,
  GraduationCap, Briefcase, Compass, BarChart3,
  ClipboardList, UserCheck, X, HelpCircle, UserCircle, ListOrdered, Headphones, Mail, Rocket,
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
      { key: 'studentMgmt', href: '/admin/students', icon: GraduationCap },
      { key: 'courses',  href: '/admin/courses',  icon: BookOpen },
      { key: 'invoices', href: '/admin/invoices', icon: FileText },
    ],
  },
  {
    label: 'COMMUNICATION',
    items: [
      { key: 'messages',      href: '/admin/messages',      icon: MessageSquare },
      { key: 'notifications', href: '/admin/notifications', icon: Bell },
      { key: 'newsletter',    href: '/admin/newsletter',    icon: Mail },
    ],
  },
  {
    label: 'PROGRAMMES',
    items: [
      { key: 'bootcamps', href: '/admin/bootcamps', icon: Rocket },
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
      { key: 'journey',      href: '/student/journey',      icon: Compass },
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

const roleConfig: Record<string, { label: string; textColor: string; bgColor: string }> = {
  admin:   { label: 'Administrator', textColor: 'text-rose-600',    bgColor: 'bg-rose-50' },
  teacher: { label: 'Instructor',    textColor: 'text-[#023064]',   bgColor: 'bg-blue-50' },
  student: { label: 'Student',       textColor: 'text-emerald-600', bgColor: 'bg-emerald-50' },
};

const extraLabels: Record<string, string> = {
  analytics:     'Analytics',
  journey:       'My Journey',
  students:      'Students',
  studentMgmt:   'Student Management',
  assignments:   'Assignments',
  notifications: 'Notifications',
  itSupport:     'IT Support',
  newsletter:    'Newsletter',
  bootcamps:     'Free Bootcamps',
};

function getInitials(name: string | null | undefined): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const profileHref = `/${role}/profile`;

  return (
    <>
      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col h-full bg-background border-r border-border transition-all duration-300 ease-in-out shrink-0 overflow-hidden',
          collapsed ? 'w-[60px]' : 'w-[240px]'
        )}
      >
        <SidebarContent
          user={user}
          rc={rc}
          groups={groups}
          collapsed={collapsed}
          pathname={pathname}
          getLabel={getLabel}
          signOutLabel={t.lms.common.signOut}
          profileHref={profileHref}
          onCollapseToggle={() => setCollapsed((v) => !v)}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile sidebar (overlay drawer) */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex flex-col h-full w-[260px] bg-background border-r border-border',
          'shadow-2xl shadow-slate-900/20 transition-transform duration-300 ease-in-out lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <button
          onClick={onClose}
          aria-label="Close sidebar"
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-xl bg-muted text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
        >
          <X className="w-4 h-4" />
        </button>
        <SidebarContent
          user={user}
          rc={rc}
          groups={groups}
          collapsed={false}
          pathname={pathname}
          getLabel={getLabel}
          signOutLabel={t.lms.common.signOut}
          profileHref={profileHref}
          onCollapseToggle={undefined}
          onLinkClick={onClose}
          onLogout={handleLogout}
        />
      </aside>
    </>
  );
}

interface ContentProps {
  user: { name: string | null; email: string; role: string; image: string | null } | null;
  rc: { label: string; textColor: string; bgColor: string };
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
  user,
  rc,
  groups,
  collapsed,
  pathname,
  getLabel,
  signOutLabel,
  profileHref,
  onCollapseToggle,
  onLinkClick,
  onLogout,
}: ContentProps) {
  const initials = getInitials(user?.name);
  const { unreadMessages, unreadNotifications } = useUnread();

  return (
    <div className="flex flex-col h-full">
      {/* Logo header */}
      <div
        className={cn(
          'flex items-center h-[64px] border-b border-border shrink-0 px-4',
          collapsed ? 'justify-center px-0' : 'gap-3'
        )}
      >
        {collapsed ? (
          <img
            src="/assets/logo-round.png"
            alt="Cyberteks-IT"
            className="w-10 h-10 object-contain"
          />
        ) : (
          <img
            src="/assets/cyberteks-it-logo.png"
            alt="Cyberteks-IT"
            className="h-10 w-auto object-contain"
          />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {groups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em] px-2 mb-2">
                {group.label}
              </p>
            )}
            {collapsed && (
              <div className="h-px bg-gray-100 mx-1 mb-2" />
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(item.href + '/');
                const badgeCount =
                  item.key === 'messages'
                    ? unreadMessages
                    : item.key === 'notifications'
                    ? unreadNotifications
                    : item.badge ?? 0;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={onLinkClick}
                    title={collapsed ? getLabel(item.key) : undefined}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 relative group',
                      active
                        ? 'bg-[#023064] text-white shadow-sm'
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                      collapsed && 'justify-center px-0 py-2.5'
                    )}
                  >
                    <item.icon
                      className={cn(
                        'shrink-0 transition-colors',
                        collapsed ? 'w-5 h-5' : 'w-4 h-4',
                        active ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'
                      )}
                    />
                    {!collapsed && (
                      <>
                        <span className="truncate flex-1">{getLabel(item.key)}</span>
                        {badgeCount > 0 && (
                          <span
                            className={cn(
                              'text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center tabular-nums',
                              active
                                ? 'bg-card/20 text-white'
                                : 'bg-primary-red text-white'
                            )}
                          >
                            {badgeCount}
                          </span>
                        )}
                      </>
                    )}
                    {collapsed && badgeCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary-red ring-2 ring-white" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="border-t border-border p-3 space-y-1 shrink-0">
        {/* My Profile */}
        <Link
          to={profileHref}
          onClick={onLinkClick}
          title={collapsed ? 'My Profile' : undefined}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all group',
            collapsed && 'justify-center px-0'
          )}
        >
          <UserCircle
            className={cn(
              'shrink-0 text-muted-foreground group-hover:text-foreground transition-colors',
              collapsed ? 'w-5 h-5' : 'w-4 h-4'
            )}
          />
          {!collapsed && <span>My Profile</span>}
        </Link>

        {/* Help Center */}
        <Link
          to="/help"
          onClick={onLinkClick}
          title={collapsed ? 'Help Center' : undefined}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all group',
            collapsed && 'justify-center px-0'
          )}
        >
          <HelpCircle
            className={cn(
              'shrink-0 text-muted-foreground group-hover:text-foreground transition-colors',
              collapsed ? 'w-5 h-5' : 'w-4 h-4'
            )}
          />
          {!collapsed && <span>Help Center</span>}
        </Link>

        {/* Sign Out */}
        <button
          onClick={onLogout}
          title={collapsed ? signOutLabel : undefined}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all group',
            collapsed && 'justify-center px-0'
          )}
        >
          <LogOut
            className={cn(
              'shrink-0 text-gray-400 group-hover:text-red-500 transition-colors',
              collapsed ? 'w-5 h-5' : 'w-4 h-4'
            )}
          />
          {!collapsed && <span>{signOutLabel}</span>}
        </button>

        {/* Collapse toggle (desktop only) */}
        {onCollapseToggle && (
          <button
            onClick={onCollapseToggle}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="flex items-center justify-center w-full py-1.5 rounded-xl text-muted-foreground hover:bg-muted/50 hover:text-muted-foreground transition-all"
          >
            {collapsed ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <ChevronLeft className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
