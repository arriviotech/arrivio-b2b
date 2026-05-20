import React from 'react';
import { Info, Building2, Minus, Plus, Check } from 'lucide-react';

const UnitBox = ({
  unitPrice,
  totalAvailable,
  quantity,
  setQuantity,
  isAdded,
  handleAddToOverview,
  isIndividual,
  isShared,
  setIsShared,
  sharedCount,
  setSharedCount,
  property,
  existingReservation
}) => {
  return (
    <div className="sticky top-28">
      <div className="bg-white rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-serif text-[#1a2b3c]">€{unitPrice.toLocaleString()}</span>
            <span className="text-gray-500 text-lg">/ month</span>
          </div>
        </div>
        <p className="text-[11px] text-gray-400 font-bold tracking-[0.15em] mb-8 uppercase">All bills included</p>

        {isIndividual && (
          <div className="mb-6 border-b border-gray-100 pb-5 transition-all">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={isShared}
                onChange={(e) => setIsShared(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-[#0f4c3a] focus:ring-[#0f4c3a]"
              />
              <span className="text-sm font-bold text-gray-800">Is this apartment being shared?</span>
            </label>
            
            {isShared && (
              <div className="mt-4 flex items-center justify-between bg-[#fbfbfb] border border-gray-200 rounded-xl p-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <span className="text-[11px] font-bold text-gray-500 tracking-widest uppercase ml-1">People Sharing</span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setSharedCount(Math.max(1, sharedCount - 1))}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 shadow-sm"
                    disabled={sharedCount <= 1}
                  >
                    <Minus size={12} />
                  </button>
                  <span className="font-bold text-gray-800 w-6 text-center">{sharedCount}</span>
                  <button 
                    onClick={() => setSharedCount(sharedCount + 1)}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={sharedCount >= (property?.sharedBy || 2)}
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {!isIndividual && (
          <div className="flex items-center gap-1.5 mb-2 text-[11px] text-[#0f4c3a] font-bold tracking-widest uppercase ml-1">
            <Info size={12} /> {totalAvailable} {totalAvailable === 1 ? 'UNIT' : 'UNITS'} AVAILABLE
          </div>
        )}

        {/* Quantity Selector acting like the Date Picker */}
        {!isIndividual && (
          <div className="border border-gray-200 bg-[#fbfbfb] rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-gray-400">
                  <Building2 size={24} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-1">{isIndividual ? 'Apartments Needed' : 'Units Needed'}</span>
                  <span className="font-semibold text-gray-800">{quantity} {quantity === 1 ? (isIndividual ? 'Apartment' : 'Unit') : (isIndividual ? 'Apartments' : 'Units')}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setQuantity(Math.max(0, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors shadow-sm disabled:opacity-30"
                  disabled={quantity <= 0}
                >
                  <Minus size={14} />
                </button>
                <button 
                  onClick={() => setQuantity(Math.min(totalAvailable, quantity + 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors shadow-sm"
                  disabled={quantity >= totalAvailable}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        <button 
          onClick={handleAddToOverview}
          disabled={isAdded || quantity === 0}
          className={`w-full py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${
            isAdded 
              ? 'bg-emerald-600 text-white' 
              : quantity > 0
                ? 'bg-[#0f4c3a] hover:bg-[#0a3a2b] text-white shadow-lg shadow-[#0f4c3a]/10'
                : 'bg-[#e5e4e0] text-gray-400 cursor-not-allowed'
          }`}
        >
          {isAdded ? (
            <>
              <Check size={18} />
              {existingReservation ? 'Updated overview' : 'Added to overview'}
            </>
          ) : existingReservation ? (
            'Update Overview'
          ) : (
            'Add to Overview'
          )}
        </button>
      </div>
      <p className="mt-6 text-center text-[13px] text-[#4b5563] italic leading-relaxed px-4 opacity-80">
        Arrivio Direct: As the property owner, we charge no commissions. Your application is handled directly by our resident support team.
      </p>
    </div>
  );
};

export default UnitBox;
