import React, { useLayoutEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import logo from '/assets/cyberteks-it-logo-33783fbc-fb2c-484a-b670-9f269d8493cf.png';

const navLinkClass =
  'relative text-base font-medium text-slate-600 hover:text-slate-900 transition-colors px-3.5 py-2.5 flex items-center gap-1';

const Navbar = () => {
  const navRef = useRef(null);
  const [servicesOpen, setServicesOpen] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  useLayoutEffect(() => {
    const updateOffset = () => {
      const height = navRef.current?.offsetHeight || 0;
      document.documentElement.style.setProperty('--navbar-offset', `${height}px`);
    };

    updateOffset();
    window.addEventListener('resize', updateOffset);
    return () => window.removeEventListener('resize', updateOffset);
  }, []);

  return (
    <header ref={navRef} className="fixed inset-x-0 top-0 z-40 flex justify-center pt-4">
      <div className="mx-4 flex w-full max-w-6xl items-center justify-between rounded-2xl border border-slate-200/70 bg-white/65 px-4 py-3 shadow-lg backdrop-blur-md md:px-6 lg:px-7">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="CyberteksIT" className="h-10 w-auto" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
          <NavLink to="/services" className={navLinkClass}>
            Services
          </NavLink>
          <NavLink to="/products" className={navLinkClass}>
            Products
          </NavLink>
          <NavLink to="/careers" className={navLinkClass}>
            Careers
          </NavLink>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/contact"
            className="rounded-full bg-primary-red px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-red-500/20 transition hover:bg-primary-blue"
          >
            Talk to us
          </Link>
          <Link
            to="/get-started"
            className="rounded-full bg-primary-blue px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-500/20 transition hover:bg-primary-red"
          >
            Get Started
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition hover:text-slate-900 md:hidden"
          aria-label="Open navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-30 md:hidden"
          >
            <div
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />
            <div className="relative mx-auto mt-3 w-full max-w-6xl px-4">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                  <Link to="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
                    <img src={logo} alt="CyberteksIT" className="h-9 w-auto" />
                  </Link>
                  <button
                    type="button"
                    className="rounded-full border border-slate-200 p-2 text-slate-500 hover:text-primary-red"
                    aria-label="Close menu"
                    onClick={() => setMenuOpen(false)}
                  >
                    ✕
                  </button>
                </div>

                <div className="grid gap-4 px-4 py-5">
                  <div className="grid gap-2">
                <NavLink to="/" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                  Home
                </NavLink>
                <NavLink to="/about" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                  About
                </NavLink>
                <NavLink to="/services" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                  Services
                </NavLink>
                <NavLink to="/products" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                  Products
                </NavLink>
                <NavLink to="/careers" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                  Careers
                </NavLink>
              </div>

                  <div className="grid gap-2 sm:grid-cols-2 sm:items-center sm:gap-3">
                    <Link
                      to="/contact"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center rounded-full bg-primary-red px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-red-500/20 transition hover:bg-primary-blue"
                    >
                      Talk to us
                    </Link>
                    <Link
                      to="/get-started"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center rounded-full bg-primary-blue px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-500/20 transition hover:bg-primary-red"
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
