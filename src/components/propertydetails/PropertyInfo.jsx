import React from 'react';
import { MapPin, DoorOpen, Ruler, Home } from 'lucide-react';

const PropertyInfo = ({ property }) => {
  const details = property.details;
  const amenities = property.amenities || [];
  const description = property.description || `Designed for modern professionals, this ${property.city} location provides excellent access to local transit, restaurants, and key business districts. It offers a secure, comfortable, and highly functional living environment.`;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#e5e7eb]">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-[#f0f0f0]">
        {property.image ? (
          <img src={property.image} alt={property.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#d1d5db]">
            <Home size={48} />
          </div>
        )}

        {/* Availability badge */}
        {property.availableUnits > 0 && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[10px] font-bold text-[#16a34a] shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]"></span>
              </span>
              {property.availableUnits} available
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Title + Location */}
        <h1 className="text-2xl font-heading font-bold text-[#111827] mb-1.5 tracking-tight">{property.name}</h1>
        <p className="flex items-center gap-1.5 text-[14px] text-[#4b5563] mb-5">
          <MapPin size={14} className="text-[#6b7280]" />
          {property.neighborhood || property.district}{property.city ? `, ${property.city}` : ''}
        </p>

        {/* Quick stats */}
        {details && (
          <div className="flex items-center gap-4 text-[13px] text-[#6b7280] mb-5 pb-5 border-b border-[#f2f2f2]">
            {property.totalUnits > 0 && (
              <span className="flex items-center gap-1.5">
                <DoorOpen size={14} className="text-[#9ca3af]" />
                <span className="font-semibold text-[#374151]">{property.totalUnits}</span> units
              </span>
            )}
            {details.size && (
              <span className="flex items-center gap-1.5">
                <Ruler size={14} className="text-[#9ca3af]" />
                <span className="font-semibold text-[#374151]">{details.size}</span> m²
              </span>
            )}
          </div>
        )}

        {/* About */}
        <h3 className="font-heading font-bold text-[#111827] mb-3 text-[15px]">About this property</h3>
        <p className="text-[14px] text-[#4b5563] leading-relaxed mb-5">
          {description}
        </p>

        {/* Amenities */}
        {amenities.length > 0 && (
          <>
            <div className="border-t border-[#f2f2f2] pt-5">
              <h3 className="font-heading font-bold text-[#111827] mb-3 text-[15px]">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {amenities.map(a => (
                  <span key={a} className="px-3 py-1.5 rounded-lg bg-[#f2f2f2] text-[12px] font-medium text-[#374151]">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PropertyInfo;
