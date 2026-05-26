import React from 'react';
import { Smartphone, Scale, ShieldCheck, Landmark } from 'lucide-react';

const services = [
  {
    title: 'German SIM Card',
    description: 'Pre-activated SIM with data plans ready upon arrival.',
    icon: <Smartphone className="w-6 h-6 text-gray-600" />,
  },
  {
    title: 'City Registration',
    description: 'Anmeldung appointment booking and documentation support.',
    icon: <Scale className="w-6 h-6 text-gray-600" />,
  },
  {
    title: 'Health Insurance Setup',
    description: 'Comparison and enrollment into public or private insurance.',
    icon: <ShieldCheck className="w-6 h-6 text-gray-600" />,
  },
  {
    title: 'Bank Account Opening',
    description: 'Guided appointment at a partner bank for fast setup.',
    icon: <Landmark className="w-6 h-6 text-gray-600" />,
  },
];

const RelocationServices = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-sm font-semibold tracking-wide text-gray-500 uppercase mb-4">
            Popular Services
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Beyond Housing: Complete Relocation Support
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
            We don't just provide apartments. We ensure your employees have everything they need to settle in smoothly from day one.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="p-8 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col gap-6"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
                {service.icon}
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelocationServices;
