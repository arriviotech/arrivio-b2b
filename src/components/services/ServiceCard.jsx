import React, { useState } from "react";
import * as Icons from "lucide-react";

function getIconComponent(iconKey) {
  if (!iconKey) return Icons.Package;
  return Icons[iconKey] || Icons.Package;
}

function getServiceDetails(service) {
  const transportDetails = [
    { label: "Vehicle", value: "Sedan or similar" },
    { label: "Pricing", value: "Distance-based fare + fixed pickup fee" },
    { label: "Support", value: "Professional driver with airport assistance" },
  ];

  switch (service.id) {
    case "seed-airport-pickup":
      return [
        { label: "Vehicle", value: "Sedan or similar with luggage space" },
        { label: "Pricing", value: "Distance-based fare + fixed pickup fee" },
        { label: "Support", value: "Driver meets you at arrivals and assists with luggage" },
      ];
    case "seed-airport-dropoff":
      return [
        { label: "Vehicle", value: "Private sedan with luggage space" },
        { label: "Pricing", value: "Distance-based fare + airport surcharge" },
        { label: "Support", value: "Real-time flight coordination and drop-off planning" },
      ];
    case "seed-housing":
      return [
        { label: "Agent", value: "Elena, relocation specialist" },
        { label: "Experience", value: "7 years helping new arrivals secure housing" },
        { label: "Benefit", value: "Personalized housing search and landlord introductions" },
      ];
    case "seed-bank":
      return [
        { label: "Agent", value: "Jonas, banking advisor" },
        { label: "Experience", value: "Local bank onboarding for expats" },
        { label: "Benefit", value: "Document preparation and branch appointment support" },
      ];
    case "seed-insurance":
      return [
        { label: "Agent", value: "Lena, insurance expert" },
        { label: "Experience", value: "5 years helping clients choose German insurance" },
        { label: "Benefit", value: "Coverage review for health, liability, and rental protection" },
      ];
    case "seed-sim":
      return [
        { label: "Plan", value: "Pre-activated local SIM" },
        { label: "Support", value: "Activation and plan setup included" },
        { label: "Benefit", value: "Data-ready on arrival with trusted local provider" },
      ];
    case "seed-anmeldung-housing":
      return [
        { label: "Specialist", value: "Nina, registration consultant" },
        { label: "Expertise", value: "Local Anmeldung support and government filing" },
        { label: "Benefit", value: "Fast guidance through address registration steps" },
      ];
    case "seed-tax-id":
      return [
        { label: "Specialist", value: "Marcus, tax liaison" },
        { label: "Expertise", value: "Tax ID and tax office guidance" },
        { label: "Benefit", value: "Assistance with forms and local authority requirements" },
      ];
    default:
      return transportDetails;
  }
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
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{service.name}</h2>
            <p className="text-sm text-gray-500 mt-0.5">€{Number(service.priceEur || 0).toFixed(0)}</p>
            {service.description ? (
              <p className="text-sm text-gray-600 mt-2 max-w-[440px]">
                {service.description}
              </p>
            ) : null}
          </div>
          <button
            onClick={() => setShowDetails(false)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-4 flex-1 overflow-auto">
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-4 space-y-3">
            {details.map((detail) => (
              <div key={detail.label} className="flex items-start justify-between gap-4">
                <span className="text-sm font-semibold text-gray-900">{detail.label}</span>
                <span className="text-sm text-gray-600">{detail.value}</span>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setShowDetails(false);
              onRequest?.(service);
            }}
            className="w-full h-12 rounded-2xl bg-[#0a1a12] text-white text-sm font-bold hover:bg-black transition-colors"
          >
            Proceed with service
          </button>
        </div>
      </div>
    </div>
  ) : null;

  // Dashboard variant
  if (variant === "dashboard") {
    return (
      <>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow w-full">
          <div className="p-5 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <div className="flex flex-col items-center gap-3 shrink-0">
                <div className="w-10 h-10 rounded-xl bg-[#1e6f50]/10 border border-[#1e6f50]/10 flex items-center justify-center text-[#1e6f50]">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{service.category}</p>
                <h3 className="text-base font-bold text-gray-900 truncate">{service.name}</h3>
                {service.description ? (
                  <p className="text-sm text-gray-500 mt-1 leading-snug line-clamp-2 min-h-[40px]">{service.description}</p>
                ) : null}
                <p className="text-sm font-bold text-gray-900 mt-3">€{Number(service.priceEur || 0).toFixed(0)}</p>
              </div>
            </div>
          </div>

          <div className="px-5 pb-5 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setShowDetails(true)}
              className="h-10 px-4 rounded-2xl border border-gray-200 text-sm font-bold uppercase text-[#1e6f50] bg-white hover:bg-[#f6fbf6] transition-colors"
            >
              Details
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRequest?.(service);
              }}
              className="h-10 px-4 rounded-2xl bg-[#0a1a12] text-white text-sm font-bold hover:bg-black transition-colors"
            >
              Add
            </button>
          </div>
        </div>
        {detailsModal}
      </>
    );
  }

  // Compact variant
  if (variant === "compact") {
    return (
      <>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <div className="p-5 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <div className="flex flex-col items-center gap-3 shrink-0">
                <div className="w-10 h-10 rounded-xl bg-[#1e6f50]/10 border border-[#1e6f50]/10 flex items-center justify-center text-[#1e6f50]">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{service.category}</p>
                <h3 className="text-base font-bold text-gray-900 truncate">{service.name}</h3>
                {service.description ? (
                  <p className="text-sm text-gray-500 mt-1 leading-snug line-clamp-2 min-h-[40px]">{service.description}</p>
                ) : null}
              </div>
            </div>

            <div className="text-right shrink-0 flex flex-col items-end gap-3">
              <p className="text-sm font-bold text-gray-900">€{Number(service.priceEur || 0).toFixed(0)}</p>
            </div>
          </div>

          <div className="px-5 pb-5 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setShowDetails(true)}
              className="h-10 px-4 rounded-2xl border border-gray-200 text-sm font-bold uppercase text-[#1e6f50] bg-white hover:bg-[#f6fbf6] transition-colors"
            >
              Details
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRequest?.(service);
              }}
              className="h-10 px-4 rounded-2xl bg-[#0a1a12] text-white text-sm font-bold hover:bg-black transition-colors"
            >
              Add
            </button>
          </div>
        </div>
        {detailsModal}
      </>
    );
  }

  // Popular variant - smaller card, no buttons, opens details on click
  if (variant === "popular") {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowDetails(true)}
          className="w-full bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden text-left hover:border-[#1e6f50]/30"
        >
          <div className="p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#1e6f50]/10 border border-[#1e6f50]/10 flex items-center justify-center text-[#1e6f50] shrink-0">
              <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">{service.category}</p>
              <h3 className="text-sm font-bold text-gray-900 truncate">{service.name}</h3>
              {service.description ? (
                <p className="text-xs text-gray-500 mt-1 leading-snug line-clamp-2">{service.description}</p>
              ) : null}
            </div>
          </div>
          <div className="px-4 pb-3 text-right">
            <p className="text-sm font-bold text-gray-900">€{Number(service.priceEur || 0).toFixed(0)}</p>
          </div>
        </button>
        {detailsModal}
      </>
    );
  }

  // Default / standard card
  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        <div className="p-5 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="flex flex-col items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-[#1e6f50]/10 border border-[#1e6f50]/10 flex items-center justify-center text-[#1e6f50]">
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{service.category}</p>
              <h3 className="text-base font-bold text-gray-900 truncate">{service.name}</h3>
              {service.description ? (
                <p className="text-sm text-gray-500 mt-1 leading-snug line-clamp-2 min-h-[40px]">{service.description}</p>
              ) : null}
            </div>
          </div>

          <div className="text-right shrink-0 flex flex-col items-end gap-3">
            <p className="text-sm font-bold text-gray-900">€{Number(service.priceEur || 0).toFixed(0)}</p>
          </div>
        </div>

        <div className="px-5 pb-5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setShowDetails(true)}
            className="h-10 px-4 rounded-2xl border border-gray-200 text-sm font-bold uppercase text-[#1e6f50] bg-white hover:bg-[#f6fbf6] transition-colors"
          >
            Details
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRequest?.(service);
            }}
            className="h-10 px-4 rounded-2xl bg-[#0a1a12] text-white text-sm font-bold hover:bg-black transition-colors"
          >
            Add
          </button>
        </div>
      </div>
      {detailsModal}
    </>
  );
}
