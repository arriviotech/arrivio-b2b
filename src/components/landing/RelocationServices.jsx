import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Scale, ShieldCheck, Landmark } from 'lucide-react';

const services = [
  {
    title: 'German SIM Card',
    description: 'Pre-activated SIM with data plans ready upon arrival.',
    icon: <Smartphone className="w-6 h-6" />,
  },
  {
    title: 'City Registration',
    description: 'Anmeldung appointment booking and documentation support.',
    icon: <Scale className="w-6 h-6" />,
  },
  {
    title: 'Health Insurance Setup',
    description: 'Comparison and enrollment into public or private insurance.',
    icon: <ShieldCheck className="w-6 h-6" />,
  },
  {
    title: 'Bank Account Opening',
    description: 'Guided appointment at a partner bank for fast setup.',
    icon: <Landmark className="w-6 h-6" />,
  },
];

const RelocationServices = () => {
  return (
    <section className="py-28 bg-gradient-to-b from-white to-[#f7f9f8] relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#0f4c3a]/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#0f4c3a]/15 bg-[#0f4c3a]/[0.04] mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0f4c3a]" />
            <span className="text-[11px] font-semibold text-[#0f4c3a] tracking-[0.12em] uppercase">Popular Services</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
            Beyond Housing:{' '}
            <span className="bg-gradient-to-r from-[#0f4c3a] to-[#186b53] bg-clip-text text-transparent">Complete Relocation Support</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl leading-relaxed">
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
              className="group p-8 rounded-3xl border border-gray-100 bg-white transition-all duration-500 flex flex-col gap-6 relative overflow-hidden landing-card-hover"
            >
              {/* Animated top border on hover */}
              <div className="absolute top-0 left-0 h-[3px] w-0 bg-gradient-to-r from-[#0f4c3a] to-[#D4A017] group-hover:w-full transition-all duration-700 rounded-full" />
              
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-[#f4f7f6] border border-gray-100 flex items-center justify-center text-[#0f4c3a] group-hover:bg-[#0f4c3a]/5 group-hover:border-[#0f4c3a]/10 transition-all duration-500 group-hover:scale-110">
                {service.icon}
              </div>

              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">
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
