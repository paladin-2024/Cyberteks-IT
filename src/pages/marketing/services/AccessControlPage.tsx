import { Link } from 'react-router-dom';
import {
  Fingerprint, Clock, Layers, Bell, FileText, Globe,
  CheckCircle2, ArrowRight, Phone, ShieldCheck, Building2,
  Factory, FlaskConical, LandmarkIcon, Server,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const SERVICES = [
  {
    icon: Fingerprint,
    title: 'Fingerprint & Facial Recognition',
    desc: 'Deploy biometric authentication systems that eliminate the risk of lost keys or shared PINs. Each identity is unique — impossible to duplicate or share.',
    color: 'bg-[#023064]',
  },
  {
    icon: Clock,
    title: 'Time & Attendance Management',
    desc: 'Automate employee attendance tracking with real-time reports and payroll integration. Replace paper registers with accurate, tamper-proof digital records.',
    color: 'bg-[#E11D48]',
  },
  {
    icon: Layers,
    title: 'Multi-Level Access Zones',
    desc: 'Define access levels for different areas — restrict server rooms, labs, or executive offices. Grant the right people access to the right doors, at the right times.',
    color: 'bg-emerald-600',
  },
  {
    icon: Bell,
    title: 'Real-Time Monitoring & Alerts',
    desc: 'Get instant notifications when unauthorized access is attempted. Our systems detect forced entry, door-held-open events, and suspicious activity in seconds.',
    color: 'bg-violet-600',
  },
  {
    icon: FileText,
    title: 'Audit Trails & Reports',
    desc: 'Maintain detailed logs of all access events for compliance and security reviews. Every entry and exit is time-stamped and stored for complete accountability.',
    color: 'bg-amber-500',
  },
  {
    icon: Globe,
    title: 'Remote Access Management',
    desc: 'Control and monitor access remotely from any device, anywhere. Add, suspend, or revoke user credentials without being on-site — ideal for multi-location businesses.',
    color: 'bg-sky-600',
  },
];

const WHY_BIOMETRIC = [
  'No PINs to forget or cards to lose — identity is always with you',
  'Accurate time & attendance — eliminate buddy punching entirely',
  'Full audit trail for compliance, HR, and security reviews',
  'Scalable from 1 door to 100+ locations without changing platforms',
];

const USE_CASES = [
  {
    icon: Building2,
    label: 'Corporate Offices',
    desc: 'Restrict floor access, monitor employee attendance, and audit all entries across your premises.',
  },
  {
    icon: FlaskConical,
    label: 'Schools & Universities',
    desc: 'Secure labs, libraries, and staff zones. Track student and staff attendance automatically.',
  },
  {
    icon: ShieldCheck,
    label: 'Hospitals & Clinics',
    desc: 'Protect drug stores, ICU wards, and restricted areas with biometric audit trails and alerts.',
  },
  {
    icon: LandmarkIcon,
    label: 'Government Facilities',
    desc: 'Secure sensitive data rooms and comply with national security mandates and audit requirements.',
  },
  {
    icon: Server,
    label: 'Data Centers & Server Rooms',
    desc: 'Prevent unauthorized physical access to critical infrastructure with multi-factor biometrics.',
  },
  {
    icon: Factory,
    label: 'Factories & Warehouses',
    desc: 'Prevent theft and track who enters your stock areas, production floors, and secure zones.',
  },
];

const STATS = [
  { val: '300+', label: 'Devices Installed' },
  { val: '50ms', label: 'Recognition Speed' },
  { val: '99.9%', label: 'Accuracy Rate' },
  { val: '0',    label: 'Buddy Punching' },
];

export default function AccessControlPage() {
  const { t } = useLanguage();
  return (
    <main className="min-h-screen bg-white">

      {/* Hero */}
      <section className="pt-8 pb-12 sm:pt-12 sm:pb-20 bg-[#023064] px-4 sm:px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(ellipse at 80% 40%, #E11D48 0%, transparent 55%)' }}
        />
        <div className="max-w-6xl mx-auto relative grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-[#E11D48] text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
              {t.servicePages.accessControl.hero.badge}
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5 leading-tight">
              {t.servicePages.accessControl.hero.title1}{' '}
              <span className="text-[#E11D48]">{t.servicePages.accessControl.hero.title2}</span>
            </h1>
            <p className="text-blue-200 text-lg leading-relaxed mb-8">
              {t.servicePages.accessControl.hero.subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-[#E11D48] hover:bg-[#be1239] text-white font-bold px-7 py-3.5 rounded-xl transition-colors duration-300"
              >
                Request a Demo <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors duration-300"
              >
                Get a Quote
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <img
              src="/assets/access-control-systems.jpg"
              alt="Biometric Access Control Systems Uganda"
              className="w-full max-w-md rounded-3xl object-cover shadow-2xl hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-gradient-to-br from-[#023064] to-[#012550] py-8 sm:py-10 px-4 sm:px-6 border-t border-white/10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="font-heading text-3xl font-extrabold text-white">{s.val}</p>
              <p className="text-blue-300 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services / Features */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#E11D48] text-xs font-bold uppercase tracking-widest">What We Offer</span>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mt-2">
              Comprehensive Access Control Services
            </h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto text-base">
              From biometric readers to centralized management dashboards — we deliver end-to-end
              access control tailored to your facility.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-[#023064]/30 p-7 transition-all duration-300 hover:scale-105"
              >
                <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center mb-5`}>
                  <s.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading text-base font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Biometric */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 lg:gap-14 items-center">
          <div className="relative">
            <img
              src="/assets/access-control-systems.jpg"
              alt="Biometric Access Control Installation"
              className="rounded-3xl shadow-xl w-full object-cover aspect-[4/3] hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute -bottom-5 -left-5 bg-[#023064] text-white rounded-2xl px-5 py-3 shadow-lg">
              <p className="font-heading text-lg font-bold">Time & Attendance</p>
              <p className="text-xs text-blue-200">Automatic payroll reports — zero effort</p>
            </div>
          </div>
          <div>
            <span className="text-[#E11D48] text-xs font-bold uppercase tracking-widest">Why Biometric</span>
            <h2 className="font-heading text-3xl font-bold text-gray-900 mt-2 mb-4">
              Beyond Locks & Keys — Why Biometrics Win
            </h2>
            <p className="text-gray-600 mb-7 leading-relaxed">
              Traditional access methods rely on items that can be lost, stolen, or shared. Biometric
              systems tie access to who you are — not what you carry — delivering security you can
              actually rely on.
            </p>
            <ul className="space-y-4">
              {WHY_BIOMETRIC.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-[#023064] shrink-0 mt-0.5" />
                  {point}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-[#023064] hover:bg-[#012550] text-white font-bold px-7 py-3.5 rounded-xl transition-colors duration-300"
              >
                Book a Free Assessment <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases / Ideal Clients */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#E11D48] text-xs font-bold uppercase tracking-widest">Ideal Installation Locations</span>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mt-2">
              Where We Deploy Access Control
            </h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto text-base">
              From a single door to a multi-floor enterprise campus — our solutions adapt to the
              unique security requirements of every environment.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {USE_CASES.map((u) => (
              <div
                key={u.label}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-[#E11D48]/30 p-6 transition-all duration-300 hover:scale-105 flex gap-4 items-start"
              >
                <div className="w-11 h-11 rounded-xl bg-[#023064]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <u.icon className="w-5 h-5 text-[#023064]" />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-bold text-gray-900 mb-1">{u.label}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{u.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-gradient-to-br from-[#023064] to-[#012550]">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-[#E11D48] text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
            {t.servicePages.accessControl.cta.title}
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            {t.servicePages.accessControl.cta.title}
          </h2>
          <p className="text-blue-200 text-lg mb-10 leading-relaxed">
            {t.servicePages.accessControl.cta.description}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#E11D48] hover:bg-[#be1239] text-white font-bold px-8 py-4 rounded-xl transition-colors duration-300 text-base"
            >
              {t.servicePages.accessControl.cta.button} <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl transition-colors duration-300 text-base"
            >
              <Phone className="w-5 h-5" /> Get a Quote
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
