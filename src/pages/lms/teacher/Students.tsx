import { useState, useEffect } from 'react';
import { Users, TrendingUp, Clock, Search, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';

interface Enrollment {
  id: string;
  status: string;
  progressPercent: number;
  startedAt: string;
  user: { id: string; name: string; email: string; image: string | null };
  course: { id: string; title: string };
}

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
    </div>
  );
}

export default function StudentsPage() {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get<{ enrollments: Enrollment[] }>('/enrollments/students')
      .then(({ enrollments }) => setEnrollments(enrollments))
      .catch(() => setEnrollments([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = enrollments.filter(e =>
    search.trim() === '' ||
    e.user.name.toLowerCase().includes(search.toLowerCase()) ||
    e.user.email.toLowerCase().includes(search.toLowerCase()) ||
    e.course.title.toLowerCase().includes(search.toLowerCase())
  );

  const total       = filtered.length;
  const active      = filtered.filter(e => e.status === 'ACTIVE').length;
  const completed   = filtered.filter(e => e.status === 'COMPLETED').length;
  const avgProgress = total > 0
    ? Math.round(filtered.reduce((a, e) => a + e.progressPercent, 0) / total)
    : 0;

  function statusConfig(e: Enrollment) {
    if (e.status === 'COMPLETED') return { label: 'Completed', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' };
    if (e.progressPercent < 25) return { label: 'At Risk', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' };
    if (e.status === 'SUSPENDED') return { label: 'Suspended', bg: 'bg-slate-100', text: 'text-slate-500', dot: 'bg-slate-400' };
    return { label: 'Active', bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' };
  }

  async function startConversation(userId: string) {
    try {
      const { conversationId } = await api.post<{ conversationId: string }>('/messages/conversations', { receiverId: userId });
      navigate(`/teacher/messages?conversation=${conversationId}`);
    } catch {
      // ignore
    }
  }

  return (
    <div className="space-y-6 max-w-6xl pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-foreground">Students</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Monitor progress and engagement across your courses</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Enrollments', value: loading ? '—' : total,           icon: Users,      iconBg: 'bg-blue-50',    iconColor: 'text-blue-600' },
          { label: 'Active Learners',   value: loading ? '—' : active,          icon: TrendingUp, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
          { label: 'Completed',         value: loading ? '—' : completed,        icon: Clock,      iconBg: 'bg-amber-50',   iconColor: 'text-amber-600' },
          { label: 'Avg. Progress',     value: loading ? '—' : `${avgProgress}%`, icon: TrendingUp, iconBg: 'bg-violet-50',  iconColor: 'text-violet-600' },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${s.iconBg}`}>
              <s.icon className={`w-4 h-4 ${s.iconColor}`} />
            </div>
            <p className="font-heading text-2xl font-extrabold text-foreground leading-none">{s.value}</p>
            <p className="text-xs font-medium text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-heading font-bold text-foreground text-base">All Students</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              placeholder="Search students…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-border bg-muted/50 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue w-44 transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="divide-y divide-border/50">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-4 animate-pulse">
                <div className="w-8 h-8 rounded-xl bg-muted shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-muted rounded w-36" />
                  <div className="h-3 bg-muted rounded w-52" />
                </div>
                <div className="h-6 w-20 bg-muted rounded-full" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-heading font-semibold text-foreground mb-1">No students yet</p>
            <p className="text-sm text-muted-foreground">Students will appear here once they enrol in your courses.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-left px-6 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wide">Student</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wide">Course</th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wide">Progress</th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wide">Status</th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wide">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filtered.map((e) => {
                    const cfg = statusConfig(e);
                    const barColor = e.progressPercent >= 80 ? 'bg-emerald-500' : e.progressPercent >= 40 ? 'bg-primary-blue' : 'bg-amber-500';
                    const initials = e.user.name.split(' ').map(n => n[0]).join('').slice(0, 2);
                    return (
                      <tr key={e.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {e.user.image ? (
                              <img src={e.user.image} alt={e.user.name} className="w-8 h-8 rounded-xl object-cover shrink-0" />
                            ) : (
                              <div className="w-8 h-8 rounded-xl bg-primary-blue flex items-center justify-center shrink-0">
                                <span className="text-white text-[10px] font-bold">{initials}</span>
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-foreground">{e.user.name}</p>
                              <p className="text-xs text-muted-foreground">{e.user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-muted-foreground text-sm">{e.course.title}</td>
                        <td className="px-4 py-4">
                          <div className="w-24 mx-auto">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-muted-foreground">{Math.round(e.progressPercent)}%</span>
                            </div>
                            <ProgressBar value={e.progressPercent} color={barColor} />
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} shrink-0`} />
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button
                            onClick={() => startConversation(e.user.id)}
                            className="w-7 h-7 rounded-xl bg-muted/50 border border-border flex items-center justify-center hover:bg-primary-blue hover:border-primary-blue hover:text-white text-muted-foreground transition-all mx-auto"
                            title="Message student"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <span>Showing {filtered.length} enrollment{filtered.length !== 1 ? 's' : ''}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
