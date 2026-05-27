import React, { useMemo } from "react";
import { NavLink } from "react-router-dom";
import * as Icons from "lucide-react";
import { useServices } from "../../supabase/hooks/useServices";
import { useServiceOrders } from "../../supabase/hooks/useServiceOrders";

const BADGE_CLASSES = {
  active: "bg-blue-50 text-blue-700 border-blue-100/60",
  delivered: "bg-emerald-50 text-emerald-705 border-emerald-100/60",
  cancelled: "bg-gray-50 text-gray-500 border-gray-150",
  pending: "bg-amber-50 text-amber-705 border-amber-100/60"
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
    return list.slice(0, 5).map((o) => {
      const svc = servicesById.get(o.serviceId);
      const employees = Array.isArray(o.employees) ? o.employees : [];
      return {
        ...o,
        serviceName: o.serviceName ?? svc?.name ?? "Service",
        iconKey: svc?.iconKey ?? "Package",
        priceEur: typeof o.priceEur === "number" ? o.priceEur : (svc?.priceEur ?? null),
        employees,
      };
    });
  }, [orders, servicesById]);

  return (
    <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm overflow-hidden flex flex-col w-full">
      <div className="px-6 py-6 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-900 leading-none">Recent Activity & Services</h2>
          <p className="text-xs text-gray-400 font-medium mt-2">Track the live status, bookings, and onboarding milestones of relocation services.</p>
        </div>
        <NavLink
          to="/dashboard/services"
          className="text-xs font-bold text-[#0f4c3a] hover:text-[#0a3a2b] transition-colors"
        >
          View all →
        </NavLink>
      </div>

      {loading ? (
        <div className="p-12 text-center text-gray-400 font-bold flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#0f4c3a]/20 border-t-[#0f4c3a] rounded-full animate-spin mb-3" />
          <span className="text-[10px] font-black uppercase tracking-wider">Loading activity...</span>
        </div>
      ) : recent.length === 0 ? (
        <div className="p-16 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Icons.Activity className="w-7 h-7 text-gray-300" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">No activity logged yet</h3>
          <p className="text-xs text-gray-400 max-w-xs mx-auto font-medium">Booked relocation services and employee arrivals will be shown here dynamically.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50 flex-1">
          {recent.map((o) => {
            const IconComponent = Icons[o.iconKey] || Icons.Package;
            const employeesLabel = o.isAllEmployees ? "All employees" : `${o.employees.length} employee${o.employees.length === 1 ? "" : "s"}`;
            
            return (
              <div key={o.id} className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/20 transition-all duration-200">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50/50 text-[#0f4c3a] border border-[#0f4c3a]/10 flex items-center justify-center shrink-0">
                    <IconComponent className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{o.serviceName}</p>
                    <div className="flex items-center gap-2.5 mt-1 text-xs text-gray-450 font-medium">
                      <span>{formatDate(o.orderedAt)}</span>
                      {o.employees.length > 0 && (
                        <>
                          <span className="text-gray-250 font-light">•</span>
                          <span className="text-[#0f4c3a] font-bold">{employeesLabel}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 shrink-0 justify-between sm:justify-end">
                  {typeof o.priceEur === "number" ? (
                    <div className="text-right min-w-[70px]">
                      <p className="text-sm font-bold text-gray-900">
                        €{(o.priceEur * (o.employees.length || 1)).toFixed(0)}
                      </p>
                    </div>
                  ) : null}
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-widest ${badgeClass(o.status)}`}>
                    {o.status || "pending"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
