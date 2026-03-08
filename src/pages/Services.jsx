import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SectionHeader from '../components/SectionHeader';
import remoteImg from '/assets/remote-it-support.jpg';
import accessImg from '/assets/access-control-systems.jpg';
import cctvImg from '/assets/cctv-surveillance-systems.jpg';
import voipImg from '/assets/voip-solutions.jpg';
import ictImg from '/assets/ict-skilling-capacity-building.jpg';
import laptopImage from '/assets/laptops-d7d8c876-add9-4f6f-b38f-4b65a259cd24.png';

const services = [
  {
    id: 'remote-it-support',
    title: 'Remote IT Support',
    description:
      'Always-on, remote-first support for your users, endpoints and infrastructure — with proactive monitoring and rapid incident response.',
    image: remoteImg
  },
  {
    id: 'access-control',
    title: 'Access Control Systems',
    description:
      'Design, deployment and maintenance of access control systems that keep your spaces secure while staying user-friendly.',
    image: accessImg
  },
  {
    id: 'cctv',
    title: 'CCTV & Surveillance Systems',
    description:
      'Intelligent, high-availability surveillance solutions with secure storage, remote viewing and integrated alerting.',
    image: cctvImg
  },
  {
    id: 'voip',
    title: 'VOIP Solutions',
    description:
      'Cloud-based communication platforms, VOIP systems and collaboration tooling tailored to distributed and hybrid teams.',
    image: voipImg
  },
  {
    id: 'ict-skilling',
    title: 'Online Skilling & Capacity Building',
    description:
      'Live, instructor-led and on-demand programs that upskill teams and individuals on modern ICT and emerging tech.',
    image: ictImg
  },
  {
    id: 'software-ai',
    title: 'Software, Web Design & AI Solutions',
    description:
      'Modern web platforms, internal tools and AI-driven solutions that integrate securely with your existing systems.',
    image: laptopImage
  }
];

const Services = () => {
  return (
    <section className="bg-slate-50 py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Services"
          title="Remote-first ICT services, supported on-site when you need it"
          description="CyberteksIT brings together the capabilities organisations need most — from day-to-day support to long-term infrastructure and innovation projects."
        />

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <motion.article
              key={service.id}
              id={service.id}
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18 }}
              className="group flex h-full scroll-mt-24 flex-col rounded-2xl border border-slate-200 bg-white p-5 text-base text-slate-700 shadow-sm transition hover:border-primary-blue/40 hover:shadow-md"
              data-reveal
            >
              <div className="relative overflow-hidden rounded-xl">
                <img src={service.image} alt={service.title} className="h-36 w-full object-cover" />
                <div className="absolute inset-0 bg-black/15" />
              </div>
              <h2 className="mt-3 font-heading text-base font-semibold text-slate-900">
                {service.title}
              </h2>
              <p className="mt-2 flex-1 text-sm text-slate-600">{service.description}</p>
              {service.id === 'ict-skilling' ? (
                <div className="mt-3 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                  <p className="text-sm text-slate-700">
                    Immersive online programs with labs, mentoring, and certification support tailored for teams and individuals.
                  </p>
                  <p className="text-sm font-semibold text-slate-900">Programs</p>
                  <select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-primary-blue/20 focus:ring-2">
                    {[ 'Prompt Engineering', 'Augmented Reality', 'Virtual Reality', 'AI & Robotics', 'Website Design', 'Graphic Design & Programming', 'Videography & Photography', 'IT Fundamentals & Digital Literacy', 'Database Programming', 'Office Packages', 'Power BI & Data Analytics', 'Cyber Security', 'Computer Networking' ].map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                  <div className="space-y-1 text-xs text-slate-600">
                    <p className="font-semibold text-slate-900">Who we train</p>
                    <ul className="space-y-1">
                      <li>University and college students</li>
                      <li>Working professionals seeking career growth</li>
                      <li>Corporate teams and departments</li>
                      <li>Schools and academic institutions</li>
                      <li>NGOs and government agencies</li>
                    </ul>
                  </div>
                  <div className="space-y-1 text-xs text-slate-600">
                    <p className="font-semibold text-slate-900">Tracks</p>
                    <ul className="space-y-1">
                      <li>Corporate training</li>
                      <li>P7, S4, S6 vacation programs</li>
                      <li>ICT skilling for general</li>
                    </ul>
                  </div>
                  <p className="text-xs text-slate-600">
                    Flexible online and hybrid delivery with labs, assessments, and certification support.
                  </p>
                </div>
              ) : null}
              <div className="mt-3 flex items-center gap-3">
                <Link
                  to={`/services/${service.id}`}
                  className="text-[12px] font-semibold text-primary-blue hover:text-primary-red"
                >
                  Learn more →
                </Link>
                <Link
                  to="/contact"
                  className="text-[12px] font-semibold text-primary-blue hover:text-primary-red"
                >
                  Talk to us →
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
