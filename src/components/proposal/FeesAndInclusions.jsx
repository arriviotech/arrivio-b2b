import React, { useState } from 'react';
import { Wifi, Zap, Sparkles, Wrench, Info, Briefcase, User } from 'lucide-react';

const FeesAndInclusions = ({ estimatedMonthlyCost = 0, furnitureAddOnTotal = 0 }) => {
  const [whoPays, setWhoPays] = useState('org'); // 'org' | 'resident'

  const baseHousing = Math.max(estimatedMonthlyCost - furnitureAddOnTotal, 0);

  const formatCurrency = (n) =>
    new Intl.NumberFormat('en-DE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(n);

  const isOrg = whoPays === 'org';
  const months = isOrg ? 1 : 3;
  const total = baseHousing > 0 ? baseHousing * months : null;
  const Icon = isOrg ? Briefcase : User;

  const inclusions = [
    { icon: Wifi, label: 'High-speed WiFi' },
    { icon: Zap, label: 'Utilities (water, electricity, gas, heating)' },
    { icon: Sparkles, label: 'Cleaning (where applicable)' },
    { icon: Wrench, label: 'Property maintenance' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-baseline justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900">Fees &amp; Inclusions</h2>
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          One-time
        </span>
      </div>

      {/* Brokerage fee — single card with toggle */}
      <div className="mb-6">
        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
          Housing brokerage fee
        </div>
        <p className="text-[11px] text-gray-500 leading-snug mb-2">
          A one-time fee charged at booking. Size depends on your rent arrangement:
        </p>
        <ul className="text-[11px] text-gray-600 leading-snug mb-4 space-y-0.5 pl-3">
          <li className="flex gap-1.5">
            <span className="text-[#0f4c3a] font-bold">•</span>
            <span>
              <span className="font-bold text-gray-900">1 month</span> of rent
              <span className="text-[#0f4c3a] font-bold mx-1">→</span>
              if your organization is billed for monthly rent
            </span>
          </li>
          <li className="flex gap-1.5">
            <span className="text-[#0f4c3a] font-bold">•</span>
            <span>
              <span className="font-bold text-gray-900">3 months</span> of rent
              <span className="text-[#0f4c3a] font-bold mx-1">→</span>
              if the resident is billed for monthly rent
            </span>
          </li>
        </ul>

        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
          Who&rsquo;s billed for monthly rent?
        </div>

        {/* Segmented toggle */}
        <div className="grid grid-cols-2 gap-1 bg-gray-100 rounded-lg p-1 mb-3">
          <button
            type="button"
            onClick={() => setWhoPays('org')}
            className={`text-[11px] font-bold py-1.5 rounded-md transition-all ${
              isOrg
                ? 'bg-white text-[#0f4c3a] shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Your organization
          </button>
          <button
            type="button"
            onClick={() => setWhoPays('resident')}
            className={`text-[11px] font-bold py-1.5 rounded-md transition-all ${
              !isOrg
                ? 'bg-white text-[#0f4c3a] shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            The resident
          </button>
        </div>

        {/* Selected scenario */}
        <div className="rounded-xl border border-[#0f4c3a]/15 bg-[#0f4c3a]/[0.04] p-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#0f4c3a]/10 text-[#0f4c3a] flex items-center justify-center flex-shrink-0">
              <Icon size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <div className="text-2xl font-bold text-[#0f4c3a] leading-none">
                  {months} {months === 1 ? 'month' : 'months'} rent
                </div>
                {total !== null && (
                  <div className="text-sm font-bold text-gray-900">
                    ≈ {formatCurrency(total)}
                  </div>
                )}
              </div>
              <div className="text-[11px] text-gray-600 mt-1.5 leading-snug">
                {isOrg
                  ? 'Your organization will be billed monthly.'
                  : 'The resident will be billed monthly.'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inclusions */}
      <div className="pt-5 border-t border-gray-100">
        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
          Included in monthly rent
        </div>
        <div className="space-y-2">
          {inclusions.map(({ icon: I, label }) => (
            <div key={label} className="flex items-center gap-2.5 text-sm text-gray-700">
              <div className="w-6 h-6 rounded-md bg-[#0f4c3a]/10 text-[#0f4c3a] flex items-center justify-center flex-shrink-0">
                <I size={12} />
              </div>
              <span>{label}</span>
            </div>
          ))}
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
