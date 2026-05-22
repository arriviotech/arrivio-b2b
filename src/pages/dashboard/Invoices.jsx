import React from 'react';
import { FileText, Download, Filter, Search, MoreVertical, ArrowUpRight, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const Invoices = () => {
    const invoices = [
        { id: '#INV-2026-003', date: 'Mar 10, 2026', amount: '€2,499.00', status: 'Paid', method: 'Visa ending 4242' },
        { id: '#INV-2026-002', date: 'Feb 10, 2026', amount: '€2,499.00', status: 'Paid', method: 'Visa ending 4242' },
        { id: '#INV-2026-001', date: 'Jan 10, 2026', amount: '€1,850.00', status: 'Paid', method: 'Visa ending 4242' },
        { id: '#INV-2025-012', date: 'Dec 10, 2025', amount: '€1,850.00', status: 'Paid', method: 'Bank Transfer' },
    ];

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Paid': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'Overdue': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-gray-50 text-gray-500 border-gray-100';
        }
    };

    return (
        <div className="max-w-[1100px] mx-auto animate-in fade-in duration-500 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Invoice History</h1>
                    <p className="text-sm text-gray-400 mt-1 font-medium">View and download your past subscription invoices</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                        <input
                            type="text"
                            placeholder="Search invoice ID..."
                            className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-4 focus:ring-[#1e6f50]/5 focus:border-[#1e6f50] transition-all min-w-[200px]"
                        />
                    </div>
                    <button className="p-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
                        <Filter size={16} />
                    </button>
                    <button className="px-4 py-2 bg-[#0a2e1f] text-white rounded-xl font-bold hover:bg-[#1e6f50] transition-all shadow-lg shadow-[#0a2e1f]/10 flex items-center gap-2 text-xs">
                        <Download size={14} />
                        Export All
                    </button>
                </div>
            </div>

            {/* Upcoming Invoice Banner */}
            <div className="bg-[#1e6f50]/5 border border-[#1e6f50]/10 rounded-3xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-center md:text-left">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-amber-500 border border-amber-500/10">
                        <Clock size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-[#1e6f50] uppercase tracking-widest mb-0.5">Upcoming Invoice</p>
                        <p className="text-base font-bold text-gray-900">Next payment of €2,499.00 due on April 10, 2026</p>
                    </div>
                </div>
                <button className="px-5 py-2 bg-white border border-gray-100 text-[#0a2e1f] rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm text-xs">
                    Manage Schedule
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-50">
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Invoice ID</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Billing Date</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Amount</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Payment Method</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {invoices.map((inv) => (
                                <tr key={inv.id} className="group hover:bg-gray-50/30 transition-all">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#1e6f50]/10 group-hover:text-[#1e6f50] transition-colors">
                                                <FileText size={14} />
                                            </div>
                                            <span className="text-xs font-bold text-gray-900 tracking-tight">{inv.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-medium text-gray-500">{inv.date}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold text-gray-900">{inv.amount}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs text-gray-400 font-medium">{inv.method}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${getStatusStyles(inv.status)}`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button className="p-1.5 text-gray-400 hover:text-[#1e6f50] hover:bg-[#1e6f50]/5 rounded-lg transition-all">
                                                <Download size={14} />
                                            </button>
                                            <button className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                                                <MoreVertical size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 border-t border-gray-50 bg-gray-50/20 flex items-center justify-between">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Page 1 of 5</p>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 text-[10px] font-bold text-gray-400 hover:text-gray-900 transition-colors disabled:opacity-30" disabled>Previous</button>
                        <button className="px-3 py-1.5 text-[10px] font-bold text-gray-900 bg-white hover:bg-gray-50 rounded-lg shadow-sm transition-all border border-gray-100 uppercase tracking-widest">Next</button>
                    </div>
                </div>
            </div>

            {/* Support Box */}
            <div className="flex flex-col items-center justify-center py-10 px-6 bg-white rounded-3xl border border-gray-100 shadow-sm text-center">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
                    <AlertCircle size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Need help with your billing?</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6 font-medium">
                    If you have questions about specific charges, our finance team is here to help.
                </p>
                <button className="px-6 py-2.5 border border-gray-200 rounded-xl font-bold hover:border-[#1e6f50]/20 hover:bg-gray-50 transition-all flex items-center gap-2 text-xs shadow-sm">
                    Contact Finance Team
                    <ArrowUpRight size={14} />
                </button>
            </div>
        </div>
    );
};

export default Invoices;
