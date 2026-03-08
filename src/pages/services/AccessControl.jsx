import React from 'react';
import accessImg from '/assets/access-control-systems.jpg';

const zones = [
  'Biometric and RFID entry with audit trails',
  'Visitor management with pre-registration',
  'Role-based access policies tied to HR systems',
  'Locks, controllers, and power redundancy design'
];

const phases = [
  { title: 'Survey & Design', copy: 'Site survey, cabling & power plan, risk mapping, and BOM.' },
  { title: 'Deploy', copy: 'Controller setup, reader installs, panel wiring, and failover tests.' },
  { title: 'Integrate', copy: 'Directory / HRIS integration, SSO, alerting, and reporting.' },
  { title: 'Train & Support', copy: 'Admin training, playbooks, and ongoing remote monitoring.' }
];

const gallery = [accessImg, accessImg, accessImg];

const AccessControl = () => (
  <section className="bg-white py-14 sm:py-16">
    <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-blue">Service</p>
          <h1 className="font-heading text-3xl font-semibold text-slate-900">Access Control Systems</h1>
          <p className="text-base text-slate-700">
            Secure, audit-ready access control—from doors to data centers—designed for uptime, compliance, and great user experience.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {zones.map((item) => (
              <div key={item} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                {item}
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Delivery playbook</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {phases.map((s) => (
                <div key={s.title} className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-sm font-semibold text-slate-900">{s.title}</p>
                  <p className="mt-1 text-xs text-slate-600">{s.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <img src={accessImg} alt="Access Control" className="h-full max-h-[360px] w-full rounded-2xl object-cover shadow" />
          <div className="grid grid-cols-3 gap-3">
            {gallery.map((src, i) => (
              <img key={i} src={src} alt={`Access control ${i + 1}`} className="h-24 w-full rounded-xl object-cover border border-slate-200" />
            ))}
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">What you get</p>
            <ul className="mt-2 space-y-1 text-xs text-slate-600">
              <li>• Redundant power and fail-open/fail-close strategy</li>
              <li>• Audit-ready logs and alerting to your SOC/ITSM</li>
              <li>• Preventive maintenance schedule and SLAs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default AccessControl;
