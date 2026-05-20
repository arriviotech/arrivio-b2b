import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MapPin, DoorOpen, Ruler, ArrowRight, Home } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isWishlisted = isInWishlist(property.id);

  const handleHeartClick = (e) => {
    e.stopPropagation();
    toggleWishlist(property);
  };

  const handleClick = () => {
    navigate(`/property/${property.slug || property.id}`);
  };

  const availableCount = property.availableUnits || 0;
  const isAvailable = availableCount > 0;
  const breakdown = property.breakdown || {};
  const unitTypes = Object.entries(breakdown).filter(([, count]) => count > 0);
  const typeLabels = { studio: 'Studio', one_bedroom: 'One Bed', two_bedroom: 'Two Bed', shared_room: 'Shared' };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-2xl border border-[#e5e7eb] hover:border-[#0f4c3a]/20 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden flex flex-col h-full"
    >
      {/* Image — compact 16:9 */}
      <div className="relative aspect-[16/9] overflow-hidden bg-[#f0f0f0]">
        {property.image ? (
          <img
            src={property.image}
            alt={property.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#d1d5db]">
            <Home size={40} />
          </div>
        )}

        {/* Availability badge — top left */}
        <div className="absolute top-3 left-3">
          {isAvailable ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[10px] font-bold text-[#16a34a] shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]"></span>
              </span>
              {availableCount} available
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[10px] font-bold text-[#EA4335] shadow-sm">
              <span className="inline-flex rounded-full h-2 w-2 bg-[#EA4335]"></span>
              Fully booked
            </span>
          )}
        </div>

        {/* Heart — top right */}
        <button
          className={`absolute top-3 right-3 z-10 p-2 rounded-full shadow-sm transition-transform hover:scale-110 ${
            isWishlisted ? 'bg-rose-50' : 'bg-white/95 backdrop-blur-sm'
          }`}
          onClick={handleHeartClick}
        >
          <Heart
            size={16}
            className={`transition-colors ${
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-[#6b7280] group-hover:text-red-500'
            }`}
          />
        </button>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-grow">

        {/* Title + Location */}
        <h3 className="font-heading text-[16px] font-semibold text-[#111827] leading-tight mb-1.5 line-clamp-1">
          {property.name}
        </h3>
        <p className="flex items-center gap-1 text-[12px] text-[#4b5563] mb-3">
          <MapPin size={12} className="text-[#6b7280]" />
          {property.neighborhood || property.district}{property.city ? `, ${property.city}` : ''}
        </p>

        {/* Unit type breakdown — pill badges */}
        {unitTypes.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {unitTypes.map(([type, count]) => (
              <span
                key={type}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#f2f2f2] text-[11px] text-[#374151]"
              >
                <span className="font-bold text-[#111827]">{count}</span>
                <span className="text-[#9ca3af]">×</span>
                <span className="font-medium">{typeLabels[type] || type.replace(/_/g, ' ')}</span>
              </span>
            ))}
          </div>
        )}

        {/* Metrics row */}
        <div className="flex items-center gap-3 text-[12px] text-[#6b7280] mb-4">
          {property.totalUnits > 0 && (
            <span className="flex items-center gap-1.5">
              <DoorOpen size={14} className="text-[#9ca3af]" />
              <span className="font-semibold text-[#374151]">{property.totalUnits}</span> units
            </span>
          )}
          {property.totalUnits > 0 && property.details?.size && (
            <span className="text-[#d1d5db]">·</span>
          )}
          {property.details?.size && (
            <span className="flex items-center gap-1.5">
              <Ruler size={14} className="text-[#9ca3af]" />
              <span className="font-semibold text-[#374151]">{property.details.size}</span> m²
            </span>
          )}
        </div>

        {/* Price + CTA */}
        <div className="mt-auto pt-4 border-t border-[#f2f2f2] flex items-center justify-between pb-1">
          <div>
            <span className="text-[10px] text-[#9ca3af] font-medium">from </span>
            <span className="text-lg font-bold text-[#111827]">€{property.price?.toLocaleString()}</span>
            <span className="text-[10px] text-[#9ca3af] font-medium"> /mo</span>
          </div>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-[#0f4c3a] group-hover:gap-2 transition-all">
            View details <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
