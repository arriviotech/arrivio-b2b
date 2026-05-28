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
    <section className="relative overflow-hidden bg-white">

      {/* Dot-grid */}
      <div className="absolute inset-0 z-0 opacity-[0.3]" style={dotGridStyle} />
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,_transparent_60%,_white_100%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 lg:pt-32 pb-0">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-16 items-center">

          {/* ── LEFT ── */}
          <div className="flex flex-col">

            {/* Section badge- consistent style */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="self-start inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#0f4c3a]/15 bg-[#0f4c3a]/[0.04] mb-6"
            >
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0f4c3a] opacity-50" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#0f4c3a]" />
              </span>
              <span className="text-[11px] font-semibold text-[#0f4c3a] tracking-[0.12em] uppercase">
                End-to-End Housing Platform
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[2.6rem] md:text-[3.2rem] lg:text-[3.6rem] font-bold leading-[1.1] tracking-tight text-gray-900 mb-5"
            >
              Simplifying
              <br />
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-[#0f4c3a] to-[#186b53] bg-clip-text text-transparent">
                  Global Relocation
                </span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.75, ease: 'easeOut' }}
                  className="absolute -bottom-0.5 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#0f4c3a]/25 via-[#D4A017]/40 to-transparent rounded-full origin-left"
                />
              </span>
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
              className="flex flex-wrap items-center gap-2"
            >
              {/* All 3 use same base: rounded-xl border, py-2.5 px-5, text-[13.5px] font-semibold */}
              <button
                onClick={() => {
                  document.getElementById('schedule')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1.5 bg-[#0f4c3a] hover:bg-[#186b53] text-white text-[12.5px] font-semibold px-3.5 py-2 rounded-xl border border-[#0f4c3a] shadow-sm hover:shadow-md transition-all duration-200 whitespace-nowrap"
              >
                <Handshake size={15} className="text-white" />
                Partner with Arrivio
              </button>

              <button
                onClick={() => navigate('/properties')}
                className="inline-flex items-center gap-1.5 bg-white hover:bg-gray-50 text-gray-800 text-[12.5px] font-semibold px-3.5 py-2 rounded-xl border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-200 whitespace-nowrap"
              >
                <Building2 size={15} className="text-[#0f4c3a]" />
                View Properties
              </button>

              <a
                href="/arrivio-b2b-deck.pdf"
                download="Arrivio_Company_Deck.pdf"
                className="inline-flex items-center gap-1.5 bg-white hover:bg-gray-50 text-gray-800 text-[12.5px] font-semibold px-3.5 py-2 rounded-xl border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-200 whitespace-nowrap"
              >
                <Download size={15} className="text-[#0f4c3a]" />
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
      <div className="relative z-10 h-16 bg-gradient-to-b from-transparent to-white" />

    </section>
  );
};

export default Hero;
