import React, { createContext, useContext, useState, useEffect } from 'react';

const ReservationContext = createContext();

export const useReservation = () => {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error('useReservation must be used within a ReservationProvider');
  }
  return context;
};

export const ReservationProvider = ({ children }) => {
  const [reservations, setReservations] = useState(() => {
    const saved = localStorage.getItem('arrivio_reservations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('arrivio_reservations', JSON.stringify(reservations));
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
