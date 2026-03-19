import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';

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
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter,  href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Youtube,  href: '#', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <Link to="/" className="inline-block mb-5">
              <img src="/assets/logo-round.png" alt="CyberteksIT" className="w-12 h-12 object-contain" />
            </Link>
            <p className="text-sm leading-relaxed text-gray-500 mb-6 max-w-[220px]">
              Future-ready ICT solutions delivered remotely and on-site — empowering businesses across Uganda and beyond.
            </p>
            <div className="flex items-center gap-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary-blue hover:border-primary-blue transition-all group"
                >
                  <Icon className="w-3.5 h-3.5 text-gray-500 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-white text-sm mb-5">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-500 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-bold text-white text-sm mb-5">Services</h4>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s.to}>
                  <Link to={s.to} className="text-sm text-gray-500 hover:text-white transition-colors">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-white text-sm mb-5">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <MapPin className="w-4 h-4 text-gray-600 mt-0.5 shrink-0" />
                <span className="text-sm text-gray-500">Plot 15, Nakasero Road, Kampala, Uganda</span>
              </li>
              <li className="flex gap-3">
                <Phone className="w-4 h-4 text-gray-600 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <a href="tel:+256779367005" className="block text-sm text-gray-500 hover:text-white transition-colors">
                    +256 779 367 005 <span className="text-gray-700">(MTN)</span>
                  </a>
                  <a href="tel:+256706911732" className="block text-sm text-gray-500 hover:text-white transition-colors">
                    +256 706 911 732 <span className="text-gray-700">(Airtel)</span>
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <Mail className="w-4 h-4 text-gray-600 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <a href="mailto:info@cyberteks-it.com" className="block text-sm text-gray-500 hover:text-white transition-colors">
                    info@cyberteks-it.com
                  </a>
                  <a href="mailto:support@cyberteks-it.com" className="block text-sm text-gray-500 hover:text-white transition-colors">
                    support@cyberteks-it.com
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-700">
            &copy; {new Date().getFullYear()} CyberteksIT. All rights reserved. Kampala, Uganda.
          </p>
          <div className="flex items-center gap-5 text-xs text-gray-700">
            <Link to="/privacy-policy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
            <span className="w-px h-3 bg-gray-800" />
            <Link to="/terms-of-use" className="hover:text-gray-400 transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
