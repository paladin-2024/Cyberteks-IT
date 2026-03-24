import { useState, FormEvent } from 'react';
import {
  User, Monitor, AlertTriangle, Wifi, ShieldCheck,
  ChevronRight, ChevronLeft, CheckCircle2, Loader2,
  Laptop, Smartphone, Server, Globe, Clock, Headphones,
} from 'lucide-react';
import PhoneInput, { type Country } from '@/components/ui/PhoneInput';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

const DEVICE_TYPES = [
  { value: 'Laptop',   label: 'Laptop',   icon: Laptop },
  { value: 'Desktop',  label: 'Desktop',  icon: Monitor },
  { value: 'Mobile',   label: 'Mobile',   icon: Smartphone },
  { value: 'Server',   label: 'Server',   icon: Server },
];

const OS_OPTIONS = ['Windows 11', 'Windows 10', 'macOS', 'Ubuntu / Linux', 'Android', 'iOS', 'Other'];

const PROBLEM_CATEGORIES = [
  'Internet / Network Connectivity',
  'Software Installation / Configuration',
  'Hardware Failure / Malfunction',
  'Virus / Malware / Security',
  'Email / Communication Setup',
  'Printer / Peripheral Device',
  'Slow Performance / Crashes',
  'Data Recovery / Backup',
  'Other',
];

const REMOTE_TOOLS = [
  { value: 'AnyDesk',               label: 'AnyDesk',               note: 'Recommended' },
  { value: 'TeamViewer',            label: 'TeamViewer',            note: '' },
  { value: 'Quick Assist',          label: 'Quick Assist',          note: 'Windows only' },
  { value: 'Chrome Remote Desktop', label: 'Chrome Remote Desktop', note: '' },
  { value: 'Other',                 label: 'Other / Not sure',      note: '' },
];

type FormData = {
  fullName: string; phone: string; email: string; company: string; location: string;
  deviceType: string; os: string; osOther: string;
  problemCategory: string; problemDescription: string; errorMessages: string; urgency: string;
  remoteTool: string; remoteId: string; availableTime: string;
  consent: boolean;
};

const initial: FormData = {
  fullName: '', phone: '', email: '', company: '', location: '',
  deviceType: '', os: '', osOther: '',
  problemCategory: '', problemDescription: '', errorMessages: '', urgency: 'Medium',
  remoteTool: '', remoteId: '', availableTime: '',
  consent: false,
};

/* ── Shared input components ─────────────────────────────────────── */
function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
      {children}{required && <span className="text-primary-red ml-1">*</span>}
    </label>
  );
}

function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900',
        'placeholder:text-gray-400 outline-none transition-all',
        'focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/10',
        className,
      )}
      {...props}
    />
  );
}

function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900',
        'outline-none transition-all cursor-pointer',
        'focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/10',
        className,
      )}
      {...props}
    />
  );
}

function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 resize-none',
        'placeholder:text-gray-400 outline-none transition-all',
        'focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/10',
        className,
      )}
      {...props}
    />
  );
}

/* ── Step panels ─────────────────────────────────────────────────── */
function Step1({ fd, set }: { fd: FormData; set: (f: Partial<FormData>) => void }) {
  const { t } = useLanguage();
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <FieldLabel required>{t.getStarted.yourInfo.fullName}</FieldLabel>
          <Input placeholder="e.g. John Mukasa" value={fd.fullName}
            onChange={e => set({ fullName: e.target.value })} />
        </div>
        <div>
          <FieldLabel required>{t.getStarted.yourInfo.phone}</FieldLabel>
          <PhoneInput
            value={fd.phone}
            onChange={(full: string, _n: string, _c: Country) => set({ phone: full })}
            placeholder="700 000 000"
            className="focus-within:border-primary-blue focus-within:ring-2 focus-within:ring-primary-blue/10"
          />
        </div>
      </div>
      <div>
        <FieldLabel required>{t.getStarted.yourInfo.email}</FieldLabel>
        <Input type="email" placeholder="you@example.com" value={fd.email}
          onChange={e => set({ email: e.target.value })} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <FieldLabel>{t.getStarted.yourInfo.company}</FieldLabel>
          <Input placeholder="Optional" value={fd.company}
            onChange={e => set({ company: e.target.value })} />
        </div>
        <div>
          <FieldLabel>{t.getStarted.yourInfo.location}</FieldLabel>
          <Input placeholder="e.g. Kampala" value={fd.location}
            onChange={e => set({ location: e.target.value })} />
        </div>
      </div>
    </div>
  );
}

function Step2({ fd, set }: { fd: FormData; set: (f: Partial<FormData>) => void }) {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <div>
        <FieldLabel required>{t.getStarted.device.deviceType}</FieldLabel>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
          {DEVICE_TYPES.map(({ value, label, icon: Icon }) => (
            <button
              key={value} type="button"
              onClick={() => set({ deviceType: value })}
              className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all font-medium text-sm',
                fd.deviceType === value
                  ? 'border-primary-blue bg-primary-blue/5 text-primary-blue'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50',
              )}
            >
              <Icon className="w-6 h-6" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <FieldLabel required>{t.getStarted.device.os}</FieldLabel>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-2">
          {OS_OPTIONS.map(os => (
            <button
              key={os} type="button"
              onClick={() => set({ os, osOther: os === 'Other' ? fd.osOther : '' })}
              className={cn(
                'px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all text-left',
                fd.os === os
                  ? 'border-primary-blue bg-primary-blue/5 text-primary-blue'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300',
              )}
            >
              {os}
            </button>
          ))}
        </div>
        {fd.os === 'Other' && (
          <div className="mt-3">
            <Input placeholder="Please specify your OS" value={fd.osOther}
              onChange={e => set({ osOther: e.target.value })} />
          </div>
        )}
      </div>
    </div>
  );
}

function Step3({ fd, set }: { fd: FormData; set: (f: Partial<FormData>) => void }) {
  const { t } = useLanguage();
  const urgencies = [
    { value: 'Low',    label: t.getStarted.problem.urgencyOptions[0].label, color: 'border-green-400 bg-green-50 text-green-700' },
    { value: 'Medium', label: t.getStarted.problem.urgencyOptions[1].label, color: 'border-yellow-400 bg-yellow-50 text-yellow-700' },
    { value: 'High',   label: t.getStarted.problem.urgencyOptions[2].label, color: 'border-primary-red bg-red-50 text-primary-red' },
  ];
  return (
    <div className="space-y-5">
      <div>
        <FieldLabel required>{t.getStarted.problem.category}</FieldLabel>
        <Select value={fd.problemCategory} onChange={e => set({ problemCategory: e.target.value })}>
          <option value="">{t.getStarted.problem.categoryPlaceholder}</option>
          {PROBLEM_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </Select>
      </div>

      <div>
        <FieldLabel required>{t.getStarted.problem.description}</FieldLabel>
        <Textarea rows={4} placeholder={t.getStarted.problem.descriptionPlaceholder}
          value={fd.problemDescription} onChange={e => set({ problemDescription: e.target.value })} />
      </div>

      <div>
        <FieldLabel>{t.getStarted.problem.errors}</FieldLabel>
        <Textarea rows={3} placeholder={t.getStarted.problem.errorsPlaceholder}
          value={fd.errorMessages} onChange={e => set({ errorMessages: e.target.value })} />
      </div>

      <div>
        <FieldLabel required>{t.getStarted.problem.urgency}</FieldLabel>
        <div className="grid grid-cols-3 gap-3 mt-2">
          {urgencies.map(u => (
            <button
              key={u.value} type="button"
              onClick={() => set({ urgency: u.value })}
              className={cn(
                'p-3 rounded-xl border-2 text-left transition-all',
                fd.urgency === u.value ? u.color : 'border-gray-200 text-gray-500 hover:border-gray-300',
              )}
            >
              <div className="font-bold text-sm">{u.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step4({ fd, set }: { fd: FormData; set: (f: Partial<FormData>) => void }) {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      {/* Info callout */}
      <div className="flex gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl text-sm text-primary-blue">
        <Headphones className="w-5 h-5 mt-0.5 shrink-0" />
        <p>
          {t.getStarted.remoteAccess.permissionText}
        </p>
      </div>

      <div>
        <FieldLabel required>{t.getStarted.remoteAccess.tool}</FieldLabel>
        <div className="space-y-2.5 mt-2">
          {REMOTE_TOOLS.map(t => (
            <button
              key={t.value} type="button"
              onClick={() => set({ remoteTool: t.value })}
              className={cn(
                'w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all text-left',
                fd.remoteTool === t.value
                  ? 'border-primary-blue bg-primary-blue/5'
                  : 'border-gray-200 hover:border-gray-300',
              )}
            >
              <span className={cn('font-medium text-sm', fd.remoteTool === t.value ? 'text-primary-blue' : 'text-gray-700')}>
                {t.label}
              </span>
              <div className="flex items-center gap-3">
                {t.note && (
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{t.note}</span>
                )}
                <div className={cn(
                  'w-4 h-4 rounded-full border-2 transition-all',
                  fd.remoteTool === t.value ? 'border-primary-blue bg-primary-blue' : 'border-gray-300',
                )} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {fd.remoteTool && fd.remoteTool !== 'Other' && (
        <div>
          <FieldLabel>Your {fd.remoteTool} ID / Access Code</FieldLabel>
          <Input placeholder="e.g. 123 456 789" value={fd.remoteId}
            onChange={e => set({ remoteId: e.target.value })} />
          <p className="text-xs text-gray-400 mt-1.5">
            Open {fd.remoteTool} on your device to find this code. Leave blank if you don't have it yet.
          </p>
        </div>
      )}

      <div>
        <FieldLabel required>{t.getStarted.remoteAccess.permission}</FieldLabel>
        <Input placeholder="e.g. Today after 2pm, or Mon–Fri 9am–5pm"
          value={fd.availableTime} onChange={e => set({ availableTime: e.target.value })} />
      </div>
    </div>
  );
}

function Step5({ fd, set }: { fd: FormData; set: (f: Partial<FormData>) => void }) {
  const { t } = useLanguage();
  const rows: [string, string][] = [
    ['Name',               fd.fullName   || '—'],
    ['Phone',              fd.phone      || '—'],
    ['Email',              fd.email      || '—'],
    ['Company',            fd.company    || '—'],
    ['Device',             fd.deviceType || '—'],
    ['Operating System',   fd.os === 'Other' ? (fd.osOther || 'Other') : (fd.os || '—')],
    ['Problem Category',   fd.problemCategory || '—'],
    ['Urgency',            fd.urgency || '—'],
    ['Support Tool',       fd.remoteTool || '—'],
    ['Available At',       fd.availableTime || '—'],
  ];

  return (
    <div className="space-y-6">
      {/* Summary table */}
      <div>
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">{t.getStarted.consent.title}</h3>
        <div className="rounded-2xl border border-gray-100 overflow-hidden">
          {rows.map(([label, value], i) => (
            <div key={label} className={cn(
              'flex justify-between gap-4 px-4 py-2.5 text-sm',
              i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50',
            )}>
              <span className="text-gray-500 font-medium shrink-0">{label}</span>
              <span className="text-gray-800 text-right">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Consent */}
      <div
        onClick={() => set({ consent: !fd.consent })}
        className={cn(
          'flex gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all',
          fd.consent ? 'border-primary-blue bg-primary-blue/5' : 'border-gray-200 hover:border-gray-300',
        )}
      >
        <div className={cn(
          'w-5 h-5 rounded-md border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all',
          fd.consent ? 'bg-primary-blue border-primary-blue' : 'border-gray-300',
        )}>
          {fd.consent && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
        </div>
        <p className="text-sm text-gray-700 leading-relaxed select-none">
          {t.getStarted.consent.confirm}
        </p>
      </div>

      <p className="text-xs text-gray-400 text-center">
        By submitting, you agree to our{' '}
        <a href="/privacy-policy" className="text-primary-blue hover:underline">Privacy Policy</a>
        {' '}and{' '}
        <a href="/terms-of-use" className="text-primary-blue hover:underline">Terms of Use</a>.
        A technician will contact you within 30 minutes.
      </p>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────────────── */
export default function GetStartedPage() {
  const { t } = useLanguage();
  const [step, setStep]       = useState(1);
  const [fd, setFd]           = useState<FormData>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [done, setDone]       = useState(false);

  const STEPS = [
    { id: 1, title: t.getStarted.steps[0], icon: User },
    { id: 2, title: t.getStarted.steps[1], icon: Monitor },
    { id: 3, title: t.getStarted.steps[2], icon: AlertTriangle },
    { id: 4, title: t.getStarted.steps[3], icon: Wifi },
    { id: 5, title: t.getStarted.steps[4], icon: ShieldCheck },
  ];

  const set = (partial: Partial<FormData>) => setFd(prev => ({ ...prev, ...partial }));

  /* Basic per-step validation */
  const canProceed = () => {
    if (step === 1) return fd.fullName.trim() && fd.phone.trim() && fd.email.trim();
    if (step === 2) return fd.deviceType && fd.os;
    if (step === 3) return fd.problemCategory && fd.problemDescription.trim() && fd.urgency;
    if (step === 4) return fd.remoteTool && fd.availableTime.trim();
    if (step === 5) return fd.consent;
    return true;
  };

  const next = () => { if (canProceed() && step < 5) setStep(s => s + 1); };
  const prev = () => { if (step > 1) setStep(s => s - 1); };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canProceed()) return;
    setLoading(true); setError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL ?? ''}/api/get-started`, {
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

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  /* ── Success state ─────────────────────────────────────────────── */
  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-24">
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-10 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-3">
            {t.getStarted.success.title}
          </h2>
          <p className="text-gray-500 mb-2">
            Thank you, <span className="font-semibold text-gray-700">{fd.fullName}</span>.
          </p>
          <p className="text-gray-500 mb-8">
            {t.getStarted.success.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/" className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold text-sm hover:bg-gray-200 transition-all">
              {t.getStarted.success.home}
            </a>
            <a href="tel:+256779367005" className="px-6 py-3 rounded-xl bg-primary-blue text-white font-semibold text-sm hover:bg-blue-900 transition-all">
              Call Us Directly
            </a>
          </div>
        </div>
      </div>
    );
  }

  /* ── Form ──────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero header */}
      <div className="relative bg-[#023064] overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-red/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 mb-5">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white/80 text-xs font-semibold tracking-wide uppercase">{t.getStarted.hero.badge}</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
            {t.getStarted.hero.title1}<br />
            <span className="text-primary-red">{t.getStarted.hero.title2}</span>
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            {t.getStarted.hero.subtitle}
          </p>
          {/* Quick stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            {[
              { icon: Clock,    text: '< 30 min response' },
              { icon: Globe,    text: 'Remote anywhere in Uganda' },
              { icon: ShieldCheck, text: 'Fully encrypted sessions' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-white/60 text-sm">
                <Icon className="w-4 h-4 text-primary-red" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form card */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pb-24">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

          {/* Step pills */}
          <div className="px-6 sm:px-10 pt-8 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                const done = step > s.id;
                const active = step === s.id;
                return (
                  <div key={s.id} className="flex items-center gap-2 shrink-0">
                    <div className={cn(
                      'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all',
                      active ? 'bg-primary-blue text-white shadow-sm shadow-primary-blue/30' :
                      done   ? 'bg-green-100 text-green-700' :
                               'bg-gray-100 text-gray-400',
                    )}>
                      {done
                        ? <CheckCircle2 className="w-3.5 h-3.5" />
                        : <Icon className="w-3.5 h-3.5" />
                      }
                      <span className="hidden sm:inline">{s.title}</span>
                      <span className="sm:hidden">{s.id}</span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={cn(
                        'h-px w-5 shrink-0 transition-all',
                        step > s.id ? 'bg-green-300' : 'bg-gray-200',
                      )} />
                    )}
                  </div>
                );
              })}
            </div>
            {/* Progress bar */}
            <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-blue rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-1.5 text-xs text-gray-400">
              <span>Step {step} of {STEPS.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
          </div>

          {/* Step content */}
          <form onSubmit={submit}>
            <div className="px-6 sm:px-10 py-8">
              {/* Step heading */}
              <div className="mb-6">
                <h2 className="font-display text-xl font-bold text-gray-900">
                  {STEPS[step - 1].title}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {step === 1 && t.getStarted.yourInfo.title}
                  {step === 2 && t.getStarted.device.title}
                  {step === 3 && t.getStarted.problem.title}
                  {step === 4 && t.getStarted.remoteAccess.title}
                  {step === 5 && t.getStarted.consent.title}
                </p>
              </div>

              {step === 1 && <Step1 fd={fd} set={set} />}
              {step === 2 && <Step2 fd={fd} set={set} />}
              {step === 3 && <Step3 fd={fd} set={set} />}
              {step === 4 && <Step4 fd={fd} set={set} />}
              {step === 5 && <Step5 fd={fd} set={set} />}

              {error && (
                <div className="mt-5 flex gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-primary-red">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                  {error}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="px-6 sm:px-10 pb-8 flex items-center justify-between gap-4">
              <button
                type="button" onClick={prev}
                className={cn(
                  'flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 transition-all',
                  'hover:bg-gray-50 hover:border-gray-300',
                  step === 1 ? 'invisible' : '',
                )}
              >
                <ChevronLeft className="w-4 h-4" />
                {t.getStarted.nav.back}
              </button>

              {step < 5 ? (
                <button
                  type="button" onClick={next}
                  disabled={!canProceed()}
                  className={cn(
                    'flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all',
                    canProceed()
                      ? 'bg-primary-blue text-white hover:bg-blue-900 shadow-sm shadow-primary-blue/30'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed',
                  )}
                >
                  {t.getStarted.nav.next}
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!canProceed() || loading}
                  className={cn(
                    'flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-bold transition-all',
                    canProceed() && !loading
                      ? 'bg-primary-red text-white hover:bg-red-700 shadow-sm shadow-primary-red/30'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed',
                  )}
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> {t.getStarted.nav.submitting}</>
                  ) : (
                    <>{t.getStarted.nav.submit} <ChevronRight className="w-4 h-4" /></>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Help CTA */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-500">
          <span>Prefer to call us directly?</span>
          <a href="tel:+256779367005"
            className="inline-flex items-center gap-2 font-bold text-primary-blue hover:text-blue-900 transition-colors">
            <Headphones className="w-4 h-4" />
            +256 779 367 005
          </a>
        </div>
      </div>
    </div>
  );
}
