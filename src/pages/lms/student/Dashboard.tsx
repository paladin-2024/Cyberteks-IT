import { Link } from 'react-router-dom';
import {
  BookOpen, Award, Clock, TrendingUp, ArrowUpRight,
  Target, Flame, CheckCircle2, PlayCircle, Calendar,
  ChevronRight, Star,
} from 'lucide-react';
import { ChartLine, ChartPie } from '@/components/ui/chart';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

const progressData = [
  { week: 'W1', hours: 3 }, { week: 'W2', hours: 5 }, { week: 'W3', hours: 4 },
  { week: 'W4', hours: 7 }, { week: 'W5', hours: 6 }, { week: 'W6', hours: 8 },
];

const timeData = [
  { name: 'Web Dev', value: 40 },
  { name: 'Cybersecurity', value: 25 },
  { name: 'Networking', value: 20 },
  { name: 'Other', value: 15 },
];

const courses = [
  { title: 'Web Development Fundamentals', progress: 72, lessons: '18/25', nextLesson: 'CSS Grid & Flexbox',        instructor: 'Caleb Nzabanita', color: 'bg-blue-500' },
  { title: 'Cybersecurity Essentials',     progress: 34, lessons: '9/26',  nextLesson: 'Network Threats & Firewalls', instructor: 'Caleb Nzabanita', color: 'bg-rose-500' },
  { title: 'IT Support & Networking',      progress: 91, lessons: '22/24', nextLesson: 'Final Assessment',            instructor: 'Caleb Nzabanita', color: 'bg-emerald-500' },
];

const upcoming = [
  { time: 'Today 3:00 PM',     title: 'Live Session: CSS Grid',       course: 'Web Dev' },
  { time: 'Tomorrow 10:00 AM', title: 'Quiz: Network Fundamentals',   course: 'Networking' },
  { time: 'Fri, Mar 21',       title: 'Project Submission Deadline',  course: 'Cybersecurity' },
];

const achievements = [
  { icon: Flame,  label: '7-Day Streak',      unlocked: true  },
  { icon: Star,   label: 'First Certificate', unlocked: true  },
  { icon: Target, label: '50 Lessons Done',   unlocked: false },
  { icon: Award,  label: 'Top Performer',     unlocked: false },
];

export default function StudentDashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const name = user?.name?.split(' ')[0] ?? 'Student';
  const d = t.lms.student.dashboard;

  const stats = [
    { label: d.stats.enrolled,     value: '3',   icon: BookOpen,   iconBg: 'bg-blue-50',    iconColor: 'text-blue-600',    desc: 'Active courses' },
    { label: d.stats.completed,    value: '49',  icon: TrendingUp, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', desc: 'Lessons done' },
    { label: d.stats.hoursStudied, value: '33h', icon: Clock,      iconBg: 'bg-amber-50',   iconColor: 'text-amber-600',   desc: 'Total study time' },
    { label: d.stats.certificates, value: '1',   icon: Award,      iconBg: 'bg-violet-50',  iconColor: 'text-violet-600',  desc: 'Earned' },
  ];

  return (
    <div className="space-y-6 max-w-6xl pb-8">

      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-primary-blue to-blue-700 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-100" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative">
          <p className="text-white/60 text-sm font-medium mb-1">Welcome back,</p>
          <h1 className="font-display text-2xl font-extrabold mb-0.5">{name}</h1>
          <p className="text-white/70 text-sm">{d.subtitle}</p>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1.5 bg-white/15 rounded-xl px-3 py-1.5 text-sm font-semibold">
              <Flame className="w-4 h-4 text-amber-300" />
              7-day streak
            </div>
            <div className="flex items-center gap-1.5 bg-white/15 rounded-xl px-3 py-1.5 text-sm font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              49 lessons complete
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${s.iconBg}`}>
              <s.icon className={`w-4 h-4 ${s.iconColor}`} />
            </div>
            <p className="font-display text-2xl font-extrabold text-slate-900 leading-none">{s.value}</p>
            <p className="text-xs font-medium text-slate-500 mt-1">{s.label}</p>
            <p className="text-xs text-slate-400">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display font-bold text-slate-900 text-base">{d.weeklyStudy}</h2>
              <p className="text-xs text-slate-400 mt-0.5">Hours studied per week</p>
            </div>
            <Link to="/student/progress" className="flex items-center gap-1 text-xs font-semibold text-primary-blue hover:text-blue-800 transition-colors">
              Full report <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <ChartLine data={progressData} dataKeys={['hours']} xKey="week" height={220} />
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="font-display font-bold text-slate-900 text-base mb-1">{d.timeByCourse}</h2>
          <p className="text-xs text-slate-400 mb-4">Time split by subject</p>
          <ChartPie data={timeData} donut height={220} />
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-5 gap-5">

        {/* Course progress */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-slate-900 text-base">{d.courseProgress}</h2>
            <Link to="/student/courses" className="flex items-center gap-1 text-xs font-semibold text-primary-blue hover:text-blue-800 transition-colors">
              All courses <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-5">
            {courses.map((c) => (
              <div key={c.title}>
                <div className="flex items-start justify-between mb-2 gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{c.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <PlayCircle className="w-3 h-3 text-slate-400" />
                      Next: {c.nextLesson}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-slate-900">{c.progress}%</p>
                    <p className="text-xs text-slate-400">{c.lessons} lessons</p>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full rounded-full ${c.color} transition-all`} style={{ width: `${c.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/student/courses"
            className="mt-5 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            Continue Learning <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-5">

          {/* Upcoming */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-slate-900 text-base">Upcoming</h2>
              <Link to="/student/schedule" className="text-xs font-semibold text-primary-blue hover:text-blue-800 transition-colors">
                Schedule
              </Link>
            </div>
            <div className="space-y-3">
              {upcoming.map((u, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary-blue/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-primary-blue" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 leading-snug">{u.title}</p>
                    <p className="text-xs text-slate-400">{u.time}</p>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md font-medium mt-0.5 inline-block">{u.course}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h2 className="font-display font-bold text-slate-900 text-base mb-4">Achievements</h2>
            <div className="grid grid-cols-2 gap-2">
              {achievements.map(({ icon: Icon, label, unlocked }) => (
                <div
                  key={label}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center ${
                    unlocked
                      ? 'bg-amber-50 border-amber-100 text-amber-700'
                      : 'bg-slate-50 border-slate-100 text-slate-400'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${unlocked ? 'text-amber-500' : 'text-slate-300'}`} />
                  <span className="text-[10px] font-semibold leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
