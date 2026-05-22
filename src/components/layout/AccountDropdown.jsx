import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, HelpCircle, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AccountDropdown = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Account Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-white border border-gray-200 rounded-full pl-1.5 pr-3 py-1.5 hover:shadow-md transition-all duration-200 cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full bg-[#1e2d24] flex items-center justify-center text-white font-bold text-sm">
          {user.initial}
        </div>
        <Menu className="w-5 h-5 text-gray-500" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="p-4 border-b border-gray-50">
            <div className="font-bold text-gray-900">
              {user.type === 'mobile' ? user.identifier : user.name}
            </div>
            <div className="text-xs text-gray-400 truncate">
              {user.type === 'email' ? user.identifier : 'Verified Mobile'}
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              onClick={() => { navigate('/account/profile'); setIsOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <User className="w-4 h-4 text-gray-400" />
              <span>Profile</span>
            </button>
          </div>

          <div className="border-t border-gray-50 py-1">
            <button 
              onClick={() => { navigate('/account/help'); setIsOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-gray-400" />
              <span>Help</span>
            </button>
          </div>

          <div className="border-t border-gray-50 py-1">
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountDropdown;
