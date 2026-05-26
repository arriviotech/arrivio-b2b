import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Minus,
  Plus,
  Trash2,
  ChevronRight,
  ChevronDown,
  Sparkles,
  ExternalLink,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useArixDesigner } from '../../context/ArixDesignerContext';
import { ARIX_ENABLED } from '../../App';
import ArixPropertyBlock from './ArixPropertyBlock';

// Display label for each unit_type — used in list row chips.
// Kept as a map (rather than passing the label through directly) so we can
// override here later if any label needs trimming for the chip context.
const SHORT_UNIT_LABEL = {
  'Studio': 'Studio',
  'Single Room': 'Single Room',
  'Shared Room': 'Shared Room',
};

const PropertyListWithDrawer = ({
  properties,
  navigate,
  updateQuantity,
  removeReservation,
}) => {
  const { getDesignForProperty, getSharedDesignForProperty } = useArixDesigner();
  const [activeId, setActiveId] = useState(null);
  const active = properties.find((p) => p.id === activeId);

  // Per-unit-type slot lookup for the Arix add-on chip on each row.
  // Mirrors the same slot scheme used in ArixPropertyBlock + Proposal totals.
  const SLOT_KEY_BY_LABEL = {
    Studio: 'studio',
    'Single Room': 'one_bedroom',
  };
  const arixTotalForProperty = (prop) => {
    const labels = [...new Set((prop.units || []).map((u) => u.unitType).filter(Boolean))];
    return labels.reduce((acc, label) => {
      if (label === 'Shared Room') {
        return acc + (getSharedDesignForProperty(prop.id)?.addOnTotal || 0);
      }
      const suffix = SLOT_KEY_BY_LABEL[label];
      if (!suffix) return acc;
      return acc + (getDesignForProperty(`${prop.id}_${suffix}`)?.addOnTotal || 0);
    }, 0);
  };
  const arixItemsForProperty = (prop) => {
    const labels = [...new Set((prop.units || []).map((u) => u.unitType).filter(Boolean))];
    return labels.reduce((acc, label) => {
      if (label === 'Shared Room') {
        return acc + (getSharedDesignForProperty(prop.id)?.selectedItems?.length || 0);
      }
      const suffix = SLOT_KEY_BY_LABEL[label];
      if (!suffix) return acc;
      return acc + (getDesignForProperty(`${prop.id}_${suffix}`)?.selectedItems?.length || 0);
    }, 0);
  };

  useEffect(() => {
    if (activeId && !active) setActiveId(null);
  }, [active, activeId]);

  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e) => e.key === 'Escape' && setActiveId(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active]);

  return (
    <>
      {/* Tight list */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Discovery banner — bright and eye-catching */}
        {ARIX_ENABLED && (
          <div className="relative px-4 py-3 bg-gradient-to-r from-[#0f4c3a] via-[#0f4c3a] to-[#08311c] border-b border-[#0f4c3a]/30 flex items-center gap-3 overflow-hidden">
            {/* Decorative shimmer dots */}
            <div className="pointer-events-none absolute -right-4 -top-4 w-24 h-24 rounded-full bg-[#DAA520]/15 blur-2xl" />
            <div className="pointer-events-none absolute -left-4 -bottom-4 w-20 h-20 rounded-full bg-[#DAA520]/10 blur-2xl" />

            <div className="relative w-9 h-9 rounded-full bg-[#DAA520] flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(218,165,32,0.5)] animate-pulse">
              <Sparkles size={16} className="text-white" strokeWidth={2.5} />
            </div>
            <div className="relative flex-grow min-w-0">
              <div className="text-xs font-bold text-white leading-tight flex items-center gap-1.5">
                ✦ Customize with Arix Magic Designer
              </div>
              <div className="text-[11px] text-white/80 leading-tight mt-0.5">
                Open any property to design its furniture layout
              </div>
            </div>
          </div>
        )}

        <div className="divide-y divide-gray-100">
        {properties.map((p) => {
          const pUnits = p.units.filter((u) => u.unitPrice > 0);
          const totalQty = pUnits.reduce((sum, u) => sum + u.quantity, 0);
          const totalMonthly = pUnits.reduce(
            (sum, u) => sum + Math.round(u.unitPrice * u.quantity),
            0,
          );
          // Sum Arix add-ons across all per-unit-type slots for this property
          const pArixTotal = ARIX_ENABLED ? arixTotalForProperty(p) : 0;
          const pArixItems = ARIX_ENABLED ? arixItemsForProperty(p) : 0;
          const pHasDesign = pArixItems > 0;
          // (4) Maxed availability — every unit at its cap
          const pIsMaxed =
            pUnits.length > 0 &&
            pUnits.every((u) => u.maxAvailable > 0 && u.quantity >= u.maxAvailable);

          return (
            <div
              key={p.id}
              role="button"
              tabIndex={0}
              onClick={() => setActiveId(p.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveId(p.id);
                }
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-gray-900 truncate group-hover:text-[#0f4c3a] transition-colors">
                    {p.name}
                  </h3>
                  {pHasDesign && (
                    <span className="relative inline-flex shrink-0 group/sparkle">
                      <Sparkles size={11} className="text-[#0f4c3a]" />
                      <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-1.5 whitespace-nowrap rounded-md bg-gray-900 text-white text-[10px] font-bold px-2 py-1 opacity-0 group-hover/sparkle:opacity-100 transition-opacity z-20 shadow-md">
                        ✦ Designed with Arix
                      </span>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-0.5">
                  <MapPin size={10} />
                  <span className="truncate">
                    {p.neighborhood ? `${p.neighborhood}, ` : ''}
                    {p.city}
                  </span>
                </div>
                {/* Unit type chips + Arix chip + Max badge */}
                <div className="flex flex-wrap items-center gap-1 mt-1.5">
                  {pUnits.map((u) => (
                    <span
                      key={u.unitType}
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#0f4c3a]/[0.06] text-[10px] font-bold text-[#0f4c3a]"
                    >
                      {SHORT_UNIT_LABEL[u.unitType] || u.unitType}
                      <span className="text-[#0f4c3a]/60">·{u.quantity}</span>
                    </span>
                  ))}
                  {/* (2) Arix designed chip */}
                  {pHasDesign && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#DAA520]/15 text-[10px] font-bold text-[#0f4c3a] border border-[#DAA520]/30">
                      <Sparkles size={9} strokeWidth={2.5} />
                      +€{pArixTotal}/mo
                    </span>
                  )}
                  {/* (4) Max reached badge */}
                  {pIsMaxed && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-50 text-[10px] font-bold text-red-600 border border-red-100">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                      Max reached
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div
                  className={`relative inline-flex flex-col items-end ${pHasDesign ? 'group/price' : ''}`}
                >
                  <div className="text-sm font-bold text-[#0f4c3a]">
                    €{(totalMonthly + pArixTotal).toLocaleString()}
                    <span className="text-[10px] font-normal text-[#0f4c3a]/60">/mo</span>
                  </div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">
                    {totalQty} {totalQty === 1 ? 'unit' : 'units'}
                  </div>
                  {pHasDesign && (
                    <div className="pointer-events-none absolute right-0 top-full mt-1.5 z-20 whitespace-nowrap rounded-md bg-gray-900 text-white text-[10px] font-medium px-2.5 py-1.5 opacity-0 group-hover/price:opacity-100 transition-opacity shadow-md">
                      €{totalMonthly.toLocaleString()} housing +{' '}
                      <span className="text-[#DAA520] font-bold">✦</span> €{pArixTotal} furniture
                    </div>
                  )}
                </div>
              </div>
              {/* (1) Quick remove — wipes all units for this property */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  pUnits.forEach((u) => removeReservation(u.propertyId, u.unitType));
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                title="Remove this property"
              >
                <Trash2 size={14} />
              </button>
              <ChevronRight
                size={16}
                className="text-gray-300 group-hover:text-[#0f4c3a] group-hover:translate-x-0.5 transition-all shrink-0"
              />
            </div>
          );
        })}
        {/* (3) Browse more properties CTA */}
        <button
          type="button"
          onClick={() => navigate('/properties')}
          className="w-full flex items-center justify-center gap-1.5 px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-[#0f4c3a] hover:bg-[#0f4c3a]/5 transition-colors group"
        >
          <Plus size={13} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform" />
          Browse more properties
        </button>
        </div>
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {active && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setActiveId(null)}
              className="fixed inset-0 bg-black/40 z-[110]"
            />
            <motion.div
              key="panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-white shadow-2xl z-[120] flex flex-col"
            >
              <DrawerContent
                property={active}
                navigate={navigate}
                updateQuantity={updateQuantity}
                removeReservation={removeReservation}
                getDesignForProperty={getDesignForProperty}
                getSharedDesignForProperty={getSharedDesignForProperty}
                onClose={() => setActiveId(null)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const DrawerContent = ({
  property,
  navigate,
  updateQuantity,
  removeReservation,
  getDesignForProperty,
  getSharedDesignForProperty,
  onClose,
}) => {
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const housingUnits = property.units.filter((u) => u.unitPrice > 0);
  // Sum the furniture across all per-unit-type slots this property has in cart.
  // Slot scheme matches ArixPropertyBlock + Proposal totals:
  //   Studio → state[`${id}_studio`], Single Room → state[`${id}_one_bedroom`],
  //   Shared Room → state[`${id}_shared`] (via getSharedDesignForProperty).
  const SLOT_SUFFIX_BY_LABEL = { Studio: 'studio', 'Single Room': 'one_bedroom' };
  const slotDesigns = (() => {
    if (!ARIX_ENABLED) return [];
    const labels = [...new Set((property.units || []).map((u) => u.unitType).filter(Boolean))];
    return labels
      .map((label) => {
        if (label === 'Shared Room') {
          return { label, design: getSharedDesignForProperty(property.id) };
        }
        const suffix = SLOT_SUFFIX_BY_LABEL[label];
        if (!suffix) return null;
        return { label, design: getDesignForProperty(`${property.id}_${suffix}`) };
      })
      .filter(Boolean);
  })();
  const addOnTotal = slotDesigns.reduce((s, sd) => s + (sd.design?.addOnTotal || 0), 0);
  const hasDesign = slotDesigns.some((sd) => (sd.design?.selectedItems?.length || 0) > 0);
  const totalUnits = housingUnits.reduce((sum, u) => sum + u.quantity, 0);
  const totalMonthly = housingUnits.reduce(
    (sum, u) => sum + Math.round(u.unitPrice * u.quantity),
    0,
  );

  return (
    <>
      {/* Compact header — small image + title + place + close */}
      <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-3">
        <div className="w-20 h-14 rounded-lg overflow-hidden shrink-0 border border-gray-100">
          <img src={property.image} alt={property.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-grow min-w-0">
          <h3 className="text-base font-bold text-gray-900 truncate">{property.name}</h3>
          <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
            <span className="inline-flex items-center gap-1 truncate">
              <MapPin size={10} />
              {property.neighborhood ? `${property.neighborhood}, ` : ''}
              {property.city}
            </span>
            <span className="text-gray-300">·</span>
            <button
              type="button"
              onClick={() => navigate(`/property/${property.slug || property.id}`)}
              className="inline-flex items-center gap-1 font-bold text-[#0f4c3a] hover:underline shrink-0"
            >
              View property
              <ExternalLink size={10} />
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors shrink-0"
          title="Close"
        >
          <X size={16} />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-grow overflow-y-auto">
        {/* Unit rows first */}
        <div className="px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-gray-700 bg-gray-100/80 border-b border-gray-200">
          Units in this property
        </div>
        <div className="divide-y divide-gray-100">
          {housingUnits.map((unit) => {
            const remaining = unit.maxAvailable > 0 ? unit.maxAvailable - unit.quantity : null;
            const badgeTone =
              remaining === null
                ? null
                : remaining <= 0
                  ? 'bg-red-50 text-red-600 border-red-100'
                  : remaining <= 2
                    ? 'bg-amber-50 text-amber-700 border-amber-100'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-100';
            const badgeLabel =
              remaining === null
                ? null
                : remaining <= 0
                  ? `${unit.maxAvailable} of ${unit.maxAvailable} · max reached`
                  : `${unit.quantity} of ${unit.maxAvailable} available`;
            const subtotal = Math.round(unit.unitPrice * unit.quantity);

            return (
              <div key={unit.unitType} className="px-5 py-4 bg-white">
                <div className="flex items-center gap-3">
                  <div className="flex-grow min-w-0">
                    <div className="text-sm font-bold text-gray-900 truncate">{unit.unitType}</div>
                  </div>

                  <div className="flex items-center bg-white rounded-lg border border-gray-200 overflow-hidden shrink-0">
                    <button
                      onClick={() =>
                        updateQuantity(unit.propertyId, unit.unitType, unit.quantity - 1)
                      }
                      disabled={unit.quantity <= 1}
                      className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-9 text-center text-sm font-bold text-gray-900 py-1.5 border-x border-gray-200">
                      {unit.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(unit.propertyId, unit.unitType, unit.quantity + 1)
                      }
                      disabled={unit.maxAvailable > 0 && unit.quantity >= unit.maxAvailable}
                      className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeReservation(unit.propertyId, unit.unitType)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                    title="Remove"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                  <span>
                    €{unit.unitPrice.toLocaleString()}
                    <span className="text-gray-400"> /mo each</span>
                  </span>
                  {badgeLabel && (
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-bold ${badgeTone}`}
                    >
                      {badgeLabel}
                    </span>
                  )}
                  <span className="ml-auto font-bold text-[#0f4c3a]">
                    €{subtotal.toLocaleString()}
                    <span className="text-gray-400 font-normal">/mo</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Arix designer block — extracted to its own component */}
        <ArixPropertyBlock property={property} />
      </div>

      {/* (7) Sticky footer — collapsible price breakdown + CTA */}
      <div className="border-t border-gray-200 bg-white p-4 shadow-[0_-4px_12px_-4px_rgba(0,0,0,0.06)]">
        {/* Breakdown toggle */}
        <button
          type="button"
          onClick={() => setBreakdownOpen((o) => !o)}
          className="flex items-center gap-1 mb-2 group"
          aria-expanded={breakdownOpen}
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-[#0f4c3a] transition-colors">
            Price breakdown
          </span>
          <ChevronDown
            size={11}
            className={`text-gray-500 group-hover:text-[#0f4c3a] transition-all ${breakdownOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Breakdown body — hidden until toggled */}
        {breakdownOpen && (
          <div className="space-y-1 mb-3 text-xs">
            {housingUnits.map((unit) => {
              const subtotal = Math.round(unit.unitPrice * unit.quantity);
              return (
                <div key={unit.unitType} className="flex justify-between text-gray-600">
                  <span className="truncate pr-2">
                    {unit.unitType}
                    <span className="text-gray-400"> · {unit.quantity}</span>
                  </span>
                  <span className="font-bold text-gray-900 shrink-0">
                    €{subtotal.toLocaleString()}/mo
                  </span>
                </div>
              );
            })}
            {hasDesign && (
              <div className="flex justify-between text-gray-600">
                <span className="truncate pr-2 inline-flex items-center gap-1">
                  <Sparkles size={10} className="text-[#0f4c3a]" />
                  Furniture add-on
                </span>
                <span className="font-bold text-gray-900 shrink-0">
                  +€{addOnTotal.toLocaleString()}/mo
                </span>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mb-3 pt-2 border-t border-gray-100">
          <span className="text-[11px] font-bold uppercase tracking-widest text-gray-700">
            Property subtotal
          </span>
          <span className="text-lg font-bold text-[#0f4c3a]">
            €{(totalMonthly + addOnTotal).toLocaleString()}
            <span className="text-xs font-normal text-[#0f4c3a]/60">/mo</span>
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-lg bg-[#0f4c3a] hover:bg-[#1A2E22] text-white font-bold text-sm transition-colors"
        >
          Done
        </button>
      </div>
    </>
  );
};

export default PropertyListWithDrawer;
