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
    <section className="py-24 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <p className="text-xs font-bold text-primary-blue uppercase tracking-[0.15em] mb-3">
              {t.services.badge}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight max-w-sm">
              {t.services.title}
            </h2>
          </div>
          <p className="text-sm text-gray-400 max-w-xs sm:text-right leading-relaxed">
            {t.services.subtitle}
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {serviceData.map(({ key, to, icon: Icon, img }, i) => {
            const item = t.services.items[key as keyof typeof t.services.items];
            return (
              <Link
                key={key}
                to={to}
                className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-primary-blue hover:shadow-sm transition-all duration-200"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden bg-gray-100">
                  <img
                    src={img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                    <Icon className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="absolute top-3 left-3 w-7 h-7 flex items-center justify-center">
                    <span className="text-white/40 font-display font-extrabold text-2xl leading-none">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-display font-bold text-base text-gray-900 mb-1.5">{item.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-4">{item.description}</p>
                  <div className="flex items-center gap-1 text-sm font-semibold text-primary-blue">
                    {t.services.learnMore}
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-10">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-semibold text-sm rounded-lg hover:border-primary-blue hover:text-primary-blue transition-all"
          >
            View All Services
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
