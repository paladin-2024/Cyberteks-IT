import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Shield, Monitor, Wifi, GraduationCap, Code2, Camera, Phone, Mail, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const serviceIcons = {
  remoteIt:      Monitor,
  cctv:          Camera,
  accessControl: Shield,
  voip:          Wifi,
  ictSkilling:   GraduationCap,
  softwareAi:    Code2,
};

const serviceHrefs = {
  remoteIt:      '/services/remote-it-support',
  cctv:          '/services/cctv',
  accessControl: '/services/access-control',
  voip:          '/services/voip',
  ictSkilling:   '/services/ict-skilling',
  softwareAi:    '/services/software-ai',
};

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLanguage();
  const { pathname } = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const navLinks = [
    { label: t.nav.home,     to: '/' },
    { label: t.nav.about,    to: '/about' },
    { label: t.nav.products, to: '/products' },
    { label: t.nav.careers,  to: '/careers' },
    { label: t.nav.contact,  to: '/contact' },
  ];

  const serviceKeys = Object.keys(serviceIcons) as (keyof typeof serviceIcons)[];
  const isServicesActive = pathname.startsWith('/services');

  function isActive(to: string) {
    if (to === '/') return pathname === '/';
    return pathname.startsWith(to);
  }

  return (
    <header className={cn(
      'fixed top-0 inset-x-0 z-50 transition-all duration-300',
      scrolled
        ? 'bg-white/90 backdrop-blur-md shadow-[0_2px_24px_rgba(0,0,0,0.09)] border-b border-gray-200/60'
        : 'bg-white shadow-[0_1px_0_#e5e7eb]'
    )}>

      {/* Top strip */}
      <div className="bg-[#023064]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-11">
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-2 text-white/55 text-sm font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#E11D48] shrink-0" />
                <span>Plot 15 Nakasero Road, Kampala, Uganda</span>
              </div>
              <div className="w-px h-3.5 bg-white/15" />
              <a href="mailto:info@cyberteks-it.com" className="flex items-center gap-2 text-sm font-medium text-white/55 hover:text-white transition-colors">
                <Mail className="w-3.5 h-3.5 text-[#E11D48] shrink-0" />
                info@cyberteks-it.com
              </a>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/8 border border-white/15">
                <Phone className="w-3.5 h-3.5 text-[#E11D48] shrink-0" />
                <a href="tel:+256779367005" className="text-[15px] font-extrabold text-white tracking-tight hover:text-[#E11D48] transition-colors">
                  +256 779 367 005
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img
              src="/assets/cyberteks-it-logo-33783fbc-fb2c-484a-b670-9f269d8493cf.png"
              alt="CyberteksIT"
              className="h-13 w-auto object-contain"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'relative px-4 py-2.5 text-[15px] font-semibold transition-colors rounded-lg',
                  isActive(link.to)
                    ? 'text-[#023064]'
                    : 'text-gray-600 hover:text-[#023064] hover:bg-gray-50'
                )}
              >
                {link.label}
                {isActive(link.to) && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#E11D48] rounded-full" />
                )}
              </Link>
            ))}

            {/* Services dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button className={cn(
                'relative flex items-center gap-1 px-4 py-2.5 text-[15px] font-semibold transition-colors rounded-lg',
                isServicesActive
                  ? 'text-[#023064]'
                  : 'text-gray-600 hover:text-[#023064] hover:bg-gray-50'
              )}>
                {t.nav.services}
                <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', servicesOpen && 'rotate-180')} />
                {isServicesActive && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#E11D48] rounded-full" />
                )}
              </button>

              <div className={cn(
                'absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[460px] transition-all duration-200',
                servicesOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
              )}>
                <div className="bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden">
                  {/* Dropdown top accent */}
                  <div className="h-0.5 bg-gradient-to-r from-[#023064] via-[#E11D48] to-[#023064]" />
                  <div className="p-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em] px-2 mb-3">Our Services</p>
                    <div className="grid grid-cols-2 gap-1">
                      {serviceKeys.map((key) => {
                        const Icon = serviceIcons[key];
                        const active = pathname === serviceHrefs[key];
                        return (
                          <Link
                            key={key}
                            to={serviceHrefs[key]}
                            className={cn(
                              'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors group',
                              active ? 'bg-[#023064]/6' : 'hover:bg-gray-50'
                            )}
                          >
                            <div className={cn(
                              'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors',
                              active ? 'bg-[#023064]/15' : 'bg-[#023064]/8 group-hover:bg-[#023064]/15'
                            )}>
                              <Icon className={cn('w-4 h-4 transition-colors', active ? 'text-[#023064]' : 'text-[#023064]/60 group-hover:text-[#023064]')} />
                            </div>
                            <span className={cn(
                              'text-[14px] font-medium transition-colors',
                              active ? 'text-gray-900 font-semibold' : 'text-gray-600 group-hover:text-gray-900'
                            )}>
                              {t.nav.servicesMenu[key as keyof typeof t.nav.servicesMenu]}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                    <div className="border-t border-gray-100 mt-3 pt-3 px-2 flex items-center justify-between">
                      <Link to="/services" className="text-sm font-bold text-[#023064] hover:text-[#E11D48] transition-colors">
                        View all services →
                      </Link>
                      <span className="text-xs text-gray-400">6 services available</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security */}
            <Link
              to="/security-tips"
              className={cn(
                'relative px-4 py-2.5 text-[15px] font-semibold transition-colors rounded-lg',
                isActive('/security-tips')
                  ? 'text-[#023064]'
                  : 'text-gray-600 hover:text-[#023064] hover:bg-gray-50'
              )}
            >
              Security
              {isActive('/security-tips') && (
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#E11D48] rounded-full" />
              )}
            </Link>
          </nav>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              to="/login"
              className="text-[15px] font-semibold px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 hover:border-[#023064] hover:text-[#023064] transition-all"
            >
              {t.nav.login}
            </Link>
            <Link
              to="/apply"
              className="text-[15px] font-bold px-6 py-2.5 rounded-xl bg-[#E11D48] text-white hover:bg-[#c41640] transition-all shadow-md shadow-[#E11D48]/25 hover:shadow-[#E11D48]/40 hover:-translate-y-0.5"
            >
              {t.nav.applyNow}
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn(
        'lg:hidden overflow-hidden transition-all duration-300',
        mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      )}>
        <div className="bg-white border-t border-gray-100 px-4 py-4 space-y-1 shadow-lg">
          <div className="flex flex-col gap-2 pb-4 mb-3 border-b border-gray-100">
            <a href="tel:+256779367005" className="flex items-center gap-2 text-base font-bold text-[#023064]">
              <Phone className="w-4 h-4 text-[#E11D48]" />
              +256 779 367 005
            </a>
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                'flex items-center py-2.5 px-2 text-[15px] font-medium rounded-lg transition-colors',
                isActive(link.to) ? 'text-[#023064] bg-[#023064]/5 font-semibold' : 'text-gray-600 hover:text-[#023064]'
              )}
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-3 pb-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-3 px-2">{t.nav.services}</p>
            {serviceKeys.map((key) => (
              <Link
                key={key}
                to={serviceHrefs[key]}
                className={cn(
                  'block py-2 pl-3 text-[15px] rounded-lg transition-colors',
                  pathname === serviceHrefs[key] ? 'text-[#023064] font-semibold' : 'text-gray-500 hover:text-[#023064]'
                )}
              >
                {t.nav.servicesMenu[key as keyof typeof t.nav.servicesMenu]}
              </Link>
            ))}
          </div>

          <Link
            to="/security-tips"
            className={cn(
              'flex items-center py-2.5 px-2 text-[15px] font-medium rounded-lg transition-colors',
              isActive('/security-tips') ? 'text-[#023064] bg-[#023064]/5 font-semibold' : 'text-gray-600 hover:text-[#023064]'
            )}
          >
            Security
          </Link>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <LanguageSwitcher />
            <div className="flex gap-2">
              <Link to="/login" className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-xl text-gray-700 hover:border-[#023064] hover:text-[#023064] transition-all">
                {t.nav.login}
              </Link>
              <Link to="/apply" className="px-4 py-2 text-sm font-bold bg-[#E11D48] rounded-xl text-white hover:bg-[#c41640] transition-all shadow-sm shadow-[#E11D48]/25">
                {t.nav.applyNow}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
