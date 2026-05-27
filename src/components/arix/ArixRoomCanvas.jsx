import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import roomEmpty from '../../assets/furniture/room_empty.png';

const ArixRoomCanvas = ({ design, className, backgroundImage }) => {
  const selected = design?.selectedItems || [];
  const previewImage = backgroundImage || roomEmpty;

  // Explicit stacking order to ensure correct 3D perspective layering in the single room
  const LAYERING_ORDER = {
    bookshelf: 10,
    wardrobe: 20,
    bed: 30,
    desk: 40,
    dining_table: 50,
    sofa: 60
  };

  const sortedSelected = [...selected].sort((a, b) => {
    const orderA = LAYERING_ORDER[a.id] || 0;
    const orderB = LAYERING_ORDER[b.id] || 0;
    return orderA - orderB;
  });

  return (
    <div className={`relative w-full h-full bg-gray-50 flex items-center justify-center p-4 ${className || ''}`}>
      <div className="relative inline-block max-w-full">
        <img
          src={previewImage}
          alt="Room preview"
          className="max-w-full h-auto max-h-[360px] md:max-h-[420px] object-contain rounded-xl bg-white shadow-sm block"
        />

        {selected.length === 0 && !backgroundImage && (
          <div className="absolute left-1/2 bottom-6 z-10 -translate-x-1/2 rounded-full bg-white/90 px-4 py-2 text-xs text-gray-500 shadow-sm whitespace-nowrap">
            Your room, unfurnished
          </div>
        )}

        <AnimatePresence>
          {!backgroundImage && sortedSelected.map((item) => (
            <motion.img
              key={item.id}
              src={item.image}
              alt={item.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              style={{ position: 'absolute', ...item.position }}
              className="pointer-events-none"
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ArixRoomCanvas;
