import { Link } from 'react-router-dom';
import { ArrowUpRight, Monitor, Camera, Shield, Wifi, GraduationCap, Code2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const serviceData = [
  { key: 'remoteIt',      to: '/services/remote-it-support', icon: Monitor,       img: '/assets/remote-it-support.jpg' },
  { key: 'cctv',          to: '/services/cctv',              icon: Camera,        img: '/assets/cctv-surveillance-systems.jpg' },
  { key: 'accessControl', to: '/services/access-control',    icon: Shield,        img: '/assets/access-control-systems.jpg' },
  { key: 'voip',          to: '/services/voip',              icon: Wifi,          img: '/assets/voip-solutions.jpg' },
  { key: 'ictSkilling',   to: '/services/ict-skilling',      icon: GraduationCap, img: '/assets/ict-skilling-capacity-building.jpg' },
  { key: 'softwareAi',    to: '/services/software-ai',       icon: Code2,         img: '/assets/web design.jpeg' },
];

export default function ServicesSection() {
  const { t } = useLanguage();

  return (
    <section className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-8 h-0.5 bg-primary-red" />
              <p className="text-sm font-bold text-primary-red uppercase tracking-[0.15em]">
                {t.services.badge}
              </p>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-gray-900 leading-[1.08] tracking-tight max-w-sm">
              {t.services.title}
            </h2>
          </div>
          <p className="text-base text-gray-400 max-w-xs sm:text-right leading-relaxed">
            {t.services.subtitle}
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {serviceData.map(({ key, to, icon: Icon, img }, i) => {
            const item = t.services.items[key as keyof typeof t.services.items];
            return (
              <Link
                key={key}
                to={to}
                className="group bg-white border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-[#023064] hover:shadow-lg transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-[#023064]/0 group-hover:bg-[#023064]/15 transition-all duration-300" />
                  {/* Number badge */}
                  <div className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-primary-red flex items-center justify-center shadow-sm">
                    <span className="text-white font-display font-extrabold text-xs leading-none">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  {/* Icon badge */}
                  <div className="absolute top-3 right-3 w-9 h-9 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
                    <Icon className="w-4 h-4 text-[#023064]" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-display font-bold text-lg text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-base text-gray-400 leading-relaxed mb-5">{item.description}</p>
                  <div className="flex items-center gap-1.5 text-[15px] font-bold text-[#023064] group-hover:text-primary-red transition-colors">
                    {t.services.learnMore}
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-[#023064] text-[#023064] font-bold text-base rounded-xl hover:bg-[#023064] hover:text-white transition-all"
          >
            View All Services
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
