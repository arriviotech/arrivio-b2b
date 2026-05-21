import React from 'react';
import { MapPin, Minus, Plus, Trash2, ChevronRight } from 'lucide-react';

const PropertyCard = ({ property, navigate, updateQuantity, removeReservation }) => {
  const housingUnits = property.units.filter(u => u.unitPrice > 0);
  if (housingUnits.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Compact header */}
      <button
        onClick={() => navigate(`/property/${property.slug || property.id}`)}
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors text-left group"
      >
        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-gray-100">
          <img src={property.image} alt={property.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
        </div>
        <div className="flex-grow min-w-0">
          <h3 className="text-base font-bold text-gray-900 truncate group-hover:text-[#0f4c3a] transition-colors">{property.name}</h3>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
            <MapPin size={11} />
            <span className="truncate">{property.neighborhood ? `${property.neighborhood}, ` : ''}{property.city}</span>
          </div>
        </div>
        <ChevronRight size={18} className="text-gray-300 group-hover:text-[#0f4c3a] group-hover:translate-x-1 transition-all shrink-0" />
      </button>

      {/* Unit rows */}
      <div className="border-t border-gray-100 divide-y divide-gray-100 bg-gray-50/40">
        {housingUnits.map(unit => {
          const remaining = unit.maxAvailable > 0 ? unit.maxAvailable - unit.quantity : null;
          const badgeTone = remaining === null
            ? null
            : remaining <= 0
              ? 'bg-red-50 text-red-600 border-red-100'
              : remaining <= 2
                ? 'bg-amber-50 text-amber-700 border-amber-100'
                : 'bg-emerald-50 text-emerald-700 border-emerald-100';
          const badgeLabel = remaining === null
            ? null
            : remaining <= 0
              ? `${unit.maxAvailable} of ${unit.maxAvailable} · max reached`
              : `${unit.quantity} of ${unit.maxAvailable} available`;
          const subtotal = Math.round(unit.unitPrice * unit.quantity);

          return (
            <div key={unit.unitType} className="px-5 py-4">
              {/* Top row: name + stepper + subtotal + remove */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex-grow min-w-0">
                  <div className="text-sm font-bold text-gray-900 truncate">{unit.unitType}</div>
                </div>

                <div className="flex items-center bg-white rounded-lg border border-gray-200 overflow-hidden shrink-0">
                  <button
                    onClick={() => updateQuantity(unit.propertyId, unit.unitType, unit.quantity - 1)}
                    disabled={unit.quantity <= 1}
                    className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                    title={unit.quantity <= 1 ? 'Use trash to remove' : 'Decrease'}
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-9 text-center text-sm font-bold text-gray-900 py-1.5 border-x border-gray-200">
                    {unit.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(unit.propertyId, unit.unitType, unit.quantity + 1)}
                    disabled={unit.maxAvailable > 0 && unit.quantity >= unit.maxAvailable}
                    className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                    title={unit.maxAvailable > 0 && unit.quantity >= unit.maxAvailable ? 'Max available reached' : 'Increase'}
                  >
                    <Plus size={12} />
                  </button>
                </div>

                <div className="hidden md:block text-right shrink-0 min-w-[80px]">
                  <div className="text-sm font-bold text-[#0f4c3a]">
                    €{subtotal.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-gray-400 -mt-0.5">/mo</div>
                </div>

                <button
                  onClick={() => removeReservation(unit.propertyId, unit.unitType)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                  title="Remove"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Bottom row: price + availability badge */}
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                <span>
                  €{unit.unitPrice.toLocaleString()}
                  <span className="text-gray-400"> /mo each</span>
                </span>
                {badgeLabel && (
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-bold ${badgeTone}`}>
                    {badgeLabel}
                  </span>
                )}
                {/* mobile-only subtotal (since desktop one is in top row) */}
                <span className="md:hidden ml-auto font-bold text-[#0f4c3a]">
                  €{subtotal.toLocaleString()}<span className="text-gray-400 font-normal">/mo</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PropertyCard;
