import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- YOUR LOCAL IMAGES ---
import berlinImg from '../../assets/cities/berlin.jpeg';
import munichImg from '../../assets/cities/munich.jpeg';
import frankfurtImg from '../../assets/cities/frankfurt.jpeg';
import cologneImg from '../../assets/cities/cologne.jpeg';
import dusseldorfImg from '../../assets/cities/dusseldorf.jpeg';
import bonnImg from '../../assets/cities/bonn.jpeg';
import aachenImg from '../../assets/cities/aachen.jpeg';
import hamburgImg from '../../assets/cities/hamburg.jpeg';
import germanyMap from '../../assets/germany.png';


const initialLocations = [
  { id: 1, name: "Aachen", top: "52%", left: "10%", count: 0, price: "580", label: "Tech & Uni", description: "Innovation meets history.", image: aachenImg },
  { id: 2, name: "Berlin", top: "28%", left: "72%", count: 0, price: "750", label: "The Capital", description: "Vibrant culture & tech hub.", image: berlinImg },
  { id: 3, name: "Bonn", top: "55%", left: "19%", count: 0, price: "650", label: "Historic", description: "Former capital charm.", image: bonnImg },
  { id: 4, name: "Cologne", top: "48%", left: "18%", count: 0, price: "720", label: "Media City", description: "Cathedral city on the Rhine.", image: cologneImg },
  { id: 5, name: "Dusseldorf", top: "42%", left: "15%", count: 0, price: "780", label: "Fashion & Art", description: "Luxury & lifestyle.", image: dusseldorfImg },
  { id: 6, name: "Frankfurt", top: "60%", left: "35%", count: 0, price: "850", label: "Finance Hub", description: "Skyscrapers & connectivity.", image: frankfurtImg },
  { id: 7, name: "Hamburg", top: "18%", left: "40%", count: 0, price: "820", label: "Gateway to World", description: "Maritime charm & media hub.", image: hamburgImg },
  { id: 8, name: "Munich", top: "80%", left: "60%", count: 0, price: "950", label: "Bavarian Heart", description: "Business & tradition.", image: munichImg },
];

const LocationsSection = () => {
  const [activeCityId, setActiveCityId] = useState(1);
  const [locations, setLocations] = useState(initialLocations); // ✅ State for locations

  // Fetch counts from DB - Safely handled
  React.useEffect(() => {
    const fetchCounts = async () => {
      try {
        if (typeof supabase !== 'undefined') {
          const { data, error } = await supabase
            .from('properties')
            .select('city');

          if (error) {
            console.error("Error fetching property counts:", error);
            return;
          }

          const counts = {};
          data.forEach(p => {
            const city = p.city ? p.city.trim() : "";
            counts[city] = (counts[city] || 0) + 1;
          });

          setLocations(prev => prev.map(loc => ({
            ...loc,
            count: counts[loc.name] || 0
          })));
        }
      } catch (err) {
        console.warn("Supabase not available, using defaults.");
      }
    };

    fetchCounts();
  }, []);

  const activeLocation = locations.find(l => l.id === activeCityId);

  // Animation variants for the pop effect
  const popVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 0.5, scale: 1, transition: { type: "spring", stiffness: 300, damping: 20 } },
    exit: { opacity: 0, scale: 1.1, transition: { duration: 0.2 } }
  };

  return (
    <section className="py-24 bg-[#f4f7f6] relative overflow-hidden" id="cities">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* LEFT: Content & Controls */}
          <div className="order-2 lg:order-1 flex flex-col justify-center">

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#0f4c3a] mb-6 leading-tight">
                Explore our <br />
                <span className="italic text-[#D4A017]">prime locations</span>
              </h2>

              <p className="text-[#5C5C50] font-sans text-lg mb-8 leading-relaxed max-w-md">
                Secure high-quality housing for your expanding workforce.
              </p>
            </motion.div>

            {/* List of Cities */}
            <div className="grid grid-cols-2 gap-3 mb-10">
              {locations.map((city) => (
                <button
                  key={city.id}
                  onClick={() => setActiveCityId(city.id)}
                  className={`
                    px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-between group border
                    ${activeCityId === city.id
                      ? 'bg-[#0f4c3a] text-white border-[#0f4c3a] shadow-lg scale-105'
                      : 'bg-white border-gray-200 text-[#0f4c3a]/70 hover:border-[#0f4c3a]/30 hover:bg-white/50'
                    }
                  `}
                >
                  <span className="flex items-center gap-2">
                    {activeCityId === city.id && <Sparkles size={14} className="animate-pulse text-[#D4A017]" />}
                    {city.name}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${activeCityId === city.id ? 'text-white/60' : 'text-[#0f4c3a]/40'}`}>
                    {city.count} homes
                  </span>
                </button>
              ))}
            </div>

            {/* Action Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCityId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white/40 backdrop-blur-sm p-10 rounded-[2.5rem] border border-white/60 shadow-sm"
              >
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <h3 className="text-4xl font-serif font-bold text-[#0f4c3a] mb-2">{activeLocation.name}</h3>
                    <p className="text-gray-500 text-lg font-sans">{activeLocation.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-1">Starting from</p>
                    <p className="text-3xl font-serif font-bold text-[#0f4c3a]">
                      €{activeLocation.price}<span className="text-lg font-sans font-normal text-gray-400">/mo</span>
                    </p>
                  </div>
                </div>

                <Link to={`/properties?city=${activeLocation.name}`}>
                  <button className="w-full h-16 bg-[#F3F2EE] hover:bg-[#EAE9E4] text-[#0f4c3a] rounded-2xl font-bold font-sans uppercase tracking-[0.1em] text-xs transition-all duration-300 flex items-center justify-center gap-3 border border-white/50 group">
                    View Homes in {activeLocation.name}
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </button>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT: Map Portal */}
          <div className="order-1 lg:order-2 relative h-[500px] lg:h-[600px] w-full">
            <div className="absolute inset-0 bg-[#1A1A1A] rounded-[2.5rem] overflow-hidden shadow-2xl border-[6px] border-white">

              {/* --- IMAGE POP ANIMATION --- */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCityId}
                  variants={popVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${activeLocation.image})` }}
                />
              </AnimatePresence>

              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80 z-10" />

              <div className="relative z-20 w-full h-full flex items-center justify-center">
                <div className="relative w-full h-full max-w-[400px] flex items-center justify-center">
                  <img
                    src={germanyMap}
                    alt="Germany Map"
                    className="
                    absolute inset-0 w-full h-full object-contain pointer-events-none
                    scale-110 sm:scale-120 lg:scale-150 opacity-40
                  "
                  />




                  {locations.map((loc) => (
                    <motion.div
                      key={loc.id}
                      className="absolute cursor-pointer z-30"
                      style={{ top: loc.top, left: loc.left }}
                      onClick={() => setActiveCityId(loc.id)}
                    >
                      {activeCityId === loc.id ? (
                        <div className="relative flex items-center justify-center group">
                          <div className="absolute w-10 h-10 bg-[#D4A017]/20 rounded-full animate-ping"></div>
                          <div className="relative transition-transform duration-300 group-hover:scale-110">
                            <MapPin size={32} className="text-[#D4A017] fill-[#D4A017] drop-shadow-[0_0_10px_rgba(212,160,23,0.4)]" />
                          </div>
                        </div>
                      ) : (
                        <div className="group relative">
                          <div className="w-2 h-2 bg-white/40 rounded-full hover:bg-white hover:scale-150 transition-all duration-300 shadow-[0_0_5px_rgba(255,255,255,0.2)]"></div>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <span className="text-[10px] text-white font-medium bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full whitespace-nowrap">
                              {loc.name}
                            </span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* HUD Elements */}
              <div className="absolute bottom-10 left-10 z-20">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeLocation.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <p className="text-white font-serif font-bold text-4xl mb-2 tracking-tight drop-shadow-lg">
                      {activeLocation.name.toUpperCase()}
                    </p>
                    <p className="text-[#D4A017] text-[11px] font-bold uppercase tracking-[0.3em] drop-shadow-md">
                      Available Now
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default LocationsSection;

