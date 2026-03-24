import { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function NewsletterSection() {
  const { t } = useLanguage();
  const [email, setEmail]     = useState('');
  const [status, setStatus]   = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL ?? ''}/api/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong');
      setStatus('success');
      setEmail('');
    } catch (err: unknown) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Failed to subscribe. Please try again.');
    }
  }

  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <div className="absolute -left-32 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#023064]/4 blur-3xl" />
        <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#E11D48]/4 blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="w-6 h-0.5 bg-[#E11D48]" />
          <p className="text-sm font-bold text-[#E11D48] uppercase tracking-[0.15em]">{t.newsletter.badge}</p>
          <span className="w-6 h-0.5 bg-[#E11D48]" />
        </div>

        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight mb-4">
          {t.newsletter.title}
        </h2>
        <p className="text-base text-gray-500 leading-relaxed mb-10 max-w-lg mx-auto">
          {t.newsletter.description}
        </p>

        {status === 'success' ? (
          <div className="inline-flex items-center gap-3 px-7 py-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="font-semibold text-base">{t.newsletter.subscribed}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
                placeholder={t.newsletter.placeholder}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#023064] focus:ring-2 focus:ring-[#023064]/10 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#023064] text-white font-bold text-sm rounded-xl hover:bg-[#012550] transition-all shadow-md shadow-[#023064]/20 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 shrink-0"
            >
              {status === 'loading' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>{t.newsletter.subscribe} <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="mt-3 text-sm text-[#E11D48] font-medium">{message}</p>
        )}

        <p className="mt-5 text-xs text-gray-400">
          {t.newsletter.privacy}{' '}
          <a href="/privacy-policy" className="underline hover:text-gray-600 transition-colors">{t.newsletter.privacyLink}</a>.{' '}
          {t.newsletter.unsubscribe}
        </p>
      </div>
    </section>
  );
}
