import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import {
  GraduationCap, Users, Building2, BookOpen, Award, CheckCircle2,
  ArrowRight, Phone, Mail, Play, MessageCircle, Clock, Tag,
  Star, Zap, Globe, Shield, Brain, Monitor,
  Code2, BarChart2, Wifi, Palette, Bot, ChevronDown, ChevronUp,
} from 'lucide-react';

const ONLINE_COURSES = [
  { id: 1,  title: 'Prompt Engineering',       price: 750000,  duration: '2 Months',   category: 'AI',          level: 'Beginner',     icon: Bot,       desc: 'Master the art of communicating with AI models to automate tasks, generate content, and build AI-powered solutions for any industry.' },
  { id: 2,  title: 'Augmented Reality',         price: 750000,  duration: '2 Months',   category: 'Technology',  level: 'Intermediate', icon: Globe,     desc: 'Design and develop AR experiences for mobile and enterprise apps. Learn to overlay digital content on the real world.' },
  { id: 3,  title: 'Virtual Reality',           price: 750000,  duration: '2 Months',   category: 'Technology',  level: 'Intermediate', icon: Monitor,   desc: 'Build immersive VR environments for training, real estate, entertainment, and education using modern VR platforms.' },
  { id: 4,  title: 'AI & Robotics',            price: 1500000, duration: '3 Months',   category: 'AI',          level: 'Intermediate', icon: Brain,     desc: 'Learn machine learning, neural networks, and robotics programming to build intelligent automated systems from scratch.' },
  { id: 5,  title: 'Modern Networking',         price: 1000000, duration: '2.5 Months', category: 'Networking',  level: 'Intermediate', icon: Wifi,      desc: 'Configure and manage enterprise networks, routing, switching, VLANs, SD-WAN, and cloud networking fundamentals.' },
  { id: 6,  title: 'Graphic Design',            price: 650000,  duration: '2 Months',   category: 'Design',      level: 'Beginner',     icon: Palette,   desc: 'Create compelling visual content using Adobe Suite and Canva for brands, social media, print, and digital marketing.' },
  { id: 7,  title: 'Microsoft Office',          price: 650000,  duration: '1.5 Months', category: 'Productivity', level: 'Beginner',    icon: Monitor,   desc: 'Master Word, Excel, PowerPoint, and Outlook for professional productivity, data management, and business communication.' },
  { id: 8,  title: 'Website Design',            price: 650000,  duration: '2 Months',   category: 'Development', level: 'Beginner',     icon: Globe,     desc: 'Build modern, responsive websites using HTML, CSS, and JavaScript. Create a real portfolio site by the end of the course.' },
  { id: 9,  title: 'Programming',              price: 1500000, duration: '3 Months',   category: 'Development', level: 'Beginner',     icon: Code2,     desc: 'Learn programming fundamentals in Python, JavaScript, or your chosen language, from basics to real-world projects.' },
  { id: 10, title: 'Cyber Security',            price: 1500000, duration: '3 Months',   category: 'Security',    level: 'Advanced',     icon: Shield,    desc: 'Defend digital assets with hands-on training in ethical hacking, network security, penetration testing, and incident response.' },
  { id: 11, title: 'Data Analytics',            price: 1500000, duration: '3 Months',   category: 'Data',        level: 'Intermediate', icon: BarChart2, desc: 'Transform raw data into actionable business insights using Excel, SQL, Power BI, and Python. Build dashboards that drive decisions.' },
];

const CORPORATE_PROGRAMS = [
  { title: 'Cyber Security',        price: 2000000, icon: Shield,    desc: 'Equip your team with the skills to identify, prevent, and respond to cyber threats in your organization environment.', duration: '2–5 Days' },
  { title: 'Fraud Awareness',       price: 2000000, icon: Bot,       desc: 'Build a fraud-aware culture with comprehensive training on detection, prevention, and reporting of fraudulent activities.', duration: '1–3 Days' },
  { title: 'Risk Management',       price: 2000000, icon: Zap,       desc: 'Identify and mitigate IT and operational risks with structured frameworks and real-world scenario-based training.', duration: '2–3 Days' },
  { title: 'Data Analytics',        price: 2000000, icon: BarChart2, desc: 'Transform your team\'s ability to work with data, from collection to dashboards and strategic business decisions.', duration: '2–5 Days' },
  { title: 'Artificial Intelligence', price: 2000000, icon: Brain,   desc: 'Understand AI capabilities, real-world use cases, and how to integrate AI tools into your business processes effectively.', duration: '2–3 Days' },
];

const VACATION_PROGRAMS = [
  {
    level: 'P7 Vacation',
    emoji: '🏫',
    color: 'bg-emerald-500',
    desc: 'Introduction to computers, typing, Microsoft Office, and internet safety. Perfect for primary school leavers preparing for digital learning.',
    topics: ['Computer Basics & Typing', 'Microsoft Office Essentials', 'Internet & Email Safety', 'Introduction to Digital Literacy'],
  },
  {
    level: 'S4 Vacation',
    emoji: '📚',
    color: 'bg-blue-500',
    desc: 'Web design, basic programming, graphic design, and career guidance for O-level leavers exploring technology careers.',
    topics: ['Basic Web Design (HTML/CSS)', 'Graphic Design Fundamentals', 'Social Media & Digital Marketing', 'Career Guidance in Tech'],
  },
  {
    level: 'S6 Vacation',
    emoji: '🎓',
    color: 'bg-violet-500',
    desc: 'Advanced programming, cyber security basics, and career-ready ICT skills for A-level leavers entering university or the job market.',
    topics: ['Programming Fundamentals', 'Cyber Security Basics', 'Data Analysis with Excel', 'Professional Portfolio Building'],
  },
];

const WHO_WE_TRAIN = [
  { icon: GraduationCap, label: 'University & college students' },
  { icon: Users,          label: 'Working professionals seeking career growth' },
  { icon: Building2,      label: 'Corporate teams and departments' },
  { icon: BookOpen,       label: 'Schools and academic institutions' },
  { icon: Globe,          label: 'NGOs and government agencies' },
  { icon: Award,          label: 'P7, S4 and S6 school leavers (vacation programs)' },
];

const WHY_CHOOSE = [
  { icon: Star,      title: 'Experienced & Certified Trainers', desc: 'Learn from passionate, skilled, industry-certified instructors with real-world experience across all disciplines.' },
  { icon: Globe,     title: 'Flexible Learning Modes',          desc: 'On-site training, virtual classes, or blended options. We meet you exactly where you are.' },
  { icon: Zap,       title: 'Practical, Job-Ready Skills',      desc: 'Every course is designed with the job market and real-world application in mind, no fluff.' },
  { icon: Award,     title: 'Certificates of Completion',       desc: 'Recognized training certificates to boost your career, academic profile, and professional credibility.' },
];

const VIDEOS = [
  { src: '/videos/session-1.webm', title: 'AI & Robotics Training Session',     tag: 'AI & Robotics' },
  { src: '/videos/session-2.webm', title: 'Networking & Security Workshop',     tag: 'Networking' },
  { src: '/videos/session-3.webm', title: 'Corporate Cyber Security Training',  tag: 'Corporate' },
  { src: '/videos/session-4.webm', title: 'Data Analytics Bootcamp',            tag: 'Data Analytics' },
  { src: '/videos/session-5.webm', title: 'Web Design & Development Class',     tag: 'Web Design' },
  { src: '/videos/session-6.webm', title: 'Cloud Computing Session',            tag: 'Cloud' },
  { src: '/videos/session-7.webm', title: 'Graphic Design Workshop',            tag: 'Design' },
  { src: '/videos/session-8.webm', title: 'Programming Fundamentals Class',     tag: 'Programming' },
  { src: '/videos/session-9.webm', title: 'Cyber Security Live Demo',           tag: 'Cyber Security' },
];

const fmt = (n: number) => 'UGX ' + n.toLocaleString();

function VideoCard({ src, title, tag }: { src: string; title: string; tag: string }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-all group">
      <div className="relative h-52 bg-[#023064] overflow-hidden">
        {playing ? (
          <video
            src={src}
            className="w-full h-full object-cover"
            autoPlay
            controls
            onEnded={() => setPlaying(false)}
          />
        ) : (
          <>
            <video
              src={src}
              className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
              muted
              preload="metadata"
            />
            <div
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
              onClick={() => setPlaying(true)}
            >
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/70 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/30 transition-all">
                <Play className="w-7 h-7 text-white fill-white ml-1" />
              </div>
            </div>
            <span className="absolute top-3 left-3 bg-[#E11D48] text-white text-xs font-bold px-2.5 py-1 rounded-full">{tag}</span>
          </>
        )}
      </div>
      <div className="p-4">
        <p className="font-heading font-bold text-gray-900 text-sm">{title}</p>
        <p className="text-xs text-gray-400 mt-1">Cyberteks-IT Training Session</p>
      </div>
    </div>
  );
}

type Tab = 'online' | 'corporate' | 'vacation';

export default function ICTSkillingPage() {
  const { t } = useLanguage();
  const [tab, setTab] = useState<Tab>('online');
  const [selected, setSelected] = useState<number | null>(null);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const selectedCourse = ONLINE_COURSES.find(c => c.id === selected) ?? null;

  return (
    <main className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-[#023064] pt-8 pb-12 sm:pt-12 sm:pb-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(ellipse at 80% 30%, #E11D48 0%, transparent 50%), radial-gradient(ellipse at 10% 80%, #3b82f6 0%, transparent 45%)' }} />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="max-w-6xl mx-auto relative">
          <div className="max-w-3xl">
            <span className="inline-block bg-[#E11D48] text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
              {t.servicePages.ictSkilling.hero.badge}
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-5 leading-tight">
              {t.servicePages.ictSkilling.hero.title1}{' '}
              <span className="text-[#E11D48]">{t.servicePages.ictSkilling.hero.title2}</span>
            </h1>
            <p className="text-blue-200 text-xl leading-relaxed mb-8 max-w-2xl">
              {t.servicePages.ictSkilling.hero.subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/apply"
                className="inline-flex items-center gap-2 bg-[#E11D48] hover:bg-[#be1239] text-white font-bold px-7 py-3.5 rounded-xl transition-all hover:scale-105 hover:shadow-lg">
                Apply Now <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="https://chat.whatsapp.com/Be367mq8OWpK3lI7kwqBWw?mode=gi_t"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white font-bold px-7 py-3.5 rounded-xl transition-all hover:scale-105 hover:shadow-lg">
                <MessageCircle className="w-4 h-4" /> Join WhatsApp Community
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-[#011a45] py-6 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { val: '11+', label: 'Online Programs' },
            { val: '5',   label: 'Corporate Courses' },
            { val: '3',   label: 'Vacation Levels' },
            { val: '200+', label: 'Graduates' },
          ].map(s => (
            <div key={s.label}>
              <p className="font-heading text-2xl font-extrabold text-white">{s.val}</p>
              <p className="text-blue-300 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Category Tabs + Content */}
      <section className="py-10 sm:py-14 lg:py-16 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[#E11D48] text-xs font-bold uppercase tracking-widest">Browse Programs</span>
            <h2 className="font-heading text-3xl font-bold text-gray-900 mt-2">Choose Your Learning Path</h2>
            <p className="text-gray-600 mt-2 text-sm">Online skilling for individuals · Corporate workshops · Vacation programmes for students</p>
          </div>

          {/* Tab switcher */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {([
              { key: 'online' as Tab,    label: 'Online Skilling',    icon: Globe,       count: '11 Courses' },
              { key: 'corporate' as Tab, label: 'Corporate Training',  icon: Building2,   count: '5 Programs' },
              { key: 'vacation' as Tab,  label: 'Vacation Programs',   icon: GraduationCap, count: 'P7 · S4 · S6' },
            ]).map(({ key, label, icon: Icon, count }) => (
              <button key={key} onClick={() => { setTab(key); setSelected(null); }}
                className={`group inline-flex flex-col items-center gap-1 px-4 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold text-sm transition-all border-2 ${
                  tab === key
                    ? 'bg-[#023064] text-white border-[#023064] shadow-xl scale-105'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-[#023064]/40 hover:shadow-md'
                }`}>
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" /> {label}
                </div>
                <span className={`text-xs font-normal ${tab === key ? 'text-blue-200' : 'text-gray-400'}`}>{count}</span>
              </button>
            ))}
          </div>

          {/* ── ONLINE SKILLING ── */}
          {tab === 'online' && (
            <div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                {ONLINE_COURSES.map(course => {
                  const isSelected = selected === course.id;
                  return (
                    <button key={course.id}
                      onClick={() => setSelected(isSelected ? null : course.id)}
                      className={`p-5 rounded-2xl border-2 text-left transition-all hover:shadow-lg cursor-pointer ${
                        isSelected
                          ? 'border-[#023064] bg-[#023064] text-white shadow-xl scale-[1.02]'
                          : 'border-gray-200 bg-white hover:border-[#023064]/40 hover:scale-[1.01]'
                      }`}>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${isSelected ? 'bg-white/10' : 'bg-[#023064]/10'}`}>
                        <course.icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#023064]'}`} />
                      </div>
                      <p className={`font-heading text-sm font-bold mb-1 ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                        {course.title}
                      </p>
                      <p className="text-[#E11D48] text-xs font-semibold">{fmt(course.price)}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <Clock className={`w-3 h-3 ${isSelected ? 'text-blue-300' : 'text-gray-400'}`} />
                        <span className={`text-xs ${isSelected ? 'text-blue-200' : 'text-gray-400'}`}>{course.duration}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected course detail */}
              {selectedCourse ? (
                <div className="bg-white border-2 border-[#023064] rounded-3xl p-8 shadow-xl mb-4">
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#023064]/10 flex items-center justify-center">
                          <selectedCourse.icon className="w-6 h-6 text-[#023064]" />
                        </div>
                        <div>
                          <h3 className="font-heading text-2xl font-bold text-gray-900">{selectedCourse.title}</h3>
                          <span className="text-xs text-gray-500 font-medium">{selectedCourse.category} · {selectedCourse.level}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed mb-5">{selectedCourse.desc}</p>
                      <div className="flex flex-wrap gap-3 mb-6">
                        <div className="bg-gray-50 rounded-xl px-4 py-2.5">
                          <p className="text-xs text-gray-400">Duration</p>
                          <p className="font-bold text-gray-900 text-sm">{selectedCourse.duration}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl px-4 py-2.5">
                          <p className="text-xs text-gray-400">Level</p>
                          <p className="font-bold text-gray-900 text-sm">{selectedCourse.level}</p>
                        </div>
                        <div className="bg-[#E11D48]/5 border border-[#E11D48]/20 rounded-xl px-4 py-2.5">
                          <p className="text-xs text-[#E11D48]">Course Fee</p>
                          <p className="font-bold text-[#E11D48] text-xl">{fmt(selectedCourse.price)}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Link to="/apply"
                          className="inline-flex items-center gap-2 bg-[#E11D48] hover:bg-[#be1239] text-white font-bold px-6 py-3 rounded-xl transition-all hover:scale-105">
                          Enroll Now <ArrowRight className="w-4 h-4" />
                        </Link>
                        <a href="tel:+256779367005"
                          className="inline-flex items-center gap-2 border-2 border-[#023064] text-[#023064] font-bold px-6 py-3 rounded-xl hover:bg-[#023064] hover:text-white transition-all">
                          <Phone className="w-4 h-4" /> Enquire
                        </a>
                        <a href="https://chat.whatsapp.com/Be367mq8OWpK3lI7kwqBWw?mode=gi_t"
                          target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#1da851] transition-all">
                          <MessageCircle className="w-4 h-4" /> Ask via WhatsApp
                        </a>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-5 w-full md:w-64 shrink-0 border border-gray-100">
                      <p className="font-heading text-sm font-bold text-gray-900 mb-3">What You'll Gain</p>
                      <ul className="space-y-2.5">
                        {[
                          'Certificate of completion',
                          'Practical project experience',
                          'Job-ready portfolio',
                          'WhatsApp alumni community',
                          'Post-training career support',
                        ].map(item => (
                          <li key={item} className="flex items-center gap-2 text-xs text-gray-600">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#023064] shrink-0" /> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 bg-white rounded-2xl border border-dashed border-gray-300">
                  <p className="text-gray-400 text-sm">↑ Click any course card above to see details and enroll</p>
                </div>
              )}
            </div>
          )}

          {/* ── CORPORATE TRAINING ── */}
          {tab === 'corporate' && (
            <div>
              <div className="bg-[#023064]/5 border border-[#023064]/20 rounded-2xl p-4 sm:p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Building2 className="w-6 h-6 text-[#023064] shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  Corporate training is delivered at your premises or our facility. Pricing is per training session (group).
                  Contact us for custom packages, multi-session discounts, and tailored curricula.
                </p>
                <Link to="/contact"
                  className="shrink-0 inline-flex items-center gap-2 bg-[#023064] text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-blue-900 transition-all">
                  Get Custom Quote
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {CORPORATE_PROGRAMS.map(p => (
                  <div key={p.title} className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-[#023064]/30 transition-all p-6 flex flex-col">
                    <div className="w-12 h-12 rounded-2xl bg-[#023064] flex items-center justify-center mb-4">
                      <p.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-gray-900 mb-2">{p.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-1">{p.desc}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mb-4">
                      <div>
                        <p className="text-xs text-gray-400">Duration</p>
                        <p className="text-sm font-bold text-gray-700">{p.duration}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[#E11D48]">From</p>
                        <p className="font-heading text-lg font-bold text-[#E11D48]">{fmt(p.price)}</p>
                      </div>
                    </div>
                    <Link to="/contact"
                      className="inline-flex items-center justify-center gap-2 bg-[#023064] hover:bg-blue-900 text-white font-bold px-5 py-3 rounded-xl transition-all w-full">
                      Book Training <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ))}

                {/* Custom package card */}
                <div className="bg-[#023064] rounded-3xl p-6 flex flex-col justify-between">
                  <div>
                    <Building2 className="w-10 h-10 text-[#E11D48] mb-4" />
                    <h3 className="font-heading text-lg font-bold text-white mb-2">Custom Corporate Package</h3>
                    <p className="text-blue-200 text-sm leading-relaxed mb-4">
                      Need a tailored training programme designed for your entire organization? We design bespoke curricula for any team size and any department.
                    </p>
                    <ul className="space-y-2 mb-5">
                      {['Any team size', 'Custom curriculum', 'Flexible scheduling', 'On-site or virtual'].map(f => (
                        <li key={f} className="flex items-center gap-2 text-xs text-blue-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#E11D48] shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link to="/contact"
                    className="inline-flex items-center gap-2 bg-[#E11D48] hover:bg-[#be1239] text-white font-bold px-5 py-3 rounded-xl transition-all">
                    Request Custom Quote <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* ── VACATION PROGRAMS ── */}
          {tab === 'vacation' && (
            <div>
              <div className="text-center mb-8">
                <p className="text-gray-600 max-w-xl mx-auto text-sm leading-relaxed">
                  Intensive holiday skilling programmes for school leavers. Give your child or student a
                  competitive edge before their next academic or career journey.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {VACATION_PROGRAMS.map(vp => (
                  <div key={vp.level} className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl transition-all overflow-hidden">
                    <div className={`${vp.color} p-6 text-center text-white`}>
                      <div className="text-5xl mb-2">{vp.emoji}</div>
                      <h3 className="font-heading text-xl font-bold">{vp.level} Programme</h3>
                    </div>
                    <div className="p-6">
                      <p className="text-sm text-gray-600 leading-relaxed mb-5">{vp.desc}</p>
                      <div className="mb-5">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Topics Covered</p>
                        <ul className="space-y-1.5">
                          {vp.topics.map(t => (
                            <li key={t} className="flex items-center gap-2 text-xs text-gray-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#023064] shrink-0" /> {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Link to="/contact"
                        className="inline-flex items-center justify-center gap-2 bg-[#023064] hover:bg-blue-900 text-white font-bold px-5 py-3 rounded-xl transition-all w-full">
                        Enquire Now <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center">
                <p className="text-amber-800 text-sm font-medium">
                  📅 Vacation programmes run during school holiday periods. Contact us to join the next intake.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* WhatsApp Community + Mentorship Hub */}
      <section className="py-10 sm:py-14 lg:py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[#E11D48] text-xs font-bold uppercase tracking-widest">Community & Mentorship</span>
            <h2 className="font-heading text-3xl font-bold text-gray-900 mt-2">Join Our Learning Ecosystem</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">

            {/* WhatsApp Group */}
            <div className="bg-[#25D366]/5 border-2 border-[#25D366]/30 rounded-3xl p-8">
              <div className="w-14 h-14 rounded-2xl bg-[#25D366] flex items-center justify-center mb-5">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-heading text-xl font-bold text-gray-900 mb-2">Free Learning Community</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-5">
                Connect with fellow learners, get study tips, hear about upcoming courses, and stay updated
                with the latest in tech. Join our free WhatsApp group today, no commitment required.
              </p>
              <ul className="space-y-2.5 mb-6">
                {[
                  'Free to join, no fees',
                  'Course announcements & schedules',
                  'Peer support & study groups',
                  'Job opportunities shared weekly',
                ].map(b => (
                  <li key={b} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-[#25D366] shrink-0" /> {b}
                  </li>
                ))}
              </ul>
              <a href="https://chat.whatsapp.com/Be367mq8OWpK3lI7kwqBWw?mode=gi_t"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white font-bold px-6 py-3.5 rounded-xl transition-all hover:scale-105 w-full justify-center">
                <MessageCircle className="w-5 h-5" /> Join WhatsApp Community
              </a>
            </div>

            {/* Mentorship Hub */}
            <div className="bg-[#023064] rounded-3xl p-8 text-white">
              <div className="w-14 h-14 rounded-2xl bg-[#E11D48] flex items-center justify-center mb-5">
                <Star className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-heading text-xl font-bold mb-1">Cyberteks-IT Mentorship Hub</h3>
              <p className="text-[#E11D48] text-xs font-bold uppercase tracking-wide mb-3">Premium Membership</p>
              <p className="text-blue-200 text-sm leading-relaxed mb-5">
                Get exclusive access to mentors, career coaching, 1-on-1 project reviews, and premium learning
                resources. The Mentorship Hub is for serious learners committed to advancing their career.
              </p>
              <div className="bg-white/10 rounded-2xl p-4 mb-5">
                <p className="text-xs text-blue-300 mb-1">Membership Fee</p>
                <div className="flex items-baseline gap-2">
                  <p className="font-heading text-3xl font-extrabold text-white">UGX 30,000</p>
                  <p className="text-blue-300 text-sm">/ 3 months</p>
                </div>
              </div>
              <div className="mb-5">
                <p className="text-xs font-bold text-blue-300 uppercase tracking-wide mb-2">Payment via</p>
                <div className="flex gap-3">
                  <span className="px-3 py-1.5 bg-white/10 rounded-lg text-xs text-white font-medium">📱 Mobile Money</span>
                  <span className="px-3 py-1.5 bg-white/10 rounded-lg text-xs text-white font-medium">🏦 Bank Transfer</span>
                </div>
              </div>
              <a href="mailto:info@cyberteks-it.com?subject=Mentorship Hub Membership Inquiry"
                className="inline-flex items-center gap-2 bg-[#E11D48] hover:bg-[#be1239] text-white font-bold px-6 py-3.5 rounded-xl transition-all hover:scale-105 w-full justify-center">
                <Mail className="w-5 h-5" /> Join Mentorship Hub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Previous Training Sessions (Video Gallery) */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#E11D48] text-xs font-bold uppercase tracking-widest">{t.servicePages.ictSkilling.sessions.badge}</span>
            <h2 className="font-heading text-3xl font-bold text-gray-900 mt-2">{t.servicePages.ictSkilling.sessions.title}</h2>
            <p className="text-gray-600 mt-2 max-w-xl mx-auto">
              {t.servicePages.ictSkilling.sessions.subtitle}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VIDEOS.map((v, i) => (
              <VideoCard key={i} src={v.src} title={v.title} tag={v.tag} />
            ))}
          </div>
          <div className="text-center mt-8">
            <a href="https://chat.whatsapp.com/Be367mq8OWpK3lI7kwqBWw?mode=gi_t"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-[#023064] text-[#023064] font-bold px-7 py-3.5 rounded-xl hover:bg-[#023064] hover:text-white transition-all">
              <MessageCircle className="w-4 h-4" /> Join Group to See More Content
            </a>
          </div>
        </div>
      </section>

      {/* Who We Train + Image */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-[#023064]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div>
            <span className="text-[#E11D48] text-xs font-bold uppercase tracking-widest">Our Students</span>
            <h2 className="font-heading text-3xl font-bold text-white mt-2 mb-6">Who We Train</h2>
            <p className="text-blue-200 text-sm leading-relaxed mb-8">
              Whether you're a fresh school leaver, a working professional, or a large organization —
              we have a programme designed specifically for your needs.
            </p>
            <ul className="space-y-4">
              {WHO_WE_TRAIN.map(w => (
                <li key={w.label} className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <w.icon className="w-4 h-4 text-[#E11D48]" />
                  </div>
                  <span className="text-blue-100 text-sm">{w.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <img src="/assets/ict-skilling-capacity-building.jpg" alt="Cyberteks-IT Training"
              className="rounded-3xl shadow-2xl w-full object-cover aspect-[4/3]" />
            <div className="absolute -bottom-5 -right-5 bg-[#E11D48] text-white rounded-2xl p-4 shadow-xl">
              <p className="font-heading text-2xl font-bold">200+</p>
              <p className="text-xs text-red-100">Trained & Certified</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#E11D48] text-xs font-bold uppercase tracking-widest">Why Cyberteks-IT</span>
            <h2 className="font-heading text-3xl font-bold text-gray-900 mt-2">What Makes Us Different</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_CHOOSE.map(w => (
              <div key={w.title} className="text-center p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-md hover:border-[#023064]/20 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-[#023064]/10 flex items-center justify-center mx-auto mb-4">
                  <w.icon className="w-6 h-6 text-[#023064]" />
                </div>
                <h3 className="font-heading text-sm font-bold text-gray-900 mb-2">{w.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Info */}
      <section className="py-10 sm:py-14 lg:py-16 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-[#E11D48] text-xs font-bold uppercase tracking-widest">Easy Payment</span>
          <h2 className="font-heading text-2xl font-bold text-gray-900 mt-2 mb-3">Flexible Payment Options</h2>
          <p className="text-gray-600 text-sm mb-8">We accept payment online and offline for your convenience.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Mobile Money', desc: 'MTN MoMo / Airtel Money, instant & easy', emoji: '📱' },
              { label: 'Bank Transfer', desc: 'Direct deposit to our bank account', emoji: '🏦' },
              { label: 'Online Payment', desc: 'Secure card payments via our portal', emoji: '💳' },
            ].map(p => (
              <div key={p.label} className="bg-white border border-gray-200 rounded-2xl p-5 text-center hover:shadow-md transition-shadow">
                <div className="text-3xl mb-2">{p.emoji}</div>
                <p className="font-bold text-gray-900 text-sm mb-1">{p.label}</p>
                <p className="text-xs text-gray-500">{p.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400">
            Contact us for payment details:{' '}
            <a href="mailto:info@cyberteks-it.com" className="text-[#023064] hover:underline">info@cyberteks-it.com</a>
            {' '}·{' '}
            <a href="tel:+256779367005" className="text-[#023064] hover:underline">+256 779 367 005</a>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-[#023064] text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-white mb-3">{t.servicePages.ictSkilling.cta.title}</h2>
          <p className="text-blue-200 mb-8">
            {t.servicePages.ictSkilling.cta.description}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/apply"
              className="inline-flex items-center gap-2 bg-[#E11D48] hover:bg-[#be1239] text-white font-bold px-8 py-3.5 rounded-xl transition-all hover:scale-105">
              {t.servicePages.ictSkilling.cta.button} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl transition-all">
              Talk to Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
