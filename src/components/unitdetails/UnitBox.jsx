import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Info, Building2, Minus, Plus, Check, Trash2,
  Maximize, Layers, Users, Home as HomeIcon, ArrowRight,
  Wifi, Zap, Flame, Sparkles,
} from 'lucide-react';
import { useArixDesigner } from '../../context/ArixDesignerContext';
import { ARIX_ENABLED } from '../../App';

// Universal "All bills included" bundle for B2B housing.
// TODO: pull from Supabase if/when included-utilities data is modeled per unit.
const BILLS_INCLUDED = [
  { icon: Wifi, label: 'WiFi' },
  { icon: Zap, label: 'Utilities' },
  { icon: Flame, label: 'Heating' },
  { icon: Sparkles, label: 'Cleaning' },
];

// Map type → plural label for the CTA ("Add Studios", "Add Single Rooms", …)
const pluralizeType = (formattedTitle) => {
  if (!formattedTitle) return 'units';
  if (formattedTitle.endsWith('s')) return formattedTitle;
  return `${formattedTitle}s`;
};

const UnitBox = ({
  unit,
  property,
  formattedTitle,
  unitPrice,
  totalAvailable,
  quantity,
  setQuantity,
  handleAddToProposal,
  handleRemoveFromProposal,
  existingReservation,
}) => {
  const navigate = useNavigate();
  const { openModal: openArixModal } = useArixDesigner();
  const isUnavailable = totalAvailable === 0;
  const subtotal = Math.round(unitPrice * quantity);
  const sampleLabel = unit?.unit_number ? `Unit ${unit.unit_number}` : null;

  const handleOpenArix = () => {
    openArixModal({
      propertyId: property.id,
      propertyName: property.name,
      roomType: formattedTitle,
    });
  };

  // State machine driven by intent (matches QuickAddBar)
  const currentQty = existingReservation?.quantity || 0;
  const isInProposal = currentQty > 0;
  const wantsToRemove = isInProposal && quantity === 0;
  const wantsToAdd = !isInProposal && quantity > 0;
  const wantsToUpdate = isInProposal && quantity > 0 && quantity !== currentQty;
  const isSaved = isInProposal && quantity === currentQty;
  const buttonDisabled = isUnavailable || (!wantsToRemove && !wantsToAdd && !wantsToUpdate);

  const handleClick = () => {
    if (wantsToRemove) {
      handleRemoveFromProposal && handleRemoveFromProposal();
      return;
    }
    if (wantsToAdd || wantsToUpdate) {
      handleAddToProposal && handleAddToProposal();
    }
  };

  const specs = [
    unit?.size_sqm && { icon: Maximize, label: 'Size', value: `${unit.size_sqm} m²` },
    (unit?.floor !== null && unit?.floor !== undefined) && {
      icon: Layers,
      label: 'Floor',
      value: unit.floor === 0 ? 'Ground' : `${unit.floor}${unit.floor === 1 ? 'st' : unit.floor === 2 ? 'nd' : unit.floor === 3 ? 'rd' : 'th'}`,
    },
    unit?.max_occupants && { icon: Users, label: 'Occupants', value: `${unit.max_occupants} ${unit.max_occupants === 1 ? 'person' : 'people'}` },
    unit?.is_furnished && { icon: HomeIcon, label: 'Setup', value: 'Furnished' },
  ].filter(Boolean);

  const ctaLabelAdd = `Add ${pluralizeType(formattedTitle)}`;

  return (
    <div className="sticky top-28">
      <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden">

        {/* Unit type identity- lead with TYPE, sample is secondary */}
        <div className="px-7 pt-7 pb-5 border-b border-gray-100">
          <div className="flex items-start justify-between gap-3 mb-1">
            <h2 className="text-xl font-serif font-bold text-[#111827] leading-tight">{formattedTitle}</h2>
            {unit?.tier && unit.tier !== 'standard' && (
              <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest shrink-0 ${unit.tier === 'premium' ? 'bg-gradient-to-r from-[#B8860B] to-[#DAA520] text-white' : 'bg-[#0f4c3a] text-white'
                }`}>
                {unit.tier}
              </span>
            )}
          </div>
          {sampleLabel && (
            <p className="text-xs text-gray-500">Sample shown: <span className="font-semibold text-gray-700">{sampleLabel}</span></p>
          )}
        </div>

        {/* Type-level reservation banner */}
        <div className="px-7 py-3 bg-[#0f4c3a]/5 border-b border-[#0f4c3a]/10 flex items-start gap-2">
          <Info size={14} className="text-[#0f4c3a] mt-0.5 shrink-0" />
          <p className="text-[11px] text-gray-600 leading-relaxed">
            Your proposal reserves <span className="font-bold text-[#0f4c3a]">any available {formattedTitle.toLowerCase()}</span> at this property. Final unit assignment is confirmed on the call.
          </p>
        </div>

        {/* Sample specs grid */}
        {specs.length > 0 && (
          <div className="grid grid-cols-2 border-b border-gray-100">
            {specs.map(({ icon: Icon, label, value }, i) => (
              <div
                key={label}
                className={`px-7 py-4 flex items-center gap-3 ${i % 2 === 0 ? 'border-r border-gray-100' : ''} ${i < 2 ? 'border-b border-gray-100' : ''}`}
              >
                <Icon size={16} className="text-[#9ca3af] shrink-0" />
                <div className="min-w-0">
                  <div className="text-[9px] font-bold uppercase tracking-widest text-[#9ca3af] leading-none mb-1">{label}</div>
                  <div className="text-[13px] font-bold text-gray-900 leading-none truncate">{value}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Price block- muted when unavailable */}
        <div className={`px-7 pt-6 pb-3 ${isUnavailable ? 'opacity-50' : ''}`}>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-bold text-[#111827]">€{unitPrice.toLocaleString()}</span>
            <span className="text-gray-500 text-sm">/ month each</span>
          </div>
          <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-3">All bills included</p>

          {/* Bills-included pills */}
          <div className="flex flex-wrap gap-1.5">
            {BILLS_INCLUDED.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#0f4c3a]/5 text-[10px] font-semibold text-[#0f4c3a]"
              >
                <Icon size={10} strokeWidth={2.5} />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Availability- small pill when available; bold stamp when fully booked */}
        {!isUnavailable && (
          <div className="px-7 pt-2 pb-5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold bg-emerald-50 text-emerald-700 border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {totalAvailable} {totalAvailable === 1 ? 'unit' : 'units'} available
            </div>
          </div>
        )}
        {isUnavailable && (
          <div className="px-7 pt-2 pb-5">
            <div className="relative rounded-xl border-2 border-red-200 bg-red-50/60 p-4 overflow-hidden">
              {/* Subtle diagonal stripes for "stamp" feel */}
              <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(45deg, #dc2626 0, #dc2626 6px, transparent 6px, transparent 14px)',
                }}
              />
              <div className="relative flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-red-700">Fully Booked</span>
              </div>
              <p className="relative text-xs text-red-900/80 leading-snug">
                All {formattedTitle.toLowerCase()}s at this property are currently reserved.
              </p>
            </div>
          </div>
        )}

        {/* Stepper + CTA- only when available */}
        {!isUnavailable && (
          <div className="px-7 pb-7 space-y-4">
            <div className="border border-gray-200 bg-[#fbfbfb] rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Building2 size={20} strokeWidth={1.5} className="text-gray-400" />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-gray-500 tracking-widest uppercase mb-0.5">Units needed</span>
                    <span className="font-bold text-gray-800 text-sm">{quantity} {quantity === 1 ? 'unit' : 'units'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(0, quantity - 1))}
                    disabled={quantity <= 0}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Minus size={14} />
                  </button>
                  <button
                    onClick={() => setQuantity(Math.min(totalAvailable, quantity + 1))}
                    disabled={quantity >= totalAvailable}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Live subtotal */}
            {quantity > 0 && (
              <div className="flex items-baseline justify-between px-1">
                <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Subtotal</span>
                <span className="text-lg font-bold text-[#0f4c3a]">€{subtotal.toLocaleString()}<span className="text-xs font-normal text-gray-400"> /mo</span></span>
              </div>
            )}

            <button
              onClick={handleClick}
              disabled={buttonDisabled}
              className={`w-full py-4 rounded-xl font-bold text-sm tracking-wide uppercase transition-all flex items-center justify-center gap-2 ${wantsToRemove
                  ? 'border border-red-300 text-red-600 hover:bg-red-50'
                  : isSaved
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                    : wantsToAdd || wantsToUpdate
                      ? 'bg-[#0f4c3a] hover:bg-[#0a3a2b] text-white shadow-lg shadow-[#0f4c3a]/10'
                      : 'bg-[#e5e4e0] text-gray-400 cursor-not-allowed'
                }`}
            >
              {wantsToRemove ? (
                <>
                  <Trash2 size={16} />
                  Remove from Proposal
                </>
              ) : isSaved ? (
                <>
                  <Check size={16} strokeWidth={3} />
                  Saved
                </>
              ) : wantsToUpdate ? (
                'Update Proposal'
              ) : (
                ctaLabelAdd
              )}
            </button>

            {quantity === 0 && !isInProposal && (
              <p className="text-center text-xs text-gray-400">Select at least 1 unit to continue</p>
            )}

            {/* Arix entry point- gold text link, only after the user has picked at least 1 unit */}
            {ARIX_ENABLED && quantity > 0 && (
              <button
                onClick={handleOpenArix}
                className="w-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-[#DAA520] hover:text-[#B8860B] py-2 transition-colors"
              >
                <Sparkles size={14} strokeWidth={2.5} />
                Customize this space with Arix
              </button>
            )}
          </div>
        )}

        {/* Unavailable state- actionable */}
        {isUnavailable && (
          <div className="px-7 pb-7 space-y-2">
            <p className="text-[11px] text-gray-500 text-center mb-4">
              Try other units at this property or explore similar listings.
            </p>
            <button
              onClick={() => navigate(`/property/${property.slug || property.id}`)}
              className="w-full py-3.5 rounded-xl bg-[#0f4c3a] hover:bg-[#0a3a2b] text-white font-bold text-xs uppercase tracking-widest shadow-sm hover:shadow-md transition-all"
            >
              Back to {property.name}
            </button>
            <button
              onClick={() => navigate('/properties')}
              className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-xs uppercase tracking-widest transition-colors"
            >
              Browse all properties
            </button>
          </div>
        )}
      </div>

      <p className="mt-6 text-center text-[13px] text-[#4b5563] italic leading-relaxed px-4 opacity-80">
        Arrivio Direct: As the property owner, we charge no commissions. Your application is handled directly by our resident support team.
      </p>
    </div>
  );
};

export default UnitBox;
