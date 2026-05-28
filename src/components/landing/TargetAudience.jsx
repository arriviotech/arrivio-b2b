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
    <section id="audience" className="py-28 relative overflow-hidden bg-[#f7f9f8]">
      {/* Decorative orbs */}
      <div className="absolute top-[10%] right-[10%] w-80 h-80 bg-[#0f4c3a]/4 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[5%] w-60 h-60 bg-[#D4A017]/4 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Built for{' '}
            <span className="bg-gradient-to-r from-[#0f4c3a] to-[#186b53] bg-clip-text text-transparent">Global Organisations</span>
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed">
            The platform supports different partner types with role-specific dashboards, tailored to your organizational structure.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {audiences.map((audience, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12 }}
              className="group p-8 rounded-3xl bg-white border border-gray-100 hover:border-[#0f4c3a]/15 transition-all duration-500 relative overflow-hidden landing-card-hover"
            >
              {/* Background hover effect */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#0f4c3a]/[0.03] rounded-full translate-x-1/2 -translate-y-1/2 transition-all duration-700 group-hover:scale-[2] group-hover:bg-[#0f4c3a]/[0.05]" />
              
              <div className="relative z-10">
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-8 text-[#0f4c3a] transition-all duration-500 group-hover:scale-110 group-hover:bg-emerald-100">
                  {audience.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{audience.title}</h3>
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
