import React, { useState, useMemo } from 'react';
import { Building2, MapPin, ExternalLink, Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import { useProperties } from '../../supabase/hooks/useProperties';
import { useNavigate } from 'react-router-dom';

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
            <header className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 mb-10 pb-6 border-b border-gray-150">
                <div>
                    <h1 className="text-3xl font-serif font-semibold tracking-tight text-gray-900">Your Properties</h1>
                    <p className="text-gray-500 mt-2 font-medium text-sm">Manage and view the properties you have reserved capacity in.</p>
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
                    <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-3">No properties found</h2>
                    <p className="text-gray-500 mb-8 max-w-md text-center text-sm font-medium">
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
                    {filteredAndSortedProperties.map(property => {
                        const typeLabels = { studio: 'Studio', one_bedroom: 'Single Room', two_bedroom: '2-Bedroom', shared_room: 'Shared Room' };
                        const reservedBreakdown = Object.entries(property.breakdown || {})
                            .filter(([, count]) => count > 0)
                            .map(([type, count]) => ({
                                unitType: typeLabels[type] || type.replace(/_/g, ' '),
                                quantity: count
                            }));
                        const totalUnits = property.totalUnits || reservedBreakdown.reduce((acc, unit) => acc + unit.quantity, 0);

                        return (
                            <div
                                key={property.id}
                                onClick={() => navigate(`/dashboard/properties/${property.id}`)}
                                className="bg-white rounded-2xl overflow-hidden border border-[#e5e7eb] hover:border-[#0f4c3a]/20 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group cursor-pointer"
                            >
                                {/* Image Box */}
                                <div className="h-60 overflow-hidden relative p-3 pb-0">
                                    <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-inner">
                                        <img src={property.image} alt={property.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" />
                                        {/* Fallback to strong inline linear-gradient if tailwind classes are somehow failing/purged */}
                                        <div
                                            className="absolute inset-0 pointer-events-none"
                                            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 40%, transparent 100%)' }}
                                        ></div>

                                        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ExternalLink size={14} style={{ color: 'white' }} />
                                        </div>
                                        <div className="absolute bottom-5 left-5 right-4 z-10">
                                            {/* Forcing color #d4c3a3 and shadow via inline styles so it cannot be overridden */}
                                            <h2
                                                className="text-2xl font-serif font-semibold mb-1.5 tracking-tight leading-tight"
                                                style={{ color: '#d4c3a3', textShadow: '0 2px 14px rgba(0,0,0,1), 0 0 4px rgba(0,0,0,0.8)' }}
                                            >
                                                {property.name}
                                            </h2>
                                            <div
                                                className="flex items-center text-xs font-medium"
                                                style={{ color: '#e5e7eb', textShadow: '0 1px 5px rgba(0,0,0,0.9), 0 0 3px rgba(0,0,0,0.8)' }}
                                            >
                                                <MapPin size={13} className="mr-1.5 opacity-90" />
                                                {property.neighborhood || property.district}, {property.city}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="p-6 flex-grow flex flex-col bg-white">

                                    {/* Capacity Header */}
                                    <div className="flex justify-between items-center pb-5 border-b border-gray-100 mb-5">
                                        <div>
                                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</span>
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold tracking-wide border border-emerald-100">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                Active
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Capacity</span>
                                            <div className="text-xl font-serif font-semibold text-gray-900 leading-none">
                                                {totalUnits} <span className="text-xs font-semibold text-gray-400 ml-0.5">Units</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Breakdown */}
                                    <div className="space-y-3 mt-auto mb-6">
                                        {reservedBreakdown.map(unit => (
                                            <div key={unit.unitType} className="flex justify-between items-center group/item hover:bg-gray-50 p-2 -mx-2 rounded-xl transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-[#0f4c3a]/5 flex items-center justify-center border border-[#0f4c3a]/5 group-hover/item:border-[#0f4c3a]/10 group-hover/item:bg-white transition-colors shadow-sm">
                                                        <Building2 size={15} className="text-[#0f4c3a] group-hover/item:text-[#0f4c3a] transition-colors" />
                                                    </div>
                                                    <span className="font-semibold text-gray-700 text-sm">{unit.unitType}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="font-bold text-base text-gray-900 bg-gray-50 w-8 h-8 rounded-lg flex items-center justify-center border border-gray-150 group-hover/item:bg-white group-hover/item:border-gray-250 transition-colors">{unit.quantity}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <button className="w-full py-3 bg-white border border-[#e5e7eb] text-[#111827] text-xs font-semibold uppercase tracking-wider rounded-xl hover:border-[#0f4c3a]/40 hover:bg-[#0f4c3a]/5 hover:text-[#0f4c3a] transition-all flex items-center justify-center gap-2 group/btn">
                                        Manage Units
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default DashboardProperties;
