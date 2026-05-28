import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, ChevronDown } from 'lucide-react';
import { createPortal } from 'react-dom';

const PriceHistogram = ({ min, max, value, onChange, properties }) => {
  const [range, setRange] = useState(value);

  const buckets = 20;
  const step = (max - min) / buckets;
  const distribution = new Array(buckets).fill(0);
  properties.forEach(p => {
    const bucket = Math.min(Math.floor((p.price - min) / step), buckets - 1);
    if (bucket >= 0) distribution[bucket]++;
  });
  const maxCount = Math.max(...distribution, 1);

  useEffect(() => { setRange(value); }, [value]);

  const handleMin = (e) => {
    const val = Number(e.target.value);
    const newMin = Math.min(val, range[1] - 1);
    setRange([newMin, range[1]]);
    onChange([newMin, range[1]]);
  };
  const handleMax = (e) => {
    const val = Number(e.target.value);
    const newMax = Math.max(val, range[0] + 1);
    setRange([range[0], newMax]);
    onChange([range[0], newMax]);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-bold text-[#111827]">
          €{range[0]}- €{range[1]}+
        </span>
        <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">EUR / month</span>
      </div>

      {/* Histogram */}
      <div className="flex items-end gap-[2px] h-12 mb-2">
        {distribution.map((count, i) => {
          const height = (count / maxCount) * 100;
          const inRange = (min + i * step) >= range[0] && (min + i * step) <= range[1];
          return (
            <div
              key={i}
              className={`flex-1 rounded-t-sm transition-all duration-300 ${inRange ? 'bg-[#0f4c3a]' : 'bg-gray-200'}`}
              style={{ height: `${Math.max(height, 4)}%` }}
            />
          );
        })}
      </div>

      {/* Range track */}
      <div className="relative h-1 bg-gray-200 rounded-full">
        <div
          className="absolute h-full bg-[#0f4c3a] rounded-full"
          style={{
            left: `${((range[0] - min) / (max - min)) * 100}%`,
            right: `${100 - ((range[1] - min) / (max - min)) * 100}%`
          }}
        />
      </div>

      {/* Dual thumbs */}
      <div className="relative">
        <input type="range" min={min} max={max} value={range[0]} onChange={handleMin}
          className="absolute -top-1 left-0 w-full h-1 bg-transparent appearance-none cursor-pointer pointer-events-none z-10 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#0f4c3a] [&::-webkit-slider-thumb]:shadow-md" />
        <input type="range" min={min} max={max} value={range[1]} onChange={handleMax}
          className="absolute -top-1 left-0 w-full h-1 bg-transparent appearance-none cursor-pointer pointer-events-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#0f4c3a] [&::-webkit-slider-thumb]:shadow-md" />
      </div>

      {/* Min/Max inputs */}
      <div className="flex items-center gap-3 mt-6">
        <div className="flex-1 border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-1 focus-within:ring-[#0f4c3a] focus-within:border-[#0f4c3a] transition-all">
          <label className="text-[10px] text-gray-400 block">Min</label>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-400">€</span>
            <input type="number" value={range[0]} onChange={handleMin}
              className="w-full text-sm font-bold text-[#111827] outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
          </div>
        </div>
        <div className="w-3 h-px bg-gray-300" />
        <div className="flex-1 border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-1 focus-within:ring-[#0f4c3a] focus-within:border-[#0f4c3a] transition-all">
          <label className="text-[10px] text-gray-400 block">Max</label>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-400">€</span>
            <input type="number" value={range[1]} onChange={handleMax}
              className="w-full text-sm font-bold text-[#111827] outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
          </div>
        </div>
      </div>
    </div>
  );
};

const CityDropdown = ({ value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find(o => o.value === value);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-2 py-2.5 pl-9 pr-3 rounded-xl border text-xs font-semibold transition-all ${isOpen ? 'ring-1 ring-[#0f4c3a]/10 shadow-md border-[#0f4c3a]/20' : 'border-[#e5e7eb] hover:border-[#9ca3af]'
          }`}
      >
        <MapPin size={14} className="absolute left-3 text-[#9ca3af]" />
        <span className={selected?.value !== 'All' ? 'text-[#111827]' : 'text-[#9ca3af]'}>
          {selected?.label || 'Select city...'}
        </span>
        <ChevronDown size={12} className={`ml-auto text-[#9ca3af] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#e5e7eb] rounded-xl shadow-xl z-50 py-1 max-h-60 overflow-y-auto"
          >
            {options.map(opt => (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-colors ${value === opt.value ? 'bg-[#0f4c3a]/5 text-[#111827] font-semibold' : 'text-[#4b5563] hover:bg-slate-50'
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FilterSidePanel = ({
  isOpen,
  onClose,
  selectedCity,
  onCityChange,
  cityOptions,
  priceRange,
  onPriceChange,
  properties,
  onClearAll,
  roomTypeOptions = [],
  selectedRoomTypes,
  onToggleRoomType,
}) => {
  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9998]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/20"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute right-0 top-0 bottom-0 w-full max-w-[420px] bg-white border-l border-slate-200 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-[#111827]">Filters</h2>
              <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {/* Location */}
              <div className="pb-6 border-b border-slate-100">
                <h3 className="text-sm font-bold text-[#111827] mb-4">Location</h3>
                <CityDropdown value={selectedCity} options={cityOptions} onChange={onCityChange} />
              </div>

              {/* Price */}
              <div className="pb-6 border-b border-slate-100">
                <h3 className="text-sm font-bold text-[#111827] mb-4">Price Range</h3>
                <PriceHistogram min={0} max={2000} value={priceRange} onChange={onPriceChange} properties={properties} />
              </div>

              {/* Room type */}
              {roomTypeOptions.length > 0 && (
                <div className="pb-6 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-[#111827] mb-4">Room type</h3>
                  <div className="flex flex-wrap gap-2">
                    {roomTypeOptions.map(({ key, label }) => {
                      const isActive = selectedRoomTypes?.has(key);
                      return (
                        <button
                          key={key}
                          onClick={() => onToggleRoomType(key)}
                          className={`px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all border ${
                            isActive
                              ? 'border-[#0f4c3a] bg-[#0f4c3a] text-white shadow-sm'
                              : 'border-[#e5e7eb] bg-white text-[#374151] hover:border-[#0f4c3a]/40'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-2.5 border-t border-slate-100 flex items-center justify-between bg-white">
              <button onClick={onClearAll} className="text-xs font-semibold text-slate-400 hover:text-[#111827] transition-colors">
                Clear all
              </button>
              <button onClick={onClose} className="px-6 py-2 rounded-lg bg-[#0f4c3a] text-xs font-bold text-white shadow-sm hover:shadow-md transition-all">
                Show results
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default FilterSidePanel;
