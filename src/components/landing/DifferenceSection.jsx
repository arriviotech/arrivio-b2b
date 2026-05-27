import React from 'react';
import housingCapacityImg from '../../assets/housing-capacity.jpg';

const DifferenceSection = () => {
  return (
    <section id="difference" className="py-24 bg-[#f9fafb] border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0f4c3a]/5 border border-[#0f4c3a]/10 mb-6">
              <span className="text-sm font-semibold tracking-wide text-[#0f4c3a] uppercase">The Difference</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Reserve Housing Capacity Before Hiring
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Unlike traditional housing platforms where you search for individual apartments at the last minute, Arrivio allows companies to reserve housing capacity in advance for upcoming hires.
            </p>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <span className="text-emerald-700 font-bold">Ex</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Reserve 10 studio apartments in Berlin for March–September.</h4>
                <p className="text-gray-500 text-sm">This guarantees housing availability before your employees even arrive in the country.</p>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0f4c3a]/10 to-transparent rounded-3xl -z-10 translate-x-4 translate-y-4"></div>
            <img 
              src={housingCapacityImg} 
              alt="Modern apartment architecture with greenery" 
              className="rounded-3xl shadow-xl w-full object-cover aspect-[4/3]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DifferenceSection;
