import { useLanguage } from '@/context/LanguageContext';

export default function StatsSection() {
  const { t } = useLanguage();

  const stats = [
    { value: '5+',   label: t.stats.years,    sub: 'Years of Experience' },
    { value: '100+', label: t.stats.clients,  sub: 'Happy Clients' },
    { value: '100+', label: t.stats.projects, sub: 'Delivered Projects' },
    { value: '200+', label: t.stats.trained,  sub: 'Professionals Trained' },
  ];

  return (
    <section className="bg-[#023064] relative overflow-hidden">
      {/* Grid texture */}
      <div className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      {/* Glow accents */}
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#E11D48]/12 blur-3xl pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/4 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map(({ value, label, sub }, i) => (
            <div
              key={label}
              className="py-14 px-8 text-center group relative"
            >
              {/* Vertical divider (except last) */}
              {i < stats.length - 1 && (
                <div className="absolute right-0 top-1/4 bottom-1/4 w-px bg-white/10 hidden lg:block" />
              )}
              {/* Mobile: bottom divider on first row */}
              {i < 2 && (
                <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-white/10 lg:hidden" />
              )}

              <p className="font-display text-5xl lg:text-[4rem] font-extrabold leading-none mb-1 text-white">
                {value}
              </p>
              <div className="w-8 h-0.5 bg-[#E11D48] mx-auto my-3 rounded-full" />
              <p className="text-sm font-bold text-white/70 uppercase tracking-wider mb-1">{label}</p>
              <p className="text-xs text-white/35 font-medium">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
