import { Link } from 'react-router-dom';
import { Shield, Mail, Phone } from 'lucide-react';

const SECTIONS = [
  {
    id: 'info-collect',
    title: '1. Information We Collect',
    content: [
      'We collect information you provide directly, such as your name, email address, phone number, company name, and any other details you submit via our contact forms, application forms, or support request forms.',
      'We may also collect technical data automatically when you visit our website, including your IP address, browser type, pages visited, and the time and date of your visit. This data is used solely for analytics and website improvement.',
      'We do not collect sensitive personal data such as financial details, national identity numbers, or health information unless you explicitly provide them in the context of a service engagement.',
    ],
  },
  {
    id: 'how-use',
    title: '2. How We Use Your Information',
    content: [
      'To respond to your enquiries and provide the IT support, training, or services you have requested.',
      'To send you important updates about your support tickets, course enrolment, or ongoing projects.',
      'To send you relevant communications about new services, promotions, or events, only where you have given us permission to do so.',
      'To improve our website and services through anonymised usage analytics.',
      'To comply with legal obligations and enforce our terms of service.',
    ],
  },
  {
    id: 'sharing',
    title: '3. Sharing Your Information',
    content: [
      'We do not sell, rent, or trade your personal information to third parties.',
      'We may share your information with trusted service providers who assist us in operating our website and delivering services (for example, our email delivery provider, Resend). These providers are contractually obligated to keep your data confidential.',
      'We may disclose your information if required by law, court order, or government authority.',
    ],
  },
  {
    id: 'cookies',
    title: '4. Cookies',
    content: [
      'Our website uses cookies to improve your browsing experience. Cookies are small text files stored on your device.',
      'We use essential cookies to enable core website functionality, and analytics cookies to understand how visitors interact with our site.',
      'You can control cookies through your browser settings. Disabling cookies may affect some features of the site.',
    ],
  },
  {
    id: 'retention',
    title: '5. Data Retention',
    content: [
      'We retain your personal data for as long as necessary to fulfil the purpose for which it was collected, or as required by applicable law.',
      'Support request data is retained for 2 years after the ticket is closed.',
      'Application and enrolment records are retained for the duration of your relationship with Cyberteks-IT and for 5 years thereafter.',
      'You may request deletion of your data at any time by contacting us (see Section 7).',
    ],
  },
  {
    id: 'security',
    title: '6. Security',
    content: [
      'We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, loss, or misuse.',
      'Access to personal data within Cyberteks-IT is restricted to staff who need it to perform their job duties.',
      'While we strive to protect your information, no internet transmission is 100% secure. We cannot guarantee absolute security.',
    ],
  },
  {
    id: 'rights',
    title: '7. Your Rights',
    content: [
      'You have the right to access the personal data we hold about you.',
      'You have the right to request correction of inaccurate data.',
      'You have the right to request deletion of your data, subject to legal and contractual obligations.',
      'You have the right to withdraw consent for marketing communications at any time.',
      'To exercise any of these rights, contact us at info@cyberteks-it.com or by phone.',
    ],
  },
  {
    id: 'children',
    title: '8. Children\'s Privacy',
    content: [
      'Our website and services are not directed at children under the age of 16. We do not knowingly collect personal data from children.',
      'If you believe we have inadvertently collected data from a child, please contact us immediately and we will delete it.',
    ],
  },
  {
    id: 'changes',
    title: '9. Changes to This Policy',
    content: [
      'We may update this Privacy Policy from time to time. The "Last Updated" date at the top of this page reflects the most recent revision.',
      'We will notify you of significant changes via email or a prominent notice on our website.',
      'Your continued use of our website or services after changes take effect constitutes your acceptance of the updated policy.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-[#023064] pt-12 pb-14 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-blue-300 text-sm font-semibold">Legal Document</span>
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-white mb-4">Privacy Policy</h1>
          <p className="text-blue-200 text-lg max-w-2xl">
            Cyberteks-IT is committed to protecting your personal data. This policy explains what we
            collect, how we use it, and the rights you have over your information.
          </p>
          <p className="text-blue-300 text-sm mt-4">Last updated: March 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">

          {/* Intro */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-10">
            <p className="text-gray-700 leading-relaxed">
              This Privacy Policy applies to Cyberteks-IT Limited ("Cyberteks-IT", "we", "us", or "our"),
              operating at <strong>cyberteks-it.com</strong> and all related subdomains. By using our website
              or services, you agree to the collection and use of information described in this policy.
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
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48] shrink-0 mt-2" />
                      {para}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="mt-14 bg-[#023064] rounded-3xl p-8 text-white">
            <h2 className="font-heading text-xl font-bold mb-4">Contact Our Data Team</h2>
            <p className="text-blue-200 mb-6 text-sm leading-relaxed">
              For any privacy-related questions, requests, or complaints, please contact us through any of
              the following channels. We aim to respond within 5 business days.
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
            Cyberteks-IT Limited · Kampala, Uganda ·{' '}
            <Link to="/terms-of-use" className="hover:text-[#023064] transition-colors">Terms of Use</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
