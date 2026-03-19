import { Link } from 'react-router-dom';
import { ArrowRight, Monitor, Shield, GraduationCap } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const TRUST_ITEMS = [
  '500+ Businesses Served', 'Remote-First Delivery', '24/7 Expert Support',
  'Certified Technicians', '3,000+ Professionals Trained', 'Kampala HQ + Remote Everywhere',
  '10+ Years in ICT', 'ISO-Aligned Processes',
];

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="pt-36 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div>
            <p className="text-xs font-bold text-primary-blue uppercase tracking-[0.15em] mb-6">
              ICT Solutions &amp; Skills Development — Kampala, Uganda
            </p>

            <h1 className="font-display text-[2.6rem] sm:text-5xl lg:text-[3.2rem] font-extrabold text-gray-900 leading-[1.06] tracking-tight mb-6">
              {t.hero.title1}{' '}
              <span className="text-primary-blue">{t.hero.title2}</span>{' '}
              {t.hero.title3}
            </h1>

            <p className="text-base text-gray-500 leading-relaxed mb-10 max-w-[480px]">
              {t.hero.description}
            </p>

            <div className="flex flex-wrap gap-3 mb-14">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-blue text-white font-bold text-sm rounded-lg hover:bg-blue-900 transition-all"
              >
                {t.hero.exploreServices}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/apply"
                className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-semibold text-sm rounded-lg hover:border-gray-400 hover:text-gray-900 transition-all"
              >
                {t.hero.applyTraining}
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-8">
              {[
                { icon: Monitor,       value: '1,200+', label: t.stats.projects },
                { icon: Shield,        value: '500+',   label: t.stats.clients },
                { icon: GraduationCap, value: '3,000+', label: t.stats.trained },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xl font-extrabold text-gray-900 leading-none">{value}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — image */}
          <div className="hidden lg:block relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-gray-200">
              <img
                src="/assets/ict-skilling-capacity-building.jpg"
                alt="ICT Training at CyberteksIT"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -left-5 bg-white border border-gray-200 rounded-xl px-5 py-3 shadow-sm">
              <p className="text-xs font-bold text-gray-900">24/7 Support</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Response &lt; 30 min</p>
            </div>
          </div>
        </div>

        {/* Trust strip */}
        <div className="mt-16 pt-8 border-t border-gray-100">
          <div className="overflow-hidden">
            <div className="flex gap-0 w-max animate-marquee-left">
              {[...TRUST_ITEMS, ...TRUST_ITEMS, ...TRUST_ITEMS].map((item, i) => (
                <span
                  key={i}
                  className="flex items-center gap-2.5 px-6 text-[11px] font-semibold text-gray-400 whitespace-nowrap uppercase tracking-widest"
                >
                  <span className="w-1 h-1 rounded-full bg-primary-blue shrink-0" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
