import React from 'react';
import AccountLayout from '../../components/layout/AccountLayout';
import { useWishlist } from '../../context/WishlistContext';
import { Heart, Star, MapPin, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Shortlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  return (
    <AccountLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-serif text-[#0f4c3a] mb-2 font-medium">Shortlist</h1>
            <p className="text-gray-500 text-sm">Review your saved properties and capacities.</p>
          </div>
          <p className="text-sm font-semibold text-gray-400">
            {wishlist.length} {wishlist.length === 1 ? 'Property' : 'Properties'} saved
          </p>
        </div>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 pb-20">
            {wishlist.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image Container */}
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <button 
                      onClick={() => removeFromWishlist(item.id)}
                      className="bg-white/90 backdrop-blur-sm p-2 rounded-xl shadow-lg hover:bg-red-50 hover:text-red-500 transition-all duration-200 text-gray-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  {item.rating && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-lg flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                      <span className="text-[11px] font-bold text-gray-700">{item.rating}</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">
                      <MapPin className="w-3 h-3" />
                      <span>{item.city}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2">{item.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400 font-medium">Starting from</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-[#0f4c3a]">₹{item.price}</span>
                        <span className="text-xs text-gray-400">/mo</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate(`/city/${item.city.toLowerCase().replace(/\s+/g, '-')}`)}
                      className="bg-[#1e6f50] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#185e43] transition-colors"
                    >
                      Check Availability
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl border-2 border-dashed border-gray-100 p-20 text-center space-y-6">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-gray-200" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-serif text-[#0f4c3a] font-medium">Your shortlist is empty</h2>
              <p className="text-gray-400 text-sm max-w-xs mx-auto">
                Discover properties and save them here to easily compare and plan your city moves.
              </p>
            </div>
            <button 
              onClick={() => navigate('/cities')}
              className="bg-[#1e2d24] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#15201a] transition-all duration-200"
            >
              Explore Properties
            </button>
          </div>
        )}
      </div>
    </AccountLayout>
  );
};

export default Shortlist;
