import { Link } from 'react-router-dom';
import {
  Target, Eye, Shield, Zap, Users, MapPin, Phone,
  Mail, ArrowRight, CheckCircle2, Award, Globe, Heart,
  Lightbulb, Star, Monitor, GraduationCap, ChevronRight,
  Linkedin, Twitter, Instagram, Github,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const STATS_VALUES = ['200+', '5+', '11', '98%'];

const VALUE_ICONS = [Shield, Heart, Star, Zap, Globe, Award];

const TEAM = [
  {
    name: 'Keneth Sansa',
    role: 'CEO',
    bio: 'Cybersecurity specialist and ICT entrepreneur with a passion for bridging Uganda\'s digital divide and delivering world-class technology solutions.',
    initials: 'KS',
    color: 'bg-[#023064]',
    image: '/assets/keneth.jpg',
    socials: [
      { icon: Linkedin,  href: 'https://linkedin.com/in/kenneth-sansa', label: 'LinkedIn' },
      { icon: Twitter,   href: 'https://twitter.com/kennethsansa',      label: 'Twitter' },
      { icon: Instagram, href: 'https://instagram.com/kennethsansa',    label: 'Instagram' },
    ],
  },
  {
    name: 'Nzabanita Caleb',
    role: 'Software Engineer',
    bio: 'Full-stack software engineer with a passion for building innovative digital platforms and delivering seamless technology experiences for businesses and learners.',
    initials: 'NC',
    color: 'bg-[#E11D48]',
    image: '/assets/caleb.jpg',
    socials: [
      { icon: Linkedin,  href: 'https://linkedin.com/in/nzabanita-caleb', label: 'LinkedIn' },
      { icon: Github,    href: 'https://github.com/paladin-2024',                label: 'GitHub' },
      { icon: Instagram, href: 'https://instagram.com/nzabanita',                                        label: 'Instagram' },
    ],
  },
  {
    name: 'Wenene Flava',
    role: 'Company Secretary',
    bio: 'Corporate governance professional with a passion for regulatory compliance and delivering the administrative excellence that keeps organisations running smoothly.',
    initials: 'WF',
    color: 'bg-[#023064]',
    image: '/assets/wenene.jpg',
    socials: [
      { icon: Linkedin,  href: '#', label: 'LinkedIn' },
      { icon: Twitter,   href: '#', label: 'Twitter' },
      { icon: Instagram, href: '#', label: 'Instagram' },
    ],
  },
  {
    name: 'Yvette Itegwa',
    role: 'HR & Administration',
    bio: 'Human resources professional with a passion for nurturing talent and delivering a high-performance culture where every team member can grow and excel.',
    initials: 'YI',
    color: 'bg-[#023064]',
    image: '/assets/yvette.jpg',
    socials: [
      { icon: Linkedin,  href: '#', label: 'LinkedIn' },
      { icon: Twitter,   href: '#', label: 'Twitter' },
      { icon: Instagram, href: '#', label: 'Instagram' },
    ],
  },
];

const INDUSTRY_SOLUTIONS = [
  'Remote IT Support & Helpdesk',
  'Network Infrastructure & Engineering',
  'CCTV Surveillance Systems',
  'Access Control & Biometrics',
  'VoIP & Business Telephony',
  'Cybersecurity & Data Protection',
  'Software Development & AI Integration',
  'IT Procurement & Hardware Supply',
];

const ONLINE_SKILLING = [
  'Cybersecurity Fundamentals',
  'Data Analytics & Business Intelligence',
  'AI & Machine Learning Essentials',
  'Network Engineering (CCNA/CompTIA)',
  'Software Development Bootcamp',
  'ICT for Business Professionals',
  'Digital Marketing & E-Commerce',
  'Cloud Computing Foundations',
];

export default function AboutPage() {
  const { t } = useLanguage();

  const STATS = [
    { value: STATS_VALUES[0], label: t.about.hero.stats.clients },
    { value: STATS_VALUES[1], label: t.about.hero.stats.years },
    { value: STATS_VALUES[2], label: t.about.hero.stats.programmes },
    { value: STATS_VALUES[3], label: t.about.hero.stats.satisfaction },
  ];

  return (
    <main className="min-h-screen bg-white">

      {/* ── Hero ── */}
      <section className="bg-[#023064] pt-12 pb-20 sm:pb-28 px-4 sm:px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 15% 65%, #E11D48 0%, transparent 50%), radial-gradient(ellipse at 85% 15%, #3b82f6 0%, transparent 45%)',
          }}
        />
        {/* Decorative grid */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="max-w-6xl mx-auto relative">
          <span className="inline-block bg-[#E11D48] text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            {t.about.hero.badge}
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight max-w-3xl">
            {t.about.hero.title1}<br />
            <span className="text-[#E11D48]">{t.about.hero.title2}</span>
          </h1>
          <p className="text-blue-200 text-base sm:text-xl max-w-2xl leading-relaxed mb-10 sm:mb-14">
            {t.about.hero.description}
          </p>
          {/* Stats row */}
          <div className="flex flex-wrap gap-x-12 gap-y-8">
            {STATS.map((s) => (
              <div key={s.label} className="group">
                <p className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-white group-hover:text-[#E11D48] transition-colors duration-200">
                  {s.value}
                </p>
                <p className="text-blue-300 text-sm mt-1 tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 48" xmlns="http://www.w3.org/2000/svg" className="w-full h-12 text-white fill-current">
            <path d="M0,48 L0,24 Q360,0 720,24 Q1080,48 1440,24 L1440,48 Z" />
          </svg>
        </div>
      </section>

      {/* ── Business Segments ── */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-[#023064] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 10% 80%, #E11D48 0%, transparent 50%), radial-gradient(ellipse at 90% 20%, #3b82f6 0%, transparent 45%)',
          }}
        />
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-14">
            <span className="inline-block bg-white/10 text-blue-200 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              {t.about.business.badge}
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-white mt-2">
              {t.about.business.title}
            </h2>
            <p className="text-blue-300 mt-3 max-w-xl mx-auto">
              {t.about.business.subtitle}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Industry Solutions */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-colors duration-200 group">
              <div className="w-12 h-12 rounded-2xl bg-[#E11D48] flex items-center justify-center mb-5 shadow-lg">
                <Monitor className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-white mb-2">{t.about.business.industry.title}</h3>
              <p className="text-blue-200 mb-6 leading-relaxed">
                {t.about.business.industry.desc}
              </p>
              <ul className="space-y-2.5">
                {INDUSTRY_SOLUTIONS.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-blue-100">
                    <ChevronRight className="w-4 h-4 text-[#E11D48] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 mt-7 text-white font-semibold text-sm hover:text-[#E11D48] transition-colors"
              >
                {t.about.business.industry.link} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {/* Online Skilling */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-colors duration-200 group">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-5 shadow-lg">
                <GraduationCap className="w-6 h-6 text-[#023064]" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-white mb-2">{t.about.business.skilling.title}</h3>
              <p className="text-blue-200 mb-6 leading-relaxed">
                {t.about.business.skilling.desc}
              </p>
              <ul className="space-y-2.5">
                {ONLINE_SKILLING.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-blue-100">
                    <ChevronRight className="w-4 h-4 text-[#E11D48] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/apply"
                className="inline-flex items-center gap-2 mt-7 text-white font-semibold text-sm hover:text-[#E11D48] transition-colors"
              >
                {t.about.business.skilling.link} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#E11D48] text-xs font-bold uppercase tracking-widest">{t.about.purpose.badge}</span>
            <h2 className="font-heading text-3xl font-bold text-gray-900 mt-2">{t.about.purpose.title}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-[#023064] rounded-3xl p-8 text-white relative overflow-hidden group hover:shadow-2xl transition-shadow duration-300">
              <div
                className="absolute top-0 right-0 w-40 h-40 opacity-10 rounded-full bg-[#E11D48] translate-x-16 -translate-y-16 group-hover:scale-125 transition-transform duration-500"
              />
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mb-5">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h2 className="font-heading text-2xl font-bold mb-4">{t.about.purpose.mission.title}</h2>
                <p className="text-blue-200 leading-relaxed">
                  {t.about.purpose.mission.text}
                </p>
              </div>
            </div>
            {/* Vision */}
            <div className="bg-gray-50 border-2 border-[#023064]/10 rounded-3xl p-8 group hover:border-[#023064]/30 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
              <div
                className="absolute top-0 right-0 w-40 h-40 opacity-5 rounded-full bg-[#023064] translate-x-16 -translate-y-16 group-hover:scale-125 transition-transform duration-500"
              />
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-[#023064]/10 flex items-center justify-center mb-5">
                  <Eye className="w-6 h-6 text-[#023064]" />
                </div>
                <h2 className="font-heading text-2xl font-bold text-gray-900 mb-4">{t.about.purpose.vision.title}</h2>
                <p className="text-gray-600 leading-relaxed">
                  {t.about.purpose.vision.text}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Who We Are ── */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 lg:gap-14 items-center">
          <div>
            <span className="text-[#E11D48] text-xs font-bold uppercase tracking-widest">{t.about.whoWeAre.badge}</span>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mt-2 mb-6">
              {t.about.whoWeAre.title}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              {t.about.whoWeAre.desc1}
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              {t.about.whoWeAre.desc2}
            </p>
            <ul className="space-y-3">
              {t.about.whoWeAre.bullets.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-[#023064] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-[#023064]/10 to-[#E11D48]/5 rounded-3xl" />
            <img
              src="/assets/ict-skilling-capacity-building.jpg"
              alt="Cyberteks-IT team at work"
              className="relative rounded-3xl shadow-xl w-full object-cover aspect-[4/3]"
            />
            <div className="absolute -bottom-5 -left-5 bg-[#E11D48] text-white rounded-2xl px-5 py-3 shadow-xl">
              <p className="font-heading text-2xl font-bold">2019</p>
              <p className="text-xs text-red-100">{t.about.whoWeAre.founded}</p>
            </div>
            <div className="absolute -top-4 -right-4 bg-[#023064] text-white rounded-2xl px-4 py-3 shadow-xl">
              <p className="font-heading text-xl font-bold">200+</p>
              <p className="text-xs text-blue-200">{t.about.whoWeAre.clients}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Milestones / Timeline ── */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#E11D48] text-xs font-bold uppercase tracking-widest">{t.about.journey.badge}</span>
            <h2 className="font-heading text-3xl font-bold text-gray-900 mt-2">{t.about.journey.title}</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              {t.about.journey.subtitle}
            </p>
          </div>
          <div className="relative">
            <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#023064] via-[#E11D48] to-[#023064]" />
            <div className="space-y-8">
              {t.about.journey.milestones.map((m) => (
                <div key={m.year} className="flex gap-6 group">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#023064] flex items-center justify-center ring-4 ring-white z-10 group-hover:bg-[#E11D48] transition-colors duration-200 shadow-md">
                    <span className="text-white text-[10px] font-bold">{m.year.slice(2)}</span>
                  </div>
                  <div className="pb-2 pt-1.5 flex-1">
                    <span className="inline-block bg-[#E11D48]/10 text-[#E11D48] text-xs font-bold px-2.5 py-0.5 rounded-full mb-1.5">
                      {m.year}
                    </span>
                    <p className="text-gray-700 leading-relaxed">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#E11D48] text-xs font-bold uppercase tracking-widest">{t.about.values.badge}</span>
            <h2 className="font-heading text-3xl font-bold text-gray-900 mt-2">{t.about.values.title}</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              {t.about.values.subtitle}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.about.values.items.map((v, i) => {
              const Icon = VALUE_ICONS[i];
              return (
                <div
                  key={v.title}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#023064]/10 flex items-center justify-center mb-4 group-hover:bg-[#023064] transition-colors duration-200">
                    <Icon className="w-5 h-5 text-[#023064] group-hover:text-white transition-colors duration-200" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-gray-900 mb-2">{v.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="py-12 sm:py-20 px-4 sm:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#E11D48] text-xs font-bold uppercase tracking-widest">{t.about.team.badge}</span>
            <h2 className="font-heading text-3xl font-bold text-gray-900 mt-2">{t.about.team.title}</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              {t.about.team.subtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {TEAM.map((p) => (
              <div
                key={p.name}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Photo — full-width portrait cover */}
                <div className={`relative w-full aspect-[4/5] ${p.color} overflow-hidden`}>
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                        (e.currentTarget.nextSibling as HTMLElement).style.removeProperty('display');
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full items-center justify-center ${p.image ? 'hidden' : 'flex'}`}>
                    <span className="text-white text-6xl font-heading font-bold">{p.initials}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
                </div>

                {/* Info */}
                <div className="px-6 py-5 text-center flex flex-col flex-1">
                  <h3 className="font-heading text-lg font-bold text-gray-900 leading-tight">{p.name}</h3>
                  <p className="text-[#E11D48] text-xs font-bold uppercase tracking-widest mt-1 mb-3">{p.role}</p>
                  <p className="text-sm text-gray-500 leading-relaxed flex-1">{p.bio}</p>

                  {/* Divider + Socials */}
                  <div className="border-t border-gray-100 mt-4 pt-4 flex items-center justify-center gap-3">
                    {p.socials.map(({ icon: Icon, href, label }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-[#023064] hover:border-[#023064] group/icon transition-all duration-200"
                      >
                        <Icon className="w-4 h-4 text-gray-500 group-hover/icon:text-white transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact Strip ── */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[#E11D48] text-xs font-bold uppercase tracking-widest">{t.about.reach.badge}</span>
            <h2 className="font-heading text-2xl font-bold text-gray-900 mt-2">{t.about.reach.title}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon: MapPin, label: t.about.reach.address, value: 'Kampala, Uganda', href: '#' },
              { icon: Phone,  label: t.about.reach.phone,   value: '+256 779 367 005', href: 'tel:+256779367005' },
              { icon: Mail,   label: t.about.reach.email,   value: 'info@cyberteks-it.com', href: 'mailto:info@cyberteks-it.com' },
            ].map((c) => (
              <a
                key={c.label}
                href={c.href}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 flex items-center gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#023064]/10 flex items-center justify-center shrink-0 group-hover:bg-[#023064] transition-colors duration-200">
                  <c.icon className="w-5 h-5 text-[#023064] group-hover:text-white transition-colors duration-200" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">{c.label}</p>
                  <p className="font-semibold text-gray-900 text-sm mt-0.5">{c.value}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 bg-[#023064] text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 20% 50%, #E11D48 0%, transparent 55%), radial-gradient(ellipse at 80% 50%, #3b82f6 0%, transparent 50%)',
          }}
        />
        <div className="max-w-2xl mx-auto relative">
          <span className="inline-block bg-[#E11D48] text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            {t.about.cta.badge}
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">{t.about.cta.title}</h2>
          <p className="text-blue-200 mb-10 text-lg leading-relaxed">
            {t.about.cta.description}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#E11D48] hover:bg-[#be1239] text-white font-bold px-8 py-3.5 rounded-xl transition-colors duration-200 shadow-lg"
            >
              {t.about.cta.contactBtn} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors duration-200"
            >
              {t.about.cta.servicesBtn}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
