import React from 'react';
import { CreditCard, Package, Clock, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';

const Billing = () => {
    const activePlan = {
        name: 'Enterprise Plus',
        price: '€2,499',
        period: 'Monthly',
        nextBilling: 'April 10, 2026',
        usage: {
            residents: { current: 142, limit: 500 },
            properties: { current: 12, limit: 25 }
        }
    };

    const ProgressBar = ({ current, limit, label }) => {
        const percentage = (current / limit) * 100;
        return (
            <div className="space-y-2">
                <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-gray-700">{label}</span>
                    <span className="text-xs font-medium text-gray-500">{current} / {limit} Units</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-[#1e6f50] rounded-full transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
            </div>
        );
    };    return (
        <div className="max-w-[1100px] mx-auto animate-in fade-in duration-500 space-y-6">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Billing & Subscription</h1>
                    <p className="text-sm text-gray-500 font-medium">Manage your plan, usage limits and billing preferences</p>
                </div>
                <button className="px-5 py-2.5 bg-[#0a2e1f] text-white rounded-xl font-bold hover:bg-[#1e6f50] transition-all shadow-lg shadow-[#0a2e1f]/10 active:scale-95 flex items-center gap-2 text-sm">
                    Upgrade Plan
                    <ArrowUpRight size={16} />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Plan Card */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-[#1e6f50]/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#1e6f50]/10 flex items-center justify-center text-[#1e6f50]">
                                        <Package size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-[#1e6f50] uppercase tracking-[0.2em] mb-0.5">Current Plan</p>
                                        <h3 className="text-xl font-bold text-gray-900">{activePlan.name}</h3>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Pricing</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-black text-gray-900">{activePlan.price}</span>
                                        <span className="text-xs text-gray-500 font-medium">/{activePlan.period.toLowerCase()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 p-6 bg-gray-50/50 rounded-2xl border border-gray-50">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Usage Statistics</p>
                                    <div className="space-y-4">
                                        <ProgressBar label="Resident Capacity" current={activePlan.usage.residents.current} limit={activePlan.usage.residents.limit} />
                                        <ProgressBar label="Property Count" current={activePlan.usage.properties.current} limit={activePlan.usage.properties.limit} />
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center border-l border-gray-100 md:pl-8">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Next Renewal</p>
                                    <div className="flex items-center gap-2 text-gray-900">
                                        <Clock size={18} className="text-amber-500" />
                                        <span className="text-base font-bold">{activePlan.nextBilling}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-2">Auto-renewal is enabled for this account</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Payment Methods</h3>
                            <button className="text-xs font-bold text-[#1e6f50] hover:text-[#15543c] transition-colors flex items-center gap-1.5">
                                <Plus size={14} />
                                Add New Card
                            </button>
                        </div>
                        
                        <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-[#1e6f50]/20 hover:bg-white transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-8 bg-black rounded-lg flex items-center justify-center text-white font-black text-[10px]">
                                    VISA
                                </div>
                                <div className="flex items-center gap-3">
                                    <p className="text-sm font-bold text-gray-900 leading-none">•••• 4242</p>
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[9px] font-black text-emerald-600 uppercase tracking-wider">Default</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <p className="text-[10px] text-gray-500 font-medium hidden sm:block">Expires 12/28</p>
                                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                    <ArrowUpRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Summary Sidebar */}
                <div className="space-y-6">
                    <div className="bg-[#0a2e1f] rounded-3xl p-8 text-white shadow-xl shadow-[#0a2e1f]/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12"></div>
                        <h4 className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-4">Account Balance</h4>
                        <div className="mb-6">
                            <p className="text-3xl font-black">€0.00</p>
                            <p className="text-white/60 text-[10px] mt-1 font-medium italic">No outstanding payments</p>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2.5 text-xs font-medium p-3 rounded-xl bg-white/5 border border-white/10">
                                <CheckCircle2 className="text-[#4ade80]" size={16} />
                                Automatic billing is ON
                            </div>
                            <button className="w-full py-3 bg-white text-[#0a2e1f] rounded-xl font-bold hover:bg-gray-100 transition-all active:scale-[0.98] text-sm">
                                Pay Now
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                        <h4 className="text-[11px] font-bold text-gray-900 mb-5 uppercase tracking-wider">Quick Actions</h4>
                        <div className="space-y-2">
                            <button className="w-full p-3.5 rounded-xl border border-gray-50 hover:border-[#1e6f50]/20 hover:bg-gray-50 transition-all text-left flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                        <AlertCircle size={14} />
                                    </div>
                                    <span className="text-xs font-bold">Update Tax ID</span>
                                </div>
                                <ArrowUpRight size={12} className="text-gray-300 group-hover:text-gray-900 transition-colors" />
                            </button>
                            <button className="w-full p-3.5 rounded-xl border border-gray-50 hover:border-[#1e6f50]/20 hover:bg-gray-50 transition-all text-left flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                                        <CreditCard size={14} />
                                    </div>
                                    <span className="text-xs font-bold">Billing Address</span>
                                </div>
                                <ArrowUpRight size={12} className="text-gray-300 group-hover:text-gray-900 transition-colors" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Plus = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

export default Billing;
