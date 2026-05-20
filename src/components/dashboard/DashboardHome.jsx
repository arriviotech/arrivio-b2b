import React, { useState, useMemo } from 'react';
import Status from './Status';
import { Search, ArrowUpDown } from 'lucide-react';

const DashboardHome = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('name'); // 'name' or 'progress'

    // Mock data for booked properties
    const propertiesData = [
        { id: 1, name: 'Frankfurt Sachsenhausen', onboardingStep: 8, moveInDate: 'Oct 12, 2025' },
        { id: 2, name: 'Frankfurt Single Living', onboardingStep: 4, moveInDate: 'Nov 01, 2025' },
        { id: 3, name: 'Berlin Central Hub', onboardingStep: 1, moveInDate: 'Dec 15, 2025' },
    ];

    const filteredAndSortedProperties = useMemo(() => {
        return propertiesData
            .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .sort((a, b) => {
                if (sortBy === 'name') {
                    return a.name.localeCompare(b.name);
                } else if (sortBy === 'progress') {
                    return b.onboardingStep - a.onboardingStep;
                }
                return 0;
            });
    }, [searchQuery, sortBy]);

    return (
        <div className="max-w-6xl mx-auto">
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Here is what's happening today.</p>
                </div>
            </header>

            <div className="mb-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h2 className="text-xl font-bold tracking-tight text-gray-900">Onboarding Status</h2>
                    
                    <div className="flex items-center gap-3">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search properties..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e6f50]/20 focus:border-[#1e6f50] transition-all w-full sm:w-64"
                            />
                        </div>

                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm hover:border-[#1e6f50] transition-colors cursor-pointer group relative">
                            <ArrowUpDown className="w-4 h-4 text-gray-400 group-hover:text-[#1e6f50]" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-transparent outline-none cursor-pointer text-gray-600 font-medium appearance-none pr-4"
                            >
                                <option value="name">Sort by Name</option>
                                <option value="progress">Sort by Progress</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-4">
                    {filteredAndSortedProperties.length > 0 ? (
                        filteredAndSortedProperties.map(property => (
                            <Status key={property.id} property={property} />
                        ))
                    ) : (
                        <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200 text-gray-400">
                            <p>No properties found matching "{searchQuery}"</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <h3 className="text-gray-500 font-bold tracking-wide text-xs uppercase mb-2">Active Properties</h3>
                    <p className="text-4xl font-bold tracking-tight text-gray-900">12</p>
                    <div className="mt-4 text-sm font-medium text-emerald-600 flex items-center gap-1">
                        <span>+2 from last month</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <h3 className="text-gray-500 font-bold tracking-wide text-xs uppercase mb-2">Total Employees</h3>
                    <p className="text-4xl font-bold tracking-tight text-gray-900">48</p>
                    <div className="mt-4 text-sm font-medium text-emerald-600 flex items-center gap-1">
                        <span>+5 new arrivals</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <h3 className="text-gray-500 font-bold tracking-wide text-xs uppercase mb-2">Monthly Spend</h3>
                    <p className="text-4xl font-bold tracking-tight text-gray-900">€24,500</p>
                    <div className="mt-4 text-sm font-medium text-gray-400 flex items-center gap-1">
                        <span>Projected for March</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[400px]">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-bold tracking-tight">Recent Activity</h2>
                </div>
                <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="font-medium text-gray-500">No recent activity to display</p>
                    <p className="text-sm mt-1">Activity will appear here as you manage reservations.</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
