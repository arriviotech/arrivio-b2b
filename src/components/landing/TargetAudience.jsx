import React from 'react';
import { Building2, Briefcase, GraduationCap } from 'lucide-react';

const TargetAudience = () => {
  const audiences = [
    {
      icon: <Building2 className="w-8 h-8 text-[#0f4c3a]" />,
      title: "Employers & Companies",
      description: "Reserve housing for international hires before they arrive. Give your fast-growing teams peace of mind from day one."
    },
    {
      icon: <Briefcase className="w-8 h-8 text-[#0f4c3a]" />,
      title: "Relocation Agencies",
      description: "Manage housing across multiple client companies and relocation cases seamlessly from a centralized dashboard."
    },
    {
      icon: <GraduationCap className="w-8 h-8 text-[#0f4c3a]" />,
      title: "Universities & Institutions",
      description: "Reserve blocks of housing for incoming student cohorts and research fellows, ensuring a smooth transition."
    }
  ];

  return (
    <section id="audience" className="py-24 bg-background-neutral">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Built for Global Organisations
          </h2>
          <p className="text-lg text-gray-600">
            The platform supports different partner types with role-specific dashboards, tailored to your organizational structure.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {audiences.map((audience, index) => (
            <div 
              key={index} 
              className="group p-8 rounded-2xl bg-[#fdfdfc] border border-gray-100 hover:border-[#0f4c3a]/20 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              {/* Background hover effect */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#0f4c3a]/5 rounded-full translate-x-1/2 -translate-y-1/2 transition-transform duration-500 group-hover:scale-150"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-8 shadow-inner">
                  {audience.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{audience.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  {audience.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TargetAudience;
