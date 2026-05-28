import React from 'react';
import { motion } from 'framer-motion';
import housingCapacityImg from '../../assets/housing-capacity.jpg';

const DifferenceSection = () => {
  return (
    <section id="difference" className="py-28 bg-white relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-[20%] right-0 w-96 h-96 bg-[#0f4c3a]/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          
          {/* Left — Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#0f4c3a]/15 bg-[#0f4c3a]/[0.04] mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0f4c3a]" />
              <span className="text-[11px] font-semibold text-[#0f4c3a] tracking-[0.12em] uppercase">The Difference</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-7 leading-tight">
              Reserve Housing Capacity{' '}
              <span className="bg-gradient-to-r from-[#0f4c3a] to-[#186b53] bg-clip-text text-transparent">Before Hiring</span>
            </h2>

            <p className="text-lg text-gray-500 mb-10 leading-relaxed">
              Unlike traditional housing platforms where you search for individual apartments at the last minute, Arrivio allows companies to reserve housing capacity in advance for upcoming hires.
            </p>
            
            {/* Example Card — glassmorphism */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-[#f8faf9] to-white p-7 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all duration-500"
            >
              {/* Green accent border */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#0f4c3a] to-[#186b53] rounded-full" />
              
              <div className="flex items-start gap-4 pl-3">
                <div className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                  <span className="text-emerald-700 font-bold text-sm">Ex</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1.5 text-[15px]">Reserve 10 studio apartments in Berlin for March–September.</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">This guarantees housing availability before your employees even arrive in the country.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Right — Image */}
          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.97 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative group"
          >
            {/* Background shadow card */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0f4c3a]/15 to-[#D4A017]/10 rounded-3xl translate-x-4 translate-y-4 transition-transform duration-700 group-hover:translate-x-5 group-hover:translate-y-5" />
            <img 
              src={housingCapacityImg} 
              alt="Modern apartment architecture with greenery" 
              className="rounded-3xl shadow-2xl w-full object-cover aspect-[4/3] relative z-10 transition-transform duration-700 group-hover:scale-[1.02]"
            />
            {/* Overlay gradient on hover */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-[#0f4c3a]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DifferenceSection;
