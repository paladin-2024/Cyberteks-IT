import { Link } from 'react-router-dom';
import {
  Bug,
  Mail,
  Lock,
  Wifi,
  RefreshCw,
  HardDrive,
  Disc,
  Monitor,
  Shield,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const TIP_ICONS = [Bug, Mail, Lock, Wifi, RefreshCw, HardDrive, Disc, Monitor];
const TIP_COLORS = [
  'bg-red-100 text-red-600',
  'bg-orange-100 text-orange-600',
  'bg-blue-100 text-blue-600',
  'bg-purple-100 text-purple-600',
  'bg-green-100 text-green-600',
  'bg-teal-100 text-teal-600',
  'bg-yellow-100 text-yellow-600',
  'bg-indigo-100 text-indigo-600',
];
const TIP_BORDERS = [
  'border-red-200',
  'border-orange-200',
  'border-blue-200',
  'border-purple-200',
  'border-green-200',
  'border-teal-200',
  'border-yellow-200',
  'border-indigo-200',
];

const checklistItems = [
  'Antivirus is installed and up to date',
  'Windows/macOS is fully updated',
  'I use strong, unique passwords',
  'I have 2-factor authentication enabled',
  'My important files are backed up',
  "I don't use public WiFi for banking",
  'My laptop auto-locks when idle',
  "I've never clicked a suspicious link",
  "I don't plug in unknown USB drives",
  'I know how to spot a phishing email',
];

const laptopProblems = [
  {
    title: 'Laptop Running Slow',
    description:
      'Malware, too many startup programs, or full storage. We diagnose and clean.',
  },
  {
    title: 'Virus/Malware Infection',
    description:
      'Pop-ups, redirects, or strange behavior? We remove all threats.',
  },
  {
    title: 'Forgotten Password',
    description:
      'Locked out of Windows or an account? We recover access safely.',
  },
  {
    title: 'WiFi Not Connecting',
    description:
      'Driver issues, router problems, or network misconfiguration.',
  },
  {
    title: 'Blue Screen of Death (BSOD)',
    description:
      'Hardware or driver failure. We identify the exact cause.',
  },
  {
    title: 'Overheating & Shutdowns',
    description:
      'Dust buildup or failing fan. We clean and repair.',
  },
];

export default function SecurityTipsPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="pt-12 pb-14 sm:pb-20 bg-[#023064]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block bg-[#E11D48]/20 text-red-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-red-400/30">
              {t.security.hero.badge}
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {t.security.hero.title1} &{' '}
              <span className="text-[#E11D48]">{t.security.hero.title2}</span>
            </h1>
            <p className="text-blue-200 text-lg mb-10 leading-relaxed">
              {t.security.hero.subtitle}
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-10">
              <div className="flex items-center gap-2 bg-white/10 text-white text-sm font-medium px-4 py-2 rounded-full border border-white/20">
                <Shield className="w-4 h-4 text-[#E11D48]" />
                500+ Clients Protected
              </div>
              <div className="flex items-center gap-2 bg-white/10 text-white text-sm font-medium px-4 py-2 rounded-full border border-white/20">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                10+ Years Security Experience
              </div>
            </div>
            <Link
              to="/get-started"
              className="inline-flex items-center gap-2 bg-[#E11D48] hover:bg-red-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors duration-300"
            >
              Get IT Support
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Warning Strip */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-white">
            <div className="flex flex-col items-center gap-1">
              <AlertTriangle className="w-6 h-6 text-yellow-300 mb-1" />
              <span className="font-heading text-2xl font-bold">1 in 3 laptops</span>
              <span className="text-red-100 text-sm">has malware right now</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <AlertTriangle className="w-6 h-6 text-yellow-300 mb-1" />
              <span className="font-heading text-2xl font-bold">90% of cyberattacks</span>
              <span className="text-red-100 text-sm">start with phishing emails</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <AlertTriangle className="w-6 h-6 text-yellow-300 mb-1" />
              <span className="font-heading text-2xl font-bold">43% of attacks</span>
              <span className="text-red-100 text-sm">target individuals & small businesses</span>
            </div>
          </div>
        </div>
      </section>

      {/* Security Tips Grid */}
      <section className="py-12 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#023064] mb-4">
              8 Essential Security Tips
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Follow these steps to significantly reduce your risk of becoming a
              cybercrime victim.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {t.security.tips.map((tip, i) => {
              const Icon = TIP_ICONS[i];
              const number = String(i + 1).padStart(2, '0');
              return (
                <div
                  key={i}
                  className={`bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border-l-4 ${TIP_BORDERS[i]}`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-xl ${TIP_COLORS[i]} shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">
                        Tip {number}
                      </span>
                      <h3 className="font-heading text-lg font-bold text-[#023064] mt-0.5">
                        {tip.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {tip.description}
                  </p>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      What to do:
                    </p>
                    <ul className="space-y-1.5">
                      {tip.checklist.map((item, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-2 text-sm text-gray-700"
                        >
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Security Checklist */}
      <section className="py-12 sm:py-20 bg-[#023064]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
              Quick Security Health Check
            </h2>
            <p className="text-blue-200 text-lg">
              Go through this checklist right now. If you tick less than 5,
              your laptop needs attention.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {checklistItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl px-5 py-3.5"
              >
                <div className="w-6 h-6 rounded-md bg-green-500 flex items-center justify-center shrink-0">
                  <svg
                    className="w-3.5 h-3.5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-white text-sm">{item}</span>
              </div>
            ))}
          </div>
          <div className="bg-white/10 border border-white/20 rounded-2xl p-6 text-center">
            <p className="text-blue-100 text-base mb-4">
              <span className="text-white font-semibold">How did you score?</span>{' '}
              If less than 7 — contact us for a free security assessment.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#E11D48] hover:bg-red-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors duration-300"
            >
              Get a Free Security Assessment
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Common Laptop Problems */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#023064] mb-4">
              Common Laptop Issues We Fix
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Experiencing any of these? Our certified technicians are ready to
              help remotely or on-site.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {laptopProblems.map((problem, index) => (
              <div
                key={index}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-[#023064]/10 flex items-center justify-center shrink-0">
                  <span className="font-heading font-bold text-[#023064] text-sm">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-[#023064] mb-1">
                    {problem.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {problem.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-br from-[#023064] to-[#0a4a9e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-blue-200 text-sm font-medium px-4 py-2 rounded-full border border-white/20 mb-6">
            <Shield className="w-4 h-4" />
            Available 24/7
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
            {t.security.cta.title}
          </h2>
          <p className="text-blue-200 text-lg mb-10">
            {t.security.cta.description}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/get-started"
              className="inline-flex items-center justify-center gap-2 bg-[#E11D48] hover:bg-red-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors duration-300"
            >
              {t.security.cta.button}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-white/10 text-white font-semibold px-8 py-3.5 rounded-xl border-2 border-white/40 hover:border-white/60 transition-colors duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
