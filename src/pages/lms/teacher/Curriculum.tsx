import { useState, useEffect, useCallback } from 'react';
import {
  BookOpen, Plus, Trash2, ChevronDown, ChevronUp,
  Pencil, Check, X, Clock, Video, FileText,
  ClipboardList, Presentation, Loader2, GraduationCap, Link2,
} from 'lucide-react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

interface Topic {
  id: string;
  title: string;
  description: string | null;
  duration: string | null;
  type: string;
  order: number;
  meetLink: string | null;
  meetScheduledAt: string | null;
}

interface Week {
  id: string;
  weekNumber: number;
  title: string;
  topics: Topic[];
}

interface Course {
  id: string;
  title: string;
  category: string | null;
}

const TOPIC_TYPES = [
  { value: 'lecture',    label: 'Lecture',    icon: Presentation },
  { value: 'lab',        label: 'Lab / Practice', icon: BookOpen },
  { value: 'quiz',       label: 'Quiz',       icon: ClipboardList },
  { value: 'assignment', label: 'Assignment', icon: FileText },
  { value: 'video',      label: 'Video',      icon: Video },
];

function typeConfig(type: string) {
  return TOPIC_TYPES.find(t => t.value === type) ?? TOPIC_TYPES[0];
}

function TopicTypeBadge({ type }: { type: string }) {
  const cfg = typeConfig(type);
  const Icon = cfg.icon;
  const colors: Record<string, string> = {
    lecture:    'bg-blue-50 text-blue-700 border-blue-100',
    lab:        'bg-teal-50 text-teal-700 border-teal-100',
    quiz:       'bg-amber-50 text-amber-700 border-amber-100',
    assignment: 'bg-violet-50 text-violet-700 border-violet-100',
    video:      'bg-rose-50 text-rose-700 border-rose-100',
  };
  return (
    <span className={cn('inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border', colors[type] ?? colors.lecture)}>
      <Icon className="w-2.5 h-2.5" /> {cfg.label}
    </span>
  );
}

export default function CurriculumPage() {
  const [courses, setCourses]         = useState<Course[]>([]);
  const [selectedCourse, setSelected] = useState<string>('');
  const [weeks, setWeeks]             = useState<Week[]>([]);
  const [loading, setLoading]         = useState(false);
  const [expanded, setExpanded]       = useState<Set<string>>(new Set());

  // Add week form
  const [addingWeek, setAddingWeek]   = useState(false);
  const [weekTitle, setWeekTitle]     = useState('');
  const [savingWeek, setSavingWeek]   = useState(false);

  // Edit week
  const [editWeekId, setEditWeekId]   = useState<string | null>(null);
  const [editWeekTitle, setEditWeekTitle] = useState('');

  // Add topic
  const [addingTopicWeekId, setAddingTopicWeekId] = useState<string | null>(null);
  const [topicForm, setTopicForm] = useState({ title: '', description: '', duration: '', type: 'lecture' });
  const [savingTopic, setSavingTopic] = useState(false);

  // Edit topic
  const [editTopicId, setEditTopicId] = useState<string | null>(null);
  const [editTopicForm, setEditTopicForm] = useState({ title: '', description: '', duration: '', type: 'lecture', meetLink: '' });

  // Load teacher's courses
  useEffect(() => {
    api.get<{ courses: Course[] }>('/courses/my')
      .then(d => {
        setCourses(d.courses ?? []);
        if (d.courses?.length) setSelected(d.courses[0].id);
      })
      .catch(() => {});
  }, []);

  // Load curriculum for selected course
  const loadCurriculum = useCallback(() => {
    if (!selectedCourse) return;
    setLoading(true);
    api.get<{ weeks: Week[] }>(`/curriculum?courseId=${selectedCourse}`)
      .then(d => {
        setWeeks(d.weeks ?? []);
        setExpanded(new Set((d.weeks ?? []).map((w: Week) => w.id)));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedCourse]);

  useEffect(() => { loadCurriculum(); }, [loadCurriculum]);

  // ── Week actions ────────────────────────────────────────────────────────────
  const addWeek = async () => {
    if (!weekTitle.trim()) return;
    setSavingWeek(true);
    try {
      const next = (weeks.at(-1)?.weekNumber ?? 0) + 1;
      const res = await api.post<{ week: Week }>('/curriculum/weeks', {
        courseId: selectedCourse, weekNumber: next, title: weekTitle.trim(),
      });
      setWeeks(w => [...w, res.week]);
      setExpanded(e => new Set([...e, res.week.id]));
      setWeekTitle(''); setAddingWeek(false);
    } catch { /* noop */ } finally { setSavingWeek(false); }
  };

  const saveEditWeek = async (id: string) => {
    if (!editWeekTitle.trim()) return;
    try {
      const res = await api.patch<{ week: Week }>(`/curriculum/weeks/${id}`, { title: editWeekTitle });
      setWeeks(w => w.map(x => x.id === id ? res.week : x));
      setEditWeekId(null);
    } catch { /* noop */ }
  };

  const deleteWeek = async (id: string) => {
    if (!confirm('Delete this week and all its topics?')) return;
    try {
      await api.delete(`/curriculum/weeks/${id}`);
      setWeeks(w => w.filter(x => x.id !== id));
    } catch { /* noop */ }
  };

  // ── Topic actions ───────────────────────────────────────────────────────────
  const addTopic = async (weekId: string) => {
    if (!topicForm.title.trim()) return;
    setSavingTopic(true);
    try {
      const res = await api.post<{ topic: Topic }>('/curriculum/topics', {
        weekId, ...topicForm,
        description: topicForm.description || undefined,
        duration:    topicForm.duration    || undefined,
      });
      setWeeks(w => w.map(x => x.id === weekId ? { ...x, topics: [...x.topics, res.topic] } : x));
      setTopicForm({ title: '', description: '', duration: '', type: 'lecture' });
      setAddingTopicWeekId(null);
    } catch { /* noop */ } finally { setSavingTopic(false); }
  };

  const saveEditTopic = async (topicId: string, weekId: string) => {
    if (!editTopicForm.title.trim()) return;
    try {
      const res = await api.patch<{ topic: Topic }>(`/curriculum/topics/${topicId}`, {
        ...editTopicForm,
        description: editTopicForm.description || undefined,
        duration:    editTopicForm.duration    || undefined,
        meetLink:    editTopicForm.meetLink    || null,
      });
      setWeeks(w => w.map(x => x.id === weekId
        ? { ...x, topics: x.topics.map(t => t.id === topicId ? res.topic : t) }
        : x
      ));
      setEditTopicId(null);
    } catch { /* noop */ }
  };

  const deleteTopic = async (topicId: string, weekId: string) => {
    try {
      await api.delete(`/curriculum/topics/${topicId}`);
      setWeeks(w => w.map(x => x.id === weekId
        ? { ...x, topics: x.topics.filter(t => t.id !== topicId) }
        : x
      ));
    } catch { /* noop */ }
  };

  const moveTopic = async (topic: Topic, weekId: string, dir: 'up' | 'down') => {
    const week = weeks.find(w => w.id === weekId);
    if (!week) return;
    const idx = week.topics.findIndex(t => t.id === topic.id);
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= week.topics.length) return;

    const updated = [...week.topics];
    [updated[idx], updated[swapIdx]] = [updated[swapIdx], updated[idx]];

    // Update order values
    await Promise.all([
      api.patch(`/curriculum/topics/${updated[idx].id}`, { order: idx }),
      api.patch(`/curriculum/topics/${updated[swapIdx].id}`, { order: swapIdx }),
    ]).catch(() => {});

    setWeeks(w => w.map(x => x.id === weekId
      ? { ...x, topics: updated.map((t, i) => ({ ...t, order: i })) }
      : x
    ));
  };

  const selectedCourseName = courses.find(c => c.id === selectedCourse)?.title ?? '';

  return (
    <div className="space-y-6 max-w-4xl pb-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-heading text-xl font-bold text-foreground">Curriculum Planner</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Organise your weekly sessions and topics per course.</p>
        </div>

        {/* Course selector */}
        {courses.length > 1 && (
          <select
            value={selectedCourse}
            onChange={e => setSelected(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border bg-background text-sm font-medium text-foreground outline-none focus:border-primary-blue"
          >
            {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        )}
      </div>

      {/* No courses */}
      {courses.length === 0 && (
        <div className="bg-card border border-border rounded-2xl p-16 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary-blue/10 flex items-center justify-center mb-4">
            <GraduationCap className="w-8 h-8 text-primary-blue" />
          </div>
          <p className="font-heading font-semibold text-foreground">No courses yet</p>
          <p className="text-sm text-muted-foreground mt-1">Create a course first to start planning your curriculum.</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-3 justify-center py-16 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading curriculum…
        </div>
      )}

      {!loading && selectedCourse && (
        <>
          {/* Course label */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-primary-blue/5 border border-primary-blue/15 rounded-xl w-fit">
            <BookOpen className="w-4 h-4 text-primary-blue" />
            <span className="text-sm font-semibold text-primary-blue">{selectedCourseName}</span>
            <span className="text-xs text-muted-foreground">— {weeks.length} week{weeks.length !== 1 ? 's' : ''}</span>
          </div>

          {/* Weeks */}
          <div className="space-y-4">
            {weeks.map((week, wi) => {
              const isOpen = expanded.has(week.id);
              return (
                <div key={week.id} className="bg-card border border-border rounded-2xl overflow-hidden">
                  {/* Week header */}
                  <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-muted/30">
                    <div className="w-8 h-8 rounded-xl bg-primary-blue flex items-center justify-center shrink-0 text-xs font-bold text-white">
                      {week.weekNumber}
                    </div>

                    {editWeekId === week.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          autoFocus
                          value={editWeekTitle}
                          onChange={e => setEditWeekTitle(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') saveEditWeek(week.id); if (e.key === 'Escape') setEditWeekId(null); }}
                          className="flex-1 px-3 py-1.5 rounded-lg border border-border bg-background text-sm text-foreground outline-none focus:border-primary-blue"
                        />
                        <button onClick={() => saveEditWeek(week.id)} className="p-1.5 rounded-lg bg-primary-blue text-white hover:bg-blue-900"><Check className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setEditWeekId(null)} className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground"><X className="w-3.5 h-3.5" /></button>
                      </div>
                    ) : (
                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-semibold text-foreground text-sm">{week.title}</p>
                        <p className="text-xs text-muted-foreground">{week.topics.length} topic{week.topics.length !== 1 ? 's' : ''}</p>
                      </div>
                    )}

                    {editWeekId !== week.id && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => { setEditWeekId(week.id); setEditWeekTitle(week.title); }}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                          title="Edit week"
                        ><Pencil className="w-3.5 h-3.5" /></button>
                        <button
                          onClick={() => deleteWeek(week.id)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-primary-red hover:bg-red-50 transition-all"
                          title="Delete week"
                        ><Trash2 className="w-3.5 h-3.5" /></button>
                        <button
                          onClick={() => setExpanded(e => { const n = new Set(e); isOpen ? n.delete(week.id) : n.add(week.id); return n; })}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                        >{isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</button>
                      </div>
                    )}
                  </div>

                  {/* Topics list */}
                  {isOpen && (
                    <div className="divide-y divide-border">
                      {week.topics.length === 0 && addingTopicWeekId !== week.id && (
                        <p className="px-5 py-4 text-sm text-muted-foreground italic">No topics yet. Add one below.</p>
                      )}

                      {week.topics.map((topic, ti) => (
                        <div key={topic.id} className="px-5 py-3">
                          {editTopicId === topic.id ? (
                            /* Edit topic form */
                            <div className="space-y-3">
                              <div className="grid sm:grid-cols-2 gap-3">
                                <input
                                  autoFocus
                                  value={editTopicForm.title}
                                  onChange={e => setEditTopicForm(f => ({ ...f, title: e.target.value }))}
                                  placeholder="Topic title"
                                  className="px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground outline-none focus:border-primary-blue"
                                />
                                <input
                                  value={editTopicForm.duration}
                                  onChange={e => setEditTopicForm(f => ({ ...f, duration: e.target.value }))}
                                  placeholder="Duration (e.g. 45 min)"
                                  className="px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground outline-none focus:border-primary-blue"
                                />
                              </div>
                              <input
                                value={editTopicForm.description}
                                onChange={e => setEditTopicForm(f => ({ ...f, description: e.target.value }))}
                                placeholder="Description (optional)"
                                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground outline-none focus:border-primary-blue"
                              />
                              <div className="flex items-center gap-2">
                                <Link2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                <input
                                  value={editTopicForm.meetLink}
                                  onChange={e => setEditTopicForm(f => ({ ...f, meetLink: e.target.value }))}
                                  placeholder="Google Meet link for this session (optional)"
                                  className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground outline-none focus:border-primary-blue"
                                />
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                {TOPIC_TYPES.map(t => (
                                  <button key={t.value} type="button"
                                    onClick={() => setEditTopicForm(f => ({ ...f, type: t.value }))}
                                    className={cn('flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all',
                                      editTopicForm.type === t.value ? 'bg-primary-blue text-white border-primary-blue' : 'border-border text-muted-foreground hover:border-primary-blue/40'
                                    )}>
                                    <t.icon className="w-3 h-3" /> {t.label}
                                  </button>
                                ))}
                                <div className="ml-auto flex gap-2">
                                  <button onClick={() => saveEditTopic(topic.id, week.id)} className="px-3 py-1.5 bg-primary-blue text-white text-xs font-bold rounded-lg hover:bg-blue-900">Save</button>
                                  <button onClick={() => setEditTopicId(null)} className="px-3 py-1.5 border border-border text-xs font-medium rounded-lg text-muted-foreground hover:text-foreground">Cancel</button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            /* Topic row */
                            <div className="flex items-start gap-3">
                              <div className="w-6 h-6 rounded-lg bg-muted flex items-center justify-center shrink-0 text-[10px] font-bold text-muted-foreground mt-0.5">
                                {ti + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="font-medium text-sm text-foreground">{topic.title}</p>
                                  <TopicTypeBadge type={topic.type} />
                                  {topic.duration && (
                                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                      <Clock className="w-2.5 h-2.5" />{topic.duration}
                                    </span>
                                  )}
                                  {topic.meetLink && (
                                    <a
                                      href={topic.meetLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                                    >
                                      <Link2 className="w-2.5 h-2.5" /> Join Call
                                    </a>
                                  )}
                                </div>
                                {topic.description && (
                                  <p className="text-xs text-muted-foreground mt-0.5">{topic.description}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <button onClick={() => moveTopic(topic, week.id, 'up')} disabled={ti === 0}
                                  className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none">
                                  <ChevronUp className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => moveTopic(topic, week.id, 'down')} disabled={ti === week.topics.length - 1}
                                  className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none">
                                  <ChevronDown className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => { setEditTopicId(topic.id); setEditTopicForm({ title: topic.title, description: topic.description ?? '', duration: topic.duration ?? '', type: topic.type, meetLink: topic.meetLink ?? '' }); }}
                                  className="p-1 rounded text-muted-foreground hover:text-foreground transition-all">
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => deleteTopic(topic.id, week.id)}
                                  className="p-1 rounded text-muted-foreground hover:text-primary-red transition-all">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Add topic form */}
                      {addingTopicWeekId === week.id ? (
                        <div className="px-5 py-4 bg-muted/20 space-y-3">
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">New Topic</p>
                          <div className="grid sm:grid-cols-2 gap-3">
                            <input
                              autoFocus
                              value={topicForm.title}
                              onChange={e => setTopicForm(f => ({ ...f, title: e.target.value }))}
                              placeholder="Topic title *"
                              className="px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground outline-none focus:border-primary-blue"
                            />
                            <input
                              value={topicForm.duration}
                              onChange={e => setTopicForm(f => ({ ...f, duration: e.target.value }))}
                              placeholder="Duration (e.g. 45 min)"
                              className="px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground outline-none focus:border-primary-blue"
                            />
                          </div>
                          <input
                            value={topicForm.description}
                            onChange={e => setTopicForm(f => ({ ...f, description: e.target.value }))}
                            placeholder="Description (optional)"
                            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground outline-none focus:border-primary-blue"
                          />
                          <div className="flex items-center gap-2 flex-wrap">
                            {TOPIC_TYPES.map(t => (
                              <button key={t.value} type="button"
                                onClick={() => setTopicForm(f => ({ ...f, type: t.value }))}
                                className={cn('flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all',
                                  topicForm.type === t.value ? 'bg-primary-blue text-white border-primary-blue' : 'border-border text-muted-foreground hover:border-primary-blue/40'
                                )}>
                                <t.icon className="w-3 h-3" /> {t.label}
                              </button>
                            ))}
                            <div className="ml-auto flex gap-2">
                              <button onClick={() => addTopic(week.id)} disabled={savingTopic || !topicForm.title.trim()}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-blue text-white text-xs font-bold rounded-lg hover:bg-blue-900 disabled:opacity-50">
                                {savingTopic ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} Add
                              </button>
                              <button onClick={() => { setAddingTopicWeekId(null); setTopicForm({ title: '', description: '', duration: '', type: 'lecture' }); }}
                                className="px-3 py-1.5 border border-border text-xs rounded-lg text-muted-foreground hover:text-foreground">Cancel</button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="px-5 py-3">
                          <button
                            onClick={() => { setAddingTopicWeekId(week.id); setTopicForm({ title: '', description: '', duration: '', type: 'lecture' }); }}
                            className="flex items-center gap-1.5 text-xs font-semibold text-primary-blue hover:text-blue-900 transition-all"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Topic
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add week */}
          {addingWeek ? (
            <div className="bg-card border border-dashed border-primary-blue/40 rounded-2xl p-5 space-y-3">
              <p className="text-sm font-semibold text-foreground">
                Week {(weeks.at(-1)?.weekNumber ?? 0) + 1}
              </p>
              <input
                autoFocus
                value={weekTitle}
                onChange={e => setWeekTitle(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') addWeek(); if (e.key === 'Escape') { setAddingWeek(false); setWeekTitle(''); } }}
                placeholder="e.g. Introduction to HTML & CSS"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground outline-none focus:border-primary-blue"
              />
              <div className="flex gap-2">
                <button onClick={addWeek} disabled={savingWeek || !weekTitle.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-blue text-white text-sm font-bold rounded-xl hover:bg-blue-900 disabled:opacity-50">
                  {savingWeek ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Save Week
                </button>
                <button onClick={() => { setAddingWeek(false); setWeekTitle(''); }}
                  className="px-4 py-2 border border-border text-sm rounded-xl text-muted-foreground hover:text-foreground">Cancel</button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAddingWeek(true)}
              className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-border rounded-2xl text-sm font-semibold text-muted-foreground hover:border-primary-blue/40 hover:text-primary-blue transition-all"
            >
              <Plus className="w-4 h-4" /> Add Week
            </button>
          )}
        </>
      )}
    </div>
  );
}
