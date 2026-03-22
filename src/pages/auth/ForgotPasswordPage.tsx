import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, Mail, KeyRound, Lock } from 'lucide-react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

type Step = 'email' | 'otp' | 'password' | 'done';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep]           = useState<Step>('email');
  const [email, setEmail]         = useState('');
  const [otp, setOtp]             = useState(['', '', '', '', '', '']);
  const [resetToken, setResetToken] = useState('');
  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ── Step 1: send OTP ───────────────────────────────────────────────────────
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) { setError('Please enter your email.'); return; }
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setStep('otp');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── OTP input helpers ──────────────────────────────────────────────────────
  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('');
    if (digits.length === 6) {
      setOtp(digits);
      otpRefs.current[5]?.focus();
    }
  };

  // ── Step 2: verify OTP ─────────────────────────────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const code = otp.join('');
    if (code.length < 6) { setError('Please enter the full 6-digit code.'); return; }
    setLoading(true);
    try {
      const res = await api.post<{ resetToken: string }>('/auth/verify-otp', { email, code });
      setResetToken(res.resetToken);
      setStep('password');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      setError(msg || 'Invalid or expired code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: set new password ───────────────────────────────────────────────
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { resetToken, password });
      setStep('done');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      setError(msg || 'Failed to reset password. Please start over.');
    } finally {
      setLoading(false);
    }
  };

  // ── Success ────────────────────────────────────────────────────────────────
  if (step === 'done') {
    return (
      <div className="text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7 text-emerald-500" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-foreground mb-2">Password Updated!</h1>
        <p className="text-muted-foreground mb-6">Your password has been reset. You can now log in.</p>
        <button
          onClick={() => navigate('/login')}
          className="w-full py-3 bg-primary-blue text-white font-semibold rounded-xl hover:bg-blue-900 transition-all"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {(['email', 'otp', 'password'] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn(
              'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all',
              step === s ? 'bg-primary-blue text-white' :
              ['email','otp','password'].indexOf(step) > i ? 'bg-emerald-500 text-white' :
              'bg-muted text-muted-foreground',
            )}>
              {['email','otp','password'].indexOf(step) > i ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
            </div>
            {i < 2 && <div className={cn('h-0.5 w-8', ['email','otp','password'].indexOf(step) > i ? 'bg-emerald-500' : 'bg-muted')} />}
          </div>
        ))}
      </div>

      {/* ── Step 1: Email ── */}
      {step === 'email' && (
        <>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary-blue/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-primary-blue" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold text-foreground">Forgot password?</h1>
              <p className="text-muted-foreground text-sm">We'll send a 6-digit code to your email.</p>
            </div>
          </div>
          <form onSubmit={handleSendOtp} className="space-y-4 mt-6">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:border-primary-blue focus:ring-primary-blue/10"
              />
            </div>
            {error && <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-xl border border-destructive/20">{error}</p>}
            <button type="submit" disabled={loading} className="w-full py-3 bg-primary-blue text-white font-semibold rounded-xl hover:bg-blue-900 disabled:opacity-60 transition-all flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</> : 'Send Code'}
            </button>
          </form>
        </>
      )}

      {/* ── Step 2: OTP ── */}
      {step === 'otp' && (
        <>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary-blue/10 flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-primary-blue" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold text-foreground">Enter the code</h1>
              <p className="text-muted-foreground text-sm">Sent to <span className="font-medium text-foreground">{email}</span></p>
            </div>
          </div>
          <form onSubmit={handleVerifyOtp} className="space-y-5 mt-6">
            <div>
              <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                {otp.map((d, i) => (
                  <input
                    key={i}
                    ref={el => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    className={cn(
                      'w-12 h-14 text-center text-2xl font-bold rounded-xl border bg-background text-foreground outline-none transition-all',
                      d ? 'border-primary-blue ring-2 ring-primary-blue/20' : 'border-border',
                      'focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20',
                    )}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-center mt-3">Code expires in 10 minutes</p>
            </div>
            {error && <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-xl border border-destructive/20">{error}</p>}
            <button type="submit" disabled={loading || otp.join('').length < 6} className="w-full py-3 bg-primary-blue text-white font-semibold rounded-xl hover:bg-blue-900 disabled:opacity-60 transition-all flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying…</> : 'Verify Code'}
            </button>
            <button type="button" onClick={() => { setOtp(['','','','','','']); handleSendOtp({ preventDefault: () => {} } as React.FormEvent); }} className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors">
              Didn't receive it? Resend code
            </button>
          </form>
        </>
      )}

      {/* ── Step 3: New password ── */}
      {step === 'password' && (
        <>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary-blue/10 flex items-center justify-center">
              <Lock className="w-5 h-5 text-primary-blue" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold text-foreground">New password</h1>
              <p className="text-muted-foreground text-sm">Choose a strong password.</p>
            </div>
          </div>
          <form onSubmit={handleResetPassword} className="space-y-4 mt-6">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">New password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:border-primary-blue focus:ring-primary-blue/10"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Confirm password</label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Repeat your password"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:border-primary-blue focus:ring-primary-blue/10"
              />
            </div>
            {error && <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-xl border border-destructive/20">{error}</p>}
            <button type="submit" disabled={loading} className="w-full py-3 bg-primary-blue text-white font-semibold rounded-xl hover:bg-blue-900 disabled:opacity-60 transition-all flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : 'Reset Password'}
            </button>
          </form>
        </>
      )}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Remember your password?{' '}
        <Link to="/login" className="text-primary-red font-semibold hover:underline">Back to login</Link>
      </p>
    </div>
  );
}
