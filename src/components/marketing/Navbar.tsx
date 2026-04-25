import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Monitor, GraduationCap, Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

const DROPDOWN_ITEMS = [
  { key: 'ictSkilling',          icon: GraduationCap, href: '/services/ict-skilling',  label: 'ICT Skilling' },
  { key: 'industrialSolutions',  icon: Monitor,       href: '/services',               label: 'Industrial Solutions' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLanguage();
  const { pathname } = useLocation();

  const isActive = (to: string) =>
    to === '/'         ? pathname === '/' :
    to === '/services' ? pathname === '/services' :
    pathname === to || pathname.startsWith(to + '/');

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

  return (
    <header className={cn(
      'fixed top-0 inset-x-0 z-50 transition-all duration-300',
      scrolled
        ? 'bg-white/80 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.10)] border-b border-gray-200/60'
        : 'bg-white shadow-[0_1px_0_#e5e7eb]'
    )}>
      {/* Top strip */}
      <div className="bg-[#023064]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            {/* LEFT: socials (always) + address+email (desktop only) */}
            <div className="flex items-center gap-3">
              {/* Social icons, always visible */}
              <div className="flex items-center gap-1.5">
                {[
                  { icon: Facebook,  href: 'https://facebook.com/cyberteksit',          label: 'Facebook' },
                  { icon: Twitter,   href: 'https://twitter.com/cyberteksit',           label: 'Twitter' },
                  { icon: Linkedin,  href: 'https://linkedin.com/company/cyberteks-it', label: 'LinkedIn' },
                  { icon: Instagram, href: 'https://instagram.com/cyberteksit',         label: 'Instagram' },
                ].map(({ icon: Icon, href, label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    aria-label={label}
                    className="w-7 h-7 rounded-full bg-white/10 hover:bg-primary-red flex items-center justify-center transition-colors">
                    <Icon className="w-3.5 h-3.5 text-white" />
                  </a>
                ))}
              </div>
              {/* Address + email, desktop only */}
              <div className="hidden md:flex items-center gap-6">
                <div className="w-px h-4 bg-white/15" />
                <div className="flex items-center gap-2 text-white/60 text-sm font-medium">
                  <MapPin className="w-4 h-4 text-primary-red shrink-0" />
                  <span>Plot 15 Nakasero Road, Kampala, Uganda</span>
                </div>
                <div className="w-px h-4 bg-white/15" />
                <a href="mailto:info@cyberteks-it.com" className="flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors">
                  <Mail className="w-4 h-4 text-primary-red shrink-0" />
                  info@cyberteks-it.com
                </a>
              </div>
            </div>

            {/* RIGHT: phone number, always visible */}
            <a
              href="tel:+256779367005"
              className="flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-primary-red/20 border border-primary-red/30 hover:bg-primary-red/30 transition-colors"
            >
              <Phone className="w-4 h-4 text-primary-red shrink-0" />
              <span className="text-sm sm:text-lg font-extrabold text-white tracking-tight whitespace-nowrap">
                +256 779 367 005
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img
              src="/assets/cyberteks-it-logo.png"
              alt="Cyberteks-IT"
              className="h-14 w-auto object-contain"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'text-base font-semibold px-4 py-2 transition-colors duration-200 whitespace-nowrap',
                  isActive(link.to)
                    ? 'text-[#E11D48]'
                    : 'text-gray-700 hover:text-[#023064]'
                )}
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
              <button className={cn(
                'flex items-center gap-1 text-base font-semibold px-4 py-2 transition-colors duration-200 whitespace-nowrap',
                isActive('/services')
                  ? 'text-[#E11D48]'
                  : 'text-gray-700 hover:text-[#023064]'
              )}>
                {t.nav.services}
                <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-150', servicesOpen && 'rotate-180')} />
              </button>

              <div className={cn(
                'absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[280px] transition-all duration-150',
                servicesOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
              )}>
                <div className="bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden">
                  <div className="p-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em] px-2 mb-3">
                      Our Services
                    </p>
                    <div className="flex flex-col gap-1">
                      {DROPDOWN_ITEMS.map(({ key, icon: Icon, href, label }) => (
                        <Link
                          key={key}
                          to={href}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-200 group hover:bg-gray-50"
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#023064]/8 flex items-center justify-center shrink-0 group-hover:bg-[#023064]/15 transition-colors">
                            <Icon className={cn(
                              'w-4 h-4 transition-colors',
                              isActive(href) ? 'text-[#E11D48]' : 'text-[#023064]/70 group-hover:text-[#023064]'
                            )} />
                          </div>
                          <span className={cn(
                            'text-[15px] font-medium transition-colors',
                            isActive(href) ? 'text-[#E11D48] font-semibold' : 'text-gray-600 group-hover:text-gray-900'
                          )}>
                            {label}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ICT Skilling link */}
            <Link
              to="/services/ict-skilling"
              className={cn(
                'text-base font-semibold px-4 py-2 rounded-xl transition-all duration-200 whitespace-nowrap',
                isActive('/services/ict-skilling')
                  ? 'text-[#E11D48]'
                  : 'text-gray-700 hover:text-[#023064]'
              )}
            >
              ICT Skilling
            </Link>

            {/* Security link */}
            <Link
              to="/security-tips"
              className={cn(
                'text-base font-semibold px-4 py-2 rounded-xl transition-all duration-200 whitespace-nowrap',
                isActive('/security-tips')
                  ? 'text-[#E11D48]'
                  : 'text-gray-700 hover:text-[#023064]'
              )}
            >
              Security
            </Link>
          </nav>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/login"
              className="text-base font-semibold px-6 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 hover:border-[#023064] hover:text-[#023064] transition-all"
            >
              {t.nav.login}
            </Link>
            <Link
              to="/apply"
              className="text-base font-bold px-7 py-2.5 rounded-xl bg-primary-red text-white hover:bg-red-700 transition-all shadow-sm shadow-primary-red/30"
            >
              {t.nav.applyNow}
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1">
          <div className="flex flex-col gap-2 pb-4 mb-3 border-b border-gray-100">
            <a href="tel:+256779367005" className="flex items-center gap-2 text-base font-bold text-[#023064]">
              <Phone className="w-4 h-4 text-primary-red" />
              +256 779 367 005
            </a>
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'block px-3 py-2.5 text-[15px] font-medium transition-colors duration-200',
                isActive(link.to)
                  ? 'text-[#E11D48]'
                  : 'text-gray-600 hover:text-[#023064]'
              )}
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-3 pb-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-3 px-3">
              {t.nav.services}
            </p>
            {DROPDOWN_ITEMS.map(({ key, href, label }) => (
              <Link
                key={key}
                to={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'block px-3 py-2.5 text-[15px] font-medium transition-colors duration-200',
                  isActive(href)
                    ? 'text-[#E11D48]'
                    : 'text-gray-500 hover:text-[#023064]'
                )}
              >
                {label}
              </Link>
            ))}
          </div>

          <Link
            to="/services/ict-skilling"
            onClick={() => setMobileOpen(false)}
            className={cn(
              'block px-3 py-2.5 text-[15px] font-medium transition-colors duration-200',
              isActive('/services/ict-skilling')
                ? 'text-[#E11D48]'
                : 'text-gray-600 hover:text-[#023064]'
            )}
          >
            ICT Skilling
          </Link>

          <Link
            to="/security-tips"
            onClick={() => setMobileOpen(false)}
            className={cn(
              'block px-3 py-2.5 text-[15px] font-medium transition-colors duration-200',
              isActive('/security-tips')
                ? 'text-[#E11D48]'
                : 'text-gray-600 hover:text-[#023064]'
            )}
          >
            Security
          </Link>

          <div className="flex items-center justify-end pt-4 border-t border-gray-100">
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
                className="px-4 py-2 text-sm font-bold bg-primary-red rounded-lg text-white"
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
