import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpDown, ChevronDown } from 'lucide-react';

const SortDropdown = ({ value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = options.find(o => o.value === value) || options[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-[#d1d5db] rounded-full bg-white shadow-sm hover:border-[#0f4c3a]/40 transition-all text-[12px] font-semibold text-[#111827] whitespace-nowrap"
      >
        <ArrowUpDown size={12} className="text-[#9ca3af]" />
        {selected.label}
        <ChevronDown size={12} className={`text-[#9ca3af] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0.6 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0.6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-1.5 bg-white border border-[#e5e7eb] rounded-xl shadow-xl min-w-[180px] z-50 py-1 origin-top"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-colors ${
                  value === opt.value
                    ? 'bg-[#0f4c3a]/5 text-[#111827] font-semibold'
                    : 'text-[#4b5563] hover:bg-slate-50'
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

export default SortDropdown;
