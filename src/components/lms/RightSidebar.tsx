import { useState } from 'react';
import { Calendar, Bell, TrendingUp, Clock, BookOpen, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const upcomingEvents = [
  { title: 'Web Dev Live Session', time: 'Today, 2:00 PM', type: 'live', color: 'bg-primary-blue' },
  { title: 'Cybersecurity Quiz', time: 'Tomorrow, 10:00 AM', type: 'quiz', color: 'bg-amber-500' },
  { title: 'Data Analytics Assignment Due', time: 'Thu, 11:59 PM', type: 'assignment', color: 'bg-primary-red' },
  { title: 'Networking Workshop', time: 'Fri, 3:00 PM', type: 'live', color: 'bg-teal-500' },
];

const recentActivity = [
  { text: 'Completed Lesson 4 — HTML Basics', time: '2h ago' },
  { text: 'Submitted Assignment #3', time: '1d ago' },
  { text: 'Joined Live Session: CSS Grid', time: '2d ago' },
  { text: 'Downloaded Certificate — Intro to IT', time: '3d ago' },
];

export default function RightSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'hidden xl:flex flex-col h-full bg-card border-l border-border transition-all duration-300 shrink-0 overflow-hidden',
        collapsed ? 'w-12' : 'w-72'
      )}
    >
      {/* Toggle */}
      <div className="flex items-center justify-between p-3 border-b border-border h-16">
        {!collapsed && <span className="text-sm font-semibold text-foreground">Activity</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all',
            collapsed && 'mx-auto'
          )}
        >
          {collapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {!collapsed && (
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Quick Stats */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              This Week
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: BookOpen, label: 'Lessons', value: '6',    color: 'text-primary-blue' },
                { icon: Clock,    label: 'Hours',   value: '4.5',  color: 'text-teal-600' },
                { icon: Award,    label: 'Points',  value: '120',  color: 'text-amber-500' },
                { icon: TrendingUp, label: 'Progress', value: '68%', color: 'text-primary-red' },
              ].map((s) => (
                <div key={s.label} className="bg-muted rounded-xl p-3 text-center">
                  <s.icon className={cn('w-4 h-4 mx-auto mb-1', s.color)} />
                  <p className="font-bold text-foreground text-sm">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-primary-blue" />
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Upcoming
              </h3>
            </div>
            <div className="space-y-2.5">
              {upcomingEvents.map((e, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className={cn('w-2 h-2 rounded-full mt-1.5 shrink-0', e.color)} />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{e.title}</p>
                    <p className="text-[11px] text-muted-foreground">{e.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Bell className="w-4 h-4 text-primary-blue" />
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Recent Activity
              </h3>
            </div>
            <div className="space-y-3">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-1.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-foreground leading-snug">{a.text}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
