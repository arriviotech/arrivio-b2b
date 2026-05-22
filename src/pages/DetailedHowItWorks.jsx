import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useInView, useAnimationFrame } from 'framer-motion';
import { Search, Users, CreditCard, LayoutDashboard, BarChart3, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import customIcon from '../assets/icon.png';

const detailedSteps = [
  {
    icon: <Search className="w-8 h-8" />,
    title: "View Properties",
    subtitle: "Curated Selection for Global Citizens",
    description: "Our portfolio features hand-picked, premium enterprise housing solutions across major global hubs. Every property is vetted for quality, location, and amenities to ensure your team experiences the Arrivio standard of excellence.",
    points: [
      "Access to exclusive, off-market inventory",
      "High-resolution virtual tours and floor plans",
      "Detailed neighborhood insights and safety ratings",
      "Flexible stay durations tailored to business needs"
    ]
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Discovery Meeting",
    subtitle: "Tailoring Solutions to Your Scale",
    description: "We don't just provide housing; we build partnerships. Our dedicated account managers work with you to understand your specific headcount, budget, and long-term scaling requirements.",
    points: [
      "Dedicated corporate account manager",
      "Customized pricing models for enterprise scale",
      "Streamlined onboarding for HR and Travel teams",
      "Bespoke amenity packages for specific employee needs"
    ]
  },
  {
    icon: <CreditCard className="w-8 h-8" />,
    title: "Seamless Payment",
    subtitle: "Enterprise-Grade Billing & Compliance",
    description: "Arrivio simplifies the financial complexity of global housing. Our billing system is designed for enterprise transparency, providing single-invoice solutions and flexible billing cycles.",
    points: [
      "Single consolidated monthly invoicing",
      "Multi-currency support and tax compliance",
      "Automated expense reporting integration",
      "Secure, encrypted payment gateways"
    ]
  },
  {
    icon: <LayoutDashboard className="w-8 h-8" />,
    title: "Allocate & Manage",
    subtitle: "Your Centralized Housing Hub",
    description: "The Arrivio Dashboard gives you full control over your global housing footprint. Assign employees, track move-in dates, and manage extensions with a few clicks.",
    points: [
      "Real-time employee assignment tools",
      "Digital move-in/move-out coordination",
      "Automated guest communication and support",
      "Inventory tracking and utilization metrics"
    ]
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: "Track & Report",
    subtitle: "Data-Driven Insights for Growth",
    description: "Optimize your housing spend with detailed analytics. Monitor occupancy rates, track employee satisfaction, and generate custom reports for internal stakeholders.",
    points: [
      "Monthly occupancy and spend analysis",
      "Employee satisfaction survey results",
      "Custom ROI reporting for leadership",
      "Predictive analytics for future housing needs"
    ]
  }
];

const StepCard = ({ step, index, isEven }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, x: isEven ? -100 : 100, y: 50 }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col md:flex-row ${isEven ? 'md:justify-start' : 'md:justify-end'} items-center w-full relative group`}
    >
      <div className="w-full md:w-[48%] bg-white/80 backdrop-blur-md p-10 md:p-14 rounded-[4rem] shadow-2xl shadow-[#0f4c3a]/5 border border-white/50 relative z-20 hover:shadow-[#0f4c3a]/10 transition-shadow duration-500 overflow-hidden">
        {/* Glow Effect on Card Hover */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#0f4c3a]/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

        {/* Step Marker Node with Lighting */}
        <div className={`absolute top-1/2 ${isEven ? '-right-4 md:-right-14' : '-left-4 md:-left-14'} -translate-y-1/2 flex items-center justify-center hidden lg:flex`}>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-12 h-12 rounded-full bg-[#0f4c3a]/5 flex items-center justify-center relative z-20"
          >
            <div className="w-4 h-4 rounded-full bg-[#0f4c3a] shadow-[0_0_15px_rgba(15,76,58,0.5)]"></div>
          </motion.div>
        </div>

        <div className="flex items-center gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="w-16 h-16 rounded-2xl bg-[#0f4c3a] text-white flex items-center justify-center shadow-lg shadow-[#0f4c3a]/10"
          >
            {step.icon}
          </motion.div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] font-black text-[#0f4c3a] mb-1">Step 0{index + 1}</div>
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-gray-900 group-hover:text-[#0f4c3a] transition-colors">{step.title}</h2>
          </div>
        </div>

        <p className="text-[#0f4c3a] font-medium mb-4 italic text-lg leading-relaxed">{step.subtitle}</p>
        <p className="text-gray-500 text-lg leading-relaxed mb-10">{step.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 pt-8 border-t border-gray-100/80">
          {step.points.map((point, i) => (
            <div key={i} className="flex items-center gap-3 text-gray-700 font-medium">
              <CheckCircle2 className="w-5 h-5 text-[#0f4c3a] shrink-0" />
              <span className="text-sm">{point}</span>
            </div>
          ))}
        </div>

        {/* Backdrop Number */}
        <div className="absolute top-10 right-10 text-9xl font-serif font-black text-[#0f4c3a]/[0.03] select-none pointer-events-none group-hover:opacity-10 transition-opacity">
          0{index + 1}
        </div>
      </div>
    </motion.section>
  );
};

const DetailedHowItWorks = () => {
  const containerRef = useRef(null);
  const journeyRef = useRef(null);
  const pathRef = useRef(null);
  const carRef = useRef(null);
  const navigate = useNavigate();

  const { scrollYProgress } = useScroll({
    target: journeyRef,
    offset: ["start center", "end center"] // Mapped to the actual scrollable visual block
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Calculate and apply position/rotation on every frame natively
  useAnimationFrame(() => {
    if (!pathRef.current || !carRef.current) return;

    // Using native SVG math for perfectly smooth 60fps binding
    const length = pathRef.current.getTotalLength();
    const currentLength = smoothProgress.get() * length;
    const point = pathRef.current.getPointAtLength(currentLength);

    // Determine which card the traveler is actively approaching/visiting
    const activeStepIndex = Math.round(point.y / 1000);
    
    // Even indexes (0, 2, 4) fall on the Left. Odd indexes (1, 3) fall on the Right.
    // The custom icon defaults facing Left. We scaleX(-1) to flip them to face Right cards!
    const isRightCard = activeStepIndex % 2 !== 0;
    const scaleX = isRightCard ? -1 : 1;

    // Apply transform natively with translation and deterministic conditional horizontal flipping
    carRef.current.setAttribute("transform", `translate(${point.x}, ${point.y}) scale(${scaleX}, 1)`);
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const heroTitleWords = "Your Journey to Seamless Enterprise Relocation".split(" ");

  // A majestic, deeply sweeping path crafted perfectly with independent C-commands to explicitly ensure it natively terminates in the middle of step 5!
  const roadmapPathD = "M 500 0 C 950 300, 50 700, 500 1000 C 50 1300, 950 1700, 500 2000 C 950 2300, 50 2700, 500 3000 C 50 3300, 950 3700, 500 4000";

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-[#fdfdfd] selection:bg-[#0f4c3a]/10 overflow-x-hidden">
      <Navbar />

      <main className="flex-grow pt-40 pb-32 relative" ref={containerRef}>

        {/* HERO SECTION - REWROUGHT FOR IMPACT */}
        <div className="max-w-7xl mx-auto px-6 mb-16 text-center relative z-20 flex flex-col items-center">
          <div className="flex items-center gap-4 mb-8">
            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} className="w-16 h-[2px] bg-[#0f4c3a]/30 origin-left"></motion.div>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-[12px] uppercase tracking-[0.5em] font-black text-[#0f4c3a]">The Arrivio Roadmap</motion.p>
            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} className="w-16 h-[2px] bg-[#0f4c3a]/30 origin-right"></motion.div>
          </div>

          <h1 className="text-6xl md:text-8xl font-serif font-medium text-gray-900 mb-10 leading-[1.1] max-w-5xl tracking-tight">
            {heroTitleWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className={`${word === "Seamless" || word === "Relocation" ? 'italic text-[#0f4c3a]' : ''} inline-block mr-4 last:mr-0`}
              >
                {word}
              </motion.span>
            ))}
          </h1>
        </div>

        {/* MAP CONTENT - Re-engineered with explicit Flex Gap to flawlessly strap SVG boundaries without margin collapse interference! */}
        <div className="relative w-full z-10 md:-mt-16" ref={journeyRef}>
          
          {/* TRACKING BOUNDARY FOR SCROLL & SVG - Anchored securely securely inside Card 1 through Card 5 nodes! */}
          <div className="absolute top-[80px] md:top-[160px] bottom-[80px] md:bottom-[160px] left-0 right-0 pointer-events-none isolate z-10">
            
            {/* ENHANCED SVG DOTTED PATH */}
            <div className="absolute inset-0 z-10 hidden lg:block overflow-visible">
              <svg
                viewBox="0 0 1000 4000"
                fill="none"
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
              >
                {/* Faint Background Guide Line */}
                <path
                  d={roadmapPathD}
                  stroke="#0f4c3a"
                  strokeWidth="4"
                  strokeDasharray="16 24"
                  strokeLinecap="round"
                  strokeOpacity="0.15"
                />

                {/* The Animated "Drawing" Line */}
                <motion.path
                  ref={pathRef}
                  id="journey-roadmap"
                  d={roadmapPathD}
                  stroke="#0f4c3a"
                  strokeWidth="6"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  style={{ pathLength: smoothProgress }}
                />
              </svg>
            </div>

            {/* THE TRAVELER ICON (Elevated completely to the front) */}
            <div className="absolute inset-0 z-40 hidden lg:block overflow-visible">
              <svg
                viewBox="0 0 1000 4000"
                fill="none"
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
              >
                <g ref={carRef}>
                  <image href={customIcon} width="72" height="72" x="-36" y="-36" />
                </g>
              </svg>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 flex flex-col gap-48 md:gap-80 relative z-20">
            {detailedSteps.map((step, index) => (
              <StepCard key={index} step={step} index={index} isEven={index % 2 === 0} />
            ))}
          </div>
        </div>

        {/* THE FINAL DESTINATION - CTA */}
        <section className="mt-32 md:mt-48 relative z-20 px-4 md:px-6 mb-24">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white/40 backdrop-blur-2xl px-10 py-24 md:p-32 rounded-[3.5rem] md:rounded-[5rem] relative overflow-hidden text-center shadow-[0_20px_80px_-20px_rgba(15,76,58,0.12)] border border-white/80 group"
            >
              {/* Animated Organic Gradients */}
              <motion.div 
                animate={{ 
                  transform: ['translate(0%, 0%) scale(1)', 'translate(5%, 5%) scale(1.1)', 'translate(0%, 0%) scale(1)']
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-[30%] -left-[10%] w-[70%] h-[120%] bg-gradient-to-br from-[#0f4c3a]/5 to-[#229973]/10 rounded-full blur-[100px] -z-10"
              />
              <motion.div 
                animate={{ 
                  transform: ['translate(0%, 0%) scale(1)', 'translate(-5%, -5%) scale(1.1)', 'translate(0%, 0%) scale(1)']
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[120%] bg-gradient-to-tl from-[#0f4c3a]/10 to-transparent rounded-full blur-[100px] -z-10"
              />

              {/* Subtitle / Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="flex items-center justify-center gap-4 mb-8"
              >
                <div className="w-12 h-[2px] bg-[#0f4c3a]/20"></div>
                <span className="text-[11px] md:text-sm uppercase tracking-[0.4em] font-black text-[#0f4c3a]">The Arrivio Standard</span>
                <div className="w-12 h-[2px] bg-[#0f4c3a]/20"></div>
              </motion.div>

              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl md:text-[6rem] font-serif text-[#0f4c3a] mb-8 relative z-10 leading-[1.05] tracking-tight"
              >
                Craft your <span className="italic font-light text-[#1a7a5c]">extraordinary</span><br className="hidden md:block" /> relocation story.
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-lg md:text-2xl text-gray-600 mb-16 max-w-2xl mx-auto relative z-10 opacity-90 font-light leading-relaxed"
              >
                Join the world's most innovative enterprises in redefining what it means to travel for business.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10"
              >
                <motion.button
                  onClick={() => navigate('/properties')}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto bg-[#0f4c3a] text-white px-10 py-4 md:px-12 md:py-4 rounded-full font-bold text-lg hover:shadow-[0_20px_40px_-10px_rgba(15,76,58,0.4)] transition-all duration-300"
                >
                  View Properties
                </motion.button>
                <motion.button
                  onClick={() => navigate('/schedule')}
                  whileHover={{ scale: 1.02, y: -2, backgroundColor: "rgba(15,76,58,0.03)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto border border-[#0f4c3a]/20 bg-transparent backdrop-blur-sm px-10 py-4 md:px-12 md:py-4 rounded-full font-bold text-[#0f4c3a] hover:border-[#0f4c3a]/40 hover:shadow-[0_20px_40px_-10px_rgba(15,76,58,0.05)] transition-all duration-300"
                >
                  Schedule a Meeting
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DetailedHowItWorks;
