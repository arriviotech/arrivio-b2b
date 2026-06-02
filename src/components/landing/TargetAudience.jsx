import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Briefcase, GraduationCap } from 'lucide-react';

const TargetAudience = () => {
  const audiences = [
    {
      icon: <Building2 className="w-7 h-7" />,
      title: "Employers & Companies",
      description: "Reserve housing for international hires before they arrive. Give your fast-growing teams peace of mind from day one."
    },
    {
      icon: <Briefcase className="w-7 h-7" />,
      title: "Relocation Agencies",
      description: "Manage housing across multiple client companies and relocation cases seamlessly from a centralized dashboard."
    },
    {
      icon: <GraduationCap className="w-7 h-7" />,
      title: "Universities & Institutions",
      description: "Reserve blocks of housing for incoming student cohorts and research fellows, ensuring a smooth transition."
    }
  ];

  return (
    <section id="audience" className="py-28 relative overflow-hidden bg-[#f5f5f3]">
      {/* Decorative orbs */}
      <div className="absolute top-[10%] right-[10%] w-80 h-80 bg-[#0f4c3a]/4 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[5%] w-60 h-60 bg-[#D4A017]/4 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-20 flex flex-col items-center"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="h-px w-8 bg-gray-300" />
            <span className="text-[11px] font-semibold text-gray-400 tracking-[0.2em] uppercase">Target Audience</span>
            <span className="h-px w-8 bg-gray-300" />
          </div>

          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Built for{' '}
            <span className="font-bold text-[#0f4c3a]">Global Organisations.</span>
          </h2>
          <p className="text-base md:text-lg text-gray-500 leading-relaxed max-w-xl mx-auto">
            The platform supports different partner types with role-specific dashboards, tailored to your organizational structure.
          </p>
        </motion.div>

        {/* Cards - restored back to normal 3-column card grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {audiences.map((audience, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12 }}
              className="relative group h-full"
            >
              <div className="bg-white rounded-2xl p-8 transition-all duration-500 flex flex-col items-center text-center landing-card-hover h-full">
                <div className="w-14 h-14 rounded-full border border-gray-300 flex items-center justify-center mb-6 text-gray-600 group-hover:bg-[#0f4c3a] group-hover:border-[#0f4c3a] group-hover:text-white transition-all duration-500">
                  {audience.icon}
                </div>
                <h3 className="font-heading text-2xl font-semibold text-gray-900 mb-3">{audience.title}</h3>
                <div className="w-8 h-px bg-gray-300 mb-3" />
                <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                  {audience.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TargetAudience;
