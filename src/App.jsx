import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import UnitDetails from './pages/UnitDetails';
import Overview from './pages/Overview';
import Dashboard from './pages/hrdashboard/Dashboard';
import MeetingSchedule from './pages/MeetingSchedule';
import Profile from './pages/account/Profile';
import Shortlist from './pages/account/Shortlist';
import Help from './pages/account/Help';
import Bookings from './pages/account/Bookings';
import { ReservationProvider } from './context/ReservationContext';
import { WishlistProvider } from './context/WishlistContext';
import { ModalProvider } from './context/ModalContext';
import { AuthProvider } from './context/AuthContext';
import Signin from './pages/Signin';
import Imprint from './pages/legal/Imprint';
import Privacy from './pages/legal/Privacy';
import Terms from './pages/legal/Terms';
import DetailedHowItWorks from './pages/DetailedHowItWorks';
import NotFound from './pages/NotFound';
import { useModal } from './context/ModalContext';
import ScrollToTop from './components/ScrollToTop';

const ModalOrchestrator = () => {
  const { isSigninOpen, closeSignin } = useModal();
  return <Signin isOpen={isSigninOpen} onClose={closeSignin} />;
};

function App() {
  return (
    <ReservationProvider>
      <WishlistProvider>
        <AuthProvider>
          <ModalProvider>
          <BrowserRouter>
            <ScrollToTop />
            <ModalOrchestrator />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/property/:slug" element={<PropertyDetails />} />
              <Route path="/property/:slug/unit/:unitId" element={<UnitDetails />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/schedule" element={<MeetingSchedule />} />
              <Route path="/dashboard/*" element={<Dashboard />} />
              <Route path="/account/profile" element={<Profile />} />
              <Route path="/account/shortlist" element={<Shortlist />} />
              <Route path="/account/help" element={<Help />} />
              <Route path="/account/bookings" element={<Bookings />} />
              <Route path="/imprint" element={<Imprint />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/how-it-works" element={<DetailedHowItWorks />} />

              {/* Catch-all route for undefined pages */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ModalProvider>
        </AuthProvider>
      </WishlistProvider>
    </ReservationProvider>
  );
}

export default App;
