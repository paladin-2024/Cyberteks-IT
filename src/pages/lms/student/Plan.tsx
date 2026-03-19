import {
  BookOpen, CheckCircle, Circle, Clock, Target, TrendingUp,
  Calendar, Award, ChevronRight, Lock,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const learningPath = [
  {
    phase: 'Phase 1', title: 'Foundations', duration: '4 weeks', status: 'completed',
    courses: [
      { title: 'Introduction to ICT',     lessons: 12, duration: '6h',  status: 'completed', progress: 100 },
      { title: 'Computer Fundamentals',   lessons: 8,  duration: '4h',  status: 'completed', progress: 100 },
    ],
  },
  {
    phase: 'Phase 2', title: 'Core Skills', duration: '6 weeks', status: 'active',
    courses: [
      { title: 'Web Development Basics',  lessons: 20, duration: '12h', status: 'active',    progress: 65 },
      { title: 'Networking Essentials',   lessons: 15, duration: '8h',  status: 'active',    progress: 30 },
    ],
  },
  {
    phase: 'Phase 3', title: 'Advanced Topics', duration: '8 weeks', status: 'locked',
    courses: [
      { title: 'Cybersecurity Fundamentals', lessons: 24, duration: '16h', status: 'locked', progress: 0 },
      { title: 'Data Analytics & Power BI',  lessons: 18, duration: '10h', status: 'locked', progress: 0 },
    ],
  },
  {
    phase: 'Phase 4', title: 'Capstone', duration: '4 weeks', status: 'locked',
    courses: [
      { title: 'Final Project & Portfolio', lessons: 10, duration: '20h', status: 'locked', progress: 0 },
    ],
  },
];

const weeklySchedule = [
  { day: 'Mon', subject: 'Web Development', time: '2:00 PM', duration: '1.5h', color: 'bg-primary-blue' },
  { day: 'Tue', subject: 'Networking',      time: '4:00 PM', duration: '1h',   color: 'bg-teal-500' },
  { day: 'Wed', subject: 'Web Development', time: '2:00 PM', duration: '1.5h', color: 'bg-primary-blue' },
  { day: 'Thu', subject: 'Live Session',    time: '3:00 PM', duration: '2h',   color: 'bg-primary-red' },
  { day: 'Fri', subject: 'Networking',      time: '4:00 PM', duration: '1h',   color: 'bg-teal-500' },
  { day: 'Sat', subject: 'Self Study',      time: 'Flexible', duration: '2h+', color: 'bg-amber-500' },
];

const goals = [
  { title: 'Complete Phase 2',          deadline: 'Mar 31, 2026', progress: 47,  done: false },
  { title: 'Earn Web Dev Certificate',  deadline: 'Apr 15, 2026', progress: 65,  done: false },
  { title: 'Build Portfolio Project',   deadline: 'May 01, 2026', progress: 0,   done: false },
  { title: 'Complete Foundation Phase', deadline: 'Feb 28, 2026', progress: 100, done: true },
];

export default function PlanPage() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] ?? 'Student';

  const allCourses = learningPath.flatMap((p) => p.courses);
  const overallProgress = Math.round(allCourses.reduce((acc, c) => acc + c.progress, 0) / allCourses.length);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Learning Plan</h1>
        <p className="text-muted-foreground text-sm mt-1">Your personalized roadmap to ICT mastery, {firstName}.</p>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Overall Progress',    value: `${overallProgress}%`, icon: TrendingUp, color: 'text-primary-blue bg-primary-blue/10' },
          { label: 'Courses Active',      value: '2',                   icon: BookOpen,   color: 'text-teal-600 bg-teal-100' },
          { label: 'Hours Completed',     value: '22h',                 icon: Clock,      color: 'text-amber-600 bg-amber-100' },
          { label: 'Certificates Earned', value: '1',                   icon: Award,      color: 'text-primary-red bg-primary-red/10' },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="font-heading text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Learning Roadmap */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-heading font-semibold text-foreground">Learning Roadmap</h2>

          <div className="relative">
            <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-border" />
            <div className="space-y-4">
              {learningPath.map((phase, pi) => (
                <div key={pi} className="relative">
                  <div className={`absolute left-4 top-5 w-4 h-4 rounded-full border-2 z-10 ${
                    phase.status === 'completed' ? 'bg-green-500 border-green-500'
                    : phase.status === 'active'  ? 'bg-primary-blue border-primary-blue'
                    : 'bg-background border-border'
                  }`} />

                  <div className="ml-12">
                    <div className={`bg-card border border-border rounded-2xl p-4 ${phase.status === 'locked' ? 'opacity-60' : ''}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{phase.phase}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              phase.status === 'completed' ? 'bg-green-100 text-green-700'
                              : phase.status === 'active'  ? 'bg-primary-blue/10 text-primary-blue'
                              : 'bg-muted text-muted-foreground'
                            }`}>
                              {phase.status === 'completed' ? 'Completed' : phase.status === 'active' ? 'In Progress' : 'Locked'}
                            </span>
                          </div>
                          <h3 className="font-heading font-bold text-foreground mt-0.5">{phase.title}</h3>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {phase.duration}
                        </p>
                      </div>

                      <div className="space-y-2">
                        {phase.courses.map((course, ci) => (
                          <div key={ci} className="flex items-center gap-3 py-2 px-3 rounded-xl bg-muted/50">
                            <div className="shrink-0">
                              {course.status === 'completed' ? <CheckCircle className="w-4 h-4 text-green-500" />
                               : course.status === 'active' ? <Circle className="w-4 h-4 text-primary-blue" />
                               : <Lock className="w-4 h-4 text-muted-foreground" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{course.title}</p>
                              <p className="text-xs text-muted-foreground">{course.lessons} lessons · {course.duration}</p>
                            </div>
                            {course.progress > 0 && (
                              <div className="w-20 shrink-0">
                                <span className="text-xs text-muted-foreground">{course.progress}%</span>
                                <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                                  <div className="h-full bg-primary-blue rounded-full transition-all" style={{ width: `${course.progress}%` }} />
                                </div>
                              </div>
                            )}
                            {course.status !== 'locked' && <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right col */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-4">
            <h2 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary-blue" /> Weekly Schedule
            </h2>
            <div className="space-y-2">
              {weeklySchedule.map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 text-xs font-bold text-muted-foreground shrink-0">{s.day}</div>
                  <div className={`w-1.5 h-6 rounded-full shrink-0 ${s.color}`} />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{s.subject}</p>
                    <p className="text-[11px] text-muted-foreground">{s.time} · {s.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4">
            <h2 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-primary-red" /> Goals
            </h2>
            <div className="space-y-3">
              {goals.map((g, i) => (
                <div key={i} className={g.done ? 'opacity-60' : ''}>
                  <div className="flex items-start gap-2 mb-1">
                    {g.done
                      ? <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      : <Target className="w-4 h-4 text-primary-blue mt-0.5 shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground">{g.title}</p>
                      <p className="text-[11px] text-muted-foreground">By {g.deadline}</p>
                    </div>
                  </div>
                  <div className="ml-6 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${g.done ? 'bg-green-500' : 'bg-primary-blue'}`} style={{ width: `${g.progress}%` }} />
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
