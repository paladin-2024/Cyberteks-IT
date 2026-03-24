import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap, Headphones, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const trainingPoints = [
  'Online & in-person options',
  '3,000+ graduates trained',
  'Industry-certified instructors',
];
const supportPoints = [
  'Response time under 30 minutes',
  'Remote & on-site coverage',
  'Flat-rate business plans available',
];

export default function CTASection() {
  const { t } = useLanguage();

  return (
    <section className="py-14 sm:py-20 lg:py-28 bg-gray-50 relative overflow-hidden">
      {/* Top gradient line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#E11D48]/30 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-8 h-0.5 bg-[#E11D48]" />
            <p className="text-sm font-bold text-[#E11D48] uppercase tracking-[0.15em]">Get Started Today</p>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-[1.08] tracking-tight max-w-md">
            Where do you want to begin?
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Training CTA */}
          <div className="bg-[#023064] rounded-3xl p-6 sm:p-10 relative overflow-hidden group">
            {/* Decorative circles */}
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/8 pointer-events-none transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-black/10 pointer-events-none" />
            <div className="absolute top-1/2 right-8 w-20 h-20 rounded-full border border-white/10 pointer-events-none" />

            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mb-7">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.18em] mb-3">Apply Now</p>
              <h3 className="font-display text-2xl sm:text-[1.75rem] font-extrabold text-white mb-3 leading-tight">
                {t.cta.training.title}
              </h3>
              <p className="text-white/65 mb-7 text-base leading-relaxed">{t.cta.training.description}</p>
              <ul className="space-y-2.5 mb-9">
                {trainingPoints.map((p) => (
                  <li key={p} className="flex items-center gap-2.5 text-[15px] text-white/80">
                    <CheckCircle2 className="w-4 h-4 text-white/50 shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
              <Link
                to="/apply"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-[#E11D48] font-bold text-base rounded-xl hover:bg-white/90 transition-all shadow-lg shadow-black/10 hover:-translate-y-0.5"
              >
                {t.cta.training.button}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* IT Support CTA */}
          <div className="bg-[#023064] rounded-3xl p-6 sm:p-10 relative overflow-hidden group">
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-[#E11D48]/10 pointer-events-none" />
            <div className="absolute top-1/2 right-8 w-20 h-20 rounded-full border border-white/8 pointer-events-none" />

            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-7">
                <Headphones className="w-6 h-6 text-white" />
              </div>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.18em] mb-3">Available 24/7</p>
              <h3 className="font-display text-2xl sm:text-[1.75rem] font-extrabold text-white mb-3 leading-tight">
                {t.cta.support.title}
              </h3>
              <p className="text-white/55 mb-7 text-base leading-relaxed">{t.cta.support.description}</p>
              <ul className="space-y-2.5 mb-9">
                {supportPoints.map((p) => (
                  <li key={p} className="flex items-center gap-2.5 text-[15px] text-white/70">
                    <CheckCircle2 className="w-4 h-4 text-[#E11D48]/80 shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
              <Link
                to="/get-started"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#E11D48] text-white font-bold text-base rounded-xl hover:bg-[#c41640] transition-all shadow-lg shadow-[#E11D48]/30 hover:-translate-y-0.5"
              >
                {t.cta.support.button}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
