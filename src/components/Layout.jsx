import React, { useEffect, useRef } from 'react';
import Navbar from './Navbar';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import logo from '/assets/cyberteks-it-logo-33783fbc-fb2c-484a-b670-9f269d8493cf.png';

gsap.registerPlugin(ScrollTrigger);

const Layout = ({ children }) => {
  const location = useLocation();
  const mainRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const revealItems = gsap.utils.toArray('[data-reveal]');
      revealItems.forEach((item, index) => {
        gsap.fromTo(
          item,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            delay: index * 0.02,
            scrollTrigger: {
              trigger: item,
              start: 'top 85%'
            }
          }
        );
      });

      const parallaxItems = gsap.utils.toArray('[data-parallax]');
      parallaxItems.forEach((item) => {
        const speed = Number(item.getAttribute('data-speed')) || 0.2;
        gsap.to(item, {
          y: -120 * speed,
          ease: 'none',
          scrollTrigger: {
            trigger: item,
            start: 'top bottom',
            scrub: true
          }
        });
      });
    }, mainRef);

    return () => ctx.revert();
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main ref={mainRef} className="pt-0">
        {children}
      </main>
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
            <div className="space-y-4">
              <Link to="/" className="flex items-center gap-2">
                <img src={logo} alt="CyberteksIT" className="h-20 w-auto" />
              </Link>
              <p className="text-sm text-slate-600">
                Future-ready ICT solutions built for remote teams, secure infrastructure, and
                mission-critical operations.
              </p>
              <div className="flex items-center space-x-4">
                <a
                  href="https://www.linkedin.com/company/cyberteks-it/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-[#0A66C2]"
                  aria-label="LinkedIn"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3A2 2 0 0 1 21 5v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14Zm-9.25 16v-8.25h-2.5V19h2.5Zm-1.25-9.5a1.46 1.46 0 1 0 0-2.92 1.46 1.46 0 0 0 0 2.92ZM18 19v-4.73c0-2.46-1.31-3.6-3.07-3.6-1.41 0-2.04.77-2.39 1.3v-1.11h-2.5V19h2.5v-4.34c0-1.14.21-2.24 1.63-2.24 1.4 0 1.42 1.31 1.42 2.31V19H18Z" />
                  </svg>
                </a>
                <a
                  href="https://x.com/CyberteksIT"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-black"
                  aria-label="X"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.6 7.6c.01.14.01.29.01.43 0 4.41-3.36 9.5-9.5 9.5-1.89 0-3.65-.55-5.13-1.5.26.03.51.04.78.04 1.56 0 3-.53 4.14-1.42-1.47-.03-2.7-1-3.13-2.34.2.03.41.05.63.05.29 0 .58-.04.85-.11-1.53-.31-2.69-1.66-2.69-3.29v-.04c.44.24.95.38 1.49.4A3.25 3.25 0 0 1 5.6 5.2a9.2 9.2 0 0 0 6.67 3.38 3.66 3.66 0 0 1-.08-.74 3.24 3.24 0 0 1 5.6-2.21 6.4 6.4 0 0 0 2.05-.78 3.22 3.22 0 0 1-1.43 1.79 6.5 6.5 0 0 0 1.86-.5 6.93 6.93 0 0 1-1.67 1.46Z" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/cyberteksIT"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-[#1877F2]"
                  aria-label="Facebook"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 12a8 8 0 1 0-9.25 7.9v-5.6H8.7V12h2.05V9.97c0-2.02 1.2-3.14 3.03-3.14.88 0 1.8.16 1.8.16v2h-1.01c-1 0-1.31.62-1.31 1.26V12h2.24l-.36 2.3h-1.88v5.6A8 8 0 0 0 20 12Z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/cyberteksit/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-[#E1306C]"
                  aria-label="Instagram"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm5 4.6A4.4 4.4 0 1 0 16.4 12 4.4 4.4 0 0 0 12 7.6Zm6.1-.45a1.15 1.15 0 1 0-.81.34 1.15 1.15 0 0 0 .81-.34ZM12 9.4A2.6 2.6 0 1 0 14.6 12 2.6 2.6 0 0 0 12 9.4Z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold tracking-wider text-slate-900 uppercase">Services</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link to="/services#remote-it-support" className="text-sm text-slate-600 hover:text-primary-blue">
                    Remote IT Support
                  </Link>
                </li>
                <li>
                  <Link to="/services#access-control" className="text-sm text-slate-600 hover:text-primary-blue">
                    Access Control Systems
                  </Link>
                </li>
                <li>
                  <Link to="/services#cctv" className="text-sm text-slate-600 hover:text-primary-blue">
                    CCTV & Surveillance
                  </Link>
                </li>
                <li>
                  <Link to="/services#voip" className="text-sm text-slate-600 hover:text-primary-blue">
                    VOIP Solutions
                  </Link>
                </li>
                <li>
                  <Link to="/services#ict-skilling" className="text-sm text-slate-600 hover:text-primary-blue">
                    ICT Skilling & Capacity
                  </Link>
                </li>
                <li>
                  <Link to="/services#software-ai" className="text-sm text-slate-600 hover:text-primary-blue">
                    Software, Web & AI
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold tracking-wider text-slate-900 uppercase">Quick Links</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link to="/about" className="text-sm text-slate-600 hover:text-primary-blue">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/products" className="text-sm text-slate-600 hover:text-primary-blue">
                    Products
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="text-sm text-slate-600 hover:text-primary-blue">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-sm text-slate-600 hover:text-primary-blue">
                    Talk to us
                  </Link>
                </li>
                <li>
                  <Link to="/get-started" className="text-sm text-slate-600 hover:text-primary-blue">
                    Get Started
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold tracking-wider text-slate-900 uppercase">Contact</h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li>Email: hello@cyberteksit.com</li>
                <li>Phone: +1 (202) 555-0198</li>
                <li>Address: 88 Polaris Avenue, Tech City, TX 78701</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-200 pt-8 text-center text-sm text-slate-500">
            <p>© {new Date().getFullYear()} CyberteksIT. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
