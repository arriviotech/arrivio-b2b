import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [isSigninOpen, setIsSigninOpen] = useState(false);

  const openSignin = () => setIsSigninOpen(true);
  const closeSignin = () => setIsSigninOpen(false);

  return (
    <ModalContext.Provider value={{ isSigninOpen, openSignin, closeSignin }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
