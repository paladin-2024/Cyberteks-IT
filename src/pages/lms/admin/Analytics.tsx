import { useEffect, useState } from 'react';
import { TrendingUp, Users, BookOpen, DollarSign, Target, BarChart3, Download, FileText, Loader2, CheckCircle2, Calendar } from 'lucide-react';
import { ChartArea, ChartBar, ChartPie } from '@/components/ui/chart';
import { api } from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface KPIs {
  totalStudents: number;
  totalRevenue: number;
  avgCompletion: number;
  retentionRate: number;
}

interface ChartPoint {
  month: string;
  students?: number;
  revenue?: number;
}

interface ProgramShare {
  name: string;
  value: number;
}

interface CompletionItem {
  program: string;
  rate: number;
}

interface AnalyticsData {
  kpis: KPIs;
  enrollmentChart: ChartPoint[];
  revenueChart: ChartPoint[];
  programShare: ProgramShare[];
  completionByProgram: CompletionItem[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatUGX(amount: number): string {
  if (amount >= 1_000_000_000) return `UGX ${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `UGX ${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `UGX ${(amount / 1_000).toFixed(0)}K`;
  return `UGX ${amount.toLocaleString('en-UG')}`;
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function SkeletonBox({ className }: { className: string }) {
  return <div className={`animate-pulse bg-slate-100 rounded-xl ${className}`} />;
}

// ─── Report months helper ─────────────────────────────────────────────────────

function getLast12Months(): Array<{ year: number; month: number; label: string }> {
  const result = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push({
      year:  d.getFullYear(),
      month: d.getMonth() + 1,
      label: d.toLocaleString('en-US', { month: 'long', year: 'numeric' }),
    });
  }
  return result;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [justDownloaded, setJustDownloaded] = useState<string | null>(null);

  const reportMonths = getLast12Months();

  async function downloadReport(year: number, month: number) {
    const key = `${year}-${month}`;
    setDownloading(key);
    try {
      const token = localStorage.getItem('token');
      const BASE  = (import.meta.env.VITE_API_URL ?? '') + '/api';
      const res   = await fetch(`${BASE}/analytics/report?year=${year}&month=${month}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Failed to generate report');
      const blob  = await res.blob();
      const url   = URL.createObjectURL(blob);
      const label = new Date(year, month - 1, 1)
        .toLocaleString('en-US', { month: 'short', year: 'numeric' })
        .replace(' ', '-').toLowerCase();
      const a = document.createElement('a');
      a.href     = url;
      a.download = `cyberteks-report-${label}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setJustDownloaded(key);
      setTimeout(() => setJustDownloaded(null), 3000);
    } catch (e) {
      console.error('[downloadReport]', e);
    } finally {
      setDownloading(null);
    }
  }

  useEffect(() => {
    api.get<AnalyticsData>('/analytics')
      .then(setData)
      .catch((err) => setError(err.message ?? 'Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl pb-8">
        <SkeletonBox className="h-8 w-48" />
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <SkeletonBox key={i} className="h-28" />)}
        </div>
        <div className="grid lg:grid-cols-3 gap-5">
          <SkeletonBox className="lg:col-span-2 h-72" />
          <SkeletonBox className="h-72" />
        </div>
        <div className="grid lg:grid-cols-2 gap-5">
          <SkeletonBox className="h-64" />
          <SkeletonBox className="h-64" />
        </div>
        <SkeletonBox className="h-64" />
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground text-sm">{error ?? 'Something went wrong'}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-xs font-semibold text-primary-blue hover:underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { kpis, enrollmentChart, revenueChart, programShare, completionByProgram } = data;

  const kpiCards = [
    {
      label: 'Total Students',
      value: String(kpis.totalStudents),
      icon: Users,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      note: undefined,
    },
    {
      label: 'Total Revenue',
      value: formatUGX(kpis.totalRevenue),
      icon: DollarSign,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      note: 'UGX, all time',
    },
    {
      label: 'Avg Completion',
      value: `${kpis.avgCompletion}%`,
      icon: Target,
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600',
      note: undefined,
    },
    {
      label: 'Retention Rate',
      value: `${kpis.retentionRate}%`,
      icon: BookOpen,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      note: undefined,
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl pb-8">

      {/* Header */}
      <div>
        <h1 className="font-display text-xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Platform-wide performance metrics and trends</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map((k) => (
          <div key={k.label} className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${k.iconBg}`}>
                <k.icon className={`w-4 h-4 ${k.iconColor}`} />
              </div>
              <TrendingUp className="w-4 h-4 text-slate-300" />
            </div>
            <p className="font-display text-2xl font-extrabold text-foreground leading-none">{k.value}</p>
            <p className="text-xs font-medium text-muted-foreground mt-1">{k.label}</p>
            {k.note && <p className="text-[10px] text-muted-foreground mt-0.5">{k.note}</p>}
          </div>
        ))}
      </div>

      {/* Row 1, Enrollments + Program Distribution */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
          <h2 className="font-display font-bold text-foreground text-base mb-1">Monthly Enrollments</h2>
          <p className="text-xs text-muted-foreground mb-5">New students enrolled per month (last 12 months)</p>
          {enrollmentChart.some((d) => (d.students ?? 0) > 0) ? (
            <ChartArea data={enrollmentChart} dataKeys={['students']} xKey="month" height={240} />
          ) : (
            <div className="h-[240px] flex flex-col items-center justify-center text-muted-foreground gap-2">
              <BarChart3 className="w-8 h-8 opacity-30" />
              <p className="text-sm">No enrollment data yet</p>
            </div>
          )}
        </div>
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-display font-bold text-foreground text-base mb-1">Program Distribution</h2>
          <p className="text-xs text-muted-foreground mb-4">Students by program category</p>
          {programShare.length > 0 && programShare.some((p) => p.value > 0) ? (
            <ChartPie data={programShare} donut height={240} />
          ) : (
            <div className="h-[240px] flex flex-col items-center justify-center text-muted-foreground gap-2">
              <BarChart3 className="w-8 h-8 opacity-30" />
              <p className="text-sm">No enrollment data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Row 2, Revenue + empty retention placeholder */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-display font-bold text-foreground text-base mb-1">Revenue (UGX)</h2>
          <p className="text-xs text-muted-foreground mb-5">Monthly revenue, last 12 months</p>
          {revenueChart.some((d) => (d.revenue ?? 0) > 0) ? (
            <ChartBar data={revenueChart} dataKeys={['revenue']} xKey="month" ugxFormat height={230} />
          ) : (
            <div className="h-[230px] flex flex-col items-center justify-center text-muted-foreground gap-2">
              <BarChart3 className="w-8 h-8 opacity-30" />
              <p className="text-sm">No revenue recorded yet</p>
            </div>
          )}
        </div>
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-display font-bold text-foreground text-base mb-1">Retention Rate</h2>
          <p className="text-xs text-muted-foreground mb-5">Overall student retention</p>
          <div className="flex flex-col items-center justify-center h-[230px] gap-4">
            <div className="relative w-36 h-36">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15.9"
                  fill="none"
                  stroke="#023064"
                  strokeWidth="3"
                  strokeDasharray={`${kpis.retentionRate} ${100 - kpis.retentionRate}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-foreground">{kpis.retentionRate}%</span>
                <span className="text-[10px] text-muted-foreground">Retention</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center max-w-[180px]">
              Students who remain active and have not dropped or been suspended.
            </p>
          </div>
        </div>
      </div>

      {/* Completion by program */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="font-display font-bold text-foreground text-base mb-1">Completion Rate by Program</h2>
        <p className="text-xs text-muted-foreground mb-6">% of enrolled students who completed the course</p>

        {completionByProgram.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-24 text-muted-foreground gap-2">
            <BarChart3 className="w-8 h-8 opacity-30" />
            <p className="text-sm">No completion data yet</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {completionByProgram.map((p) => (
                <div key={p.program}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-foreground">{p.program}</span>
                    <span className="text-sm font-bold text-foreground">{p.rate}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        p.rate >= 85 ? 'bg-emerald-500' : p.rate >= 70 ? 'bg-blue-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${p.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-6 mt-5 pt-4 border-t border-slate-100 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" /> Excellent ≥ 85%
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" /> Good 70–84%
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" /> Needs attention &lt;70%
              </span>
            </div>
          </>
        )}
      </div>

      {/* ── Monthly Reports ─────────────────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">

        {/* Section header */}
        <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-blue/10 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-primary-blue" />
            </div>
            <div>
              <h2 className="font-display font-bold text-foreground text-base leading-none">Monthly Reports</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Download professional PDF reports with KPIs, enrollment trends, revenue, and completion data.
              </p>
            </div>
          </div>
          {/* Preview badge */}
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full bg-primary-blue/10 text-primary-blue shrink-0">
            <Download className="w-3 h-3" /> PDF · Branded
          </span>
        </div>

        {/* What's included banner */}
        <div className="px-6 py-3 bg-slate-50 border-b border-border flex flex-wrap gap-4">
          {[
            'KPI Summary',
            'Enrollment Trends (12 months)',
            'Revenue Breakdown',
            'Completion Rates',
            'Program Distribution',
            'Company Logo & Branding',
          ].map((item) => (
            <span key={item} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-blue shrink-0" />
              {item}
            </span>
          ))}
        </div>

        {/* Month rows */}
        <div className="divide-y divide-border">
          {reportMonths.map(({ year, month, label }, idx) => {
            const key        = `${year}-${month}`;
            const isLoading  = downloading === key;
            const isDone     = justDownloaded === key;
            const isCurrent  = idx === 0;

            return (
              <div
                key={key}
                className="flex items-center justify-between gap-4 px-6 py-3.5 hover:bg-muted/30 transition-colors"
              >
                {/* Left: icon + label */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isCurrent ? 'bg-primary-blue text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{label}</p>
                    {isCurrent && (
                      <p className="text-[10px] text-primary-blue font-semibold mt-0.5">Current month</p>
                    )}
                  </div>
                </div>

                {/* Right: status + button */}
                <div className="flex items-center gap-3 shrink-0">
                  {isDone && (
                    <span className="hidden sm:flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Downloaded
                    </span>
                  )}
                  <button
                    onClick={() => downloadReport(year, month)}
                    disabled={isLoading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      isDone
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : isCurrent
                        ? 'bg-primary-blue text-white hover:bg-primary-blue/90 shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                    } disabled:opacity-60 disabled:cursor-not-allowed`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Generating…
                      </>
                    ) : isDone ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Downloaded
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        Download PDF
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="px-6 py-3 bg-slate-50 border-t border-border">
          <p className="text-[11px] text-muted-foreground">
            Reports include all-time platform KPIs plus data specific to the selected month. Generated in real time from live data.
          </p>
        </div>
      </div>

    </div>
  );
}
