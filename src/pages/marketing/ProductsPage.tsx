export default function ProductsPage() {
  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-bold text-primary-blue uppercase tracking-[0.15em] mb-3">Products</p>
        <h1 className="font-display text-4xl font-extrabold text-gray-900 mb-6">Our Products</h1>
        <p className="text-gray-500 text-lg leading-relaxed">
          CyberteksIT offers a range of hardware and software products for businesses across Uganda.
          Contact us at <a href="mailto:info@cyberteks-it.com" className="text-primary-blue hover:underline">info@cyberteks-it.com</a> for a product catalogue.
        </p>
      </div>
    </div>
  );
}
