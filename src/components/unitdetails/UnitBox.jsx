import React from 'react';
import { Info, Building2, Minus, Plus, Check } from 'lucide-react';

const UnitBox = ({
  unitPrice,
  totalAvailable,
  quantity,
  setQuantity,
  isAdded,
  handleAddToProposal,
  existingReservation,
}) => {
  const isUnavailable = totalAvailable === 0;
  const subtotal = Math.round(unitPrice * quantity);

  return (
    <div className="sticky top-28">
      <div className="bg-white rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-4xl font-serif text-[#1a2b3c]">€{unitPrice.toLocaleString()}</span>
          <span className="text-gray-500 text-lg">/ month each</span>
        </div>
        <p className="text-[11px] text-gray-400 font-bold tracking-[0.15em] mb-8 uppercase">All bills included</p>

        {/* Availability */}
        <div className={`flex items-center gap-1.5 mb-3 text-[11px] font-bold tracking-widest uppercase ml-1 ${isUnavailable ? 'text-red-500' : 'text-[#0f4c3a]'}`}>
          <Info size={12} />
          {totalAvailable} {totalAvailable === 1 ? 'unit' : 'units'} available
        </div>

        {/* Quantity selector — universal for all unit types */}
        <div className={`border rounded-2xl p-5 mb-3 transition-colors ${isUnavailable ? 'border-gray-100 bg-gray-50 opacity-60' : 'border-gray-200 bg-[#fbfbfb]'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-gray-400">
                <Building2 size={24} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-1">Units Needed</span>
                <span className="font-semibold text-gray-800">{quantity} {quantity === 1 ? 'unit' : 'units'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(0, quantity - 1))}
                disabled={quantity <= 0 || isUnavailable}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
                title="Decrease"
              >
                <Minus size={14} />
              </button>
              <button
                onClick={() => setQuantity(Math.min(totalAvailable, quantity + 1))}
                disabled={quantity >= totalAvailable || isUnavailable}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
                title={quantity >= totalAvailable ? 'Max available reached' : 'Increase'}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Live subtotal */}
        {quantity > 0 && !isUnavailable && (
          <div className="flex items-baseline justify-between mb-5 px-1">
            <span className="text-[11px] font-bold text-gray-500 tracking-widest uppercase">Subtotal</span>
            <span className="text-xl font-bold text-[#0f4c3a]">€{subtotal.toLocaleString()}<span className="text-xs font-normal text-gray-400"> /mo</span></span>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handleAddToProposal}
          disabled={isAdded || quantity === 0 || isUnavailable}
          className={`w-full py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${
            isAdded
              ? 'bg-emerald-600 text-white'
              : isUnavailable
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : quantity > 0
                  ? 'bg-[#0f4c3a] hover:bg-[#0a3a2b] text-white shadow-lg shadow-[#0f4c3a]/10'
                  : 'bg-[#e5e4e0] text-gray-400 cursor-not-allowed'
          }`}
        >
          {isAdded ? (
            <>
              <Check size={18} />
              {existingReservation ? 'Proposal updated' : 'Added to proposal'}
            </>
          ) : isUnavailable ? (
            'Currently unavailable'
          ) : existingReservation ? (
            'Update Proposal'
          ) : (
            'Add to Proposal'
          )}
        </button>

        {/* Microcopy hint when qty=0 */}
        {quantity === 0 && !isAdded && !isUnavailable && (
          <p className="mt-3 text-center text-xs text-gray-400">Select at least 1 unit to continue</p>
        )}
      </div>

      <p className="mt-6 text-center text-[13px] text-[#4b5563] italic leading-relaxed px-4 opacity-80">
        Arrivio Direct: As the property owner, we charge no commissions. Your application is handled directly by our resident support team.
      </p>
    </div>
  );
};

export default UnitBox;
