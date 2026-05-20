import React from 'react';
import { NavLink } from 'react-router-dom';
import { User, Heart, Calendar, HelpCircle, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';

const AccountSidebar = () => {
  const { user, logout } = useAuth();
  const { wishlist } = useWishlist();

  const menuItems = [
    { icon: <User className="w-5 h-5" />, label: 'Profile', path: '/account/profile' },
    { icon: <Heart className="w-5 h-5" />, label: 'Shortlist', path: '/account/shortlist', badge: wishlist.length },
    { icon: <Calendar className="w-5 h-5" />, label: 'My Bookings', path: '/account/bookings' },
    { icon: <HelpCircle className="w-5 h-5" />, label: 'Help', path: '/account/help' },
  ];

  return (
    <div className="w-72 shrink-0">
      <div className="sticky top-28 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm overflow-hidden">
        {/* User Info */}
        <div className="mb-8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#1e2d24] flex items-center justify-center text-white font-bold text-lg">
            {user?.initial || 'U'}
          </div>
          <div className="overflow-hidden">
            <h3 className="font-bold text-gray-900 truncate">{user?.name || 'User'}</h3>
            <p className="text-xs text-gray-400 truncate">{user?.identifier || 'Verified'}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gray-50 text-[#0f4c3a] font-semibold'
                    : 'text-gray-500 hover:bg-gray-50/50 hover:text-gray-700'
                }`
              }
            >
              <div className="flex items-center gap-4">
                <span className={({ isActive }) => isActive ? 'text-[#0f4c3a]' : 'text-gray-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge > 0 && (
                <span className="w-5 h-5 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-8 pt-8 border-t border-gray-50">
          <button
            onClick={logout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-500" />
            <span className="font-semibold">Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSidebar;
