import React from 'react';
import { MapPin } from 'lucide-react';

// Simplified header — title + location only.
// Floor / size / occupants now live in the right sidebar (UnitBox).
const UnitStats = ({ property, formattedTitle, unit }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3 flex-wrap">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-[#111827] leading-tight tracking-tight">
          {formattedTitle}
        </h1>
        {unit?.tier && unit.tier !== 'standard' && (
          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
            unit.tier === 'premium' ? 'bg-gradient-to-r from-[#B8860B] to-[#DAA520] text-white' : 'bg-[#0f4c3a] text-white'
          }`}>
            {unit.tier}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 text-[#4b5563]">
        <MapPin size={14} className="text-[#6b7280]" />
        <span className="text-[13px] font-medium">
          {property.neighborhood || property.district}, {property.city}
        </span>
        <span className="text-[#d1d5db]">·</span>
        <span className="text-[13px] text-[#6b7280]">{property.name}</span>
      </div>
    </div>
  );
};

export default UnitStats;
