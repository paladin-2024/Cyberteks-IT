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
    <section className="py-28 bg-gray-50 relative overflow-hidden">
      {/* Decorative bg */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-red/20 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-8 h-0.5 bg-primary-red" />
            <p className="text-sm font-bold text-primary-red uppercase tracking-[0.15em]">
              Get Started Today
            </p>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-gray-900 leading-[1.08] tracking-tight max-w-md">
            Where do you want to begin?
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Training CTA — Red */}
          <div className="bg-primary-red rounded-2xl p-10 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/8 pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-black/10 pointer-events-none" />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center mb-7">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <p className="text-xs font-bold text-white/50 uppercase tracking-[0.15em] mb-3">
                Apply Now
              </p>
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white mb-3 leading-tight">
                {t.cta.training.title}
              </h3>
              <p className="text-white/65 mb-7 text-base leading-relaxed">
                {t.cta.training.description}
              </p>
              <ul className="space-y-2.5 mb-9">
                {trainingPoints.map((p) => (
                  <li key={p} className="flex items-center gap-2.5 text-base text-white/75">
                    <CheckCircle2 className="w-4 h-4 text-white/60 shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
              <Link
                to="/apply"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-red font-bold text-base rounded-xl hover:bg-white/90 transition-all shadow-lg shadow-black/10"
              >
                {t.cta.training.button}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* IT Support CTA — Blue */}
          <div className="bg-[#023064] rounded-2xl p-10 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-primary-red/10 pointer-events-none" />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-7">
                <Headphones className="w-6 h-6 text-white" />
              </div>
              <p className="text-xs font-bold text-white/40 uppercase tracking-[0.15em] mb-3">
                Available 24/7
              </p>
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white mb-3 leading-tight">
                {t.cta.support.title}
              </h3>
              <p className="text-white/55 mb-7 text-base leading-relaxed">
                {t.cta.support.description}
              </p>
              <ul className="space-y-2.5 mb-9">
                {supportPoints.map((p) => (
                  <li key={p} className="flex items-center gap-2.5 text-base text-white/65">
                    <CheckCircle2 className="w-4 h-4 text-primary-red/80 shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
              <Link
                to="/get-started"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-red text-white font-bold text-base rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-primary-red/30"
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
