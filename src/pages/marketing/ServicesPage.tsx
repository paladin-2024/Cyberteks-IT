import ServicesSection from '@/components/marketing/home/ServicesSection';

export default function ServicesPage() {
  return (
    <div className="pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-4">
        <p className="text-xs font-bold text-primary-blue uppercase tracking-[0.15em] mb-3">What We Offer</p>
        <h1 className="font-display text-4xl font-extrabold text-gray-900 mb-4">All Services</h1>
        <p className="text-gray-500 text-lg max-w-xl">
          End-to-end ICT solutions for businesses and individuals across Uganda.
        </p>
      </div>
      <ServicesSection />
    </div>
  );
}
