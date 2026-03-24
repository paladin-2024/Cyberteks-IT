import { Star } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const testimonials = [
  {
    name: 'Nakato Aisha',
    program: 'Cyber Security (4 months)',
    quote: 'The cybersecurity course completely transformed my career. I went from having zero knowledge to landing a job as a SOC analyst within two months of completing the program.',
    initials: 'NA',
  },
  {
    name: 'Ssemwanga Brian',
    program: 'Web Development & Programming',
    quote: "Cyberteks-IT's hands-on approach and small class sizes made all the difference. I built three real projects and now freelance confidently.",
    initials: 'SB',
  },
  {
    name: 'Namukasa Grace',
    program: 'Data Analytics (3 months)',
    quote: 'The Data Analytics program was exactly what my organisation needed. Our reporting has improved dramatically and I can now build dashboards that impress our board every quarter.',
    initials: 'NG',
  },
  {
    name: 'Okello David',
    program: 'Digital Marketing (2 months)',
    quote: "Within the first month I learned SEO and Google Ads. My website traffic increased by 300% and I'm getting real client leads now.",
    initials: 'OD',
  },
  {
    name: 'Namutebi Sandra',
    program: 'Graphic Design (2 months)',
    quote: 'From Canva basics to professional Adobe Suite, the course covered everything. I now have a full portfolio and two regular clients.',
    initials: 'NS',
  },
  {
    name: 'Kiggundu Ronald',
    program: 'AI & Robotics (3 months)',
    quote: 'Learning machine learning and robotics in Kampala with such qualified trainers was something I never expected. Absolutely worth every shilling.',
    initials: 'KR',
  },
];

export default function TestimonialsSection() {
  const { t } = useLanguage();

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-14">
          <p className="text-xs font-bold text-primary-blue uppercase tracking-[0.15em] mb-3">
            {t.testimonials.badge}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight max-w-sm">
            {t.testimonials.title}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col"
            >
              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-gray-900 text-gray-900" />
                ))}
              </div>

              <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-6">
                &ldquo;{item.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary-blue flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">{item.initials}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.program}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
