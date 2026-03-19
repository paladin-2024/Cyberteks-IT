import { BookOpen, Plus, Users, Clock, Star } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const courses = [
  { id: '1', title: 'Web Development Fundamentals',        category: 'Development', students: 84, lessons: 25, duration: '3 months', status: 'PUBLISHED', rating: 4.8, reviews: 62, completion: 72 },
  { id: '2', title: 'IT Support & Networking',             category: 'Networking',  students: 58, lessons: 24, duration: '2 months', status: 'PUBLISHED', rating: 4.6, reviews: 41, completion: 65 },
  { id: '3', title: 'Introduction to AI & Machine Learning', category: 'AI',        students: 0,  lessons: 18, duration: '2 months', status: 'DRAFT',     rating: 0,   reviews: 0,  completion: 0 },
];

export default function TeacherCoursesPage() {
  const { t } = useLanguage();
  const d = t.lms.teacher.courses;

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">{d.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{courses.length} {d.title.toLowerCase()}</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-red text-white text-sm font-semibold rounded-xl hover:bg-rose-700 transition-all">
          <Plus className="w-4 h-4" /> {d.newCourse}
        </button>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {courses.map((course) => (
          <div key={course.id} className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition-all group">
            <div className="p-5 pb-4">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary-blue/10 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-primary-blue" />
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  course.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'
                }`}>
                  {course.status === 'PUBLISHED' ? t.lms.status.published : t.lms.status.draft}
                </span>
              </div>

              <h3 className="font-heading font-semibold text-foreground mb-1 group-hover:text-primary-blue transition-colors leading-snug">
                {course.title}
              </h3>
              <p className="text-xs text-muted-foreground">{course.category}</p>

              {course.rating > 0 && (
                <div className="flex items-center gap-1 mt-2">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-semibold text-foreground">{course.rating}</span>
                  <span className="text-xs text-muted-foreground">({course.reviews} {d.reviews})</span>
                </div>
              )}
            </div>

            {course.status === 'PUBLISHED' && (
              <div className="px-5 pb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-muted-foreground">{d.avgCompletion}</span>
                  <span className="text-xs font-semibold text-foreground">{course.completion}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-primary-blue" style={{ width: `${course.completion}%` }} />
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 text-xs text-muted-foreground border-t border-border px-5 py-3">
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {course.students}</span>
              <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {course.lessons} {t.lms.common.lessons}</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.duration}</span>
            </div>

            <div className="flex border-t border-border">
              <button className="flex-1 py-3 text-xs font-semibold text-primary-blue hover:bg-primary-blue/5 transition-colors">{d.edit}</button>
              <div className="w-px bg-border" />
              <button className="flex-1 py-3 text-xs font-semibold text-muted-foreground hover:bg-muted/50 transition-colors">{d.preview}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
