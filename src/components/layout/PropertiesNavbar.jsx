import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, User, Search, X } from 'lucide-react';
import greenLogo from '../../assets/greenlogo.png';
import { useWishlist } from '../../context/WishlistContext';
import { useReservation } from '../../context/ReservationContext';
import { useModal } from '../../context/ModalContext';
import { useAuth } from '../../context/AuthContext';
import AccountDropdown from './AccountDropdown';
import WishlistDropdown from '../properties/WishlistDropdown';

const PropertiesNavbar = ({ searchTerm = '', onSearchChange, isHidden = false }) => {
  const navigate = useNavigate();
  const { wishlist } = useWishlist();
  const { reservations } = useReservation();
  const { openSignin } = useModal();
  const { isLoggedIn } = useAuth();
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const totalUnits = reservations.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] h-16 md:h-20 px-4 md:px-12 bg-[#f2f2f2]/90 backdrop-blur-xl shadow-md transition-transform duration-300 ease-out ${isHidden ? '-translate-y-full' : 'translate-y-0'}`}>
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="shrink-0 flex items-center">
          <img src={greenLogo} alt="Arrivio" className="h-10 w-auto object-contain transition-all duration-500" />
        </Link>

        {/* Center: Search (only if onSearchChange is provided) */}
        {onSearchChange && (
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none" />
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-full bg-white border border-[#e5e7eb] text-[13px] font-medium focus:outline-none focus:border-[#0f4c3a]/20 focus:ring-2 focus:ring-[#0f4c3a]/5 transition-all placeholder:text-[#9ca3af] shadow-sm"
              />
              {searchTerm && (
                <button onClick={() => onSearchChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#111827]">
                  <X size={13} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">

          {/* Wishlist */}
          <div className="relative">
            <button
              onClick={() => setIsWishlistOpen(!isWishlistOpen)}
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 transition-colors relative group"
              title="Shortlist"
            >
              <Heart size={20} className={`transition-colors ${wishlist.length > 0 ? 'text-red-500' : 'text-[#111827] group-hover:text-red-500'}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#EA4335] text-[10px] font-bold text-white">
                  {wishlist.length > 9 ? '9+' : wishlist.length}
                </span>
              )}
            </button>
            <WishlistDropdown isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
          </div>

          {/* Overview */}
          <button
            onClick={() => navigate('/overview')}
            className="hidden md:flex items-center gap-2 border border-[#ddd] bg-white rounded-full px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-[#111827] hover:bg-[#f7f7f7] transition-all duration-300 relative"
          >
            <ShoppingBag size={14} />
            Overview
            {totalUnits > 0 && (
              <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#0f4c3a] text-[10px] font-bold text-white">
                {totalUnits}
              </span>
            )}
          </button>

          {/* Auth */}
          {isLoggedIn ? (
            <AccountDropdown />
          ) : (
            <button
              onClick={openSignin}
              className="hidden md:flex items-center gap-2 border border-transparent bg-[#0f4c3a] text-[#f2f2f2] rounded-full px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-[#1A2E22] transition-all duration-300"
            >
              <User size={14} />
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default PropertiesNavbar;
