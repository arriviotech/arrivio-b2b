import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ArrowRight, Maximize, Calendar, Home as HomeIcon } from 'lucide-react';
import QuickAddBar from '../proposal/QuickAddBar';

const UnitTypeCard = ({
  property,
  units = [],
  unitTypeKey,
  title,
  description,
  icon: Icon,
  image,
}) => {
  const finalImage = image || property?.image;
  const navigate = useNavigate();
  const [showUnits, setShowUnits] = useState(false);
  const slug = property.slug || property.id;

  const availableUnits = units.filter((u) => u.status === 'available');
  const maxAvailable = availableUnits.length;
  const totalUnits = units.length;
  const ratio = totalUnits > 0 ? maxAvailable / totalUnits : 0;

  // Availability badge — green when any available, red when none
  const isAvailable = maxAvailable > 0;
  const availabilityTone = isAvailable
    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
    : 'bg-red-50 text-red-600 border-red-100';
  const availabilityLabel = isAvailable
    ? `${maxAvailable} of ${totalUnits} available`
    : 'Not available';
  const availabilityDotColor = isAvailable ? 'bg-emerald-500' : 'bg-red-500';

  // Cheapest price (prefer b2b)
  const allPricing = units.flatMap((u) => u.unit_pricing_rules || []);
  const b2bPricing = allPricing.filter((p) => p.tenant_type === 'b2b');
  const pool = b2bPricing.length > 0 ? b2bPricing : allPricing;
  const cheapestCents = pool.length > 0 ? Math.min(...pool.map((p) => p.monthly_rent_cents)) : 0;
  const fromPrice = cheapestCents / 100;

  // Size range across same-type units
  const sizes = units.map((u) => Number(u.size_sqm)).filter(Boolean);
  const sizeRange =
    sizes.length === 0
      ? null
      : Math.min(...sizes) === Math.max(...sizes)
        ? `${Math.min(...sizes)} m²`
        : `${Math.min(...sizes)}–${Math.max(...sizes)} m²`;

  // Furnished consensus
  const isFurnished = units.length > 0 && units.every((u) => u.is_furnished !== false);

  // Min stay
  const stayRules = allPricing.filter((p) => p.min_stay_months);
  const minStay = stayRules.length > 0 ? Math.min(...stayRules.map((p) => p.min_stay_months)) : null;

  // Amenities common to ALL units of this type (intersection)
  const allAmenityNames = [
    ...new Set(
      units.flatMap((u) => (u.unit_amenities || []).map((ua) => ua.amenity_catalogue?.name).filter(Boolean))
    ),
  ];
  const amenityNames = allAmenityNames.filter((name) =>
    units.every((u) => (u.unit_amenities || []).some((ua) => ua.amenity_catalogue?.name === name))
  );

  if (units.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 p-5">
        {/* Image block — real photo if available, otherwise icon fallback */}
        <div className="w-full sm:w-32 h-32 rounded-xl bg-gradient-to-br from-[#0f4c3a]/10 to-[#0f4c3a]/5 flex items-center justify-center shrink-0 overflow-hidden">
          {finalImage ? (
            <img src={finalImage} alt={title} className="w-full h-full object-cover" />
          ) : Icon ? (
            <Icon className="text-[#0f4c3a]/60" size={42} strokeWidth={1.2} />
          ) : null}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
            <div className="min-w-0">
              <h3 className="text-[18px] font-bold text-[#111827] leading-tight">{title}</h3>
              {description && <p className="text-[12px] text-[#6b7280] mt-0.5">{description}</p>}
            </div>
            <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
              <div>
                <span className="text-[10px] text-[#9ca3af] font-medium">from </span>
                <span className="font-bold text-lg text-[#0f4c3a]">€{fromPrice.toLocaleString()}</span>
                <span className="text-[#9ca3af] text-[12px]"> /mo</span>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold ${availabilityTone}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${availabilityDotColor}`}></span>
                {availabilityLabel}
              </span>
            </div>
          </div>

          {/* Meta chips */}
          <div className="flex flex-wrap gap-2 mt-3">
            {sizeRange && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#f7f7f7] text-[11px] text-[#374151]">
                <Maximize size={11} className="text-[#9ca3af]" />
                {sizeRange}
              </span>
            )}
            {isFurnished && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#f7f7f7] text-[11px] text-[#374151]">
                <HomeIcon size={11} className="text-[#9ca3af]" />
                Furnished
              </span>
            )}
            {minStay && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#f7f7f7] text-[11px] text-[#374151]">
                <Calendar size={11} className="text-[#9ca3af]" />
                {minStay}+ mo stay
              </span>
            )}
            {amenityNames.map((name) => (
              <span key={name} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#f7f7f7] text-[11px] text-[#374151]">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Quick add — primary action */}
      <div className="px-5 pb-4">
        <QuickAddBar
          property={property}
          units={units}
          unitTypeKey={unitTypeKey}
          formattedTitle={title}
        />
      </div>

      {/* Browse specific units (collapsed by default) — shown even when none are available */}
      {units.length > 0 && (
        <>
          <button
            onClick={() => setShowUnits((prev) => !prev)}
            className="w-full px-5 py-3 border-t border-[#f2f2f2] flex items-center justify-between hover:bg-[#f7f7f7]/50 transition-colors text-left"
          >
            <span className="text-[11px] font-bold text-[#0f4c3a] uppercase tracking-widest">
              Browse {units.length} specific {units.length === 1 ? 'unit' : 'units'}
            </span>
            <ChevronDown
              size={14}
              className={`text-[#9ca3af] transition-transform ${showUnits ? 'rotate-180' : ''}`}
            />
          </button>

          {showUnits && (
            <div className="border-t border-[#f2f2f2] animate-in fade-in slide-in-from-top-1 duration-200">
              {/* Column headers */}
              <div className="flex items-center px-5 py-2 bg-[#f7f7f7] text-[10px] font-bold uppercase tracking-widest text-[#9ca3af]">
                <span className="flex-1">Unit</span>
                <span className="w-20 text-center hidden sm:block">Size</span>
                <span className="w-16 text-center hidden sm:block">Floor</span>
                <span className="w-16 text-center">Status</span>
                <span className="w-8"></span>
              </div>
              {units.map((unit) => (
                <div
                  key={unit.id}
                  onClick={() => navigate(`/property/${slug}/unit/${unit.id}`)}
                  className="flex items-center px-5 py-3 border-t border-[#f2f2f2] hover:bg-[#0f4c3a]/[0.02] cursor-pointer group"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-[13px] font-semibold text-[#111827]">
                      {title.split(' ')[0]} {unit.unit_number}
                    </span>
                    {unit.tier && unit.tier !== 'standard' && (
                      <span
                        className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                          unit.tier === 'premium'
                            ? 'bg-gradient-to-r from-[#B8860B] to-[#DAA520] text-white'
                            : 'bg-[#0f4c3a] text-white'
                        }`}
                      >
                        {unit.tier}
                      </span>
                    )}
                  </div>
                  <span className="w-20 text-center text-[12px] text-[#6b7280] hidden sm:block">
                    {unit.size_sqm ? `${unit.size_sqm} m²` : '–'}
                  </span>
                  <span className="w-16 text-center text-[12px] text-[#6b7280] hidden sm:block">
                    {unit.floor !== null && unit.floor !== undefined ? unit.floor : '–'}
                  </span>
                  <span className="w-16 flex justify-center">
                    <span className={`w-2 h-2 rounded-full ${unit.status === 'available' ? 'bg-[#22C55E]' : 'bg-[#EA4335]'}`}></span>
                  </span>
                  <span className="w-8 flex justify-end">
                    <ArrowRight size={14} className="text-[#d1d5db] group-hover:text-[#0f4c3a] group-hover:translate-x-0.5 transition-all" />
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UnitTypeCard;
