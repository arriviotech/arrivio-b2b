import React, { useState, useEffect } from 'react';
import ArixRoomCanvas from './ArixRoomCanvas';
import ArixFurniturePanel from './ArixFurniturePanel';
import { useArixDesigner } from '../../context/ArixDesignerContext';
import { FURNITURE_ITEMS } from './arixFurnitureData';
import roomFull from '../../assets/furniture/room_full.png';

const ArixDesignerModal = ({ propertyId, propertyName, roomType, isOpen, onClose, onSave }) => {
  const { getDesignForProperty, setDesign, touchDesign } = useArixDesigner();
  const existing = getDesignForProperty(propertyId);
  const [localSelected, setLocalSelected] = useState(existing.selectedItems || []);
  const [showDecorated, setShowDecorated] = useState(true);

  useEffect(() => {
    const current = getDesignForProperty(propertyId);
    const items = current.selectedItems || [];
    // Start with whatever the user has saved — empty by default (unit price only).
    // Adding/removing furniture in the panel changes the +/mo add-on from there.
    setLocalSelected(items);
    // Show the empty room when nothing is picked yet so the canvas reflects current state.
    setShowDecorated(items.length > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = originalOverflow; };
  }, [isOpen]);

  const handleToggle = (item) => {
    setLocalSelected((prev) => {
      const exists = prev.some(si => si.id === item.id);
      if (exists) {
        // Automatically switch to empty room view to visually subtract the piece!
        setShowDecorated(false);
        return prev.filter(si => si.id !== item.id);
      }
      return [...prev, item];
    });
  };

  const localDesign = {
    selectedItems: localSelected,
    addOnTotal: localSelected.reduce((sum, item) => sum + (item.price || 0), 0),
    hasInteracted: existing.hasInteracted,
  };

  const handleSave = () => {
    setDesign(propertyId, localSelected);
    onSave && onSave();
    onClose && onClose();
  };

  const handleSkip = () => {
    touchDesign(propertyId);
    onClose && onClose();
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        handleSkip();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', onKeyDown);
    }
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 overflow-auto">
      <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 backdrop-blur-sm" onClick={handleSkip} />
      <div className="relative mx-auto w-[90vw] max-w-[1100px] max-h-[90vh] overflow-hidden rounded-[32px] bg-white shadow-[0_40px_80px_rgba(0,0,0,0.16)] border border-gray-100 backdrop-blur-sm flex flex-col md:flex-row transform scale-95 origin-center">
        <div className="md:w-[62%] flex flex-col p-5 md:p-8 gap-4 min-h-0">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <div className="text-sm uppercase tracking-[0.26em] font-bold text-[#0f4c3a]/70">✦ Arix Magic Designer</div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-3xl font-serif text-[#111827] leading-tight">Design this space with Arix</h2>
                  <p className="mt-2 text-sm text-gray-500">{propertyName} · {roomType}</p>
                </div>
                <div className="rounded-full bg-[#0f4c3a]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#0f4c3a]">
                  Powered by Arix
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setShowDecorated(false)}
                className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${showDecorated ? 'border border-gray-200 bg-white text-gray-700 hover:border-gray-300' : 'bg-[#0f4c3a] text-white shadow-sm hover:bg-[#08311c]'}`}
              >
                Empty room view
              </button>
              <button
                type="button"
                onClick={() => setShowDecorated(true)}
                className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${showDecorated ? 'bg-[#0f4c3a] text-white shadow-sm hover:bg-[#08311c]' : 'border border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
              >
                Decorated room preview
              </button>
            </div>
          </div>

          <div className="flex-1 rounded-[28px] bg-gray-100 p-3 md:p-5 shadow-inner">
            <ArixRoomCanvas
              design={localDesign}
              className="h-full"
              backgroundImage={showDecorated ? roomFull : undefined}
            />
          </div>

          {showDecorated && (
            <div className="rounded-[24px] border border-gray-200 bg-white p-4 text-sm text-gray-600">
              <strong className="text-gray-900">Decorated room mode</strong> shows a full interior look with finishes, rugs, and furnishings. Use the empty room view to stage specific furniture elements.
            </div>
          )}
        </div>

        <div className="md:w-[38%] flex flex-col min-h-0 border-t border-gray-100 md:border-t-0 md:border-l md:border-gray-100 p-5 md:p-8 overflow-y-auto">
          <div className="text-sm text-gray-500 mb-5">Your property has all furniture pieces pre-added by default. Scroll down the cart below to customize your selections.</div>
          <ArixFurniturePanel
            design={localDesign}
            onToggle={handleToggle}
            onAddAll={() => {
              setLocalSelected(FURNITURE_ITEMS);
              setShowDecorated(true);
            }}
            onShowAll={() => setShowDecorated(true)}
          />

          <div className="mt-auto pt-6 border-t border-gray-200 flex flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleSkip}
              className="flex-1 inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-3 text-xs font-bold text-gray-500 shadow-sm transition hover:bg-gray-50 hover:text-gray-800 active:scale-95 duration-200 cursor-pointer whitespace-nowrap"
            >
              Skip for now
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 inline-flex items-center justify-center rounded-2xl bg-[#0f4c3a] px-4 py-3 text-xs font-bold text-white shadow-lg shadow-[#0f4c3a]/10 transition hover:bg-[#08311c] hover:shadow-xl active:scale-95 duration-200 cursor-pointer whitespace-nowrap"
            >
              Save & Continue
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSkip}
          className="absolute top-5 right-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-2xl text-gray-600 transition hover:bg-gray-50"
          aria-label="Close designer"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default ArixDesignerModal;
