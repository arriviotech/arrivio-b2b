import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, X } from 'lucide-react';

// Fix Leaflet marker icon issues
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Helper to calculate distance in KM between two points
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

// Custom Price Marker Icon
const createPriceIcon = (price) => {
  return L.divIcon({
    className: 'custom-price-marker',
    html: `
      <div class="flex items-center justify-center bg-white px-3 py-1.5 rounded-full shadow-lg border border-gray-100 font-bold text-sm text-gray-900 group whitespace-nowrap">
        €${price}
      </div>
    `,
    iconSize: [60, 30],
    iconAnchor: [30, 15]
  });
};

// Custom Green Pin for Search Result
const createSearchIcon = () => {
  return L.divIcon({
    className: 'custom-search-marker',
    html: `
      <div class="flex items-center justify-center bg-[#1e6f50] w-10 h-10 rounded-full shadow-2xl border-2 border-white animate-bounce-slow">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40]
  });
};

// Map Control to update center/zoom
const ChangeView = ({ properties, searchMarker, center }) => {
  const map = useMap();
  
  useEffect(() => {
    if (searchMarker && properties.length > 0) {
      // Find smallest radius with at least one property for the view
      let viewRadius = 15;
      let nearbyForView = [];
      
      while (viewRadius <= 150) {
        nearbyForView = properties.filter(p => {
          if (!p.lat || !p.lng) return false;
          const dist = calculateDistance(searchMarker.lat, searchMarker.lng, p.lat, p.lng);
          return dist <= viewRadius;
        });
        if (nearbyForView.length > 0) break;
        viewRadius += 15;
      }

      // Create bounds including search result
      const bounds = L.latLngBounds([searchMarker.lat, searchMarker.lng]);
      
      // Add nearby properties to bounds (or all if none found within 150km)
      const targets = nearbyForView.length > 0 ? nearbyForView : properties;
      targets.forEach(p => {
        if (p.lat && p.lng) {
          bounds.extend([p.lat, p.lng]);
        }
      });

      map.fitBounds(bounds, {
        padding: [80, 80],
        maxZoom: 15,
        animate: true,
        duration: 1.5
      });
    } else if (center) {
      map.setView(center, 12, {
        animate: true,
        duration: 1
      });
    }
  }, [searchMarker, properties, center, map]);
  
  return null;
};

// Map View Component
const MapView = ({ properties, searchMarker: externalSearchMarker, onSearchMarkerChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [searchMarker, setSearchMarker] = useState(externalSearchMarker);
  const [mapCenter, setMapCenter] = useState([52.5200, 13.4050]);
  const [pinnedPropertyId, setPinnedPropertyId] = useState(null);
  const navigate = useNavigate();

  // Sync internal searchMarker with external prop (for clearing search)
  useEffect(() => {
    if (externalSearchMarker === null) {
      setSearchMarker(null);
      setInputValue('');
    } else {
      setSearchMarker(externalSearchMarker);
    }
  }, [externalSearchMarker]);

  const handleMapSearch = async (query) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const newCoords = [parseFloat(lat), parseFloat(lon)];
        const marker = { lat: parseFloat(lat), lng: parseFloat(lon), name: display_name };
        setSearchMarker(marker);
        setMapCenter(newCoords);
        if (onSearchMarkerChange) onSearchMarkerChange(marker);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  };

  const handleClearSearch = () => {
    setSearchMarker(null);
    setInputValue('');
    if (onSearchMarkerChange) onSearchMarkerChange(null);
  };

  // Calculate Initial Map Center if not searching
  useEffect(() => {
    if (!searchMarker) {
      const firstProp = properties.find(p => p.lat && p.lng);
      if (firstProp) {
        setMapCenter([firstProp.lat, firstProp.lng]);
      }
    }
  }, [properties, searchMarker]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      handleMapSearch(inputValue);
    }
  };

  return (
    <div className="h-full w-full relative rounded-2xl overflow-hidden shadow-inner bg-gray-100 border border-gray-100">
      <MapContainer 
        center={mapCenter || [52.5200, 13.4050]} 
        zoom={12} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <ChangeView properties={properties} searchMarker={searchMarker} center={mapCenter} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="grayscale opacity-80"
        />
        
        {/* Search Result Marker (Green Pin) */}
        {searchMarker && (
          <Marker position={[searchMarker.lat, searchMarker.lng]} icon={createSearchIcon()}>
            <Popup>
              <div className="p-2 text-center">
                <p className="font-bold text-sm text-[#1e6f50]">Searched Location</p>
                <p className="text-xs text-gray-500 mt-0.5">{searchMarker.name}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {properties.map(p => (
          p.lat && p.lng && (
            <Marker 
              key={p.id} 
              position={[p.lat, p.lng]} 
              icon={createPriceIcon(p.price)}
              eventHandlers={{
                mouseover: (e) => {
                  e.target.openPopup();
                },
                mouseout: (e) => {
                  if (pinnedPropertyId !== p.id) {
                    e.target.closePopup();
                  }
                },
                click: (e) => {
                  setPinnedPropertyId(p.id);
                  e.target.openPopup();
                }
              }}
            >
              <Popup closeButton={false} autoPan={false} className="property-popup">
                <div 
                  className="w-[220px] bg-white overflow-hidden shadow-2xl cursor-pointer hover:shadow-3xl transition-shadow duration-300"
                  onClick={() => navigate(`/property/${p.id}`)}
                >
                  <div className="relative h-28 w-full">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <h3 className="font-serif font-bold text-[#1f3b35] text-[15px] leading-tight truncate">
                      {p.name}
                    </h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-gray-500 text-xs font-medium uppercase tracking-wider">{p.city}</span>
                      <span className="font-bold text-[#1f3b35]">€{p.price}</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
      
      {/* Real Search Bar Overlay */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] w-[80%] max-w-[400px]">
        <form onSubmit={handleSubmit} className="relative group">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search company, place or area..."
            className="w-full bg-white pl-12 pr-4 py-3 rounded-full shadow-2xl border border-gray-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1e6f50]/20 focus:border-[#1e6f50] transition-all"
          />
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-gray-600 transition-colors" />
          {searchMarker && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-500 transition-colors"
            >
              <X size={18} />
            </button>
          )}
          <button type="submit" className="hidden">Search</button>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-price-marker {
          background: transparent !important;
          border: none !important;
        }
        .custom-search-marker {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-popup-content-wrapper {
          padding: 0;
          overflow: hidden;
          background: transparent !important;
          box-shadow: none !important;
          border-radius: 16px;
        }
        .leaflet-popup-content {
          margin: 0 !important;
          width: 220px !important;
        }
        .leaflet-popup-tip-container {
          display: none !important;
        }
        .leaflet-popup {
          margin-bottom: 20px;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite ease-in-out;
        }
      `}} />
    </div>
  );
};

export default MapView;
