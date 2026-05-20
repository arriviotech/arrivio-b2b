import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => {
  return useContext(WishlistContext);
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    // Initialize from localStorage if available
    const saved = localStorage.getItem('arrivio_wishlist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    localStorage.setItem('arrivio_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (property) => {
    setWishlist((prev) => {
      // Avoid duplicates
      if (!prev.some((item) => item.id === property.id)) {
        return [...prev, property];
      }
      return prev;
    });
  };

  const removeFromWishlist = (propertyId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== propertyId));
  };

  const toggleWishlist = (property) => {
    if (isInWishlist(property.id)) {
      removeFromWishlist(property.id);
    } else {
      addToWishlist(property);
    }
  };

  const isInWishlist = (propertyId) => {
    return wishlist.some((item) => item.id === propertyId);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
