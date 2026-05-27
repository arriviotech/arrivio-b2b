import React, { useState } from 'react';
import { 
  CreditCard, Clock, CheckCircle2, ArrowUpRight, Calendar, 
  FileText, Download, ShieldCheck, ChevronRight, ToggleLeft, ToggleRight, Sparkles 
} from 'lucide-react';

const Billing = () => {
  const [autoRefill, setAutoRefill] = useState(true);
  
  // Load credits from localStorage
  const storedCredits = localStorage.getItem('arrivio_credits');
  const creditsVal = storedCredits !== null ? parseFloat(storedCredits) : 3500.00;
  
  const activePlan = {
    name: 'Enterprise Dashboard SaaS',
    yearlyStandardPrice: 3000,
    yearlyPromoPrice: 2499,
    nextBilling: 'April 10, 2026',
    seatsUsed: 48,
    seatsLimit: 100,
    propertiesUsed: 3,
    propertiesLimit: 10,
  };

  // Mock corporate transaction invoices
  const [invoices] = useState([
    { id: '#INV-2026-003', date: 'Mar 10, 2026', type: 'Annual Subscription Renewal', amount: '€2,499.00', status: 'Paid' },
    { id: '#INV-2026-002', date: 'Feb 10, 2026', type: 'Pre-paid Service Credits Top-up', amount: '€2,499.00', status: 'Paid' },
    { id: '#INV-2026-001', date: 'Jan 10, 2026', type: 'Pre-paid Service Credits Top-up', amount: '€1,850.00', status: 'Paid' },
    { id: '#INV-2025-012', date: 'Dec 10, 2025', type: 'Platform Setup Fee', amount: '€1,850.00', status: 'Paid' }
  ]);

  return (
    <div className="max-w-[1100px] mx-auto animate-in fade-in duration-500 space-y-6 select-none pb-20">
      
      {/* Sleek Minimal Header */}
      <div className="flex justify-between items-center mb-2 pb-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Billing & Subscription</h1>
          <p className="text-sm text-gray-500 font-medium mt-2">Manage your premium SaaS plan, active licenses, and billing history.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Plan, Licenses & History */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Subscription Plan details */}
          <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden">
            
            {/* Header / Pricing Row */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-gray-100">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Subscription Plan</p>
                <h2 className="text-xl font-bold text-gray-900 leading-snug">{activePlan.name}</h2>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                    SaaS Launch Offer
                  </span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <Calendar size={10} />
                    Active till 2027
                  </span>
                </div>
              </div>
              
              <div className="text-left sm:text-right shrink-0">
                <span className="text-xs text-gray-400 line-through font-bold block">€{activePlan.yearlyStandardPrice} / year</span>
                <div className="flex items-baseline justify-start sm:justify-end gap-1 mt-0.5">
                  <span className="text-3xl font-serif font-semibold text-gray-900">€{activePlan.yearlyPromoPrice}</span>
                  <span className="text-xs text-gray-500 font-bold">/ first year</span>
                </div>
                <span className="text-[9px] font-extrabold text-[#0f4c3a] block mt-1">First 6 Months Complimentary</span>
              </div>
            </div>

            {/* Clean Deal Breakdown Text */}
            <div className="bg-gray-50/80 border border-gray-150 rounded-2xl p-4.5 text-xs text-gray-655 font-medium leading-relaxed shadow-inner">
              Your annual subscription starts with <span className="text-[#0f4c3a] font-extrabold">six complimentary months</span>. Billed once as €1,499 for the remaining six months of the first year (standard rate is €3,000/year thereafter).
            </div>

          </div>

          {/* Recent Invoices & Billing History */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#e5e7eb] shadow-sm space-y-5">
            <div>
              <h3 className="font-bold text-gray-955 text-sm uppercase tracking-wider">Billing History</h3>
              <p className="text-xs text-gray-500 font-medium mt-0.5">Review past B2B platform renewals and pre-paid balance receipts.</p>
            </div>

            <div className="divide-y divide-gray-50">
              {invoices.map((inv) => (
                <div key={inv.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 border border-gray-150 flex items-center justify-center shrink-0">
                      <FileText size={16} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{inv.type}</span>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{inv.id}</span>
                      </div>
                      <span className="text-gray-400 font-medium mt-0.5 block">{inv.date}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    <div className="text-left sm:text-right">
                      <span className="font-extrabold text-gray-900 block">{inv.amount}</span>
                      <span className="text-[9px] font-black text-emerald-705 uppercase tracking-widest block mt-0.5">{inv.status}</span>
                    </div>
                    
                    <button className="h-8 px-3.5 bg-white border border-gray-250 hover:bg-gray-50 text-gray-650 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer active:scale-95">
                      <Download size={11} className="stroke-[2.5]" />
                      PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Sidebar: Account Balance & Auto-refill Settings */}
        <div className="md:col-span-1 space-y-6">
          
          {/* Account Balance Card */}
          <div className="bg-[#0f4c3a] rounded-2xl p-6 sm:p-7 text-white shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden border border-[#0f4c3a]/25">
            <div className="absolute -right-10 -top-10 w-28 h-28 bg-white/5 rounded-full blur-xl pointer-events-none" />
            
            <span className="text-[9px] font-black text-emerald-300 uppercase tracking-[0.25em] mb-3 block">
              Pre-paid Services Balance
            </span>
            <div className="mb-6">
              <p className="text-3xl font-serif font-semibold tracking-tight">
                €{creditsVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-emerald-350 text-[10px] mt-1.5 font-bold flex items-center gap-1">
                <CheckCircle2 size={12} className="shrink-0" />
                Automatic billing is active
              </p>
            </div>

            <div className="space-y-4">
              <div className="text-[10px] text-gray-250 font-medium leading-relaxed p-3.5 bg-white/5 border border-white/10 rounded-2xl shadow-inner">
                Arrivio Credits are used to procure relocation services like Airport Pickups, Anmeldung, and Tax Setups for your employees.
              </div>
              <button className="w-full py-3 bg-white text-[#0f4c3a] hover:bg-gray-50 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all active:scale-[0.98] cursor-pointer shadow-sm">
                Top Up Balance
              </button>
            </div>
          </div>

          {/* Auto-Refill/Refill Config card */}
          <div className="bg-white rounded-2xl p-6 border border-[#e5e7eb] shadow-sm space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Auto-Refill Settings
                </h4>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">Top-up credit balances automatically</p>
              </div>
              
              <button 
                type="button" 
                onClick={() => setAutoRefill(!autoRefill)}
                className="text-gray-400 hover:text-gray-950 transition-all cursor-pointer"
              >
                {autoRefill ? (
                  <ToggleRight size={32} className="text-[#0f4c3a]" />
                ) : (
                  <ToggleLeft size={32} className="text-gray-300" />
                )}
              </button>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-150 text-xs font-bold text-gray-700 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-medium text-[10px] uppercase">Threshold</span>
                <span>When balance falls below €500</span>
              </div>
              <div className="border-t border-gray-200/50 my-2" />
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-medium text-[10px] uppercase">Top-up Amount</span>
                <span className="text-[#0f4c3a]">Automatically add €1,000</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-[10px] text-gray-450 leading-relaxed bg-emerald-50/30 border border-emerald-100/20 p-3 rounded-xl">
              <ShieldCheck size={14} className="text-[#0f4c3a] shrink-0 mt-0.5" />
              <span>Protects B2B relocation service pipelines from getting stuck due to insufficient credit reserves.</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Billing;
