import React from 'react';
import SectionHeader from '../components/SectionHeader';

const benefits = [
  'Remote-first flexibility – work from anywhere without sacrificing collaboration or impact.',
  'Cutting-edge projects – from AI solutions to enterprise networking, we tackle challenges that shape industries.',
  'Professional growth – access to continuous training, certifications, and skill development.',
  'Impactful work – see your expertise directly improve businesses and communities.'
];

const traits = [
  'Innovators',
  'Problem-solvers',
  'Lifelong learners',
  'Strong communicators',
  'Remote-collaboration pros',
  'Tech-as-progress mindset'
];

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
          <div className="rounded-2xl border border-slate-200 bg-white p-7 text-lg text-slate-700 shadow-sm md:min-h-[260px]" data-reveal>
            <h2 className="font-heading text-base font-semibold text-slate-900">Why Work With Us</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {benefits.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary-blue" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-7 text-lg text-slate-700 shadow-sm md:min-h-[260px]" data-reveal>
            <h2 className="font-heading text-base font-semibold text-slate-900">Who We Look For</h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {traits.map((trait) => (
                <div
                  key={trait}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:-translate-y-1 hover:border-primary-blue hover:bg-white hover:text-primary-blue"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-blue" />
                  {trait}
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-700">
              Thrive in a fast-paced, ever-changing tech environment. Communicate well in remote and in-person
              settings. Embrace technology as a tool for progress.
            </p>
          </div>
        </div>

        <div className="mt-10" data-reveal>
          <h2 className="font-heading text-xl font-semibold text-slate-900">Current Openings</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {openings.map((role) => (
              <div
                key={role}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 text-lg text-slate-700 shadow-sm"
              >
                <div>
                  <h3 className="text-base font-semibold text-slate-900">{role}</h3>
                  <p className="mt-2 text-sm text-slate-700">
                    Remote-first role with opportunities to collaborate on impactful ICT initiatives across
                    multiple industries.
                  </p>
                </div>
                <button
                  type="button"
                  className="mt-4 inline-flex w-fit items-center justify-center rounded-full border border-primary-blue px-5 py-2.5 text-sm font-semibold text-primary-blue transition hover:border-primary-red hover:text-primary-red"
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
