import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Phone, Mail, ShoppingCart, Package } from 'lucide-react';

const PRODUCTS = [
  {
    category: 'Computers & Laptops',
    image: '/assets/laptop.jpg',
    desc: 'Business laptops and desktop computers from leading brands — Dell, HP, Lenovo, and more. Pre-configured and ready to deploy.',
    items: ['Dell Latitude Business Series', 'HP ProBook & EliteBook', 'Lenovo ThinkPad L & E Series', 'Desktop All-in-One Systems', 'Refurbished & Budget Options'],
    badge: 'Best Seller',
    badgeColor: 'bg-[#E11D48] text-white',
  },
  {
    category: 'CCTV Cameras & DVRs',
    image: '/assets/cctv-surveillance-systems.jpg',
    desc: 'Full range of IP and analogue cameras, NVRs, DVRs, and accessories for residential and commercial surveillance.',
    items: ['Hikvision & Dahua IP Cameras', '4K Ultra HD Systems', 'Wireless & PoE Cameras', 'Network Video Recorders (NVR)', 'CCTV Accessories & Cables'],
    badge: 'Security',
    badgeColor: 'bg-blue-600 text-white',
  },
  {
    category: 'Biometric Systems',
    image: '/assets/access-control-systems.jpg',
    desc: 'Fingerprint, face recognition, and card-based access control devices for attendance and security management.',
    items: ['ZKTeco Biometric Terminals', 'Face Recognition Devices', 'RFID Card Readers', 'Electric Door Locks & Strikes', 'Turnstile Gate Systems'],
    badge: 'Access Control',
    badgeColor: 'bg-emerald-600 text-white',
  },
  {
    category: 'VoIP Phones & Equipment',
    image: '/assets/voip-solutions.jpg',
    desc: 'IP desk phones, conference phones, and PBX systems for modern business communication.',
    items: ['Yealink IP Desk Phones', 'Grandstream Conference Phones', 'IP PBX Phone Systems', 'VoIP Headsets & Adaptors', 'PoE Network Switches'],
    badge: 'Communications',
    badgeColor: 'bg-violet-600 text-white',
  },
  {
    category: 'Printers & Scanners',
    image: '/assets/remote-it-support.jpg',
    desc: 'Laser and inkjet printers, multifunction devices, and document scanners for offices of all sizes.',
    items: ['HP & Canon Laser Printers', 'Multifunction Printer/Scanner/Copier', 'Label & Receipt Printers', 'High-Speed Document Scanners', 'Printer Toner & Ink Cartridges'],
    badge: 'Office',
    badgeColor: 'bg-amber-600 text-white',
  },
  {
    category: 'Networking Equipment',
    image: '/assets/remote-it-support.jpg',
    desc: 'Routers, switches, access points, and structured cabling to build reliable and fast business networks.',
    items: ['Mikrotik & Ubiquiti Routers', 'Managed & Unmanaged Switches', 'Wireless Access Points (WAP)', 'Network Cables & Patch Panels', 'Fibre Optic Equipment'],
    badge: 'Networking',
    badgeColor: 'bg-sky-600 text-white',
  },
];

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-[#023064] pt-12 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(ellipse at 70% 60%, #E11D48 0%, transparent 50%)' }} />
        <div className="max-w-5xl mx-auto relative text-center">
          <span className="inline-block bg-[#E11D48] text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">Product Catalogue</span>
          <h1 className="font-heading text-5xl md:text-6xl font-extrabold text-white mb-5 leading-tight">
            Quality ICT Products
          </h1>
          <p className="text-blue-200 text-xl max-w-2xl mx-auto mb-8">
            Laptops, cameras, biometrics, VoIP phones, printers, and networking gear — sourced from trusted brands and delivered across Uganda.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="mailto:info@cyberteks-it.com" className="inline-flex items-center gap-2 bg-[#E11D48] hover:bg-[#be1239] text-white font-bold px-7 py-3.5 rounded-xl transition-colors">
              <ShoppingCart className="w-4 h-4" /> Get a Quote
            </a>
            <a href="tel:+256779367005" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors">
              <Phone className="w-4 h-4" /> Call to Order
            </a>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#E11D48] text-xs font-bold uppercase tracking-widest">What We Stock</span>
            <h2 className="font-heading text-3xl font-bold text-gray-900 mt-2">Our Product Range</h2>
            <p className="text-gray-600 mt-2 max-w-xl mx-auto">All products are available for purchase, installation, and after-sales support. Contact us for current stock and pricing.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PRODUCTS.map((p) => (
              <div key={p.category} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
                <div className="relative h-44 overflow-hidden">
                  <img src={p.image} alt={p.category} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${p.badgeColor}`}>{p.badge}</span>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-heading text-xl font-bold text-gray-900 mb-2">{p.category}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-5">{p.desc}</p>
                  <ul className="space-y-1.5 flex-1">
                    {p.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-gray-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#023064] shrink-0 mt-0.5" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Order */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[#E11D48] text-xs font-bold uppercase tracking-widest">Easy Ordering</span>
          <h2 className="font-heading text-3xl font-bold text-gray-900 mt-2 mb-4">How to Get Products</h2>
          <p className="text-gray-600 mb-12 max-w-xl mx-auto">We make it simple to get the products you need — with delivery and installation across Uganda.</p>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Contact Us', desc: 'Call, email, or WhatsApp us with your requirements and quantity.' },
              { step: '02', title: 'Get a Quote', desc: 'We\'ll send a detailed quote with current pricing and availability.' },
              { step: '03', title: 'Delivery & Setup', desc: 'Your products are delivered and our team handles installation.' },
            ].map((s) => (
              <div key={s.step} className="p-6 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                <div className="font-heading text-4xl font-extrabold text-[#E11D48] mb-3">{s.step}</div>
                <h3 className="font-heading text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Strip */}
      <section className="py-14 px-6 bg-[#023064]">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h2 className="font-heading text-2xl font-bold text-white mb-1">Ready to order?</h2>
            <p className="text-blue-200">Contact us today for current stock, pricing, and delivery options.</p>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="tel:+256779367005" className="inline-flex items-center gap-2 bg-white text-[#023064] font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors">
              <Phone className="w-4 h-4" /> +256 779 367 005
            </a>
            <a href="mailto:info@cyberteks-it.com" className="inline-flex items-center gap-2 bg-[#E11D48] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#be1239] transition-colors">
              <Mail className="w-4 h-4" /> Email Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
