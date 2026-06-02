import React from 'react';
import { Handshake, Download, Building2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeroVisual from './HeroVisual';

const dotGridStyle = {
  backgroundImage: `radial-gradient(circle, #d1d5db 1px, transparent 1px)`,
  backgroundSize: '28px 28px',
};

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-[#f5f5f3]">

      {/* Dot-grid */}
      <div className="absolute inset-0 z-0 opacity-[0.3]" style={dotGridStyle} />
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,_transparent_60%,_#f5f5f3_100%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 lg:pt-32 pb-0">
        <div className="grid lg:grid-cols-[1fr_1.7fr] gap-10 lg:gap-16 items-center">

          {/* ── LEFT ── */}
          <div className="flex flex-col">

            {/* Section badge- consistent style */}
            <motion.div
               initial={{ opacity: 0, y: 12 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.45 }}
               className="self-start flex items-center gap-3 mb-6"
             >
               <span className="h-px w-8 bg-gray-300" />
               <span className="text-[11px] font-semibold text-gray-400 tracking-[0.2em] uppercase">
                 End-to-End Housing Platform
               </span>
               <span className="h-px w-8 bg-gray-300" />
             </motion.div>

             {/* Headline */}
             <motion.h1
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: 0.1 }}
               className="font-heading text-[2.6rem] md:text-[3.2rem] lg:text-[3.6rem] font-bold leading-[1.1] tracking-tight text-gray-900 mb-5"
             >
               Simplifying
               <br />
               <span className="font-bold text-[#0f4c3a]">Global Relocation</span>
             </motion.h1>

             {/* Subtitle */}
             <motion.p
               initial={{ opacity: 0, y: 12 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5, delay: 0.22 }}
               className="text-[15px] text-gray-500 mb-8 max-w-md leading-relaxed"
             >
               Reserve housing capacity in advance, manage employee housing from one dashboard, and replace manual coordination with a structured platform.
             </motion.p>

             {/* ── 3 equal-style buttons ── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.34 }}
              className="flex flex-wrap sm:flex-nowrap items-center gap-2"
            >
              <button
                onClick={() => {
                  document.getElementById('schedule')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 bg-[#0f4c3a] hover:bg-[#186b53] text-white text-[11px] font-semibold px-4 py-3 rounded-full border border-[#0f4c3a] shadow-sm hover:shadow-md transition-all duration-200 whitespace-nowrap uppercase tracking-[0.1em]"
              >
                <Handshake size={14} className="text-white" />
                Partner with Arrivio
              </button>

              <button
                onClick={() => navigate('/properties')}
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 text-[11px] font-semibold px-4 py-3 rounded-full border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-200 whitespace-nowrap uppercase tracking-[0.1em]"
              >
                <Building2 size={14} className="text-[#0f4c3a]" />
                View Properties
              </button>

              <a
                href="/arrivio-b2b-deck.pdf"
                download="Arrivio_Company_Deck.pdf"
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 text-[11px] font-semibold px-4 py-3 rounded-full border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-200 whitespace-nowrap uppercase tracking-[0.1em]"
              >
                <Download size={14} className="text-[#0f4c3a]" />
                Download Deck
              </a>
            </motion.div>

           </div>

           {/* ── RIGHT: Dashboard ── */}
           <motion.div
             initial={{ opacity: 0, x: 24, scale: 0.98 }}
             animate={{ opacity: 1, x: 0, scale: 1 }}
             transition={{ duration: 0.75, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
             className="hidden lg:block relative"
           >
             <div className="absolute -inset-4 bg-gradient-to-br from-[#0f4c3a]/5 via-transparent to-[#D4A017]/5 rounded-[2.5rem] blur-2xl" />
             <div className="relative rounded-2xl overflow-hidden border border-gray-200/80 shadow-[0_16px_50px_rgba(0,0,0,0.08)] bg-white">
               <HeroVisual />
             </div>
           </motion.div>

         </div>
       </div>

       {/* Mobile dashboard */}
       <div className="lg:hidden relative z-10 max-w-7xl mx-auto px-6 mt-8 pb-12">
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6, delay: 0.4 }}
           className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-white"
         >
           <HeroVisual />
         </motion.div>
       </div>

       {/* Bottom fade */}
       <div className="relative z-10 h-16 bg-gradient-to-b from-transparent to-[#f5f5f3]" />

     </section>
  );
};

export default Hero;
