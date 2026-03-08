import React from 'react';

const TermsOfUse = () => (
  <section className="bg-white py-14 sm:py-16">
    <div className="mx-auto max-w-5xl px-4 md:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-semibold text-slate-900">Terms of Use</h1>
      <p className="mt-3 text-sm text-slate-700">
        These Terms govern your access to and use of Cyberteks-IT websites, products, and services. By using them, you
        agree to these Terms.
      </p>

      <div className="mt-6 space-y-4 text-sm text-slate-700">
        <section>
          <h2 className="text-lg font-semibold text-slate-900">Acceptable Use</h2>
          <ul className="mt-2 space-y-1 text-xs text-slate-600">
            <li>• Use our services only for lawful purposes and in accordance with these Terms.</li>
            <li>• Do not attempt to disrupt, reverse engineer, or gain unauthorised access to our systems.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">Accounts & Security</h2>
          <ul className="mt-2 space-y-1 text-xs text-slate-600">
            <li>• You are responsible for safeguarding account credentials.</li>
            <li>• Notify us immediately of any unauthorised use of your account.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">Content & IP</h2>
          <ul className="mt-2 space-y-1 text-xs text-slate-600">
            <li>• Cyberteks-IT retains all rights to its trademarks, content, and software.</li>
            <li>• You retain rights to content you provide; you grant us a limited licence to deliver services.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">Disclaimers & Liability</h2>
          <ul className="mt-2 space-y-1 text-xs text-slate-600">
            <li>• Services are provided “as is” to the fullest extent permitted by law.</li>
            <li>• Cyberteks-IT is not liable for indirect, incidental, or consequential damages.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">Changes</h2>
          <p className="mt-2 text-xs text-slate-600">
            We may update these Terms. If we make material changes, we will post the new Terms on this page with an
            updated date.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">Contact</h2>
          <p className="mt-2 text-xs text-slate-600">
            Questions? Email <a className="text-primary-blue hover:text-primary-red" href="mailto:info@cyberteks-it.com">info@cyberteks-it.com</a>.
          </p>
        </section>
      </div>
    </div>
  </section>
);

export default TermsOfUse;
