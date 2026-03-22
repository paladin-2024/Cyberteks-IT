import { Link } from 'react-router-dom';
import {
  ArrowRight, Heart, Zap, Users, TrendingUp,
  BookOpen, Mail, Briefcase, MapPin, Clock,
  CheckCircle2, MessageCircle, Globe, Shield,
  Code2, Wifi, Headphones, BarChart3,
} from 'lucide-react';

const PERKS = [
  {
    icon: TrendingUp,
    title: 'Career Growth',
    desc: 'Clear progression paths and mentorship from senior engineers with real-world enterprise experience.',
  },
  {
    icon: BookOpen,
    title: 'Free Training',
    desc: 'Full access to all CyberteksIT courses and professional certifications — completely on us.',
  },
  {
    icon: Heart,
    title: 'Meaningful Work',
    desc: 'Help shape Uganda\'s digital future with work that genuinely improves businesses and communities.',
  },
  {
    icon: Users,
    title: 'Great Team',
    desc: 'A small, driven team where your ideas get heard and implemented — not buried in bureaucracy.',
  },
  {
    icon: Zap,
    title: 'Cutting-Edge Tech',
    desc: 'Work with modern tools — cloud platforms, AI systems, enterprise networking, and security infrastructure.',
  },
  {
    icon: Globe,
    title: 'Remote-First',
    desc: 'Results-focused environment with genuine flexibility for remote and hybrid work — anywhere in the world.',
  },
];

const WHY_US = [
  {
    title: 'Remote-first flexibility',
    desc: 'Work from anywhere without sacrificing collaboration or real impact. We trust our team to deliver.',
  },
  {
    title: 'Cutting-edge projects',
    desc: 'From AI solutions to enterprise networking, we tackle challenges that shape entire industries.',
  },
  {
    title: 'Professional growth',
    desc: 'Gain access to continuous training, certifications, and skill development — at no cost to you.',
  },
  {
    title: 'Impactful work',
    desc: 'See your expertise directly improve businesses and communities across Uganda and beyond.',
  },
];

const OPENINGS = [
  {
    title: 'ICT Trainer – Cybersecurity, Data Analytics & AI',
    department: 'Training & Education',
    departmentColor: 'bg-purple-100 text-purple-700',
    type: 'Full-time',
    location: 'Kampala / Remote',
    icon: BarChart3,
    desc: 'Deliver engaging, practical training in cybersecurity, data analytics, and AI to students across our online and in-person programmes. You\'ll design curriculum, mentor learners, and help shape the next generation of Ugandan tech professionals.',
  },
  {
    title: 'Software & AI Developer',
    department: 'Engineering',
    departmentColor: 'bg-blue-100 text-blue-700',
    type: 'Full-time',
    location: 'Remote',
    icon: Code2,
    desc: 'Design and build intelligent software solutions for our clients — from web apps and APIs to AI-powered tools and automation pipelines. You\'ll work across the full stack and contribute to innovative projects that solve real-world problems.',
  },
  {
    title: 'Remote IT Support Specialist',
    department: 'Technical Support',
    departmentColor: 'bg-green-100 text-green-700',
    type: 'Full-time',
    location: 'Remote',
    icon: Headphones,
    desc: 'Provide world-class remote IT support to businesses across Africa and globally — diagnosing issues, configuring systems, supporting networks, and ensuring clients\' technology never lets them down.',
  },
  {
    title: 'Remote Sales Executive',
    department: 'Sales & Growth',
    departmentColor: 'bg-orange-100 text-orange-700',
    type: 'Full-time / Contract',
    location: 'Remote',
    icon: TrendingUp,
    desc: 'Drive business growth by identifying opportunities, pitching CyberteksIT\'s solutions to prospective clients, and building lasting commercial relationships. You\'ll be rewarded competitively with a mix of base pay and performance bonuses.',
  },
];

const STEPS = [
  {
    step: '01',
    icon: Mail,
    title: 'Send Your CV',
    desc: 'Email your CV and a short cover letter to careers@cyberteks-it.com. Tell us who you are and why you\'d be a great fit.',
  },
  {
    step: '02',
    icon: Users,
    title: 'Interview',
    desc: 'We\'ll invite shortlisted candidates for a technical and culture interview with our team — conducted remotely or in Kampala.',
  },
  {
    step: '03',
    icon: CheckCircle2,
    title: 'Join the Team',
    desc: 'Successful candidates receive a formal offer and full onboarding plan within one week. Welcome aboard!',
  },
];

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* ── Hero ── */}
      <section className="bg-[#023064] pt-12 pb-28 px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 25% 70%, #E11D48 0%, transparent 55%), radial-gradient(ellipse at 80% 25%, #3b82f6 0%, transparent 45%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="max-w-5xl mx-auto relative">
          <span className="inline-block bg-[#E11D48] text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            Join Our Team
          </span>
          <h1 className="font-heading text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight max-w-3xl">
            Build the Digital Future<br />
            <span className="text-[#E11D48]">With CyberteksIT</span>
          </h1>
          <p className="text-blue-200 text-xl max-w-2xl leading-relaxed mb-10">
            At Cyberteks-IT, we believe that talent knows no borders — just like our services. We're a
            modern, tech-driven company where innovation thrives, ideas matter, and people grow.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="mailto:careers@cyberteks-it.com"
              className="inline-flex items-center gap-2 bg-[#E11D48] hover:bg-[#be1239] text-white font-bold px-7 py-3.5 rounded-xl transition-colors duration-200 shadow-lg"
            >
              <Mail className="w-4 h-4" />
              Send Your CV
            </a>
            <a
              href="https://wa.me/256779367005?text=Hi%20CyberteksIT%2C%20I%20am%20interested%20in%20joining%20your%20team"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors duration-200"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Us
            </a>
          </div>
        </div>
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 48" xmlns="http://www.w3.org/2000/svg" className="w-full h-12 text-white fill-current">
            <path d="M0,48 L0,24 Q360,0 720,24 Q1080,48 1440,24 L1440,48 Z" />
          </svg>
        </div>
      </section>

      {/* ── Culture / Intro with Image ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-[#023064]/10 to-[#E11D48]/5 rounded-3xl" />
            <img
              src="/assets/ict-skilling-capacity-building.jpg"
              alt="CyberteksIT team at work"
              className="relative rounded-3xl shadow-xl w-full object-cover aspect-[4/3]"
            />
            <div className="absolute -bottom-5 -right-5 bg-[#023064] text-white rounded-2xl px-5 py-3 shadow-xl">
              <p className="font-heading text-2xl font-bold">5+</p>
              <p className="text-xs text-blue-200">Years growing together</p>
            </div>
          </div>
          <div>
            <span className="text-[#E11D48] text-xs font-bold uppercase tracking-widest">Our Culture</span>
            <h2 className="font-heading text-4xl font-bold text-gray-900 mt-2 mb-5">
              Where great people do great work
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our mission is simple: to deliver world-class IT solutions and support, whether remotely
              or on the ground. We've built a culture that values curiosity, ownership, and collaboration
              above all else.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              You'll work directly with clients, own meaningful projects from day one, and be surrounded
              by colleagues who are genuinely passionate about using technology to transform Uganda and
              serve the world.
            </p>
            <ul className="space-y-3">
              {[
                'Work directly with real clients from day one',
                'Ownership over your projects and outcomes',
                'Continuous learning and skill development',
                'A culture that rewards results over presence',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-[#023064] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Why Work With Us ── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#E11D48] text-xs font-bold uppercase tracking-widest">Reasons to Join</span>
            <h2 className="font-heading text-3xl font-bold text-gray-900 mt-2">Why Work With Us</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              We've built the kind of workplace we always wished existed — here's what that means in practice.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {WHY_US.map((item, i) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex gap-5"
              >
                <div className="w-10 h-10 rounded-xl bg-[#023064] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white font-heading font-bold text-sm">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who We Look For ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div>
            <span className="text-[#E11D48] text-xs font-bold uppercase tracking-widest">The Right Fit</span>
            <h2 className="font-heading text-3xl font-bold text-gray-900 mt-2 mb-5">Who We Look For</h2>
            <p className="text-gray-600 leading-relaxed mb-5">
              We're building a team of innovators, problem-solvers, and lifelong learners. Whether
              you're a network engineer, software developer, cybersecurity specialist, trainer, or
              creative thinker — we want you.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We hire people, not just credentials. If you're driven, curious, and care about using
              technology for good — we want to hear from you.
            </p>
          </div>
          <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
            <h3 className="font-heading text-lg font-bold text-gray-900 mb-5">We want people who:</h3>
            <ul className="space-y-4">
              {[
                'Thrive in a fast-paced, ever-changing tech environment.',
                'Communicate well in both remote and in-person settings.',
                'Embrace technology as a tool for progress and impact.',
                'Take ownership and deliver without needing micromanagement.',
                'Are curious — always learning, always improving.',
                'Value honesty, integrity, and working as a team.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-[#E11D48]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-[#E11D48]" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Perks / Benefits ── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#E11D48] text-xs font-bold uppercase tracking-widest">Benefits</span>
            <h2 className="font-heading text-3xl font-bold text-gray-900 mt-2">Why you'll love working here</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PERKS.map((p) => (
              <div
                key={p.title}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group"
              >
                <div className="w-11 h-11 rounded-xl bg-[#023064]/10 flex items-center justify-center mb-4 group-hover:bg-[#023064] transition-colors duration-200">
                  <p.icon className="w-5 h-5 text-[#023064] group-hover:text-white transition-colors duration-200" />
                </div>
                <h3 className="font-heading text-base font-bold text-gray-900 mb-2">{p.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Current Openings ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#E11D48] text-xs font-bold uppercase tracking-widest">Now Hiring</span>
            <h2 className="font-heading text-3xl font-bold text-gray-900 mt-2">Current Openings</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              We have 4 open positions right now. Click "Apply Now" to send a tailored application directly
              to our team.
            </p>
          </div>
          <div className="space-y-5">
            {OPENINGS.map((job) => (
              <div
                key={job.title}
                className="bg-white border-2 border-gray-100 rounded-2xl p-7 hover:border-[#023064]/30 hover:shadow-lg transition-all duration-200 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-[#023064]/10 flex items-center justify-center shrink-0 group-hover:bg-[#023064] transition-colors duration-200">
                      <job.icon className="w-6 h-6 text-[#023064] group-hover:text-white transition-colors duration-200" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading text-lg font-bold text-gray-900 mb-2">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${job.departmentColor}`}>
                          {job.department}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                          <MapPin className="w-3 h-3" />
                          {job.location}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-700">
                          <Clock className="w-3 h-3" />
                          {job.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{job.desc}</p>
                    </div>
                  </div>
                  <div className="sm:shrink-0">
                    <a
                      href={`mailto:careers@cyberteks-it.com?subject=Application: ${encodeURIComponent(job.title)}`}
                      className="inline-flex items-center gap-2 bg-[#023064] hover:bg-[#E11D48] text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors duration-200 whitespace-nowrap"
                    >
                      Apply Now <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-500 text-sm mt-8">
            Don't see your role listed?{' '}
            <a
              href="mailto:careers@cyberteks-it.com"
              className="text-[#023064] font-semibold hover:text-[#E11D48] transition-colors"
            >
              Send us your CV anyway
            </a>{' '}
            — we're always interested in exceptional talent.
          </p>
        </div>
      </section>

      {/* ── How to Apply ── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#E11D48] text-xs font-bold uppercase tracking-widest">Process</span>
            <h2 className="font-heading text-3xl font-bold text-gray-900 mt-2">How to Apply</h2>
            <p className="text-gray-500 mt-3 max-w-md mx-auto">
              Our hiring process is straightforward, respectful of your time, and moves fast.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {STEPS.map((s) => (
              <div
                key={s.step}
                className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative"
              >
                <div className="font-heading text-5xl font-extrabold text-[#E11D48]/20 mb-3 leading-none">
                  {s.step}
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#023064]/10 flex items-center justify-center mb-4">
                  <s.icon className="w-5 h-5 text-[#023064]" />
                </div>
                <h3 className="font-heading text-base font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
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
            We're Hiring
          </span>
          <h2 className="font-heading text-4xl font-bold text-white mb-4">Ready to make an impact?</h2>
          <p className="text-blue-200 mb-10 text-lg">
            Join Uganda's most exciting ICT team. Help us build the digital future — one client,
            one student, one solution at a time.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="mailto:careers@cyberteks-it.com"
              className="inline-flex items-center gap-2 bg-[#E11D48] hover:bg-[#be1239] text-white font-bold px-8 py-3.5 rounded-xl transition-colors duration-200 shadow-lg"
            >
              <Mail className="w-4 h-4" />
              careers@cyberteks-it.com
            </a>
            <a
              href="https://wa.me/256779367005?text=Hi%20CyberteksIT%2C%20I%20am%20interested%20in%20a%20career%20opportunity"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors duration-200"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
