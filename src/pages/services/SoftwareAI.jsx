import React from 'react';
import laptopImage from '/assets/laptops-d7d8c876-add9-4f6f-b38f-4b65a259cd24.png';

const pillars = [
  'Product discovery, UX, and prototyping',
  'Web apps, portals, and mobile-ready frontends',
  'APIs, integrations, and secure data flows',
  'AI: chatbots, automations, and predictive models'
];

const phases = [
  { title: 'Discover', detail: 'Workshops, user journeys, and measurable outcomes.' },
  { title: 'Design & Build', detail: 'Design system, sprints, CICD, QA automation.' },
  { title: 'Integrate', detail: 'APIs, identity, observability, and compliance checks.' },
  { title: 'Operate', detail: 'SLAs, SLOs, monitoring, and iterative improvements.' }
];

const gallery = [laptopImage, laptopImage, laptopImage];

const SoftwareAI = () => (
  <section className="bg-white py-14 sm:py-16">
    <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-blue">Service</p>
          <h1 className="font-heading text-3xl font-semibold text-slate-900">Software, Web Design & AI Solutions</h1>
          <p className="text-base text-slate-700">
            From discovery to production, we design, build, and operate secure digital products and AI-powered workflows tailored to your business.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {pillars.map((item) => (
              <div key={item} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                {item}
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Delivery</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {phases.map((s) => (
                <div key={s.title} className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-sm font-semibold text-slate-900">{s.title}</p>
                  <p className="mt-1 text-xs text-slate-600">{s.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <img src={laptopImage} alt="Software and AI" className="h-full max-h-[360px] w-full rounded-2xl object-cover shadow" />
          <div className="grid grid-cols-3 gap-3">
            {gallery.map((src, i) => (
              <img key={i} src={src} alt={`Software ${i + 1}`} className="h-24 w-full rounded-xl object-cover border border-slate-200" />
            ))}
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">What we ensure</p>
            <ul className="mt-2 space-y-1 text-xs text-slate-600">
              <li>• Secure-by-design architectures and reviews</li>
              <li>• Observability, logging, and uptime targets</li>
              <li>• Handover with runbooks and training</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default SoftwareAI;
