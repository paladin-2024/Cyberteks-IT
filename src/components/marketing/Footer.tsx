import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Youtube, ArrowUpRight } from 'lucide-react';

const services = [
  { label: 'Remote IT Support', to: '/services/remote-it-support' },
  { label: 'CCTV Surveillance', to: '/services/cctv' },
  { label: 'Access Control', to: '/services/access-control' },
  { label: 'VOIP Solutions', to: '/services/voip' },
  { label: 'ICT Skilling', to: '/services/ict-skilling' },
  { label: 'Software & AI', to: '/services/software-ai' },
];

const quickLinks = [
  { label: 'About Us', to: '/about' },
  { label: 'Products', to: '/products' },
  { label: 'Careers', to: '/careers' },
  { label: 'Contact', to: '/contact' },
  { label: 'Apply for Training', to: '/apply' },
  { label: 'Get IT Support', to: '/get-started' },
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms of Use', to: '/terms-of-use' },
];

const socials = [
  { icon: Facebook, href: 'https://facebook.com/cyberteksit', label: 'Facebook' },
  { icon: Twitter,  href: 'https://twitter.com/cyberteksit',  label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com/company/cyberteks-it', label: 'LinkedIn' },
  { icon: Youtube,  href: '#', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer className="bg-[#023064]">
      {/* Red accent top border */}
      <div className="h-1 bg-primary-red w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <img
                src="/assets/cyberteks-it-logo-33783fbc-fb2c-484a-b670-9f269d8493cf.png"
                alt="CyberteksIT"
                className="h-14 w-auto object-contain"
              />
            </Link>
            <p className="text-base leading-relaxed text-white/55 mb-7 max-w-[240px]">
              Future-ready ICT solutions delivered remotely and on-site — empowering businesses across Uganda and beyond.
            </p>
            <div className="flex items-center gap-2">
              {socials.map(({ icon: Icon, href, label }) => (
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
            <h4 className="font-display font-bold text-white text-base mb-6 tracking-tight">Quick Links</h4>
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
            <h4 className="font-display font-bold text-white text-base mb-6 tracking-tight">Services</h4>
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
            <h4 className="font-display font-bold text-white text-base mb-6 tracking-tight">Contact Us</h4>
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
                  <a href="mailto:info@cyberteks-it.com" className="block text-[15px] text-white/50 hover:text-white transition-colors">
                    info@cyberteks-it.com
                  </a>
                  <a href="mailto:support@cyberteks-it.com" className="block text-[15px] text-white/50 hover:text-white transition-colors">
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
              Get IT Support
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-white/30">
            &copy; {new Date().getFullYear()} CyberteksIT. All rights reserved. Kampala, Uganda.
          </p>
          <div className="flex items-center gap-5 text-sm text-white/30">
            <Link to="/privacy-policy" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
            <span className="w-px h-3 bg-white/10" />
            <Link to="/terms-of-use" className="hover:text-white/60 transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
