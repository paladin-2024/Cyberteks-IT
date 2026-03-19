import { Link } from 'react-router-dom';
import { TrendingUp, Clock, BookOpen, Award, Target, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { ChartLine, ChartBar, ChartPie } from '@/components/ui/chart';

const weeklyHours = [
  { week: 'W1', hours: 3 }, { week: 'W2', hours: 5 }, { week: 'W3', hours: 4 },
  { week: 'W4', hours: 7 }, { week: 'W5', hours: 6 }, { week: 'W6', hours: 8 },
  { week: 'W7', hours: 7 }, { week: 'W8', hours: 9 },
];

const timePerCourse = [
  { name: 'Web Dev',      value: 40 },
  { name: 'Cybersecurity', value: 25 },
  { name: 'Networking',   value: 20 },
  { name: 'Other',        value: 15 },
];

const quizScores = [
  { quiz: 'Quiz 1', score: 78 }, { quiz: 'Quiz 2', score: 85 },
  { quiz: 'Quiz 3', score: 72 }, { quiz: 'Quiz 4', score: 91 },
  { quiz: 'Quiz 5', score: 88 },
];

const courseProgress = [
  { title: 'Web Development Fundamentals', progress: 72, lessons: 18, total: 25, hours: 16, lastActivity: 'Today',      color: 'bg-blue-500',    textColor: 'text-blue-600',    bg: 'bg-blue-50' },
  { title: 'Cybersecurity Essentials',     progress: 34, lessons: 9,  total: 26, hours: 8,  lastActivity: '2 days ago', color: 'bg-rose-500',    textColor: 'text-rose-600',    bg: 'bg-rose-50' },
  { title: 'IT Support & Networking',      progress: 91, lessons: 22, total: 24, hours: 19, lastActivity: 'Yesterday',  color: 'bg-emerald-500', textColor: 'text-emerald-600', bg: 'bg-emerald-50' },
];

const milestones = [
  { label: 'Enrolled in first course',   done: true,  date: 'Jan 10, 2026' },
  { label: 'Completed 10 lessons',       done: true,  date: 'Jan 24, 2026' },
  { label: 'Earned first certificate',   done: true,  date: 'Feb 14, 2026' },
  { label: 'Completed 50 lessons',       done: false, date: 'Target: Apr 2026' },
  { label: 'Finished 2 full courses',    done: false, date: 'Target: May 2026' },
  { label: 'Top performer of the month', done: false, date: 'Upcoming' },
];

export default function ProgressPage() {
  return (
    <div className="space-y-6 max-w-5xl pb-8">

      <div>
        <h1 className="font-display text-xl font-bold text-slate-900">My Progress</h1>
        <p className="text-slate-500 text-sm mt-0.5">Your detailed learning analytics and milestones</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Hours',  value: '33h',  icon: Clock,    iconBg: 'bg-amber-50',   iconColor: 'text-amber-600',   desc: 'Study time logged' },
          { label: 'Lessons Done', value: '49',   icon: BookOpen, iconBg: 'bg-blue-50',    iconColor: 'text-blue-600',    desc: 'Out of 75 total' },
          { label: 'Avg. Score',   value: '83%',  icon: Target,   iconBg: 'bg-violet-50',  iconColor: 'text-violet-600',  desc: 'Across all quizzes' },
          { label: 'Certificates', value: '1',    icon: Award,    iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', desc: 'Earned' },
        ].map((s) => (
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
          <h2 className="font-display font-bold text-slate-900 text-base mb-1">Weekly Study Hours</h2>
          <p className="text-xs text-slate-400 mb-5">Hours of learning per week over last 8 weeks</p>
          <ChartLine data={weeklyHours} dataKeys={['hours']} xKey="week" height={220} />
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="font-display font-bold text-slate-900 text-base mb-1">Time by Course</h2>
          <p className="text-xs text-slate-400 mb-4">Distribution of study hours</p>
          <ChartPie data={timePerCourse} donut height={220} />
        </div>
      </div>

      {/* Quiz performance */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h2 className="font-display font-bold text-slate-900 text-base mb-1">Quiz Performance</h2>
        <p className="text-xs text-slate-400 mb-5">Scores across all quizzes (out of 100)</p>
        <ChartBar data={quizScores} dataKeys={['score']} xKey="quiz" height={200} />
      </div>

      {/* Per-course breakdown */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h2 className="font-display font-bold text-slate-900 text-base mb-5">Course Breakdown</h2>
        <div className="space-y-5">
          {courseProgress.map((c) => (
            <div key={c.title} className={`rounded-2xl border p-5 ${c.bg}`} style={{ borderColor: undefined }}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className={`font-bold text-sm ${c.textColor}`}>{c.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Last activity: {c.lastActivity}</p>
                </div>
                <Link to="/student/courses" className={`flex items-center gap-1 text-xs font-semibold ${c.textColor} hover:opacity-80 transition-opacity`}>
                  Continue <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                <div>
                  <p className="font-bold text-lg text-slate-900">{c.progress}%</p>
                  <p className="text-[10px] text-slate-500">Complete</p>
                </div>
                <div>
                  <p className="font-bold text-lg text-slate-900">{c.lessons}/{c.total}</p>
                  <p className="text-[10px] text-slate-500">Lessons</p>
                </div>
                <div>
                  <p className="font-bold text-lg text-slate-900">{c.hours}h</p>
                  <p className="text-[10px] text-slate-500">Studied</p>
                </div>
              </div>
              <div className="h-2 rounded-full bg-white/60 overflow-hidden">
                <div className={`h-full rounded-full ${c.color}`} style={{ width: `${c.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h2 className="font-display font-bold text-slate-900 text-base mb-5">Learning Milestones</h2>
        <div className="space-y-3">
          {milestones.map((m, i) => (
            <div key={i} className={`flex items-center gap-4 p-3.5 rounded-xl ${m.done ? 'bg-emerald-50 border border-emerald-100' : 'bg-slate-50 border border-slate-100'}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${m.done ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                {m.done
                  ? <CheckCircle2 className="w-4 h-4 text-white" />
                  : <TrendingUp   className="w-4 h-4 text-slate-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${m.done ? 'text-emerald-800' : 'text-slate-600'}`}>{m.label}</p>
                <p className={`text-xs mt-0.5 ${m.done ? 'text-emerald-600' : 'text-slate-400'}`}>{m.date}</p>
              </div>
              {m.done && (
                <span className="shrink-0 text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                  Achieved
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
