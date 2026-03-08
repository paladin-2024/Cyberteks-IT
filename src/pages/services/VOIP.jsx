import React from 'react';
import voipImg from '/assets/voip-solutions.jpg';

const points = [
  'Cloud PBX, SIP trunks, call routing and IVRs',
  'Collaboration: voice, video, chat with secure MFA',
  'QoS tuning, SBCs, and network readiness assessments',
  'Contact center flows, call recording, and analytics'
];

const steps = [
  { title: 'Readiness', detail: 'LAN/WAN assessment, QoS plan, number porting strategy.' },
  { title: 'Build', detail: 'PBX / UC setup, call flows, IVRs, SBC security.' },
  { title: 'Adopt', detail: 'User training, device rollout, mobile/desktop clients.' },
  { title: 'Operate', detail: 'Monitoring, SLAs, usage and quality reports.' }
];

const gallery = [voipImg, voipImg, voipImg];

const VOIP = () => (
  <section className="bg-white py-14 sm:py-16">
    <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-blue">Service</p>
          <h1 className="font-heading text-3xl font-semibold text-slate-900">VOIP & Collaboration</h1>
          <p className="text-base text-slate-700">
            Modern voice and collaboration stacks with clear call flows, resilient connectivity, and secure access for distributed teams.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {points.map((item) => (
              <div key={item} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                {item}
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Rollout steps</p>
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
          <img src={voipImg} alt="VOIP Solutions" className="h-full max-h-[360px] w-full rounded-2xl object-cover shadow" />
          <div className="grid grid-cols-3 gap-3">
            {gallery.map((src, i) => (
              <img key={i} src={src} alt={`VOIP ${i + 1}`} className="h-24 w-full rounded-xl object-cover border border-slate-200" />
            ))}
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">SLA highlights</p>
            <ul className="mt-2 space-y-1 text-xs text-slate-600">
              <li>• MOS and jitter monitored with alerts</li>
              <li>• Porting and change windows handled for you</li>
              <li>• Quarterly quality & adoption reviews</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default VOIP;
