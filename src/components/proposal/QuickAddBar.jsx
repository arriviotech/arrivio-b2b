import React, { useState, useEffect } from 'react';
import { Minus, Plus, Check, Trash2 } from 'lucide-react';
import { useReservation } from '../../context/ReservationContext';

const UNIT_TYPE_LABELS = {
  studio: 'Studio',
  one_bedroom: 'Single Room',
  shared_room: 'Shared Room',
};

const QuickAddBar = ({
  property,
  units = [],
  unitTypeKey,
  formattedTitle: customTitle,
  compact = false,
}) => {
  const { reservations, addReservation, removeReservation } = useReservation();
  const formattedTitle = customTitle || UNIT_TYPE_LABELS[unitTypeKey] || unitTypeKey;
  const existing = reservations.find(
    (r) => r.propertyId === property.id && r.unitType === formattedTitle
  );

  const [qty, setQty] = useState(existing?.quantity || 0);

  // Live counts
  const availableUnits = units.filter((u) => u.status === 'available');
  const maxAvailable = availableUnits.length;

  // Cheapest price (prefer b2b)
  const allPricing = units.flatMap((u) => u.unit_pricing_rules || []);
  const b2bPricing = allPricing.filter((p) => p.tenant_type === 'b2b');
  const pool = b2bPricing.length > 0 ? b2bPricing : allPricing;
  const cheapestCents = pool.length > 0 ? Math.min(...pool.map((p) => p.monthly_rent_cents)) : 0;
  const unitPrice = cheapestCents / 100;
  const subtotal = Math.round(unitPrice * qty);

  // Re-sync if the reservation changes elsewhere (e.g. user removes from Proposal page)
  useEffect(() => {
    setQty(existing?.quantity || 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing?.quantity]);

  if (maxAvailable === 0) return null;

  const stop = (e) => e.stopPropagation();

  const currentQty = existing?.quantity || 0;
  const isInProposal = currentQty > 0;
  const wantsToRemove = isInProposal && qty === 0;
  const wantsToAdd = !isInProposal && qty > 0;
  const wantsToUpdate = isInProposal && qty > 0 && qty !== currentQty;
  const isSaved = isInProposal && qty === currentQty;
  const buttonDisabled = !wantsToRemove && !wantsToAdd && !wantsToUpdate;

  const handleClick = (e) => {
    stop(e);
    if (wantsToRemove) {
      removeReservation(property.id, formattedTitle);
      return;
    }
    if (wantsToAdd || wantsToUpdate) {
      addReservation(
        {
          propertyId: property.id,
          propertySlug: property.slug,
          propertyName: property.name,
          propertyCity: property.city,
          propertyNeighborhood: property.neighborhood || property.district,
          propertyImage: property.image,
          unitType: formattedTitle,
          unitTypeKey,
          unitPrice,
          quantity: qty,
          maxAvailable,
        },
        true // isUpdate = true → stepper sets absolute qty
      );
    }
  };

  // Shared stepper element
  const stepper = (
    <div className="flex items-center bg-white rounded-lg border border-gray-200 overflow-hidden shrink-0">
      <button
        onClick={(e) => { stop(e); setQty(Math.max(0, qty - 1)); }}
        disabled={qty <= 0}
        className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
      >
        <Minus size={12} />
      </button>
      <span className="w-8 text-center text-sm font-bold text-gray-900 py-1 border-x border-gray-200">{qty}</span>
      <button
        onClick={(e) => { stop(e); setQty(Math.min(maxAvailable, qty + 1)); }}
        disabled={qty >= maxAvailable}
        className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
      >
        <Plus size={12} />
      </button>
    </div>
  );

  // Shared action button
  const actionButton = (
    <button
      onClick={handleClick}
      disabled={buttonDisabled}
      className={`shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-1 ${wantsToRemove
          ? 'border border-red-300 text-red-600 hover:bg-red-50'
          : isSaved
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
            : wantsToAdd || wantsToUpdate
              ? 'bg-[#0f4c3a] hover:bg-[#0a3a2b] text-white'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
    >
      {wantsToRemove ? (
        <><Trash2 size={12} /> Remove</>
      ) : isSaved ? (
        <><Check size={12} strokeWidth={3} /> Saved</>
      ) : wantsToUpdate ? (
        'Update'
      ) : (
        'Add'
      )}
    </button>
  );

  // Compact mode- 2-row layout (info on top, actions on bottom), gentle container
  if (compact) {
    return (
      <div onClick={stop} className="p-3 rounded-lg bg-white border border-gray-100 hover:border-[#0f4c3a]/20 transition-colors">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="min-w-0 flex-grow">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-gray-900 truncate">{formattedTitle}</span>
              {isInProposal && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-[#0f4c3a] text-white text-[8px] font-bold tracking-wider uppercase">
                  In Proposal
                </span>
              )}
            </div>
            <div className="text-[10px] text-gray-500 mt-0.5">
              €{unitPrice.toLocaleString()}<span className="text-gray-400"> /mo · {maxAvailable} avail</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          {stepper}
          {actionButton}
        </div>
      </div>
    );
  }

  // Non-compact mode- single-row layout (PropertyDetails / UnitTypeCard)
  return (
    <div onClick={stop} className="flex items-center gap-3 p-4 bg-[#0f4c3a]/[0.06] border border-[#0f4c3a]/25 rounded-xl shadow-sm">
      {/* Type label + price/availability */}
      <div className="flex-grow min-w-0">
        <div className="text-sm font-bold text-gray-900 truncate">
          {formattedTitle}
          {isInProposal && (
            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full bg-[#0f4c3a] text-white text-[9px] font-bold tracking-wider uppercase">
              In Proposal
            </span>
          )}
        </div>
        <div className="text-xs text-gray-500">
          €{unitPrice.toLocaleString()}<span className="text-gray-400"> /mo each · {maxAvailable} available</span>
        </div>
      </div>

      {/* Subtotal- desktop only */}
      {qty > 0 && (
        <div className="hidden md:block text-right shrink-0 min-w-[64px]">
          <div className="text-sm font-bold text-[#0f4c3a]">€{subtotal.toLocaleString()}</div>
          <div className="text-[10px] text-gray-400 -mt-0.5">/mo</div>
        </div>
      )}

      {stepper}
      {actionButton}
    </div>
  );
};

export default QuickAddBar;
