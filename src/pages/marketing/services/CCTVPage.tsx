import { Link } from 'react-router-dom';
import {
  Camera, Building2, Smartphone, Bell, HardDrive, Link2,
  CheckCircle2, ArrowRight, Phone, ShieldCheck, Wrench,
  Eye, Warehouse, GraduationCap, ShoppingCart, HeartPulse, Home,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const CORE_SERVICE_ICONS = [Camera, Building2, Smartphone, Bell, HardDrive, Link2];
const WHY_ICONS = [Wrench, Smartphone, Bell, ShieldCheck];

const IDEAL_LOCATIONS = [
  {
    icon: Building2,
    label: 'Offices & Corporate Buildings',
    desc: 'Monitor entrances, corridors, server rooms, and car parks with enterprise-grade surveillance.',
  },
  {
    icon: GraduationCap,
    label: 'Schools & Universities',
    desc: 'Protect students, staff, and assets across large multi-building campuses.',
  },
  {
    icon: ShoppingCart,
    label: 'Retail Shops & Supermarkets',
    desc: 'Prevent shoplifting, resolve disputes, and analyse customer flow with HD footage.',
  },
  {
    icon: Warehouse,
    label: 'Warehouses & Factories',
    desc: 'Full perimeter and interior coverage to secure stock, equipment, and personnel.',
  },
  {
    icon: Home,
    label: 'Residential Compounds',
    desc: 'Gate, driveway, and perimeter security giving homeowners complete peace of mind.',
  },
  {
    icon: HeartPulse,
    label: 'Hospitals & Clinics',
    desc: 'Secure patient areas, pharmacies, car parks, and sensitive zones 24/7.',
  },
];

const STATS = [
  { val: '500+', label: 'Cameras Installed' },
  { val: '4K',   label: 'Max Resolution' },
  { val: '24/7', label: 'Remote Monitoring' },
  { val: '12mo', label: 'Warranty Included' },
];

const FEATURES = [
  'Full HD, 4K Ultra HD, and thermal imaging options',
  'Night vision with IR range up to 50 m',
  'Motion-triggered alerts sent to your phone',
  'Remote live view via mobile app (Hik-Connect, DMSS)',
  'Local storage (HDD/NVR) with optional cloud backup',
  'Weatherproof IP66/IP67 rated outdoor cameras',
  'AI analytics: line crossing, zone intrusion, face detection',
  'Seamless integration with access control and alarm systems',
];

export default function CCTVPage() {
  const { t } = useLanguage();
  return (
    <main className="min-h-screen bg-white">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="pt-8 pb-12 sm:pt-12 sm:pb-20 bg-[#023064] px-4 sm:px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(ellipse at 75% 35%, #E11D48 0%, transparent 55%)' }}
        />
        <div className="max-w-6xl mx-auto relative grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-[#E11D48] text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
              {t.servicePages.cctv.hero.badge}
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5 leading-tight">
              {t.servicePages.cctv.hero.title1}{' '}
              <span className="text-[#E11D48]">{t.servicePages.cctv.hero.title2}</span>{' '}
              {t.servicePages.cctv.hero.title3}
            </h1>
            <p className="text-blue-200 text-lg leading-relaxed mb-8">
              {t.servicePages.cctv.hero.subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-[#E11D48] hover:bg-[#be1239] text-white font-bold px-7 py-3.5 rounded-xl transition-colors"
              >
                Get a Free Quote <ArrowRight className="w-4 h-4" />
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
              src="/assets/cctv-surveillance-systems.jpg"
              alt="CCTV Surveillance Systems"
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
              {t.servicePages.cctv.services.badge}
            </span>
            <h2 className="font-heading text-3xl font-bold text-gray-900 mt-2">
              {t.servicePages.cctv.services.title}
            </h2>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
              End-to-end surveillance solutions, from camera supply and installation to remote
              monitoring and smart system integrations.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.servicePages.cctv.services.items.map((item, i) => {
              const Icon = CORE_SERVICE_ICONS[i];
              return (
                <div
                  key={item.title}
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-[#023064]/30 hover:scale-105 transition-all duration-300 p-6"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#023064]/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#023064]" />
                  </div>
                  <h3 className="font-heading text-base font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 lg:gap-14 items-center">
          <div className="relative">
            <img
              src="/assets/cctv-surveillance-systems.jpg"
              alt="CCTV Installation Uganda"
              className="rounded-3xl shadow-xl w-full object-cover aspect-[4/3] hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute -top-5 -right-5 bg-[#E11D48] text-white rounded-2xl p-4 shadow-lg">
              <p className="font-heading text-2xl font-bold">4K</p>
              <p className="text-xs text-red-100">Ultra HD</p>
            </div>
          </div>
          <div>
            <span className="text-[#E11D48] text-xs font-bold uppercase tracking-widest">
              {t.servicePages.cctv.why.badge}
            </span>
            <h2 className="font-heading text-3xl font-bold text-gray-900 mt-2 mb-4">
              {t.servicePages.cctv.why.title}
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              We don't just install cameras, we design complete, future-proof surveillance ecosystems
              tailored to your premises and budget.
            </p>
            <div className="grid sm:grid-cols-2 gap-5">
              {t.servicePages.cctv.why.items.map((item, i) => {
                const Icon = WHY_ICONS[i];
                return (
                  <div
                    key={item.title}
                    className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-[#023064]/30 transition-all duration-300 p-5"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#E11D48]/10 flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-[#E11D48]" />
                    </div>
                    <h3 className="font-heading text-sm font-bold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Everything Included ──────────────────────────────────────── */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 lg:gap-14 items-center">
          <div>
            <span className="text-[#E11D48] text-xs font-bold uppercase tracking-widest">
              Full Package
            </span>
            <h2 className="font-heading text-3xl font-bold text-gray-900 mt-2 mb-6">
              Everything you need in one system
            </h2>
            <ul className="space-y-3">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-[#023064] shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 mt-8 bg-[#023064] hover:bg-[#012550] text-white font-bold px-7 py-3.5 rounded-xl transition-colors"
            >
              Request a Consultation <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="bg-gradient-to-br from-[#023064] to-[#012550] rounded-3xl p-8 text-white">
            <Eye className="w-10 h-10 text-[#E11D48] mb-4" />
            <h3 className="font-heading text-xl font-bold mb-3">How it works</h3>
            <ol className="space-y-5">
              {[
                { n: '01', t: 'Site Survey', d: 'Our engineer visits and maps optimal camera positions and cable routes.' },
                { n: '02', t: 'Custom Design', d: 'We design a tailored system, camera count, resolution, storage, and NVR spec.' },
                { n: '03', t: 'Professional Install', d: 'Neat cable management, camera mounting, NVR setup, and mobile app config.' },
                { n: '04', t: 'Training & Handover', d: 'We train your team on live view, playback, and alert management.' },
              ].map((step) => (
                <li key={step.n} className="flex gap-4">
                  <span className="font-heading text-2xl font-extrabold text-[#E11D48] leading-none shrink-0">
                    {step.n}
                  </span>
                  <div>
                    <p className="font-heading text-sm font-bold mb-0.5">{step.t}</p>
                    <p className="text-blue-200 text-xs leading-relaxed">{step.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── Ideal Locations ──────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#E11D48] text-xs font-bold uppercase tracking-widest">
              Ideal For
            </span>
            <h2 className="font-heading text-3xl font-bold text-gray-900 mt-2">
              Where We Install
            </h2>
            <p className="text-gray-600 mt-3 max-w-xl mx-auto">
              Our surveillance systems are deployed across a wide range of environments throughout
              Uganda and East Africa.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {IDEAL_LOCATIONS.map((loc) => (
              <div
                key={loc.label}
                className="flex gap-4 p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-[#023064]/30 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-[#023064]/10 flex items-center justify-center shrink-0">
                  <loc.icon className="w-5 h-5 text-[#023064]" />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-bold text-gray-900 mb-1">{loc.label}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{loc.desc}</p>
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
            {t.servicePages.cctv.cta.title}
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-white mb-4">
            {t.servicePages.cctv.cta.title}
          </h2>
          <p className="text-blue-200 text-lg mb-10 leading-relaxed">
            {t.servicePages.cctv.cta.description}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#E11D48] hover:bg-[#be1239] text-white font-bold px-8 py-4 rounded-xl transition-colors"
            >
              {t.servicePages.cctv.cta.button} <ArrowRight className="w-4 h-4" />
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
              { icon: CheckCircle2, label: 'Free Site Survey' },
              { icon: CheckCircle2, label: '12-Month Warranty' },
              { icon: CheckCircle2, label: '4K Ultra HD' },
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
