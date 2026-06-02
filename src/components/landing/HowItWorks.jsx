import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Users, CreditCard, LayoutDashboard, BarChart3, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: <Search className="w-7 h-7" />,
    title: "View Properties",
    description: "Explore our curated selection of premium enterprise housing solutions."
  },
  {
    icon: <Users className="w-7 h-7" />,
    title: "Meeting",
    description: "Connect with our team to discuss your specific requirements and scaling needs."
  },
  {
    icon: <CreditCard className="w-7 h-7" />,
    title: "Payment",
    description: "Hassle-free enterprise-grade payment processing and flexible billing."
  },
  {
    icon: <LayoutDashboard className="w-7 h-7" />,
    title: "Allocate & Manage",
    description: "Assign employees to units and coordinate essential relocation services through a centralized hub."
  },
  {
    icon: <BarChart3 className="w-7 h-7" />,
    title: "Track & Report",
    description: "Monitor occupancy rate, service status, and total relocation spend in real-time."
  }
];

const HowItWorks = () => {
  const navigate = useNavigate();
  return (
    <section className="py-28 bg-[#f5f5f3] relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[10%] right-[5%] w-72 h-72 bg-[#0f4c3a]/[0.03] rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] left-[5%] w-60 h-60 bg-[#D4A017]/[0.04] rounded-full blur-[80px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="h-px w-8 bg-gray-300" />
            <span className="text-[11px] font-semibold text-gray-400 tracking-[0.2em] uppercase">Streamlined Process</span>
            <span className="h-px w-8 bg-gray-300" />
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            How it <span className="font-bold text-[#0f4c3a]">Works</span>
          </h2>
          <p className="text-base md:text-lg text-gray-500 leading-relaxed max-w-xl mx-auto">
            A streamlined, five-step journey from exploring properties to tracking your entire relocation spend in real time.
          </p>
        </motion.div>

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
              <div className="bg-white p-6 rounded-2xl transition-all duration-500 h-full flex flex-col relative z-10 landing-card-hover">

                {/* Top row: number left, icon right */}
                <div className="flex items-center justify-between w-full mb-6">
                  <span className="text-[3.5rem] font-heading font-black text-gray-200 leading-none select-none transition-all duration-500 group-hover:text-[#0f4c3a]/25">
                    0{index + 1}
                  </span>
                  <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 group-hover:bg-[#0f4c3a] group-hover:border-[#0f4c3a] group-hover:text-white transition-all duration-500 shrink-0">
                    {step.icon}
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="font-heading text-base font-bold text-gray-900 mb-2">{step.title}</h3>
                  <div className="w-6 h-px bg-gray-200 mb-3" />
                  <p className="text-gray-500 leading-relaxed text-sm">
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
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 text-[11px] font-semibold px-6 py-3 rounded-full border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-200 uppercase tracking-[0.15em]"
          >
            Take a Tour
            <ArrowRight size={14} className="text-[#0f4c3a]" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
