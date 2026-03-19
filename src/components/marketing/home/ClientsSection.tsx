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
    <section className="py-16 bg-white border-t border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.15em]">
          {t.clients.tagline}
        </p>
      </div>

      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-white z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, white, transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, white, transparent)' }} />

        <div className="flex gap-16 animate-scroll w-max">
          {[...clients, ...clients].map((client, i) => (
            <div key={i} className="flex-shrink-0 flex items-center justify-center w-40 h-20">
              <img
                src={client.logo}
                alt={client.name}
                className="max-h-14 w-auto object-contain grayscale opacity-50 hover:opacity-80 hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
