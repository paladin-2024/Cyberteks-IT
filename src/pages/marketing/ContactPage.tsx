import { useState, FormEvent } from 'react';
import {
  MapPin, Phone, Mail, Clock, MessageSquare,
  ChevronRight, CheckCircle2, Loader2, AlertTriangle,
  Linkedin, Twitter, Facebook, Instagram, Headphones,
} from 'lucide-react';
import PhoneInput, { type Country } from '@/components/ui/PhoneInput';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

const SOCIALS = [
  { icon: Linkedin,  href: 'https://linkedin.com/company/cyberteks-it', label: 'LinkedIn',  color: 'hover:bg-[#0077B5]' },
  { icon: Facebook,  href: 'https://facebook.com/cyberteksit',          label: 'Facebook',  color: 'hover:bg-[#1877F2]' },
  { icon: Twitter,   href: 'https://twitter.com/cyberteksit',           label: 'Twitter',   color: 'hover:bg-[#1DA1F2]' },
  { icon: Instagram, href: 'https://instagram.com/cyberteksit',         label: 'Instagram', color: 'hover:bg-[#E1306C]' },
];

// ─── Types ────────────────────────────────────────────────────────────────────

type FormData = {
  name: string; email: string; phone: string; topic: string; message: string;
};
const initial: FormData = { name: '', email: '', phone: '', topic: '', message: '' };

// ─── Field components ─────────────────────────────────────────────────────────

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
      {children}{required && <span className="text-primary-red ml-0.5">*</span>}
    </label>
  );
}

function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900',
        'placeholder:text-gray-400 outline-none transition-all',
        'focus:bg-white focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/10',
        className,
      )}
      {...props}
    />
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const { t } = useLanguage();
  const [fd, setFd]           = useState<FormData>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [done, setDone]       = useState(false);

  const contactItems = [
    { icon: Phone, label: t.contact.info.callUs, lines: [{ text: '+256 779 367 005 (MTN)', href: 'tel:+256779367005' }, { text: '+256 706 911 732 (Airtel)', href: 'tel:+256706911732' }] },
    { icon: Mail, label: t.contact.info.emailUs, lines: [{ text: 'info@cyberteks-it.com', href: 'mailto:info@cyberteks-it.com' }, { text: 'support@cyberteks-it.com', href: 'mailto:support@cyberteks-it.com' }] },
    { icon: MapPin, label: t.contact.info.visitUs, lines: [{ text: 'Plot 15, Nakasero Road', href: null }, { text: 'Kampala, Uganda', href: null }] },
    { icon: Clock, label: t.contact.info.workingHours, lines: [{ text: t.contact.info.workingHoursLine1, href: null }, { text: t.contact.info.workingHoursLine2, href: null }] },
  ];

  const set = (partial: Partial<FormData>) => setFd(prev => ({ ...prev, ...partial }));
  const handlePhone = (full: string, _n: string, _c: Country) => set({ phone: full });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!fd.name.trim() || !fd.email.trim() || !fd.message.trim()) return;
    setLoading(true); setError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL ?? ''}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fd),
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Submission failed');
      setDone(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = !loading && fd.name.trim() && fd.email.trim() && fd.message.trim();

  return (
    <div className="min-h-screen bg-[#f8f9fc]">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="relative bg-[#023064] overflow-hidden pt-12 pb-14 sm:pb-20">
        {/* Mesh glow */}
        <div className="absolute inset-0 bg-mesh-dark opacity-60 pointer-events-none" />
        {/* Decorative ring */}
        <div className="absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full border border-white/5 pointer-events-none" />
        <div className="absolute -top-12 -right-12 w-[300px] h-[300px] rounded-full border border-white/5 pointer-events-none" />
        {/* Red accent blob */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-32 bg-primary-red/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="inline-flex items-center gap-2 text-xs font-bold text-white/50 uppercase tracking-[0.2em] mb-5">
            <span className="w-6 h-px bg-white/30" />
            {t.contact.hero.badge}
            <span className="w-6 h-px bg-white/30" />
          </p>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white mb-5 leading-tight">
            {t.contact.hero.title1}{' '}
            <span className="text-primary-red">{t.contact.hero.title2}</span>
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto leading-relaxed">
            {t.contact.hero.subtitle}
          </p>
        </div>

      </div>

      {/* ── Main grid ─────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pb-24">
        <div className="grid lg:grid-cols-12 gap-8 items-start">

          {/* ── Left: dark info panel ─────────────────────────────────────── */}
          <div className="lg:col-span-4 xl:col-span-4">
            <div className="bg-[#023064] rounded-3xl overflow-hidden shadow-2xl">

              {/* Panel header */}
              <div className="px-5 sm:px-8 pt-6 sm:pt-8 pb-5 sm:pb-6 border-b border-white/10">
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">{t.contact.hero.badge}</p>
                <h2 className="font-display text-2xl font-extrabold text-white leading-tight">
                  {t.contact.info.title}
                </h2>
              </div>

              {/* Contact items */}
              <div className="px-5 sm:px-8 py-6 space-y-6">
                {contactItems.map(({ icon: Icon, label, lines }) => (
                  <div key={label} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4.5 h-4.5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1">{label}</p>
                      {lines.map((line, i) =>
                        line.href ? (
                          <a key={i} href={line.href}
                            className="block text-sm text-white/80 hover:text-white transition-colors">
                            {line.text}
                          </a>
                        ) : (
                          <p key={i} className="text-sm text-white/80">{line.text}</p>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Urgent support CTA */}
              <div className="mx-6 mb-6 rounded-2xl bg-primary-red/20 border border-primary-red/30 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-bold text-white/60 uppercase tracking-wide">{t.contact.info.support24}</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary-red/30 flex items-center justify-center shrink-0">
                    <Headphones className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white mb-0.5">{t.contact.info.urgentHelp}</p>
                    <p className="text-xs text-white/50 mb-3">{t.contact.info.urgentDesc}</p>
                    <a href="/get-started"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-primary-red px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors">
                      {t.contact.info.requestSupport} <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div className="px-5 sm:px-8 pb-6 sm:pb-8">
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">{t.contact.info.followUs}</p>
                <div className="flex gap-2">
                  {SOCIALS.map(({ icon: Icon, href, label, color }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                      className={cn(
                        'w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all',
                        color,
                      )}>
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: form + map ─────────────────────────────────────────── */}
          <div className="lg:col-span-8 xl:col-span-8 space-y-6">

            {/* Form card */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

              {/* Form header */}
              <div className="px-8 pt-8 pb-5 border-b border-gray-100 flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-primary-blue/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-primary-blue" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-extrabold text-gray-900">{t.contact.form.title}</h2>
                  <p className="text-sm text-gray-400 mt-0.5">{t.contact.form.subtitle}</p>
                </div>
              </div>

              {done ? (
                /* ── Success state ── */
                <div className="px-8 py-16 text-center">
                  <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h3 className="font-display text-2xl font-extrabold text-gray-900 mb-3">{t.contact.form.successTitle}</h3>
                  <p className="text-gray-500 max-w-sm mx-auto mb-8">
                    Thanks <span className="font-semibold text-gray-700">{fd.name}</span> — we'll reply to{' '}
                    <span className="font-semibold text-gray-700">{fd.email}</span> within 2 business hours.
                  </p>
                  <button
                    onClick={() => { setDone(false); setFd(initial); }}
                    className="px-6 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-semibold text-sm hover:bg-gray-200 transition-all"
                  >
                    {t.contact.form.sendAnother}
                  </button>
                </div>
              ) : (
                /* ── Form ── */
                <form onSubmit={submit} className="px-4 sm:px-8 py-6 sm:py-8 space-y-6">

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <FieldLabel required>{t.contact.form.fullName}</FieldLabel>
                      <Input
                        placeholder={t.contact.form.fullNamePlaceholder}
                        value={fd.name}
                        onChange={e => set({ name: e.target.value })}
                      />
                    </div>
                    <div>
                      <FieldLabel required>{t.contact.form.email}</FieldLabel>
                      <Input
                        type="email"
                        placeholder={t.contact.form.emailPlaceholder}
                        value={fd.email}
                        onChange={e => set({ email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <FieldLabel>{t.contact.form.phone}</FieldLabel>
                      <PhoneInput
                        value={fd.phone}
                        onChange={handlePhone}
                        placeholder="700 000 000"
                        className="focus-within:border-primary-blue focus-within:ring-2 focus-within:ring-primary-blue/10 bg-gray-50 focus-within:bg-white"
                      />
                    </div>
                    <div>
                      <FieldLabel required>{t.contact.form.topic}</FieldLabel>
                      <select
                        value={fd.topic}
                        onChange={e => set({ topic: e.target.value })}
                        className={cn(
                          'w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm',
                          'outline-none transition-all cursor-pointer',
                          'focus:bg-white focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/10',
                          fd.topic ? 'text-gray-900' : 'text-gray-400',
                        )}
                      >
                        <option value="">{t.contact.form.topicPlaceholder}</option>
                        {t.contact.form.topics.map(topic => <option key={topic} value={topic}>{topic}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <FieldLabel required>{t.contact.form.message}</FieldLabel>
                    <textarea
                      rows={5}
                      placeholder={t.contact.form.messagePlaceholder}
                      value={fd.message}
                      onChange={e => set({ message: e.target.value })}
                      className={cn(
                        'w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 resize-none',
                        'placeholder:text-gray-400 outline-none transition-all',
                        'focus:bg-white focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/10',
                      )}
                    />
                  </div>

                  {error && (
                    <div className="flex items-start gap-2.5 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
                      <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                      {error}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-gray-100">
                    <p className="text-xs text-gray-400">
                      {t.contact.form.privacy}{' '}
                      <a href="/privacy-policy" className="text-primary-blue hover:underline">{t.contact.form.privacyLink}</a>.
                    </p>
                    <button
                      type="submit"
                      disabled={!canSubmit}
                      className={cn(
                        'flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold transition-all',
                        canSubmit
                          ? 'bg-primary-red text-white hover:bg-red-700 shadow-lg shadow-primary-red/20'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed',
                      )}
                    >
                      {loading
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> {t.contact.form.sending}</>
                        : <>{t.contact.form.send} <ChevronRight className="w-4 h-4" /></>
                      }
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Map embed */}
            <div className="rounded-3xl overflow-hidden border border-gray-200 shadow-lg h-64">
              <iframe
                title="Cyberteks-IT Office Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.7569060891637!2d32.5862!3d0.3127!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbb0eecb0a6bb%3A0x6ab4a9b5e8f7b3d0!2sNakasero%2C%20Kampala%2C%20Uganda!5e0!3m2!1sen!2sug!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
