import React from 'react';
import { Lock, Clock, Zap } from 'lucide-react';

const DifferenceSection = () => {
  return (
    <section id="difference" className="py-24 bg-[#f9fafb] border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
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
              src="https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=1200&q=80" 
              alt="Modern apartment architecture" 
              className="rounded-3xl shadow-xl w-full object-cover aspect-[4/3]"
            />
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-12">Flexible Reservation Types for Any Strategy</h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Fixed Reservation */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:border-[#0f4c3a]/30 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-gray-50 group-hover:bg-[#0f4c3a]/5 flex items-center justify-center mb-6 transition-colors">
                <Lock className="w-6 h-6 text-gray-600 group-hover:text-[#0f4c3a] transition-colors" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Fixed Reservation</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Specific units reserved exclusively for your company. Ideal for continuous, guaranteed availability at the lowest rate.
              </p>
            </div>

            {/* Soft Reservation */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:border-[#0f4c3a]/30 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-gray-50 group-hover:bg-[#0f4c3a]/5 flex items-center justify-center mb-6 transition-colors">
                <Clock className="w-6 h-6 text-gray-600 group-hover:text-[#0f4c3a] transition-colors" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Soft Reservation</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Priority access from available housing inventory. Secure capacity with more flexibility on specific unit assignments.
              </p>
            </div>

            {/* On-Demand */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:border-[#0f4c3a]/30 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-gray-50 group-hover:bg-[#0f4c3a]/5 flex items-center justify-center mb-6 transition-colors">
                <Zap className="w-6 h-6 text-gray-600 group-hover:text-[#0f4c3a] transition-colors" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">On-Demand</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Book units directly from live availability when needed. Perfect for unexpected relocations or shorter stays.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default DifferenceSection;
