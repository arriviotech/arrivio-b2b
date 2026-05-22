import React, { useMemo, useState } from "react";
import { SERVICE_CATEGORIES } from "../../data/servicesData";
import { MOCK_EMPLOYEES } from "../../data/mockEmployees";
import { useServices } from "../../supabase/hooks/useServices";
import { useServiceOrders } from "../../supabase/hooks/useServiceOrders";
import ServiceCard from "../../components/services/ServiceCard";
import RequestServiceModal from "../../components/services/RequestServiceModal";
import OrdersList from "../../components/services/OrdersList";

const ORDER_TABS = [
  { key: "pending", label: "Active" }, // MVP: treat pending as active
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

export default function Services() {
  const [mode, setMode] = useState("browse"); // 'browse' | 'orders'
  const [category, setCategory] = useState("all");
  const [selectedService, setSelectedService] = useState(null);
  const [ordersTab, setOrdersTab] = useState("pending");
  const totalEmployees = MOCK_EMPLOYEES.length;

  const { services, loading: servicesLoading } = useServices();
  const { orders, loading: ordersLoading, create, updateStatus, updateManyStatus } = useServiceOrders({ status: "all" });

  const filtered = useMemo(() => {
    const list = services || [];
    if (category === "all") return list;
    return list.filter((s) => s.category === category);
  }, [services, category]);

  const servicesById = useMemo(() => {
    const map = new Map();
    (services || []).forEach((s) => map.set(s.id, s));
    return map;
  }, [services]);

  const enrichedOrders = useMemo(() => {
    return (orders || []).map((o) => {
      const svc = servicesById.get(o.serviceId);
      return {
        ...o,
        serviceName: o.serviceName ?? svc?.name ?? null,
        priceEur: typeof o.priceEur === "number" ? o.priceEur : (svc?.priceEur ?? null),
        employeeName: o.employeeName ?? null,
        serviceCategory: svc?.category ?? null,
      };
    });
  }, [orders, servicesById]);

  const groupedOrders = useMemo(() => {
    const list = enrichedOrders || [];
    const groups = new Map();
    list.forEach((o) => {
      const key = [
        o.serviceId ?? "unknown-service",
        o.orderedAt ?? "unknown-time",
        o.status ?? "pending",
        o.quantity ?? 1,
        o.specialRequests ?? "",
      ].join("|");

      const existing = groups.get(key);
      const employeeLabel = o.employeeName || o.employeeId || "Employee";
      const cf = o.customFields || {};
      const employeeDetail = {
        id: o.employeeId ?? null,
        name: employeeLabel,
        notes: typeof cf?.notes === "string" ? cf.notes : null,
        pickupTime: typeof cf?.pickupTime === "string" ? cf.pickupTime : null,
        reference: typeof cf?.reference === "string" ? cf.reference : null,
      };
      if (existing) {
        existing.orderIds.push(o.id);
        if (!existing.employees.includes(employeeLabel)) existing.employees.push(employeeLabel);
        if (!existing.employeeDetails.some((e) => e.name === employeeLabel)) existing.employeeDetails.push(employeeDetail);
        return;
      }
      groups.set(key, {
        id: key,
        orderIds: [o.id],
        serviceId: o.serviceId ?? null,
        serviceName: o.serviceName ?? null,
        serviceCategory: o.serviceCategory ?? null,
        status: o.status ?? "pending",
        orderedAt: o.orderedAt ?? null,
        quantity: o.quantity ?? 1,
        specialRequests: o.specialRequests ?? "",
        priceEur: typeof o.priceEur === "number" ? o.priceEur : null,
        employees: [employeeLabel],
        employeeDetails: [employeeDetail],
        isAllEmployees: false,
        isTransport: o.serviceCategory === "transport",
      });
    });

    return Array.from(groups.values())
      .map((g) => ({
        ...g,
        isAllEmployees: Array.isArray(g.employees) && g.employees.length >= totalEmployees,
      }))
      .sort((a, b) => {
      const da = a.orderedAt ? new Date(a.orderedAt).getTime() : 0;
      const db = b.orderedAt ? new Date(b.orderedAt).getTime() : 0;
      return db - da;
    });
  }, [enrichedOrders, totalEmployees]);

  const orderCounts = useMemo(() => {
    const list = groupedOrders || [];
    const counts = { pending: 0, active: 0, delivered: 0, cancelled: 0, all: list.length };
    list.forEach((o) => {
      if (o.status === "delivered") counts.delivered += 1;
      else if (o.status === "cancelled") counts.cancelled += 1;
      else if (o.status === "active") counts.active += 1;
      else counts.pending += 1;
    });
    return counts;
  }, [groupedOrders]);

  const visibleOrders = useMemo(() => {
    if (mode !== "orders") return [];
    if (ordersTab === "pending") return groupedOrders.filter((o) => o.status === "pending" || o.status === "active");
    if (ordersTab === "delivered") return groupedOrders.filter((o) => o.status === "delivered");
    if (ordersTab === "cancelled") return groupedOrders.filter((o) => o.status === "cancelled");
    return groupedOrders;
  }, [groupedOrders, mode, ordersTab]);

  const countsByCategory = useMemo(() => {
    const list = services || [];
    const counts = {};
    list.forEach((s) => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });
    return counts;
  }, [services]);

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="flex items-start justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Services</h1>
          <p className="text-gray-500 mt-1">Everything you need to settle into life in Germany.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setMode("browse")}
            className={`h-11 px-5 rounded-xl text-sm font-bold border transition-colors ${mode === "browse"
              ? "bg-[#0a1a12] text-white border-[#0a1a12]"
              : "bg-white text-gray-700 border-gray-200 hover:border-[#1e6f50] hover:text-[#1e6f50]"
              }`}
          >
            Browse Services
          </button>
          <button
            onClick={() => setMode("orders")}
            className={`h-11 px-5 rounded-xl text-sm font-bold border transition-colors ${mode === "orders"
              ? "bg-[#0a1a12] text-white border-[#0a1a12]"
              : "bg-white text-gray-700 border-gray-200 hover:border-[#1e6f50] hover:text-[#1e6f50]"
              }`}
          >
            <span className="relative inline-flex items-center">
              My Orders
              {(orderCounts.pending + orderCounts.active) > 0 ? (
                <span className="ml-2 inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-red-500 text-white text-[11px] font-extrabold">
                  {orderCounts.pending + orderCounts.active}
                </span>
              ) : null}
            </span>
          </button>
        </div>
      </div>

      {mode === "browse" ? (
        <>
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {SERVICE_CATEGORIES.map((c) => {
              const count = c.key === "all" ? (services?.length || 0) : (countsByCategory[c.key] || 0);
              const active = category === c.key;
              return (
                <button
                  key={c.key}
                  onClick={() => setCategory(c.key)}
                  className={`h-10 px-4 rounded-full text-sm font-bold border transition-colors ${active
                    ? "bg-[#0a1a12] text-white border-[#0a1a12]"
                    : "bg-white text-gray-700 border-gray-200 hover:border-[#1e6f50] hover:text-[#1e6f50]"
                    }`}
                >
                  {c.label} ({count})
                </button>
              );
            })}
          </div>

          {servicesLoading ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-gray-500">Loading services...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((s) => (
                <ServiceCard key={s.id} service={s} onRequest={(svc) => setSelectedService(svc)} />
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {ORDER_TABS.map((t) => {
              const active = ordersTab === t.key;
              const count =
                t.key === "pending"
                  ? (orderCounts.pending + orderCounts.active)
                  : (orderCounts[t.key] || 0);
              return (
                <button
                  key={t.key}
                  onClick={() => setOrdersTab(t.key)}
                  className={`h-10 px-4 rounded-full text-sm font-bold border transition-colors ${active
                    ? "bg-[#0a1a12] text-white border-[#0a1a12]"
                    : "bg-white text-gray-700 border-gray-200 hover:border-[#1e6f50] hover:text-[#1e6f50]"
                    }`}
                >
                  {t.key === "pending" ? `Active (${count})` : `${t.label}${count ? ` (${count})` : ""}`}
                </button>
              );
            })}
          </div>

          <OrdersList
            orders={visibleOrders}
            loading={ordersLoading}
            canCancel={ordersTab === "pending"}
            onCancel={(order) => {
              const ids = Array.isArray(order?.orderIds) ? order.orderIds : [order.id];
              if (ids.length > 1) return updateManyStatus({ ids, status: "cancelled" });
              return updateStatus({ id: ids[0], status: "cancelled" });
            }}
          />
        </>
      )}

      <RequestServiceModal
        isOpen={Boolean(selectedService)}
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onConfirm={(payload) => create(payload)}
      />
    </div>
  );
}
