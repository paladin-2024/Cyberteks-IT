import { Link } from 'react-router-dom';
import {
  Target, Eye, Shield, Zap, Users, MapPin, Phone,
  Mail, ArrowRight, CheckCircle2, Award, Globe, Heart,
  Lightbulb, Star, Monitor, GraduationCap, ChevronRight,
} from 'lucide-react';

const STATS = [
  { value: '200+', label: 'Clients Served' },
  { value: '5+',   label: 'Years Experience' },
  { value: '11',   label: 'Training Programmes' },
  { value: '98%',  label: 'Client Satisfaction' },
];

const VALUES = [
  {
    icon: Shield,
    title: 'Integrity',
    desc: 'We conduct every interaction with transparency and ethical standards — no shortcuts, no compromises.',
  },
  {
    icon: Heart,
    title: 'Customer-Centered',
    desc: 'Your needs are at the heart of everything we do. Every solution is built around your success.',
  },
  {
    icon: Star,
    title: 'Honesty',
    desc: 'Open communication and truthful advice guide every service we provide to our clients.',
  },
  {
    icon: Zap,
    title: 'Innovation',
    desc: 'We embrace emerging technologies to provide smarter, faster, and more effective solutions.',
  },
  {
    icon: Globe,
    title: 'Accessibility',
    desc: 'Geography should never be a barrier. We make world-class ICT support available everywhere.',
  },
  {
    icon: Award,
    title: 'Excellence',
    desc: 'High standards in every project — from a single remote fix to a full enterprise infrastructure rollout.',
  },
];

const MILESTONES = [
  { year: '2019', event: 'CyberteksIT founded in Kampala with a mission to democratise ICT in Uganda.' },
  { year: '2020', event: 'Launched remote IT support services, helping SMEs navigate the pandemic with minimal disruption.' },
  { year: '2021', event: 'Opened ICT skilling programme — first cohort of 30 students completed hands-on training.' },
  { year: '2022', event: 'Expanded to CCTV, access control, and VoIP solutions serving clients across East Africa.' },
  { year: '2023', event: 'Crossed 100+ clients and launched our AI & Robotics training programme.' },
  { year: '2025', event: 'Launched the CyberteksIT LMS platform for online and hybrid training delivery.' },
];

const TEAM = [
  {
    name: 'Caleb Nzabanita',
    role: 'Founder & CEO',
    bio: 'ICT entrepreneur and certified network engineer with a passion for bridging Uganda\'s digital divide and delivering world-class technology to African businesses.',
    initials: 'CN',
    color: 'bg-[#023064]',
  },
  {
    name: 'Sarah Namukasa',
    role: 'Head of Training',
    bio: 'Educator and software developer dedicated to equipping Uganda\'s youth with in-demand tech skills that open doors to global opportunities.',
    initials: 'SN',
    color: 'bg-[#E11D48]',
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
  return (
    <main className="min-h-screen bg-white">

      {/* ── Hero ── */}
      <section className="bg-[#023064] pt-12 pb-28 px-6 relative overflow-hidden">
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
            Our Story
          </span>
          <h1 className="font-heading text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight max-w-3xl">
            Built for the World.<br />
            <span className="text-[#E11D48]">Rooted in Uganda.</span>
          </h1>
          <p className="text-blue-200 text-xl max-w-2xl leading-relaxed mb-14">
            CyberteksIT is a dynamic ICT solutions provider delivering expert remote support to clients
            across the globe — anytime, anywhere.
          </p>
          {/* Stats row */}
          <div className="flex flex-wrap gap-x-12 gap-y-8">
            {STATS.map((s) => (
              <div key={s.label} className="group">
                <p className="font-heading text-4xl md:text-5xl font-extrabold text-white group-hover:text-[#E11D48] transition-colors duration-200">
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

      {/* ── Mission & Vision ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#E11D48] text-xs font-bold uppercase tracking-widest">Purpose</span>
            <h2 className="font-heading text-3xl font-bold text-gray-900 mt-2">What Drives Everything We Do</h2>
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
                <h2 className="font-heading text-2xl font-bold mb-4">Our Mission</h2>
                <p className="text-blue-200 leading-relaxed">
                  To provide reliable, innovative, and secure ICT solutions that keep businesses
                  running — anywhere, anytime. We combine cutting-edge technology, skilled professionals,
                  and a customer-first approach to help businesses thrive in today's digital world.
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
                <h2 className="font-heading text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
                <p className="text-gray-600 leading-relaxed">
                  To be the world's leading Remote ICT Support Company, empowering businesses
                  everywhere with technology that works — anytime and anywhere. Geography should
                  never limit access to exceptional IT support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Who We Are ── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div>
            <span className="text-[#E11D48] text-xs font-bold uppercase tracking-widest">Who We Are</span>
            <h2 className="font-heading text-4xl font-bold text-gray-900 mt-2 mb-6">
              Your Trusted ICT Partner, Anytime. Anywhere.
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Founded on the belief that geography should never limit access to exceptional IT support,
              Cyberteks-IT is a dynamic ICT solutions provider delivering expert remote support to clients
              across the globe. While our core strength lies in virtual ICT services — enabling businesses
              to access reliable, secure, and innovative solutions anytime, anywhere — we also recognize
              that some challenges require a physical presence.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              From remote IT troubleshooting to network infrastructure, cybersecurity, access control,
              CCTV surveillance, VOIP solutions, software development, AI integration, and ICT skilling —
              we deliver solutions that work seamlessly, no matter where our clients are.
            </p>
            <ul className="space-y-3">
              {[
                'Certified network engineers on staff',
                'Remote-first service delivery model',
                'On-site support for hands-on installations',
                'Pan-African coverage & 24/7 support',
              ].map((item) => (
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
              alt="CyberteksIT team at work"
              className="relative rounded-3xl shadow-xl w-full object-cover aspect-[4/3]"
            />
            <div className="absolute -bottom-5 -left-5 bg-[#E11D48] text-white rounded-2xl px-5 py-3 shadow-xl">
              <p className="font-heading text-2xl font-bold">2019</p>
              <p className="text-xs text-red-100">Founded in Kampala</p>
            </div>
            <div className="absolute -top-4 -right-4 bg-[#023064] text-white rounded-2xl px-4 py-3 shadow-xl">
              <p className="font-heading text-xl font-bold">200+</p>
              <p className="text-xs text-blue-200">Happy Clients</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Milestones / Timeline ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#E11D48] text-xs font-bold uppercase tracking-widest">Our Journey</span>
            <h2 className="font-heading text-3xl font-bold text-gray-900 mt-2">Key Milestones</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              From a small Kampala startup to a globally-capable ICT partner — here's how we got here.
            </p>
          </div>
          <div className="relative">
            <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#023064] via-[#E11D48] to-[#023064]" />
            <div className="space-y-8">
              {MILESTONES.map((m, i) => (
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
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#E11D48] text-xs font-bold uppercase tracking-widest">What Drives Us</span>
            <h2 className="font-heading text-3xl font-bold text-gray-900 mt-2">Our Core Values</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              These principles shape every decision, every service, and every relationship we build.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group"
              >
                <div className="w-11 h-11 rounded-xl bg-[#023064]/10 flex items-center justify-center mb-4 group-hover:bg-[#023064] transition-colors duration-200">
                  <v.icon className="w-5 h-5 text-[#023064] group-hover:text-white transition-colors duration-200" />
                </div>
                <h3 className="font-heading text-lg font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#E11D48] text-xs font-bold uppercase tracking-widest">Leadership</span>
            <h2 className="font-heading text-3xl font-bold text-gray-900 mt-2">Meet the Team</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              The people behind CyberteksIT — passionate professionals committed to transforming
              Africa through technology.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {TEAM.map((p) => (
              <div
                key={p.name}
                className="bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <div
                  className={`w-20 h-20 rounded-2xl ${p.color} flex items-center justify-center mb-5 shadow-md`}
                >
                  <span className="text-white text-2xl font-heading font-bold">{p.initials}</span>
                </div>
                <h3 className="font-heading text-xl font-bold text-gray-900">{p.name}</h3>
                <p className="text-[#E11D48] text-xs font-bold uppercase tracking-wide mt-1 mb-3">{p.role}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{p.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Business Segments ── */}
      <section className="py-20 px-6 bg-[#023064] relative overflow-hidden">
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
              What We Do
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mt-2">
              Two Pillars. One Mission.
            </h2>
            <p className="text-blue-300 mt-3 max-w-xl mx-auto">
              CyberteksIT operates across two core business segments — each delivering transformative
              impact in its own right.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Industry Solutions */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-colors duration-200 group">
              <div className="w-12 h-12 rounded-2xl bg-[#E11D48] flex items-center justify-center mb-5 shadow-lg">
                <Monitor className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-white mb-2">Industry Solutions</h3>
              <p className="text-blue-200 mb-6 leading-relaxed">
                Building secure, intelligent, and future-ready tech solutions for your organization —
                wherever you are in the world.
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
                Explore Services <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {/* Online Skilling */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-colors duration-200 group">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-5 shadow-lg">
                <GraduationCap className="w-6 h-6 text-[#023064]" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-white mb-2">Online Skilling</h3>
              <p className="text-blue-200 mb-6 leading-relaxed">
                Transforming learners with practical, flexible, and future-ready digital skills — through
                our award-winning training programmes and LMS platform.
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
                Apply to Train <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact Strip ── */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[#E11D48] text-xs font-bold uppercase tracking-widest">Reach Us</span>
            <h2 className="font-heading text-2xl font-bold text-gray-900 mt-2">Find Us</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { icon: MapPin, label: 'Address', value: 'Kampala, Uganda', href: '#' },
              { icon: Phone,  label: 'Phone',   value: '+256 779 367 005', href: 'tel:+256779367005' },
              { icon: Mail,   label: 'Email',   value: 'info@cyberteks-it.com', href: 'mailto:info@cyberteks-it.com' },
            ].map((c) => (
              <a
                key={c.label}
                href={c.href}
                className="bg-white rounded-2xl p-6 border border-gray-100 flex items-center gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
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
      <section className="py-24 px-6 bg-[#023064] text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 20% 50%, #E11D48 0%, transparent 55%), radial-gradient(ellipse at 80% 50%, #3b82f6 0%, transparent 50%)',
          }}
        />
        <div className="max-w-2xl mx-auto relative">
          <span className="inline-block bg-[#E11D48] text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            Let's Work Together
          </span>
          <h2 className="font-heading text-4xl font-bold text-white mb-4">Ready to work with us?</h2>
          <p className="text-blue-200 mb-10 text-lg leading-relaxed">
            Get in touch today — whether you need IT support, a training programme, or a custom
            technology solution, we're here to help.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#E11D48] hover:bg-[#be1239] text-white font-bold px-8 py-3.5 rounded-xl transition-colors duration-200 shadow-lg"
            >
              Contact Us <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors duration-200"
            >
              Our Services
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
