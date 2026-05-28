import React, { useState } from "react";
import * as Icons from "lucide-react";

function getIconComponent(iconKey) {
  if (!iconKey) return Icons.Package;
  return Icons[iconKey] || Icons.Package;
}

function getServiceDetails(service) {
  if (service.features && service.features.length > 0) {
    return service.features;
  }
  return [
    { label: "Pricing", value: `EUR ${service.priceEur} + VAT` },
    { label: "Details", value: service.description || "Custom service details" }
  ];
}

export default function ServiceCard({ service, onRequest, variant = "default" }) {
  const Icon = getIconComponent(service.iconKey);
  const details = getServiceDetails(service);

  const [showDetails, setShowDetails] = useState(false);

  const detailsModal = showDetails ? (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setShowDetails(false);
      }}
    >
      <div className="relative bg-white w-full max-w-[480px] rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]" onMouseDown={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 leading-snug">{service.name}</h2>
            <p className="text-sm font-bold text-[#0f4c3a] mt-1">€{Number(service.priceEur || 0).toFixed(0)}</p>
            {service.detailedDescription || service.description ? (
              <p className="text-xs text-gray-500 mt-2 max-w-[400px] leading-relaxed font-medium">
                {service.detailedDescription || service.description}
              </p>
            ) : null}
          </div>
          <button
            onClick={() => setShowDetails(false)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
            aria-label="Close"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4 flex-1 overflow-auto">
          <div className="rounded-2xl border border-gray-150 bg-gray-50 p-4 space-y-3 shadow-inner">
            {details.map((detail) => (
              <div key={detail.label} className="flex items-start justify-between gap-4 text-xs font-semibold">
                <span className="text-gray-400 uppercase tracking-wider text-[10px]">{detail.label}</span>
                <span className="text-gray-800 text-right">{detail.value}</span>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setShowDetails(false);
              onRequest?.(service);
            }}
            className="w-full h-12 rounded-xl bg-[#0f4c3a] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#0a3a2b] transition-all shadow-sm active:scale-98 cursor-pointer"
          >
            Proceed with service
          </button>
        </div>
      </div>
    </div>
  ) : null;

  // Popular variant (smaller version of stacked card, e.g. for popular strip)
  if (variant === "popular") {
    return (
      <>
        <div
          onClick={(e) => {
            e.preventDefault();
            onRequest?.(service);
          }}
          className="bg-white rounded-2xl border border-gray-200/80 hover:border-[#0f4c3a]/30 shadow-sm hover:shadow-md transition-all duration-300 p-5 flex flex-col items-start text-left cursor-pointer group h-full min-h-[200px]"
        >
          {/* Icon Box */}
          <div className="w-10 h-10 rounded-xl bg-[#0f4c3a]/5 border border-[#0f4c3a]/10 flex items-center justify-center text-[#0f4c3a] transition-colors group-hover:bg-[#0f4c3a]/10">
            <Icon className="w-5 h-5 stroke-[2]" />
          </div>
          
          {/* Content */}
          <h3 className="text-sm font-bold text-gray-900 mt-3.5 mb-1.5 tracking-tight leading-snug">
            {service.name}
          </h3>
          
          {service.description ? (
            <p className="text-[11px] text-gray-500 font-medium leading-relaxed line-clamp-2 mb-4">
              {service.description}
            </p>
          ) : null}

          {/* Footer - Price and Details */}
          <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between w-full">
            <span className="text-xs font-bold text-gray-900">
              €{Number(service.priceEur || 0).toFixed(0)}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowDetails(true);
              }}
              className="text-[10px] font-extrabold text-[#0f4c3a] hover:text-[#0a3a2b] transition-colors flex items-center gap-0.5 uppercase tracking-wider cursor-pointer"
            >
              Details
            </button>
          </div>
        </div>
        {detailsModal}
      </>
    );
  }

  // Dashboard, Compact, and Default variants: Standard stacked minimalist card
  return (
    <>
      <div
        onClick={(e) => {
          e.preventDefault();
          onRequest?.(service);
        }}
        className="bg-white rounded-2xl border border-[#e5e7eb] hover:border-[#0f4c3a]/20 shadow-sm hover:shadow-md transition-all duration-300 p-5 flex flex-col items-start text-left cursor-pointer group h-full min-h-[185px] w-full"
      >
        {/* Icon Box */}
        <div className="w-10 h-10 rounded-xl bg-[#0f4c3a]/5 border border-[#0f4c3a]/10 flex items-center justify-center text-[#0f4c3a] transition-colors group-hover:bg-[#0f4c3a]/10">
          <Icon className="w-5 h-5 stroke-[2]" />
        </div>
        
        {/* Content */}
        <h3 className="text-sm font-bold text-gray-900 mt-3 mb-1 tracking-tight leading-snug">
          {service.name}
        </h3>
        
        {service.description ? (
          <p className="text-xs text-gray-500 font-medium leading-relaxed mb-3">
            {service.description}
          </p>
        ) : null}

        {/* Footer - Price and Details */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between w-full">
          <span className="text-xs font-bold text-gray-900">
            €{Number(service.priceEur || 0).toFixed(0)}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowDetails(true);
            }}
            className="text-[10px] font-extrabold text-[#0f4c3a] hover:text-[#0a3a2b] transition-colors flex items-center gap-0.5 uppercase tracking-wider cursor-pointer"
          >
            Details
          </button>
        </div>
      </div>
      {detailsModal}
    </>
  );
}
