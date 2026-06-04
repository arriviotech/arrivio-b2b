import React from 'react';
import { Info } from 'lucide-react';

// Flat one-time fee charged per reserved unit, regardless of unit type.
const FEE_PER_UNIT = 599;

const FeesAndInclusions = ({ totalUnits = 0 }) => {
  const formatCurrency = (n) =>
    new Intl.NumberFormat('en-DE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(n);

  const total = FEE_PER_UNIT * totalUnits;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-baseline justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900">One-time fees</h2>
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          One-time
        </span>
      </div>

      <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
        Booking, cleaning &amp; setup fees
      </div>
      <p className="text-[11px] text-gray-500 leading-snug mb-4">
        A one-time fee charged at booking, covers booking, professional cleaning and unit setup.
      </p>

      <div className="rounded-xl border border-[#0f4c3a]/15 bg-[#0f4c3a]/[0.04] p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm text-gray-700">
            {formatCurrency(FEE_PER_UNIT)}
            <span className="text-gray-400"> × </span>
            {totalUnits} {totalUnits === 1 ? 'unit' : 'units'}
          </div>
          <div className="text-xl font-bold text-[#0f4c3a]">{formatCurrency(total)}</div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-gray-100 flex items-start gap-2 text-[11px] text-gray-500 leading-snug">
        <Info size={12} className="mt-0.5 flex-shrink-0 text-gray-400" />
        <span>Final figures confirmed on the discovery call.</span>
      </div>
    </div>
  );
};

export default FeesAndInclusions;
