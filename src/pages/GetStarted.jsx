import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeader from '../components/SectionHeader';

const GetStarted = () => {
  const [submitted, setSubmitted] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => setSubmitted(false), 4500);
  };

  return (
    <section className="bg-slate-50 py-14 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 md:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Get Started"
          title="A clear path to modern, secure ICT"
          description="Complete the enrollment form and we’ll follow up with a tailored onboarding plan for your team."
        />

        <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            data-reveal
          >
            <div>
              <label className="block text-xs font-medium text-slate-700">
                Full Name
                <input
                  type="text"
                  required
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
                  required
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-primary-blue/20 focus:ring-2"
                  placeholder="you@company.com"
                />
              </label>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700">
                Phone
                <input
                  type="tel"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-primary-blue/20 focus:ring-2"
                  placeholder="+1 (202) 555-0198"
                />
              </label>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700">
                Company Name
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-primary-blue/20 focus:ring-2"
                  placeholder="Company name"
                />
              </label>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700">
                Service Needed
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
                  placeholder="Share your goals, timelines, and any current ICT challenges."
                />
              </label>
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-primary-blue px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-primary-red"
            >
              Submit enrollment
            </button>
          </form>

          <div className="space-y-4" data-reveal>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm">
              <h2 className="font-heading text-sm font-semibold text-slate-900">What happens next</h2>
              <p className="mt-2 text-xs text-slate-600">
                Our team will review your request and respond within one business day with a tailored
                onboarding roadmap and discovery call invite.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 shadow-sm">
              <h2 className="font-heading text-sm font-semibold text-slate-900">Onboarding timeline</h2>
              <p className="mt-2 text-xs text-slate-600">
                Most clients are fully onboarded within two weeks, including remote access setup,
                security reviews, and operational handover.
              </p>
            </div>

            <AnimatePresence>
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-700"
                >
                  <p className="font-semibold">Enrollment received.</p>
                  <p className="mt-1">We’ll be in touch shortly with next steps.</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetStarted;
