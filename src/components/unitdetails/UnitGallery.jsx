import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UnitGallery = ({ galleryImages }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Close with Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setIsOpen(true);
    // Prevent scrolling when lightbox is open
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsOpen(false);
    // Restore scrolling
    document.body.style.overflow = 'auto';
  };

  const nextImage = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <>
      <div className="grid grid-cols-3 grid-rows-3 gap-2 md:gap-3 h-[400px] sm:h-[500px] md:h-[580px] rounded-[32px] overflow-hidden">
        {/* Main Large Image (Top Left, spanning 2 cols, 2 rows) */}
        <div className="col-span-2 row-span-2 relative group cursor-pointer overflow-hidden" onClick={() => openLightbox(0)}>
          <img src={galleryImages[0]} alt="Main" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
        </div>

        {/* Top Right Image */}
        <div className="col-span-1 row-span-1 relative group cursor-pointer overflow-hidden" onClick={() => openLightbox(1)}>
          <img src={galleryImages[1]} alt="Gallery 2" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
        </div>

        {/* Middle Right Image */}
        <div className="col-span-1 row-span-1 relative group cursor-pointer overflow-hidden" onClick={() => openLightbox(2)}>
          <img src={galleryImages[2]} alt="Gallery 3" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
        </div>

        {/* Bottom Left Image */}
        <div className="col-span-1 row-span-1 relative group cursor-pointer overflow-hidden" onClick={() => openLightbox(3)}>
          <img src={galleryImages[3] || galleryImages[0]} alt="Gallery 4" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
        </div>

        {/* Bottom Center Image */}
        <div className="col-span-1 row-span-1 relative group cursor-pointer overflow-hidden" onClick={() => openLightbox(1)}>
          <img src={galleryImages[1]} alt="Gallery 5" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
        </div>

        {/* Bottom Right Image with "+4 Photos" Overlay */}
        <div className="col-span-1 row-span-1 relative group cursor-pointer overflow-hidden" onClick={() => openLightbox(4)}>
          <img src={galleryImages[2]} alt="Gallery 6" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300 flex flex-col items-center justify-center p-4">
            <span className="text-white text-3xl md:text-4xl font-light mb-3">+4</span>
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 text-white text-[10px] font-bold tracking-widest uppercase px-5 py-2.5 rounded-full flex items-center gap-2.5 transition-all hover:bg-white/20 active:scale-95 shadow-xl">
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-80"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
               PHOTOS
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 flex flex-col items-center justify-center backdrop-blur-sm"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button 
              className="absolute top-8 right-8 text-white/70 hover:text-white transition-colors p-2 z-10"
              onClick={closeLightbox}
            >
              <X size={32} strokeWidth={1.5} />
            </button>

            {/* Navigation buttons */}
            <button 
              className="absolute left-4 md:left-8 text-white/70 hover:text-white transition-colors p-4 z-10 bg-white/5 hover:bg-white/10 rounded-full"
              onClick={prevImage}
            >
              <ChevronLeft size={40} strokeWidth={1} />
            </button>

            <button 
              className="absolute right-4 md:right-8 text-white/70 hover:text-white transition-colors p-4 z-10 bg-white/5 hover:bg-white/10 rounded-full"
              onClick={nextImage}
            >
              <ChevronRight size={40} strokeWidth={1} />
            </button>

            {/* Main content area - clicking background closes */}
            <div className="relative w-full h-[85vh] flex items-center justify-center p-4 md:p-12">
              <motion.img 
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                src={galleryImages[currentIndex]} 
                alt={`Selected Gallery Image ${currentIndex + 1}`}
                className="max-h-full max-w-full object-contain shadow-2xl rounded-lg cursor-default"
                onClick={(e) => e.stopPropagation()}
              />
              
              {/* Image counter indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-xs font-bold tracking-[0.2em] uppercase">
                {currentIndex + 1} / {galleryImages.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UnitGallery;
