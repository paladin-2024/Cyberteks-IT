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
            <div className="space-y-6" data-reveal>
              <form className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-700">
                      First Name
                      <input
                          type="text"
                          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-primary-blue/20 focus:ring-2"
                          placeholder="Caleb"
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700">
                      Last Name
                      <input
                          type="text"
                          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-primary-blue/20 focus:ring-2"
                          placeholder="Ikuzo"
                      />
                    </label>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                      Phone Number
                      <input
                          type="tel"
                          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-primary-blue/20 focus:ring-2"
                          placeholder="+256 760 000 000"
                      />
                    </label>
                  </div>
                </div>

                <div>
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

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <h2 className="font-heading text-sm font-semibold text-slate-900">Follow us</h2>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-slate-600">
                  <a
                      href="https://www.linkedin.com/company/cyberteks-it/"
                      className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm hover:border-[#0A66C2] hover:text-[#0A66C2]"
                      target="_blank"
                      rel="noreferrer"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3A2 2 0 0 1 21 5v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14Zm-9.25 16v-8.25h-2.5V19h2.5Zm-1.25-9.5a1.46 1.46 0 1 0 0-2.92 1.46 1.46 0 0 0 0 2.92ZM18 19v-4.73c0-2.46-1.31-3.6-3.07-3.6-1.41 0-2.04.77-2.39 1.3v-1.11h-2.5V19h2.5v-4.34c0-1.14.21-2.24 1.63-2.24 1.4 0 1.42 1.31 1.42 2.31V19H18Z" />
                    </svg>
                    LinkedIn
                  </a>
                  <a
                      href="https://x.com/CyberteksIT"
                      className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm hover:border-black hover:text-black"
                      target="_blank"
                      rel="noreferrer"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.6 7.6c.01.14.01.29.01.43 0 4.41-3.36 9.5-9.5 9.5-1.89 0-3.65-.55-5.13-1.5.26.03.51.04.78.04 1.56 0 3-.53 4.14-1.42-1.47-.03-2.7-1-3.13-2.34.2.03.41.05.63.05.29 0 .58-.04.85-.11-1.53-.31-2.69-1.66-2.69-3.29v-.04c.44.24.95.38 1.49.4A3.25 3.25 0 0 1 5.6 5.2a9.2 9.2 0 0 0 6.67 3.38 3.66 3.66 0 0 1-.08-.74 3.24 3.24 0 0 1 5.6-2.21 6.4 6.4 0 0 0 2.05-.78 3.22 3.22 0 0 1-1.43 1.79 6.5 6.5 0 0 0 1.86-.5 6.93 6.93 0 0 1-1.67 1.46Z" />
                    </svg>
                    X
                  </a>
                  <a
                      href="https://www.facebook.com/cyberteksIT"
                      className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm hover:border-[#1877F2] hover:text-[#1877F2]"
                      target="_blank"
                      rel="noreferrer"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 12a8 8 0 1 0-9.25 7.9v-5.6H8.7V12h2.05V9.97c0-2.02 1.2-3.14 3.03-3.14.88 0 1.8.16 1.8.16v2h-1.01c-1 0-1.31.62-1.31 1.26V12h2.24l-.36 2.3h-1.88v5.6A8 8 0 0 0 20 12Z" />
                    </svg>
                    Facebook
                  </a>
                  <a
                      href="https://www.instagram.com/cyberteksit/"
                      className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm hover:border-[#E1306C] hover:text-[#E1306C]"
                      target="_blank"
                      rel="noreferrer"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm5 4.6A4.4 4.4 0 1 0 16.4 12 4.4 4.4 0 0 0 12 7.6Zm6.1-.45a1.15 1.15 0 1 0-.81.34 1.15 1.15 0 0 0 .81-.34ZM12 9.4A2.6 2.6 0 1 0 14.6 12 2.6 2.6 0 0 0 12 9.4Z" />
                    </svg>
                    Instagram
                  </a>
                </div>
              </div>
            </div>

            <aside className="space-y-4 text-xs text-slate-600" data-reveal>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h2 className="font-heading text-sm font-semibold text-slate-900">Contact details</h2>
                <div className="mt-4 space-y-3 text-sm text-slate-700">
                  <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-blue/10 text-primary-blue">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16v16H4z" />
                      <path d="m4 7 8 5 8-5" />
                    </svg>
                  </span>
                    <div>
                      <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Email</p>
                      <a
                          href="mailto:info@cyberteks-it.com"
                          className="font-semibold text-primary-blue hover:text-primary-red"
                      >
                        info@cyberteks-it.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-blue/10 text-primary-blue">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.06 4.1 2 2 0 0 1 4.05 2h3a2 2 0 0 1 2 1.72c.12.86.38 1.69.76 2.47a2 2 0 0 1-.45 2.18L8.09 9.91a16 16 0 0 0 6 6l1.54-1.27a2 2 0 0 1 2.18-.45 11.8 11.8 0 0 0 2.47.76A2 2 0 0 1 22 16.92Z" />
                    </svg>
                  </span>
                    <div>
                      <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Phone</p>
                      <p className="font-semibold text-slate-900">+256 779 367 005</p>
                      <p className="font-semibold text-slate-900">+256 706 911 732</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-blue/10 text-primary-blue">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 21s-6-5.33-6-10a6 6 0 1 1 12 0c0 4.67-6 10-6 10Z" />
                      <circle cx="12" cy="11" r="2" />
                    </svg>
                  </span>
                    <div>
                      <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Office</p>
                      <p className="font-semibold text-slate-900">Buganda Rd, Kampala, Uganda</p>
                      <p className="text-xs text-slate-600">P.O Box 193095</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <h2 className="font-heading text-sm font-semibold text-slate-900">Map</h2>
                <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
                  <div className="relative pb-[60%] min-h-[260px]">
                    <iframe
                        title="CyberteksIT office location"
                        src="https://www.google.com/maps?q=Buganda%20Rd%2C%20Kampala%2C%20Uganda&output=embed"
                        className="absolute inset-0 h-full w-full border-0"
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
                <a
                    href="https://www.google.com/maps/search/?api=1&query=Buganda+Rd,+Kampala,+Uganda"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center text-xs font-semibold text-primary-blue hover:text-primary-red"
                >
                  Open in Google Maps
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>
  );
};

export default Contact;
