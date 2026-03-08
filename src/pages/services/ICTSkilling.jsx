import React from 'react';
import ictImg from '/assets/ict-skilling-capacity-building.jpg';

const tracks = [
  'Corporate upskilling: cyber, cloud, data, automation',
  'Vacation bootcamps: P7, S4, S6 cohorts',
  'Career switch programs: web, AI, DevOps',
  'Leadership & digital transformation workshops'
];

const formats = [
  { title: 'Live online', detail: 'Instructor-led sessions with labs and breakout rooms.' },
  { title: 'Hybrid', detail: 'On-site kickoffs + virtual labs and mentoring.' },
  { title: 'Self-paced', detail: 'Recorded lessons, quizzes, and capstones with TA support.' }
];

const gallery = [ictImg, ictImg, ictImg];

const ICTSkilling = () => (
  <section className="bg-white py-14 sm:py-16">
    <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-blue">Service</p>
          <h1 className="font-heading text-3xl font-semibold text-slate-900">Online Skilling & Capacity Building</h1>
          <p className="text-base text-slate-700">
            Programs that blend live instruction, hands-on labs, mentoring, and certification prep—tailored to teams and individuals.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {tracks.map((item) => (
              <div key={item} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                {item}
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Delivery formats</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {formats.map((s) => (
                <div key={s.title} className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-sm font-semibold text-slate-900">{s.title}</p>
                  <p className="mt-1 text-xs text-slate-600">{s.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <img src={ictImg} alt="ICT Skilling" className="h-full max-h-[360px] w-full rounded-2xl object-cover shadow" />
          <div className="grid grid-cols-3 gap-3">
            {gallery.map((src, i) => (
              <img key={i} src={src} alt={`ICT skilling ${i + 1}`} className="h-24 w-full rounded-xl object-cover border border-slate-200" />
            ))}
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">Outcomes</p>
            <ul className="mt-2 space-y-1 text-xs text-slate-600">
              <li>• Capstone projects mapped to real environments</li>
              <li>• Certification coaching (CompTIA, AWS, Azure, Cisco)</li>
              <li>• Job-ready portfolios and interview prep</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default ICTSkilling;
