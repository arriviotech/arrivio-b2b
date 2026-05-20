import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Footer from '../components/layout/Footer';
import greenLogo from '../assets/greenlogo.png';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col font-sans text-gray-900 bg-background-neutral overflow-x-hidden">
      {/* Simple Header with only Logo */}
      <header className="absolute top-0 left-0 w-full z-50 p-6 md:p-8 flex justify-start pointer-events-none">
        <div 
          className="cursor-pointer pointer-events-auto transition-transform hover:scale-105 active:scale-95"
          onClick={() => navigate('/')}
        >
          <img src={greenLogo} alt="Arrivio" className="h-10 md:h-12 w-auto object-contain" />
        </div>
      </header>

      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center select-none relative">
        {/* Background 404 Text */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.05, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none"
        >
          <span className="text-[25vw] font-serif font-black tracking-tighter text-[#1b3d36]">
            404
          </span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="relative z-10 max-w-lg w-full"
        >
          <h1 className="font-serif text-5xl md:text-6xl text-[#1b3d36] mb-4">
            Page Not Found
          </h1>
          
          <p className="text-gray-500 font-sans text-lg mb-10 leading-relaxed px-4">
            Looks like you've wandered off the map. The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Link 
              to="/"
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#1b3d36] hover:bg-[#15312b] text-white px-8 h-14 rounded-full font-bold text-sm tracking-[0.1em] uppercase transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              <Home size={18} />
              Go Home
            </Link>

            <Link 
              to="/properties"
              className="w-full sm:w-auto flex items-center justify-center gap-3 border-2 border-[#1b3d36]/20 hover:border-[#1b3d36] text-[#1b3d36] px-8 h-14 rounded-full font-bold text-sm tracking-[0.1em] uppercase transition-all hover:bg-white active:scale-95"
            >
              <Search size={18} />
              Find Stays
            </Link>
          </div>

          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-[#D4A017] font-bold text-[11px] tracking-[0.2em] uppercase transition-colors mx-auto group"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Go Back
          </button>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
