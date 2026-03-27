import { useState, useEffect, useRef } from 'react';
import {
  Plus, Users, Clock, Layers, Trash2, UserCog, X, ChevronDown,
  AlertTriangle, GraduationCap, Pencil, Camera, Loader2,
  Globe, ShieldCheck, Network, Database, Brain, BookOpen,
} from 'lucide-react';
import { api } from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Teacher {
  id: string;
  name: string | null;
  email: string;
  image?: string | null;
}

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string | null;
  price: number;
  currency: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  duration: string | null;
  level: string | null;
  category: string | null;
  teacher: Teacher;
  _count: { enrollments: number; sections: number };
}

interface CourseForm {
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  price: string;
  currency: string;
  status: string;
  teacherId: string;
  coverImage: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = ['Web Development', 'Cybersecurity', 'Networking', 'Data', 'AI', 'Other'];
const LEVELS     = ['Beginner', 'Intermediate', 'Advanced'];
const STATUSES   = ['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const;

const STATUS_NEXT: Record<string, 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'> = {
  DRAFT: 'PUBLISHED', PUBLISHED: 'ARCHIVED', ARCHIVED: 'DRAFT',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatUGX(amount: number, currency: string) {
  if (currency === 'UGX') return `UGX ${amount.toLocaleString('en-UG')}`;
  return `${currency} ${amount.toLocaleString()}`;
}

function initials(name: string | null) {
  if (!name) return '?';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

// Category → gradient + icon
const categoryConfig: Record<string, { gradient: string; Icon: React.ElementType }> = {
  'Web Development': { gradient: 'from-blue-500 to-indigo-600',    Icon: Globe       },
  Cybersecurity:     { gradient: 'from-red-500 to-rose-600',       Icon: ShieldCheck },
  Networking:        { gradient: 'from-teal-500 to-cyan-600',      Icon: Network     },
  Data:              { gradient: 'from-violet-500 to-purple-600',  Icon: Database    },
  AI:                { gradient: 'from-amber-500 to-orange-600',   Icon: Brain       },
  Other:             { gradient: 'from-slate-400 to-slate-600',    Icon: BookOpen    },
};

function getCategoryConfig(category: string | null) {
  return categoryConfig[category ?? ''] ?? { gradient: 'from-primary-blue to-blue-800', Icon: BookOpen };
}

const statusBadge: Record<string, string> = {
  PUBLISHED: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  DRAFT:     'bg-amber-100  text-amber-700  border border-amber-200',
  ARCHIVED:  'bg-slate-100  text-muted-foreground  border border-border',
};
const statusLabel: Record<string, string> = {
  PUBLISHED: 'Published', DRAFT: 'Draft', ARCHIVED: 'Archived',
};

const BLANK_FORM: CourseForm = {
  title: '', description: '', category: '', level: 'Beginner',
  duration: '', price: '0', currency: 'UGX', status: 'DRAFT', teacherId: '', coverImage: '',
};

// ─── Skeleton ────────────────────────────────────────────────────────────────

function CourseSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
      <div className="h-28 bg-muted" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="h-3 bg-muted rounded w-full" />
        <div className="flex gap-2 pt-2">
          <div className="h-8 bg-muted rounded-xl flex-1" />
          <div className="h-8 w-9 bg-muted rounded-xl" />
          <div className="h-8 w-9 bg-muted rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ─── Modal field helpers ──────────────────────────────────────────────────────

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-medium text-foreground mb-1.5">
      {children}{required && <span className="text-primary-red ml-0.5">*</span>}
    </label>
  );
}

function ModalInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue"
    />
  );
}

function ModalSelect({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return (
    <div className="relative">
      <select
        {...props}
        className="w-full appearance-none px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue pr-8"
      >
        {children}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function AdminCoursesPage() {
  const [courses, setCourses]     = useState<Course[]>([]);
  const [teachers, setTeachers]   = useState<Teacher[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);

  // Create modal
  const [showCreate, setShowCreate]     = useState(false);
  const [creating, setCreating]         = useState(false);
  const [createError, setCreateError]   = useState<string | null>(null);
  const [createForm, setCreateForm]     = useState<CourseForm>(BLANK_FORM);

  // Edit modal
  const [editCourse, setEditCourse]     = useState<Course | null>(null);
  const [editForm, setEditForm]         = useState<CourseForm>(BLANK_FORM);
  const [saving, setSaving]             = useState(false);
  const [editError, setEditError]       = useState<string | null>(null);

  // Assign teacher modal
  const [assignCourse, setAssignCourse]         = useState<Course | null>(null);
  const [assignTeacherId, setAssignTeacherId]   = useState('');
  const [assigning, setAssigning]               = useState(false);

  // Delete confirm
  const [deleteCourse, setDeleteCourse] = useState<Course | null>(null);
  const [deleting, setDeleting]         = useState(false);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const loadCourses = () => {
    setLoading(true);
    setError(null);
    api.get<{ courses: Course[] }>('/courses')
      .then(({ courses }) => setCourses(courses))
      .catch((err) => setError(err.message ?? 'Failed to load courses'))
      .finally(() => setLoading(false));
  };

  const loadTeachers = () => {
    api.get<{ users: Array<{ id: string; name: string | null; email: string; image: string | null; role: string }> }>('/users?role=TEACHER')
      .then(({ users }) => setTeachers(users.map((u) => ({ id: u.id, name: u.name, email: u.email, image: u.image }))))
      .catch(() => null);
  };

  useEffect(() => { loadCourses(); loadTeachers(); }, []);

  // ── Create ────────────────────────────────────────────────────────────────
  const handleCreate = async () => {
    if (!createForm.title.trim())       { setCreateError('Title is required'); return; }
    if (!createForm.description.trim()) { setCreateError('Description is required'); return; }
    if (!createForm.teacherId)          { setCreateError('Please select a teacher'); return; }

    setCreating(true); setCreateError(null);
    try {
      const { course } = await api.post<{ course: Course }>('/courses', {
        title:       createForm.title.trim(),
        description: createForm.description.trim(),
        category:    createForm.category || null,
        level:       createForm.level || null,
        duration:    createForm.duration || null,
        price:       Number(createForm.price) || 0,
        currency:    createForm.currency,
        status:      createForm.status,
        teacherId:   createForm.teacherId,
        coverImage:  createForm.coverImage || null,
      });
      setCourses((prev) => [course, ...prev]);
      setShowCreate(false);
      setCreateForm(BLANK_FORM);
    } catch (err: unknown) {
      setCreateError((err as Error).message ?? 'Failed to create course');
    } finally {
      setCreating(false);
    }
  };

  // ── Edit ──────────────────────────────────────────────────────────────────
  const openEdit = (course: Course) => {
    setEditCourse(course);
    setEditForm({
      title:       course.title,
      description: course.description,
      category:    course.category ?? '',
      level:       course.level ?? 'Beginner',
      duration:    course.duration ?? '',
      price:       String(course.price),
      currency:    course.currency,
      status:      course.status,
      teacherId:   course.teacher.id,
      coverImage:  course.coverImage ?? '',
    });
    setEditError(null);
  };

  const handleSave = async () => {
    if (!editCourse) return;
    if (!editForm.title.trim())       { setEditError('Title is required'); return; }
    if (!editForm.description.trim()) { setEditError('Description is required'); return; }

    setSaving(true); setEditError(null);
    try {
      const { course: updated } = await api.patch<{ course: Course }>(`/courses/${editCourse.id}`, {
        title:       editForm.title.trim(),
        description: editForm.description.trim(),
        category:    editForm.category || null,
        level:       editForm.level || null,
        duration:    editForm.duration || null,
        price:       Number(editForm.price) || 0,
        currency:    editForm.currency,
        status:      editForm.status,
        coverImage:  editForm.coverImage || null,
      });
      setCourses((prev) => prev.map((c) => (c.id === updated.id ? { ...updated, _count: c._count } : c)));
      setEditCourse(null);
    } catch (err: unknown) {
      setEditError((err as Error).message ?? 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  // ── Cycle status ──────────────────────────────────────────────────────────
  const cycleStatus = async (course: Course) => {
    const nextStatus = STATUS_NEXT[course.status];
    try {
      const { course: updated } = await api.patch<{ course: Course }>(`/courses/${course.id}`, { status: nextStatus });
      setCourses((prev) => prev.map((c) => (c.id === updated.id ? { ...updated, _count: c._count } : c)));
    } catch { /* silently fail */ }
  };

  // ── Assign teacher ────────────────────────────────────────────────────────
  const handleAssign = async () => {
    if (!assignCourse || !assignTeacherId) return;
    setAssigning(true);
    try {
      const { course: updated } = await api.patch<{ course: Course }>(
        `/courses/${assignCourse.id}/assign`, { teacherId: assignTeacherId }
      );
      setCourses((prev) => prev.map((c) => (c.id === updated.id ? { ...updated, _count: c._count } : c)));
      setAssignCourse(null); setAssignTeacherId('');
    } catch { /* silently fail */ } finally {
      setAssigning(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteCourse) return;
    setDeleting(true);
    try {
      await api.delete(`/courses/${deleteCourse.id}`);
      setCourses((prev) => prev.filter((c) => c.id !== deleteCourse.id));
      setDeleteCourse(null);
    } catch { /* silently fail */ } finally {
      setDeleting(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 max-w-7xl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Courses</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {loading ? 'Loading…' : `${courses.length} course${courses.length !== 1 ? 's' : ''} total`}
          </p>
        </div>
        <button
          onClick={() => { setShowCreate(true); setCreateError(null); setCreateForm(BLANK_FORM); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-red text-white text-sm font-semibold rounded-xl hover:bg-rose-700 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Course
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
          <button onClick={loadCourses} className="ml-auto text-xs font-semibold text-red-700 hover:underline">Retry</button>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1,2,3,4,5,6].map((i) => <CourseSkeleton key={i} />)}
        </div>
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <GraduationCap className="w-14 h-14 text-muted-foreground mb-4 opacity-40" />
          <p className="font-semibold text-foreground mb-1">No courses yet</p>
          <p className="text-sm text-muted-foreground mb-5">Create the first course to get started.</p>
          <button
            onClick={() => { setShowCreate(true); setCreateError(null); }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-red text-white text-sm font-semibold rounded-xl hover:bg-rose-700"
          >
            <Plus className="w-4 h-4" /> Add Course
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {courses.map((course) => {
            const { gradient, Icon } = getCategoryConfig(course.category);
            return (
              <div key={course.id} className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition-all group flex flex-col">

                {/* Cover */}
                <div className={`h-28 bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden`}>
                  {course.coverImage
                    ? <img src={course.coverImage} alt={course.title} className="absolute inset-0 w-full h-full object-cover" />
                    : <Icon className="w-12 h-12 text-white/80" />
                  }
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => cycleStatus(course)}
                      title="Click to cycle status"
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold cursor-pointer hover:opacity-80 transition-opacity ${statusBadge[course.status]}`}
                    >
                      {statusLabel[course.status]}
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-heading font-semibold text-foreground mb-0.5 group-hover:text-primary-blue transition-colors line-clamp-2 leading-snug">
                    {course.title}
                  </h3>

                  <div className="flex items-center gap-2 mt-1 mb-3">
                    <div className="w-6 h-6 rounded-lg bg-primary-blue flex items-center justify-center shrink-0">
                      <span className="text-white text-[10px] font-bold">{initials(course.teacher.name)}</span>
                    </div>
                    <span className="text-xs text-muted-foreground truncate">{course.teacher.name ?? course.teacher.email}</span>
                    {course.category && (
                      <span className="ml-auto text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full shrink-0">
                        {course.category}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground border-t border-border pt-3 mb-4">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> {course._count.enrollments}
                    </span>
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5" /> {course._count.sections}
                    </span>
                    {course.duration && (
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.duration}</span>
                    )}
                  </div>

                  <p className="text-sm font-bold text-foreground mb-4">
                    {course.price === 0 ? 'Free' : formatUGX(course.price, course.currency)}
                  </p>

                  {/* Actions */}
                  <div className="mt-auto flex items-center gap-2">
                    <button
                      onClick={() => openEdit(course)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-primary-blue/10 text-primary-blue text-xs font-semibold hover:bg-primary-blue/20 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => { setAssignCourse(course); setAssignTeacherId(course.teacher.id); }}
                      className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl border border-border text-xs font-medium text-foreground hover:bg-muted/50 transition-colors"
                      title="Assign Teacher"
                    >
                      <UserCog className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteCourse(course)}
                      className="w-9 h-9 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Create Modal ──────────────────────────────────────────────────────── */}
      {showCreate && (
        <CourseModal
          title="Create Course"
          form={createForm}
          setField={(k, v) => setCreateForm((p) => ({ ...p, [k]: v }))}
          teachers={teachers}
          error={createError}
          saving={creating}
          saveLabel="Create Course"
          onSave={handleCreate}
          onClose={() => setShowCreate(false)}
        />
      )}

      {/* ── Edit Modal ────────────────────────────────────────────────────────── */}
      {editCourse && (
        <CourseModal
          title={`Edit, ${editCourse.title}`}
          form={editForm}
          setField={(k, v) => setEditForm((p) => ({ ...p, [k]: v }))}
          teachers={teachers}
          error={editError}
          saving={saving}
          saveLabel="Save Changes"
          onSave={handleSave}
          onClose={() => setEditCourse(null)}
          hideTeacher
        />
      )}

      {/* ── Assign Teacher Modal ─────────────────────────────────────────────── */}
      {assignCourse && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl border border-border w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-foreground">Assign Teacher</h2>
              <button onClick={() => setAssignCourse(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mb-4 line-clamp-1">
              Course: <span className="font-medium text-foreground">{assignCourse.title}</span>
            </p>
            <ModalSelect value={assignTeacherId} onChange={(e) => setAssignTeacherId(e.target.value)} className="mb-5">
              <option value="">— Select a teacher —</option>
              {teachers.map((t) => <option key={t.id} value={t.id}>{t.name ?? t.email}</option>)}
            </ModalSelect>
            <div className="flex gap-3">
              <button onClick={() => setAssignCourse(null)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted/50">Cancel</button>
              <button onClick={handleAssign} disabled={!assignTeacherId || assigning} className="flex-1 py-2.5 bg-primary-blue text-white text-sm font-semibold rounded-xl hover:bg-blue-900 disabled:opacity-50">
                {assigning ? 'Saving…' : 'Assign'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ───────────────────────────────────────────────────── */}
      {deleteCourse && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl border border-border w-full max-w-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h2 className="font-heading font-semibold text-foreground">Delete Course</h2>
                <p className="text-xs text-muted-foreground">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-foreground mb-5">
              Are you sure you want to delete <span className="font-semibold">"{deleteCourse.title}"</span>? All enrollments and sections will also be removed.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteCourse(null)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted/50">Cancel</button>
              <button onClick={handleDelete} disabled={deleting} className="flex-1 py-2.5 bg-primary-red text-white text-sm font-semibold rounded-xl hover:bg-rose-700 disabled:opacity-50">
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Shared Create/Edit Modal ─────────────────────────────────────────────────

function CourseModal({
  title, form, setField, teachers, error, saving, saveLabel, onSave, onClose, hideTeacher,
}: {
  title: string;
  form: CourseForm;
  setField: (k: keyof CourseForm, v: string) => void;
  teachers: Teacher[];
  error: string | null;
  saving: boolean;
  saveLabel: string;
  onSave: () => void;
  onClose: () => void;
  hideTeacher?: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${import.meta.env.VITE_API_URL ?? ''}/api/upload/cover`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: formData,
      });
      const data = await res.json();
      if (data.url) setField('coverImage', data.url);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const { gradient, Icon } = getCategoryConfig(form.category);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-card rounded-2xl border border-border w-full max-w-lg my-4">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
          <h2 className="font-heading font-semibold text-foreground line-clamp-1">{title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground shrink-0 ml-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-sm text-red-700">{error}</div>
          )}

          {/* Cover image */}
          <div>
            <Label>Cover Image</Label>
            <div className={`relative h-28 rounded-xl overflow-hidden bg-gradient-to-br ${gradient} flex items-center justify-center`}>
              {form.coverImage
                ? <img src={form.coverImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
                : <Icon className="w-10 h-10 text-white/60" />
              }
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-1 bg-black/0 hover:bg-black/30 transition-all group"
              >
                {uploading
                  ? <Loader2 className="w-6 h-6 text-white animate-spin" />
                  : <>
                      <Camera className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                        {form.coverImage ? 'Change image' : 'Upload image'}
                      </span>
                    </>
                }
              </button>
              {form.coverImage && (
                <button
                  type="button"
                  onClick={() => setField('coverImage', '')}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-all"
                >
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
          </div>

          <div>
            <Label required>Course Title</Label>
            <ModalInput value={form.title} onChange={(e) => setField('title', e.target.value)} placeholder="e.g. Web Development Fundamentals" />
          </div>

          <div>
            <Label required>Description</Label>
            <textarea
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
              rows={3}
              placeholder="Brief description of the course…"
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Category</Label>
              <ModalSelect value={form.category} onChange={(e) => setField('category', e.target.value)}>
                <option value="">— Select —</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </ModalSelect>
            </div>
            <div>
              <Label>Level</Label>
              <ModalSelect value={form.level} onChange={(e) => setField('level', e.target.value)}>
                {['Beginner', 'Intermediate', 'Advanced'].map((l) => <option key={l} value={l}>{l}</option>)}
              </ModalSelect>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Duration</Label>
              <ModalInput value={form.duration} onChange={(e) => setField('duration', e.target.value)} placeholder="e.g. 3 months" />
            </div>
            <div>
              <Label>Price</Label>
              <ModalInput type="number" min="0" value={form.price} onChange={(e) => setField('price', e.target.value)} />
            </div>
            <div>
              <Label>Currency</Label>
              <ModalSelect value={form.currency} onChange={(e) => setField('currency', e.target.value)}>
                <option value="UGX">UGX</option>
                <option value="USD">USD</option>
              </ModalSelect>
            </div>
          </div>

          <div className={`grid gap-3 ${hideTeacher ? 'grid-cols-1' : 'grid-cols-2'}`}>
            <div>
              <Label>Status</Label>
              <ModalSelect value={form.status} onChange={(e) => setField('status', e.target.value)}>
                {STATUSES.map((s) => <option key={s} value={s}>{statusLabel[s]}</option>)}
              </ModalSelect>
            </div>
            {!hideTeacher && (
              <div>
                <Label required>Teacher</Label>
                <ModalSelect value={form.teacherId} onChange={(e) => setField('teacherId', e.target.value)}>
                  <option value="">— Select —</option>
                  {teachers.map((t) => <option key={t.id} value={t.id}>{t.name ?? t.email}</option>)}
                </ModalSelect>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 pb-6 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted/50">
            Cancel
          </button>
          <button onClick={onSave} disabled={saving} className="px-5 py-2.5 bg-primary-blue text-white text-sm font-semibold rounded-xl hover:bg-blue-900 disabled:opacity-50">
            {saving ? 'Saving…' : saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
