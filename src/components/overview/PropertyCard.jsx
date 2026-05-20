import React, { useState } from 'react';
import { MapPin, Minus, Plus, Trash2, Sparkles } from 'lucide-react';

const PropertyCard = ({ property, navigate, updateQuantity, removeReservation, handleAddService }) => {
  const [customService, setCustomService] = useState('');

  const housingUnits = property.units.filter(u => u.unitPrice > 0);
  const services = property.units.filter(u => u.unitPrice === 0);

  const onAddService = (e) => {
    e.preventDefault();
    if (!customService.trim()) return;
    handleAddService(customService);
    setCustomService('');
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
      {/* Property Header */}
      <div 
        className="flex flex-col sm:flex-row p-6 border-b border-gray-100 gap-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => navigate(`/property/${property.id}`)}
      >
        <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 border border-gray-200">
          <img src={property.image} alt={property.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-grow flex flex-col justify-center">
          <h2 className="text-xl font-bold text-gray-900 mb-1">{property.name}</h2>
          <div className="flex items-center text-gray-500 text-sm">
            <MapPin size={14} className="mr-1" />
            {property.neighborhood}, {property.city}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 bg-gray-50/50 space-y-8">
        {/* Housing Units */}
        {housingUnits.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">Selected Capacity</h3>
            <div className="space-y-3">
              {housingUnits.map(unit => (
                <div key={unit.unitType} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-grow">
                    <h4 className="font-bold text-gray-900 text-lg">{unit.unitType}</h4>
                    <div className="text-[#1e6f50] font-medium mt-0.5">
                      €{unit.unitPrice.toLocaleString()} <span className="text-gray-500 font-normal text-sm">/ month each</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 w-full sm:w-auto">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                      <button
                        onClick={() => updateQuantity(unit.propertyId, unit.unitType, unit.quantity - 1)}
                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-12 text-center font-bold text-gray-900 bg-white py-2 border-x border-gray-200">{unit.quantity}</span>
                      <button
                        onClick={() => updateQuantity(unit.propertyId, unit.unitType, unit.quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeReservation(unit.propertyId, unit.unitType)}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                      title="Remove completely"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Services Section */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-4 px-2">
            <Sparkles size={16} className="text-[#1e6f50]" />
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Property Services</h3>
          </div>
          
          <div className="space-y-3 mb-6">
            {services.map(service => (
              <div key={service.unitType} className="bg-white/60 border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-grow">
                  <h4 className="font-bold text-gray-900">{service.unitType}</h4>
                  <div className="text-xs text-gray-500">Requested additional service</div>
                </div>

                <div className="flex items-center gap-6 w-full sm:w-auto">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={() => updateQuantity(service.propertyId, service.unitType, service.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center font-bold text-gray-900 py-1 border-x border-gray-200 text-sm">{service.quantity}</span>
                    <button
                      onClick={() => updateQuantity(service.propertyId, service.unitType, service.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeReservation(service.propertyId, service.unitType)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={onAddService} className="flex gap-3 px-2">
            <input 
              type="text"
              value={customService}
              onChange={(e) => setCustomService(e.target.value)}
              placeholder="Add service (e.g. WiFi, Cleaning)..."
              className="flex-grow bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e6f50]/10 focus:border-[#1e6f50] transition-all"
            />
            <button 
              type="submit"
              className="bg-[#1e6f50] hover:bg-[#15543c] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shrink-0"
            >
              <Plus size={16} />
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
