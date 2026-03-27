import { useState, useEffect, useRef } from 'react';
import {
  User, Mail, Phone, Camera, Lock, Eye, EyeOff,
  CheckCircle, AlertCircle, Calendar, ShieldCheck, Loader2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import FileUploader, { type UploadedFile } from '@/components/lms/FileUploader';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ProfileUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  image: string | null;
  phone: string | null;
  bio: string | null;
  createdAt: string;
  isActive: boolean;
}

interface Banner {
  type: 'success' | 'error';
  message: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function initials(name: string | null): string {
  if (!name) return '?';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-UG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const roleConfig: Record<string, { label: string; bg: string; text: string; border: string }> = {
  ADMIN:   { label: 'Admin',   bg: 'bg-rose-50',    text: 'text-rose-700',    border: 'border-rose-200' },
  TEACHER: { label: 'Teacher', bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200' },
  STUDENT: { label: 'Student', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function InlineBanner({ banner, onClose }: { banner: Banner; onClose: () => void }) {
  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-sm font-medium mb-5 ${
        banner.type === 'success'
          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
          : 'bg-red-50 border-red-200 text-red-800'
      }`}
    >
      {banner.type === 'success'
        ? <CheckCircle className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600" />
        : <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
      }
      <span className="flex-1">{banner.message}</span>
      <button onClick={onClose} className="opacity-60 hover:opacity-100 transition-opacity text-lg leading-none">×</button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { user: authUser, updateUser } = useAuth();

  // Profile state
  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Edit form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileBanner, setProfileBanner] = useState<Banner | null>(null);
  const [imagePreviewError, setImagePreviewError] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordBanner, setPasswordBanner] = useState<Banner | null>(null);

  // Load profile
  useEffect(() => {
    api.get<{ user: ProfileUser }>('/profile')
      .then(({ user }) => {
        setProfile(user);
        setName(user.name ?? '');
        setPhone(user.phone ?? '');
        setBio(user.bio ?? '');
        setImageUrl(user.image ?? '');
      })
      .catch(() => {
        // Fallback: use auth context data
        if (authUser) {
          const fallback: ProfileUser = {
            id: authUser.id,
            name: authUser.name,
            email: authUser.email,
            role: authUser.role,
            image: authUser.image,
            phone: null,
            bio: null,
            createdAt: new Date().toISOString(),
            isActive: true,
          };
          setProfile(fallback);
          setName(authUser.name ?? '');
          setImageUrl(authUser.image ?? '');
        }
      })
      .finally(() => setLoadingProfile(false));
  }, [authUser]);

  // ─── Camera icon quick-upload ────────────────────────────────────────────────

  const handleCameraUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    setAvatarUploading(true);
    try {
      const token = localStorage.getItem('token');
      const form = new FormData();
      form.append('file', file);
      const res = await fetch(`${import.meta.env.VITE_API_URL ?? ''}/api/upload/avatar`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      });
      if (!res.ok) throw new Error('Upload failed');
      const { url } = await res.json();
      setImageUrl(url);
      setImagePreviewError(false);
      // Auto-save the new image immediately
      const { user: updated } = await api.patch<{ user: ProfileUser }>('/profile', { image: url });
      setProfile(updated);
      updateUser({ image: updated.image });
      setProfileBanner({ type: 'success', message: 'Profile picture updated.' });
    } catch {
      setProfileBanner({ type: 'error', message: 'Failed to upload photo.' });
    } finally {
      setAvatarUploading(false);
    }
  };

  // ─── Save profile ───────────────────────────────────────────────────────────

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileBanner(null);
    try {
      const { user: updated } = await api.patch<{ user: ProfileUser }>('/profile', {
        name: name.trim() || undefined,
        phone: phone.trim() || undefined,
        bio: bio.trim() || undefined,
        image: imageUrl || undefined,
      });
      setProfile(updated);
      setName(updated.name ?? '');
      setPhone(updated.phone ?? '');
      setBio(updated.bio ?? '');
      setImageUrl(updated.image ?? '');
      // Propagate image + name to AuthContext so sidebar/topbar update
      updateUser({ name: updated.name, image: updated.image });
      setProfileBanner({ type: 'success', message: 'Profile updated successfully.' });
    } catch (err) {
      setProfileBanner({ type: 'error', message: err instanceof Error ? err.message : 'Failed to update profile.' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordBanner(null);
    if (newPassword !== confirmPassword) {
      setPasswordBanner({ type: 'error', message: 'New password and confirmation do not match.' });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordBanner({ type: 'error', message: 'New password must be at least 8 characters.' });
      return;
    }
    setSavingPassword(true);
    try {
      await api.patch<{ success: true }>('/profile/password', { currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordBanner({ type: 'success', message: 'Password changed successfully.' });
    } catch (err) {
      setPasswordBanner({ type: 'error', message: err instanceof Error ? err.message : 'Failed to change password.' });
    } finally {
      setSavingPassword(false);
    }
  };

  // ─── Loading state ────────────────────────────────────────────────────────

  if (loadingProfile) {
    return (
      <div className="max-w-5xl space-y-6 pb-8">
        <div className="h-7 w-40 bg-muted rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-card border border-border rounded-2xl p-6 space-y-4 animate-pulse">
            <div className="w-24 h-24 rounded-full bg-muted mx-auto" />
            <div className="h-5 bg-muted rounded w-3/4 mx-auto" />
            <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
          </div>
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 animate-pulse space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 bg-muted rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const roleCfg = roleConfig[profile?.role ?? ''] ?? { label: profile?.role ?? 'User', bg: 'bg-slate-50', text: 'text-foreground', border: 'border-border' };
  const avatarBg = profile?.role === 'ADMIN' ? 'bg-rose-500' : profile?.role === 'TEACHER' ? 'bg-blue-600' : 'bg-emerald-600';

  return (
    <div className="max-w-5xl space-y-6 pb-10">

      {/* Page header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">My Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your personal information and account security</p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Avatar + info card */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-2xl p-6 text-center sticky top-6">
            {/* Avatar */}
            <div className="relative inline-block mb-4">
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleCameraUpload}
              />
              {(imageUrl || profile?.image) && !imagePreviewError ? (
                /* ── Has photo: image + camera edit button ── */
                <>
                  <img
                    src={imageUrl || profile?.image || ''}
                    alt={profile?.name ?? 'Avatar'}
                    onError={() => setImagePreviewError(true)}
                    className="w-28 h-28 rounded-full object-cover border-4 border-border shadow-md mx-auto"
                  />
                  <button
                    type="button"
                    title="Change profile picture"
                    onClick={() => cameraInputRef.current?.click()}
                    disabled={avatarUploading}
                    className="absolute bottom-1 right-1 w-7 h-7 bg-primary-blue border-2 border-card rounded-full flex items-center justify-center shadow-sm hover:bg-blue-900 transition-colors disabled:opacity-70"
                  >
                    {avatarUploading
                      ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                      : <Camera className="w-3.5 h-3.5 text-white" />
                    }
                  </button>
                </>
              ) : (
                /* ── No photo: initials only ── */
                <div className={`w-28 h-28 rounded-full ${avatarBg} flex items-center justify-center border-4 border-border shadow-md mx-auto`}>
                  <span className="text-white text-3xl font-bold">{initials(profile?.name ?? null)}</span>
                </div>
              )}
            </div>

            {/* Name */}
            <h2 className="font-heading text-lg font-bold text-foreground">
              {profile?.name ?? 'Your Name'}
            </h2>

            {/* Role badge */}
            <div className="mt-2 flex justify-center">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${roleCfg.bg} ${roleCfg.text} ${roleCfg.border}`}>
                <ShieldCheck className="w-3 h-3" />
                {roleCfg.label}
              </span>
            </div>

            {/* Info rows */}
            <div className="mt-5 space-y-3 text-left">
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <span className="text-sm text-foreground break-all">{profile?.email}</span>
              </div>
              {profile?.phone && (
                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <span className="text-sm text-foreground">{profile.phone}</span>
                </div>
              )}
              {profile?.createdAt && (
                <div className="flex items-start gap-2.5">
                  <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <span className="text-sm text-muted-foreground">Joined {formatDate(profile.createdAt)}</span>
                </div>
              )}
            </div>

            {/* Active status */}
            <div className="mt-5 flex items-center justify-center gap-2">
              <div className={`w-2 h-2 rounded-full ${profile?.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              <span className="text-xs text-muted-foreground font-medium">
                {profile?.isActive ? 'Active account' : 'Inactive account'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Edit forms */}
        <div className="lg:col-span-2 space-y-6">

          {/* Personal Information card */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-xl bg-primary-blue/10 flex items-center justify-center">
                <User className="w-4 h-4 text-primary-blue" />
              </div>
              <h3 className="font-heading font-bold text-foreground">Personal Information</h3>
            </div>

            {profileBanner && (
              <InlineBanner banner={profileBanner} onClose={() => setProfileBanner(null)} />
            )}

            <form onSubmit={handleSaveProfile} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition"
                />
              </div>

              {/* Email (read-only) */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={profile?.email ?? ''}
                    readOnly
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted text-sm text-muted-foreground outline-none cursor-not-allowed"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground bg-border px-2 py-0.5 rounded-lg">
                    Read-only
                  </span>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+256 700 000 000"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us a little about yourself..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition resize-none"
                />
              </div>

              {/* Profile picture section */}
              <div className="border-t border-border pt-5">
                <div className="flex items-center gap-2 mb-3">
                  <Camera className="w-4 h-4 text-muted-foreground" />
                  <h4 className="text-sm font-semibold text-foreground">Profile Picture</h4>
                </div>
                <FileUploader
                  endpoint="/api/upload/avatar"
                  accept="image/*"
                  maxSizeMb={3}
                  imagePreview
                  value={imageUrl ? { url: imageUrl, fileName: imageUrl.split('/').pop() ?? 'avatar', size: 0 } : null}
                  onChange={(f: UploadedFile | null) => {
                    setImageUrl(f?.url ?? '');
                    setImagePreviewError(false);
                  }}
                  label="Upload photo"
                  hint="JPG, PNG, WebP, up to 3 MB"
                />
              </div>

              {/* Save button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-blue text-white text-sm font-bold rounded-xl hover:bg-blue-900 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                >
                  {savingProfile ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Security / Change password card */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center">
                <Lock className="w-4 h-4 text-rose-600" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-foreground">Security</h3>
                <p className="text-xs text-muted-foreground">Update your password to keep your account secure</p>
              </div>
            </div>

            {passwordBanner && (
              <InlineBanner banner={passwordBanner} onClose={() => setPasswordBanner(null)} />
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              {/* Current password */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPw ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    required
                    className="w-full px-4 py-2.5 pr-11 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New password */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPw ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    required
                    className="w-full px-4 py-2.5 pr-11 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {newPassword.length > 0 && newPassword.length < 8 && (
                  <p className="mt-1 text-xs text-amber-600">Password must be at least 8 characters.</p>
                )}
              </div>

              {/* Confirm new password */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPw ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    required
                    className="w-full px-4 py-2.5 pr-11 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">Passwords do not match.</p>
                )}
              </div>

              {/* Submit button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={savingPassword || !currentPassword || !newPassword || !confirmPassword}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-rose-600 text-white text-sm font-bold rounded-xl hover:bg-rose-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                >
                  {savingPassword ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Change Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
