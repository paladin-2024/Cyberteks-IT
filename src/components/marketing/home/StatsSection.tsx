import { useLanguage } from '@/context/LanguageContext';

export default function StatsSection() {
  const { t } = useLanguage();

  const stats = [
    { value: '10+',    label: t.stats.years },
    { value: '500+',   label: t.stats.clients },
    { value: '1,200+', label: t.stats.projects },
    { value: '3,000+', label: t.stats.trained },
  ];

  return (
    <section className="border-t border-b border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-100">
          {stats.map(({ value, label }) => (
            <div key={label} className="py-12 px-8 text-center">
              <p className="font-display text-4xl lg:text-5xl font-extrabold text-gray-900 leading-none mb-2">
                {value}
              </p>
              <p className="text-sm text-gray-400">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
