import { Link } from 'react-router-dom';
import {
  Phone, Network, Headphones, MessageSquare, Wifi, TrendingUp,
  CheckCircle2, ArrowRight, Building2, GraduationCap, Heart,
  Landmark, Users, Rocket,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const SERVICES = [
  {
    icon: Phone,
    title: 'Business Phone Systems',
    desc: 'Deploy professional cloud-based phone systems with extensions, IVR, and intelligent call routing. Give every team member a direct line without the hardware cost.',
    color: 'bg-[#023064]',
  },
  {
    icon: Network,
    title: 'SIP Trunking',
    desc: 'Replace traditional phone lines with scalable SIP trunks for cost-effective calling. Connect your existing PBX to the internet and cut line rental costs immediately.',
    color: 'bg-[#E11D48]',
  },
  {
    icon: Headphones,
    title: 'Call Centre Solutions',
    desc: 'Full-featured call centre setups with queue management, call recording, and real-time analytics. Empower your agents and supervisors with the tools they need.',
    color: 'bg-emerald-600',
  },
  {
    icon: MessageSquare,
    title: 'Unified Communications',
    desc: 'Integrate voice, video, messaging, and collaboration tools in one platform. Your team stays connected whether they are in the office, at home, or on the road.',
    color: 'bg-violet-600',
  },
  {
    icon: Wifi,
    title: 'Remote Work Voice Solutions',
    desc: 'Enable distributed teams to communicate seamlessly from anywhere. Staff carry their office extension on any device — desk phone, laptop, or mobile.',
    color: 'bg-amber-500',
  },
  {
    icon: TrendingUp,
    title: 'Scalable & Flexible Plans',
    desc: 'Pay only for what you use — add or remove lines instantly as your team grows. No long-term contracts, no hardware refresh cycles, no hidden fees.',
    color: 'bg-sky-600',
  },
];

const WHY_CHOOSE = [
  'Up to 80% savings compared to traditional phone systems',
  'Crystal-clear HD voice quality on every call',
  'Works on any device — desk phone, laptop, or mobile',
  'No hardware maintenance required — we handle it all',
];

const IDEAL_FOR = [
  {
    icon: Building2,
    label: 'Hotels & Hospitality',
    desc: 'In-room phones, front desk, and staff communications unified in one system at a fraction of legacy costs.',
  },
  {
    icon: Headphones,
    label: 'Call Centres & BPOs',
    desc: 'Full ACD, queue management, agent dashboards, and supervisor monitoring for inbound and outbound teams.',
  },
  {
    icon: GraduationCap,
    label: 'Schools & Universities',
    desc: 'Campus-wide intercom, staff extensions, and admin lines — all managed from a single cloud dashboard.',
  },
  {
    icon: Heart,
    label: 'Healthcare Facilities',
    desc: 'Reliable, clear voice communications between wards, reception, and on-call staff — 24/7 uptime.',
  },
  {
    icon: Landmark,
    label: 'NGOs & Government Agencies',
    desc: 'Compliant, secure telephony across multiple offices and field teams without expensive leased lines.',
  },
  {
    icon: Rocket,
    label: 'Growing Startups',
    desc: 'Start with 5 lines and scale to 500 — your phone system grows as fast as your business does.',
  },
];

const STATS = [
  { val: '80%',   label: 'Cost Savings vs. Traditional' },
  { val: 'HD',    label: 'Voice Quality' },
  { val: '99.9%', label: 'Uptime Guarantee' },
  { val: 'Any',   label: 'Device Compatible' },
];

export default function VoIPPage() {
  const { t } = useLanguage();
  return (
    <main className="min-h-screen bg-white">

      {/* Hero */}
      <section className="pt-8 pb-12 sm:pt-12 sm:pb-20 bg-[#023064] px-4 sm:px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(ellipse at 75% 35%, #E11D48 0%, transparent 55%)' }}
        />
        <div className="max-w-6xl mx-auto relative grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-[#E11D48] text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
              {t.servicePages.voip.hero.badge}
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5 leading-tight">
              {t.servicePages.voip.hero.title1}{' '}
              <span className="text-[#E11D48]">{t.servicePages.voip.hero.title2}</span>
            </h1>
            <p className="text-blue-200 text-lg leading-relaxed mb-8">
              {t.servicePages.voip.hero.subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-[#E11D48] hover:bg-[#be1239] text-white font-bold px-7 py-3.5 rounded-xl transition-colors duration-300"
              >
                Get a VoIP Quote <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors duration-300"
              >
                <Phone className="w-4 h-4" /> Talk to a Specialist
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <img
              src="/assets/voip-solutions.jpg"
              alt="VoIP Business Phone Solutions Uganda"
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
            <span className="text-[#E11D48] text-xs font-bold uppercase tracking-widest">Our Services</span>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mt-2">
              Everything Your Business Needs to Communicate
            </h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto text-base">
              From a simple 5-extension office to a 300-seat call centre — we design, install,
              and support VoIP systems built for your exact needs.
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

      {/* Why Choose Us */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 lg:gap-14 items-center">
          <div>
            <span className="text-[#E11D48] text-xs font-bold uppercase tracking-widest">Why Choose Us</span>
            <h2 className="font-heading text-3xl font-bold text-gray-900 mt-2 mb-4">
              The Smarter Way to Run Your Business Communications
            </h2>
            <p className="text-gray-600 mb-7 leading-relaxed">
              Traditional PBX systems are expensive to buy, maintain, and upgrade. Our VoIP solutions
              give you enterprise-grade telephony that costs a fraction of legacy systems — with no
              compromise on quality, reliability, or features.
            </p>
            <ul className="space-y-4">
              {WHY_CHOOSE.map((point) => (
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
                Get a Free Consultation <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="relative">
            <img
              src="/assets/voip-solutions.jpg"
              alt="VoIP Phone System in use"
              className="rounded-3xl shadow-xl w-full object-cover aspect-[4/3] hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute -top-5 -right-5 bg-[#E11D48] text-white rounded-2xl px-5 py-4 shadow-lg text-center">
              <p className="font-heading text-3xl font-extrabold">80%</p>
              <p className="text-xs text-red-100 mt-0.5">Cost Reduction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ideal For / Use Cases */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#E11D48] text-xs font-bold uppercase tracking-widest">Ideal For</span>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mt-2">
              Built for Every Kind of Business
            </h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto text-base">
              Whether you run a hotel, a hospital, or a startup — our VoIP systems are tailored
              to the communication demands of your industry.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {IDEAL_FOR.map((u) => (
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
            {t.servicePages.voip.cta.title}
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            {t.servicePages.voip.cta.title}
          </h2>
          <p className="text-blue-200 text-lg mb-10 leading-relaxed">
            {t.servicePages.voip.cta.description}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#E11D48] hover:bg-[#be1239] text-white font-bold px-8 py-4 rounded-xl transition-colors duration-300 text-base"
            >
              {t.servicePages.voip.cta.button} <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
