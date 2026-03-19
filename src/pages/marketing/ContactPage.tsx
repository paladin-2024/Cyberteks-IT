import { MapPin, Phone, Mail } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-bold text-primary-blue uppercase tracking-[0.15em] mb-3">Contact</p>
        <h1 className="font-display text-4xl font-extrabold text-gray-900 mb-10">Get in Touch</h1>
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="flex gap-4">
              <MapPin className="w-5 h-5 text-primary-blue mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">Address</p>
                <p className="text-gray-500 text-sm mt-1">Plot 15, Nakasero Road, Kampala, Uganda</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Phone className="w-5 h-5 text-primary-blue mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">Phone</p>
                <a href="tel:+256779367005" className="text-gray-500 text-sm mt-1 block hover:text-primary-blue">+256 779 367 005 (MTN)</a>
                <a href="tel:+256706911732" className="text-gray-500 text-sm block hover:text-primary-blue">+256 706 911 732 (Airtel)</a>
              </div>
            </div>
            <div className="flex gap-4">
              <Mail className="w-5 h-5 text-primary-blue mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">Email</p>
                <a href="mailto:info@cyberteks-it.com" className="text-gray-500 text-sm mt-1 block hover:text-primary-blue">info@cyberteks-it.com</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
