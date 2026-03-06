import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Hero3DBackground from '../components/Hero3DBackground';
import globeImg from '/assets/globe.jpg';
import aisLogo from '/assets/ais-logo-442b3d04-0952-42d1-932b-50ecf1f2fc85.png';
import shreeLogo from '/assets/shree-logo-0357acdd-2e85-44eb-9f80-00463f5c3c53.png';
import visionFundLogo from '/assets/vision-fund-8cfd48bb-2f07-4959-8e0c-165dda14ea28.png';
import autoMotoLogo from '/assets/auto-moto-logo-b106b519-3fb4-4891-9111-b33bb4ccc086.png';
import futureOptionsLogo from '/assets/future-options-8864786f-c7d2-44f3-b1d4-07254ef2a212.png';
import daoMarbleLogo from '/assets/dao-marble-logo-a1f1e271-7ba4-4ceb-a8c0-ddbb6a3bbaff.png';
import sanaaConsultingLogo from '/assets/sanaa-consulting-3a639a2d-4c5b-4c90-8432-c968ba9afec8.png';
import dembeTradingLogo from '/assets/dembe-trading-logo-3bb90707-7558-4b87-b614-8da2eecfc5ee.png';
import krishnaConstructionLogo from '/assets/krishna-construction-logo-e634ca34-80d6-440a-a1a6-5ad2f3953962.png';

const benefits = [
  {
    title: 'Global Remote Support',
    description: 'Access expert ICT support from anywhere in the world — 24/7, secure and reliable.',
    tag: 'Remote-first'
  },
  {
    title: 'Skilled ICT Experts',
    description: 'Certified professionals across infrastructure, cybersecurity, networking, and modern software.',
    tag: 'Expert team'
  },
  {
    title: 'Secure & Reliable Systems',
    description: 'Security and resilience baked into every solution, from endpoint to cloud.',
    tag: 'Security-led'
  },
  {
    title: 'Innovation-Driven Solutions',
    description: 'From AI to automation, we design ICT systems that move businesses forward.',
    tag: 'Innovation'
  }
];

const companyLogos = [
  { src: aisLogo, alt: 'AIS' },
  { src: shreeLogo, alt: 'Shree' },
  { src: visionFundLogo, alt: 'Vision Fund' },
  { src: autoMotoLogo, alt: 'Auto Moto' },
  { src: futureOptionsLogo, alt: 'Future Options' },
  { src: daoMarbleLogo, alt: 'DAO Marble' },
  { src: sanaaConsultingLogo, alt: 'Sanaa Consulting' },
  { src: dembeTradingLogo, alt: 'Dembe Trading' },
  { src: krishnaConstructionLogo, alt: 'Krishna Construction' }
];

const servicesShortcuts = [
  {
    title: 'Remote IT Support',
    description: 'Proactive, always-on remote IT support for distributed teams.',
    href: '/services#remote-it-support'
  },
  {
    title: 'CCTV & Surveillance',
    description: 'Intelligent monitoring with secure, scalable infrastructure.',
    href: '/services#cctv'
  },
  {
    title: 'VOIP & Collaboration',
    description: 'Crystal-clear communication solutions tailored to modern teams.',
    href: '/services#voip'
  },
  {
    title: 'Software, Web & AI',
    description: 'Custom software, web platforms, and AI integrations.',
    href: '/services#software-ai'
  }
];

const testimonials = [
  {
    quote:
      'From designing our website to integrating AI-powered customer service tools, Cyberteks-it delivered beyond our expectations. The turnaround time and support time and support were simply outstanding.',
    name: 'Khalid A',
    role: 'Founder, DUBAI'
  },
  {
    quote:
      'Thanks Cyberteks-IT, we now have a fully remote managed biometric access control system across all our properties. Their team guided us through everything from setup to training - all done virtually.',
    name: 'Rita N',
    role: 'Facilities manager, Mombasa '
  },
  {
    quote:
      'We needed custom IT training for staff across different locations.\n Cyberteks-It handled i entirely online and made it highly interactive and practical. our team is now more confident tech-savvy.',
    name: 'Joan k',
    role: 'Program Director, kampala'
  },
  {
    quote:
        'When our servers went down during a critical project, Cyberteks-',
    name: 'Mike T',
    role: 'Facilities manager, Mombasa '
  },
  {
    quote:
        'We needed custom IT training for staff across different locations.\n Cyberteks-It handled i entirely online and made it highly interactive and practical. our team is now more confident tech-savvy.',
    name: 'Joan k',
    role: 'Program Director, kampala'
  }
];

const Home = () => {
  return (
    <div className="smooth-scroll-container">
      <section className="relative min-h-[78vh] overflow-hidden border-b border-slate-200 bg-white pb-16 pt-24 md:pt-24">
        <div className="pointer-events-none absolute inset-0 dot-pattern opacity-90" />
        <div
          className="absolute -right-20 top-16 h-44 w-44 rounded-full bg-primary-blue/12"
          data-parallax
          data-speed="0.35"
        />
        <div
          className="absolute -left-14 bottom-8 h-36 w-36 rounded-full bg-primary-red/12"
          data-parallax
          data-speed="0.25"
        />
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 md:flex-row md:items-center md:px-6 lg:px-8">
          <div className="relative z-10 flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-red" />
              Remote-first, security-led ICT partner
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="font-heading text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.2rem]"
            >
              Future-Ready ICT Solutions —{' '}
              <span className="text-primary-blue">Anytime, Anywhere</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
              className="max-w-xl text-base text-slate-700 sm:text-lg"
            >
              CyberteksIT delivers remote and on-site ICT solutions that keep your business secure,
              resilient, and connected — whether your teams are across town or across the globe.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.18 }}
              className="flex flex-wrap items-center gap-3"
            >
              <Link
                to="/get-started"
                className="inline-flex items-center justify-center rounded-full bg-primary-blue px-7 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-primary-red"
              >
                Get Started
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:border-slate-300"
              >
                View Services
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.24 }}
              className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500"
            >
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                24/7 remote monitoring
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                On-site support when it matters
              </div>
            </motion.div>
          </div>

          <div className="relative flex flex-1 justify-center">
            <div className="relative h-[340px] w-full max-w-lg">
              <div className="absolute inset-0 -z-10 rounded-[2.4rem] border-2 border-slate-300 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.15)]" />
              <Hero3DBackground />
              <div className="relative z-10 flex h-full flex-col justify-between p-6">
                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                    Live Operations
                  </p>
                  <p className="text-sm font-medium text-slate-900">
                    Monitoring networks, endpoints &amp; infrastructure in real time.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700">
                      Uptime
                      <p className="mt-1 text-base font-semibold text-emerald-500">99.98%</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700">
                      Avg. Response
                      <p className="mt-1 text-base font-semibold text-slate-900">7 min</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700">
                      Regions
                      <p className="mt-1 text-base font-semibold text-slate-900">30+</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Secure-by-design remote infrastructure with optional on-site presence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:items-center" data-reveal>
            <div>
              <h2 className="font-heading text-2xl font-semibold tracking-tight text-slate-900">
                Why choose <span className="text-primary-blue">Cyberteks-<span className="text-primary-red">IT</span></span>
              </h2>
              <p className="mt-4 max-w-2xl text-base text-slate-700 sm:text-lg">
                Operating mainly online, we remove the constraints of physical presence, delivering flexible,
                scalable IT support that adapts to your business demands. Our remote-first approach ensures minimal
                downtime and maximum convenience.
              </p>
              <p className="mt-4 max-w-2xl text-base text-slate-700 sm:text-lg">
                Our commitment is built on <span className="font-semibold text-primary-red">Integrity</span>,{' '}
                <span className="font-semibold text-primary-red">Customer Focus</span> and{' '}
                <span className="font-semibold text-primary-red">Honesty</span>. We value your trust and strive to
                deliver prompt solutions that keep your business moving forward.
              </p>
            </div>
            <div className="flex justify-center md:justify-end">
              <div className="overflow-hidden rounded-3xl">
                <img src={globeImg} alt="Global reach" className="h-72 w-72 object-cover spin-globe" />
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((item) => (
              <div
                key={item.title}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm transition hover:-translate-y-1 hover:border-primary-blue/40 hover:bg-white hover:shadow-md"
                data-reveal
              >
                <span className="inline-flex w-fit rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                  {item.tag}
                </span>
                <h3 className="mt-3 text-sm font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 flex-1 text-xs text-slate-600">{item.description}</p>
                <span className="mt-3 text-[11px] font-medium text-primary-blue group-hover:text-primary-red">
                  Learn more →
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50 py-12 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center" data-reveal>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                Trusted by 100+ companies
              </p>
              <p className="mt-1 text-base text-slate-600">
                From high-growth startups to established enterprises.
              </p>
            </div>
          </div>
          <div className="mt-6 overflow-hidden logo-track" data-reveal>
            <div className="flex animate-scroll gap-16 whitespace-nowrap py-4">
              {[...companyLogos, ...companyLogos].map((logo, idx) => (
                <img
                  key={`${logo.alt}-${idx}`}
                  src={logo.src}
                  alt={logo.alt}
                  className="h-16 w-auto object-contain opacity-50 hover:opacity-100 hover:animate-none filter grayscale hover:grayscale-0"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between" data-reveal>
            <div>
              <h2 className="font-heading text-2xl font-semibold tracking-tight text-slate-900">
                Client testimonials
              </h2>
              <p className="mt-2 max-w-xl text-sm text-slate-600">
                Teams around the world rely on CyberteksIT to keep their infrastructure stable,
                secure, and future-ready.
              </p>
            </div>
          </div>

          <div className="testimonial-wrapper mt-8 overflow-hidden">
            <div className="testimonial-track flex animate-scroll gap-6 whitespace-nowrap">
              {[...testimonials, ...testimonials].map((testimonial, idx) => (
                <div
                  key={`${testimonial.name}-${idx}`}
                  className="inline-flex h-full min-h-[260px] min-w-[300px] sm:min-w-[340px] lg:min-w-[380px] max-w-md flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-6 text-base text-slate-700 shadow-sm transition hover:-translate-y-1 hover:border-primary-blue/60 hover:bg-primary-blue/5 hover:shadow-md"
                  data-reveal
                >
                  <p className="flex-1 whitespace-normal break-words hyphens-auto text-sm leading-relaxed sm:text-base">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="mt-4">
                  <p className="text-sm font-semibold text-primary-blue sm:text-base">{testimonial.name}</p>
                  <p className="text-xs text-primary-red sm:text-sm">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between" data-reveal>
            <div>
              <h2 className="font-heading text-2xl font-semibold tracking-tight text-slate-900">
                Explore our key services
              </h2>
              <p className="mt-2 max-w-xl text-sm text-slate-600">
                Shortcuts to the services organisations choose most often when partnering with CyberteksIT.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {servicesShortcuts.map((service) => (
              <Link
                key={service.title}
                to={service.href}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm transition hover:-translate-y-1 hover:border-primary-blue/40 hover:shadow-md"
                data-reveal
              >
                <h3 className="text-sm font-semibold text-slate-900">{service.title}</h3>
                <p className="mt-2 flex-1 text-xs text-slate-600">{service.description}</p>
                <span className="mt-3 text-[11px] font-medium text-primary-blue group-hover:text-primary-red">
                  View service →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
