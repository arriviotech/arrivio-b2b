import React, { useState } from 'react';
import { Wallet, Plus, CreditCard, ArrowDownLeft, ArrowUpRight, CheckCircle2, MoreHorizontal, History } from 'lucide-react';

const Payments = () => {
    // Load credits and transactions from localStorage
    const storedCredits = localStorage.getItem('arrivio_credits');
    const creditsVal = storedCredits !== null ? parseFloat(storedCredits) : 3500.00;

    const storedTx = localStorage.getItem('arrivio_transactions');
    const transactions = storedTx ? JSON.parse(storedTx) : [
        { id: '#TRX-2026-003', date: 'Mar 10, 2026', type: 'Annual Subscription Renewal', amount: '€1,499.00', status: 'Completed', logo: '✦' },
        { id: '#TRX-2026-002', date: 'Feb 10, 2026', type: 'Pre-paid Service Credits Top-up', amount: '€1,499.00', status: 'Completed', logo: '↑' },
        { id: '#TRX-2026-001', date: 'Jan 10, 2026', type: 'Pre-paid Service Credits Top-up', amount: '€1,850.00', status: 'Completed', logo: '↑' },
        { id: '#TRX-2025-012', date: 'Dec 10, 2025', type: 'Platform Setup Fee', amount: '€1,850.00', status: 'Completed', logo: '✦' },
    ];

    const balances = [
        { label: 'Next Payment', value: '€1,499.00', date: 'April 10, 2026', icon: CreditCard, color: 'indigo' },
        { label: 'Unused Credits', value: `€${creditsVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, date: 'Non-expiring', icon: Wallet, color: 'emerald' },
    ];

    const handleAddCredits = () => {
        const amountStr = prompt("Enter the amount of credits to purchase (€):", "1000");
        if (amountStr) {
            const amount = parseFloat(amountStr);
            if (!isNaN(amount) && amount > 0) {
                const nextBal = creditsVal + amount;
                localStorage.setItem('arrivio_credits', nextBal.toString());
                
                const newTrx = {
                    id: `#TRX-${Math.floor(10000 + Math.random() * 90000)}`,
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    type: 'Capacity Top-up',
                    amount: `€${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                    status: 'Completed',
                    logo: '↑'
                };
                const nextTx = [newTrx, ...transactions];
                localStorage.setItem('arrivio_transactions', JSON.stringify(nextTx));
                window.location.reload(); // Refresh to reflect changes
            }
        }
    };

    return (
        <div className="max-w-[1100px] mx-auto animate-in fade-in duration-500 space-y-6 pb-12">
            <div className="flex items-center justify-between mb-2 pb-2">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Payments & Transactions</h1>
                    <p className="text-sm text-gray-500 mt-2 font-medium">Manage your balance and track all financial activities.</p>
                </div>
                <button 
                    onClick={handleAddCredits}
                    className="px-5 py-2.5 bg-[#0f4c3a] hover:bg-[#0a3a2b] text-white rounded-xl font-bold transition-all shadow-sm active:scale-95 flex items-center gap-2 text-sm cursor-pointer"
                >
                    <Plus size={16} />
                    Add Credits
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {balances.map((item, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-6 border border-[#e5e7eb] shadow-sm relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-${item.color === 'emerald' ? 'emerald-500/5' : 'indigo-500/5'} rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-700`}></div>
                        <div className="flex items-center gap-3 mb-4 relative z-10">
                            <div className={`w-10 h-10 rounded-xl ${item.color === 'emerald' ? 'bg-[#0f4c3a]/5 text-[#0f4c3a]' : 'bg-indigo-50 text-indigo-600'} flex items-center justify-center`}>
                                <item.icon size={18} />
                            </div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</span>
                        </div>
                        <div className="relative z-10 flex items-baseline justify-between">
                            <div>
                                <h3 className="text-3xl font-serif font-semibold text-gray-900 leading-none">{item.value}</h3>
                                <p className="text-[10px] text-gray-400 font-medium mt-2">{item.date}</p>
                            </div>
                            <ArrowUpRight className="text-gray-100 group-hover:text-gray-300 transition-colors animate-pulse" size={24} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl p-8 border border-[#e5e7eb] shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                            <History size={16} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 tracking-tight">Recent Transactions</h3>
                    </div>
                    <button className="text-[10px] font-black text-[#0f4c3a] uppercase tracking-widest hover:text-[#0a3a2b] transition-all cursor-pointer">View All</button>
                </div>

                <div className="space-y-3">
                    {transactions.map((trx) => (
                        <div key={trx.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50/30 hover:bg-white border border-transparent hover:border-[#e5e7eb] rounded-xl transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white border border-gray-50 flex items-center justify-center text-gray-950 font-black shadow-sm group-hover:shadow-md transition-all text-sm">
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
                                    <p className="text-base font-bold text-gray-950">{trx.amount}</p>
                                    <div className="flex items-center gap-1 justify-end">
                                        <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#0f4c3a]">{trx.status}</span>
                                    </div>
                                </div>
                                <button className="p-2 text-gray-300 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all cursor-pointer">
                                    <MoreHorizontal size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Stats Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 bg-black rounded-2xl text-white flex flex-col justify-between h-40 shadow-xl shadow-black/5">
                    <CheckCircle2 className="text-[#4ade80]" size={20} />
                    <div>
                        <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-0.5">Status</p>
                        <h4 className="text-base font-bold">Account Good Standing</h4>
                    </div>
                </div>
                <div className="p-6 bg-indigo-600 rounded-2xl text-white flex flex-col justify-between h-40 shadow-xl shadow-indigo-600/5">
                    <CreditCard size={20} />
                    <div>
                        <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-0.5">Default Card</p>
                        <h4 className="text-base font-bold">Visa •••• 4242</h4>
                    </div>
                </div>
                <div className="p-6 bg-white border border-[#e5e7eb] rounded-2xl text-gray-900 flex flex-col justify-between h-40 shadow-sm group hover:border-[#0f4c3a]/20 hover:shadow-md transition-all duration-300">
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
