import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Users, CreditCard, LayoutDashboard, BarChart3, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: <Search className="w-6 h-6" />,
    title: "View Properties",
    description: "Explore our curated selection of premium enterprise housing solutions."
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Meeting",
    description: "Connect with our team to discuss your specific requirements and scaling needs."
  },
  {
    icon: <CreditCard className="w-6 h-6" />,
    title: "Payment",
    description: "Hassle-free enterprise-grade payment processing and flexible billing."
  },
  {
    icon: <LayoutDashboard className="w-6 h-6" />,
    title: "Allocate & Manage",
    description: "Assign employees to units and coordinate essential relocation services through a centralized hub."
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Track & Report",
    description: "Monitor occupancy rate, service status, and total relocation spend in real-time."
  }
];

const HowItWorks = () => {
  const navigate = useNavigate();
  return (
    <section className="py-28 bg-gradient-to-b from-[#f7f9f8] to-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[10%] right-[5%] w-72 h-72 bg-[#0f4c3a]/[0.03] rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] left-[5%] w-60 h-60 bg-[#D4A017]/[0.04] rounded-full blur-[80px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#0f4c3a]/15 bg-[#0f4c3a]/[0.04] mb-5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#0f4c3a]" />
            <span className="text-[11px] font-semibold text-[#0f4c3a] tracking-[0.12em] uppercase">Streamlined Process</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900"
          >
            How it <span className="bg-gradient-to-r from-[#0f4c3a] to-[#186b53] bg-clip-text text-transparent">Works</span>
          </motion.h2>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12, duration: 0.5 }}
              className="relative group h-full"
            >
              {/* Step Number */}
              <div className="absolute top-5 left-6 text-[4.5rem] font-serif font-black text-[#0f4c3a]/20 select-none transition-all duration-500 group-hover:text-[#0f4c3a]/45 z-20 leading-none">
                0{index + 1}
              </div>

              <div className="bg-white p-8 rounded-3xl border border-gray-100 hover:border-[#0f4c3a]/15 transition-all duration-500 h-full flex flex-col items-start gap-6 relative z-10 landing-card-hover group-hover:shadow-[0_20px_60px_rgba(15,76,58,0.08)]">
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0f4c3a]/5 to-[#186b53]/10 flex items-center justify-center text-[#0f4c3a] transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shrink-0 self-end border border-[#0f4c3a]/5">
                  {step.icon}
                </div>

                <div className="text-left">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connector line on desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/3 -right-3 translate-x-1/2 z-20">
                    <div className="w-6 h-[2px] bg-gradient-to-r from-[#0f4c3a]/20 to-transparent rounded-full" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-20 text-center"
        >
          <button
            onClick={() => navigate('/how-it-works')}
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 text-[13.5px] font-semibold px-5 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <ArrowRight size={15} className="text-[#0f4c3a]" />
            Take a Tour
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
