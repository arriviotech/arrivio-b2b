import React from 'react';
import { Sparkles } from 'lucide-react';
import ArixSharedRoomCanvas from './ArixSharedRoomCanvas';
import { useArixDesigner } from '../../context/ArixDesignerContext';

const ArixSharedDesignerStep = ({ property }) => {
  const { getSharedDesignForProperty, openModal } = useArixDesigner();
  const design = getSharedDesignForProperty(property.id);
  const roomType = property.units?.[0]?.unitType || 'Shared Room';

  const handleEdit = () => {
    openModal({ propertyId: property.id, propertyName: property.name, roomType });
  };

  const selectedCount = design?.selectedItems?.length || 0;

  return (
    <div className="bg-white rounded-2xl p-6 transition-shadow duration-200">
      <div className="flex flex-col gap-4">
        {/* Header — no redundant button; the body has its own CTA */}
        <div className="border-b border-gray-100 pb-4">
          <div className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#0f4c3a]">{property.name}</div>
          <h3 className="text-base font-bold text-gray-900 mt-1">✦ Staged Interior Layout</h3>
        </div>

        {/* Content Body */}
        {selectedCount > 0 ? (
          <div className="grid gap-5 md:grid-cols-[280px_1fr]">
            {/* Left Canvas Preview */}
            <div className="h-44 overflow-hidden rounded-[24px] border border-gray-150 bg-gray-50 relative group">
              <ArixSharedRoomCanvas design={design} className="h-full" />
            </div>

            {/* Right Summary Info */}
            <div className="flex flex-col justify-between py-1">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-[#0f4c3a]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#0f4c3a]">
                    Fully Staged
                  </span>
                  <span className="text-xs text-gray-400">·</span>
                  <span className="text-[11px] font-semibold text-gray-500">{selectedCount} pieces selected</span>
                </div>

                {/* Overlapping Avatars Stack */}
                <div className="flex items-center -space-x-2.5 overflow-hidden py-1">
                  {design.selectedItems.map((item) => (
                    <div
                      key={item.id}
                      className="inline-block h-9 w-9 rounded-full ring-2 ring-white bg-gray-50 border border-gray-100 p-0.5 shrink-0 overflow-hidden"
                      title={item.name}
                    >
                      <img src={item.thumbnail || item.image} alt={item.name} className="h-full w-full object-cover rounded-full" />
                    </div>
                  ))}
                </div>

                {/* Items List as tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {design.selectedItems.map((item) => (
                    <span
                      key={item.id}
                      className="inline-flex items-center rounded-lg bg-gray-50 border border-gray-200/50 px-2 py-0.5 text-[10px] font-medium text-gray-600"
                    >
                      {item.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price Total Card */}
              <div className="mt-4 rounded-2xl bg-[#0f4c3a]/5 p-3.5 border border-[#0f4c3a]/10 flex items-center justify-between">
                <div>
                  <div className="text-[9px] font-bold text-[#0f4c3a]/70 uppercase tracking-widest">Lease Furniture Add-on</div>
                  <div className="text-lg font-bold font-serif text-[#0f4c3a] mt-0.5">+€{design.addOnTotal}/mo</div>
                </div>
                <button
                  type="button"
                  onClick={handleEdit}
                  className="text-xs font-bold text-[#0f4c3a] hover:underline cursor-pointer"
                >
                  Edit elements →
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-[#0f4c3a]/20 bg-[#0f4c3a]/[0.06] p-5 flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-[#0f4c3a]/10 flex items-center justify-center shrink-0">
              <Sparkles size={16} className="text-[#0f4c3a]" strokeWidth={2.25} />
            </div>
            <p className="flex-1 text-sm font-semibold text-gray-700">Bring this space to life</p>
            <button
              type="button"
              onClick={handleEdit}
              className="shrink-0 rounded-xl bg-[#0f4c3a] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#08311c] active:scale-95 duration-200 cursor-pointer whitespace-nowrap"
            >
              ✦ Furnish Space
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArixSharedDesignerStep;
