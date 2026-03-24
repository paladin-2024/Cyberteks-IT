import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Monitor, Shield, GraduationCap, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

const TRUST_ITEMS = [
  '100+ Businesses Served', 'Remote-First Delivery', '24/7 Expert Support',
  'Certified Technicians', '200+ Professionals Trained', 'Kampala HQ + Remote Everywhere',
  '5+ Years in ICT', 'ISO-Aligned Processes',
];

const SLIDES = [
  { src: '/assets/ict-skilling-capacity-building.jpg',   alt: 'ICT Skills Training',     label: 'ICT Training & Capacity Building',  tag: 'Skills Development' },
  { src: '/assets/cctv-surveillance-systems.jpg',        alt: 'CCTV Surveillance',        label: 'CCTV Surveillance Systems',         tag: 'Security Solutions' },
  { src: '/assets/access-control-systems.jpg',           alt: 'Access Control Systems',   label: 'Biometric Access Control',          tag: 'Physical Security' },
  { src: '/assets/remote-it-support.jpg',                alt: 'Remote IT Support',        label: 'Remote IT Support & Helpdesk',      tag: 'IT Services' },
  { src: '/assets/voip-solutions.jpg',                   alt: 'VoIP Solutions',           label: 'VoIP & Unified Communications',     tag: 'Networking' },
  { src: '/assets/web design.jpeg',                      alt: 'Web Design & Software',    label: 'Web & Software Development',        tag: 'Software & AI' },
];

export default function HeroSection() {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = (idx: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => { setCurrent(idx); setAnimating(false); }, 300);
  };
  const prev = () => goTo((current - 1 + SLIDES.length) % SLIDES.length);
  const next = () => goTo((current + 1) % SLIDES.length);

  useEffect(() => {
    const id = setInterval(next, 4500);
    return () => clearInterval(id);
  }, [current]); // eslint-disable-line react-hooks/exhaustive-deps

  const slide = SLIDES[current];

  return (
    <section className="pt-4 pb-0 bg-white overflow-hidden">
      {/* Subtle dot-grid background */}
      <div
        className="absolute inset-x-0 top-0 h-[700px] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'linear-gradient(to bottom, transparent 0%, white 30%, white 60%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, white 30%, white 60%, transparent 100%)',
          opacity: 0.35,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center py-12 lg:py-20">

          {/* ── LEFT ── */}
          <div>
            {/* Eyebrow pill */}
            <div className="inline-flex items-center gap-2 mb-7 px-4 py-2 rounded-full bg-[#023064]/6 border border-[#023064]/12">
              <Sparkles className="w-3.5 h-3.5 text-[#E11D48]" />
              <span className="text-xs font-bold text-[#023064] uppercase tracking-[0.14em]">
                Africa's Premier ICT Solutions Partner, Global Reach
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-[2rem] sm:text-[2.75rem] lg:text-[3.75rem] font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-5 sm:mb-7">
              {t.hero.title1}{' '}
              <span className="relative inline-block text-[#023064]">
                {t.hero.title2}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 220 12"
                  fill="none"
                  className="absolute -bottom-2 left-0 w-full"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 9 C40 3, 110 1, 218 9"
                    stroke="#E11D48"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{' '}
              {t.hero.title3}
            </h1>

            <p className="text-base sm:text-lg text-gray-500 leading-relaxed mb-8 sm:mb-10 max-w-[480px]">
              {t.hero.description}
            </p>

            {/* CTAs, Apply primary, Explore Services secondary */}
            <div className="flex flex-wrap gap-3 mb-10 sm:mb-14">
              <Link
                to="/apply"
                className="inline-flex items-center gap-2.5 px-7 py-4 bg-[#E11D48] text-white font-bold text-base rounded-xl hover:bg-[#c41640] transition-all duration-200 shadow-lg shadow-[#E11D48]/25 hover:shadow-[#E11D48]/40 hover:-translate-y-0.5"
              >
                {t.hero.applyTraining}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/get-started"
                className="inline-flex items-center gap-2.5 px-7 py-4 bg-white text-[#023064] font-bold text-base rounded-xl border-2 border-[#023064]/20 hover:border-[#023064] hover:bg-[#023064]/4 transition-all duration-200"
              >
                {t.hero.exploreServices}
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-6">
              {[
                { icon: Monitor,       value: '100+', label: t.stats.projects },
                { icon: Shield,        value: '100+', label: t.stats.clients },
                { icon: GraduationCap, value: '200+', label: t.stats.trained },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#023064]/6 border border-[#023064]/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[#023064]" />
                  </div>
                  <div>
                    <p className="text-xl font-extrabold text-gray-900 leading-none">{value}</p>
                    <p className="text-xs text-gray-400 mt-0.5 font-medium">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT, carousel ── */}
          <div className="hidden lg:block relative">
            {/* Decorative blobs */}
            <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-[#023064]/5 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-56 h-56 rounded-full bg-[#E11D48]/6 blur-3xl pointer-events-none" />

            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-gray-200/80 bg-gray-100 shadow-2xl shadow-gray-300/40">
              <img
                key={current}
                src={slide.src}
                alt={slide.alt}
                className={cn(
                  'w-full h-full object-cover transition-opacity duration-300',
                  animating ? 'opacity-0' : 'opacity-100',
                )}
              />

              {/* Gradient overlay */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/65 to-transparent pointer-events-none" />

              {/* Slide label */}
              <div className={cn(
                'absolute bottom-0 inset-x-0 p-5 transition-all duration-300',
                animating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0',
              )}>
                <span className="inline-block px-2.5 py-1 bg-[#E11D48] text-white text-[10px] font-bold uppercase tracking-wider rounded-full mb-2">
                  {slide.tag}
                </span>
                <p className="text-white font-semibold text-sm">{slide.label}</p>
              </div>

              <button onClick={prev} aria-label="Previous"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 hover:bg-white flex items-center justify-center shadow-md transition-all hover:scale-105">
                <ChevronLeft className="w-4 h-4 text-gray-700" />
              </button>
              <button onClick={next} aria-label="Next"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 hover:bg-white flex items-center justify-center shadow-md transition-all hover:scale-105">
                <ChevronRight className="w-4 h-4 text-gray-700" />
              </button>
            </div>

            {/* Dot indicators */}
            <div className="flex justify-center gap-1.5 mt-4">
              {SLIDES.map((_, i) => (
                <button key={i} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`}
                  className={cn('rounded-full transition-all duration-300',
                    i === current ? 'w-6 h-2 bg-[#023064]' : 'w-2 h-2 bg-gray-300 hover:bg-gray-400',
                  )}
                />
              ))}
            </div>

            {/* Floating badge, support */}
            <div className="absolute -bottom-5 -left-6 bg-white border border-gray-200/80 rounded-2xl px-5 py-3.5 shadow-lg shadow-gray-200/60">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/60 animate-pulse" />
                <div>
                  <p className="text-xs font-extrabold text-gray-900 leading-none">24/7 Support</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Response &lt; 30 min</p>
                </div>
              </div>
            </div>

            {/* Floating badge, experience */}
            <div className="absolute -top-4 -right-5 bg-[#023064] rounded-2xl px-4 py-3 shadow-lg">
              <p className="text-xs font-extrabold text-white leading-none">5+ Years</p>
              <p className="text-[11px] text-white/50 mt-0.5">ICT Excellence</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div className="border-t border-gray-100 bg-gray-50/50 py-4 overflow-hidden">
        <div className="flex gap-0 w-max animate-marquee-left">
          {[...TRUST_ITEMS, ...TRUST_ITEMS, ...TRUST_ITEMS].map((item, i) => (
            <span key={i}
              className="flex items-center gap-3 px-7 text-[11px] font-semibold text-gray-400 whitespace-nowrap uppercase tracking-widest"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48] shrink-0" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
