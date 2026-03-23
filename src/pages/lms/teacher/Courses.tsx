import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Clock, Info, Globe, ShieldCheck, Network, Database, Brain } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';

interface Course {
  id: string;
  title: string;
  category: string | null;
  status: string;
  duration: string | null;
  level: string | null;
  price: number;
  currency: string;
  coverImage: string | null;
  _count: { enrollments: number; sections: number };
}

const STATUS_COLORS: Record<string, string> = {
  PUBLISHED: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  DRAFT:     'bg-amber-100 text-amber-700 border border-amber-200',
  ARCHIVED:  'bg-slate-100 text-muted-foreground border border-border',
};

const categoryConfig: Record<string, { gradient: string; Icon: React.ElementType }> = {
  'Web Development': { gradient: 'from-blue-500 to-indigo-600',   Icon: Globe       },
  Cybersecurity:     { gradient: 'from-red-500 to-rose-600',      Icon: ShieldCheck },
  Networking:        { gradient: 'from-teal-500 to-cyan-600',     Icon: Network     },
  Data:              { gradient: 'from-violet-500 to-purple-600', Icon: Database    },
  AI:                { gradient: 'from-amber-500 to-orange-600',  Icon: Brain       },
  Other:             { gradient: 'from-slate-400 to-slate-600',   Icon: BookOpen    },
};

function getCategoryConfig(category: string | null) {
  return categoryConfig[category ?? ''] ?? { gradient: 'from-[#023064] to-blue-800', Icon: BookOpen };
}

export default function TeacherCoursesPage() {
  const { t } = useLanguage();
  const d = t.lms.teacher.courses;

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ courses: Course[] }>('/courses/my')
      .then(({ courses }) => setCourses(courses))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">{d.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {loading ? 'Loading…' : `${courses.length} course${courses.length !== 1 ? 's' : ''} assigned to you`}
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 px-3 py-2 rounded-xl border border-border">
          <Info className="w-3.5 h-3.5 shrink-0" />
          Courses are assigned by the admin
        </div>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
              <div className="h-28 bg-muted" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/3" />
                <div className="h-1.5 bg-muted rounded-full w-full" />
                <div className="h-9 bg-muted rounded-xl w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-16 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-primary-blue" />
          </div>
          <p className="font-heading font-semibold text-foreground mb-1">No courses assigned yet</p>
          <p className="text-sm text-muted-foreground max-w-xs">
            The admin will assign courses to your profile. Check back soon.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {courses.map((course) => {
            const { gradient, Icon } = getCategoryConfig(course.category);
            return (
              <div key={course.id} className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition-all group flex flex-col">

                {/* Gradient header */}
                <div className={`h-28 bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden`}>
                  {course.coverImage
                    ? <img src={course.coverImage} alt={course.title} className="absolute inset-0 w-full h-full object-cover" />
                    : <Icon className="w-12 h-12 text-white/80" />
                  }
                  <div className="absolute top-3 right-3">
                    <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${STATUS_COLORS[course.status] ?? 'bg-slate-100 text-muted-foreground'}`}>
                      {course.status.charAt(0) + course.status.slice(1).toLowerCase()}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-heading font-semibold text-foreground mb-1 group-hover:text-primary-blue transition-colors leading-snug line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {course.category ?? 'General'}{course.level ? ` · ${course.level}` : ''}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {course._count.enrollments} enrolled</span>
                    <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {course._count.sections} sections</span>
                    {course.duration && (
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.duration}</span>
                    )}
                  </div>

                  <div className="mt-auto">
                    <Link
                      to={`/teacher/courses/${course.id}`}
                      className="flex items-center justify-center w-full py-2.5 text-xs font-semibold bg-primary-blue/10 text-primary-blue rounded-xl hover:bg-primary-blue/20 transition-colors"
                    >
                      {d.preview}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
