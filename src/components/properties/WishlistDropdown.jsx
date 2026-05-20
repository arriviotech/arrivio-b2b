import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, X } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

const WishlistDropdown = ({ isOpen, onClose }) => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <>
      {/* Invisible overlay to close dropdown when clicking outside */}
      <div className="fixed inset-0 z-40" onClick={onClose}></div>
      
      <div className="absolute top-12 right-0 w-80 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            Wishlist
          </h3>
          <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full">
            {wishlist.length}
          </span>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Heart className="w-5 h-5 text-gray-300" />
            </div>
            <p className="text-gray-500 text-sm">Your wishlist is empty</p>
            <p className="text-gray-400 text-xs mt-1">Save properties you like</p>
          </div>
        ) : (
          <div className="max-h-[320px] overflow-y-auto space-y-3 pr-2 scrollbar-thin">
            {wishlist.map((property) => (
              <div 
                key={property.id} 
                className="flex gap-3 items-center group cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded-lg transition-colors border border-transparent hover:border-gray-100"
                onClick={() => {
                  navigate(`/property/${property.id}`);
                  onClose();
                }}
              >
                <div className="w-16 h-12 rounded-md overflow-hidden shrink-0 border border-gray-200">
                  <img src={property.image} alt={property.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-grow min-w-0">
                  <h4 className="text-sm font-semibold text-gray-800 truncate">{property.name}</h4>
                  <p className="text-xs text-gray-500 truncate">{property.neighborhood}</p>
                  <p className="text-xs font-medium mt-0.5 text-[#1a2b3c]">€{property.price?.toLocaleString()} / mo</p>
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWishlist(property.id);
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                  title="Remove from wishlist"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default WishlistDropdown;
