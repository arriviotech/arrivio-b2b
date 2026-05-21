import React from 'react';
import { Calendar, MapPin, ChevronRight, Building2, Clock } from 'lucide-react';

const Contracts = () => {
    const contracts = [
        {
            id: 'CT-5921',
            property: 'The Grand Berlin Residences',
            location: 'Mitte, Berlin',
            image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400',
            checkIn: 'Mar 15, 2026',
            checkOut: 'Jun 15, 2026',
            units: [
                { type: 'Premium Studio', quantity: 5 },
                { type: 'One Bedroom Suite', quantity: 2 }
            ],
            status: 'Active',
            totalPrice: '€12,450'
        },
        {
            id: 'CT-4102',
            property: 'Munich Riverside Units',
            location: 'Altstadt-Lehel, Munich',
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400',
            checkIn: 'Jan 10, 2026',
            checkOut: 'Feb 10, 2026',
            units: [
                { type: 'Standard Unit', quantity: 10 }
            ],
            status: 'Completed',
            totalPrice: '€8,200'
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Completed': return 'bg-gray-50 text-gray-500 border-gray-100';
            case 'Cancelled': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-blue-50 text-blue-600 border-blue-100';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
            <div>
                <h1 className="text-3xl font-serif text-[#0f4c3a] mb-2 font-medium">Contracts</h1>
                <p className="text-gray-500 text-sm">Active and past housing contracts held by your company.</p>
            </div>

            <div className="space-y-6">
                {contracts.map((contract) => (
                    <div key={contract.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-64 h-48 md:h-auto relative overflow-hidden">
                                <img
                                    src={contract.image}
                                    alt={contract.property}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(contract.status)} shadow-sm backdrop-blur-sm`}>
                                        {contract.status}
                                    </span>
                                </div>
                            </div>

                            <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{contract.id}</div>
                                            <h2 className="text-xl font-bold text-gray-900 mb-1">{contract.property}</h2>
                                            <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                                                <MapPin className="w-4 h-4" />
                                                {contract.location}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-gray-400 mb-1">Monthly Total</div>
                                            <div className="text-lg font-bold text-[#0f4c3a]">{contract.totalPrice}</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                                                <Calendar className="w-5 h-5 text-[#0f4c3a]" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Contract Period</div>
                                                <div className="text-sm font-semibold text-gray-700">{contract.checkIn} — {contract.checkOut}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                                                <Building2 className="w-5 h-5 text-[#0f4c3a]" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Contracted Units</div>
                                                <div className="text-sm font-semibold text-gray-700">
                                                    {contract.units.map((u, i) => (
                                                        <span key={i}>
                                                            {u.quantity}x {u.type}{i < contract.units.length - 1 ? ', ' : ''}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-end">
                                    <button className="flex items-center gap-2 text-[#0f4c3a] font-bold text-sm hover:gap-3 transition-all">
                                        View Details
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {contracts.length === 0 && (
                    <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Clock className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No contracts yet</h3>
                        <p className="text-gray-400 text-sm max-w-xs mx-auto mt-1">
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
