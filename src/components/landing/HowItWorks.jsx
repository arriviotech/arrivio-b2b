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
    description: "Assign employees to units and manage their stay through a centralized hub."
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Track & Report",
    description: "Monitor occupancy rate, employee satisfaction, and total spend in real-time."
  }
];

const HowItWorks = () => {
  const navigate = useNavigate();
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl pointer-events-none opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0f4c3a] rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#186b53] rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#0f4c3a] mb-4"
          >
            Streamlined Process
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-gray-900"
          >
            How it <span className="text-[#0f4c3a]">Works</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group h-full"
            >
              {/* Step Number - Elevated and prominent on the left */}
              <div className="absolute top-6 left-8 text-6xl font-serif font-black text-[#0f4c3a]/20 select-none transition-all duration-300 group-hover:text-[#0f4c3a]/40 z-20">
                0{index + 1}
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 hover:border-[#0f4c3a]/20 transition-all duration-300 h-full flex flex-col items-start gap-6 relative z-10 hover:shadow-xl hover:shadow-[#0f4c3a]/5 hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#0f4c3a] transition-transform duration-500 group-hover:rotate-12 shrink-0 border border-gray-50 self-end">
                  {step.icon}
                </div>

                <div className="text-left">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/3 -right-4 translate-x-1/2 z-20">
                    <div className="w-8 h-[2px] bg-gradient-to-r from-[#0f4c3a]/20 to-transparent"></div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* New Detailed CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-20 text-center"
        >
          <button
            onClick={() => navigate('/how-it-works')}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-[#0f4c3a] text-[#0f4c3a] font-bold hover:bg-[#0f4c3a] hover:text-white transition-all duration-300 group"
          >
            Take a Tour
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
