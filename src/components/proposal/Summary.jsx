import React from 'react';
import { Download, Loader2, ArrowRight, Building2, BedDouble, MapPin } from 'lucide-react';

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
  const totalUnits = reservations
    .filter((r) => r.propertyId !== 'services')
    .reduce((acc, curr) => acc + curr.quantity, 0);
  const propertiesCount = groupedProperties.filter((p) => p.id !== 'services').length;
  const citiesCount = cityCounts.length;
  const hasItems = reservations.length > 0;

  const baseHousing = Math.max(estimatedMonthlyCost - furnitureAddOnTotal, 0);

  const formatCurrency = (n) =>
    new Intl.NumberFormat('en-DE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-5">Summary</h2>

      {/* At a glance */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center mb-1 text-[#0f4c3a]">
            <BedDouble size={14} />
          </div>
          <div className="text-lg font-bold text-gray-900 leading-none">{totalUnits}</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">
            {totalUnits === 1 ? 'Unit' : 'Units'}
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center mb-1 text-[#0f4c3a]">
            <Building2 size={14} />
          </div>
          <div className="text-lg font-bold text-gray-900 leading-none">{propertiesCount}</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">
            {propertiesCount === 1 ? 'Property' : 'Properties'}
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center mb-1 text-[#0f4c3a]">
            <MapPin size={14} />
          </div>
          <div className="text-lg font-bold text-gray-900 leading-none">{citiesCount}</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">
            {citiesCount === 1 ? 'City' : 'Cities'}
          </div>
        </div>
      </div>

      {/* Monthly cost breakdown */}
      {estimatedMonthlyCost > 0 && (
        <div className="mb-6">
          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
            Monthly (recurring)
          </div>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Housing</span>
              <span className="font-bold text-gray-900">{formatCurrency(baseHousing)}/mo</span>
            </div>
            {furnitureAddOnTotal > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>
                  Furniture add-on
                  {furnitureCount > 0 && (
                    <span className="text-[11px] text-gray-400 ml-1">({furnitureCount} items)</span>
                  )}
                </span>
                <span className="font-bold text-gray-900">
                  {formatCurrency(furnitureAddOnTotal)}/mo
                </span>
              </div>
            )}
            {servicesCount > 0 && (
              <div className="flex justify-between text-gray-500">
                <span>Relocation services</span>
                <span className="text-[11px] italic">{servicesCount} added · priced on call</span>
              </div>
            )}
          </div>

          {/* Total */}
          <div className="bg-[#0f4c3a]/5 rounded-xl p-4 mt-4">
            <div className="flex items-baseline justify-between">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#0f4c3a]/70">
                Estimated Monthly
              </div>
            </div>
            <div className="text-3xl font-bold text-[#0f4c3a] mt-1">
              {formatCurrency(estimatedMonthlyCost)}
              <span className="text-sm font-normal text-[#0f4c3a]/60">/mo</span>
            </div>
            <div className="text-[11px] text-gray-500 mt-1.5 leading-snug">
              Housing + furniture. Services and final pricing confirmed on the call.
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <button
          onClick={handleCheckout}
          disabled={!hasItems || isProcessingCheckout}
          className={`w-full py-3.5 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 ${
            hasItems && !isProcessingCheckout
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
          className={`w-full py-3 rounded-xl font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 border ${
            hasItems
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
