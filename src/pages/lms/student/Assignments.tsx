import { useEffect, useState } from 'react';
import {
  ClipboardList, Calendar, BookOpen, Clock,
  AlertCircle, CheckCircle2, FileText, Loader2,
  Send, Star, MessageSquare, X, Award, Paperclip,
} from 'lucide-react';
import { api, toDownloadUrl } from '@/lib/api';
import { cn } from '@/lib/utils';
import FileUploader, { type UploadedFile } from '@/components/lms/FileUploader';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Assignment {
  id: string;
  title: string;
  description: string;
  instructions: string;
  course: string;
  courseId: string;
  dueDate: string;
  maxScore: number;
  status: 'ACTIVE' | 'PAST_DUE';
  attachmentUrl: string | null;
  attachmentName: string | null;
}

interface MySubmission {
  id: string;
  content: string | null;
  fileUrl: string | null;
  fileName: string | null;
  score: number | null;
  feedback: string | null;
  status: string;  // SUBMITTED | GRADED | LATE
  submittedAt: string;
  gradedAt: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-UG', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

function timeUntilDue(iso: string): { label: string; urgent: boolean } {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff < 0) return { label: 'Past due', urgent: true };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return { label: 'Due today', urgent: true };
  if (days === 1) return { label: 'Due tomorrow', urgent: true };
  if (days <= 3)  return { label: `${days} days left`, urgent: true };
  return { label: `${days} days left`, urgent: false };
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ─── Submit Modal ─────────────────────────────────────────────────────────────

function SubmitModal({
  assignment,
  onClose,
  onSubmitted,
}: {
  assignment: Assignment;
  onClose: () => void;
  onSubmitted: (sub: MySubmission) => void;
}) {
  const [content, setContent] = useState('');
  const [attachedFile, setAttachedFile] = useState<UploadedFile | null>(null);
  const [existing, setExisting] = useState<MySubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<{ submission: MySubmission | null }>(`/submissions/mine?assignmentId=${assignment.id}`)
      .then(({ submission }) => {
        setExisting(submission);
        setContent(submission?.content ?? '');
        if (submission?.fileUrl && submission?.fileName) {
          setAttachedFile({ url: submission.fileUrl, fileName: submission.fileName, size: 0 });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [assignment.id]);

  const isGraded   = existing?.status === 'GRADED';
  const isLate     = existing?.status === 'LATE';
  const scorePct   = isGraded && existing?.score != null
    ? Math.round((existing.score / assignment.maxScore) * 100) : null;
  const isPastDue  = assignment.status === 'PAST_DUE';

  const handleSubmit = async () => {
    setSaving(true);
    setError('');
    try {
      const { submission } = await api.post<{ submission: MySubmission }>('/submissions', {
        assignmentId: assignment.id,
        content: content.trim() || undefined,
        fileUrl: attachedFile?.url ?? undefined,
        fileName: attachedFile?.fileName ?? undefined,
        fileSize: attachedFile?.size ?? undefined,
      });
      setExisting(submission);
      onSubmitted(submission);
    } catch (e: unknown) {
      setError((e as { message?: string })?.message ?? 'Failed to submit');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
            <div>
              <h3 className="font-heading font-bold text-foreground">{assignment.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                <BookOpen className="w-3 h-3" /> {assignment.course}
                <span className="text-muted-foreground/40">·</span>
                <Calendar className="w-3 h-3" /> Due {formatDate(assignment.dueDate)}
              </p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                {/* Instructions */}
                {assignment.instructions && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Instructions</p>
                    <div className="bg-muted/60 rounded-xl p-3 text-xs text-foreground whitespace-pre-wrap leading-relaxed">
                      {assignment.instructions}
                    </div>
                  </div>
                )}

                {/* Teacher attachment */}
                {assignment.attachmentUrl && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Assignment File</p>
                    <a
                      href={toDownloadUrl(assignment.attachmentUrl, assignment.attachmentName)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-background text-xs font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      <Paperclip className="w-3.5 h-3.5 text-primary-blue shrink-0" />
                      <span className="truncate max-w-[220px]">{assignment.attachmentName ?? 'Download file'}</span>
                      <span className="ml-1 text-primary-blue font-semibold">↓ Download</span>
                    </a>
                  </div>
                )}

                {/* Graded result */}
                {isGraded && (
                  <div className={cn(
                    'rounded-xl p-4 border',
                    scorePct != null && scorePct >= 75 ? 'bg-emerald-50 border-emerald-200' :
                    scorePct != null && scorePct >= 50 ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'
                  )}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5" /> Your Grade
                      </span>
                      <span className={cn(
                        'text-xl font-extrabold',
                        scorePct != null && scorePct >= 75 ? 'text-emerald-700' :
                        scorePct != null && scorePct >= 50 ? 'text-amber-700' : 'text-red-700'
                      )}>
                        {existing!.score ?? '—'}<span className="text-sm font-normal text-muted-foreground">/{assignment.maxScore}</span>
                      </span>
                    </div>
                    {existing?.feedback && (
                      <div className="flex items-start gap-2 text-xs text-foreground">
                        <MessageSquare className="w-3.5 h-3.5 mt-0.5 shrink-0 text-muted-foreground" />
                        <p className="leading-relaxed">{existing.feedback}</p>
                      </div>
                    )}
                    <p className="text-[11px] text-muted-foreground mt-2">Graded {timeAgo(existing!.gradedAt!)}</p>
                  </div>
                )}

                {/* Submitted (not graded) */}
                {existing && !isGraded && (
                  <div className={cn(
                    'rounded-xl p-3 border flex items-center gap-3',
                    isLate ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'
                  )}>
                    <CheckCircle2 className={cn('w-4 h-4 shrink-0', isLate ? 'text-red-600' : 'text-emerald-600')} />
                    <div>
                      <p className={cn('text-xs font-semibold', isLate ? 'text-red-700' : 'text-emerald-700')}>
                        {isLate ? 'Submitted late' : 'Submitted'} · Awaiting grade
                      </p>
                      <p className="text-[11px] text-muted-foreground">{timeAgo(existing.submittedAt)}</p>
                    </div>
                  </div>
                )}

                {/* Text input */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                    {existing ? 'Your Answer (click Submit to resubmit)' : 'Your Answer'}
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={5}
                    placeholder="Type your answer, explanation, or notes here..."
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition resize-none"
                  />
                </div>

                {/* File attachment */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                    <Paperclip className="w-3 h-3" /> Attach File <span className="normal-case font-normal">(optional)</span>
                  </label>
                  <FileUploader
                    endpoint="/api/upload/submission"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,image/*"
                    maxSizeMb={20}
                    value={attachedFile}
                    onChange={setAttachedFile}
                    label="Upload file"
                    hint="PDF, Word, Excel, image, ZIP, up to 20 MB"
                  />
                </div>

                {error && <p className="text-xs text-red-500">{error}</p>}

                {isPastDue && !existing && (
                  <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    This assignment is past due, your submission will be marked as late.
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          {!loading && (
            <div className="px-6 py-4 border-t border-border flex gap-3 shrink-0">
              <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-border text-muted-foreground hover:bg-muted transition-colors">
                Close
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving || isGraded}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-primary-blue text-white hover:bg-blue-900 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Submitting...</>
                ) : isGraded ? (
                  <><Star className="w-4 h-4" /> Already Graded</>
                ) : existing ? (
                  <><Send className="w-4 h-4" /> Resubmit</>
                ) : (
                  <><Send className="w-4 h-4" /> Submit Assignment</>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Assignment Card ──────────────────────────────────────────────────────────

function AssignmentCard({
  assignment,
  onSubmit,
  submissionStatus,
}: {
  assignment: Assignment;
  onSubmit: (a: Assignment) => void;
  submissionStatus: string | null;
}) {
  const due = timeUntilDue(assignment.dueDate);
  const isPastDue = assignment.status === 'PAST_DUE';
  const isGraded     = submissionStatus === 'GRADED';
  const isSubmitted  = submissionStatus === 'SUBMITTED' || submissionStatus === 'LATE';

  return (
    <div className={cn(
      'bg-card border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all',
      isPastDue ? 'border-red-200' : 'border-border'
    )}>
      <div className="flex items-start gap-4">
        <div className={cn(
          'w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border',
          isGraded    ? 'bg-emerald-50 border-emerald-200' :
          isSubmitted ? 'bg-blue-50 border-blue-200' :
          isPastDue   ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'
        )}>
          {isGraded
            ? <Award className="w-5 h-5 text-emerald-600" />
            : isSubmitted
            ? <CheckCircle2 className="w-5 h-5 text-blue-600" />
            : isPastDue
            ? <AlertCircle className="w-5 h-5 text-red-500" />
            : <ClipboardList className="w-5 h-5 text-primary-blue" />
          }
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-foreground text-sm leading-snug">{assignment.title}</h3>
            <span className={cn(
              'inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0',
              isGraded    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
              isSubmitted ? 'bg-blue-50 text-blue-700 border-blue-200' :
              isPastDue   ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200'
            )}>
              {isGraded    ? <><Award className="w-3 h-3" /> Graded</> :
               isSubmitted ? <><CheckCircle2 className="w-3 h-3" /> Submitted</> :
               isPastDue   ? <><AlertCircle className="w-3 h-3" /> Past Due</> :
                             <><CheckCircle2 className="w-3 h-3" /> Active</>
              }
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-2">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <BookOpen className="w-3.5 h-3.5" /> {assignment.course}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" /> Due {formatDate(assignment.dueDate)}
            </span>
            <span className={cn('flex items-center gap-1.5 text-xs font-semibold', due.urgent ? 'text-red-600' : 'text-muted-foreground')}>
              <Clock className="w-3.5 h-3.5" /> {due.label}
            </span>
          </div>

          {assignment.description && (
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-2">
              {assignment.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
            <span className="text-xs text-muted-foreground">Max score: <strong className="text-foreground">{assignment.maxScore} pts</strong></span>
            <button
              onClick={() => onSubmit(assignment)}
              className={cn(
                'flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all',
                isGraded
                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                  : 'bg-primary-blue text-white hover:bg-blue-900 shadow-sm'
              )}
            >
              {isGraded    ? <><Star className="w-3.5 h-3.5" /> View Grade</> :
               isSubmitted ? <><Send className="w-3.5 h-3.5" /> Resubmit</> :
                             <><Send className="w-3.5 h-3.5" /> Submit</>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'past_due'>('all');
  const [submitting, setSubmitting] = useState<Assignment | null>(null);
  // Track submission status per assignment
  const [submissionMap, setSubmissionMap] = useState<Record<string, string | null>>({});

  useEffect(() => {
    api.get<{ assignments: Assignment[] }>('/assignments')
      .then(({ assignments }) => setAssignments(assignments ?? []))
      .catch(() => setAssignments([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = assignments.filter((a) => {
    if (filter === 'active')   return a.status === 'ACTIVE';
    if (filter === 'past_due') return a.status === 'PAST_DUE';
    return true;
  });

  const activeCount  = assignments.filter((a) => a.status === 'ACTIVE').length;
  const pastDueCount = assignments.filter((a) => a.status === 'PAST_DUE').length;

  const handleSubmitted = (assignmentId: string, sub: { status: string }) => {
    setSubmissionMap((prev) => ({ ...prev, [assignmentId]: sub.status }));
  };

  return (
    <div className="max-w-3xl pb-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-foreground">Assignments</h1>
        <p className="text-sm text-muted-foreground mt-0.5">All assignments from your enrolled courses</p>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-3">
        {[
          { key: 'all',      label: 'All',      count: assignments.length },
          { key: 'active',   label: 'Active',   count: activeCount },
          { key: 'past_due', label: 'Past Due', count: pastDueCount },
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setFilter(key as typeof filter)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all',
              filter === key
                ? 'bg-primary-blue text-white border-primary-blue shadow-sm'
                : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary-blue/40'
            )}
          >
            {label}
            <span className={cn(
              'text-xs font-bold px-1.5 py-0.5 rounded-full',
              filter === key ? 'bg-card/20 text-white' : 'bg-muted text-muted-foreground'
            )}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Body */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground gap-3">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading assignments…</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 flex flex-col items-center gap-3 text-center">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
            <FileText className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="font-semibold text-muted-foreground">
            {filter === 'past_due' ? 'No past due assignments' :
             filter === 'active'   ? 'No active assignments' : 'No assignments yet'}
          </p>
          <p className="text-sm text-muted-foreground/70">
            {filter === 'past_due' ? 'Great job, all assignments are on track!' : 'Your teachers will post assignments here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => (
            <AssignmentCard
              key={a.id}
              assignment={a}
              onSubmit={setSubmitting}
              submissionStatus={submissionMap[a.id] ?? null}
            />
          ))}
        </div>
      )}

      {/* Submit modal */}
      {submitting && (
        <SubmitModal
          assignment={submitting}
          onClose={() => setSubmitting(null)}
          onSubmitted={(sub) => { handleSubmitted(submitting.id, sub); setSubmitting(null); }}
        />
      )}
    </div>
  );
}
