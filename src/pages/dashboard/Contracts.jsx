import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Building2, Clock, Heart, ArrowRight, Home } from 'lucide-react';

const Contracts = () => {
    const contracts = [
        {
            id: 'CT-7041',
            property: 'Berlin Central Hub',
            location: 'Mitte, Berlin',
            image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=400',
            checkIn: 'Dec 15, 2026',
            checkOut: 'Dec 15, 2027',
            units: [
                { type: 'Shared Room', quantity: 5 }
            ],
            status: 'Active',
            totalPrice: '€13,200'
        },
        {
            id: 'CT-5921',
            property: 'Frankfurt Sachsenhausen',
            location: 'Sachsenhausen, Frankfurt',
            image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400',
            checkIn: 'Oct 12, 2026',
            checkOut: 'Oct 12, 2027',
            units: [
                { type: 'Studio Apartment', quantity: 8 },
                { type: 'Shared Room', quantity: 7 }
            ],
            status: 'Active',
            totalPrice: '€11,200'
        },
        {
            id: 'CT-4102',
            property: 'Frankfurt Single Living',
            location: 'Central, Frankfurt',
            image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=400',
            checkIn: 'Nov 01, 2026',
            checkOut: 'Nov 01, 2027',
            units: [
                { type: 'Individual Unit', quantity: 9 }
            ],
            status: 'Active',
            totalPrice: '€8,100'
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'text-[#16a34a] bg-white/95';
            case 'Completed': return 'text-gray-500 bg-white/95';
            default: return 'text-blue-500 bg-white/95';
        }
    };

    // Card subcomponent for local states like wishlist heart
    const ContractCard = ({ contract }) => {
        const navigate = useNavigate();

        return (
            <div
                onClick={() => navigate(`/dashboard/contracts/${contract.id}`)}
                className="bg-white rounded-2xl border border-[#e5e7eb] hover:border-[#0f4c3a]/20 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden flex flex-col h-full"
            >
                {/* Image Aspect Box */}
                <div className="relative aspect-[16/9] overflow-hidden bg-[#f0f0f0]">
                    {contract.image ? (
                        <img
                            src={contract.image}
                            alt={contract.property}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#d1d5db]">
                            <Home size={40} />
                        </div>
                    )}

                    {/* Status Pill Badge — top left */}
                    <div className="absolute top-3 left-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm backdrop-blur-sm ${getStatusColor(contract.status)}`}>
                            <span className={`relative flex h-2 w-2`}>
                                {contract.status === 'Active' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>}
                                <span className={`relative inline-flex rounded-full h-2 w-2 ${contract.status === 'Active' ? 'bg-[#22C55E]' : 'bg-gray-400'}`}></span>
                            </span>
                            {contract.status}
                        </span>
                    </div>

                    {/* Contract ID Badge — top right */}
                    <div className="absolute top-3 right-3 z-10 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-bold text-gray-700 shadow-sm border border-gray-100 uppercase tracking-wider">
                        {contract.id}
                    </div>
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col flex-grow">
                    {/* Title + Location */}
                    <h3 className="font-bold text-[16px] text-[#111827] leading-tight mb-1.5 line-clamp-1">
                        {contract.property}
                    </h3>
                    <p className="flex items-center gap-1 text-[12px] text-[#4b5563] mb-3">
                        <MapPin size={12} className="text-[#6b7280]" />
                        {contract.location}
                    </p>

                    {/* Unit breakdown tags */}
                    {contract.units.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {contract.units.map((unit, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#f2f2f2] text-[11px] text-[#374151]"
                                >
                                    <span className="font-bold text-[#111827]">{unit.quantity}</span>
                                    <span className="text-[#9ca3af]">×</span>
                                    <span className="font-medium">{unit.type}</span>
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Period metrics row */}
                    <div className="flex items-center gap-2 text-[12px] text-[#6b7280] mb-4">
                        <span className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-[#9ca3af]" />
                            <span className="font-semibold text-[#374151]">{contract.checkIn} — {contract.checkOut}</span>
                        </span>
                    </div>

                    {/* Price + CTA Footer */}
                    <div className="mt-auto pt-4 border-t border-[#f2f2f2] flex items-center justify-between pb-1">
                        <div>
                            <span className="text-[10px] text-[#9ca3af] font-medium">total </span>
                            <span className="text-lg font-bold text-[#111827]">{contract.totalPrice}</span>
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

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
            <div>
                <h1 className="text-3xl font-bold text-[#0f4c3a] mb-2">Active Contracts</h1>
                <p className="text-gray-550 text-sm font-medium">Active and past housing contracts held by your company.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {contracts.map((contract) => (
                    <ContractCard key={contract.id} contract={contract} />
                ))}

                {contracts.length === 0 && (
                    <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200 col-span-full">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Clock className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No contracts yet</h3>
                        <p className="text-gray-400 text-sm max-w-xs mx-auto mt-1 font-medium">
                            You haven't signed any housing contracts yet.
                        </p>
                        <button className="mt-6 text-[#1e6f50] font-bold text-sm hover:underline">
                            Browse Properties
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Contracts;
