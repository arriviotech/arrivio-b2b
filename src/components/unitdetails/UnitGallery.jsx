import React, { useState, useEffect, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UnitGallery = ({ galleryImages = [] }) => {
  // De-dupe (the old gallery showed the same image multiple times)
  const photos = useMemo(() => {
    const seen = new Set();
    return galleryImages.filter((url) => {
      if (!url || seen.has(url)) return false;
      seen.add(url);
      return true;
    });
  }, [galleryImages]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const hasPhotos = photos.length > 0;
  const total = photos.length;

  // Reset to first photo if list changes
  useEffect(() => {
    setActiveIndex(0);
  }, [photos.length]);

  const next = (e) => {
    e?.stopPropagation();
    if (total === 0) return;
    setActiveIndex((i) => (i + 1) % total);
  };
  const prev = (e) => {
    e?.stopPropagation();
    if (total === 0) return;
    setActiveIndex((i) => (i - 1 + total) % total);
  };

  const openLightbox = () => {
    if (!hasPhotos) return;
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };
  const closeLightbox = () => {
    setIsLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  // Keyboard nav (arrows + esc)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    if (isLightboxOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLightboxOpen, total]);

  if (!hasPhotos) {
    return (
      <div className="w-full h-[360px] md:h-[420px] rounded-[28px] bg-gradient-to-br from-[#0f4c3a]/8 to-[#0f4c3a]/3 flex items-center justify-center text-[#0f4c3a]/30 text-xs font-bold uppercase tracking-widest">
        No photos available
      </div>
    );
  }

  // Show up to 5 thumbs + a "+N more" tile on the 6th slot
  const VISIBLE_THUMBS = 5;
  const visibleThumbs = photos.slice(0, VISIBLE_THUMBS);
  const extraCount = total - VISIBLE_THUMBS;

  return (
    <>
      {/* HERO */}
      <div className="relative w-full h-[360px] md:h-[440px] rounded-[28px] overflow-hidden bg-gray-50 group">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIndex}
            src={photos[activeIndex]}
            alt={`Unit photo ${activeIndex + 1}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={openLightbox}
            className="w-full h-full object-cover cursor-zoom-in"
          />
        </AnimatePresence>

        {/* Arrows */}
        {total > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#111827] flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous photo"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#111827] flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next photo"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Counter */}
        <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-black/55 backdrop-blur-sm text-white text-[11px] font-bold tracking-widest uppercase flex items-center gap-1.5">
          <span>{activeIndex + 1} / {total}</span>
        </div>

        {/* Expand hint */}
        <button
          onClick={openLightbox}
          className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/55 hover:bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 transition-colors"
        >
          <Maximize2 size={12} />
          Expand
        </button>
      </div>

      {/* THUMBS */}
      {total > 1 && (
        <div className="mt-3 grid grid-cols-5 sm:grid-cols-6 gap-2">
          {visibleThumbs.map((url, i) => (
            <button
              key={url + i}
              onClick={() => setActiveIndex(i)}
              className={`relative h-16 sm:h-20 rounded-xl overflow-hidden transition-all ${
                i === activeIndex
                  ? 'ring-2 ring-[#0f4c3a] ring-offset-2 ring-offset-[#f2f2f2]'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <img src={url} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
          {extraCount > 0 && (
            <button
              onClick={openLightbox}
              className="relative h-16 sm:h-20 rounded-xl overflow-hidden bg-gray-900 text-white text-sm font-bold flex items-center justify-center hover:bg-black transition-colors"
            >
              +{extraCount}
            </button>
          )}
        </div>
      )}

      {/* LIGHTBOX */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center"
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2 z-10"
              aria-label="Close"
            >
              <X size={28} strokeWidth={1.5} />
            </button>

            {total > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-4 md:left-8 text-white/70 hover:text-white transition-colors p-3 z-10 bg-white/5 hover:bg-white/10 rounded-full"
                  aria-label="Previous"
                >
                  <ChevronLeft size={32} strokeWidth={1.5} />
                </button>
                <button
                  onClick={next}
                  className="absolute right-4 md:right-8 text-white/70 hover:text-white transition-colors p-3 z-10 bg-white/5 hover:bg-white/10 rounded-full"
                  aria-label="Next"
                >
                  <ChevronRight size={32} strokeWidth={1.5} />
                </button>
              </>
            )}

            <div className="relative w-full h-[85vh] flex items-center justify-center p-4 md:p-12">
              <motion.img
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                src={photos[activeIndex]}
                alt={`Photo ${activeIndex + 1}`}
                onClick={(e) => e.stopPropagation()}
                className="max-h-full max-w-full object-contain rounded-lg shadow-2xl cursor-default"
              />
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-xs font-bold tracking-[0.2em] uppercase">
                {activeIndex + 1} / {total}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UnitGallery;
