import { useState, useEffect, useCallback } from 'react';
import { Search, X, ChevronDown, User, MapPin, GraduationCap, Clock, Laptop, Wifi, BookOpen } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';

interface Application {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  programs: string[];
  educationLevel: string;
  hoursPerWeek: string;
  status: string;
  motivation: string;
  careerGoals: string;
  cityCountry: string;
  gender: string;
  dateOfBirth: string;
  currentOccupation: string | null;
  hasComputer: string;
  hasInternet: string;
  reviewNotes: string | null;
  reviewedAt: string | null;
  createdAt: string;
  userId: string | null;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING:      'bg-amber-100 text-amber-700',
  UNDER_REVIEW: 'bg-blue-100 text-blue-700',
  ACCEPTED:     'bg-green-100 text-green-700',
  REJECTED:     'bg-red-100 text-red-700',
  WAITLISTED:   'bg-purple-100 text-purple-700',
};

const STATUS_LABELS: Record<string, string> = {
  PENDING:      'Pending',
  UNDER_REVIEW: 'Under Review',
  ACCEPTED:     'Accepted',
  REJECTED:     'Rejected',
  WAITLISTED:   'Waitlisted',
};

const EDUCATION_LABELS: Record<string, string> = {
  high_school:          'High School',
  diploma_certificate:  'Diploma / Certificate',
  undergraduate:        'Undergraduate',
  graduate:             'Graduate',
  other:                'Other',
};

const HOURS_LABELS: Record<string, string> = {
  '2_4':    '2–4 hrs/week',
  '5_10':   '5–10 hrs/week',
  '10_plus':'10+ hrs/week',
};

export default function ApplicationsPage() {
  const { t } = useLanguage();
  const d = t.lms.admin.applications;

  const [applications, setApplications] = useState<Application[]>([]);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selected, setSelected] = useState<Application | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'ALL') params.set('status', filterStatus);
      if (search.trim()) params.set('search', search.trim());
      const data = await api.get<{ applications: Application[]; statusCounts: Record<string, number> }>(
        `/apply?${params.toString()}`
      );
      setApplications(data.applications);
      setStatusCounts(data.statusCounts);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, search]);

  useEffect(() => {
    const timer = setTimeout(fetchApplications, 300);
    return () => clearTimeout(timer);
  }, [fetchApplications]);

  const updateStatus = async (appId: string, status: string, notes?: string) => {
    setUpdating(true);
    try {
      const { application } = await api.patch<{ application: Application }>(
        `/apply/${appId}/status`,
        { status, reviewNotes: notes }
      );
      setApplications(prev => prev.map(a => a.id === appId ? application : a));
      if (selected?.id === appId) setSelected(application);
      // refresh counts
      fetchApplications();
    } finally {
      setUpdating(false);
    }
  };

  const openReview = (app: Application) => {
    setSelected(app);
    setReviewNotes(app.reviewNotes ?? '');
  };

  const totalCount = Object.values(statusCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">{d.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{totalCount} {d.total.toLowerCase()}</p>
        </div>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {Object.keys(STATUS_COLORS).map((key) => (
          <button
            key={key}
            onClick={() => setFilterStatus(prev => prev === key ? 'ALL' : key)}
            className={`bg-card border rounded-xl p-4 text-center transition-all ${
              filterStatus === key ? 'border-primary-blue ring-2 ring-primary-blue/20' : 'border-border hover:border-primary-blue/40'
            }`}
          >
            <p className="font-heading text-xl font-bold text-foreground">{statusCounts[key] ?? 0}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${STATUS_COLORS[key]}`}>
              {STATUS_LABELS[key]}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={d.search}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue"
          />
        </div>
        {filterStatus !== 'ALL' && (
          <button
            onClick={() => setFilterStatus('ALL')}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:bg-muted transition-all"
          >
            <X className="w-3.5 h-3.5" /> Clear filter
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-5 py-3.5 text-muted-foreground font-semibold">Applicant</th>
                <th className="text-left px-5 py-3.5 text-muted-foreground font-semibold">Programs</th>
                <th className="text-left px-5 py-3.5 text-muted-foreground font-semibold hidden md:table-cell">Education</th>
                <th className="text-left px-5 py-3.5 text-muted-foreground font-semibold hidden lg:table-cell">Availability</th>
                <th className="text-left px-5 py-3.5 text-muted-foreground font-semibold">Status</th>
                <th className="text-left px-5 py-3.5 text-muted-foreground font-semibold hidden sm:table-cell">Date</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/50">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground text-sm">
                    No applications found
                  </td>
                </tr>
              ) : applications.map((app) => (
                <tr key={app.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-foreground">{app.fullName}</p>
                    <p className="text-xs text-muted-foreground">{app.email}</p>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">
                    <p className="truncate max-w-[160px]">{app.programs.join(', ')}</p>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground hidden md:table-cell">
                    {EDUCATION_LABELS[app.educationLevel] ?? app.educationLevel}
                  </td>
                  <td className="px-5 py-4 text-muted-foreground hidden lg:table-cell">
                    {HOURS_LABELS[app.hoursPerWeek] ?? app.hoursPerWeek}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[app.status]}`}>
                      {STATUS_LABELS[app.status]}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground hidden sm:table-cell">
                    {new Date(app.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => openReview(app)}
                      className="text-xs font-semibold text-primary-blue hover:text-primary-red transition-colors"
                    >
                      {d.review}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-card rounded-2xl border border-border w-full max-w-2xl my-8">
            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-border">
              <div>
                <h2 className="font-heading text-lg font-bold text-foreground">{selected.fullName}</h2>
                <p className="text-sm text-muted-foreground">{selected.email} · {selected.phone}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground mt-0.5">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5 max-h-[65vh] overflow-y-auto">
              {/* Quick info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 shrink-0" /> {selected.cityCountry}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4 shrink-0 capitalize" />
                  {selected.gender.replace('_', ' ')} · DOB: {selected.dateOfBirth}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <GraduationCap className="w-4 h-4 shrink-0" />
                  {EDUCATION_LABELS[selected.educationLevel] ?? selected.educationLevel}
                  {selected.currentOccupation && ` · ${selected.currentOccupation}`}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 shrink-0" /> {HOURS_LABELS[selected.hoursPerWeek] ?? selected.hoursPerWeek}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Laptop className="w-4 h-4 shrink-0" /> Has computer: {selected.hasComputer}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Wifi className="w-4 h-4 shrink-0" /> Has internet: {selected.hasInternet}
                </div>
              </div>

              {/* Programs */}
              <div>
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  <BookOpen className="w-3.5 h-3.5" /> Programs Applied For
                </p>
                <div className="flex flex-wrap gap-2">
                  {selected.programs.map(p => (
                    <span key={p} className="text-xs px-2.5 py-1 bg-primary-blue/10 text-primary-blue rounded-full font-medium">{p}</span>
                  ))}
                </div>
              </div>

              {/* Motivation */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Motivation</p>
                <p className="text-sm text-foreground leading-relaxed">{selected.motivation}</p>
              </div>

              {/* Career goals */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Career Goals</p>
                <p className="text-sm text-foreground leading-relaxed">{selected.careerGoals}</p>
              </div>

              {/* Review notes */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                  Review Notes (sent to applicant on accept/reject)
                </label>
                <textarea
                  value={reviewNotes}
                  onChange={e => setReviewNotes(e.target.value)}
                  rows={3}
                  placeholder="Optional notes for the applicant..."
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue resize-none"
                />
              </div>

              {/* Current status */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Current status:</span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[selected.status]}`}>
                  {STATUS_LABELS[selected.status]}
                </span>
                {selected.userId && (
                  <span className="text-xs text-green-600 font-medium ml-1">· Account created</span>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="px-6 pb-6 pt-4 border-t border-border flex flex-wrap gap-2 justify-end">
              <button
                onClick={() => updateStatus(selected.id, 'UNDER_REVIEW', reviewNotes)}
                disabled={updating || selected.status === 'UNDER_REVIEW'}
                className="px-4 py-2 rounded-xl border border-border text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors disabled:opacity-40"
              >
                Under Review
              </button>
              <button
                onClick={() => updateStatus(selected.id, 'WAITLISTED', reviewNotes)}
                disabled={updating || selected.status === 'WAITLISTED'}
                className="px-4 py-2 rounded-xl border border-border text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors disabled:opacity-40"
              >
                Waitlist
              </button>
              <button
                onClick={() => updateStatus(selected.id, 'REJECTED', reviewNotes)}
                disabled={updating || selected.status === 'REJECTED'}
                className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-40"
              >
                Reject
              </button>
              <button
                onClick={() => updateStatus(selected.id, 'ACCEPTED', reviewNotes)}
                disabled={updating || selected.status === 'ACCEPTED'}
                className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors disabled:opacity-40 flex items-center gap-1.5"
              >
                {updating ? (
                  <><span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" /> Accepting...</>
                ) : (
                  <>Accept & Create Account</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
