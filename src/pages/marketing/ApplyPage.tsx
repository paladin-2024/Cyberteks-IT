import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function ApplyPage() {
  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs font-bold text-primary-blue uppercase tracking-[0.15em] mb-3">Apply Now</p>
        <h1 className="font-display text-4xl font-extrabold text-gray-900 mb-4">Skills Development Program</h1>
        <p className="text-gray-500 text-lg mb-8">
          Join our industry-aligned training programs and launch your ICT career. Applications are reviewed within 2–3 business days.
        </p>
        <a
          href="mailto:info@cyberteks-it.com?subject=Training Application"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-blue text-white font-bold rounded-lg hover:bg-blue-900 transition-all"
        >
          Email Your Application
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
