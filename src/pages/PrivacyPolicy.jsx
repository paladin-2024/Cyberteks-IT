import React from 'react';

const PrivacyPolicy = () => (
  <section className="bg-white py-14 sm:py-16">
    <div className="mx-auto max-w-5xl px-4 md:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-semibold text-slate-900">Privacy Policy</h1>
      <p className="mt-3 text-sm text-slate-700">
        This Privacy Policy explains how Cyberteks-IT collects, uses, and protects your information when you use our
        websites, products, and services.
      </p>

      <div className="mt-6 space-y-4 text-sm text-slate-700">
        <section>
          <h2 className="text-lg font-semibold text-slate-900">Information We Collect</h2>
          <ul className="mt-2 space-y-1 text-xs text-slate-600">
            <li>• Contact details you provide (name, email, phone, company).</li>
            <li>• Usage data such as pages viewed, clicks, device and browser information.</li>
            <li>• Support and sales interactions, including chat and email threads.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">How We Use Information</h2>
          <ul className="mt-2 space-y-1 text-xs text-slate-600">
            <li>• To respond to enquiries and deliver services.</li>
            <li>• To improve our site, products, and support experience.</li>
            <li>• To send updates about services you’ve requested (you may opt out anytime).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">Sharing & Security</h2>
          <ul className="mt-2 space-y-1 text-xs text-slate-600">
            <li>• We do not sell your data.</li>
            <li>• We may share data with trusted processors (hosting, analytics, communications) under strict agreements.</li>
            <li>• We use industry-standard security controls to safeguard data.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">Your Choices</h2>
          <ul className="mt-2 space-y-1 text-xs text-slate-600">
            <li>• You can request access, correction, or deletion of your personal data.</li>
            <li>• You can opt out of marketing communications via unsubscribe links.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">Contact</h2>
          <p className="mt-2 text-xs text-slate-600">
            For privacy enquiries, email <a className="text-primary-blue hover:text-primary-red" href="mailto:info@cyberteks-it.com">info@cyberteks-it.com</a>.
          </p>
        </section>
      </div>
    </div>
  </section>
);

export default PrivacyPolicy;
