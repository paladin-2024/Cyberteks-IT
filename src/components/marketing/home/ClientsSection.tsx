import { useLanguage } from '@/context/LanguageContext';

const clients = [
  { name: 'AIS',               logo: '/assets/ais-logo-442b3d04-0952-42d1-932b-50ecf1f2fc85.png' },
  { name: 'Auto Moto',         logo: '/assets/auto-moto-logo-b106b519-3fb4-4891-9111-b33bb4ccc086.png' },
  { name: 'DAO Marble',        logo: '/assets/dao-marble-logo-a1f1e271-7ba4-4ceb-a8c0-ddbb6a3bbaff.png' },
  { name: 'Dembe Trading',     logo: '/assets/dembe-trading-logo-3bb90707-7558-4b87-b614-8da2eecfc5ee.png' },
  { name: 'Future Options',    logo: '/assets/future-options-8864786f-c7d2-44f3-b1d4-07254ef2a212.png' },
  { name: 'IUEA',              logo: '/assets/iuea.png' },
  { name: 'Krishna Construction', logo: '/assets/krishna-construction-logo-e634ca34-80d6-440a-a1a6-5ad2f3953962.png' },
  { name: 'Sanaa Consulting',  logo: '/assets/sanaa-consulting-3a639a2d-4c5b-4c90-8432-c968ba9afec8.png' },
  { name: 'Shree',             logo: '/assets/shree-logo-0357acdd-2e85-44eb-9f80-00463f5c3c53.png' },
  { name: 'Vision Fund',       logo: '/assets/vision-fund-8cfd48bb-2f07-4959-8e0c-165dda14ea28.png' },
];

export default function ClientsSection() {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-[#023064] overflow-hidden relative">
      {/* Grid texture */}
      <div className="absolute inset-0 opacity-8 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <div className="inline-flex items-center gap-3 mb-2">
          <span className="w-6 h-0.5 bg-[#E11D48] opacity-60" />
          <p className="text-sm font-bold text-white/40 uppercase tracking-[0.18em]">{t.clients.tagline}</p>
          <span className="w-6 h-0.5 bg-[#E11D48] opacity-60" />
        </div>
        <p className="text-base text-white/30 mt-2 font-medium">
          Trusted by leading businesses across Uganda and East Africa
        </p>
      </div>

      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-28 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, #023064, transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-28 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, #023064, transparent)' }} />

        <div className="flex gap-16 animate-scroll w-max">
          {[...clients, ...clients].map((client, i) => (
            <div key={i} className="flex-shrink-0 flex items-center justify-center w-52 h-28 group">
              <img
                src={client.logo}
                alt={client.name}
                className="max-h-20 w-auto object-contain grayscale brightness-200 opacity-50 group-hover:opacity-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
