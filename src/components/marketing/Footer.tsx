import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Instagram, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const socialLinks = [
  { icon: Facebook,  href: 'https://facebook.com/cyberteksit',          label: 'Facebook' },
  { icon: Twitter,   href: 'https://twitter.com/cyberteksit',           label: 'Twitter' },
  { icon: Linkedin,  href: 'https://linkedin.com/company/cyberteks-it', label: 'LinkedIn' },
  { icon: Instagram, href: 'https://instagram.com/cyberteksit',         label: 'Instagram' },
];

const serviceHrefs = [
  '/services/remote-it-support',
  '/services/cctv',
  '/services/access-control',
  '/services/voip',
  '/services/ict-skilling',
  '/services/software-ai',
];

const quickHrefs = [
  '/about', '/products', '/careers', '/contact',
  '/apply', '/get-started', '/privacy-policy', '/terms-of-use',
];

export default function Footer() {
  const { t } = useLanguage();

  const quickLinks = t.footer.quickLinkItems.map((label, i) => ({ label, to: quickHrefs[i] }));
  const services   = t.footer.serviceItems.map((label, i) => ({ label, to: serviceHrefs[i] }));

  return (
    <footer className="bg-[#023064]">
      {/* Red accent top border */}
      <div className="h-1 bg-primary-red w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <img
                src="/assets/cyberteks-it-white-logo.png"
                alt="Cyberteks-IT"
                className="h-14 w-auto object-contain"
              />
            </Link>
            <p className="text-base leading-relaxed text-white/55 mb-7 max-w-[260px]">
              {t.footer.tagline}
            </p>
            <div className="flex items-center gap-2">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center hover:bg-primary-red hover:border-primary-red transition-all group"
                >
                  <Icon className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-white text-base mb-6 tracking-tight">{t.footer.quickLinks}</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-[15px] text-white/50 hover:text-white transition-colors flex items-center gap-1 group">
                    <span className="w-1 h-1 rounded-full bg-primary-red shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-bold text-white text-base mb-6 tracking-tight">{t.footer.servicesTitle}</h4>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s.to}>
                  <Link to={s.to} className="text-[15px] text-white/50 hover:text-white transition-colors flex items-center gap-1 group">
                    <span className="w-1 h-1 rounded-full bg-primary-red shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-white text-base mb-6 tracking-tight">{t.footer.contactTitle}</h4>
            <ul className="space-y-5">
              <li className="flex gap-3">
                <MapPin className="w-4 h-4 text-primary-red mt-0.5 shrink-0" />
                <span className="text-[15px] text-white/50">Plot 15, Nakasero Road, Kampala, Uganda</span>
              </li>
              <li className="flex gap-3">
                <Phone className="w-4 h-4 text-primary-red mt-0.5 shrink-0" />
                <div className="space-y-1.5">
                  <a href="tel:+256779367005" className="block text-[15px] text-white/50 hover:text-white transition-colors">
                    +256 779 367 005 <span className="text-white/25 text-sm">(MTN)</span>
                  </a>
                  <a href="tel:+256706911732" className="block text-[15px] text-white/50 hover:text-white transition-colors">
                    +256 706 911 732 <span className="text-white/25 text-sm">(Airtel)</span>
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <Mail className="w-4 h-4 text-primary-red mt-0.5 shrink-0" />
                <div className="space-y-1.5">
                  <a href="mailto:info@cyberteks-it.com" className="block text-[15px] text-white/50 hover:text-white transition-colors break-all">
                    info@cyberteks-it.com
                  </a>
                  <a href="mailto:support@cyberteks-it.com" className="block text-[15px] text-white/50 hover:text-white transition-colors break-all">
                    support@cyberteks-it.com
                  </a>
                </div>
              </li>
            </ul>

            {/* CTA button in footer */}
            <Link
              to="/get-started"
              className="inline-flex items-center gap-2 mt-7 px-5 py-2.5 bg-primary-red text-white text-sm font-bold rounded-xl hover:bg-red-700 transition-all"
            >
              {t.footer.getSupport}
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-sm text-white/30">
            &copy; {new Date().getFullYear()} Cyberteks-IT. {t.footer.rights} Kampala, Uganda.
          </p>
          <div className="flex items-center gap-5 text-sm text-white/30">
            <Link to="/privacy-policy" className="hover:text-white/60 transition-colors">{t.footer.privacyPolicy}</Link>
            <span className="w-px h-3 bg-white/10" />
            <Link to="/terms-of-use" className="hover:text-white/60 transition-colors">{t.footer.termsOfUse}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
