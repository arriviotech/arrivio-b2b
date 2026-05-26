import React from 'react';
import { SHARED_FURNITURE_ITEMS } from './arixSharedFurnitureData';

const ArixSharedFurniturePanel = ({ design, onToggle, onAddAll, onShowAll }) => {
  const selectedIds = (design?.selectedItems || []).map(i => i.id);
  const totalSumOfAllItems = SHARED_FURNITURE_ITEMS.reduce((sum, item) => sum + (item.price || 0), 0);
  const isAllSelected = SHARED_FURNITURE_ITEMS.every(item => selectedIds.includes(item.id));

  return (
    <div className="space-y-5">
      {/* Furniture Cart Header */}
      <div className="flex items-center justify-between pt-1 border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-[#0f4c3a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span className="font-serif text-base font-bold text-gray-900">Furniture Cart</span>
        </div>
        <span className="rounded-full bg-[#0f4c3a]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#0f4c3a]">
          {selectedIds.length} / {SHARED_FURNITURE_ITEMS.length} items
        </span>
      </div>

      {/* Scrollable Cart Items list */}
      <div className="space-y-3">
        {SHARED_FURNITURE_ITEMS.map((item) => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <div
              key={item.id}
              className={`flex items-center justify-between p-3.5 bg-white border ${
                isSelected
                  ? 'border-[#0f4c3a]/30 shadow-sm bg-[#EFF7EF]/10'
                  : 'border-gray-100 hover:border-gray-200'
              } rounded-2xl transition duration-200`}
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 shadow-sm overflow-hidden">
                  <img src={item.thumbnail || item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-905">{item.name}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">+€{item.price}/mo</div>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => onToggle(item)}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wide transition duration-200 ${
                  isSelected
                    ? 'bg-[#0f4c3a] text-white hover:bg-[#08311c]'
                    : 'border border-gray-200 bg-white text-gray-600 hover:border-[#0f4c3a] hover:text-[#0f4c3a]'
                }`}
              >
                {isSelected ? '✓ Added' : '+ Add'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Whitish Add All / Reset Button */}
      {!isAllSelected && (
        <div className="pt-1">
          <button
            type="button"
            onClick={onAddAll}
            className="w-full flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-xs font-semibold text-gray-800 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all duration-200 active:scale-95 shadow-sm"
          >
            <svg className="h-4 w-4 text-[#0f4c3a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.5" />
            </svg>
            <span>Restore all furniture pieces (+€{totalSumOfAllItems}/mo)</span>
          </button>
        </div>
      )}

      <div className="border-t border-gray-100 my-2" />

      {/* Estimated Rent Add-on Summary */}
      <div className="space-y-3">
        <div className="rounded-2xl bg-[#0f4c3a]/5 p-4 border-0">
          <div className="text-[9px] font-bold text-[#0f4c3a]/70 uppercase tracking-widest">Estimated Monthly Rent Add-on</div>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-serif text-[#0f4c3a]">+€{design?.addOnTotal || 0}<span className="text-xs font-normal text-[#0f4c3a]/80">/mo</span></span>
            <span className="text-[10px] text-gray-500">Includes delivery & assembly</span>
          </div>
          <div className="mt-2 text-[9px] text-gray-400 leading-normal">
            Pricing shown is an estimate. Final lease pricing and terms will be confirmed upon finalizing the lease quote on your consultation call.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArixSharedFurniturePanel;
