import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Users, FileText, MessageSquare,
  Bell, Award, Settings, ChevronLeft, ChevronRight, LogOut,
  GraduationCap, Briefcase, Map, BarChart3, Calendar,
  ClipboardList, UserCheck, PieChart, X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

type NavItem  = { key: string; href: string; icon: React.ElementType; badge?: number };
type NavGroup = { label?: string; items: NavItem[] };

const adminNavGroups: NavGroup[] = [
  { items: [
    { key: 'dashboard',    href: '/admin/dashboard',    icon: LayoutDashboard },
  ]},
  { label: 'Management', items: [
    { key: 'users',        href: '/admin/users',        icon: Users },
    { key: 'courses',      href: '/admin/courses',      icon: BookOpen },
    { key: 'applications', href: '/admin/applications', icon: Briefcase },
    { key: 'invoices',     href: '/admin/invoices',     icon: FileText },
  ]},
  { label: 'Insights', items: [
    { key: 'analytics',    href: '/admin/analytics',    icon: BarChart3 },
  ]},
  { label: 'System', items: [
    { key: 'notifications', href: '/admin/notifications', icon: Bell },
    { key: 'settings',      href: '/admin/settings',      icon: Settings },
  ]},
];

const teacherNavGroups: NavGroup[] = [
  { items: [
    { key: 'dashboard', href: '/teacher/dashboard', icon: LayoutDashboard },
  ]},
  { label: 'Teaching', items: [
    { key: 'myCourses',   href: '/teacher/courses',     icon: BookOpen },
    { key: 'students',    href: '/teacher/students',    icon: UserCheck },
    { key: 'assignments', href: '/teacher/assignments', icon: ClipboardList },
  ]},
  { label: 'Communication', items: [
    { key: 'messages', href: '/teacher/messages', icon: MessageSquare, badge: 3 },
  ]},
];

const studentNavGroups: NavGroup[] = [
  { items: [
    { key: 'dashboard', href: '/student/dashboard', icon: LayoutDashboard },
  ]},
  { label: 'Learning', items: [
    { key: 'myCourses',    href: '/student/courses',      icon: GraduationCap },
    { key: 'plan',         href: '/student/plan',         icon: Map },
    { key: 'schedule',     href: '/student/schedule',     icon: Calendar },
    { key: 'progress',     href: '/student/progress',     icon: PieChart },
    { key: 'certificates', href: '/student/certificates', icon: Award },
  ]},
  { label: 'Communication', items: [
    { key: 'messages',      href: '/student/messages',      icon: MessageSquare },
    { key: 'notifications', href: '/student/notifications', icon: Bell, badge: 4 },
  ]},
];

const navByRole: Record<string, NavGroup[]> = {
  admin:   adminNavGroups,
  teacher: teacherNavGroups,
  student: studentNavGroups,
};

const roleConfig: Record<string, { label: string; color: string; bg: string }> = {
  admin:   { label: 'Administrator', color: 'text-rose-600',    bg: 'bg-rose-50 border border-rose-100' },
  teacher: { label: 'Instructor',    color: 'text-blue-600',    bg: 'bg-blue-50 border border-blue-100' },
  student: { label: 'Student',       color: 'text-emerald-600', bg: 'bg-emerald-50 border border-emerald-100' },
};

const extraLabels: Record<string, string> = {
  analytics:     'Analytics',
  schedule:      'Schedule',
  progress:      'Progress',
  students:      'Students',
  assignments:   'Assignments',
  notifications: 'Notifications',
};

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
      {/* Desktop sidebar */}
      <aside className={cn(
        'hidden lg:flex flex-col h-full bg-white border-r border-slate-100 transition-all duration-300 shrink-0',
        collapsed ? 'w-[60px]' : 'w-[220px]'
      )}>
        <SidebarContent
          groups={groups}
          rc={rc}
          collapsed={collapsed}
          pathname={pathname}
          getLabel={getLabel}
          signOutLabel={t.lms.common.signOut}
          onCollapseToggle={() => setCollapsed((v) => !v)}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile sidebar (overlay drawer) */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-40 flex flex-col h-full w-[260px] bg-white border-r border-slate-100',
        'shadow-2xl shadow-slate-900/20 transition-transform duration-300 ease-in-out lg:hidden',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
        <SidebarContent
          groups={groups}
          rc={rc}
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
  groups: NavGroup[];
  rc: { label: string; color: string; bg: string };
  collapsed: boolean;
  pathname: string;
  getLabel: (key: string) => string;
  signOutLabel: string;
  onCollapseToggle?: () => void;
  onLinkClick?: () => void;
  onLogout: () => void;
}

function SidebarContent({ groups, rc, collapsed, pathname, getLabel, signOutLabel, onCollapseToggle, onLinkClick, onLogout }: ContentProps) {
  return (
    <>
      {/* Logo */}
      <div className={cn(
        'flex items-center h-[60px] border-b border-slate-100 shrink-0',
        collapsed ? 'justify-center px-0' : 'gap-3 px-4'
      )}>
        <div className="w-9 h-9 shrink-0">
          <img src="/assets/logo-round.png" alt="CyberteksIT" className="w-9 h-9 object-contain" />
        </div>
        {!collapsed && (
          <span className="font-display font-bold text-slate-800 text-sm">
            Cyberteks<span className="text-primary-red">IT</span>
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {groups.map((group, gi) => (
          <div key={gi} className={gi > 0 ? 'mt-4' : ''}>
            {!collapsed && group.label && (
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] px-3 mb-1.5">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={onLinkClick}
                    title={collapsed ? getLabel(item.key) : undefined}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all relative',
                      active
                        ? 'bg-primary-blue text-white shadow-sm shadow-blue-900/10'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                      collapsed && 'justify-center px-0 py-2.5'
                    )}
                  >
                    <item.icon className={cn('shrink-0', collapsed ? 'w-5 h-5' : 'w-4 h-4')} />
                    {!collapsed && (
                      <>
                        <span className="truncate flex-1">{getLabel(item.key)}</span>
                        {item.badge && (
                          <span className={cn(
                            'text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center tabular-nums',
                            active ? 'bg-white/25 text-white' : 'bg-primary-red text-white'
                          )}>
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                    {collapsed && item.badge && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary-red ring-2 ring-white" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-slate-100 p-2 space-y-1">
        {!collapsed && (
          <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold', rc.bg, rc.color)}>
            <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0 animate-pulse" />
            <span className="truncate">{rc.label}</span>
          </div>
        )}
        <button
          onClick={onLogout}
          title={collapsed ? 'Sign out' : undefined}
          className={cn(
            'flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all',
            collapsed && 'justify-center px-0 py-2.5'
          )}
        >
          <LogOut className={cn('shrink-0', collapsed ? 'w-5 h-5' : 'w-4 h-4')} />
          {!collapsed && <span>{signOutLabel}</span>}
        </button>
        {onCollapseToggle && (
          <button
            onClick={onCollapseToggle}
            className="flex items-center justify-center w-full py-1.5 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all"
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </>
  );
}
