import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, Clock, CheckCircle, Globe, ShieldCheck, Network, Database, Brain,
  Plus, Loader2, Rocket, X, CreditCard, UploadCloud, Paperclip, ChevronRight, Check,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';

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

function formatUGX(n: number) {
  return new Intl.NumberFormat('en-UG').format(n) + ' UGX';
}

interface FreeCourse {
  id: string; title: string; description: string | null; category: string | null;
  duration: string | null; level: string | null; coverImage: string | null;
  price: number;
  _count: { sections: number }; teacher: { id: string; name: string };
}

interface PaidCourse {
  id: string; title: string; description: string | null; category: string | null;
  duration: string | null; level: string | null; coverImage: string | null;
  price: number;
  _count: { sections: number }; teacher: { id: string; name: string };
}

interface Enrollment {
  id: string; status: string; progressPercent: number; startedAt: string; completedAt: string | null;
  course: {
    id: string; title: string; category: string | null; duration: string | null;
    level: string | null; coverImage: string | null;
    _count: { sections: number }; teacher: { id: string; name: string };
  };
}

// ── Pay for Course Modal ───────────────────────────────────────────────────────

function PayModal({
  course,
  onClose,
  onSuccess,
}: {
  course: PaidCourse;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [proofUrl, setProofUrl] = useState('');
  const [proofName, setProofName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setUploading(true); setUploadError('');
    try {
      const token = localStorage.getItem('token');
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`${import.meta.env.VITE_API_URL ?? ''}/api/upload/submission`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json() as { url: string };
      setProofUrl(data.url);
      setProofName(file.name);
    } catch {
      setUploadError('Upload failed. Please try again.');
    } finally { setUploading(false); }
  };

  const handleSubmit = async () => {
    if (!proofUrl) return;
    setSubmitting(true);
    try {
      await api.post('/enrollments/request-enroll', { courseId: course.id });
      setDone(true);
      setTimeout(() => { onSuccess(); }, 2000);
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-card rounded-2xl shadow-xl w-full max-w-lg my-4">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-heading font-bold text-foreground text-sm">Enrol in Course</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {done ? (
          <div className="py-16 flex flex-col items-center text-center px-8">
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
              <Check className="w-7 h-7 text-emerald-500" />
            </div>
            <p className="font-heading font-bold text-foreground text-lg mb-1">Enrolled!</p>
            <p className="text-sm text-muted-foreground">You've been successfully enrolled in <span className="font-semibold text-foreground">{course.title}</span>.</p>
          </div>
        ) : (
          <div className="p-5 space-y-5">

            {/* Invoice */}
            <div className="bg-muted/40 rounded-xl p-4 border border-border">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">Invoice Summary</p>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground leading-snug">{course.title}</p>
                  {course.category && <p className="text-xs text-muted-foreground mt-0.5">{course.category}</p>}
                  <p className="text-xs text-muted-foreground">Instructor: {course.teacher.name}</p>
                </div>
                <p className="text-sm font-bold text-foreground shrink-0">{formatUGX(course.price)}</p>
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="text-xs font-bold text-foreground">Total</span>
                <span className="text-sm font-bold text-[#023064]">{formatUGX(course.price)}</span>
              </div>
            </div>

            {/* Payment methods */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Payment Methods</p>
              <div className="bg-card border border-border rounded-xl p-4 space-y-3 text-sm">
                <div>
                  <p className="text-xs font-semibold text-foreground mb-1">Mobile Money</p>
                  <p className="text-xs text-muted-foreground">MTN: <span className="font-mono font-semibold text-foreground">+256 779 367 005</span></p>
                  <p className="text-xs text-muted-foreground">Airtel: <span className="font-mono font-semibold text-foreground">+256 706 911 732</span></p>
                </div>
                <div className="border-t border-border pt-3">
                  <p className="text-xs font-semibold text-foreground mb-1">Bank Transfer — Stanbic Bank</p>
                  <p className="text-xs text-muted-foreground">Account: <span className="font-mono font-semibold text-foreground">9030022482490</span></p>
                  <p className="text-xs text-muted-foreground">Name: <span className="font-semibold text-foreground">Keneth Sansa Aponye</span></p>
                  <p className="text-xs text-muted-foreground">Branch: Aponye</p>
                </div>
              </div>
            </div>

            {/* Upload proof */}
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Payment Proof</p>
              <p className="text-xs text-muted-foreground mb-3">
                After paying, take a screenshot and upload it below to confirm your enrollment.
              </p>

              <input ref={fileRef} type="file" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />

              {proofUrl ? (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-muted/40">
                  <Paperclip className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="flex-1 truncate text-sm text-foreground">{proofName}</span>
                  <button onClick={() => { setProofUrl(''); setProofName(''); }} className="text-muted-foreground hover:text-red-400 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-border hover:border-[#023064]/40 text-xs font-semibold text-muted-foreground hover:text-[#023064] transition-all disabled:opacity-50"
                >
                  {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
                  {uploading ? 'Uploading…' : 'Upload payment screenshot'}
                </button>
              )}
              {uploadError && <p className="text-xs text-red-500 mt-1">{uploadError}</p>}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!proofUrl || submitting}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#023064] text-white text-sm font-semibold hover:bg-[#012550] disabled:opacity-50 transition-all"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
              {submitting ? 'Processing…' : 'Confirm Enrolment'}
            </button>

            <p className="text-[11px] text-center text-muted-foreground">
              By confirming, you acknowledge that Cyberteks-IT will verify your payment and activate your course access.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function StudentCoursesPage() {
  const { t } = useLanguage();
  const d = t.lms.student.courses;

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [freeCourses, setFreeCourses]  = useState<FreeCourse[]>([]);
  const [paidCourses, setPaidCourses]  = useState<PaidCourse[]>([]);
  const [loading, setLoading]          = useState(true);
  const [enrollingId, setEnrollingId]  = useState<string | null>(null);
  const [payModalCourse, setPayModalCourse] = useState<PaidCourse | null>(null);

  const loadAll = () => {
    setLoading(true);
    Promise.all([
      api.get<{ enrollments: Enrollment[] }>('/enrollments'),
      api.get<{ freeCourses: FreeCourse[] }>('/enrollments/free-courses'),
      api.get<{ paidCourses: PaidCourse[] }>('/enrollments/paid-courses'),
    ])
      .then(([{ enrollments }, { freeCourses }, { paidCourses }]) => {
        setEnrollments(enrollments);
        setFreeCourses(freeCourses);
        setPaidCourses(paidCourses);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadAll(); }, []);

  const handleSelfEnroll = async (courseId: string) => {
    setEnrollingId(courseId);
    try { await api.post('/enrollments/self-enroll', { courseId }); loadAll(); }
    catch { /* silent */ }
    finally { setEnrollingId(null); }
  };

  const statusCls: Record<string, string> = {
    ACTIVE:    'bg-blue-100 text-blue-700 border border-blue-200',
    COMPLETED: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    SUSPENDED: 'bg-red-100 text-red-700 border border-red-200',
    DROPPED:   'bg-muted text-muted-foreground border border-border',
  };

  const statusLabel: Record<string, string> = {
    ACTIVE:    t.lms.status.inProgress,
    COMPLETED: t.lms.status.completed,
    SUSPENDED: t.lms.status.suspended,
    DROPPED:   'Dropped',
  };

  if (loading) {
    return (
      <div className="space-y-4 max-w-6xl">
        <div className="h-8 w-48 bg-slate-100 rounded animate-pulse" />
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
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">{d.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{enrollments.length} {d.enrolled}</p>
        </div>
        {/* Pay for Another Course button */}
        {paidCourses.length > 0 && (
          <button
            onClick={() => setPayModalCourse(paidCourses[0])}
            className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E11D48] text-white text-xs font-semibold hover:bg-rose-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Pay for Another Course
          </button>
        )}
      </div>

      {/* Enrolled courses */}
      {enrollments.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-16 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-primary-blue" />
          </div>
          <p className="font-heading font-semibold text-foreground mb-1">No courses yet</p>
          <p className="text-sm text-muted-foreground max-w-xs">
            You haven't been enrolled in any courses yet. Check out the free and paid courses below!
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {enrollments.map((e) => {
            const progress = Math.round(e.progressPercent);
            const isCompleted = e.status === 'COMPLETED';
            const { gradient, Icon } = getCategoryConfig(e.course.category);
            return (
              <div key={e.id} className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition-all group flex flex-col">
                <div className={`h-28 bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden`}>
                  {e.course.coverImage
                    ? <img src={e.course.coverImage} alt={e.course.title} className="absolute inset-0 w-full h-full object-cover" />
                    : isCompleted
                    ? <CheckCircle className="w-12 h-12 text-white/80" />
                    : <Icon className="w-12 h-12 text-white/80" />
                  }
                  <div className="absolute top-3 right-3">
                    <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${statusCls[e.status] ?? 'bg-slate-100 text-muted-foreground'}`}>
                      {statusLabel[e.status] ?? e.status}
                    </span>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 h-1 bg-black/20">
                    <div className="h-full bg-card/70 transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-heading font-semibold text-foreground mb-1 group-hover:text-primary-blue transition-colors leading-snug line-clamp-2">
                    {e.course.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {e.course.teacher.name}
                    {e.course.category ? ` · ${e.course.category}` : ''}
                    {e.course.level ? ` · ${e.course.level}` : ''}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                    <span>{e.course._count.sections} weeks</span>
                    <span className="font-semibold text-foreground">{progress}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-4">
                    <div className="h-full rounded-full bg-primary-blue transition-all" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                    {e.course.duration && (
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {e.course.duration}</span>
                    )}
                    <span>Started {new Date(e.startedAt).toLocaleDateString('en-UG', { month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="mt-auto">
                    {!isCompleted ? (
                      <Link
                        to={`/student/courses/${e.course.id}`}
                        className="flex items-center justify-center w-full py-2.5 text-xs font-semibold bg-primary-blue text-white rounded-xl hover:bg-blue-900 transition-colors"
                      >
                        {d.continue}
                      </Link>
                    ) : (
                      <Link
                        to={`/student/courses/${e.course.id}`}
                        className="flex items-center justify-center w-full py-2.5 text-xs font-semibold border border-border text-muted-foreground rounded-xl hover:bg-muted/50 transition-colors"
                      >
                        {d.review}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Free courses */}
      {freeCourses.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Rocket className="w-4 h-4 text-[#E11D48]" />
            <h2 className="font-heading text-base font-bold text-foreground">Free Courses Available</h2>
            <span className="text-xs bg-[#E11D48]/10 text-[#E11D48] font-semibold px-2 py-0.5 rounded-full">Free</span>
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {freeCourses.map((c) => {
              const { gradient, Icon } = getCategoryConfig(c.category);
              const isEnrolling = enrollingId === c.id;
              return (
                <div key={c.id} className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col hover:shadow-md transition-all">
                  <div className={`h-28 bg-gradient-to-br ${gradient} flex items-center justify-center relative`}>
                    {c.coverImage
                      ? <img src={c.coverImage} alt={c.title} className="absolute inset-0 w-full h-full object-cover" />
                      : <Icon className="w-12 h-12 text-white/80" />}
                    <span className="absolute top-3 left-3 text-[10px] font-bold bg-[#E11D48] text-white px-2 py-0.5 rounded-full uppercase tracking-wide">Free</span>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-heading font-semibold text-foreground mb-1 leading-snug line-clamp-2">{c.title}</h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      {c.teacher.name}{c.category ? ` · ${c.category}` : ''}{c.level ? ` · ${c.level}` : ''}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                      <span>{c._count.sections} weeks</span>
                      {c.duration && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{c.duration}</span>}
                    </div>
                    <div className="mt-auto">
                      <button
                        onClick={() => handleSelfEnroll(c.id)}
                        disabled={isEnrolling}
                        className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-semibold bg-[#E11D48] text-white rounded-xl hover:bg-rose-700 transition-colors disabled:opacity-60"
                      >
                        {isEnrolling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                        Add to My Courses
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Paid courses */}
      {paidCourses.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#023064]" />
            <h2 className="font-heading text-base font-bold text-foreground">Paid Courses</h2>
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {paidCourses.map((c) => {
              const { gradient, Icon } = getCategoryConfig(c.category);
              return (
                <div key={c.id} className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col hover:shadow-md transition-all">
                  <div className={`h-28 bg-gradient-to-br ${gradient} flex items-center justify-center relative`}>
                    {c.coverImage
                      ? <img src={c.coverImage} alt={c.title} className="absolute inset-0 w-full h-full object-cover" />
                      : <Icon className="w-12 h-12 text-white/80" />}
                    <span className="absolute top-3 left-3 text-[10px] font-bold bg-[#023064] text-white px-2 py-0.5 rounded-full uppercase tracking-wide">
                      {formatUGX(c.price)}
                    </span>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-heading font-semibold text-foreground mb-1 leading-snug line-clamp-2">{c.title}</h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      {c.teacher.name}{c.category ? ` · ${c.category}` : ''}{c.level ? ` · ${c.level}` : ''}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                      <span>{c._count.sections} weeks</span>
                      {c.duration && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{c.duration}</span>}
                    </div>
                    <div className="mt-auto">
                      <button
                        onClick={() => setPayModalCourse(c)}
                        className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-semibold bg-[#023064] text-white rounded-xl hover:bg-[#012550] transition-colors"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        Enrol — {formatUGX(c.price)}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pay modal */}
      {payModalCourse && (
        <PayModal
          course={payModalCourse}
          onClose={() => setPayModalCourse(null)}
          onSuccess={() => { setPayModalCourse(null); loadAll(); }}
        />
      )}
    </div>
  );
}
