import React from 'react';
import SectionHeader from '../components/SectionHeader';

const benefits = [
  'Remote-first flexibility',
  'Cutting-edge projects',
  'Professional growth',
  'Impactful work'
];

const traits = ['Innovators', 'Problem-solvers', 'Lifelong learners', 'Strong communicators'];

const openings = [
  'ICT Trainer – Cybersecurity, Data Analytics and AI',
  'Software & AI Developer',
  'Remote IT Support Specialist',
  'Remote Sales Executive'
];

const Careers = () => {
  return (
    <section className="bg-slate-50 py-14 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 md:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Careers"
          title="Join a remote-first, impact-driven ICT team"
          description="At Cyberteks-IT, we believe that talent knows no borders — just like our services. We are a modern, tech-driven company where innovation thrives, ideas matter, and people grow."
        />

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-base text-slate-700 shadow-sm" data-reveal>
            <h2 className="font-heading text-sm font-semibold text-slate-900">Why Work With Us</h2>
            <ul className="mt-3 space-y-2 text-xs text-slate-600">
              {benefits.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary-blue" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-base text-slate-700 shadow-sm" data-reveal>
            <h2 className="font-heading text-sm font-semibold text-slate-900">Who We Look For</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {traits.map((trait) => (
                <span
                  key={trait}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-600"
                >
                  {trait}
                </span>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-600">
              We value curiosity, ownership, and the ability to communicate clearly with both technical and
              non-technical teams.
            </p>
          </div>
        </div>

        <div className="mt-10" data-reveal>
          <h2 className="font-heading text-lg font-semibold text-slate-900">Current Openings</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {openings.map((role) => (
              <div
                key={role}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 text-base text-slate-700 shadow-sm"
              >
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{role}</h3>
                  <p className="mt-2 text-xs text-slate-600">
                    Remote-first role with opportunities to collaborate on impactful ICT initiatives across
                    multiple industries.
                  </p>
                </div>
                <button
                  type="button"
                  className="mt-4 inline-flex w-fit items-center justify-center rounded-full border border-primary-blue px-4 py-2 text-xs font-semibold text-primary-blue transition hover:border-primary-red hover:text-primary-red"
                >
                  Apply
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Careers;
