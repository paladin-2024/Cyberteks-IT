import { Link } from 'react-router-dom';
import {
  BookOpen, Users, MessageSquare, Star, ArrowUpRight,
  PlusCircle, ClipboardList, CheckCircle2, AlertCircle,
} from 'lucide-react';
import { ChartBar, ChartLine } from '@/components/ui/chart';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

const studentActivity = [
  { day: 'Mon', active: 12 }, { day: 'Tue', active: 18 }, { day: 'Wed', active: 15 },
  { day: 'Thu', active: 22 }, { day: 'Fri', active: 19 }, { day: 'Sat', active: 8 },
  { day: 'Sun', active: 5 },
];

const completionData = [
  { course: 'Web Dev',  enrolled: 84, completed: 68 },
  { course: 'Cyber',    enrolled: 62, completed: 45 },
  { course: 'Network',  enrolled: 58, completed: 52 },
];

const myCourses = [
  { title: 'Web Development Fundamentals', students: 84, rating: 4.8, status: 'Published', completion: 81, color: 'bg-blue-500' },
  { title: 'Cybersecurity Essentials',     students: 62, rating: 4.6, status: 'Published', completion: 73, color: 'bg-rose-500' },
  { title: 'IT Support & Networking',      students: 58, rating: 4.9, status: 'Published', completion: 90, color: 'bg-emerald-500' },
  { title: 'Introduction to AI',           students: 0,  rating: 0,   status: 'Draft',     completion: 0,  color: 'bg-slate-300' },
];

const recentStudents = [
  { name: 'Aisha Nakato',    course: 'Web Dev',       progress: 72, lastSeen: '2 hrs ago' },
  { name: 'Moses Ssemakula', course: 'Cybersecurity', progress: 45, lastSeen: 'Today' },
  { name: 'Grace Atuhaire',  course: 'Networking',    progress: 91, lastSeen: 'Yesterday' },
  { name: 'David Ochieng',   course: 'Web Dev',       progress: 28, lastSeen: '3 days ago' },
];

const tasks = [
  { text: 'Grade Quiz #4 — Cybersecurity',    due: 'Today',    done: false, urgent: true },
  { text: 'Record Lesson 19 — CSS Grid',      due: 'Tomorrow', done: false, urgent: false },
  { text: 'Reply to student messages (3)',    due: 'Today',    done: false, urgent: true },
  { text: 'Update course outline — AI Intro', due: 'This week', done: true,  urgent: false },
];

export default function TeacherDashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const name = user?.name?.split(' ')[0] ?? 'Instructor';
  const d = t.lms.teacher.dashboard;

  const stats = [
    { label: d.stats.courses,  value: '4',   icon: BookOpen,      iconBg: 'bg-blue-50',    iconColor: 'text-blue-600',    desc: '3 published, 1 draft' },
    { label: d.stats.students, value: '204', icon: Users,         iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', desc: 'Across all courses' },
    { label: 'Messages',       value: '7',   icon: MessageSquare, iconBg: 'bg-amber-50',   iconColor: 'text-amber-600',   desc: '3 unread' },
    { label: d.stats.rating,   value: '4.8', icon: Star,          iconBg: 'bg-yellow-50',  iconColor: 'text-yellow-600',  desc: 'Avg. student rating' },
  ];

  return (
    <div className="space-y-6 max-w-6xl pb-8">

      {/* Header banner */}
      <div className="bg-gradient-to-r from-slate-900 to-primary-blue rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-100" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-white/60 text-sm font-medium mb-1">Instructor Portal</p>
            <h1 className="font-display text-2xl font-extrabold mb-0.5">Hello, {name}</h1>
            <p className="text-white/70 text-sm">{d.subtitle}</p>
            <div className="flex items-center gap-3 mt-4">
              <div className="flex items-center gap-1.5 bg-white/15 rounded-xl px-3 py-1.5 text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                3 courses active
              </div>
              <div className="flex items-center gap-1.5 bg-white/15 rounded-xl px-3 py-1.5 text-sm font-semibold">
                <AlertCircle className="w-4 h-4 text-amber-300" />
                3 tasks due today
              </div>
            </div>
          </div>
          <Link
            to="/teacher/courses"
            className="shrink-0 flex items-center gap-2 bg-white text-slate-900 font-bold text-sm px-4 py-2 rounded-xl hover:bg-white/90 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            New Course
          </Link>
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
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display font-bold text-slate-900 text-base">{d.activeStudents}</h2>
              <p className="text-xs text-slate-400 mt-0.5">Daily active learners this week</p>
            </div>
            <Link to="/teacher/students" className="flex items-center gap-1 text-xs font-semibold text-primary-blue hover:text-blue-800 transition-colors">
              View all <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <ChartLine data={studentActivity} dataKeys={['active']} xKey="day" height={210} />
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display font-bold text-slate-900 text-base">{d.completionRate}</h2>
              <p className="text-xs text-slate-400 mt-0.5">Enrolled vs. completed by course</p>
            </div>
          </div>
          <ChartBar data={completionData} dataKeys={['enrolled', 'completed']} xKey="course" height={210} />
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-5 gap-5">

        {/* My courses */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-slate-900 text-base">{d.myCourses}</h2>
            <Link to="/teacher/courses" className="flex items-center gap-1 text-xs font-semibold text-primary-blue hover:text-blue-800 transition-colors">
              Manage <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {myCourses.map((c) => (
              <div key={c.title} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className={`w-1 h-10 rounded-full ${c.color} shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{c.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-400">{c.students} students</span>
                    {c.rating > 0 && (
                      <span className="flex items-center gap-0.5 text-xs text-amber-500 font-semibold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {c.rating}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    c.status === 'Published'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {c.status}
                  </span>
                  {c.completion > 0 && (
                    <p className="text-xs text-slate-400 mt-1">{c.completion}% avg.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-5">

          {/* Recent students */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-slate-900 text-base">Recent Students</h2>
              <Link to="/teacher/students" className="text-xs font-semibold text-primary-blue hover:text-blue-800 transition-colors">
                All students
              </Link>
            </div>
            <div className="space-y-3">
              {recentStudents.map((s) => (
                <div key={s.name} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-primary-blue flex items-center justify-center shrink-0">
                    <span className="text-white text-[10px] font-bold">
                      {s.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-700 truncate">{s.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex-1 h-1.5 rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-primary-blue" style={{ width: `${s.progress}%` }} />
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">{s.progress}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Task list */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-slate-900 text-base">To-Do</h2>
              <Link to="/teacher/assignments" className="flex items-center gap-1 text-xs font-semibold text-primary-blue hover:text-blue-800 transition-colors">
                <ClipboardList className="w-3.5 h-3.5" /> Assignments
              </Link>
            </div>
            <div className="space-y-2">
              {tasks.map((task, i) => (
                <div key={i} className={`flex items-start gap-3 p-2.5 rounded-xl ${task.done ? 'opacity-50' : task.urgent ? 'bg-red-50' : 'hover:bg-slate-50'}`}>
                  <div className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                    task.done ? 'bg-emerald-500 border-emerald-500' : task.urgent ? 'border-red-400' : 'border-slate-300'
                  }`}>
                    {task.done && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium leading-snug ${task.done ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                      {task.text}
                    </p>
                    <p className={`text-[10px] mt-0.5 ${task.urgent && !task.done ? 'text-red-500 font-semibold' : 'text-slate-400'}`}>
                      Due: {task.due}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
