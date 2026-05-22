import React, { useMemo } from "react";
import { NavLink } from "react-router-dom";
import { Package } from "lucide-react";
import { useServices } from "../../supabase/hooks/useServices";
import { useServiceOrders } from "../../supabase/hooks/useServiceOrders";

function badgeClass(status) {
  switch (status) {
    case "active":
      return "bg-blue-50 text-blue-700 border-blue-100";
    case "delivered":
      return "bg-green-50 text-green-700 border-green-100";
    case "cancelled":
      return "bg-gray-50 text-gray-600 border-gray-100";
    case "pending":
    default:
      return "bg-amber-50 text-amber-700 border-amber-100";
  }
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
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Recent Service Orders</p>
        </div>
        <NavLink
          to="/dashboard/services"
          className="text-xs font-bold text-[#1e6f50] hover:text-[#134a35] transition-colors"
        >
          View all →
        </NavLink>
      </div>

      {loading ? (
        <div className="p-6 text-sm text-gray-500">Loading...</div>
      ) : recent.length === 0 ? (
        <div className="p-6 text-sm text-gray-500">No service orders yet.</div>
      ) : (
        <div className="divide-y divide-gray-50">
          {recent.map((o) => (
            <div key={o.id} className="px-6 py-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                  <Package className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{o.serviceName}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(o.orderedAt)}</p>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${badgeClass(o.status)}`}>
                  {String(o.status || "pending").toUpperCase()}
                </span>
                {typeof o.priceEur === "number" ? (
                  <p className="text-sm font-bold text-gray-900 mt-1">€{o.priceEur.toFixed(0)}</p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

