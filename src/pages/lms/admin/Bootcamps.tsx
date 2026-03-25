import { useState, useEffect, useCallback } from 'react';
import {
  Rocket, Plus, Pencil, Trash2, ExternalLink, X, Loader2,
  Calendar, CheckCircle2, XCircle, Clock, Link2,
} from 'lucide-react';
import { api } from '@/lib/api';

interface Bootcamp {
  id: string;
  title: string;
  description: string;
  bannerImage: string | null;
  expiresAt: string;
  isActive: boolean;
  groupChatLink: string | null;
  createdAt: string;
}

const BLANK = {
  title: '',
  description: '',
  bannerImage: '',
  expiresAt: '',
  isActive: true,
  groupChatLink: '',
};

function daysLeft(expiresAt: string): number {
  return Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 86400000);
}

function fmt(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-UG', { day: 'numeric', month: 'short', year: 'numeric' });
}

function toInputDate(dateStr: string): string {
  return new Date(dateStr).toISOString().slice(0, 10);
}

function twoWeeksFromNow(): string {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().slice(0, 10);
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function BootcampModal({
  initial,
  onClose,
  onSaved,
}: {
  initial: Bootcamp | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!initial;
  const [form, setForm] = useState(
    isEdit
      ? {
          title:         initial!.title,
          description:   initial!.description,
          bannerImage:   initial!.bannerImage ?? '',
          expiresAt:     toInputDate(initial!.expiresAt),
          isActive:      initial!.isActive,
          groupChatLink: initial!.groupChatLink ?? '',
        }
      : { ...BLANK, expiresAt: twoWeeksFromNow() }
  );
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.expiresAt) {
      setErr('Title, description and expiry date are required.');
      return;
    }
    setSaving(true); setErr('');
    try {
      const payload = {
        title:         form.title.trim(),
        description:   form.description.trim(),
        bannerImage:   form.bannerImage.trim() || undefined,
        expiresAt:     form.expiresAt,
        isActive:      form.isActive,
        groupChatLink: form.groupChatLink.trim() || undefined,
      };
      if (isEdit) {
        await api.patch(`/bootcamps/${initial!.id}`, payload);
      } else {
        await api.post('/bootcamps', payload);
      }
      onSaved();
    } catch (e: any) {
      setErr(e.message ?? 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-[#E11D48]" />
            <h2 className="font-bold text-gray-900">{isEdit ? 'Edit Bootcamp' : 'New Free Bootcamp'}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Title *</label>
            <input value={form.title} onChange={e => set('title', e.target.value)}
              placeholder="e.g. Python Programming Bootcamp"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#023064] focus:ring-2 focus:ring-[#023064]/10" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description *</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              rows={4} placeholder="Describe the bootcamp, who it's for, what they'll learn..."
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none resize-none focus:border-[#023064] focus:ring-2 focus:ring-[#023064]/10" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Banner Image URL</label>
            <input value={form.bannerImage} onChange={e => set('bannerImage', e.target.value)}
              placeholder="https://... (optional)"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#023064] focus:ring-2 focus:ring-[#023064]/10" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Expiry Date *</label>
              <input type="date" value={form.expiresAt} onChange={e => set('expiresAt', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#023064] focus:ring-2 focus:ring-[#023064]/10" />
            </div>
            <div className="flex flex-col justify-end pb-0.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => set('isActive', !form.isActive)}
                  className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${form.isActive ? 'bg-emerald-500' : 'bg-gray-200'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${form.isActive ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              <span className="flex items-center gap-1"><Link2 className="w-3.5 h-3.5" /> WhatsApp / Group Chat Link</span>
            </label>
            <input value={form.groupChatLink} onChange={e => set('groupChatLink', e.target.value)}
              placeholder="https://chat.whatsapp.com/..."
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#023064] focus:ring-2 focus:ring-[#023064]/10" />
          </div>

          {err && <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">{err}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#E11D48] text-white text-sm font-bold hover:bg-rose-700 transition-colors disabled:opacity-70">
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {isEdit ? 'Save Changes' : 'Create Bootcamp'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Delete confirmation ──────────────────────────────────────────────────────
function DeleteConfirm({ title, onConfirm, onCancel }: { title: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
        <h3 className="font-bold text-gray-900 mb-2">Delete Bootcamp</h3>
        <p className="text-sm text-gray-500 mb-5">Are you sure you want to delete <strong>{title}</strong>? This cannot be undone.</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700">Delete</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AdminBootcamps() {
  const [bootcamps, setBootcamps] = useState<Bootcamp[]>([]);
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState<'create' | Bootcamp | null>(null);
  const [deleting, setDeleting]   = useState<Bootcamp | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<{ bootcamps: Bootcamp[] }>('/bootcamps/all');
      setBootcamps(data.bootcamps ?? []);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    if (!deleting) return;
    await api.delete(`/bootcamps/${deleting.id}`);
    setDeleting(null);
    load();
  };

  const handleToggleActive = async (bc: Bootcamp) => {
    await api.patch(`/bootcamps/${bc.id}`, { isActive: !bc.isActive });
    load();
  };

  const active  = bootcamps.filter(b => b.isActive && daysLeft(b.expiresAt) > 0);
  const expired = bootcamps.filter(b => !b.isActive || daysLeft(b.expiresAt) <= 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Rocket className="w-5 h-5 text-[#E11D48]" /> Free Bootcamps
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage free bootcamp banners shown on the ICT Skilling page.</p>
        </div>
        <button onClick={() => setModal('create')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E11D48] text-white text-sm font-bold hover:bg-rose-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> New Bootcamp
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total', value: bootcamps.length, color: 'text-foreground' },
          { label: 'Active', value: active.length, color: 'text-emerald-600' },
          { label: 'Expired / Inactive', value: expired.length, color: 'text-gray-400' },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-4">
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : bootcamps.length === 0 ? (
        <div className="bg-card border border-dashed border-border rounded-2xl py-16 text-center">
          <Rocket className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
          <p className="font-semibold text-muted-foreground">No bootcamps yet</p>
          <p className="text-sm text-muted-foreground/60 mt-1">Click "New Bootcamp" to create your first one.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bootcamps.map(bc => {
            const days    = daysLeft(bc.expiresAt);
            const live    = bc.isActive && days > 0;
            const expired = days <= 0;
            return (
              <div key={bc.id} className={`bg-card border rounded-2xl p-5 flex gap-4 ${live ? 'border-emerald-200' : 'border-border opacity-60'}`}>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${live ? 'bg-emerald-50' : 'bg-gray-100'}`}>
                  <Rocket className={`w-5 h-5 ${live ? 'text-emerald-600' : 'text-gray-400'}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-foreground">{bc.title}</h3>
                        {live && (
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase tracking-wide">Live</span>
                        )}
                        {expired && (
                          <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full uppercase tracking-wide">Expired</span>
                        )}
                        {!bc.isActive && !expired && (
                          <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full uppercase tracking-wide">Inactive</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{bc.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Expires {fmt(bc.expiresAt)}
                      {live && <span className={`ml-1 font-semibold ${days <= 3 ? 'text-red-500' : 'text-emerald-600'}`}>({days}d left)</span>}
                    </span>
                    {bc.groupChatLink && (
                      <a href={bc.groupChatLink} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[#25D366] hover:underline font-medium">
                        <ExternalLink className="w-3 h-3" /> WhatsApp Group
                      </a>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => handleToggleActive(bc)} title={bc.isActive ? 'Deactivate' : 'Activate'}
                    className="p-2 rounded-lg hover:bg-muted transition-colors">
                    {bc.isActive ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-gray-400" />}
                  </button>
                  <button onClick={() => setModal(bc)} title="Edit"
                    className="p-2 rounded-lg hover:bg-muted transition-colors">
                    <Pencil className="w-4 h-4 text-gray-500" />
                  </button>
                  <button onClick={() => setDeleting(bc)} title="Delete"
                    className="p-2 rounded-lg hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {modal && (
        <BootcampModal
          initial={modal === 'create' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load(); }}
        />
      )}
      {deleting && (
        <DeleteConfirm
          title={deleting.title}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
