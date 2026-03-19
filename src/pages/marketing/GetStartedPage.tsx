import { ArrowRight } from 'lucide-react';

export default function GetStartedPage() {
  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs font-bold text-primary-blue uppercase tracking-[0.15em] mb-3">Remote IT Support</p>
        <h1 className="font-display text-4xl font-extrabold text-gray-900 mb-4">Request IT Support</h1>
        <p className="text-gray-500 text-lg mb-8">
          Our certified technicians respond within 30 minutes. Fill in your details and we'll get back to you right away.
        </p>
        <a
          href="tel:+256779367005"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-blue text-white font-bold rounded-lg hover:bg-blue-900 transition-all"
        >
          Call +256 779 367 005
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
