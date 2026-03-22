import { useLanguage } from '@/context/LanguageContext';

export default function StatsSection() {
  const { t } = useLanguage();

  const stats = [
    { value: '10+',    label: t.stats.years,    accent: 'text-primary-red' },
    { value: '500+',   label: t.stats.clients,  accent: 'text-white' },
    { value: '1,200+', label: t.stats.projects, accent: 'text-primary-red' },
    { value: '3,000+', label: t.stats.trained,  accent: 'text-white' },
  ];

  return (
    <section className="bg-[#023064] relative overflow-hidden">
      {/* Decorative diagonal line */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-grid opacity-10" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-primary-red/10 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
          {stats.map(({ value, label, accent }) => (
            <div key={label} className="py-14 px-8 text-center group">
              <p className={`font-display text-5xl lg:text-6xl font-extrabold leading-none mb-3 transition-colors ${accent}`}>
                {value}
              </p>
              <p className="text-base text-white/50 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
