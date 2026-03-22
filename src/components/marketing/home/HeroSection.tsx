import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Monitor, Shield, GraduationCap, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

const TRUST_ITEMS = [
  '500+ Businesses Served', 'Remote-First Delivery', '24/7 Expert Support',
  'Certified Technicians', '3,000+ Professionals Trained', 'Kampala HQ + Remote Everywhere',
  '10+ Years in ICT', 'ISO-Aligned Processes',
];

const SLIDES = [
  {
    src: '/assets/ict-skilling-capacity-building.jpg',
    alt: 'ICT Skills Training',
    label: 'ICT Training & Capacity Building',
    tag: 'Skills Development',
  },
  {
    src: '/assets/cctv-surveillance-systems.jpg',
    alt: 'CCTV Surveillance Installation',
    label: 'CCTV Surveillance Systems',
    tag: 'Security Solutions',
  },
  {
    src: '/assets/access-control-systems.jpg',
    alt: 'Access Control Systems',
    label: 'Biometric Access Control',
    tag: 'Physical Security',
  },
  {
    src: '/assets/remote-it-support.jpg',
    alt: 'Remote IT Support',
    label: 'Remote IT Support & Helpdesk',
    tag: 'IT Services',
  },
  {
    src: '/assets/voip-solutions.jpg',
    alt: 'VoIP Solutions',
    label: 'VoIP & Unified Communications',
    tag: 'Networking',
  },
  {
    src: '/assets/web design.jpeg',
    alt: 'Web Design & Software',
    label: 'Web & Software Development',
    tag: 'Software & AI',
  },
];

export default function HeroSection() {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = (idx: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 300);
  };

  const prev = () => goTo((current - 1 + SLIDES.length) % SLIDES.length);
  const next = () => goTo((current + 1) % SLIDES.length);

  // Auto-advance every 4s
  useEffect(() => {
    const id = setInterval(next, 4000);
    return () => clearInterval(id);
  }, [current]); // eslint-disable-line react-hooks/exhaustive-deps

  const slide = SLIDES[current];

  return (
    <section className="pt-12 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="w-8 h-0.5 bg-primary-red" />
              <p className="text-sm font-bold text-primary-red uppercase tracking-[0.15em]">
                ICT Solutions &amp; Skills Development — Kampala, Uganda
              </p>
            </div>

            <h1 className="font-display text-[2.8rem] sm:text-5xl lg:text-[3.6rem] font-extrabold text-gray-900 leading-[1.06] tracking-tight mb-6">
              {t.hero.title1}{' '}
              <span className="text-[#023064]">{t.hero.title2}</span>{' '}
              {t.hero.title3}
            </h1>

            <p className="text-lg text-gray-500 leading-relaxed mb-10 max-w-[500px]">
              {t.hero.description}
            </p>

            <div className="flex flex-wrap gap-3 mb-14">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#023064] text-white font-bold text-base rounded-xl hover:bg-[#012550] transition-all shadow-sm"
              >
                {t.hero.exploreServices}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/apply"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary-red text-white font-bold text-base rounded-xl hover:bg-red-700 transition-all shadow-sm shadow-primary-red/20"
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

          {/* Right — image carousel */}
          <div className="hidden lg:block relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-gray-200 bg-gray-100">
              {/* Image */}
              <img
                key={current}
                src={slide.src}
                alt={slide.alt}
                className={cn(
                  'w-full h-full object-cover transition-opacity duration-300',
                  animating ? 'opacity-0' : 'opacity-100',
                )}
              />

              {/* Gradient overlay at bottom */}
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

              {/* Slide label */}
              <div className={cn(
                'absolute bottom-0 inset-x-0 p-5 transition-all duration-300',
                animating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0',
              )}>
                <span className="inline-block px-2.5 py-1 bg-primary-red text-white text-[10px] font-bold uppercase tracking-wider rounded-full mb-2">
                  {slide.tag}
                </span>
                <p className="text-white font-semibold text-sm">{slide.label}</p>
              </div>

              {/* Prev / Next */}
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-sm transition-all"
                aria-label="Previous"
              >
                <ChevronLeft className="w-4 h-4 text-gray-700" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-sm transition-all"
                aria-label="Next"
              >
                <ChevronRight className="w-4 h-4 text-gray-700" />
              </button>
            </div>

            {/* Dot indicators */}
            <div className="flex justify-center gap-1.5 mt-3">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={cn(
                    'rounded-full transition-all duration-300',
                    i === current
                      ? 'w-5 h-1.5 bg-primary-blue'
                      : 'w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400',
                  )}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Floating badge */}
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
