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

const tips = [
  {
    number: '01',
    title: 'Malware & Viruses',
    icon: Bug,
    color: 'bg-red-100 text-red-600',
    borderColor: 'border-red-200',
    description:
      'Malware is software designed to damage, disrupt, or gain unauthorized access to your computer. Viruses, ransomware, and spyware are the most common threats found on laptops in Uganda.',
    checklist: [
      'Install reputable antivirus (Windows Defender, Kaspersky, or Avast)',
      'Never download software from unknown websites',
      'Scan USB drives before opening files',
      'Schedule weekly full system scans',
    ],
  },
  {
    number: '02',
    title: 'Phishing Emails',
    icon: Mail,
    color: 'bg-orange-100 text-orange-600',
    borderColor: 'border-orange-200',
    description:
      'Phishing is when criminals send fake emails pretending to be banks, MTN, Airtel, or trusted companies to steal your password or money.',
    checklist: [
      'Never click links in unexpected emails asking for your password',
      'Check the sender\'s actual email address carefully',
      'Go directly to the website — never through email links',
      'Enable 2-factor authentication on all accounts',
    ],
  },
  {
    number: '03',
    title: 'Weak Passwords',
    icon: Lock,
    color: 'bg-blue-100 text-blue-600',
    borderColor: 'border-blue-200',
    description:
      'Using simple passwords like "123456" or your name makes your accounts very easy to hack. A strong password is your first line of defence.',
    checklist: [
      'Use at least 12 characters with letters, numbers, and symbols',
      'Never reuse the same password on multiple sites',
      'Use a password manager (Bitwarden is free)',
      'Change passwords every 3–6 months',
    ],
  },
  {
    number: '04',
    title: 'Unsecured Public WiFi',
    icon: Wifi,
    color: 'bg-purple-100 text-purple-600',
    borderColor: 'border-purple-200',
    description:
      'Free WiFi in cafes, hotels, and airports can be monitored by hackers. Anything you do on public WiFi — including banking — can be intercepted.',
    checklist: [
      'Avoid logging into banking or email on public WiFi',
      'Use a VPN (ProtonVPN or Windscribe are free)',
      'Turn off auto-connect to WiFi networks',
      'Use your mobile data for sensitive tasks',
    ],
  },
  {
    number: '05',
    title: 'Outdated Software',
    icon: RefreshCw,
    color: 'bg-green-100 text-green-600',
    borderColor: 'border-green-200',
    description:
      'Running old versions of Windows, browsers, or apps leaves known security holes open that hackers actively exploit. Most attacks target unpatched systems.',
    checklist: [
      'Enable automatic Windows/macOS updates',
      'Keep your browser (Chrome, Firefox) always up to date',
      'Update antivirus definitions weekly',
      'Remove software you no longer use',
    ],
  },
  {
    number: '06',
    title: 'No Data Backup',
    icon: HardDrive,
    color: 'bg-teal-100 text-teal-600',
    borderColor: 'border-teal-200',
    description:
      'Ransomware attacks lock all your files and demand payment. Without a backup, you could lose everything — documents, photos, work files permanently.',
    checklist: [
      'Use Google Drive or OneDrive to backup important files',
      'Keep an external hard drive backup monthly',
      'Follow the 3-2-1 rule: 3 copies, 2 media types, 1 offsite',
      'Test your backups — make sure files can be restored',
    ],
  },
  {
    number: '07',
    title: 'Suspicious USB Drives',
    icon: Disc,
    color: 'bg-yellow-100 text-yellow-600',
    borderColor: 'border-yellow-200',
    description:
      'Plugging in an unknown USB drive is one of the easiest ways malware spreads. Criminals leave infected drives in public places hoping someone picks them up.',
    checklist: [
      'Never plug in a USB drive you found or received unexpectedly',
      'Disable autorun on Windows (it runs programs automatically)',
      'Scan every USB with antivirus before opening files',
      'Use your own cables for charging in public',
    ],
  },
  {
    number: '08',
    title: 'No Screen Lock',
    icon: Monitor,
    color: 'bg-indigo-100 text-indigo-600',
    borderColor: 'border-indigo-200',
    description:
      'Leaving your laptop unlocked when you step away — even for a minute — gives anyone physical access to all your files, emails, and accounts.',
    checklist: [
      'Set your screen to auto-lock after 2–5 minutes',
      'Always press Windows+L (or Cmd+Ctrl+Q on Mac) when leaving your desk',
      'Enable full disk encryption (BitLocker on Windows)',
      'Use a strong login password — not just a PIN',
    ],
  },
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
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="pt-12 pb-20 bg-[#023064]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block bg-[#E11D48]/20 text-red-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-red-400/30">
              Free Security Guide
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
              Protect Your Laptop &{' '}
              <span className="text-[#E11D48]">Stay Safe Online</span>
            </h1>
            <p className="text-blue-200 text-lg mb-10 leading-relaxed">
              Expert tips from CyberteksIT to help you avoid the most common
              laptop and cybersecurity threats.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-10">
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
      <section className="py-20">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tips.map((tip) => {
              const Icon = tip.icon;
              return (
                <div
                  key={tip.number}
                  className={`bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border-l-4 ${tip.borderColor}`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-xl ${tip.color} shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">
                        Tip {tip.number}
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
                      {tip.checklist.map((item, i) => (
                        <li
                          key={i}
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
      <section className="py-20 bg-[#023064]">
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
      <section className="py-20 bg-white">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      <section className="py-20 bg-gradient-to-br from-[#023064] to-[#0a4a9e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-blue-200 text-sm font-medium px-4 py-2 rounded-full border border-white/20 mb-6">
            <Shield className="w-4 h-4" />
            Available 24/7
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
            Need Help Securing Your Device?
          </h2>
          <p className="text-blue-200 text-lg mb-10">
            Our certified technicians are available 24/7 to help you stay
            secure
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/get-started"
              className="inline-flex items-center justify-center gap-2 bg-[#E11D48] hover:bg-red-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors duration-300"
            >
              Get Remote IT Support
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
