import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, Shield, Monitor, Wifi, GraduationCap, Code2, Camera, Phone, Mail, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const serviceIcons = {
  remoteIt: Monitor,
  cctv: Camera,
  accessControl: Shield,
  voip: Wifi,
  ictSkilling: GraduationCap,
  softwareAi: Code2,
};

const serviceHrefs = {
  remoteIt: '/services/remote-it-support',
  cctv: '/services/cctv',
  accessControl: '/services/access-control',
  voip: '/services/voip',
  ictSkilling: '/services/ict-skilling',
  softwareAi: '/services/software-ai',
};

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const navLinks = [
    { label: t.nav.home, to: '/' },
    { label: t.nav.about, to: '/about' },
    { label: t.nav.products, to: '/products' },
    { label: t.nav.careers, to: '/careers' },
    { label: t.nav.contact, to: '/contact' },
  ];

  const serviceKeys = Object.keys(serviceIcons) as (keyof typeof serviceIcons)[];

  return (
    <header className={cn(
      'fixed top-0 inset-x-0 z-50 bg-white transition-all duration-200',
      scrolled ? 'shadow-[0_1px_0_#e5e7eb]' : 'border-b border-gray-100'
    )}>
      {/* Top strip */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-9">
            <div className="hidden sm:flex items-center gap-1.5 text-gray-400 text-xs">
              <MapPin className="w-3 h-3 shrink-0" />
              <span>Plot 15 Nakasero Road, Kampala, Uganda</span>
            </div>
            <div className="flex items-center gap-5 ml-auto">
              <a href="tel:+256779367005" className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary-blue transition-colors font-medium">
                <Phone className="w-3 h-3 shrink-0" />
                +256 779 367 005
              </a>
              <a href="mailto:info@cyberteks-it.com" className="hidden lg:flex items-center gap-1.5 text-xs text-gray-400 hover:text-primary-blue transition-colors">
                <Mail className="w-3 h-3 shrink-0" />
                info@cyberteks-it.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="relative w-10 h-10">
              <img src="/assets/logo-round.png" alt="CyberteksIT" className="w-10 h-10 object-contain" />
            </div>
            <span className="font-display font-bold text-gray-900 text-sm hidden sm:block">
              Cyberteks<span className="text-primary-blue">IT</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {/* Services dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                {t.nav.services}
                <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-150', servicesOpen && 'rotate-180')} />
              </button>

              <div className={cn(
                'absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[440px] transition-all duration-150',
                servicesOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
              )}>
                <div className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
                  <div className="p-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em] px-2 mb-3">
                      Our Services
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                      {serviceKeys.map((key) => {
                        const Icon = serviceIcons[key];
                        return (
                          <Link
                            key={key}
                            to={serviceHrefs[key]}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 group-hover:bg-primary-blue/10 transition-colors">
                              <Icon className="w-4 h-4 text-gray-500 group-hover:text-primary-blue transition-colors" />
                            </div>
                            <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                              {t.nav.servicesMenu[key as keyof typeof t.nav.servicesMenu]}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                    <div className="border-t border-gray-100 mt-3 pt-3 px-2">
                      <Link to="/services" className="text-xs font-semibold text-primary-blue hover:underline">
                        View all services →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              to="/login"
              className="text-sm font-medium px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:border-gray-300 hover:text-gray-900 transition-all"
            >
              {t.nav.login}
            </Link>
            <Link
              to="/apply"
              className="text-sm font-bold px-5 py-2 rounded-lg bg-primary-blue text-white hover:bg-blue-900 transition-all"
            >
              {t.nav.applyNow}
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1">
          <div className="flex flex-col gap-2 pb-4 mb-3 border-b border-gray-100">
            <a href="tel:+256779367005" className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Phone className="w-3.5 h-3.5 text-gray-400" />
              +256 779 367 005
            </a>
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="block py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-3 pb-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-3">
              {t.nav.services}
            </p>
            {serviceKeys.map((key) => (
              <Link
                key={key}
                to={serviceHrefs[key]}
                onClick={() => setMobileOpen(false)}
                className="block py-2 pl-1 text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                {t.nav.servicesMenu[key as keyof typeof t.nav.servicesMenu]}
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <LanguageSwitcher />
            <div className="flex gap-2">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg text-gray-700"
              >
                {t.nav.login}
              </Link>
              <Link
                to="/apply"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2 text-sm font-bold bg-primary-blue rounded-lg text-white"
              >
                {t.nav.applyNow}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
