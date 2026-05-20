import React from 'react';
import { Download, Loader2 } from 'lucide-react';

const Summary = ({ 
  reservations, 
  groupedProperties, 
  handleCheckout, 
  handleDownloadPDF, 
  isGeneratingPDF,
  isProcessingCheckout
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky top-28">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Summary</h2>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>Total Units</span>
          <span className="font-bold text-gray-900">
            {reservations.filter(r => r.propertyId !== 'services').reduce((acc, curr) => acc + curr.quantity, 0)}
          </span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Properties</span>
          <span className="font-bold text-gray-900">
            {groupedProperties.filter(p => p.id !== 'services').length}
          </span>
        </div>
        {reservations.some(r => r.propertyId === 'services') && (
          <div className="flex justify-between text-gray-600">
            <span>Additional Services</span>
            <span className="font-bold text-gray-900">
              {reservations.filter(r => r.propertyId === 'services').reduce((acc, curr) => acc + curr.quantity, 0)}
            </span>
          </div>
        )}
      </div>

      <div className="w-full h-px bg-gray-100 mb-6"></div>

      <div className="space-y-3">
        <button
          onClick={handleCheckout}
          disabled={reservations.length === 0 || isProcessingCheckout}
          className={`w-full py-3.5 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${reservations.length > 0 && !isProcessingCheckout
              ? 'bg-[#1a2b3c] hover:bg-black text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
        >
          {isProcessingCheckout ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Processing...
            </>
          ) : (
            'Book a Meeting'
          )}
        </button>

        <button
          onClick={handleDownloadPDF}
          disabled={reservations.length === 0 || isGeneratingPDF}
          className={`w-full py-3 rounded-xl font-bold text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-2 border-2 ${reservations.length > 0
              ? 'border-[#1e6f50] text-[#1e6f50] hover:bg-[#1e6f50]/5 active:translate-y-0'
              : 'border-gray-200 text-gray-300 cursor-not-allowed'
            }`}
        >
          {isGeneratingPDF ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download size={18} />
              Download PDF
            </>
          )}
        </button>
      </div>

      <p className="text-center text-gray-500 text-xs mt-4">No payment required. We will contact you within 24 hours.</p>
    </div>
  );
};

export default Summary;
