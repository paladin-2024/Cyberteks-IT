import { BookOpen, Clock, CheckCircle, PlayCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const courses = [
  { id: '1', title: 'Web Development Fundamentals',       teacher: 'Dr. James Kiprotich', category: 'Development', lessons: 25, completed: 18, duration: '3 months', status: 'IN_PROGRESS', lastLesson: 'CSS Flexbox & Grid Layouts' },
  { id: '2', title: 'IT Support & Networking',            teacher: 'Dr. James Kiprotich', category: 'Networking',  lessons: 24, completed: 24, duration: '2 months', status: 'COMPLETED',   lastLesson: 'Network Troubleshooting' },
  { id: '3', title: 'Data Analysis with Excel & Python',  teacher: 'Sarah Namugga',       category: 'Data',        lessons: 20, completed: 5,  duration: '6 weeks',  status: 'IN_PROGRESS', lastLesson: 'Python Basics for Data' },
];

export default function StudentCoursesPage() {
  const { t } = useLanguage();
  const d = t.lms.student.courses;

  const statusCls: Record<string, string> = {
    IN_PROGRESS: 'bg-blue-100 text-blue-700',
    COMPLETED:   'bg-green-100 text-green-700',
    NOT_STARTED: 'bg-muted text-muted-foreground',
  };

  const statusLabel: Record<string, string> = {
    IN_PROGRESS: t.lms.status.inProgress,
    COMPLETED:   t.lms.status.completed,
    NOT_STARTED: t.lms.common.noData,
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">{d.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{courses.length} {d.enrolled}</p>
      </div>

      <div className="space-y-4">
        {courses.map((course) => {
          const progress = Math.round((course.completed / course.lessons) * 100);
          return (
            <div key={course.id} className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-all group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-blue/10 flex items-center justify-center shrink-0">
                  {course.status === 'COMPLETED'
                    ? <CheckCircle className="w-6 h-6 text-green-500" />
                    : <BookOpen className="w-6 h-6 text-primary-blue" />
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                    <h3 className="font-heading font-semibold text-foreground group-hover:text-primary-blue transition-colors">
                      {course.title}
                    </h3>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${statusCls[course.status]}`}>
                      {statusLabel[course.status]}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground mb-3">
                    {course.teacher} · {course.category}
                  </p>

                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-muted-foreground">
                        {course.completed} {t.lms.common.of} {course.lessons} {t.lms.common.lessons}
                      </span>
                      <span className="text-xs font-semibold text-foreground">{progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${course.status === 'COMPLETED' ? 'bg-green-500' : 'bg-primary-blue'}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.duration}</span>
                      <span className="truncate">{course.lastLesson}</span>
                    </div>
                    {course.status !== 'COMPLETED' ? (
                      <button className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-primary-blue text-white text-xs font-semibold rounded-lg hover:bg-blue-900 transition-all">
                        <PlayCircle className="w-3.5 h-3.5" /> {d.continue}
                      </button>
                    ) : (
                      <button className="inline-flex items-center gap-1.5 px-4 py-1.5 border border-border text-xs font-semibold rounded-lg text-muted-foreground hover:bg-muted/50 transition-all">
                        {d.review}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
