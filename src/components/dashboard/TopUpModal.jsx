import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

export default function TopUpModal({ isOpen, onClose, onConfirm, defaultAmount = 5000 }) {
  const [amount, setAmount] = useState(defaultAmount.toString());

  if (!isOpen) return null;

  const handleConfirm = () => {
    const val = parseFloat(amount);
    if (!isNaN(val) && val > 0) {
      onConfirm(val);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-[400px] bg-white rounded-[24px] shadow-xl border border-gray-100 p-6 sm:p-8 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-emerald-50 text-[#0f4c3a] rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-[#0f4c3a]/10">
            <Plus size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Top Up Arrivio Balance</h3>
          <p className="text-sm text-gray-500 mt-1 font-medium">Enter the amount of credits to purchase.</p>
        </div>

        <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <span className="text-gray-500 font-bold">€</span>
          </div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleConfirm(); }}
            className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0f4c3a]/20 focus:border-[#0f4c3a] focus:bg-white transition-all text-lg"
            placeholder="0.00"
            autoFocus
          />
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleConfirm}
            disabled={!amount || parseFloat(amount) <= 0}
            className="w-full py-3.5 bg-[#0f4c3a] hover:bg-[#0a3120] text-white rounded-xl text-xs font-extrabold uppercase tracking-widest transition-all shadow-md hover:shadow-emerald-950/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center cursor-pointer"
          >
            Confirm & Pay
          </button>
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-transparent hover:border-gray-200 rounded-xl text-xs font-extrabold uppercase tracking-widest transition-all active:scale-[0.98] cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
