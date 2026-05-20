import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LayoutDashboard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useModal } from '../../context/ModalContext';
import { useAuth } from '../../context/AuthContext';
import AccountDropdown from './AccountDropdown';
import greenLogo from '../../assets/greenlogo.png';

const Navbar = ({ minimal = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const navigate = useNavigate();
  const { openSignin } = useModal();
  const { isLoggedIn } = useAuth();

  // Scroll behavior — hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 10);

      if (y < 50) setIsVisible(true);
      else if (y > lastScrollY.current) setIsVisible(false);
      else setIsVisible(true);

      lastScrollY.current = y;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
  }, [isMobileMenuOpen]);

  const landingLinks = [
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Platform', href: '#platform' },
    { name: 'Cities', href: '#cities' },
  ];

  return (
    <>
      {/* ── NAVBAR ── */}
      <nav
        className={`fixed top-0 left-0 w-full z-[100] h-16 md:h-20 px-4 md:px-12 flex items-center transition-all duration-500
          ${isVisible ? 'translate-y-0' : '-translate-y-full'}
          ${isScrolled
            ? 'bg-[#f2f2f2]/90 backdrop-blur-xl shadow-md'
            : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between w-full">
          {/* LOGO */}
          <Link to="/" className="shrink-0 flex items-center">
            <img src={greenLogo} alt="Arrivio" className="h-10 w-auto object-contain transition-all duration-500" />
          </Link>

          {/* CENTER LINKS — truly centered */}
          {!minimal && (
            <div className="hidden md:flex items-center gap-1 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              {landingLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="px-6 py-2.5 rounded-full text-[11px] font-medium uppercase tracking-[0.2em] text-[#4b5563] hover:bg-[#0f4c3a]/5 hover:text-[#1A2E22] transition-all duration-300"
                >
                  {link.name}
                </a>
              ))}
            </div>
          )}

          {/* RIGHT ACTIONS */}
          {!minimal && (
            <div className="hidden md:flex items-center gap-2 shrink-0">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 border border-[#ddd] bg-white rounded-full px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-[#111827] hover:bg-[#f7f7f7] transition-all duration-300"
                  >
                    <LayoutDashboard size={14} />
                    Dashboard
                  </button>
                  <AccountDropdown />
                </>
              ) : (
                <button
                  onClick={openSignin}
                  className="flex items-center gap-2 border border-transparent bg-[#0f4c3a] text-[#f2f2f2] rounded-full px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-[#1A2E22] transition-all duration-300"
                >
                  <User size={14} />
                  Sign In
                </button>
              )}
            </div>
          )}

          {/* MOBILE HAMBURGER */}
          {!minimal && (
            <button
              className="md:hidden p-2 text-[#111827] transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          )}
        </div>
      </nav>

      {/* ── MOBILE DRAWER ── */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        landingLinks={landingLinks}
        isLoggedIn={isLoggedIn}
        openSignin={openSignin}
        navigate={navigate}
      />
    </>
  );
};

// =========================
// MOBILE DRAWER
// =========================
const MobileDrawer = ({ isOpen, onClose, landingLinks, isLoggedIn, openSignin, navigate }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[110] md:hidden"
        />

        {/* Drawer */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          className="fixed top-0 right-0 h-full w-[300px] bg-white z-[120] shadow-2xl flex flex-col md:hidden"
        >
          {/* Header */}
          <div className="px-5 pt-5 pb-4 border-b border-[#f2f2f2] flex items-center justify-between">
            <p className="text-sm font-bold text-[#111827]">Menu</p>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-[#f2f2f2] transition-colors">
              <X size={18} className="text-[#6b7280]" />
            </button>
          </div>

          {/* Links */}
          <div className="flex-1 overflow-y-auto py-2">
            {/* Browse */}
            <div className="px-3 py-1">
              <p className="text-[13px] font-bold uppercase tracking-widest text-[#9ca3af] px-3 mb-2">Browse</p>
              {landingLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center gap-4 px-3 py-3.5 rounded-xl hover:bg-[#f7f7f7] active:bg-[#f2f2f2] transition-colors group"
                >
                  <span className="text-[16px] text-[#374151] group-hover:text-[#111827] font-medium">{link.name}</span>
                </a>
              ))}
            </div>

            {/* Dashboard — only when logged in */}
            {isLoggedIn && (
              <div className="px-3 py-1 border-t border-[#f2f2f2] mt-1">
                <p className="text-[13px] font-bold uppercase tracking-widest text-[#9ca3af] px-3 mb-2 mt-2.5">Manage</p>
                <button
                  onClick={() => { navigate('/dashboard'); onClose(); }}
                  className="flex items-center gap-4 px-3 py-3.5 rounded-xl hover:bg-[#f7f7f7] active:bg-[#f2f2f2] transition-colors group w-full text-left"
                >
                  <LayoutDashboard size={22} className="text-[#6b7280] group-hover:text-[#0f4c3a] transition-colors" />
                  <span className="text-[16px] text-[#374151] group-hover:text-[#111827] font-medium">Dashboard</span>
                </button>
              </div>
            )}
          </div>

          {/* Footer — Sign In */}
          {!isLoggedIn && (
            <div className="px-5 py-5 border-t border-[#f2f2f2]">
              <button
                onClick={() => { onClose(); openSignin(); }}
                className="w-full py-3.5 bg-[#0f4c3a] text-white rounded-xl text-base font-bold uppercase tracking-widest active:scale-[0.98] transition-transform"
              >
                Sign In
              </button>
            </div>
          )}
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default Navbar;
