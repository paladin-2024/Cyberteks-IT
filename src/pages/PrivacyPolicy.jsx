import React from 'react';

const PrivacyPolicy = () => (
  <section className="bg-white py-14 sm:py-16">
    <div className="mx-auto max-w-5xl px-4 md:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-semibold text-slate-900">Privacy Policy</h1>
      <p className="mt-3 text-base text-slate-700">
        Cyberteks-IT is committed to protecting your privacy and safeguarding your personal information. This Privacy Policy
        explains how we collect, use, store, and protect the information you provide when you visit our website or use our
        services. By using our website or engaging with our services, you agree to the terms of this Privacy Policy.
      </p>

      <div className="mt-6 space-y-5 text-base text-slate-700">
        <section>
          <h2 className="text-xl font-semibold text-slate-900">1. Information We Collect</h2>
          <p className="mt-2 text-sm font-semibold text-slate-700">a. Personal Information</p>
          <ul className="mt-1 space-y-1 text-sm text-slate-600">
            <li>• Name, email address, phone number, job title, company name</li>
            <li>• Billing and payment details (where applicable)</li>
            <li>• Any information you voluntarily submit via forms, chat, or email</li>
          </ul>
          <p className="mt-3 text-sm font-semibold text-slate-700">b. Non-Personal Information</p>
          <ul className="mt-1 space-y-1 text-sm text-slate-600">
            <li>• IP address, browser type, device information</li>
            <li>• Pages visited, time spent, and other analytics data</li>
            <li>• Cookies and tracking technologies (see Section 6)</li>
          </ul>
          <p className="mt-3 text-sm font-semibold text-slate-700">c. Service-Specific Data</p>
          <ul className="mt-1 space-y-1 text-sm text-slate-600">
            <li>• Video or audio data from surveillance systems (for clients)</li>
            <li>• Communication logs (for VoIP solutions)</li>
            <li>• Project files, configurations, and technical requirements</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">2. How We Use Your Information</h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            <li>• Provide and manage our products and services</li>
            <li>• Respond to inquiries and support requests</li>
            <li>• Process payments and issue invoices</li>
            <li>• Improve our website, services, and customer experience</li>
            <li>• Send relevant updates, offers, and service announcements (with your consent)</li>
            <li>• Comply with legal obligations and prevent fraud or misuse</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">3. Sharing Your Information</h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            <li>• We do not sell, rent, or trade your personal information.</li>
            <li>• We may share it with trusted service providers under strict confidentiality agreements.</li>
            <li>• We may share when required by law or to protect safety, rights, or property.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">4. Data Retention</h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            <li>• We retain personal information only as long as necessary for stated purposes or as required by law.</li>
            <li>• CCTV footage retention follows your service configuration and regulations.</li>
            <li>• Training records, project files, and VoIP logs are kept for a reasonable business period unless you request deletion.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">5. Data Security</h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            <li>• Encryption for data transmission and storage</li>
            <li>• Secure server infrastructure</li>
            <li>• Access controls and authentication protocols</li>
          </ul>
          <p className="mt-2 text-sm text-slate-600">
            While we take reasonable precautions, no method of transmission or storage is completely secure.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">6. Cookies & Tracking Technologies</h2>
          <p className="mt-2 text-sm text-slate-600">
            We use cookies and similar technologies to improve functionality, analyze traffic, and personalize your experience.
            You can control cookies via your browser; some features may not function properly without them.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">7. Your Rights</h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            <li>• Access, update, or delete your personal data</li>
            <li>• Object to or restrict certain processing</li>
            <li>• Withdraw consent for marketing communications</li>
            <li>• Request a copy of your data in a portable format</li>
          </ul>
          <p className="mt-2 text-sm text-slate-600">To exercise these rights, contact us using the details below.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">8. Third-Party Links</h2>
          <p className="mt-2 text-sm text-slate-600">
            Our website may contain links to third-party sites. We are not responsible for their privacy practices or content.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">9. Changes to This Privacy Policy</h2>
          <p className="mt-2 text-sm text-slate-600">We may update this Privacy Policy from time to time.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">10. Contact Us</h2>
          <p className="mt-2 text-sm text-slate-600">
            Cyberteks-IT, Plot 1 Bombo Road, Kampala – Uganda<br />
            Email: <a className="text-primary-blue hover:text-primary-red" href="mailto:info@cyberteks-it.com">info@cyberteks-it.com</a><br />
            Phone: +256779367005<br />
            Website: www.cyberteks-it.com
          </p>
        </section>
      </div>
    </div>
  </section>
);

export default PrivacyPolicy;
