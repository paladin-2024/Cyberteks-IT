import { BookOpen, Plus, Users, Clock } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const courses = [
  { id: '1', title: 'Web Development Fundamentals',       teacher: 'Dr. James Kiprotich', students: 84, lessons: 25, duration: '3 months', status: 'PUBLISHED', category: 'Development' },
  { id: '2', title: 'Cybersecurity Essentials',           teacher: 'Sarah Namugga',       students: 62, lessons: 26, duration: '2 months', status: 'PUBLISHED', category: 'Security' },
  { id: '3', title: 'IT Support & Networking',            teacher: 'Dr. James Kiprotich', students: 58, lessons: 24, duration: '2 months', status: 'PUBLISHED', category: 'Networking' },
  { id: '4', title: 'Data Analysis with Excel & Python',  teacher: 'Sarah Namugga',       students: 38, lessons: 20, duration: '6 weeks',  status: 'PUBLISHED', category: 'Data' },
  { id: '5', title: 'Introduction to AI & Machine Learning', teacher: 'Dr. James Kiprotich', students: 0, lessons: 18, duration: '2 months', status: 'DRAFT', category: 'AI' },
  { id: '6', title: 'Digital Marketing Masterclass',      teacher: 'Sarah Namugga',       students: 0,  lessons: 15, duration: '6 weeks',  status: 'DRAFT',     category: 'Marketing' },
];

export default function CoursesPage() {
  const { t } = useLanguage();
  const d = t.lms.admin.courses;

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">{d.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{courses.length} {d.title.toLowerCase()}</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-red text-white text-sm font-semibold rounded-xl hover:bg-rose-700 transition-all">
          <Plus className="w-4 h-4" /> {d.addCourse}
        </button>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {courses.map((course) => (
          <div key={course.id} className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary-blue/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-blue" />
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                course.status === 'PUBLISHED'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {course.status === 'PUBLISHED' ? t.lms.status.published : t.lms.status.draft}
              </span>
            </div>

            <h3 className="font-heading font-semibold text-foreground mb-1 group-hover:text-primary-blue transition-colors">
              {course.title}
            </h3>
            <p className="text-xs text-muted-foreground mb-4">{course.teacher} · {course.category}</p>

            <div className="flex items-center gap-4 text-xs text-muted-foreground border-t border-border pt-3">
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {course.students} {d.students}</span>
              <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {course.lessons} {d.lessons}</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.duration}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
