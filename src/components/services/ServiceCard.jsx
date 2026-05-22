import React from "react";
import * as Icons from "lucide-react";

function getIconComponent(iconKey) {
  if (!iconKey) return Icons.Package;
  return Icons[iconKey] || Icons.Package;
}

export default function ServiceCard({ service, onRequest, variant = "default" }) {
  const Icon = getIconComponent(service.iconKey);

  if (variant === "dashboard") {
    return (
      <button
        type="button"
        onClick={() => onRequest?.(service)}
        className="text-left bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all w-full"
      >
        <div className="p-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1e6f50]/10 border border-[#1e6f50]/10 flex items-center justify-center text-[#1e6f50] shrink-0">
            <Icon className="w-5 h-5" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-gray-900 mt-1 leading-snug">
              {service.name}
            </p>
            {service.description ? (
              <p className="text-xs text-gray-500 mt-1 leading-snug line-clamp-2 min-h-[32px]">
                {service.description}
              </p>
            ) : null}
            <p className="text-sm font-bold text-gray-900 mt-2 leading-none">
              €{Number(service.priceEur || 0).toFixed(0)}
            </p>
          </div>
        </div>
      </button>
    );
  }

  if (variant === "compact") {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#1e6f50]/10 border border-[#1e6f50]/10 flex items-center justify-center text-[#1e6f50] shrink-0">
            <Icon className="w-5 h-5" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
              {service.category}
            </p>
            <p className="text-sm font-bold text-gray-900 truncate mt-1">{service.name}</p>
            {service.description ? (
              <p className="text-xs text-gray-500 mt-1 truncate">{service.description}</p>
            ) : null}
          </div>

          <div className="shrink-0 text-right flex flex-col items-end gap-2">
            <p className="text-sm font-bold text-gray-900 leading-none">
              €{Number(service.priceEur || 0).toFixed(0)}
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRequest?.(service);
              }}
              className="h-9 px-4 rounded-xl bg-[#0a1a12] text-white text-sm font-bold hover:bg-black transition-colors"
            >
              Request
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#1e6f50]/10 border border-[#1e6f50]/10 flex items-center justify-center text-[#1e6f50] shrink-0">
            <Icon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
              {service.category}
            </p>
            <h3 className="text-base font-bold text-gray-900 truncate">{service.name}</h3>
            {service.description ? (
              <p className="text-sm text-gray-500 mt-1 leading-snug line-clamp-2 min-h-[40px]">
                {service.description}
              </p>
            ) : null}
          </div>
        </div>

        <div className="text-right shrink-0">
          <p className="text-sm font-bold text-gray-900">€{Number(service.priceEur || 0).toFixed(0)}</p>
        </div>
      </div>

      <div className="px-5 pb-5 flex items-center justify-end">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRequest?.(service);
          }}
          className="h-10 px-4 rounded-xl bg-[#0a1a12] text-white text-sm font-bold hover:bg-black transition-colors"
        >
          Request
        </button>
      </div>
    </div>
  );
}
