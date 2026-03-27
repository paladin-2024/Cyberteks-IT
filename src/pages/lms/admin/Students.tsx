import { useState, useEffect } from 'react';
import {
  Users, Search, Plus, Trash2, BookOpen, X,
  Loader2, AlertCircle, CheckCircle, Clock, ChevronDown, ChevronUp,
  UserCircle,
} from 'lucide-react';
import { api } from '@/lib/api';

// ── Types ─────────────────────────────────────────────────────────────────────

interface CourseRef {
  id: string;
  title: string;
  category: string | null;
  status: string;
}

interface EnrollmentRecord {
  id: string;
  status: string;
  progressPercent: number;
  startedAt: string;
  course: CourseRef;
}

interface Student {
  id: string;
  name: string;
  email: string;
  image: string | null;
  status: string;
  enrollments: EnrollmentRecord[];
}

interface CourseOption {
  id: string;
  title: string;
  category: string | null;
  price: number;
  teacher: { name: string };
}

// ── Enroll Modal ──────────────────────────────────────────────────────────────

function EnrollModal({
  student,
  courses,
  onEnroll,
  onClose,
}: {
  student: Student;
  courses: CourseOption[];
  onEnroll: (courseId: string) => Promise<void>;
  onClose: () => void;
}) {
  const [search, setSearch] = useState('');
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  const enrolledIds = new Set(student.enrollments.map((e) => e.course.id));
  const available = courses.filter(
    (c) => !enrolledIds.has(c.id) &&
    (c.title.toLowerCase().includes(search.toLowerCase()) ||
     (c.category ?? '').toLowerCase().includes(search.toLowerCase()))
  );

  const handle = async (courseId: string) => {
    setEnrollingId(courseId);
    await onEnroll(courseId);
    setEnrollingId(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 className="font-heading font-bold text-foreground text-sm">Enroll in a Course</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Adding course for <span className="font-semibold text-foreground">{student.name}</span></p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses…"
              className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg outline-none focus:border-[#023064]"
            />
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
          {available.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              {search ? 'No courses match your search' : 'Student is enrolled in all available courses'}
            </div>
          ) : (
            available.map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-muted/30 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{c.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.teacher.name}{c.category ? ` · ${c.category}` : ''}
                    {c.price > 0
                      ? <span className="ml-2 text-amber-600 font-semibold">{c.price.toLocaleString()} UGX</span>
                      : <span className="ml-2 text-emerald-600 font-semibold">Free</span>
                    }
                  </p>
                </div>
                <button
                  onClick={() => handle(c.id)}
                  disabled={enrollingId === c.id}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#023064] text-white text-xs font-semibold hover:bg-[#012550] disabled:opacity-60 transition-all"
                >
                  {enrollingId === c.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                  Enroll
                </button>
              </div>
            ))
          )}
        </div>

        <div className="px-5 py-3 border-t border-border">
          <button onClick={onClose} className="w-full py-2 text-xs font-semibold text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted/30 transition-all">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Status badge helpers ───────────────────────────────────────────────────────

const enrollStatusCls: Record<string, string> = {
  ACTIVE:    'bg-blue-50 text-blue-700 border border-blue-100',
  COMPLETED: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  SUSPENDED: 'bg-red-50 text-red-700 border border-red-100',
  DROPPED:   'bg-slate-50 text-muted-foreground border border-slate-100',
};

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [enrollingFor, setEnrollingFor] = useState<Student | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api.get<{ students: Student[] }>('/enrollments/admin/students'),
      api.get<{ courses: CourseOption[] }>('/enrollments/admin/courses'),
    ])
      .then(([{ students }, { courses }]) => { setStudents(students); setCourses(courses); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleEnroll = async (student: Student, courseId: string) => {
    try {
      const { enrollment } = await api.post<{ enrollment: EnrollmentRecord & { course: CourseRef } }>(
        '/enrollments/admin/enroll',
        { userId: student.id, courseId }
      );
      setStudents((prev) => prev.map((s) =>
        s.id === student.id
          ? { ...s, enrollments: [enrollment, ...s.enrollments.filter((e) => e.course.id !== courseId)] }
          : s
      ));
    } catch { /* silent */ }
  };

  const handleRemove = async (studentId: string, enrollmentId: string) => {
    if (!confirm('Remove this enrollment?')) return;
    setRemoving(enrollmentId);
    try {
      await api.delete(`/enrollments/admin/${enrollmentId}`);
      setStudents((prev) => prev.map((s) =>
        s.id === studentId
          ? { ...s, enrollments: s.enrollments.filter((e) => e.id !== enrollmentId) }
          : s
      ));
    } catch { /* silent */ }
    finally { setRemoving(null); }
  };

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Student Management</h1>
          <p className="text-sm text-muted-foreground mt-1">{students.length} students · Manage course enrollments</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search students…"
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-border rounded-xl outline-none focus:border-[#023064]"
        />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-16 flex flex-col items-center text-center">
          <Users className="w-10 h-10 text-slate-200 mb-3" />
          <p className="font-semibold text-foreground mb-1">No students found</p>
          <p className="text-sm text-muted-foreground">Try a different search term</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((student) => {
            const expanded = expandedId === student.id;
            return (
              <div key={student.id} className="bg-card border border-border rounded-2xl overflow-hidden">
                {/* Student row */}
                <div
                  className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-muted/20 transition-colors"
                  onClick={() => setExpandedId(expanded ? null : student.id)}
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#023064] to-blue-600 flex items-center justify-center shrink-0 overflow-hidden">
                    {student.image
                      ? <img src={student.image} alt={student.name} className="w-full h-full object-cover" />
                      : <UserCircle className="w-6 h-6 text-white/80" />
                    }
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm">{student.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{student.email}</p>
                  </div>

                  {/* Enrollment count */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <BookOpen className="w-3.5 h-3.5" />
                      {student.enrollments.length} course{student.enrollments.length !== 1 ? 's' : ''}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); setEnrollingFor(student); }}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-[#023064] text-white rounded-lg hover:bg-[#012550] transition-all"
                    >
                      <Plus className="w-3 h-3" /> Add Course
                    </button>
                    {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </div>

                {/* Enrollments table */}
                {expanded && (
                  <div className="border-t border-slate-50">
                    {student.enrollments.length === 0 ? (
                      <div className="py-8 flex flex-col items-center text-center">
                        <AlertCircle className="w-6 h-6 text-slate-200 mb-2" />
                        <p className="text-sm text-muted-foreground">Not enrolled in any courses yet</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-50">
                        {student.enrollments.map((e) => (
                          <div key={e.id} className="flex items-center gap-4 px-5 py-3 hover:bg-muted/10">
                            {/* Course info */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{e.course.title}</p>
                              {e.course.category && (
                                <p className="text-xs text-muted-foreground">{e.course.category}</p>
                              )}
                            </div>

                            {/* Progress */}
                            <div className="w-24 shrink-0">
                              <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                                <span>Progress</span>
                                <span>{Math.round(e.progressPercent)}%</span>
                              </div>
                              <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-[#023064] rounded-full" style={{ width: `${Math.round(e.progressPercent)}%` }} />
                              </div>
                            </div>

                            {/* Status badge */}
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${enrollStatusCls[e.status] ?? 'bg-slate-50 text-muted-foreground border border-slate-100'}`}>
                              {e.status === 'ACTIVE' ? 'Active' : e.status === 'COMPLETED' ? 'Completed' : e.status === 'SUSPENDED' ? 'Suspended' : 'Dropped'}
                            </span>

                            {/* Started */}
                            <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                              <Clock className="w-3 h-3" />
                              {new Date(e.startedAt).toLocaleDateString('en-UG', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>

                            {/* Remove */}
                            <button
                              onClick={() => handleRemove(student.id, e.id)}
                              disabled={removing === e.id}
                              className="shrink-0 text-slate-300 hover:text-red-400 transition-colors disabled:opacity-40"
                              title="Remove enrollment"
                            >
                              {removing === e.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Enroll modal */}
      {enrollingFor && (
        <EnrollModal
          student={enrollingFor}
          courses={courses}
          onEnroll={(courseId) => handleEnroll(enrollingFor, courseId)}
          onClose={() => setEnrollingFor(null)}
        />
      )}
    </div>
  );
}
