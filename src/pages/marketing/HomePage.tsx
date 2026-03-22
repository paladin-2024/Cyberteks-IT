import HeroSection from '@/components/marketing/home/HeroSection';
import ServicesSection from '@/components/marketing/home/ServicesSection';
import StatsSection from '@/components/marketing/home/StatsSection';
import WhyChooseSection from '@/components/marketing/home/WhyChooseSection';
import TestimonialsSection from '@/components/marketing/home/TestimonialsSection';
import ClientsSection from '@/components/marketing/home/ClientsSection';
import CTASection from '@/components/marketing/home/CTASection';
import NewsletterSection from '@/components/marketing/home/NewsletterSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <WhyChooseSection />
      <TestimonialsSection />
      <ClientsSection />
      <CTASection />
      <NewsletterSection />
    </>
  );
}
