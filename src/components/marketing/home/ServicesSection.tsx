import { Link } from 'react-router-dom';
import { ArrowUpRight, Monitor, Camera, Shield, Wifi, GraduationCap, Code2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

const serviceData = [
  { key: 'ictSkilling',   to: '/services/ict-skilling',      icon: GraduationCap, img: '/assets/ict-skilling-capacity-building.jpg',  featured: true },
  { key: 'remoteIt',      to: '/services/remote-it-support', icon: Monitor,       img: '/assets/remote-it-support.jpg',               featured: false },
  { key: 'cctv',          to: '/services/cctv',              icon: Camera,        img: '/assets/cctv-surveillance-systems.jpg',        featured: false },
  { key: 'accessControl', to: '/services/access-control',    icon: Shield,        img: '/assets/access-control-systems.jpg',          featured: false },
  { key: 'voip',          to: '/services/voip',              icon: Wifi,          img: '/assets/voip-solutions.jpg',                  featured: false },
  { key: 'softwareAi',    to: '/services/software-ai',       icon: Code2,         img: '/assets/web design.jpeg',                    featured: false },
];

export default function ServicesSection() {
  const { t } = useLanguage();

  return (
    <section className="py-14 sm:py-20 lg:py-28 bg-white relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#023064]/3 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-8 h-0.5 bg-[#E11D48]" />
            <p className="text-sm font-bold text-[#E11D48] uppercase tracking-[0.15em]">
              {t.services.badge}
            </p>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-[1.08] tracking-tight">
            {t.services.title}
          </h2>
        </div>

        {/* Grid, first card is featured (spans 2 rows on lg) */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-auto">
          {serviceData.map(({ key, to, icon: Icon, img, featured }, i) => {
            const item = t.services.items[key as keyof typeof t.services.items];
            return (
              <Link
                key={key}
                to={to}
                className={cn(
                  'group relative bg-white border-2 border-gray-100 rounded-2xl overflow-hidden transition-all duration-300',
                  'hover:border-[#023064]/30 hover:shadow-xl hover:shadow-[#023064]/8 hover:-translate-y-1',
                  featured && 'lg:row-span-2',
                )}
              >
                {/* Image */}
                <div className={cn(
                  'relative overflow-hidden bg-gray-100',
                  featured ? 'h-64 lg:h-[calc(100%-160px)]' : 'h-48',
                )}>
                  <img
                    src={img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                  />
                  {/* Dark overlay on hover */}
                  <div className="absolute inset-0 bg-[#023064]/0 group-hover:bg-[#023064]/12 transition-all duration-300" />

                  {/* Icon badge top-right */}
                  <div className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm group-hover:bg-white transition-colors">
                    <Icon className="w-4 h-4 text-[#023064]" />
                  </div>

                  {/* Featured label */}
                  {featured && (
                    <div className="absolute top-3 left-3 px-3 py-1 bg-[#E11D48] rounded-full">
                      <span className="text-white text-[10px] font-bold uppercase tracking-wider">Featured</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-display font-bold text-lg text-gray-900 mb-2 group-hover:text-[#023064] transition-colors">{item.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-5 line-clamp-2">{item.description}</p>
                  <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#023064] group-hover:text-[#E11D48] transition-colors">
                    {t.services.learnMore}
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>

                {/* Bottom red accent line on hover */}
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#E11D48] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-14">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-[#023064] text-[#023064] font-bold text-base rounded-xl hover:bg-[#023064] hover:text-white transition-all duration-200"
          >
            View All Services
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
