import React, { useState, useMemo } from 'react';
import { Building2, MapPin, Search, SlidersHorizontal, Heart, DoorOpen, Ruler, ArrowRight, Home } from 'lucide-react';
import { useProperties } from '../../supabase/hooks/useProperties';
import { useNavigate } from 'react-router-dom';

const PropertyCardItem = ({ property, navigate }) => {
    const [isWishlisted, setIsWishlisted] = useState(false);

    const handleHeartClick = (e) => {
        e.stopPropagation();
        setIsWishlisted(!isWishlisted);
    };

    const typeLabels = { studio: 'Studio', one_bedroom: 'Single Room', two_bedroom: '2-Bedroom', shared_room: 'Shared Room' };
    const reservedBreakdown = Object.entries(property.breakdown || {})
        .filter(([, count]) => count > 0)
        .map(([type, count]) => ({
            unitType: typeLabels[type] || type.replace(/_/g, ' '),
            quantity: count,
            typeKey: type
        }));
    
    const totalUnits = property.totalUnits || reservedBreakdown.reduce((acc, unit) => acc + unit.quantity, 0);
    const size = property.details?.size || (property.size ? property.size : '16–46');
    const priceVal = property.price || property.priceEur || 522;

    return (
        <div
            onClick={() => navigate(`/dashboard/properties/${property.id}`)}
            className="bg-white rounded-2xl border border-[#e5e7eb] hover:border-[#0f4c3a]/20 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden flex flex-col h-full"
        >
            {/* Image — compact 16:9 */}
            <div className="relative aspect-[16/9] overflow-hidden bg-[#f0f0f0]">
                {property.image ? (
                    <img
                        src={property.image}
                        alt={property.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#d1d5db]">
                        <Home size={40} />
                    </div>
                )}

                {/* Status/Availability Badge — top left */}
                <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[10px] font-bold text-[#16a34a] shadow-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]"></span>
                        </span>
                        Active
                    </span>
                </div>

                {/* Heart — top right */}
                <button
                    className={`absolute top-3 right-3 z-10 p-2 rounded-full shadow-sm transition-transform hover:scale-110 ${
                        isWishlisted ? 'bg-rose-50' : 'bg-white/95 backdrop-blur-sm'
                    }`}
                    onClick={handleHeartClick}
                >
                    <Heart
                        size={16}
                        className={`transition-colors ${
                            isWishlisted ? 'fill-red-500 text-red-500' : 'text-[#6b7280] group-hover:text-red-500'
                        }`}
                    />
                </button>
            </div>

            {/* Body */}
            <div className="p-4 flex flex-col flex-grow">
                {/* Title + Location */}
                <h3 className="font-bold text-[16px] text-[#111827] leading-tight mb-1.5 line-clamp-1">
                    {property.name}
                </h3>
                <p className="flex items-center gap-1 text-[12px] text-[#4b5563] mb-3">
                    <MapPin size={12} className="text-[#6b7280]" />
                    {property.neighborhood || property.district || property.city}{property.city && (property.neighborhood || property.district) ? `, ${property.city}` : ''}
                </p>

                {/* Unit type breakdown — pill badges */}
                {reservedBreakdown.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        {reservedBreakdown.map((unit) => (
                            <span
                                key={unit.unitType}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#f2f2f2] text-[11px] text-[#374151]"
                            >
                                <span className="font-bold text-[#111827]">{unit.quantity}</span>
                                <span className="text-[#9ca3af]">×</span>
                                <span className="font-medium">{unit.unitType}</span>
                            </span>
                        ))}
                    </div>
                )}

                {/* Metrics row */}
                <div className="flex items-center gap-3 text-[12px] text-[#6b7280] mb-4">
                    {totalUnits > 0 && (
                        <span className="flex items-center gap-1.5">
                            <DoorOpen size={14} className="text-[#9ca3af]" />
                            <span className="font-semibold text-[#374151]">{totalUnits}</span> units
                        </span>
                    )}
                    {totalUnits > 0 && size && (
                        <span className="text-[#d1d5db]">·</span>
                    )}
                    {size && (
                        <span className="flex items-center gap-1.5">
                            <Ruler size={14} className="text-[#9ca3af]" />
                            <span className="font-semibold text-[#374151]">{size}</span> m²
                        </span>
                    )}
                </div>

                {/* Price + CTA */}
                <div className="mt-auto pt-4 border-t border-[#f2f2f2] flex items-center justify-between pb-1">
                    <div>
                        <span className="text-[10px] text-[#9ca3af] font-medium">from </span>
                        <span className="text-lg font-bold text-[#111827]">€{priceVal.toLocaleString()}</span>
                        <span className="text-[10px] text-[#9ca3af] font-medium"> /mo</span>
                    </div>
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-[#0f4c3a] group-hover:gap-2 transition-all">
                        View details <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </span>
                </div>
            </div>
        </div>
    );
};

const DashboardProperties = () => {
    const navigate = useNavigate();
    const { properties: allProperties, loading } = useProperties();
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('name');

    const mockUserProperties = useMemo(() => allProperties, [allProperties]);

    const filteredAndSortedProperties = useMemo(() => {
        let result = [...mockUserProperties];

        // Search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.city.toLowerCase().includes(query) ||
                (p.neighborhood || '').toLowerCase().includes(query)
            );
        }

        // Sort
        if (sortBy === 'name') {
            result.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === 'capacity') {
            result.sort((a, b) => {
                const capacityA = Object.values(a.breakdown).reduce((acc, val) => acc + val, 0);
                const capacityB = Object.values(b.breakdown).reduce((acc, val) => acc + val, 0);
                return capacityB - capacityA; // Descending capacity
            });
        }

        return result;
    }, [searchQuery, sortBy, mockUserProperties]);

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <header className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 mb-10 pb-2">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Your Properties</h1>
                    <p className="text-gray-550 mt-2 font-medium text-sm">Manage and view the properties you have reserved capacity in.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search properties, cities..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4c3a]/20 focus:border-[#0f4c3a] transition-all shadow-sm font-medium text-gray-900 placeholder-gray-400"
                        />
                    </div>

                    <div className="relative w-full sm:w-auto min-w-[170px]">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full pl-11 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4c3a]/20 focus:border-[#0f4c3a] transition-all shadow-sm font-bold text-gray-700 appearance-none cursor-pointer"
                        >
                            <option value="name">Sort by Name</option>
                            <option value="capacity">Sort by Capacity</option>
                        </select>
                        <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>
            </header>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="bg-white rounded-2xl overflow-hidden border border-[#e5e7eb] p-3 shadow-sm animate-pulse">
                            <div className="h-60 bg-gray-100 rounded-xl mb-6"></div>
                            <div className="p-4 space-y-4">
                                <div className="h-6 bg-gray-200 rounded-full w-2/3"></div>
                                <div className="h-4 bg-gray-100 rounded-full w-1/2"></div>
                                <div className="border-t border-gray-50 pt-4 mt-4 flex justify-between">
                                    <div className="h-8 bg-gray-100 rounded-lg w-20"></div>
                                    <div className="h-8 bg-gray-100 rounded-lg w-24"></div>
                                </div>
                                <div className="h-10 bg-gray-150 rounded-2xl w-full mt-4"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredAndSortedProperties.length === 0 ? (
                <div className="bg-white rounded-2xl p-16 text-center border border-[#e5e7eb] shadow-sm flex flex-col items-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <Building2 className="w-10 h-10 text-gray-300" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">No properties found</h2>
                    <p className="text-gray-550 mb-8 max-w-md text-center text-sm font-medium">
                        {searchQuery ? `We couldn't find any properties matching "${searchQuery}".` : "Your reserved properties will appear here. Browse our available catalog to secure housing."}
                    </p>
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="px-5 py-2.5 bg-[#0f4c3a] text-white font-bold rounded-xl text-sm hover:bg-[#0a3a2b] transition-colors shadow-sm"
                        >
                            Clear Search
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredAndSortedProperties.map(property => (
                        <PropertyCardItem key={property.id} property={property} navigate={navigate} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default DashboardProperties;
