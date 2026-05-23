import React from 'react';
import { Download, Loader2, ArrowRight, MapPin } from 'lucide-react';

const Summary = ({
  reservations,
  groupedProperties,
  handleCheckout,
  handleDownloadPDF,
  isGeneratingPDF,
  isProcessingCheckout,
  servicesCount = 0,
  estimatedMonthlyCost = 0,
  furnitureAddOnTotal = 0,
  furnitureCount = 0,
  cityCounts = [],
}) => {
  const totalUnits = reservations.filter(r => r.propertyId !== 'services').reduce((acc, curr) => acc + curr.quantity, 0);
  const propertiesCount = groupedProperties.filter(p => p.id !== 'services').length;
  const hasItems = reservations.length > 0;

  const formatCurrency = (n) =>
    new Intl.NumberFormat('en-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky top-28">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Summary</h2>

      <div className="space-y-3.5 mb-6 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Total Units</span>
          <span className="font-bold text-gray-900">{totalUnits}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Properties</span>
          <span className="font-bold text-gray-900">{propertiesCount}</span>
        </div>
        {servicesCount > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Relocation Services</span>
            <span className="font-bold text-gray-900">{servicesCount}</span>
          </div>
        )}
        {furnitureCount > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Furniture</span>
            <span className="font-bold text-gray-900">{furnitureCount}</span>
          </div>
        )}
      </div>

      {cityCounts.length > 0 && (
        <div className="mb-6 pt-5 border-t border-gray-100">
          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">By City</div>
          <div className="space-y-2.5 text-sm">
            {cityCounts.map(([city, count]) => (
              <div key={city} className="flex items-center justify-between text-gray-600">
                <div className="flex items-center gap-1.5">
                  <MapPin size={12} className="text-[#0f4c3a]" />
                  <span>{city}</span>
                </div>
                <span className="font-bold text-gray-900">{count} {count === 1 ? 'unit' : 'units'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {estimatedMonthlyCost > 0 && (
        <div className="bg-[#0f4c3a]/5 rounded-xl p-4 mb-6">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#0f4c3a]/70 mb-1">Estimated Monthly</div>
          <div className="text-sm text-gray-600 mb-2">
            {furnitureAddOnTotal > 0 && (
              <div className="flex justify-between">
                <span>Furniture add-on</span>
                <span className="font-bold">{formatCurrency(furnitureAddOnTotal)}/mo</span>
              </div>
            )}
          </div>
          <div className="text-2xl font-bold text-[#0f4c3a]">{formatCurrency(estimatedMonthlyCost)}<span className="text-sm font-normal text-[#0f4c3a]/60">/mo</span></div>
          <div className="text-[11px] text-gray-500 mt-1.5 leading-snug">
            Housing only. Services and final pricing confirmed on the call.
          </div>
        </div>
      )}

      <div className="space-y-3">
        <button
          onClick={handleCheckout}
          disabled={!hasItems || isProcessingCheckout}
          className={`w-full py-3.5 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 ${hasItems && !isProcessingCheckout
              ? 'bg-[#0f4c3a] hover:bg-[#1A2E22] text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
        >
          {isProcessingCheckout ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Sending...
            </>
          ) : (
            <>
              Request Quote
              <ArrowRight size={16} />
            </>
          )}
        </button>

        <button
          onClick={handleDownloadPDF}
          disabled={!hasItems || isGeneratingPDF}
          className={`w-full py-3 rounded-xl font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 border ${hasItems
              ? 'border-gray-200 text-gray-700 hover:border-[#0f4c3a]/40 hover:bg-[#0f4c3a]/5'
              : 'border-gray-200 text-gray-300 cursor-not-allowed'
            }`}
        >
          {isGeneratingPDF ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download size={14} />
              Download PDF
            </>
          )}
        </button>
      </div>

      <p className="text-center text-gray-400 text-[11px] mt-4 leading-snug">
        No payment now. Our team replies within 24 hours.
      </p>
    </div>
  );
};

export default Summary;
