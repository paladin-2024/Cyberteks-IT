import React from 'react';
import cctvImg from '/assets/cctv-surveillance-systems.jpg';

const highlights = [
  'IP cameras, NVRs, cloud & hybrid storage',
  'Motion/line-cross alerts and mobile access',
  'Secure remote viewing with MFA',
  'Health monitoring for cameras & storage'
];

const kits = [
  { title: 'Starter (4–8 cam)', detail: 'Essential coverage with remote view, UPS, and 7–14 day retention.' },
  { title: 'Pro (8–16 cam)', detail: 'Analytics, dual storage, and SOC/SIEM forwarding.' },
  { title: 'Enterprise (16+ cam)', detail: 'Redundant recorders, failover WAN, and campus coverage.' }
];

const gallery = [cctvImg, cctvImg, cctvImg];

const CCTV = () => (
  <section className="bg-white py-14 sm:py-16">
    <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-blue">Service</p>
          <h1 className="font-heading text-3xl font-semibold text-slate-900">CCTV & Surveillance</h1>
          <p className="text-base text-slate-700">
            Resilient surveillance systems with smart alerts, secure storage, and remote visibility—designed for uptime and evidence integrity.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {highlights.map((item) => (
              <div key={item} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                {item}
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Packages</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {kits.map((k) => (
                <div key={k.title} className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-sm font-semibold text-slate-900">{k.title}</p>
                  <p className="mt-1 text-xs text-slate-600">{k.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <img src={cctvImg} alt="CCTV Surveillance" className="h-full max-h-[360px] w-full rounded-2xl object-cover shadow" />
          <div className="grid grid-cols-3 gap-3">
            {gallery.map((src, i) => (
              <img key={i} src={src} alt={`CCTV ${i + 1}`} className="h-24 w-full rounded-xl object-cover border border-slate-200" />
            ))}
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">Assurance</p>
            <ul className="mt-2 space-y-1 text-xs text-slate-600">
              <li>• Storage sizing for retention & compliance</li>
              <li>• Secure remote access (VPN / zero-trust)</li>
              <li>• Quarterly health checks & firmware cadence</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default CCTV;
