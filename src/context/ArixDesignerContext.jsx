import React, { createContext, useContext, useState, useEffect } from 'react';
import { FURNITURE_ITEMS } from '../components/arix/arixFurnitureData';
import { SHARED_FURNITURE_ITEMS } from '../components/arix/arixSharedFurnitureData';

const ArixDesignerContext = createContext();

export const useArixDesigner = () => {
  const ctx = useContext(ArixDesignerContext);
  if (!ctx) throw new Error('useArixDesigner must be used within ArixDesignerProvider');
  return ctx;
};

const STORAGE_KEY = 'arrivio_arix_designer_v1';

export const ArixDesignerProvider = ({ children }) => {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  });

  const [modalState, setModalState] = useState({ isOpen: false, propertyId: null, propertyName: '', roomType: '' });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }, [state]);

  const recalcAddOn = (selectedItems) => {
    return selectedItems.reduce((s, it) => s + (it.price || 0), 0);
  };

  const getDesignForProperty = (propertyId) => {
    const saved = state[propertyId];
    if (saved && saved.hasInteracted) {
      // Map saved items to their fresh definitions from FURNITURE_ITEMS to clear any stale cache
      const freshItems = (saved.selectedItems || [])
        .map(savedItem => {
          const fresh = FURNITURE_ITEMS.find(fi => fi.id === savedItem.id);
          return fresh ? fresh : savedItem;
        });
      return { ...saved, selectedItems: freshItems };
    }
    // Default is FULLY FURNISHED (all items pre-added in the cart)
    return {
      selectedItems: FURNITURE_ITEMS,
      addOnTotal: recalcAddOn(FURNITURE_ITEMS),
      hasInteracted: false
    };
  };

  const getSharedDesignForProperty = (propertyId) => {
    const savedKey = `${propertyId}_shared`;
    const saved = state[savedKey];
    if (saved && saved.hasInteracted) {
      // Map saved items to their fresh definitions from SHARED_FURNITURE_ITEMS to clear any stale cache
      const freshItems = (saved.selectedItems || [])
        .map(savedItem => {
          const fresh = SHARED_FURNITURE_ITEMS.find(fi => fi.id === savedItem.id);
          return fresh ? fresh : savedItem;
        });
      return { ...saved, selectedItems: freshItems };
    }
    // Default is FULLY FURNISHED (all items pre-added in the cart)
    return {
      selectedItems: SHARED_FURNITURE_ITEMS,
      addOnTotal: recalcAddOn(SHARED_FURNITURE_ITEMS),
      hasInteracted: false
    };
  };

  const toggleFurnitureItem = (propertyId, item) => {
    setState((prev) => {
      const prevFor = prev[propertyId] || {
        selectedItems: FURNITURE_ITEMS,
        addOnTotal: recalcAddOn(FURNITURE_ITEMS),
        hasInteracted: true
      };
      const exists = prevFor.selectedItems.find(si => si.id === item.id);
      let nextSelected;
      if (exists) {
        nextSelected = prevFor.selectedItems.filter(si => si.id !== item.id);
      } else {
        nextSelected = [...prevFor.selectedItems, item];
      }
      const addOnTotal = recalcAddOn(nextSelected);
      return { ...prev, [propertyId]: { selectedItems: nextSelected, addOnTotal, hasInteracted: true } };
    });
  };

  const toggleSharedFurnitureItem = (propertyId, item) => {
    const savedKey = `${propertyId}_shared`;
    setState((prev) => {
      const prevFor = prev[savedKey] || {
        selectedItems: SHARED_FURNITURE_ITEMS,
        addOnTotal: recalcAddOn(SHARED_FURNITURE_ITEMS),
        hasInteracted: true
      };
      const exists = prevFor.selectedItems.find(si => si.id === item.id);
      let nextSelected;
      if (exists) {
        nextSelected = prevFor.selectedItems.filter(si => si.id !== item.id);
      } else {
        nextSelected = [...prevFor.selectedItems, item];
      }
      const addOnTotal = recalcAddOn(nextSelected);
      return { ...prev, [savedKey]: { selectedItems: nextSelected, addOnTotal, hasInteracted: true } };
    });
  };

  const clearDesign = (propertyId) => {
    setState((prev) => ({ ...prev, [propertyId]: { selectedItems: [], addOnTotal: 0, hasInteracted: true } }));
  };

  const setDesign = (propertyId, items) => {
    const addOnTotal = recalcAddOn(items);
    setState((prev) => ({ ...prev, [propertyId]: { selectedItems: items, addOnTotal, hasInteracted: true } }));
  };

  const setSharedDesign = (propertyId, items) => {
    const savedKey = `${propertyId}_shared`;
    const addOnTotal = recalcAddOn(items);
    setState((prev) => ({ ...prev, [savedKey]: { selectedItems: items, addOnTotal, hasInteracted: true } }));
  };

  const touchDesign = (propertyId) => {
    setState((prev) => {
      const prevFor = prev[propertyId] || {
        selectedItems: FURNITURE_ITEMS,
        addOnTotal: recalcAddOn(FURNITURE_ITEMS),
        hasInteracted: false
      };
      return { ...prev, [propertyId]: { ...prevFor, hasInteracted: true } };
    });
  };

  const touchSharedDesign = (propertyId) => {
    const savedKey = `${propertyId}_shared`;
    setState((prev) => {
      const prevFor = prev[savedKey] || {
        selectedItems: SHARED_FURNITURE_ITEMS,
        addOnTotal: recalcAddOn(SHARED_FURNITURE_ITEMS),
        hasInteracted: false
      };
      return { ...prev, [savedKey]: { ...prevFor, hasInteracted: true } };
    });
  };

  const openModal = ({ propertyId, propertyName, roomType }) => {
    setModalState({ isOpen: true, propertyId, propertyName, roomType });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, propertyId: null, propertyName: '', roomType: '' });
  };

  const value = {
    state,
    modalState,
    getDesignForProperty,
    getSharedDesignForProperty,
    toggleFurnitureItem,
    toggleSharedFurnitureItem,
    clearDesign,
    setDesign,
    setSharedDesign,
    touchDesign,
    touchSharedDesign,
    openModal,
    closeModal,
  };

  return (
    <ArixDesignerContext.Provider value={value}>
      {children}
    </ArixDesignerContext.Provider>
  );
};

export default ArixDesignerContext;

