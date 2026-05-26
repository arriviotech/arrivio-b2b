import React, { useMemo } from "react";
import { NavLink } from "react-router-dom";
import { Package } from "lucide-react";
import { useServices } from "../../supabase/hooks/useServices";
import { useServiceOrders } from "../../supabase/hooks/useServiceOrders";

const BADGE_CLASSES = {
  active: "bg-blue-50 text-blue-700 border-blue-100",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-100",
  cancelled: "bg-gray-50 text-gray-600 border-gray-100",
  pending: "bg-amber-50 text-amber-700 border-amber-100"
};

function badgeClass(status) {
  return BADGE_CLASSES[status] || BADGE_CLASSES.pending;
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { month: "short", day: "2-digit" });
}

export default function RecentServiceOrders() {
  const { services } = useServices();
  const { orders, loading } = useServiceOrders({ status: "all" });

  const servicesById = useMemo(() => new Map((services || []).map((s) => [s.id, s])), [services]);

  const recent = useMemo(() => {
    const list = (orders || [])
      .slice()
      .sort((a, b) => String(b.orderedAt || "").localeCompare(String(a.orderedAt || "")));
    return list.slice(0, 3).map((o) => {
      const svc = servicesById.get(o.serviceId);
      return {
        ...o,
        serviceName: o.serviceName ?? svc?.name ?? "Service",
        priceEur: typeof o.priceEur === "number" ? o.priceEur : (svc?.priceEur ?? null),
      };
    });
  }, [orders, servicesById]);

  return (
    <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-900 leading-none">Recent Services</h2>
        </div>
        <NavLink
          to="/dashboard/services"
          className="text-xs font-bold text-[#0f4c3a] hover:text-[#0a3a2b] transition-colors"
        >
          View all →
        </NavLink>
      </div>

      {loading ? (
        <div className="p-6 text-sm text-gray-550 font-medium">Loading...</div>
      ) : recent.length === 0 ? (
        <div className="p-6 text-sm text-gray-550 font-medium flex-1 flex items-center justify-center">No service orders yet.</div>
      ) : (
        <div className="divide-y divide-gray-50 flex-1">
          {recent.map((o) => (
            <div key={o.id} className="px-6 py-4.5 flex items-center justify-between gap-4 hover:bg-gray-50/30 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                  <Package className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate">{o.serviceName}</p>
                  <p className="text-[10px] text-gray-500 mt-1">{formatDate(o.orderedAt)}</p>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-extrabold border uppercase tracking-wider ${badgeClass(o.status)}`}>
                  {o.status || "pending"}
                </span>
                {typeof o.priceEur === "number" ? (
                  <p className="text-xs font-bold text-gray-900 mt-1">€{o.priceEur.toFixed(0)}</p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
