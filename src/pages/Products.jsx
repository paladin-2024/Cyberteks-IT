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
    alt: 'Printer and Scanner'
  },
  {
    title: 'Telecom Masts',
    description: 'Robust telecom mast systems for reliable, high-availability connectivity.',
    image: telecomMastImage,
    alt: 'Telecom Mast'
  },
  {
    title: 'Desktops & Laptops',
    description: 'Business-grade endpoints configured, secured, and ready for your teams.',
    image: laptopImage,
    alt: 'Desktops and Laptops'
  },
  {
    title: 'Biometrics',
    description: 'Biometric access control and identity verification devices built for security.',
    image: biometricsImage,
    alt: 'Biometrics'
  },
  {
    title: 'CCTV Systems',
    description: 'High-availability surveillance kits with storage, remote viewing, and alerting.',
    image: cctvSurveillanceImage,
    alt: 'CCTV Systems'
  },
  {
    title: 'Digital Cameras',
    description: 'High-resolution IP and digital cameras ready for smart monitoring workflows.',
    image: digitalCameraImage,
    alt: 'Digital Cameras'
  }
];

const detailMap = {
  'Printers & Scanners': { price: 'From $420', sla: 'Next-day swap', lead: '2-5 business days' },
  'Telecom Masts': { price: 'Custom', sla: 'Project-based', lead: 'Quote on request' },
  'Desktops & Laptops': { price: 'From $750', sla: '3-year support', lead: '5-7 business days' },
  Biometrics: { price: 'From $320', sla: 'Install + support', lead: '3-6 business days' },
  'CCTV Systems': { price: 'From $1,500', sla: 'On-site/remote', lead: '1-2 weeks' },
  'Digital Cameras': { price: 'From $280', sla: 'Remote setup', lead: '3-5 business days' }
};

const Products = () => {
  const [activeProduct, setActiveProduct] = React.useState(null);

  const activeDetails = activeProduct ? detailMap[activeProduct] : null;

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
              onClick={() => setActiveProduct(product.title)}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-heading text-lg font-semibold text-slate-900">{activeProduct}</h3>
                <p className="mt-1 text-sm text-slate-600">Detailed specs & commercial info.</p>
              </div>
              <button
                className="rounded-full border border-slate-200 p-2 text-slate-500 hover:text-primary-red"
                onClick={() => setActiveProduct(null)}
                aria-label="Close product details"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700">
              <p><span className="font-semibold text-slate-900">Price:</span> {activeDetails?.price || 'Custom quote'}</p>
              <p className="mt-2"><span className="font-semibold text-slate-900">Support:</span> {activeDetails?.sla || 'Varies by bundle'}</p>
              <p className="mt-2"><span className="font-semibold text-slate-900">Lead time:</span> {activeDetails?.lead || 'On request'}</p>
              <p className="mt-3 text-xs text-slate-500">Contact us for full datasheets, installation scope, and SLAs.</p>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button
                className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:border-primary-blue hover:text-primary-blue"
                onClick={() => setActiveProduct(null)}
              >
                Close
              </button>
              <button className="rounded-full bg-primary-blue px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primary-red">
                Request quote
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default Products;
