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
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-xs font-medium text-slate-700">
                First Name
                <input
                  type="text"
                  required
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-primary-blue/20 focus:ring-2"
                  placeholder="Caleb"
                />
              </label>
              <label className="block text-xs font-medium text-slate-700">
                Last Name
                <input
                  type="text"
                  required
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-primary-blue/20 focus:ring-2"
                  placeholder="Ikuzo"
                />
              </label>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-xs font-medium text-slate-700">
                Email
                <input
                  type="email"
                  required
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-primary-blue/20 focus:ring-2"
                  placeholder="you@company.com"
                />
              </label>
              <label className="block text-xs font-medium text-slate-700">
                Phone
                <input
                  type="tel"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-primary-blue/20 focus:ring-2"
                  placeholder="+256 760 000 000"
                />
              </label>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-xs font-medium text-slate-700">
                Company Name
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-primary-blue/20 focus:ring-2"
                  placeholder="Company name"
                />
              </label>
              <label className="block text-xs font-medium text-slate-700">
                Address
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-primary-blue/20 focus:ring-2"
                  placeholder="Buganda Rd, Kampala, Uganda"
                />
              </label>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700">
                Service Needed
                <select className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-primary-blue/20 focus:ring-2" defaultValue="ICT Skilling & Capacity Building">
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
            <div>
              <label className="block text-xs font-medium text-slate-700">
                Upload Photo (optional)
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                />
              </label>
              <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center text-sm text-slate-700 transition hover:border-primary-blue/60 hover:bg-white">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-blue/10 text-primary-blue">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.5v-5m0 0-2.5 2.5M12 10.5l2.5 2.5" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 16.5a3.5 3.5 0 0 0-3.5-3.5H16a5 5 0 0 0-9.9 1 3 3 0 0 0 .6 6H16.5A3.5 3.5 0 0 0 20 16.5Z" />
                    </svg>
                  </span>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-900">Drop or browse a photo</p>
                    <p className="text-xs text-slate-500">PNG, JPG up to 5MB</p>
                  </div>
                </div>
                <span className="mt-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-primary-blue shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16h10M12 8v8m-5 4h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z" />
                  </svg>
                  Choose file
                </span>
              </label>
              <p className="mt-2 text-[11px] text-slate-500">Add a headshot to help our team personalize your onboarding.</p>
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
                Most clients are fully onboarded within one weeks, including remote access setup,
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
