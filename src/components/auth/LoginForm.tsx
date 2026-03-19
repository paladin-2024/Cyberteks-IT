import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

export default function LoginForm() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) { setError('Please enter your email.'); return; }
    if (!password) { setError('Please enter your password.'); return; }

    setLoading(true);
    try {
      await login(email, password);
      // Redirect based on role — user is now set in context
      // Re-read from context after login
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        // Decode role from JWT payload (base64)
        try {
          const payload = JSON.parse(atob(storedToken.split('.')[1]));
          const role = (payload.role ?? '').toLowerCase();
          if (role === 'admin') navigate('/admin/dashboard');
          else if (role === 'teacher') navigate('/teacher/dashboard');
          else navigate('/student/dashboard');
        } catch {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-foreground mb-1">Welcome back</h1>
      <p className="text-muted-foreground mb-8">Sign in to continue to your dashboard.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Email Address">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className={inputCls(false)}
          />
        </Field>

        <Field label="Password">
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className={cn(inputCls(false), 'pr-11')}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </Field>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer text-muted-foreground">
            <input type="checkbox" className="accent-primary-blue" />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-primary-red hover:underline font-medium">
            Forgot password?
          </Link>
        </div>

        {error && (
          <div className="px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-primary-blue text-white font-semibold rounded-xl hover:bg-blue-900 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : 'Sign In'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Want to join our programs?{' '}
        <Link to="/apply" className="text-primary-red font-semibold hover:underline">
          Apply here
        </Link>
      </p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {children}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return cn(
    'w-full px-4 py-2.5 rounded-xl border bg-background text-foreground text-sm placeholder:text-muted-foreground outline-none transition-all focus:ring-2',
    hasError
      ? 'border-destructive focus:ring-destructive/20'
      : 'border-border focus:border-primary-blue focus:ring-primary-blue/10'
  );
}
