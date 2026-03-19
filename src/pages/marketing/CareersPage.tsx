export default function CareersPage() {
  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-bold text-primary-blue uppercase tracking-[0.15em] mb-3">Careers</p>
        <h1 className="font-display text-4xl font-extrabold text-gray-900 mb-6">Work With Us</h1>
        <p className="text-gray-500 text-lg leading-relaxed mb-10">
          We're always looking for talented, passionate ICT professionals to join our team. Send your CV and cover letter to{' '}
          <a href="mailto:careers@cyberteks-it.com" className="text-primary-blue hover:underline">careers@cyberteks-it.com</a>.
        </p>
        <div className="border border-gray-200 rounded-xl p-6 text-center text-gray-400">
          No open positions at the moment. Check back soon.
        </div>
      </div>
    </div>
  );
}
