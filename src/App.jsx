import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
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
import ArixSharedDesignerModal from './components/arix/ArixSharedDesignerModal';
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

// Feature flag for the Arix Magic Designer. Flip to false to fully hide the feature.
export const ARIX_ENABLED = true;

// Renders:
//  (a) a soft slide-in toast at the bottom-right when a new reservation is added
//      — invites the user to customize furniture without taking over the screen
//  (b) the full Arix Designer modal (opened via the toast OR Proposal page)
const ArixOrchestrator = () => {
  const { reservations } = useReservation();
  const { modalState, openModal, closeModal } = useArixDesigner();
  const location = useLocation();
  const prevRef = useRef([]);
  const firstLoad = useRef(true);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => {
    if (firstLoad.current) {
      prevRef.current = reservations;
      firstLoad.current = false;
      return;
    }
    const prev = prevRef.current || [];
    if (reservations.length > prev.length) {
      const added = reservations.find(
        r => !prev.some(p => p.propertyId === r.propertyId && p.unitType === r.unitType)
      );
      if (added) {
        setToast({
          propertyId: added.propertyId,
          propertyName: added.propertyName,
          roomType: added.unitType,
        });
        if (toastTimer.current) clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToast(null), 10000);
      }
    }
    prevRef.current = reservations;
  }, [reservations]);

  // Dismiss the toast when the route changes — the prompt is contextual to the page
  // the user was on; carrying it across navigation reads as a stale notification.
  useEffect(() => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  const handleCustomize = () => {
    if (!toast) return;
    // Resolve the storage slot ID per unit type so the regular modal reads/writes
    // the correct slot. Shared keeps using the raw property ID (its helpers
    // append "_shared" internally).
    const slotSuffix =
      toast.roomType === 'Studio'
        ? '_studio'
        : toast.roomType === 'Single Room'
          ? '_one_bedroom'
          : '';
    const isShared = (toast.roomType || '').toLowerCase().includes('shared');
    const propertyIdForModal = isShared ? toast.propertyId : `${toast.propertyId}${slotSuffix}`;
    openModal({
      propertyId: propertyIdForModal,
      propertyName: toast.propertyName,
      roomType: toast.roomType,
    });
    setToast(null);
  };
  const handleDismiss = () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(null);
  };

  return (
    <>
      <AnimatePresence>
        {toast && !modalState.isOpen && (
          <motion.div
            key={`${toast.propertyId}-${toast.roomType}`}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            className="fixed bottom-6 right-6 z-[200] w-[340px] max-w-[calc(100vw-32px)] bg-white rounded-2xl shadow-[0_18px_50px_rgba(0,0,0,0.18)] border border-gray-100 overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#0f4c3a]/10 text-[#0f4c3a] flex items-center justify-center shrink-0">
                  <Sparkles size={18} strokeWidth={2.25} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[#0f4c3a]/70 mb-1">✦ Arix Magic Designer</p>
                  <p className="text-sm font-bold text-gray-900 leading-snug truncate">
                    Customize {toast.roomType || 'this room'}?
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                    {toast.propertyName}
                    {toast.roomType ? ` · ${toast.roomType}` : ''}
                  </p>
                </div>
                <button
                  onClick={handleDismiss}
                  className="text-gray-400 hover:text-gray-700 transition-colors shrink-0"
                  aria-label="Dismiss"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={handleCustomize}
                  className="flex-1 py-2 rounded-lg bg-[#0f4c3a] hover:bg-[#0a3a2b] text-white text-xs font-bold uppercase tracking-wide transition-colors"
                >
                  Customize
                </button>
                <button
                  onClick={handleDismiss}
                  className="py-2 px-3 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-bold uppercase tracking-wide transition-colors"
                >
                  Not now
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {modalState.roomType && modalState.roomType.toLowerCase().includes('shared') ? (
        <ArixSharedDesignerModal
          isOpen={modalState.isOpen}
          propertyId={modalState.propertyId}
          propertyName={modalState.propertyName}
          roomType={modalState.roomType}
          onClose={closeModal}
          onSave={closeModal}
        />
      ) : (
        <ArixDesignerModal
          isOpen={modalState.isOpen}
          propertyId={modalState.propertyId}
          propertyName={modalState.propertyName}
          roomType={modalState.roomType}
          onClose={closeModal}
          onSave={closeModal}
        />
      )}
    </>
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
                {ARIX_ENABLED && <ArixOrchestrator />}

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