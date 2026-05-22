import React, { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { useServices } from "../../supabase/hooks/useServices";
import { useServiceOrders } from "../../supabase/hooks/useServiceOrders";
import ServiceCard from "./ServiceCard";
import RequestServiceModal from "./RequestServiceModal";

export default function ServicesStrip() {
  const { services, loading } = useServices();
  const { create } = useServiceOrders({ status: "all" });
  const [selectedService, setSelectedService] = useState(null);

  const top = useMemo(() => {
    const list = services || [];
    const preferredIds = [
      "seed-airport-pickup",
      "seed-airport-dropoff",
      "seed-housing",
      "seed-bank",
    ];
    const byId = new Map(list.map((s) => [s.id, s]));
    const preferred = preferredIds.map((id) => byId.get(id)).filter(Boolean);
    const remaining = list.filter((s) => !preferredIds.includes(s.id));
    return [...preferred, ...remaining].slice(0, 4);
  }, [services]);

  return (
    <section className="mt-10 mb-10">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900">Popular Services</h2>
          <p className="text-gray-500 mt-1 text-sm">Quickly add relocation services.</p>
        </div>
        <NavLink
          to="/dashboard/services"
          className="text-sm font-bold text-[#1e6f50] hover:text-[#134a35] transition-colors"
        >
          View all →
        </NavLink>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-gray-500">Loading services...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {top.map((s) => (
            <ServiceCard
              key={s.id}
              service={s}
              variant="popular"
              onRequest={(svc) => setSelectedService(svc)}
            />
          ))}
        </div>
      )}

      <RequestServiceModal
        isOpen={Boolean(selectedService)}
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onConfirm={(payload) => create(payload)}
      />
    </section>
  );
}
