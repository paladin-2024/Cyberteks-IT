import React from 'react';
import remoteImg from '/assets/remote-it-support.jpg';

const bullets = [
  '24/7 remote helpdesk for users and endpoints',
  'Proactive monitoring, patching, and backups',
  'Incident triage, containment, and root-cause reporting',
  'MFA, endpoint protection, and secure access-by-default'
];

const steps = [
  { title: 'Assess', detail: 'Environment discovery, tooling audit, and runbook definition.' },
  { title: 'Stabilise', detail: 'Quick wins, patch baselines, backup checks, alert hygiene.' },
  { title: 'Operate', detail: 'SLAs on response and resolution; weekly ops reviews.' },
  { title: 'Improve', detail: 'Quarterly resilience tests and automation rollouts.' }
];

const gallery = [remoteImg, remoteImg, remoteImg];

const RemoteITSupport = () => (
  <section className="bg-white py-14 sm:py-16">
    <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-blue">Service</p>
          <h1 className="font-heading text-3xl font-semibold text-slate-900">Remote IT Support</h1>
          <p className="text-base text-slate-700">
            Always-on support for devices, apps, and users. We stabilise, secure, and run your IT operations with clear SLAs and transparent reporting.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {bullets.map((item) => (
              <div key={item} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                {item}
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">How we work</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {steps.map((s) => (
                <div key={s.title} className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-sm font-semibold text-slate-900">{s.title}</p>
                  <p className="mt-1 text-xs text-slate-600">{s.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <img src={remoteImg} alt="Remote IT Support" className="h-full max-h-[360px] w-full rounded-2xl object-cover shadow" />
          <div className="grid grid-cols-3 gap-3">
            {gallery.map((src, i) => (
              <img key={i} src={src} alt={`Remote support ${i + 1}`} className="h-24 w-full rounded-xl object-cover border border-slate-200" />
            ))}
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">SLAs & Coverage</p>
            <ul className="mt-2 space-y-1 text-xs text-slate-600">
              <li>• 24/7 remote response, business-hour on-site (where available)</li>
              <li>• P1 ≤ 30 min acknowledgement, P2 ≤ 2 hrs</li>
              <li>• Weekly health reports and monthly trend reviews</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default RemoteITSupport;
