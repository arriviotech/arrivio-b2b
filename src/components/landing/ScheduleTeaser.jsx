import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CalendarRange, Sparkles, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

// Marketing-page teaser for the scheduling flow. Replaces the embedded
// Cal.com iframe that used to live on Landing — keeps the page light and
// pushes users into the structured /schedule flow (picker → brief → iframe).
const ScheduleTeaser = () => {
  const navigate = useNavigate();

  const timelineSteps = [
    {
      icon: <CalendarRange className="w-6 h-6 text-[#0f4c3a]" />,
      title: "1. Strategy Call",
      description: "A 30-min discovery session to assess your B2B hiring pipeline and allocation capacity."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-[#D4A017]" />,
      title: "2. Tailored Proposal",
      description: "Receive custom volume pricing, unit allocation forecasts, and a live SaaS dashboard walkthrough."
    },
    {
      icon: <Rocket className="w-6 h-6 text-[#0f4c3a]" />,
      title: "3. Onboard & Scale",
      description: "Allocate housing units to incoming cohorts and launch employee bookings within 48 hours."
    }
  ];

  return (
    <section
      id="schedule"
      className="py-28 bg-[#f5f5f3] relative overflow-hidden"
    >
      {/* Subtle Background Glowing Accent Orbs */}
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-[#0f4c3a]/[0.02] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] bg-[#D4A017]/[0.02] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Centered Section Header - Aligned EXACTLY with other landing sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 max-w-2xl mx-auto flex flex-col items-center"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="h-px w-8 bg-gray-300" />
            <span className="text-[11px] font-semibold text-gray-400 tracking-[0.2em] uppercase">Strategy Session</span>
            <span className="h-px w-8 bg-gray-300" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-normal text-gray-900 mb-6 leading-tight">
            Ready to scale your global{' '}
            <em className="italic font-serif text-[#0f4c3a]">Employee Housing?</em>
          </h2>
          <p className="text-base md:text-lg text-gray-500 leading-relaxed max-w-xl mx-auto">
            Book a strategy call with our team. In three simple steps, we&rsquo;ll transition your organization to a fully structured, automated B2B housing platform.
          </p>
        </motion.div>

        {/* Fancy Horizontal Onboarding Timeline - Floating directly on the background */}
        <div className="w-full max-w-4xl mx-auto my-16 relative z-10">
          
          {/* Dashed Connecting Line with elegant gradient fade on desktop */}
          <div className="hidden md:block absolute top-[28px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-gray-300 to-transparent pointer-events-none z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6 relative z-10">
            {timelineSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="flex flex-col items-center group/step text-center relative"
              >
                {/* Single Round Glowing Icon Wrapper with advanced B2B wow factors */}
                <div className="relative mb-6 group-hover/step:scale-105 transition-all duration-300">
                  {/* Backdrop Glow Light Orb */}
                  <div className={`absolute inset-0 rounded-full blur-md opacity-0 group-hover/step:opacity-100 transition-all duration-500 scale-150 pointer-events-none ${
                    index === 1 ? 'bg-[#D4A017]/8' : 'bg-[#0f4c3a]/8'
                  }`} />
                  
                  {/* Subtle Expanding Dashed Ring (Slow Spin) */}
                  <div className={`absolute -inset-1.5 rounded-full border border-dashed pointer-events-none transition-all duration-500 animate-[spin_12s_linear_infinite] ${
                    index === 1 
                      ? 'border-[#D4A017]/20 group-hover/step:border-[#D4A017]/40' 
                      : 'border-[#0f4c3a]/20 group-hover/step:border-[#0f4c3a]/40'
                  }`} />

                  {/* The Main Round Icon Container */}
                  <div className="w-14 h-14 rounded-full border border-gray-300 bg-white flex items-center justify-center transition-all duration-300 group-hover/step:border-[#0f4c3a] group-hover/step:shadow-[0_10px_30px_rgba(15,76,58,0.12)] relative z-10">
                    <div className="transition-transform duration-500 group-hover/step:scale-110 group-hover/step:rotate-3">
                      {step.icon}
                    </div>
                  </div>

                  {/* Absolute Step Number Badge */}
                  <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-[9px] font-bold flex items-center justify-center shadow-md z-20 transition-transform duration-300 group-hover/step:scale-110 ${
                    index === 1 ? 'bg-[#D4A017]' : 'bg-[#0f4c3a]'
                  }`}>
                    0{index + 1}
                  </div>
                </div>

                {/* Step Title */}
                <h3 className="font-serif text-[17px] font-bold text-gray-900 mb-2 transition-colors duration-300 group-hover/step:text-[#0f4c3a]">
                  {step.title}
                </h3>

                {/* Short divider */}
                <div className="w-6 h-px bg-gray-300 mb-3 transition-colors duration-300 group-hover/step:bg-[#0f4c3a]/40" />

                {/* Description Text */}
                <p className="text-gray-500 text-xs md:text-sm leading-relaxed max-w-[240px]">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Centered CTA Action Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center text-center mt-12"
        >
          {/* High-Impact Executive Button */}
          <button
            onClick={() => navigate('/schedule')}
            className="inline-flex items-center justify-center gap-2 bg-[#0f4c3a] hover:bg-[#186b53] text-white px-10 py-4.5 rounded-full font-bold text-[11px] uppercase tracking-[0.2em] transition-all shadow-[0_20px_50px_rgba(15,76,58,0.15)] hover:shadow-[0_20px_60px_rgba(15,76,58,0.22)] hover:-translate-y-0.5 active:translate-y-0 group cursor-pointer relative z-10"
          >
            Book Strategy Call
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-white" />
          </button>

          {/* Live booking indicator status */}
          <div className="flex items-center justify-center gap-2 mt-6 text-[10px] text-gray-400 font-semibold relative z-10 uppercase tracking-[0.2em]">
            <span className="w-1.5 h-1.5 bg-[#0f4c3a] rounded-full animate-ping" />
            Slots Available This Week
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default ScheduleTeaser;
