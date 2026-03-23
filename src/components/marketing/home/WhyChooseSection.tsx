import { CheckCircle2, Zap, Clock, Shield, TrendingUp, Users, Star } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const PILLAR_ICONS = [Zap, Clock, Shield, TrendingUp, Users, Star];

export default function WhyChooseSection() {
  const { t } = useLanguage();
  const reasons = t.whyChoose.reasons;
  const pillars = t.whyChoose.pillars;

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-16">
          <p className="text-xs font-bold text-primary-blue uppercase tracking-[0.15em] mb-3">
            {t.whyChoose.badge}
          </p>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight max-w-md">
            {t.whyChoose.title}
          </h2>
        </div>

        {/* Two column: text + image */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-12 lg:mb-20">

          {/* Left — checklist */}
          <div>
            <p className="text-gray-500 text-base leading-relaxed mb-6">
              {t.whyChoose.description}
            </p>
            <ul className="space-y-3">
              {reasons.map((reason) => (
                <li key={reason} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-primary-blue shrink-0 mt-0.5" />
                  <span className="text-gray-600 text-sm">{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — logo / image */}
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="w-72 h-72 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center">
                <img
                  src="/assets/logo-round.png"
                  alt="CyberteksIT"
                  className="w-32 h-32 object-contain"
                />
              </div>
              <div className="absolute -top-4 -right-4 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-center shadow-sm">
                <p className="font-display font-extrabold text-gray-900 text-xl leading-none">5+</p>
                <p className="text-xs text-gray-400 mt-1">{t.whyChoose.years}</p>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-primary-blue rounded-xl px-4 py-2.5 text-center">
                <p className="font-display font-extrabold text-white text-xl leading-none">100+</p>
                <p className="text-xs text-white/70 mt-1">{t.whyChoose.clients}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pillars.map((p, i) => {
            const Icon = PILLAR_ICONS[i];
            return (
              <div
                key={p.title}
                className="border border-gray-200 rounded-xl p-5 hover:border-primary-blue/40 transition-colors bg-white"
              >
                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
                  <Icon className="w-4 h-4 text-gray-500" />
                </div>
                <h3 className="font-display font-bold text-gray-900 text-sm mb-1.5">{p.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
