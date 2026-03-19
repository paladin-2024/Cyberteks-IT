import { Calendar, Clock, Video, BookOpen, ClipboardList, MapPin } from 'lucide-react';

type EventType = 'live' | 'assignment' | 'quiz' | 'lesson';

interface ScheduleEvent {
  time: string;
  duration: string;
  title: string;
  course: string;
  type: EventType;
  instructor?: string;
  location?: string;
}

const weekDays  = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const weekDates = ['Mar 17', 'Mar 18', 'Mar 19', 'Mar 20', 'Mar 21', 'Mar 22'];
const todayIdx  = 0;

const schedule: Record<number, ScheduleEvent[]> = {
  0: [
    { time: '9:00 AM',  duration: '60 min', title: 'Live Class: CSS Grid & Flexbox', course: 'Web Dev',       type: 'live',       instructor: 'Caleb Nzabanita', location: 'Zoom' },
    { time: '3:00 PM',  duration: '45 min', title: 'Self-Study: JS Fundamentals',    course: 'Web Dev',       type: 'lesson' },
  ],
  1: [
    { time: '10:00 AM', duration: '30 min', title: 'Quiz: Network Fundamentals',     course: 'Networking',    type: 'quiz' },
    { time: '2:00 PM',  duration: '60 min', title: 'Live Session: Firewalls & IDS',  course: 'Cybersecurity', type: 'live',  instructor: 'Caleb Nzabanita', location: 'Google Meet' },
  ],
  2: [
    { time: '11:00 AM', duration: '45 min', title: 'Self-Study: Responsive Design',  course: 'Web Dev',       type: 'lesson' },
    { time: '4:00 PM',  duration: '20 min', title: 'Assignment Review',              course: 'Networking',    type: 'assignment' },
  ],
  3: [
    { time: '9:00 AM',  duration: '60 min', title: 'Live Class: DOM Manipulation',   course: 'Web Dev',       type: 'live', instructor: 'Caleb Nzabanita', location: 'Zoom' },
  ],
  4: [
    { time: '10:00 AM', duration: '—',      title: 'Project Submission Deadline',    course: 'Cybersecurity', type: 'assignment' },
    { time: '3:00 PM',  duration: '45 min', title: 'Self-Study: Encryption Basics',  course: 'Cybersecurity', type: 'lesson' },
  ],
  5: [
    { time: '10:00 AM', duration: '90 min', title: 'Open Lab / Study Session',       course: 'All Courses',   type: 'live', location: 'Discord' },
  ],
};

const typeConfig: Record<EventType, { label: string; icon: React.ElementType; bg: string; border: string; text: string; iconColor: string }> = {
  live:       { label: 'Live Session', icon: Video,        bg: 'bg-blue-50',  border: 'border-blue-200',  text: 'text-blue-700',  iconColor: 'text-blue-500' },
  assignment: { label: 'Assignment',   icon: ClipboardList, bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', iconColor: 'text-amber-500' },
  quiz:       { label: 'Quiz',         icon: BookOpen,     bg: 'bg-rose-50',  border: 'border-rose-200',  text: 'text-rose-700',  iconColor: 'text-rose-500' },
  lesson:     { label: 'Self-Study',   icon: BookOpen,     bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-600', iconColor: 'text-slate-400' },
};

export default function SchedulePage() {
  return (
    <div className="space-y-6 max-w-5xl pb-8">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-900">My Schedule</h1>
          <p className="text-slate-500 text-sm mt-0.5">Week of March 17 – 22, 2026</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-sm font-medium text-slate-600">
          <Calendar className="w-4 h-4 text-primary-blue" />
          March 2026
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(typeConfig).map(([key, cfg]) => (
          <span key={key} className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${cfg.bg} ${cfg.border} ${cfg.text}`}>
            <cfg.icon className={`w-3 h-3 ${cfg.iconColor}`} />
            {cfg.label}
          </span>
        ))}
      </div>

      {/* Week grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {weekDays.map((day, i) => {
          const isToday = i === todayIdx;
          const events  = schedule[i] ?? [];
          return (
            <div key={day} className={`rounded-2xl border overflow-hidden ${isToday ? 'border-primary-blue shadow-md shadow-blue-900/10' : 'border-slate-200 bg-white'}`}>
              <div className={`px-3 py-2.5 flex items-center justify-between ${isToday ? 'bg-primary-blue text-white' : 'bg-slate-50 border-b border-slate-100'}`}>
                <span className="text-xs font-bold">{day}</span>
                <span className={`text-[10px] font-medium ${isToday ? 'text-white/70' : 'text-slate-400'}`}>{weekDates[i]}</span>
              </div>
              <div className="p-2 space-y-1.5 bg-white min-h-[80px]">
                {events.length === 0 ? (
                  <p className="text-[10px] text-slate-300 text-center py-3">No events</p>
                ) : events.map((e, j) => {
                  const cfg = typeConfig[e.type];
                  return (
                    <div key={j} className={`rounded-xl px-2 py-1.5 border ${cfg.bg} ${cfg.border}`}>
                      <p className={`text-[10px] font-bold leading-snug ${cfg.text}`}>{e.title}</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">{e.time} · {e.duration}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Today's detail */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-2 h-2 rounded-full bg-primary-blue animate-pulse" />
          <h2 className="font-display font-bold text-slate-900 text-base">Today — Monday, March 17</h2>
        </div>
        <div className="space-y-3">
          {(schedule[0] ?? []).map((e, i) => {
            const cfg  = typeConfig[e.type];
            const Icon = cfg.icon;
            return (
              <div key={i} className={`flex items-start gap-4 p-4 rounded-2xl border ${cfg.bg} ${cfg.border}`}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white shadow-sm">
                  <Icon className={`w-5 h-5 ${cfg.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm ${cfg.text}`}>{e.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{e.course}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{e.time} · {e.duration}</span>
                    {e.instructor && <span>{e.instructor}</span>}
                    {e.location   && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{e.location}</span>}
                  </div>
                </div>
                {e.type === 'live' && (
                  <button className="shrink-0 px-4 py-1.5 bg-primary-blue text-white text-xs font-bold rounded-xl hover:bg-blue-800 transition-all">
                    Join
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
