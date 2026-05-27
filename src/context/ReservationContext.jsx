import React, { createContext, useContext, useState, useEffect } from 'react';

const ReservationContext = createContext();

export const useReservation = () => {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error('useReservation must be used within a ReservationProvider');
  }
  return context;
};

// One-time migration for cart entries persisted before B2B unit-type rename
// (Studio / Single Room / Shared). Old labels and the dropped `two_bedroom`
// DB key get normalized so existing carts render under the new scheme.
const LABEL_MIGRATION = {
  'Private Studio': 'Studio',
  '1-Bedroom Apartment': 'Single Room',
  '2-Bedroom Apartment': 'Shared Room',
  // Interim label from earlier today's pass — map back to the full "Shared Room"
  Shared: 'Shared Room',
};
const UNIT_TYPE_KEY_MIGRATION = {
  two_bedroom: 'shared_room',
};

const migrateAndMerge = (entries) => {
  if (!Array.isArray(entries)) return [];
  const migrated = entries.map((r) => ({
    ...r,
    unitType: LABEL_MIGRATION[r.unitType] || r.unitType,
    unitTypeKey: UNIT_TYPE_KEY_MIGRATION[r.unitTypeKey] || r.unitTypeKey,
  }));
  // After migration, distinct old entries may collide (e.g. an old
  // "2-Bedroom Apartment" + "Shared Room" both map to "Shared"). Sum their
  // quantities into a single row keyed by propertyId + unitType.
  const merged = [];
  migrated.forEach((r) => {
    const existing = merged.find(
      (m) => m.propertyId === r.propertyId && m.unitType === r.unitType,
    );
    if (existing) {
      existing.quantity = (existing.quantity || 0) + (r.quantity || 0);
    } else {
      merged.push({ ...r });
    }
  });
  return merged;
};

export const ReservationProvider = ({ children }) => {
  const [reservations, setReservations] = useState(() => {
    const saved = localStorage.getItem('arrivio_reservations');
    if (saved) {
      try {
        return migrateAndMerge(JSON.parse(saved));
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('arrivio_reservations', JSON.stringify(reservations));
  }, [reservations]);

  // Re-run the label migration whenever reservations change. The migration is
  // idempotent — if nothing needs fixing it returns equivalent state and we
  // skip the setState. This catches any stale "Shared" / "1-Bedroom Apartment"
  // entries that may have been added via an older code path.
  useEffect(() => {
    const migrated = migrateAndMerge(reservations);
    if (JSON.stringify(migrated) !== JSON.stringify(reservations)) {
      setReservations(migrated);
    }
  }, [reservations]);

  const addReservation = (unit, isUpdate = false) => {
    setReservations((prev) => {
      // Check if this exact unit (property + type) already exists
      const existingIndex = prev.findIndex(r => r.propertyId === unit.propertyId && r.unitType === unit.unitType);
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        if (isUpdate) {
          updated[existingIndex] = { ...unit, quantity: unit.quantity || 1 };
        } else {
          // Increment quantity if it already exists and not explicitly updating
          updated[existingIndex].quantity += (unit.quantity || 1);
        }
        return updated;
      } else {
        // Add new
        return [...prev, { ...unit, quantity: unit.quantity || 1 }];
      }
    });
  };

  const removeReservation = (propertyId, unitType) => {
    setReservations((prev) => prev.filter(r => !(r.propertyId === propertyId && r.unitType === unitType)));
  };

  const updateQuantity = (propertyId, unitType, newQuantity) => {
    if (newQuantity <= 0) {
      removeReservation(propertyId, unitType);
      return;
    }
    setReservations((prev) => prev.map(r => {
      if (r.propertyId === propertyId && r.unitType === unitType) {
        return { ...r, quantity: newQuantity };
      }
      return r;
    }));
  };
  
  const clearReservations = () => {
    setReservations([]);
  }

  const value = {
    reservations,
    addReservation,
    removeReservation,
    updateQuantity,
    clearReservations
  };

  return (
    <ReservationContext.Provider value={value}>
      {children}
    </ReservationContext.Provider>
  );
};
