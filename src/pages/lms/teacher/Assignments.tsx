import { useState, useEffect, useRef } from 'react';
import {
  ClipboardList, Plus, X, Calendar, Users,
  Pencil, Trash2, FileText, Clock, CheckCircle2,
  AlertCircle, BookOpen, LayoutList, Layers, Star,
  ChevronDown, MessageSquare, Award, Paperclip, Download, UploadCloud,
} from 'lucide-react';
import { api, toDownloadUrl } from '@/lib/api';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type AssignmentStatus = 'ACTIVE' | 'DRAFT' | 'PAST_DUE';
type FilterTab = 'all' | 'active' | 'past_due' | 'draft';

interface CourseOption {
  id: string;
  title: string;
}

interface Assignment {
  id: string;
  title: string;
  course: string;        // title
  courseId: string;
  description: string;
  instructions: string;
  dueDate: string;
  maxScore: number;
  status: AssignmentStatus;
  submissions: number;
  totalStudents: number;
  attachmentUrl: string | null;
  attachmentName: string | null;
}

interface AssignmentForm {
  title: string;
  courseId: string;
  description: string;
  instructions: string;
  dueDate: string;
  maxScore: number;
  status: AssignmentStatus;
  attachmentUrl: string | null;
  attachmentName: string | null;
}

interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentImage: string | null;
  content: string | null;
  fileUrl: string | null;
  fileName: string | null;
  score: number | null;
  feedback: string | null;
  status: string;
  submittedAt: string;
  gradedAt: string | null;
  maxScore: number;
}

const EMPTY_FORM: AssignmentForm = {
  title: '',
  courseId: '',
  description: '',
  instructions: '',
  dueDate: '',
  maxScore: 100,
  status: 'DRAFT',
  attachmentUrl: null,
  attachmentName: null,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function dueDateBadge(dateStr: string) {
  const due = new Date(dateStr);
  const now = new Date();
  const diffMs = due.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffMs < 0)
    return { label: 'Past Due', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
  if (diffDays <= 3)
    return { label: 'Due Soon', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' };
  return { label: 'Upcoming', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-UG', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const statusConfig: Record<AssignmentStatus, { label: string; bg: string; text: string; border: string; icon: React.ElementType }> = {
  ACTIVE:   { label: 'Active',   bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200',    icon: CheckCircle2 },
  DRAFT:    { label: 'Draft',    bg: 'bg-slate-100',  text: 'text-slate-600',   border: 'border-slate-200',   icon: FileText },
  PAST_DUE: { label: 'Past Due', bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200',     icon: AlertCircle },
};

// ─── Grading Panel ─────────────────────────────────────────────────────────

function GradeModal({
  submission,
  maxScore,
  onClose,
  onGraded,
}: {
  submission: Submission;
  maxScore: number;
  onClose: () => void;
  onGraded: (updated: Submission) => void;
}) {
  const [score, setScore] = useState<string>(submission.score != null ? String(submission.score) : '');
  const [feedback, setFeedback] = useState(submission.feedback ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    const s = parseFloat(score);
    if (score !== '' && (isNaN(s) || s < 0 || s > maxScore)) {
      setError(`Score must be 0–${maxScore}`);
      return;
    }
    setSaving(true);
    try {
      const { submission: updated } = await api.patch<{ submission: Submission }>(
        `/submissions/${submission.id}/grade`,
        { score: score !== '' ? s : undefined, feedback: feedback || undefined }
      );
      onGraded(updated);
    } catch {
      setError('Failed to save grade');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div>
              <h3 className="font-heading font-bold text-foreground">Grade Submission</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{submission.studentName}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-6 py-4 space-y-4">
            {/* Student's answer */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Student's Submission</p>
              <div className="bg-muted/60 rounded-xl p-3 text-sm text-foreground leading-relaxed min-h-[60px]">
                {submission.content || <span className="text-muted-foreground italic">No text submitted</span>}
              </div>
              {submission.fileUrl && (
                <a
                  href={toDownloadUrl(submission.fileUrl, submission.fileName)}
                  className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-background text-xs font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <Paperclip className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="truncate max-w-[220px]">{submission.fileName ?? 'Attached file'}</span>
                  <Download className="w-3 h-3 text-muted-foreground ml-auto shrink-0" />
                </a>
              )}
              <p className="text-[11px] text-muted-foreground mt-1">Submitted {timeAgo(submission.submittedAt)}</p>
            </div>

            {/* Score */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                Score <span className="normal-case font-normal">(max: {maxScore})</span>
              </label>
              <input
                type="number"
                min={0}
                max={maxScore}
                value={score}
                onChange={(e) => { setScore(e.target.value); setError(''); }}
                placeholder={`0 – ${maxScore}`}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition"
              />
            </div>

            {/* Feedback */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Feedback</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={3}
                placeholder="Optional feedback for the student..."
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition resize-none"
              />
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>

          <div className="px-6 py-4 border-t border-border flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-border text-muted-foreground hover:bg-muted transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-primary-blue text-white hover:bg-blue-900 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving ? (
                <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving...</>
              ) : (
                <><Award className="w-4 h-4" /> Save Grade</>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Submissions Panel ────────────────────────────────────────────────────────

function SubmissionsPanel({
  assignment,
  onClose,
}: {
  assignment: Assignment;
  onClose: () => void;
}) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState<Submission | null>(null);

  useEffect(() => {
    setLoading(true);
    api.get<{ submissions: Submission[] }>(`/submissions?assignmentId=${assignment.id}`)
      .then(({ submissions }) => setSubmissions(submissions ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [assignment.id]);

  const handleGraded = (updated: Submission) => {
    setSubmissions((prev) => prev.map((s) => s.id === updated.id ? { ...s, ...updated } : s));
    setGrading(null);
  };

  const graded = submissions.filter((s) => s.status === 'GRADED').length;
  const pending = submissions.length - graded;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-card border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <h2 className="font-heading font-bold text-foreground">{assignment.title}</h2>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-3">
              <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {assignment.course}</span>
              <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {submissions.length} submitted</span>
              {pending > 0 && <span className="text-amber-600 font-medium">{pending} pending</span>}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Summary bar */}
        {submissions.length > 0 && (
          <div className="px-6 py-3 border-b border-border flex items-center gap-4 text-xs">
            <span className="font-semibold text-foreground">{graded}/{submissions.length} graded</span>
            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{ width: `${submissions.length > 0 ? (graded / submissions.length) * 100 : 0}%` }}
              />
            </div>
            {graded === submissions.length && graded > 0 && (
              <span className="text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> All graded</span>
            )}
          </div>
        )}

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : submissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <ClipboardList className="w-7 h-7 text-muted-foreground" />
              </div>
              <h3 className="font-heading font-bold text-foreground mb-1">No submissions yet</h3>
              <p className="text-sm text-muted-foreground">Students haven't submitted this assignment yet.</p>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              {submissions.map((sub) => {
                const isGraded = sub.status === 'GRADED';
                const pct = isGraded && sub.score != null
                  ? Math.round((sub.score / assignment.maxScore) * 100) : null;

                return (
                  <div key={sub.id} className="bg-card border border-border rounded-2xl p-4 hover:shadow-sm transition-all">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-primary-blue/10 flex items-center justify-center shrink-0 text-sm font-bold text-primary-blue uppercase">
                          {sub.studentName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-foreground truncate">{sub.studentName}</p>
                          <p className="text-[11px] text-muted-foreground">{timeAgo(sub.submittedAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {isGraded && pct != null ? (
                          <span className={cn(
                            'text-xs font-bold px-2.5 py-1 rounded-full',
                            pct >= 75 ? 'bg-emerald-50 text-emerald-700' : pct >= 50 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-600'
                          )}>
                            {sub.score}/{assignment.maxScore}
                          </span>
                        ) : (
                          <span className={cn(
                            'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                            sub.status === 'LATE'
                              ? 'bg-red-50 text-red-600 border-red-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          )}>
                            {sub.status === 'LATE' ? 'Late' : 'Pending'}
                          </span>
                        )}
                        <button
                          onClick={() => setGrading(sub)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary-blue bg-primary-blue/5 hover:bg-primary-blue/10 rounded-lg transition-colors"
                        >
                          <Star className="w-3 h-3" />
                          {isGraded ? 'Edit Grade' : 'Grade'}
                        </button>
                      </div>
                    </div>
                    {sub.content && (
                      <p className="mt-2 text-xs text-muted-foreground line-clamp-2 pl-12">{sub.content}</p>
                    )}
                    {sub.feedback && isGraded && (
                      <div className="mt-2 pl-12 flex items-start gap-1.5 text-xs text-muted-foreground">
                        <MessageSquare className="w-3 h-3 mt-0.5 shrink-0" />
                        <span className="line-clamp-1">{sub.feedback}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {grading && (
        <GradeModal
          submission={grading}
          maxScore={assignment.maxScore}
          onClose={() => setGrading(null)}
          onGraded={handleGraded}
        />
      )}
    </>
  );
}

// ─── Assignment Card ──────────────────────────────────────────────────────────

function AssignmentCard({
  assignment,
  onEdit,
  onDelete,
  onViewSubmissions,
}: {
  assignment: Assignment;
  onEdit: (a: Assignment) => void;
  onDelete: (id: string) => void;
  onViewSubmissions: (a: Assignment) => void;
}) {
  const statusCfg = statusConfig[assignment.status];
  const StatusIcon = statusCfg.icon;
  const submissionPct = assignment.totalStudents > 0
    ? Math.round((assignment.submissions / assignment.totalStudents) * 100) : 0;
  const dateBadge = dueDateBadge(assignment.dueDate);

  return (
    <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-all group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5 min-w-0">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${statusCfg.bg} ${statusCfg.border}`}>
            <StatusIcon className={`w-5 h-5 ${statusCfg.text}`} />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground text-sm leading-snug truncate">{assignment.title}</h3>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <BookOpen className="w-3 h-3" /> {assignment.course}
              </span>
              <span className="text-muted-foreground/40">·</span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" /> Due {formatDate(assignment.dueDate)}
              </span>
            </div>
            {assignment.description && (
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                {assignment.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}>
            <StatusIcon className="w-3 h-3" /> {statusCfg.label}
          </span>
          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${dateBadge.bg} ${dateBadge.text} ${dateBadge.border}`}>
            <Clock className="w-2.5 h-2.5" /> {dateBadge.label}
          </span>
        </div>
      </div>

      {/* Submission progress */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="flex items-center gap-1 text-muted-foreground font-medium">
            <Users className="w-3 h-3" /> Submissions
          </span>
          <span className="font-bold text-foreground">
            {assignment.submissions} / {assignment.totalStudents}
            <span className="text-muted-foreground font-normal ml-1">({submissionPct}%)</span>
          </span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              submissionPct >= 80 ? 'bg-emerald-500' :
              submissionPct >= 40 ? 'bg-primary-blue' : 'bg-amber-500'
            }`}
            style={{ width: `${submissionPct}%` }}
          />
        </div>
      </div>

      {assignment.attachmentUrl && (
        <div className="mt-3">
          <a
            href={toDownloadUrl(assignment.attachmentUrl, assignment.attachmentName)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-background text-xs font-medium text-foreground hover:bg-muted transition-colors"
          >
            <Paperclip className="w-3.5 h-3.5 text-primary-blue" />
            <span className="truncate max-w-[200px]">{assignment.attachmentName ?? 'Attachment'}</span>
            <Download className="w-3 h-3 text-muted-foreground ml-auto shrink-0" />
          </a>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Max score: <strong className="text-foreground">{assignment.maxScore}</strong></span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(assignment)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-primary-blue hover:bg-primary-blue/5 rounded-lg transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" /> Edit
          </button>
          <button
            onClick={() => onViewSubmissions(assignment)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
          >
            <Star className="w-3.5 h-3.5" /> Grade
          </button>
          <button
            onClick={() => onDelete(assignment.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Create / Edit Drawer ─────────────────────────────────────────────────────

function AssignmentDrawer({
  open,
  onClose,
  onSubmit,
  initial,
  saving,
  courses,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: AssignmentForm) => void;
  initial: AssignmentForm | null;
  saving: boolean;
  courses: CourseOption[];
}) {
  const [form, setForm] = useState<AssignmentForm>(initial ?? EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setForm(initial ?? EMPTY_FORM);
  }, [initial, open]);

  const set = <K extends keyof AssignmentForm>(key: K, value: AssignmentForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const token = localStorage.getItem('token');
      const res = await fetch('/api/upload/submission', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json() as { url: string; fileName: string };
      setForm((prev) => ({ ...prev, attachmentUrl: data.url, attachmentName: data.fileName }));
    } catch {
      // upload failed silently
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-card border-l border-border shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary-blue/10 flex items-center justify-center">
              <ClipboardList className="w-4 h-4 text-primary-blue" />
            </div>
            <h2 className="font-heading font-bold text-foreground">
              {initial ? 'Edit Assignment' : 'Create Assignment'}
            </h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
              Assignment Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="e.g. JavaScript DOM Project"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition"
            />
          </div>

          {/* Course */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
              Course <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={form.courseId}
                onChange={(e) => set('courseId', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition appearance-none"
              >
                <option value="">Select a course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
            {courses.length === 0 && (
              <p className="mt-1 text-[11px] text-amber-600">No courses assigned yet. Contact your administrator.</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Brief description of the assignment..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition resize-none"
            />
          </div>

          {/* Due date + Max score */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                Due Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => set('dueDate', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Max Score</label>
              <input
                type="number"
                min={1}
                value={form.maxScore}
                onChange={(e) => set('maxScore', Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition"
              />
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Instructions</label>
            <textarea
              value={form.instructions}
              onChange={(e) => set('instructions', e.target.value)}
              placeholder="Step-by-step instructions for students..."
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition resize-none"
            />
          </div>

          {/* Attachment */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
              Attachment <span className="font-normal normal-case">(question paper, reading material…)</span>
            </label>
            {form.attachmentUrl ? (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border bg-background">
                <Paperclip className="w-4 h-4 text-primary-blue shrink-0" />
                <span className="text-xs text-foreground truncate flex-1">{form.attachmentName ?? 'Attached file'}</span>
                <a
                  href={toDownloadUrl(form.attachmentUrl, form.attachmentName)}
                  className="p-1 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                  title="Download"
                >
                  <Download className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, attachmentUrl: null, attachmentName: null }))}
                  className="p-1 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors"
                  title="Remove"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-full flex flex-col items-center gap-2 px-4 py-5 rounded-xl border-2 border-dashed border-border hover:border-primary-blue/40 hover:bg-primary-blue/5 transition-colors text-muted-foreground disabled:opacity-60"
              >
                {uploading ? (
                  <div className="w-5 h-5 border-2 border-primary-blue/30 border-t-primary-blue rounded-full animate-spin" />
                ) : (
                  <UploadCloud className="w-6 h-6" />
                )}
                <span className="text-xs font-medium">
                  {uploading ? 'Uploading…' : 'Drop file or click to upload'}
                </span>
                <span className="text-[11px]">PDF, Word, Excel, images, ZIP — up to 20 MB</span>
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.jpg,.jpeg,.png,.webp,.gif"
              onChange={handleFileChange}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Status</label>
            <div className="flex gap-2">
              {(['DRAFT', 'ACTIVE'] as AssignmentStatus[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => set('status', s)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                    form.status === s
                      ? s === 'ACTIVE'
                        ? 'bg-primary-blue text-white border-primary-blue shadow-sm'
                        : 'bg-slate-200 text-slate-700 border-slate-300'
                      : 'bg-transparent text-muted-foreground border-border hover:bg-muted'
                  }`}
                >
                  {s === 'DRAFT' ? 'Draft' : 'Active'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-border text-muted-foreground hover:bg-muted transition-colors">
            Cancel
          </button>
          <button
            onClick={() => onSubmit(form)}
            disabled={saving || !form.title.trim() || !form.dueDate || !form.courseId}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-primary-blue text-white hover:bg-blue-900 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
          >
            {saving ? (
              <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving...</>
            ) : (
              <><CheckCircle2 className="w-4 h-4" /> {initial ? 'Save Changes' : 'Create Assignment'}</>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────────────

function EmptyState({ filter, onCreateClick }: { filter: FilterTab; onCreateClick: () => void }) {
  const messages: Record<FilterTab, { title: string; desc: string }> = {
    all:      { title: 'No assignments yet', desc: 'Create your first assignment to get started.' },
    active:   { title: 'No active assignments', desc: 'Publish a draft to make it visible to students.' },
    past_due: { title: 'No past due assignments', desc: 'Great — everything is on track!' },
    draft:    { title: 'No drafts', desc: 'Save an assignment as draft to work on it later.' },
  };
  const { title, desc } = messages[filter];

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-5">
        <Layers className="w-9 h-9 text-muted-foreground" />
      </div>
      <h3 className="font-heading font-bold text-foreground text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-xs">{desc}</p>
      {filter === 'all' && (
        <button
          onClick={onCreateClick}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-blue text-white text-sm font-bold rounded-xl hover:bg-blue-900 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> Create your first assignment
        </button>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const FILTER_TABS: { key: FilterTab; label: string; icon: React.ElementType }[] = [
  { key: 'all',      label: 'All',       icon: LayoutList },
  { key: 'active',   label: 'Active',    icon: CheckCircle2 },
  { key: 'past_due', label: 'Past Due',  icon: AlertCircle },
  { key: 'draft',    label: 'Draft',     icon: FileText },
];

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [saving, setSaving] = useState(false);
  const [gradingAssignment, setGradingAssignment] = useState<Assignment | null>(null);

  useEffect(() => {
    // Load assignments and courses in parallel
    Promise.all([
      api.get<{ assignments: Assignment[] }>('/assignments'),
      api.get<{ courses: CourseOption[] }>('/courses/my'),
    ])
      .then(([{ assignments }, { courses }]) => {
        setAssignments(assignments ?? []);
        setCourses(courses ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = assignments.filter((a) => {
    if (filter === 'all') return true;
    if (filter === 'active') return a.status === 'ACTIVE';
    if (filter === 'past_due') return a.status === 'PAST_DUE';
    if (filter === 'draft') return a.status === 'DRAFT';
    return true;
  });

  const counts = {
    all:      assignments.length,
    active:   assignments.filter((a) => a.status === 'ACTIVE').length,
    past_due: assignments.filter((a) => a.status === 'PAST_DUE').length,
    draft:    assignments.filter((a) => a.status === 'DRAFT').length,
  };

  const openCreate = () => { setEditingAssignment(null); setDrawerOpen(true); };
  const openEdit   = (a: Assignment) => { setEditingAssignment(a); setDrawerOpen(true); };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this assignment?')) return;
    try {
      await api.delete(`/assignments/${id}`);
      setAssignments((prev) => prev.filter((a) => a.id !== id));
    } catch { /* noop */ }
  };

  const handleSubmit = async (form: AssignmentForm) => {
    setSaving(true);
    try {
      if (editingAssignment) {
        const { assignment } = await api.patch<{ assignment: Assignment }>(
          `/assignments/${editingAssignment.id}`,
          { ...form, dueDate: new Date(form.dueDate).toISOString() }
        );
        setAssignments((prev) => prev.map((a) => a.id === editingAssignment.id ? { ...a, ...assignment } : a));
      } else {
        const { assignment } = await api.post<{ assignment: Assignment }>('/assignments', {
          title: form.title,
          courseId: form.courseId,
          description: form.description,
          instructions: form.instructions,
          dueDate: new Date(form.dueDate).toISOString(),
          maxScore: form.maxScore,
          status: form.status,
          attachmentUrl: form.attachmentUrl,
          attachmentName: form.attachmentName,
        });
        setAssignments((prev) => [assignment, ...prev]);
      }
      setDrawerOpen(false);
    } catch { /* noop */ } finally {
      setSaving(false);
    }
  };

  const initialForm: AssignmentForm | null = editingAssignment ? {
    title:          editingAssignment.title,
    courseId:       editingAssignment.courseId,
    description:    editingAssignment.description,
    instructions:   editingAssignment.instructions,
    dueDate:        editingAssignment.dueDate.slice(0, 10),
    maxScore:       editingAssignment.maxScore,
    status:         editingAssignment.status === 'PAST_DUE' ? 'ACTIVE' : editingAssignment.status,
    attachmentUrl:  editingAssignment.attachmentUrl,
    attachmentName: editingAssignment.attachmentName,
  } : null;

  return (
    <div className="max-w-5xl pb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Assignments</h1>
          <p className="text-sm text-muted-foreground mt-1">Create and manage student assignments</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-blue text-white text-sm font-bold rounded-xl hover:bg-blue-900 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> Create Assignment
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { key: 'all',      label: 'Total',    icon: ClipboardList, bg: 'bg-slate-50',  iconColor: 'text-slate-600' },
          { key: 'active',   label: 'Active',   icon: CheckCircle2,  bg: 'bg-blue-50',   iconColor: 'text-blue-600' },
          { key: 'past_due', label: 'Past Due', icon: AlertCircle,   bg: 'bg-red-50',    iconColor: 'text-red-600' },
          { key: 'draft',    label: 'Draft',    icon: FileText,      bg: 'bg-slate-50',  iconColor: 'text-slate-500' },
        ].map((s) => (
          <button
            key={s.key}
            onClick={() => setFilter(s.key as FilterTab)}
            className={cn(
              'text-left bg-card border rounded-2xl p-5 transition-all hover:shadow-sm',
              filter === s.key ? 'border-primary-blue ring-1 ring-primary-blue/20' : 'border-border'
            )}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${s.bg}`}>
              <s.icon className={`w-4 h-4 ${s.iconColor}`} />
            </div>
            <p className="font-heading text-2xl font-extrabold text-foreground leading-none">
              {counts[s.key as FilterTab]}
            </p>
            <p className="text-xs font-medium text-muted-foreground mt-1">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl mb-6 w-fit">
        {FILTER_TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all',
              filter === key ? 'bg-card text-foreground shadow-sm border border-border' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
            {counts[key] > 0 && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                filter === key ? 'bg-primary-blue text-white' : 'bg-muted text-muted-foreground'
              }`}>
                {counts[key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-5 animate-pulse">
              <div className="flex gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-muted shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState filter={filter} onCreateClick={openCreate} />
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => (
            <AssignmentCard
              key={a.id}
              assignment={a}
              onEdit={openEdit}
              onDelete={handleDelete}
              onViewSubmissions={setGradingAssignment}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Drawer */}
      <AssignmentDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleSubmit}
        initial={initialForm}
        saving={saving}
        courses={courses}
      />

      {/* Submissions / Grading Panel */}
      {gradingAssignment && (
        <SubmissionsPanel
          assignment={gradingAssignment}
          onClose={() => setGradingAssignment(null)}
        />
      )}
    </div>
  );
}
