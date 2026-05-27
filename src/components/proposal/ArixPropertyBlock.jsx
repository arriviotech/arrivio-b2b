import React from 'react';
import { Sparkles } from 'lucide-react';
import { useArixDesigner } from '../../context/ArixDesignerContext';
import ArixRoomCanvas from '../arix/ArixRoomCanvas';
import ArixSharedRoomCanvas from '../arix/ArixSharedRoomCanvas';
import { ARIX_ENABLED } from '../../App';

// Renders a separate Arix section per distinct unit type the property has.
// Each unit type gets its own design slot — Studio, Single Room, and Shared
// Room are all independent so the user can customize each separately.
// Slot storage keys:
//   Studio:      state[`${propertyId}_studio`]
//   Single Room: state[`${propertyId}_one_bedroom`]
//   Shared Room: state[`${propertyId}_shared`] (existing shared-designer key)
const ArixPropertyBlock = ({ property }) => {
  if (!ARIX_ENABLED) return null;

  // Distinct unit labels in cart for this property (e.g., Studio, Single Room, Shared Room)
  const unitLabels = [...new Set((property.units || []).map((u) => u.unitType).filter(Boolean))];
  if (unitLabels.length === 0) return null;

  return (
    <>
      {unitLabels.map((unitLabel) => (
        <ArixVariantSection
          key={unitLabel}
          property={property}
          unitLabel={unitLabel}
        />
      ))}
    </>
  );
};

// Map a display label to (variant, slot-key-suffix).
const variantFor = (unitLabel) => {
  if (unitLabel === 'Shared Room') return { variant: 'shared', suffix: 'shared' };
  if (unitLabel === 'Single Room') return { variant: 'regular', suffix: 'one_bedroom' };
  if (unitLabel === 'Studio') return { variant: 'regular', suffix: 'studio' };
  // Fallback for any other label — treat as regular, derive a safe key.
  return { variant: 'regular', suffix: unitLabel.toLowerCase().replace(/\s+/g, '_') };
};

const ArixVariantSection = ({ property, unitLabel }) => {
  const {
    getDesignForProperty,
    getSharedDesignForProperty,
    openModal,
  } = useArixDesigner();
  const { variant, suffix } = variantFor(unitLabel);
  const isShared = variant === 'shared';
  const slotId = isShared ? property.id : `${property.id}_${suffix}`;

  const design = isShared
    ? getSharedDesignForProperty(property.id)
    : getDesignForProperty(slotId);
  const selectedCount = design?.selectedItems?.length || 0;
  const addOnTotal = design?.addOnTotal || 0;
  const hasDesign = selectedCount > 0;

  const handleArixOpen = () => {
    openModal({
      propertyId: slotId,
      propertyName: property.name,
      roomType: unitLabel,
    });
  };

  const Canvas = isShared ? ArixSharedRoomCanvas : ArixRoomCanvas;

  return (
    <div className="border-t border-gray-100">
      <div className="px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-gray-700 bg-gray-100/80 border-b border-gray-200 flex items-center gap-1.5">
        <Sparkles size={12} className="text-[#0f4c3a]" />
        Arix Magic Designer
        <span className="text-gray-500 font-normal normal-case tracking-normal">·</span>
        <span className="text-[#0f4c3a] normal-case tracking-normal">{unitLabel}</span>
      </div>

      {hasDesign ? (
        <div className="p-4 bg-white">
          <div className="flex items-stretch gap-3">
            <button
              type="button"
              onClick={handleArixOpen}
              title="View design"
              className="relative w-32 h-24 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 hover:opacity-90 transition-opacity cursor-pointer group [&_>div]:!p-0 [&_>div]:!h-full [&_>div_>div]:!block [&_>div_>div]:!w-full [&_>div_>div]:!h-full [&_>div_>div]:!max-w-none [&_>div_>div_>img:first-child]:!w-full [&_>div_>div_>img:first-child]:!h-full [&_>div_>div_>img:first-child]:!object-cover [&_>div_>div_>img:first-child]:!max-h-none [&_>div_>div_>img:first-child]:!rounded-none [&_>div_>div_>img:first-child]:!shadow-none"
            >
              <Canvas design={design} className="h-full" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-black/50 px-2 py-1 rounded">
                  View
                </span>
              </div>
            </button>

            <div className="flex-grow min-w-0 flex flex-col justify-between gap-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center rounded-full bg-[#0f4c3a]/10 px-2 py-0.5 text-[10px] font-bold text-[#0f4c3a]">
                  Fully Staged
                </span>
                <span className="text-[10px] text-gray-500">
                  {selectedCount} {selectedCount === 1 ? 'piece' : 'pieces'}
                </span>
              </div>

              {/* Overlapping avatars */}
              <div className="flex items-center -space-x-2.5">
                {design.selectedItems.slice(0, 6).map((item) => (
                  <div
                    key={item.id}
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-gray-50 shrink-0 overflow-hidden shadow-sm"
                    title={item.name}
                  >
                    <img
                      src={item.thumbnail || item.image}
                      alt={item.name}
                      className="h-full w-full object-contain p-1"
                    />
                  </div>
                ))}
                {design.selectedItems.length > 6 && (
                  <div className="inline-flex items-center justify-center h-10 w-10 rounded-full ring-2 ring-white bg-gray-100 text-[10px] font-bold text-gray-700 shadow-sm">
                    +{design.selectedItems.length - 6}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-1">
                {design.selectedItems.map((item) => (
                  <span
                    key={item.id}
                    className="inline-flex items-center rounded-md bg-gray-50 border border-gray-200/60 px-2 py-0.5 text-[10px] font-medium text-gray-700"
                  >
                    {item.name}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="text-sm font-bold text-[#0f4c3a]">+€{addOnTotal}/mo</div>
                <button
                  type="button"
                  onClick={handleArixOpen}
                  className="px-4 py-1.5 rounded-md bg-[#0f4c3a] text-white text-[11px] font-bold hover:bg-[#1A2E22] active:scale-95 transition-all shrink-0 shadow-sm"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleArixOpen}
          className="w-full px-5 py-4 flex items-center gap-3 bg-gradient-to-r from-[#0f4c3a]/[0.05] via-[#0f4c3a]/[0.02] to-transparent hover:bg-[#0f4c3a]/[0.08] transition-colors text-left group"
        >
          <div className="w-10 h-10 rounded-full bg-[#0f4c3a]/10 flex items-center justify-center shrink-0">
            <Sparkles size={16} className="text-[#0f4c3a]" strokeWidth={2.25} />
          </div>
          <div className="flex-grow">
            <div className="text-sm font-bold text-gray-900">Customize {unitLabel} with Arix</div>
            <div className="text-[11px] text-gray-500">Bring this space to life</div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#0f4c3a] group-hover:translate-x-0.5 transition-transform shrink-0">
            Furnish →
          </span>
        </button>
      )}
    </div>
  );
};

export default ArixPropertyBlock;
