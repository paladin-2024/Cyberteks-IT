import { Link } from 'react-router-dom';
import {
  Code2, Brain, MessageCircle, BarChart3, Zap, Plug,
  CheckCircle2, ArrowRight, Layers, ShieldCheck, Cloud, Headphones,
} from 'lucide-react';

const STATS = [
  { value: '50+', label: 'Apps Built' },
  { value: '3x', label: 'Faster Delivery' },
  { value: 'AI-First', label: 'Every Solution' },
  { value: '12 Mo.', label: 'Post-Launch Support' },
];

const SERVICES = [
  {
    icon: Code2,
    title: 'Custom Software Development',
    desc: 'Tailor-made web and desktop applications built to your exact business needs. From internal tools to full SaaS platforms, we engineer software that fits how your team works.',
    tags: ['React', 'Node.js', 'Python'],
  },
  {
    icon: Brain,
    title: 'AI & Machine Learning Solutions',
    desc: 'Intelligent algorithms that learn from your data to predict outcomes, surface insights, and automate complex decisions — without constant human intervention.',
    tags: ['TensorFlow', 'PyTorch'],
  },
  {
    icon: MessageCircle,
    title: 'Chatbots & Virtual Assistants',
    desc: 'Deploy AI-powered chatbots for customer support, lead generation, and internal automation. Available 24/7 across web, WhatsApp, and messaging platforms.',
    tags: ['GPT-4', 'Rasa'],
  },
  {
    icon: BarChart3,
    title: 'Business Intelligence & Analytics',
    desc: 'Transform raw data into actionable dashboards and reports. Equip decision-makers with real-time visibility into KPIs, trends, and operational performance.',
    tags: ['Power BI', 'Python'],
  },
  {
    icon: Zap,
    title: 'Workflow Automation',
    desc: 'Automate repetitive tasks, approvals, and notifications to save time and reduce costly errors. Connect your tools and let them work for you around the clock.',
    tags: ['Zapier', 'n8n'],
  },
  {
    icon: Plug,
    title: 'API Development & Integration',
    desc: 'Connect your systems with third-party tools through robust, scalable APIs. We design clean interfaces that make your software ecosystem work as one.',
    tags: ['REST', 'GraphQL'],
  },
];

const WHY = [
  {
    icon: Layers,
    title: 'Agile Development',
    desc: 'Delivered in focused sprints, not years. You see working software every two weeks.',
  },
  {
    icon: Headphones,
    title: 'Post-Launch Support',
    desc: '12 months of maintenance and support included in every engagement — we don\'t disappear at launch.',
  },
  {
    icon: Cloud,
    title: 'Built for Scale',
    desc: 'Cloud-native architectures on AWS, Azure, and GCP that grow as your business grows.',
  },
  {
    icon: ShieldCheck,
    title: 'AI-First Mindset',
    desc: 'We bake intelligence into every solution — from smart search to predictive analytics.',
  },
];

const PROCESS = [
  {
    step: '01',
    title: 'Discovery & Planning',
    desc: 'Requirements gathering, solution architecture, and tech stack selection aligned with your goals and budget.',
  },
  {
    step: '02',
    title: 'Design & Prototype',
    desc: 'UI/UX wireframes, user flows, and clickable prototypes for stakeholder review before a line is written.',
  },
  {
    step: '03',
    title: 'Development & Testing',
    desc: 'Agile sprints, peer code reviews, and rigorous QA testing to deliver reliable, production-ready software.',
  },
  {
    step: '04',
    title: 'Launch & Support',
    desc: 'Smooth deployment, team training, and ongoing maintenance so your software keeps delivering value.',
  },
];

const INDUSTRIES = [
  'Fintech & Banking',
  'Healthcare',
  'Education & EdTech',
  'Retail & E-Commerce',
  'Government & NGOs',
  'Logistics & Manufacturing',
];

export default function SoftwareAIPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* ── Hero ── */}
      <section className="pt-12 pb-20 px-6 bg-[#023064] relative overflow-hidden">
        {/* subtle radial glows */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 70% 30%, rgba(225,29,72,0.18) 0%, transparent 55%), radial-gradient(ellipse at 15% 80%, rgba(59,130,246,0.12) 0%, transparent 50%)',
          }}
        />
        <div className="max-w-4xl mx-auto relative text-center">
          <span className="inline-block bg-[#E11D48] text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            AI &amp; Software Solutions
          </span>
          <h1 className="font-heading text-5xl md:text-6xl font-extrabold text-white mb-5 leading-tight">
            Intelligent Software, <br />
            <span className="text-[#E11D48]">Built for Results</span>
          </h1>
          <p className="text-blue-200 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            At Cyberteks-IT, we develop intelligent Software and AI Solutions that help businesses
            automate processes, make data-driven decisions, and deliver exceptional digital
            experiences. From custom applications to AI-powered automation, we bring your vision to life.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#E11D48] hover:bg-[#be1239] text-white font-bold px-8 py-3.5 rounded-xl transition-colors duration-300"
            >
              Start Your Project <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors duration-300"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section className="bg-gradient-to-br from-[#023064] to-[#012550] border-t border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
          {STATS.map((s) => (
            <div key={s.label} className="text-center px-4 py-2">
              <p className="font-heading text-3xl md:text-4xl font-extrabold text-[#E11D48]">
                {s.value}
              </p>
              <p className="text-blue-200 text-sm font-medium mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Services ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#E11D48] text-xs font-bold uppercase tracking-widest">
              What We Build
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              Our Software &amp; AI Services
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto leading-relaxed">
              End-to-end digital solutions across the full technology stack — designed to solve
              real business problems with measurable impact.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 hover:shadow-md hover:border-[#023064] transition-all duration-300 hover:scale-105 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#023064]/10 flex items-center justify-center mb-5 group-hover:bg-[#023064] transition-colors duration-300">
                  <s.icon className="w-6 h-6 text-[#023064] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-heading text-base font-bold text-gray-900 mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-5">{s.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {s.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 bg-[#023064]/5 border border-[#023064]/15 text-[#023064] text-xs font-semibold rounded-lg"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#E11D48] text-xs font-bold uppercase tracking-widest">
              Why Cyberteks-IT
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              The Cyberteks-IT Difference
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto leading-relaxed">
              We combine technical excellence with a deep understanding of how businesses
              operate — so every solution we build actually gets used.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY.map((w) => (
              <div
                key={w.title}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#023064] transition-all duration-300 hover:scale-105 text-center group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#023064]/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#E11D48] transition-colors duration-300">
                  <w.icon className="w-6 h-6 text-[#023064] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-heading text-sm font-bold text-gray-900 mb-2">{w.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Agile development — delivered in sprints, not years',
                'Post-launch support & maintenance included for 12 months',
                'Built for scale — cloud-native architectures from day one',
                'AI-first mindset baked into every solution we deliver',
              ].map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#E11D48] shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700 leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section className="py-24 px-6 bg-gradient-to-br from-[#023064] to-[#012550]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#E11D48] text-xs font-bold uppercase tracking-widest">
              How We Work
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mt-2">
              Our Development Process
            </h2>
            <p className="text-blue-200 mt-3 max-w-xl mx-auto leading-relaxed">
              A proven four-stage process that keeps projects on track, on budget, and
              aligned with your business goals at every step.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS.map((p) => (
              <div
                key={p.step}
                className="relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-[#E11D48]/50 transition-all duration-300 hover:scale-105"
              >
                <div className="font-heading text-5xl font-extrabold text-[#E11D48]/30 mb-3 leading-none">
                  {p.step}
                </div>
                <h3 className="font-heading text-base font-bold text-white mb-2">{p.title}</h3>
                <p className="text-sm text-blue-200 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Industries ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[#E11D48] text-xs font-bold uppercase tracking-widest">
            Sectors We Serve
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Industries We Work In
          </h2>
          <p className="text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
            We've built intelligent software and AI solutions for organisations across a
            wide range of industries — each with their own unique challenges and opportunities.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {INDUSTRIES.map((ind) => (
              <span
                key={ind}
                className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold text-sm rounded-xl shadow-sm hover:border-[#023064] hover:text-[#023064] transition-all duration-300 hover:scale-105"
              >
                {ind}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 bg-gradient-to-br from-[#023064] to-[#012550] text-center">
        <div className="max-w-2xl mx-auto">
          <span className="inline-block bg-[#E11D48]/20 text-[#E11D48] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            Ready to Build?
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            Have a project in mind?
          </h2>
          <p className="text-blue-200 mb-10 leading-relaxed">
            Tell us about it. We'll scope it, price it, and build it — on time and within budget.
            Your first consultation is completely free.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#E11D48] hover:bg-[#be1239] text-white font-bold px-9 py-4 rounded-xl transition-colors duration-300 hover:scale-105 transform"
            >
              Start Your Project <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-9 py-4 rounded-xl transition-colors duration-300"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
