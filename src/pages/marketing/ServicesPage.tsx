import { Link } from 'react-router-dom';
import {
  Monitor, Camera, Lock, Phone, GraduationCap, Code2,
  ArrowRight, CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const SERVICES = [
  {
    icon: Monitor,
    title: 'Remote IT Support',
    desc: 'Instant remote assistance for computers, networks, software, and everything in between — available 24/7 across Uganda and East Africa.',
    href: '/services/remote-it-support',
    image: '/assets/remote-it-support.jpg',
    tag: 'Most Popular',
    tagColor: 'bg-[#E11D48] text-white',
    features: ['Same-day response', 'No travel costs', 'Covers all devices'],
  },
  {
    icon: Camera,
    title: 'CCTV & Surveillance',
    desc: 'Professional CCTV design, supply, and installation for homes, offices, warehouses, and public spaces with remote monitoring capability.',
    href: '/services/cctv',
    image: '/assets/cctv-surveillance-systems.jpg',
    tag: 'Security',
    tagColor: 'bg-blue-100 text-blue-700',
    features: ['HD & 4K cameras', 'Night vision', 'Remote monitoring'],
  },
  {
    icon: Lock,
    title: 'Access Control',
    desc: 'Biometric fingerprint, face recognition, and card-based access control systems to protect your premises and manage staff access.',
    href: '/services/access-control',
    image: '/assets/access-control-systems.jpg',
    tag: 'Security',
    tagColor: 'bg-blue-100 text-blue-700',
    features: ['Biometric readers', 'Attendance tracking', 'Multi-door control'],
  },
  {
    icon: Phone,
    title: 'VoIP Solutions',
    desc: 'Cut your phone bill with scalable cloud-based VoIP telephony systems — perfect for call centres, offices, and multi-branch businesses.',
    href: '/services/voip',
    image: '/assets/voip-solutions.jpg',
    tag: 'Communications',
    tagColor: 'bg-emerald-100 text-emerald-700',
    features: ['Up to 80% savings', 'Multi-branch support', 'Call recording'],
  },
  {
    icon: GraduationCap,
    title: 'ICT Skills Training',
    desc: 'Industry-aligned training programmes in AI, cloud, cybersecurity, web design, data analytics, and 7 more disciplines — online and hybrid.',
    href: '/services/ict-skilling',
    image: '/assets/ict-skilling-capacity-building.jpg',
    tag: 'Education',
    tagColor: 'bg-violet-100 text-violet-700',
    features: ['11 programmes', 'Certificate awarded', 'Flexible schedule'],
  },
  {
    icon: Code2,
    title: 'Software & AI Dev',
    desc: 'Custom web apps, mobile applications, AI integrations, and process automation solutions tailored for African businesses.',
    href: '/services/software-ai',
    image: '/assets/remote-it-support.jpg',
    tag: 'Development',
    tagColor: 'bg-amber-100 text-amber-700',
    features: ['Web & mobile apps', 'AI integration', 'API development'],
  },
];


export default function ServicesPage() {
  const { t } = useLanguage();
  return (
    <main className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-[#023064] pt-12 pb-14 sm:pb-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(ellipse at 80% 50%, #E11D48 0%, transparent 50%)' }} />
        <div className="max-w-5xl mx-auto relative text-center">
          <span className="inline-block bg-[#E11D48] text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">{t.servicesPage.hero.badge}</span>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-5 leading-tight">
            {t.servicesPage.hero.title}
          </h1>
          <p className="text-blue-200 text-base sm:text-xl max-w-2xl mx-auto">
            {t.servicesPage.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {SERVICES.map((s) => (
              <Link key={s.title} to={s.href}
                className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img src={s.image} alt={s.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-3 right-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${s.tagColor}`}>{s.tag}</span>
                  </div>
                  <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <s.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-heading text-xl font-bold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-5 flex-1">{s.desc}</p>
                  <ul className="space-y-1.5 mb-5">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-gray-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#023064] shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <span className="inline-flex items-center gap-1.5 text-[#023064] font-semibold text-sm group-hover:text-[#E11D48] transition-colors">
                    Learn more <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us / Trust */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#E11D48] text-xs font-bold uppercase tracking-widest">{t.servicesPage.trust.badge}</span>
            <h2 className="font-heading text-3xl font-bold text-gray-900 mt-2">{t.servicesPage.trust.title}</h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">{t.servicesPage.trust.description}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {t.servicesPage.trust.stats.map((stat) => (
              <div key={stat.label} className="text-center p-6 rounded-2xl bg-gray-50 border border-gray-100">
                <p className="font-heading text-3xl font-extrabold text-[#023064] mb-1">{stat.value}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{stat.label}</p>
              </div>
            ))}
          </div>
          <ul className="max-w-2xl mx-auto space-y-3">
            {t.servicesPage.trust.qualities.map((q) => (
              <li key={q} className="flex items-center gap-3 text-sm text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-[#023064] shrink-0" />
                {q}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-[#023064] text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-white mb-3">{t.servicesPage.cta.title}</h2>
          <p className="text-blue-200 mb-8">{t.servicesPage.cta.description}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="inline-flex items-center gap-2 bg-[#E11D48] hover:bg-[#be1239] text-white font-bold px-7 py-3.5 rounded-xl transition-colors">
              {t.servicesPage.cta.button} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/get-started" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors">
              Request IT Support
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
