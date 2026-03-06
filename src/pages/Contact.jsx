import React from 'react';
import SectionHeader from '../components/SectionHeader';

const Contact = () => {
  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 md:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Contact"
          title="Let’s talk about your ICT environment"
          description="Share a bit about your organisation and goals. We’ll respond with clear next steps — usually within one business day."
        />

        <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <form className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm" data-reveal>
            <div>
              <label className="block text-xs font-medium text-slate-700">
                Name
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-primary-blue/20 focus:ring-2"
                  placeholder="Ada Lovelace"
                />
              </label>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700">
                Email
                <input
                  type="email"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-primary-blue/20 focus:ring-2"
                  placeholder="you@company.com"
                />
              </label>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700">
                Service Interested In
                <select className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-primary-blue/20 focus:ring-2">
                  <option>Remote IT Support</option>
                  <option>Access Control Systems</option>
                  <option>CCTV & Surveillance Systems</option>
                  <option>VOIP Solutions</option>
                  <option>ICT Skilling & Capacity Building</option>
                  <option>Software, Web Design & AI Solutions</option>
                </select>
              </label>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700">
                Message
                <textarea
                  rows={4}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-primary-blue/20 focus:ring-2"
                  placeholder="Tell us about your current ICT setup, challenges, and timelines."
                />
              </label>
            </div>

            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full bg-primary-blue px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-primary-red"
            >
              Submit enquiry
            </button>
          </form>

          <aside className="space-y-4 text-xs text-slate-600" data-reveal>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h2 className="font-heading text-sm font-semibold text-slate-900">Contact details</h2>
              <div className="mt-3 space-y-2">
                <p>Email: hello@cyberteksit.com</p>
                <p>Phone: +1 (202) 555-0198</p>
                <p>Office: 88 Polaris Avenue, Tech City, TX 78701</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <h2 className="font-heading text-sm font-semibold text-slate-900">Map</h2>
              <div className="mt-3 h-36 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3">
                <div className="relative h-full w-full rounded-lg bg-white">
                  <div className="pointer-events-none absolute inset-0 dot-pattern opacity-70" />
                  <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-red shadow" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h2 className="font-heading text-sm font-semibold text-slate-900">Follow us</h2>
              <div className="mt-3 flex items-center gap-4">
                <a href="#" className="text-slate-400 hover:text-primary-blue" aria-label="LinkedIn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3A2 2 0 0 1 21 5v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14Zm-9.25 16v-8.25h-2.5V19h2.5Zm-1.25-9.5a1.46 1.46 0 1 0 0-2.92 1.46 1.46 0 0 0 0 2.92ZM18 19v-4.73c0-2.46-1.31-3.6-3.07-3.6-1.41 0-2.04.77-2.39 1.3v-1.11h-2.5V19h2.5v-4.34c0-1.14.21-2.24 1.63-2.24 1.4 0 1.42 1.31 1.42 2.31V19H18Z" />
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-primary-red" aria-label="Twitter">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.6 7.6c.01.14.01.29.01.43 0 4.41-3.36 9.5-9.5 9.5-1.89 0-3.65-.55-5.13-1.5.26.03.51.04.78.04 1.56 0 3-.53 4.14-1.42-1.47-.03-2.7-1-3.13-2.34.2.03.41.05.63.05.29 0 .58-.04.85-.11-1.53-.31-2.69-1.66-2.69-3.29v-.04c.44.24.95.38 1.49.4A3.25 3.25 0 0 1 5.6 5.2a9.2 9.2 0 0 0 6.67 3.38 3.66 3.66 0 0 1-.08-.74 3.24 3.24 0 0 1 5.6-2.21 6.4 6.4 0 0 0 2.05-.78 3.22 3.22 0 0 1-1.43 1.79 6.5 6.5 0 0 0 1.86-.5 6.93 6.93 0 0 1-1.67 1.46Z" />
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-primary-blue" aria-label="Facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 12a8 8 0 1 0-9.25 7.9v-5.6H8.7V12h2.05V9.97c0-2.02 1.2-3.14 3.03-3.14.88 0 1.8.16 1.8.16v2h-1.01c-1 0-1.31.62-1.31 1.26V12h2.24l-.36 2.3h-1.88v5.6A8 8 0 0 0 20 12Z" />
                  </svg>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Contact;
