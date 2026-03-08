import React from 'react';
import SectionHeader from '../components/SectionHeader';
import laptopImage from '/assets/laptops-d7d8c876-add9-4f6f-b38f-4b65a259cd24.png';
import biometricsImage from '/assets/biometrics-322f0764-8e24-47f7-baf1-c2b9ae22b0c0.png';
import digitalCameraImage from '/assets/digital-camera-663b7aa4-499a-4b3c-b5d5-c82ab58441a5.png';
import printerScannerImage from '/assets/printer-scanner-7e0709da-c271-4a54-970d-86d77c9daea0.png';
import telecomMastImage from '/assets/telecom-mast-6c76b9fd-1903-419e-a87a-76e309d925d6.png';
import cctvSurveillanceImage from '/assets/cctv-surveillance-systems.jpg';

const products = [
  {
    title: 'Printers & Scanners',
    description: 'Enterprise-ready printing and scanning solutions for secure document workflows.',
    image: printerScannerImage,
    alt: 'Printer and Scanner',
    price: '$420.00',
    oldPrice: '$520.00',
    stock: 'In Stock',
    lead: '2-5 business days',
    support: 'Next-day swap',
    colors: ['#e5e7eb', '#cbd5e1', '#94a3b8', '#0f172a'],
    weights: ['Desktop', 'MFP', 'Mobile']
  },
  {
    title: 'Telecom Masts',
    description: 'Robust telecom mast systems for reliable, high-availability connectivity.',
    image: telecomMastImage,
    alt: 'Telecom Mast',
    price: 'Custom',
    oldPrice: null,
    stock: 'Built to order',
    lead: 'Quote on request',
    support: 'Project-based',
    colors: ['#e5e7eb', '#0f172a'],
    weights: ['20m', '40m', '60m']
  },
  {
    title: 'Desktops & Laptops',
    description: 'Business-grade endpoints configured, secured, and ready for your teams.',
    image: laptopImage,
    alt: 'Desktops and Laptops',
    price: '$750.00',
    oldPrice: '$820.00',
    stock: 'In Stock',
    lead: '5-7 business days',
    support: '3-year support',
    colors: ['#e5e7eb', '#0f172a', '#111827'],
    weights: ['i5 / 8GB', 'i7 / 16GB', 'Ryzen 7 / 32GB']
  },
  {
    title: 'Biometrics',
    description: 'Biometric access control and identity verification devices built for security.',
    image: biometricsImage,
    alt: 'Biometrics',
    price: '$320.00',
    oldPrice: '$360.00',
    stock: 'In Stock',
    lead: '3-6 business days',
    support: 'Install + support',
    colors: ['#0f172a', '#1e293b', '#cbd5e1'],
    weights: ['Single-door', 'Multi-door', 'Enterprise']
  },
  {
    title: 'CCTV Systems',
    description: 'High-availability surveillance kits with storage, remote viewing, and alerting.',
    image: cctvSurveillanceImage,
    alt: 'CCTV Systems',
    price: '$1,500.00',
    oldPrice: '$1,780.00',
    stock: 'In Stock',
    lead: '1-2 weeks',
    support: 'On-site/remote',
    colors: ['#e2e8f0', '#0f172a'],
    weights: ['4 Cam', '8 Cam', '16 Cam']
  },
  {
    title: 'Digital Cameras',
    description: 'High-resolution IP and digital cameras ready for smart monitoring workflows.',
    image: digitalCameraImage,
    alt: 'Digital Cameras',
    price: '$280.00',
    oldPrice: '$320.00',
    stock: 'In Stock',
    lead: '3-5 business days',
    support: 'Remote setup',
    colors: ['#e5e7eb', '#0f172a', '#111827'],
    weights: ['Body', 'Kit', 'Pro Kit']
  }
];

const Products = () => {
  const [activeProduct, setActiveProduct] = React.useState(null);
  const [quantity, setQuantity] = React.useState(1);
  const [selectedColor, setSelectedColor] = React.useState(null);
  const [selectedVariant, setSelectedVariant] = React.useState(null);

  const openProduct = (product) => {
    setActiveProduct(product);
    setQuantity(1);
    setSelectedColor(product.colors?.[0] || null);
    setSelectedVariant(product.weights?.[0] || null);
  };

  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 md:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Products"
          title="Hardware solutions for secure, connected workplaces"
          description="CyberteksIT sources, configures, and supports reliable hardware that integrates seamlessly with your ICT environment."
        />

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <button
              key={product.title}
              type="button"
              onClick={() => openProduct(product)}
              className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-slate-50 p-5 text-base text-slate-700 shadow-sm transition hover:-translate-y-2 hover:border-primary-blue/50 hover:shadow-md"
              data-reveal
            >
              <img
                src={product.image}
                alt={product.alt}
                className="mb-4 h-44 w-full object-cover"
              />
              <h2 className="font-heading text-base font-semibold text-slate-900">
                {product.title}
              </h2>
              <p className="mt-2 flex-1 text-sm text-slate-600">{product.description}</p>
              <span className="mt-3 text-[12px] font-semibold text-primary-blue">
                View details →
              </span>
            </button>
          ))}
        </div>

        <p className="mt-8 text-sm text-slate-600" data-reveal>
          Need a custom bundle? We tailor sourcing, configuration, and deployment to match your
          infrastructure roadmap.
        </p>
      </div>

      {activeProduct ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/70 px-4 py-6 md:items-center md:py-12" role="dialog" aria-modal="true">
          <div className="relative w-full max-w-6xl rounded-3xl bg-white p-4 shadow-2xl ring-1 ring-slate-200 md:p-6 lg:p-8 max-h-[92vh] overflow-y-auto">
            <button
              className="absolute right-4 top-4 rounded-full border border-slate-200 p-2 text-slate-500 hover:text-primary-red"
              onClick={() => setActiveProduct(null)}
              aria-label="Close product details"
            >
              ✕
            </button>

            <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
              <div className="space-y-3">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  <img src={activeProduct.image} alt={activeProduct.alt} className="h-[340px] w-full object-cover sm:h-[420px]" />
                </div>
                <div className="flex gap-3">
                  {[0, 1, 2].map((idx) => (
                    <div
                      key={idx}
                      className="flex-1 overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                    >
                      <img src={activeProduct.image} alt={`${activeProduct.alt} thumb ${idx + 1}`} className="h-20 w-full object-cover" />
                    </div>
                  ))}
                </div>
                {/* removed inline review card under gallery on desktop */}
              </div>

              <div className="space-y-5">
                <div>
                  <h3 className="font-heading text-2xl font-semibold text-slate-900">{activeProduct.title}</h3>
                  <p className="mt-1 text-sm font-semibold text-emerald-600">{activeProduct.stock}</p>
                  <div className="mt-3 flex items-baseline gap-3">
                    <span className="text-2xl font-semibold text-slate-900">{activeProduct.price}</span>
                    {activeProduct.oldPrice ? (
                      <span className="text-sm text-slate-400 line-through">{activeProduct.oldPrice}</span>
                    ) : null}
                  </div>
                  <p className="mt-3 text-sm text-slate-700">{activeProduct.description}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Color</p>
                    <div className="mt-2 flex gap-2">
                      {activeProduct.colors?.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setSelectedColor(c)}
                          className={`h-8 w-8 rounded-full border-2 ${
                            selectedColor === c ? 'border-primary-blue ring-2 ring-primary-blue/40' : 'border-slate-200'
                          }`}
                          style={{ background: c }}
                          aria-label={`Color ${c}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Variant</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {activeProduct.weights?.map((w) => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => setSelectedVariant(w)}
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                            selectedVariant === w ? 'border-primary-blue bg-primary-blue/10 text-primary-blue' : 'border-slate-200 text-slate-700'
                          }`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-[auto_1fr] sm:items-center">
                  <div className="flex items-center rounded-full border border-slate-200 px-3 py-2">
                    <button
                      type="button"
                      className="px-2 text-lg text-slate-600"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    >
                      –
                    </button>
                    <span className="min-w-[36px] text-center text-sm font-semibold text-slate-900">{quantity}</span>
                    <button
                      type="button"
                      className="px-2 text-lg text-slate-600"
                      onClick={() => setQuantity((q) => q + 1)}
                    >
                      +
                    </button>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
                    <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 hover:border-primary-blue hover:text-primary-blue">
                      Request Installation
                    </button>
                    <button className="rounded-full bg-primary-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-red">
                      Schedule a Call
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 rounded-xl border border-slate-200 p-3 text-sm text-slate-700 sm:grid-cols-3">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Support</p>
                    <p className="font-semibold text-slate-900">{activeProduct.support}</p>
                    <p className="text-xs text-slate-500">Remote & on-site options.</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Lead Time</p>
                    <p className="font-semibold text-slate-900">{activeProduct.lead}</p>
                    <p className="text-xs text-slate-500">Fast-track available.</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Warranty</p>
                    <p className="font-semibold text-slate-900">12–36 months</p>
                    <p className="text-xs text-slate-500">Coverage varies by bundle.</p>
                  </div>
                </div>

                {/* Rating UI removed per request */}

                <div className="flex justify-end">
                  <button className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:border-primary-blue hover:text-primary-blue" onClick={() => setActiveProduct(null)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default Products;
