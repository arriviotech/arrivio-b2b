import React from 'react';
import { Wallet, Plus, CreditCard, ArrowDownLeft, ArrowUpRight, CheckCircle2, MoreHorizontal, History } from 'lucide-react';

const Payments = () => {
    const transactions = [
        { id: '#TRX-94812', date: 'Mar 10, 2026', type: 'Subscription', amount: '€2,499.00', status: 'Completed', logo: '✦' },
        { id: '#TRX-94755', date: 'Feb 10, 2026', type: 'Subscription', amount: '€2,499.00', status: 'Completed', logo: '✦' },
        { id: '#TRX-94621', date: 'Jan 22, 2026', type: 'Capacity Top-up', amount: '€450.00', status: 'Completed', logo: '↑' },
        { id: '#TRX-94590', date: 'Jan 10, 2026', type: 'Subscription', amount: '€1,850.00', status: 'Completed', logo: '✦' },
    ];

    const balances = [
        { label: 'Next Payment', value: '€2,499.00', date: 'April 10', icon: CreditCard, color: 'indigo' },
        { label: 'Unused Credits', value: '€120.50', date: 'Non-expiring', icon: Wallet, color: 'emerald' },
    ];

    return (
        <div className="max-w-[1100px] mx-auto animate-in fade-in duration-500 space-y-6">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Payments & Transactions</h1>
                    <p className="text-sm text-gray-400 mt-1 font-medium">Manage your balance and track all financial activities</p>
                </div>
                <button className="px-5 py-2.5 bg-[#0a2e1f] text-white rounded-xl font-bold hover:bg-[#1e6f50] transition-all shadow-lg shadow-[#0a2e1f]/10 active:scale-95 flex items-center gap-2 text-sm">
                    <Plus size={16} />
                    Add Credits
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {balances.map((item, idx) => (
                    <div key={idx} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-${item.color}-500/5 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-700`}></div>
                        <div className="flex items-center gap-3 mb-4 relative z-10">
                            <div className={`w-10 h-10 rounded-xl bg-${item.color}-50 flex items-center justify-center text-${item.color}-600`}>
                                <item.icon size={18} />
                            </div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</span>
                        </div>
                        <div className="relative z-10 flex items-baseline justify-between">
                            <div>
                                <h3 className="text-3xl font-black text-gray-900">{item.value}</h3>
                                <p className="text-[10px] text-gray-400 font-medium mt-1">{item.date}</p>
                            </div>
                            <ArrowUpRight className="text-gray-100 group-hover:text-gray-300 transition-colors" size={24} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                            <History size={16} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 tracking-tight">Recent Transactions</h3>
                    </div>
                    <button className="text-[10px] font-black text-[#1e6f50] uppercase tracking-widest hover:text-[#15543c] transition-all">View All</button>
                </div>

                <div className="space-y-3">
                    {transactions.map((trx) => (
                        <div key={trx.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50/30 hover:bg-white border border-transparent hover:border-gray-50 rounded-2xl transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white border border-gray-50 flex items-center justify-center text-gray-900 font-black shadow-sm group-hover:shadow-md transition-all text-sm">
                                    {trx.logo}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">{trx.type}</h4>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{trx.id}</span>
                                        <span className="w-0.5 h-0.5 rounded-full bg-gray-200"></span>
                                        <span className="text-[10px] text-gray-400 font-medium">{trx.date}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between md:justify-end gap-8 mt-3 md:mt-0">
                                <div className="text-right">
                                    <p className="text-base font-black text-gray-900">{trx.amount}</p>
                                    <div className="flex items-center gap-1 justify-end">
                                        <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-[#1e6f50]">{trx.status}</span>
                                    </div>
                                </div>
                                <button className="p-2 text-gray-300 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                                    <MoreHorizontal size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Stats Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 bg-black rounded-3xl text-white flex flex-col justify-between h-40 shadow-xl shadow-black/5">
                    <CheckCircle2 className="text-[#4ade80]" size={20} />
                    <div>
                        <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-0.5">Status</p>
                        <h4 className="text-base font-bold">Account Good Standing</h4>
                    </div>
                </div>
                <div className="p-6 bg-indigo-600 rounded-3xl text-white flex flex-col justify-between h-40 shadow-xl shadow-indigo-600/5">
                    <CreditCard size={20} />
                    <div>
                        <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-0.5">Default Card</p>
                        <h4 className="text-base font-bold">Visa •••• 4242</h4>
                    </div>
                </div>
                <div className="p-6 bg-white border border-gray-100 rounded-3xl text-gray-900 flex flex-col justify-between h-40 shadow-sm group">
                    <ArrowUpRight className="text-gray-300 group-hover:text-gray-900 transition-colors" size={20} />
                    <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-0.5">Invoices</p>
                        <h4 className="text-base font-bold">4 Paid in 2026</h4>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payments;
