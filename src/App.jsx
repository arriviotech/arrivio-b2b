import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import UnitDetails from './pages/UnitDetails';
import Proposal from './pages/Proposal';
import Dashboard from './pages/dashboard/Dashboard';
import MeetingSchedule from './pages/MeetingSchedule';
import Profile from './pages/account/Profile';
import Help from './pages/account/Help';
import Shortlist from './pages/Shortlist';
import { ReservationProvider, useReservation } from './context/ReservationContext';
import { WishlistProvider } from './context/WishlistContext';
import { ModalProvider, useModal } from './context/ModalContext';
import { ArixDesignerProvider, useArixDesigner } from './context/ArixDesignerContext';
import ArixDesignerModal from './components/arix/ArixDesignerModal';
import { useEffect, useRef } from 'react';
import { AuthProvider } from './context/AuthContext';
import Signin from './pages/Signin';
import Imprint from './pages/legal/Imprint';
import Privacy from './pages/legal/Privacy';
import Terms from './pages/legal/Terms';
import DetailedHowItWorks from './pages/DetailedHowItWorks';
import NotFound from './pages/NotFound';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';

const ModalOrchestrator = () => {
  const { isSigninOpen, closeSignin } = useModal();
  return <Signin isOpen={isSigninOpen} onClose={closeSignin} />;
};

const ArixOrchestrator = () => {
  const { reservations } = useReservation();
  const { modalState, openModal, closeModal } = useArixDesigner();
  const prevRef = useRef([]);
  const firstLoad = useRef(true);

  useEffect(() => {
    if (firstLoad.current) {
      prevRef.current = reservations;
      firstLoad.current = false;
      return;
    }

    const prev = prevRef.current || [];

    if (reservations.length > prev.length) {
      const added = reservations.find(
        r =>
          !prev.some(
            p =>
              p.propertyId === r.propertyId &&
              p.unitType === r.unitType
          )
      );

      if (added) {
        openModal({
          propertyId: added.propertyId,
          propertyName: added.propertyName,
          roomType: added.unitType,
        });
      }
    }

    prevRef.current = reservations;
  }, [reservations, openModal]);

  return (
    <ArixDesignerModal
      isOpen={modalState.isOpen}
      propertyId={modalState.propertyId}
      propertyName={modalState.propertyName}
      roomType={modalState.roomType}
      onClose={closeModal}
      onSave={closeModal}
    />
  );
};

function App() {
  return (
    <ReservationProvider>
      <WishlistProvider>
        <AuthProvider>
          <ModalProvider>
            <ArixDesignerProvider>
              <BrowserRouter>
                <ScrollToTop />
                <ModalOrchestrator />
                <ArixOrchestrator />

                <ErrorBoundary>
                  <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/properties" element={<Properties />} />
                    <Route path="/property/:slug" element={<PropertyDetails />} />
                    <Route path="/property/:slug/unit/:unitId" element={<UnitDetails />} />
                    <Route path="/proposal" element={<Proposal />} />
                    <Route path="/shortlist" element={<Shortlist />} />
                    <Route path="/schedule" element={<MeetingSchedule />} />
                    <Route path="/dashboard/*" element={<Dashboard />} />
                    <Route path="/account/profile" element={<Profile />} />
                    <Route path="/account/help" element={<Help />} />
                    <Route path="/imprint" element={<Imprint />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/how-it-works" element={<DetailedHowItWorks />} />

                    {/* Catch-all route for undefined pages */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </ErrorBoundary>
              </BrowserRouter>
            </ArixDesignerProvider>
          </ModalProvider>
        </AuthProvider>
      </WishlistProvider>
    </ReservationProvider>
  );
}

export default App;