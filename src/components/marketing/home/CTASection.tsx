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
    <section className="py-24 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-14">
          <p className="text-xs font-bold text-primary-blue uppercase tracking-[0.15em] mb-3">
            Get Started Today
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight max-w-sm">
            Where do you want to begin?
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5">

          {/* Training CTA */}
          <div className="bg-primary-blue rounded-xl p-8">
            <div className="w-11 h-11 rounded-lg bg-white/15 flex items-center justify-center mb-6">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs font-bold text-white/50 uppercase tracking-[0.12em] mb-3">
              Apply Now
            </p>
            <h3 className="font-display text-2xl font-extrabold text-white mb-3 leading-tight">
              {t.cta.training.title}
            </h3>
            <p className="text-white/60 mb-6 text-sm leading-relaxed">
              {t.cta.training.description}
            </p>
            <ul className="space-y-2 mb-8">
              {trainingPoints.map((p) => (
                <li key={p} className="flex items-center gap-2.5 text-sm text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-white/50 shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
            <Link
              to="/apply"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-primary-blue font-bold text-sm rounded-lg hover:bg-white/90 transition-all"
            >
              {t.cta.training.button}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* IT Support CTA */}
          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <div className="w-11 h-11 rounded-lg bg-gray-100 flex items-center justify-center mb-6">
              <Headphones className="w-6 h-6 text-gray-500" />
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.12em] mb-3">
              Available 24/7
            </p>
            <h3 className="font-display text-2xl font-extrabold text-gray-900 mb-3 leading-tight">
              {t.cta.support.title}
            </h3>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              {t.cta.support.description}
            </p>
            <ul className="space-y-2 mb-8">
              {supportPoints.map((p) => (
                <li key={p} className="flex items-center gap-2.5 text-sm text-gray-500">
                  <CheckCircle2 className="w-4 h-4 text-gray-300 shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
            <Link
              to="/get-started"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-blue text-white font-bold text-sm rounded-lg hover:bg-blue-900 transition-all"
            >
              {t.cta.support.button}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
