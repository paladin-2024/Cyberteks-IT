import { useState, FormEvent, useRef } from 'react';
import {
  User, GraduationCap, BookOpen, Target, Clock,
  Monitor, FileCheck, ChevronRight, ChevronLeft,
  CheckCircle2, AlertCircle, Loader2, ArrowRight, Mail,
} from 'lucide-react';
import PhoneInput, { type Country } from '@/components/ui/PhoneInput';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

const PROGRAMS = [
  'Free Bootcamp: Python Programming',
  'Prompt Engineering',
  'Augmented Reality',
  'Virtual Reality',
  'Programming (Any Language)',
  'AI & Robotics',
  'Web Design',
  'Graphic Design',
  'Cyber Security',
  'Data Analytics',
  'Computer Networking',
  'Cloud (Azure / AWS)',
  'Other',
];

type FormData = {
  fullName: string; dob: string; gender: string; phone: string; email: string; city: string;
  education: string; occupation: string;
  programs: string[]; programOther: string;
  whyJoin: string; careerGoals: string;
  hoursPerWeek: string;
  hasComputer: string; deviceType: string; hasInternet: string;
  declaration: boolean; referralSource: string;
};

const initial: FormData = {
  fullName: '', dob: '', gender: '', phone: '', email: '', city: '',
  education: '', occupation: '',
  programs: [], programOther: '',
  whyJoin: '', careerGoals: '',
  hoursPerWeek: '',
  hasComputer: '', deviceType: '', hasInternet: '',
  declaration: false, referralSource: '',
};

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

function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 outline-none transition-all',
        'focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/10',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

function RadioGroup({
  label, name, options, value, onChange,
}: { label: string; name: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="flex flex-wrap gap-3 mt-1">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer group">
            <span className={cn(
              'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
              value === opt ? 'border-primary-blue bg-primary-blue' : 'border-gray-300 group-hover:border-primary-blue',
            )}>
              {value === opt && <span className="w-2 h-2 rounded-full bg-white" />}
            </span>
            <input type="radio" name={name} value={opt} checked={value === opt} onChange={() => onChange(opt)} className="sr-only" />
            <span className="text-sm text-gray-700">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default function ApplyPage() {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initial);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stepError, setStepError] = useState('');

  // OTP state — shown between step 1 (personal info) and step 2
  const [otpMode, setOtpMode] = useState(false);       // is the OTP screen visible?
  const [otpVerified, setOtpVerified] = useState(false); // has OTP been confirmed?
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const STEPS = [
    { id: 1, title: t.apply.steps[0], icon: User },
    { id: 2, title: t.apply.steps[1], icon: GraduationCap },
    { id: 3, title: t.apply.steps[2], icon: BookOpen },
    { id: 4, title: t.apply.steps[3], icon: Target },
    { id: 5, title: t.apply.steps[4], icon: Clock },
    { id: 6, title: t.apply.steps[5], icon: Monitor },
    { id: 7, title: t.apply.steps[6], icon: FileCheck },
  ];

  const set = (field: keyof FormData, value: string | boolean | string[]) =>
    setForm((f) => ({ ...f, [field]: value }));

  const toggleProgram = (p: string) =>
    set('programs', form.programs.includes(p) ? form.programs.filter((x) => x !== p) : [...form.programs, p]);

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  const validateStep = (s: number): string => {
    switch (s) {
      case 1:
        if (!form.fullName.trim()) return 'Full name is required.';
        if (!form.dob) return 'Date of birth is required.';
        if (!form.gender) return 'Please select your gender.';
        if (!form.phone || form.phone.length < 10) return 'Please enter a valid phone number.';
        if (!form.email.includes('@')) return 'Please enter a valid email address.';
        if (!form.city.trim()) return 'City / Country is required.';
        return '';
      case 2:
        if (!form.education) return 'Please select your education level.';
        return '';
      case 3:
        if (form.programs.length === 0) return 'Please select at least one program.';
        return '';
      case 4:
        if (form.whyJoin.trim().length < 30) return 'Please describe your motivation (at least 30 characters).';
        if (form.careerGoals.trim().length < 30) return 'Please describe your career goals (at least 30 characters).';
        return '';
      case 5:
        if (!form.hoursPerWeek) return 'Please select how many hours per week you can dedicate.';
        return '';
      case 6:
        if (!form.hasComputer) return 'Please indicate if you have access to a computer.';
        if (!form.hasInternet) return 'Please indicate if you have reliable internet access.';
        return '';
      default:
        return '';
    }
  };

  const API = import.meta.env.VITE_API_URL ?? '';

  const sendOtp = async () => {
    setOtpLoading(true); setOtpError('');
    try {
      const res = await fetch(`${API}/api/apply/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.error ?? 'Failed to send code');
      setOtpSent(true);
      setOtpDigits(['', '', '', '', '', '']);
      // Start 60-second cooldown
      setResendCooldown(60);
      const t = setInterval(() => setResendCooldown(c => { if (c <= 1) { clearInterval(t); return 0; } return c - 1; }), 1000);
    } catch (e) {
      setOtpError(e instanceof Error ? e.message : 'Failed to send code');
    } finally { setOtpLoading(false); }
  };

  const verifyOtp = async () => {
    const code = otpDigits.join('');
    if (code.length !== 6) { setOtpError('Please enter all 6 digits.'); return; }
    setOtpLoading(true); setOtpError('');
    try {
      const res = await fetch(`${API}/api/apply/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, otp: code }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.error ?? 'Invalid code');
      setOtpVerified(true);
      setOtpMode(false);
      // Now actually submit the application
      await doSubmit();
    } catch (e) {
      setOtpError(e instanceof Error ? e.message : 'Verification failed');
    } finally { setOtpLoading(false); }
  };

  const handleOtpInput = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otpDigits];
    next[index] = digit;
    setOtpDigits(next);
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const goNext = () => {
    const err = validateStep(step);
    if (err) { setStepError(err); return; }
    setStepError('');
    setStep(s => Math.min(STEPS.length, s + 1));
  };

  const educationMap: Record<string, string> = {
    // English options
    'Primary': 'high_school',
    'O-Level (S4)': 'high_school',
    'A-Level (S6)': 'high_school',
    'Certificate / Diploma': 'diploma_certificate',
    "Bachelor's Degree": 'undergraduate',
    "Master's / PhD": 'graduate',
    // French options
    'Primaire': 'high_school',
    'Certificat / Diplôme': 'diploma_certificate',
    'Licence': 'undergraduate',
    'Master / Doctorat': 'graduate',
  };

  const hoursMap: Record<string, string> = {
    // English options
    'Less than 5 hours': '2_4',
    '5–10 hours': '5_10',
    '10–20 hours': '10_plus',
    '20+ hours (Full-time)': '10_plus',
    // French options
    'Moins de 5 heures': '2_4',
    '5–10 heures': '5_10',
    '10–20 heures': '10_plus',
    '20+ heures (Temps plein)': '10_plus',
  };

  // Called after OTP is verified — does the actual API submission
  const doSubmit = async () => {
    setLoading(true); setError('');
    try {
      const payload = {
        fullName:            form.fullName,
        dateOfBirth:         form.dob,
        gender:              form.gender.toLowerCase().replace(/\s+/g, '_') as 'male' | 'female' | 'prefer_not_to_say',
        phoneNumber:         form.phone,
        email:               form.email,
        cityCountry:         form.city,
        educationLevel:      educationMap[form.education] ?? 'other',
        currentOccupation:   form.occupation || undefined,
        programs:            form.programs,
        programOther:        form.programOther || undefined,
        motivation:          form.whyJoin,
        careerGoals:         form.careerGoals,
        hoursPerWeek:        hoursMap[form.hoursPerWeek] ?? form.hoursPerWeek,
        hasComputer:         form.hasComputer.toLowerCase() as 'yes' | 'no',
        deviceTypes:         form.deviceType ? [form.deviceType] : [],
        hasInternet:         form.hasInternet.toLowerCase() as 'yes' | 'no',
        referralSource:      form.referralSource || undefined,
        declarationAccepted: true as const,
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL ?? ''}/api/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? 'Submission failed');
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again or email us directly.');
      setOtpMode(false); // go back to form on submit error
    } finally { setLoading(false); }
  };

  // Called when user clicks "Submit Application" on step 7
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.declaration) { setError('Please accept the declaration before submitting.'); return; }
    if (form.programs.length === 0) { setError('Please select at least one program.'); return; }
    setError('');
    doSubmit();
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-8 pb-20 bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 max-w-lg w-full text-center">
          <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-3">{t.apply.success.title}</h2>
          <p className="text-gray-500 leading-relaxed mb-8">
            {t.apply.success.description}
          </p>
          <a href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-blue text-white rounded-xl font-semibold text-sm hover:bg-blue-900 transition-all">
            {t.apply.success.home} <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero */}
      <div className="bg-primary-blue text-white py-10 sm:py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-blue-300 mb-3">{t.apply.hero.badge}</span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">
            {t.apply.hero.title1} <br />{t.apply.hero.title2}
          </h1>
          <p className="text-blue-200 text-lg max-w-xl mx-auto">
            {t.apply.hero.subtitle}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-6">

        {/* Step progress */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          {/* Progress bar */}
          <div className="h-1.5 bg-gray-100 rounded-full mb-5 overflow-hidden">
            <div className="h-full bg-primary-blue rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          {/* Step pills */}
          <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 scrollbar-hide">
            {STEPS.map((s) => {
              const Icon = s.icon;
              const done = step > s.id;
              const active = step === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => done && setStep(s.id)}
                  className={cn(
                    'flex flex-col items-center gap-1 min-w-[56px] transition-all',
                    done ? 'cursor-pointer' : 'cursor-default',
                  )}
                >
                  <div className={cn(
                    'w-9 h-9 rounded-xl flex items-center justify-center transition-all',
                    active ? 'bg-primary-blue text-white shadow-md shadow-blue-900/20' :
                    done  ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400',
                  )}>
                    {done ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className={cn('text-[10px] font-semibold text-center leading-tight hidden sm:block',
                    active ? 'text-primary-blue' : done ? 'text-green-600' : 'text-gray-400',
                  )}>{s.id}</span>
                </button>
              );
            })}
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">
            Step <span className="font-bold text-gray-700">{step}</span> of {STEPS.length}, <span className="font-semibold text-gray-600">{STEPS[step - 1].title}</span>
          </p>
        </div>

        {/* Form card */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Section header */}
            <div className="flex items-center gap-4 px-4 sm:px-8 py-5 sm:py-6 border-b border-gray-100 bg-gray-50/50">
              <div className="w-12 h-12 rounded-2xl bg-primary-blue flex items-center justify-center shrink-0">
                {(() => { const Icon = STEPS[step - 1].icon; return <Icon className="w-5 h-5 text-white" />; })()}
              </div>
              <div>
                <p className="text-xs font-bold text-primary-blue uppercase tracking-[0.12em]">Section {step}</p>
                <h2 className="font-display text-xl font-bold text-gray-900">{STEPS[step - 1].title}</h2>
              </div>
            </div>

            <div className="px-4 sm:px-8 py-6 sm:py-8 space-y-5">

              {/* STEP 1, Personal Information */}
              {step === 1 && (
                <>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <FieldLabel required>{t.apply.personal.fullName}</FieldLabel>
                      <Input placeholder="e.g. Amara Nakato" value={form.fullName} onChange={e => set('fullName', e.target.value)} required />
                    </div>
                    <div>
                      <FieldLabel required>{t.apply.personal.dob}</FieldLabel>
                      <Input type="date" value={form.dob} onChange={e => set('dob', e.target.value)} required />
                    </div>
                  </div>
                  <RadioGroup label={t.apply.personal.gender} name="gender" options={t.apply.personal.genderOptions} value={form.gender} onChange={v => set('gender', v)} />
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <FieldLabel required>{t.apply.personal.phone}</FieldLabel>
                      <PhoneInput
                        value={form.phone}
                        onChange={(full: string, _n: string, _c: Country) => set('phone', full)}
                        placeholder="700 000 000"
                        className="focus-within:border-primary-blue focus-within:ring-2 focus-within:ring-primary-blue/10"
                      />
                    </div>
                    <div>
                      <FieldLabel required>{t.apply.personal.email}</FieldLabel>
                      <Input type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} required />
                    </div>
                  </div>
                  <div>
                    <FieldLabel required>{t.apply.personal.city}</FieldLabel>
                    <Input placeholder="Kampala, Uganda" value={form.city} onChange={e => set('city', e.target.value)} required />
                  </div>
                </>
              )}

              {/* STEP 2, Education & Background */}
              {step === 2 && (
                <>
                  <div>
                    <FieldLabel required>{t.apply.education.level}</FieldLabel>
                    <Select value={form.education} onChange={e => set('education', e.target.value)} required>
                      <option value="">Select level…</option>
                      {t.apply.education.educationOptions.map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <FieldLabel>{t.apply.education.occupation}</FieldLabel>
                    <Input placeholder={t.apply.education.occupationPlaceholder} value={form.occupation} onChange={e => set('occupation', e.target.value)} />
                  </div>
                </>
              )}

              {/* STEP 3, Program Selection */}
              {step === 3 && (
                <>
                  <div>
                    <FieldLabel required>{t.apply.programs.title}</FieldLabel>
                    <p className="text-xs text-gray-400 mb-4">{t.apply.programs.subtitle}</p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {PROGRAMS.map((p) => {
                        const checked = form.programs.includes(p);
                        return (
                          <label key={p} className={cn(
                            'flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all',
                            checked ? 'border-primary-blue bg-blue-50' : 'border-gray-200 hover:border-gray-300',
                          )}>
                            <div className={cn(
                              'w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all',
                              checked ? 'border-primary-blue bg-primary-blue' : 'border-gray-300',
                            )}>
                              {checked && <CheckCircle2 className="w-3 h-3 text-white" />}
                            </div>
                            <input type="checkbox" className="sr-only" checked={checked} onChange={() => toggleProgram(p)} />
                            <span className="text-sm font-medium text-gray-700">{p}</span>
                          </label>
                        );
                      })}
                    </div>
                    {form.programs.includes('Other') && (
                      <div className="mt-4">
                        <FieldLabel>{t.apply.programs.other}</FieldLabel>
                        <Input placeholder="Describe your program of interest…" value={form.programOther} onChange={e => set('programOther', e.target.value)} />
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* STEP 4, Motivation & Goals */}
              {step === 4 && (
                <>
                  <div>
                    <FieldLabel required>{t.apply.motivation.whyJoin}</FieldLabel>
                    <Textarea rows={5} placeholder={t.apply.motivation.whyJoinPlaceholder} value={form.whyJoin} onChange={e => set('whyJoin', e.target.value)} required />
                  </div>
                  <div>
                    <FieldLabel required>{t.apply.motivation.careerGoals}</FieldLabel>
                    <Textarea rows={5} placeholder={t.apply.motivation.careerGoalsPlaceholder} value={form.careerGoals} onChange={e => set('careerGoals', e.target.value)} required />
                  </div>
                </>
              )}

              {/* STEP 5, Availability */}
              {step === 5 && (
                <RadioGroup
                  label={t.apply.availability.hoursPerWeek}
                  name="hoursPerWeek"
                  options={t.apply.availability.hoursOptions}
                  value={form.hoursPerWeek}
                  onChange={v => set('hoursPerWeek', v)}
                />
              )}

              {/* STEP 6, Computer & Internet Access */}
              {step === 6 && (
                <>
                  <RadioGroup label={t.apply.computer.hasComputer} name="hasComputer" options={[t.apply.computer.yes, t.apply.computer.no]} value={form.hasComputer} onChange={v => set('hasComputer', v)} />
                  {form.hasComputer === t.apply.computer.yes && (
                    <RadioGroup label={t.apply.computer.deviceType} name="deviceType" options={t.apply.computer.deviceOptions} value={form.deviceType} onChange={v => set('deviceType', v)} />
                  )}
                  <RadioGroup label={t.apply.computer.hasInternet} name="hasInternet" options={[t.apply.computer.yes, t.apply.computer.no]} value={form.hasInternet} onChange={v => set('hasInternet', v)} />
                </>
              )}

              {/* STEP 7, Declaration */}
              {/* Step-level error (shown on steps 1-6) */}
              {stepError && step < 7 && (
                <div className="flex items-center gap-2 text-sm text-primary-red bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {stepError}
                </div>
              )}

              {step === 7 && (
                <>
                  <div className="rounded-xl bg-blue-50 border border-blue-100 p-6">
                    <h3 className="font-display font-bold text-gray-800 mb-2">{t.apply.declaration.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {t.apply.declaration.agree}
                    </p>
                  </div>
                  <div>
                    <FieldLabel>{t.apply.declaration.referral}</FieldLabel>
                    <Select value={form.referralSource} onChange={e => set('referralSource', e.target.value)}>
                      <option value="">—</option>
                      {t.apply.declaration.referralOptions.map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </Select>
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div
                      onClick={() => set('declaration', !form.declaration)}
                      className={cn(
                        'w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all',
                        form.declaration ? 'border-primary-blue bg-primary-blue' : 'border-gray-300 group-hover:border-primary-blue',
                      )}
                    >
                      {form.declaration && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-sm text-gray-600">
                      {t.apply.declaration.agree} <span className="text-primary-red">*</span>
                    </span>
                  </label>
                  {error && (
                    <div className="flex items-center gap-2 text-sm text-primary-red bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {error}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer nav */}
            <div className="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5 border-t border-gray-100 bg-gray-50/50">
              <button
                type="button"
                onClick={() => { setStepError(''); setStep(s => Math.max(1, s - 1)); }}
                disabled={step === 1}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-all disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronLeft className="w-4 h-4" /> {t.apply.nav.back}
              </button>

              {step < STEPS.length ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary-blue text-white text-sm font-bold hover:bg-blue-900 transition-all shadow-sm shadow-blue-900/20"
                >
                  {t.apply.nav.next} <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary-red text-white text-sm font-bold hover:bg-rose-700 transition-all shadow-sm shadow-red-900/20 disabled:opacity-70"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileCheck className="w-4 h-4" />}
                  <span>{loading ? 'Submitting…' : 'Submit Application'}</span>
                </button>
              )}
            </div>
          </div>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6 pb-4">
          Questions? Email <a href="mailto:info@cyberteks-it.com" className="text-primary-blue hover:underline">info@cyberteks-it.com</a>
        </p>
      </div>
    </div>
  );
}
