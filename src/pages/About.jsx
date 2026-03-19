import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '../components/SectionHeader';

const highlights = [
  {
    title: 'Vision',
    description:
      'To be the world’s leading Remote ICT Support Company, empowering businesses everywhere with technology that works, anytime and anywhere.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
        />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )
  },
  {
    title: 'Mission',
    description:
      'To provide reliable, innovative, and secure ICT solutions that keep businesses running — anywhere, anytime.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20M5 7h14M7.5 7l1.8 4.5H6.7l.8-4.5ZM15.7 11.5l1.8-4.5H15l.7 4.5Z" />
      </svg>
    )
  },
  {
    title: 'Delivery Model',
    description:
      'Remote-first support paired with on-site execution for projects that require hands-on expertise.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h10M4 18h16" />
        <circle cx="18" cy="12" r="2" />
      </svg>
    )
  }
];

const coreValues = [
  {
    title: 'Integrity',
    description:
      'We do the right thing, always — from how we design systems to how we support teams.'
  },
  {
    title: 'Customer-Centered',
    description:
      'We start with your context, your users, and your outcomes — then design ICT that supports them.'
  },
  {
    title: 'Honesty',
    description:
      'Transparent communication, realistic expectations, and clear recommendations — no jargon, no surprises.'
  },
  {
    title: 'Innovation',
    description:
      'Constantly learning, experimenting, and adopting new technologies that create real, measurable value.'
  }
];

const About = () => {
  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 md:px-6 lg:px-8">
        <SectionHeader
          eyebrow="About Us"
          title="Built to support modern, distributed organisations"
          description="Cyberteks-IT delivers expert remote ICT services and on-site support for projects that demand hands-on execution."
        />

        <div className="mt-8 space-y-6 text-base leading-relaxed text-slate-700" data-reveal>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            Founded on the belief that geography should never limit access to exceptional IT
            support, Cyberteks-IT is a dynamic ICT solutions provider delivering expert remote
            support to clients across the globe. While our core strength lies in virtual ICT
            services — enabling businesses to access reliable, secure, and innovative solutions
            anytime, anywhere — we also recognize that some challenges require a physical presence.
            That’s why our team is equipped to provide on-site support for projects and
            installations that demand hands-on expertise.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 }}
          >
            At Cyberteks-IT, we combine cutting-edge technology, skilled professionals, and a
            customer-first approach to help businesses thrive in today’s fast-paced digital world.
            From remote IT troubleshooting to network infrastructure, cybersecurity, access
            control, CCTV surveillance, VOIP solutions, software development, AI integration, and
            ICT skilling, we deliver solutions that work seamlessly — no matter where our clients
            are.
          </motion.p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              data-reveal
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary-blue shadow-sm">
                {item.icon}
              </div>
              <h2 className="mt-3 font-heading text-sm font-semibold text-slate-900">
                {item.title}
              </h2>
              <p className="mt-2 text-xs text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12" data-reveal>
          <h2 className="font-heading text-lg font-semibold tracking-tight text-slate-900">
            Core values
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            The principles that guide every interaction, solution, and long-term partnership.
          </p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 md:grid-cols-4">
            {coreValues.map((value) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-primary-blue/40 hover:shadow-md"
              >
                <h3 className="text-sm font-semibold text-slate-900">{value.title}</h3>
                <p className="mt-2 text-xs text-slate-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
