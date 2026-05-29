import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Scale, ShieldCheck, Landmark } from 'lucide-react';

const services = [
  {
    title: 'German SIM Card',
    description: 'Pre-activated SIM with data plans ready upon arrival.',
    icon: <Smartphone className="w-7 h-7" />,
  },
  {
    title: 'City Registration',
    description: 'Anmeldung appointment booking and documentation support.',
    icon: <Scale className="w-7 h-7" />,
  },
  {
    title: 'Health Insurance Setup',
    description: 'Comparison and enrollment into public or private insurance.',
    icon: <ShieldCheck className="w-7 h-7" />,
  },
  {
    title: 'Bank Account Opening',
    description: 'Guided appointment at a partner bank for fast setup.',
    icon: <Landmark className="w-7 h-7" />,
  },
];

const RelocationServices = () => {
  return (
    <section className="py-28 bg-[#f5f5f3] relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#0f4c3a]/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20 max-w-2xl mx-auto flex flex-col items-center"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="h-px w-8 bg-gray-300" />
            <span className="text-[11px] font-semibold text-gray-400 tracking-[0.2em] uppercase">Popular Services</span>
            <span className="h-px w-8 bg-gray-300" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-normal text-gray-900 mb-5 text-center">
            Beyond Housing:{' '}
            <em className="italic font-serif text-[#0f4c3a]">Complete Relocation Support.</em>
          </h2>
          <p className="text-base md:text-lg text-gray-500 max-w-2xl leading-relaxed mx-auto">
            We don't just provide apartments. We ensure your employees have everything they need to settle in smoothly from day one.
          </p>
        </motion.div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="relative group h-full"
            >
              <div className="bg-white rounded-2xl p-8 transition-all duration-500 flex flex-col items-center text-center landing-card-hover h-full">
                {/* Icon */}
                <div className="w-14 h-14 rounded-full border border-gray-300 flex items-center justify-center mb-6 text-gray-600 group-hover:bg-[#0f4c3a] group-hover:border-[#0f4c3a] group-hover:text-white transition-all duration-500">
                  {service.icon}
                </div>
                <h4 className="font-serif text-2xl font-normal text-gray-900 mb-3">{service.title}</h4>
                <div className="w-8 h-px bg-gray-300 mb-3" />
                <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelocationServices;
