import { Link } from 'react-router-dom';
import { FileText, Mail, Phone } from 'lucide-react';

const SECTIONS = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    content: [
      'By accessing or using the CyberteksIT website (cyberteks-it.com) or our Learning Management System (LMS) platform, you agree to be bound by these Terms of Use.',
      'If you do not agree to these terms, please discontinue use of our website and services immediately.',
      'These terms apply to all visitors, registered users, students, and clients of CyberteksIT Limited.',
    ],
  },
  {
    id: 'services',
    title: '2. Services Description',
    content: [
      'CyberteksIT provides ICT solutions including remote IT support, CCTV installation, access control systems, VoIP telephony, software development, and ICT skills training.',
      'Our LMS platform provides access to online and hybrid training programmes upon successful enrolment and payment.',
      'Service availability may vary and is subject to the specific terms of your engagement or enrolment agreement.',
    ],
  },
  {
    id: 'accounts',
    title: '3. User Accounts',
    content: [
      'To access the LMS platform, you must register for an account. You are responsible for maintaining the confidentiality of your login credentials.',
      'You must provide accurate and complete information when creating your account. You are responsible for all activities that occur under your account.',
      'You must notify us immediately at info@cyberteks-it.com if you suspect unauthorised access to your account.',
      'CyberteksIT reserves the right to suspend or terminate accounts that violate these terms.',
    ],
  },
  {
    id: 'training',
    title: '4. Training & Enrolment',
    content: [
      'Enrolment in a training programme is confirmed only upon receipt of the required payment or a signed payment arrangement.',
      'Course fees are as published on our website and are subject to change. Enrolled students will not be affected by fee changes during their current cohort.',
      'Course materials, videos, and assessments provided through the LMS are for your personal educational use only.',
      'Certificates are awarded upon successful completion of all required assessments with a minimum passing grade as specified per programme.',
      'Refund requests must be submitted within 7 days of enrolment and before completing more than 20% of the course content.',
    ],
  },
  {
    id: 'ip',
    title: '5. Intellectual Property',
    content: [
      'All content on the CyberteksIT website and LMS — including text, images, course materials, videos, and software — is the property of CyberteksIT Limited and is protected by applicable copyright laws.',
      'You may not reproduce, distribute, republish, or resell any course content without prior written permission from CyberteksIT.',
      'You retain ownership of any work or projects you create during training programmes, but grant CyberteksIT a non-exclusive licence to use them for educational and promotional purposes.',
    ],
  },
  {
    id: 'conduct',
    title: '6. Acceptable Use',
    content: [
      'You agree to use our website and LMS platform only for lawful purposes.',
      'You must not: attempt to gain unauthorised access to any system or data; upload malicious software; harass, abuse, or threaten other users; post false or misleading information; or violate any applicable law or regulation.',
      'Violation of acceptable use policies may result in immediate suspension of your account without refund.',
    ],
  },
  {
    id: 'support',
    title: '7. IT Support Services',
    content: [
      'Remote IT support sessions are conducted with your explicit permission. You must not grant remote access to CyberteksIT staff unless you have verified their identity.',
      'Support is provided on a best-efforts basis. While we aim for same-day resolution, response times may vary based on ticket volume and issue complexity.',
      'CyberteksIT is not liable for data loss resulting from hardware failures or actions outside our control during a support session.',
      'You are responsible for maintaining current backups of your data before any support session.',
    ],
  },
  {
    id: 'liability',
    title: '8. Limitation of Liability',
    content: [
      'To the maximum extent permitted by applicable law, CyberteksIT shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services.',
      'Our total liability to you for any claim arising from use of our services shall not exceed the amount paid by you to CyberteksIT in the three months preceding the claim.',
      'CyberteksIT makes no warranty that the website or LMS will be error-free or uninterrupted, though we strive for high availability.',
    ],
  },
  {
    id: 'privacy',
    title: '9. Privacy',
    content: [
      'Your use of our services is also governed by our Privacy Policy, which is incorporated into these Terms of Use by reference.',
      'Please review our Privacy Policy to understand our data collection and use practices.',
    ],
  },
  {
    id: 'changes',
    title: '10. Changes to Terms',
    content: [
      'CyberteksIT reserves the right to modify these Terms of Use at any time. The "Last Updated" date will reflect the most recent revision.',
      'Continued use of our website or services after changes are posted constitutes your acceptance of the revised terms.',
      'For material changes, we will provide reasonable notice via email or a prominent website notice.',
    ],
  },
  {
    id: 'governing',
    title: '11. Governing Law',
    content: [
      'These Terms of Use are governed by and construed in accordance with the laws of the Republic of Uganda.',
      'Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts of Kampala, Uganda.',
      'We encourage you to contact us first to resolve any disputes amicably before initiating formal legal proceedings.',
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-[#023064] pt-12 pb-14 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-blue-300 text-sm font-semibold">Legal Document</span>
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-white mb-4">Terms of Use</h1>
          <p className="text-blue-200 text-lg max-w-2xl">
            These terms govern your use of the CyberteksIT website and LMS platform.
            Please read them carefully before using our services.
          </p>
          <p className="text-blue-300 text-sm mt-4">Last updated: March 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">

          {/* Intro */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 mb-10">
            <p className="text-gray-700 leading-relaxed text-sm">
              <strong>Important:</strong> These Terms of Use ("Terms") constitute a legally binding agreement
              between you and CyberteksIT Limited, a company registered in Kampala, Uganda. By accessing our
              website at <strong>cyberteks-it.com</strong> or using our LMS platform, you confirm that you
              have read, understood, and agree to be bound by these Terms.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-10">
            {SECTIONS.map((section) => (
              <div key={section.id} id={section.id}>
                <h2 className="font-heading text-xl font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">
                  {section.title}
                </h2>
                <ul className="space-y-3">
                  {section.content.map((para, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-600 leading-relaxed text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#023064] shrink-0 mt-2" />
                      {para}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="mt-14 bg-[#023064] rounded-3xl p-8 text-white">
            <h2 className="font-heading text-xl font-bold mb-4">Questions About These Terms?</h2>
            <p className="text-blue-200 mb-6 text-sm leading-relaxed">
              If you have any questions about these Terms of Use, please contact us. We're happy to explain
              anything in plain language.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="mailto:info@cyberteks-it.com"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-3 rounded-xl transition-colors text-sm">
                <Mail className="w-4 h-4" /> info@cyberteks-it.com
              </a>
              <a href="tel:+256779367005"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-3 rounded-xl transition-colors text-sm">
                <Phone className="w-4 h-4" /> +256 779 367 005
              </a>
            </div>
          </div>

          <p className="text-gray-400 text-xs mt-8 text-center">
            CyberteksIT Limited · Kampala, Uganda ·{' '}
            <Link to="/privacy-policy" className="hover:text-[#023064] transition-colors">Privacy Policy</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
