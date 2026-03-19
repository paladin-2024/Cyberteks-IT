import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Users, FileText, MessageSquare,
  Bell, Award, Settings, ChevronLeft, ChevronRight, LogOut,
  GraduationCap, Briefcase, Map, BarChart3, Calendar,
  ClipboardList, UserCheck, PieChart, X, HelpCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

type NavItem  = { key: string; href: string; icon: React.ElementType; badge?: number };
type NavGroup = { label: string; items: NavItem[] };

const adminNavGroups: NavGroup[] = [
  {
    label: 'GENERAL',
    items: [
      { key: 'dashboard',    href: '/admin/dashboard',    icon: LayoutDashboard },
      { key: 'applications', href: '/admin/applications', icon: Briefcase },
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
    label: 'SYSTEM',
    items: [
      { key: 'notifications', href: '/admin/notifications', icon: Bell },
      { key: 'settings',      href: '/admin/settings',      icon: Settings },
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
      { key: 'myCourses',   href: '/teacher/courses',     icon: BookOpen },
      { key: 'students',    href: '/teacher/students',    icon: UserCheck },
      { key: 'assignments', href: '/teacher/assignments', icon: ClipboardList },
    ],
  },
  {
    label: 'COMMUNICATION',
    items: [
      { key: 'messages', href: '/teacher/messages', icon: MessageSquare, badge: 3 },
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
      { key: 'notifications', href: '/student/notifications', icon: Bell, badge: 4 },
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
  schedule:      'Schedule',
  progress:      'Progress',
  students:      'Students',
  assignments:   'Assignments',
  notifications: 'Notifications',
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
          'hidden lg:flex flex-col h-full bg-white border-r border-gray-100 transition-all duration-300 ease-in-out shrink-0 overflow-hidden',
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
          onCollapseToggle={() => setCollapsed((v) => !v)}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile sidebar (overlay drawer) */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex flex-col h-full w-[260px] bg-white border-r border-gray-100',
          'shadow-2xl shadow-slate-900/20 transition-transform duration-300 ease-in-out lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <button
          onClick={onClose}
          aria-label="Close sidebar"
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
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
  onCollapseToggle,
  onLinkClick,
  onLogout,
}: ContentProps) {
  const initials = getInitials(user?.name);

  return (
    <div className="flex flex-col h-full">
      {/* Logo header */}
      <div
        className={cn(
          'flex items-center h-[64px] border-b border-gray-100 shrink-0 px-4',
          collapsed ? 'justify-center px-0' : 'gap-3'
        )}
      >
        <div className="w-9 h-9 shrink-0">
          <img
            src="/assets/logo-round.png"
            alt="CyberteksIT"
            className="w-9 h-9 object-contain"
          />
        </div>
        {!collapsed && (
          <span className="font-display font-bold text-[#023064] text-[15px] tracking-tight">
            Cyberteks<span className="text-primary-red">IT</span>
          </span>
        )}
      </div>

      {/* User profile */}
      {!collapsed && (
        <div className="px-4 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#023064] flex items-center justify-center shrink-0 shadow-sm">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.name ?? ''}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <span className="text-white text-sm font-bold">{initials}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 truncate leading-tight">
                {user?.name ?? 'User'}
              </p>
              <span
                className={cn(
                  'inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-0.5',
                  rc.bgColor,
                  rc.textColor
                )}
              >
                {rc.label}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed: avatar only */}
      {collapsed && (
        <div className="flex justify-center py-3 border-b border-gray-100 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-[#023064] flex items-center justify-center shadow-sm">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name ?? ''}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <span className="text-white text-xs font-bold">{initials}</span>
            )}
          </div>
        </div>
      )}

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
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800',
                      collapsed && 'justify-center px-0 py-2.5'
                    )}
                  >
                    <item.icon
                      className={cn(
                        'shrink-0 transition-colors',
                        collapsed ? 'w-5 h-5' : 'w-4 h-4',
                        active ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
                      )}
                    />
                    {!collapsed && (
                      <>
                        <span className="truncate flex-1">{getLabel(item.key)}</span>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span
                            className={cn(
                              'text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center tabular-nums',
                              active
                                ? 'bg-white/20 text-white'
                                : 'bg-primary-red text-white'
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                    {collapsed && item.badge !== undefined && item.badge > 0 && (
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
      <div className="border-t border-gray-100 p-3 space-y-1 shrink-0">
        {/* Help Center */}
        <Link
          to="/help"
          onClick={onLinkClick}
          title={collapsed ? 'Help Center' : undefined}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all group',
            collapsed && 'justify-center px-0'
          )}
        >
          <HelpCircle
            className={cn(
              'shrink-0 text-gray-400 group-hover:text-gray-600 transition-colors',
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
            className="flex items-center justify-center w-full py-1.5 rounded-xl text-gray-300 hover:bg-gray-50 hover:text-gray-500 transition-all"
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
