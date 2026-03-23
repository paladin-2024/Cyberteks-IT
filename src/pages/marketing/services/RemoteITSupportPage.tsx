import { Link } from 'react-router-dom';
import {
  Headphones, Wrench, Download, Monitor, Shield, Mail,
  CheckCircle2, ArrowRight, Phone, Clock, Lock, Zap, Users,
  Building2, GraduationCap, HeartPulse, Landmark, Briefcase,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const CORE_SERVICES = [
  {
    icon: Headphones,
    title: '24/7 Help Desk Support',
    desc: 'Round-the-clock technical assistance for employees, ensuring minimal downtime no matter the hour.',
  },
  {
    icon: Wrench,
    title: 'System & Software Troubleshooting',
    desc: 'Diagnosing and resolving operating system errors, crashes, and performance issues — all done remotely.',
  },
  {
    icon: Download,
    title: 'Software Installation & Updates',
    desc: 'Remote deployment, configuration, and updating of software and critical security patches.',
  },
  {
    icon: Monitor,
    title: 'Remote Monitoring & Management',
    desc: 'Proactive monitoring of systems, network health, and performance metrics before issues escalate.',
  },
  {
    icon: Shield,
    title: 'Cybersecurity Support',
    desc: 'Threat detection, firewall configuration, antivirus management, and comprehensive security audits.',
  },
  {
    icon: Mail,
    title: 'Email & Productivity Tools',
    desc: 'Setup and support for Microsoft 365, Google Workspace, and other cloud productivity platforms.',
  },
];

const WHY_CHOOSE = [
  {
    icon: Zap,
    title: 'No Travel Costs',
    desc: 'Skip the waiting and travel fees — our technicians connect to your device instantly from anywhere.',
  },
  {
    icon: Clock,
    title: '30-Minute Response',
    desc: 'Most issues are diagnosed and resolved within 30 minutes of your support request.',
  },
  {
    icon: Lock,
    title: 'Fully Encrypted Sessions',
    desc: 'All remote sessions use end-to-end encryption. You retain full control throughout.',
  },
  {
    icon: Users,
    title: 'Scales With Your Team',
    desc: 'Whether you have 2 or 200 employees, our support plans grow with your organisation.',
  },
];

const IDEAL_CLIENTS = [
  { icon: Briefcase,      label: 'Small Businesses',    desc: 'Affordable IT support without hiring in-house staff.' },
  { icon: Zap,            label: 'Startups',            desc: 'Lean teams that need fast, reliable tech without the overhead.' },
  { icon: GraduationCap, label: 'Schools & Colleges',   desc: 'Keep labs, staff devices, and network infrastructure running.' },
  { icon: Landmark,       label: 'NGOs & Aid Orgs',     desc: 'Mission-critical tools kept online in low-resource environments.' },
  { icon: Building2,      label: 'Government Agencies', desc: 'Secure, compliant remote support for public sector teams.' },
  { icon: HeartPulse,     label: 'Healthcare Providers', desc: 'Uptime for patient-facing systems, EHRs, and clinic networks.' },
];

const STATS = [
  { val: '30 min', label: 'Avg. Response Time' },
  { val: '98%',    label: 'Issues Resolved Remotely' },
  { val: '24/7',   label: 'Availability' },
  { val: '500+',   label: 'Clients Served' },
];

export default function RemoteITSupportPage() {
  const { t } = useLanguage();
  return (
    <main className="min-h-screen bg-white">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="pt-8 pb-12 sm:pt-12 sm:pb-20 bg-[#023064] px-4 sm:px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(ellipse at 80% 40%, #E11D48 0%, transparent 55%)' }}
        />
        <div className="max-w-6xl mx-auto relative grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-[#E11D48] text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
              {t.servicePages.remoteIt.hero.badge}
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5 leading-tight">
              {t.servicePages.remoteIt.hero.title1}{' '}
              <span className="text-[#E11D48]">{t.servicePages.remoteIt.hero.title2}</span>
            </h1>
            <p className="text-blue-200 text-lg leading-relaxed mb-8">
              {t.servicePages.remoteIt.hero.subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/get-started"
                className="inline-flex items-center gap-2 bg-[#E11D48] hover:bg-[#be1239] text-white font-bold px-7 py-3.5 rounded-xl transition-colors"
              >
                Get IT Support Now <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:+256779367005"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors"
              >
                <Phone className="w-4 h-4" /> Call Now
              </a>
            </div>
          </div>
          <div className="hidden md:block">
            <img
              src="/assets/remote-it-support.jpg"
              alt="Remote IT Support"
              className="w-full rounded-3xl object-cover h-[340px] shadow-2xl hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </section>

      {/* ── Stats Strip ──────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-[#023064] to-[#012550] py-8 sm:py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="font-heading text-3xl font-extrabold text-white">{s.val}</p>
              <p className="text-blue-300 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Core Services ────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#E11D48] text-xs font-bold uppercase tracking-widest">
              {t.servicePages.remoteIt.services.badge}
            </span>
            <h2 className="font-heading text-3xl font-bold text-gray-900 mt-2">
              {t.servicePages.remoteIt.services.title}
            </h2>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
              From helpdesk to cybersecurity, we cover every layer of your IT environment — delivered
              remotely, securely, and on demand.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CORE_SERVICES.map((svc) => (
              <div
                key={svc.title}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-[#023064]/30 hover:scale-105 transition-all duration-300 p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-[#023064]/10 flex items-center justify-center mb-4">
                  <svc.icon className="w-6 h-6 text-[#023064]" />
                </div>
                <h3 className="font-heading text-base font-bold text-gray-900 mb-2">{svc.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 lg:gap-14 items-center">
          <div>
            <span className="text-[#E11D48] text-xs font-bold uppercase tracking-widest">
              Why Cyberteks-IT
            </span>
            <h2 className="font-heading text-3xl font-bold text-gray-900 mt-2 mb-4">
              The smarter way to get IT support
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              No travel costs, no waiting rooms — just expert technicians resolving your issues fast,
              from wherever they are.
            </p>
            <div className="grid sm:grid-cols-2 gap-5">
              {WHY_CHOOSE.map((w) => (
                <div
                  key={w.title}
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-[#023064]/30 transition-all duration-300 p-5"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#E11D48]/10 flex items-center justify-center mb-3">
                    <w.icon className="w-5 h-5 text-[#E11D48]" />
                  </div>
                  <h3 className="font-heading text-sm font-bold text-gray-900 mb-1">{w.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{w.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img
              src="/assets/remote-it-support.jpg"
              alt="IT Support Specialist"
              className="rounded-3xl shadow-xl w-full object-cover aspect-[4/3] hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute -bottom-5 -left-5 bg-[#023064] text-white rounded-2xl p-4 shadow-lg">
              <p className="font-heading text-2xl font-bold">98%</p>
              <p className="text-xs text-blue-200">Remote Resolution Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Ideal Clients ────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#E11D48] text-xs font-bold uppercase tracking-widest">
              Ideal For
            </span>
            <h2 className="font-heading text-3xl font-bold text-gray-900 mt-2">
              Who We Support
            </h2>
            <p className="text-gray-600 mt-3 max-w-xl mx-auto">
              Our remote IT support is designed to work for organisations of every size and sector.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {IDEAL_CLIENTS.map((c) => (
              <div
                key={c.label}
                className="flex gap-4 p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-[#023064]/30 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-[#023064]/10 flex items-center justify-center shrink-0">
                  <c.icon className="w-5 h-5 text-[#023064]" />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-bold text-gray-900 mb-1">{c.label}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-gradient-to-br from-[#023064] to-[#012550]">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-[#E11D48] text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
            {t.servicePages.remoteIt.cta.title}
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-white mb-4">
            {t.servicePages.remoteIt.cta.title}
          </h2>
          <p className="text-blue-200 text-lg mb-10 leading-relaxed">
            {t.servicePages.remoteIt.cta.description}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/get-started"
              className="inline-flex items-center gap-2 bg-[#E11D48] hover:bg-[#be1239] text-white font-bold px-8 py-4 rounded-xl transition-colors"
            >
              {t.servicePages.remoteIt.cta.button} <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:+256779367005"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-colors"
            >
              <Phone className="w-4 h-4" /> +256 779 367 005
            </a>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-6 max-w-md mx-auto">
            {[
              { icon: CheckCircle2, label: 'No Travel Fees' },
              { icon: CheckCircle2, label: 'Encrypted Sessions' },
              { icon: CheckCircle2, label: '24/7 Available' },
            ].map((b) => (
              <div key={b.label} className="flex flex-col items-center gap-1.5 text-blue-200 text-xs">
                <b.icon className="w-5 h-5 text-[#E11D48]" />
                {b.label}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
