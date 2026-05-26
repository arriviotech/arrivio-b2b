import React, { useMemo, useState } from "react";
import { SERVICE_CATEGORIES } from "../../data/servicesData";
import { MOCK_EMPLOYEES } from "../../data/mockEmployees";
import { useServices } from "../../supabase/hooks/useServices";
import { useServiceOrders } from "../../supabase/hooks/useServiceOrders";
import ServiceCard from "../../components/services/ServiceCard";
import RequestServiceModal from "../../components/services/RequestServiceModal";
import OrdersList from "../../components/services/OrdersList";
import SecureChatDrawer from "../../components/services/SecureChatDrawer";

const ORDER_TABS = [
  { key: "pending", label: "Active" }, // MVP: treat pending as active
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

export default function Services() {
  const [mode, setMode] = useState("browse"); // 'browse' | 'orders'
  const [category, setCategory] = useState("all");
  const [selectedService, setSelectedService] = useState(null);
  const [payingOrder, setPayingOrder] = useState(null);
  const [paymentSuccessOrder, setPaymentSuccessOrder] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [ordersSubTab, setOrdersSubTab] = useState("cart"); // 'cart' | 'status'
  const totalEmployees = MOCK_EMPLOYEES.length;

  const { services, loading: servicesLoading } = useServices();
  const { orders, loading: ordersLoading, create, updateStatus, updateManyStatus, refresh } = useServiceOrders({ status: "all" });

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
        paymentStatus: o.paymentStatus ?? "unpaid",
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
        existing.employeeTracking = { ...existing.employeeTracking, ...(o.employeeTracking || {}) };
        return;
      }
      groups.set(key, {
        id: key,
        orderIds: [o.id],
        serviceId: o.serviceId ?? null,
        serviceName: o.serviceName ?? null,
        serviceCategory: o.serviceCategory ?? null,
        status: o.status ?? "pending",
        paymentStatus: o.paymentStatus ?? "unpaid",
        orderedAt: o.orderedAt ?? null,
        quantity: o.quantity ?? 1,
        specialRequests: o.specialRequests ?? "",
        priceEur: typeof o.priceEur === "number" ? o.priceEur : null,
        employees: [employeeLabel],
        employeeDetails: [employeeDetail],
        isAllEmployees: false,
        isTransport: o.serviceCategory === "transport",
        employeeTracking: o.employeeTracking || {},
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

  const cartOrders = useMemo(() => {
    if (mode !== "orders") return [];
    return groupedOrders.filter(
      (o) => o.paymentStatus !== "paid" && o.status !== "cancelled" && o.status !== "delivered"
    );
  }, [groupedOrders, mode]);

  const statusOrders = useMemo(() => {
    if (mode !== "orders") return [];
    
    const list = groupedOrders.filter(
      (o) => o.paymentStatus === "paid" || o.status === "cancelled" || o.status === "delivered"
    );
    
    // Sort so paid active is first, then delivered, then cancelled
    return [...list].sort((a, b) => {
      const aActive = a.paymentStatus === "paid" && (a.status === "pending" || a.status === "active");
      const bActive = b.paymentStatus === "paid" && (b.status === "pending" || b.status === "active");
      if (aActive && !bActive) return -1;
      if (!aActive && bActive) return 1;

      const aDelivered = a.status === "delivered";
      const bDelivered = b.status === "delivered";
      if (aDelivered && !bDelivered) return -1;
      if (!aDelivered && bDelivered) return 1;

      const aCancelled = a.status === "cancelled";
      const bCancelled = b.status === "cancelled";
      if (aCancelled && !bCancelled) return -1;
      if (!aCancelled && bCancelled) return 1;

      return 0;
    });
  }, [groupedOrders, mode]);

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
      <div className="flex items-center justify-between gap-6 mb-8 border-b border-gray-100 pb-6">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0f4c3a] bg-emerald-50 border border-emerald-100/50 px-2.5 py-1 rounded-full mb-2.5 inline-block shadow-sm">
            ✦ Relocation Solutions
          </span>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 leading-none mt-1">Services</h1>
          <p className="text-gray-500 mt-2 font-medium text-sm">Everything you need to settle your employees into life in Germany.</p>
        </div>

        <div className="bg-gray-100/80 border border-gray-200/50 p-1 rounded-2xl flex items-center shrink-0 shadow-sm">
          <button
            onClick={() => setMode("browse")}
            className={`h-9 px-4.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer ${mode === "browse"
              ? "bg-[#0f4c3a] text-white shadow-sm"
              : "text-gray-500 hover:text-gray-900"
              }`}
          >
            Browse Services
          </button>
          <button
            onClick={() => setMode("orders")}
            className={`h-9 px-4.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${mode === "orders"
              ? "bg-[#0f4c3a] text-white shadow-sm"
              : "text-gray-500 hover:text-gray-900"
              }`}
          >
            My Orders
            {(orderCounts.pending + orderCounts.active) > 0 && (
              <span className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-md text-[9px] font-black leading-none ${mode === "orders" ? "bg-white text-[#0f4c3a]" : "bg-red-500 text-white animate-pulse"}`}>
                {orderCounts.pending + orderCounts.active}
              </span>
            )}
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
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* ── SUB-TAB SWITCHER: CART VS STATUS ── */}
          <div className="flex flex-wrap items-center gap-1.5 bg-gray-100/50 border border-gray-200/40 p-1 rounded-2xl w-max mb-2 shadow-inner">
            <button
              onClick={() => setOrdersSubTab("cart")}
              className={`h-9 px-5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                ordersSubTab === "cart"
                  ? "bg-[#0f4c3a] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Cart
              {cartOrders.length > 0 && (
                <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black leading-none ${
                  ordersSubTab === "cart" ? "bg-white text-[#0f4c3a]" : "bg-red-500 text-white animate-pulse"
                }`}>
                  {cartOrders.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setOrdersSubTab("status")}
              className={`h-9 px-5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                ordersSubTab === "status"
                  ? "bg-[#0f4c3a] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Status & History
              {statusOrders.length > 0 && (
                <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black leading-none ${
                  ordersSubTab === "status" ? "bg-white text-[#0f4c3a]" : "bg-gray-200 text-gray-650"
                }`}>
                  {statusOrders.length}
                </span>
              )}
            </button>
          </div>

          {/* ── TAB VIEW CONDITIONAL RENDERING ── */}
          {ordersSubTab === "cart" ? (
            <div className="bg-[#0f4c3a]/[0.02] border border-[#0f4c3a]/5 rounded-[28px] p-5 sm:p-6 shadow-[inset_0_2px_8px_rgba(15,76,58,0.015)] animate-in fade-in duration-300">
              <OrdersList
                orders={cartOrders}
                loading={ordersLoading}
                canCancel={true}
                refresh={refresh}
                onCancel={(order) => {
                  const ids = Array.isArray(order?.orderIds) ? order.orderIds : [order.id];
                  if (ids.length > 1) return updateManyStatus({ ids, status: "cancelled" });
                  return updateStatus({ id: ids[0], status: "cancelled" });
                }}
                onPay={(order) => {
                  setPayingOrder(order);
                }}
                onOpenChat={(recipient) => {
                  setActiveChat(recipient);
                }}
              />
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-[28px] p-5 sm:p-6 shadow-sm animate-in fade-in duration-300">
              <OrdersList
                orders={statusOrders}
                loading={ordersLoading}
                canCancel={true}
                refresh={refresh}
                onCancel={(order) => {
                  const ids = Array.isArray(order?.orderIds) ? order.orderIds : [order.id];
                  if (ids.length > 1) return updateManyStatus({ ids, status: "cancelled" });
                  return updateStatus({ id: ids[0], status: "cancelled" });
                }}
                onPay={(order) => {
                  setPayingOrder(order);
                }}
                onOpenChat={(recipient) => {
                  setActiveChat(recipient);
                }}
              />
            </div>
          )}
        </div>
      )}

      <RequestServiceModal
        isOpen={Boolean(selectedService)}
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onConfirm={(payload) => create(payload)}
      />

      {/* ── CUSTOM PAYMENT CONFIRMATION MODAL ── */}
      {payingOrder && (() => {
        const totalCost = payingOrder.priceEur * (payingOrder.employees.length || 1);
        const storedCredits = localStorage.getItem('arrivio_credits');
        const creditsVal = storedCredits !== null ? parseFloat(storedCredits) : 3500.00;
        const isSufficient = creditsVal >= totalCost;
        const nextBalance = creditsVal - totalCost;

        return (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-300" onClick={() => setPayingOrder(null)} />
            <div className="relative w-full max-w-[400px] bg-white rounded-[28px] shadow-2xl border border-gray-100 overflow-hidden p-6 sm:p-7 transform transition-all animate-in zoom-in-95 duration-250">
              
              {/* Close Icon */}
              <button 
                onClick={() => setPayingOrder(null)}
                className="absolute top-4 right-4 p-1.5 hover:bg-gray-50 rounded-full text-gray-400 hover:text-gray-900 transition-all cursor-pointer"
                aria-label="Close"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="text-center mb-5 mt-2">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#0f4c3a] border border-[#0f4c3a]/10 flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-extrabold text-gray-900 tracking-tight leading-snug">Confirm Credit Payment</h3>
                <p className="text-xs text-gray-400 mt-1 font-medium">Verify your transaction details below</p>
              </div>

              {/* Transaction Summary Card */}
              <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 mb-5 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Service Ordered</span>
                  <span className="text-gray-800 font-bold">{payingOrder.serviceName}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Recipients</span>
                  <span className="text-gray-800 font-bold">{payingOrder.employees.length} Employee(s)</span>
                </div>
                <div className="border-t border-gray-200/50 my-2 pt-2 flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Current Balance</span>
                  <span className="text-gray-800 font-bold">€{creditsVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Service Cost</span>
                  <span className="text-red-600 font-extrabold">€{totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="border-t border-gray-200/50 pt-2 flex justify-between items-center">
                  <span className="text-[#0f4c3a] font-black uppercase tracking-widest text-[9px]">Post-Balance</span>
                  <span className="text-[#0f4c3a] font-extrabold text-sm">€{nextBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* Insufficient balance warning */}
              {!isSufficient && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-start gap-2.5 mb-5 animate-in fade-in duration-300">
                  <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-[11px] font-bold text-red-700 leading-normal">
                    Insufficient Arrivio Credits! Please top up your balance in the Payments section before completing this order.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5 pt-1">
                <button
                  disabled={!isSufficient}
                  onClick={async () => {
                    // Deduct credits
                    localStorage.setItem('arrivio_credits', nextBalance.toString());

                    // Add transaction
                    const storedTx = localStorage.getItem('arrivio_transactions');
                    const transactions = storedTx ? JSON.parse(storedTx) : [
                      { id: '#TRX-94812', date: 'Mar 10, 2026', type: 'Subscription', amount: '€2,499.00', status: 'Completed', logo: '✦' },
                      { id: '#TRX-94755', date: 'Feb 10, 2026', type: 'Subscription', amount: '€2,499.00', status: 'Completed', logo: '✦' },
                      { id: '#TRX-94621', date: 'Jan 22, 2026', type: 'Capacity Top-up', amount: '€450.00', status: 'Completed', logo: '↑' },
                      { id: '#TRX-94590', date: 'Jan 10, 2026', type: 'Subscription', amount: '€1,850.00', status: 'Completed', logo: '✦' },
                    ];
                    const newTrx = {
                      id: `#TRX-${Math.floor(10000 + Math.random() * 90000)}`,
                      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                      type: `Service: ${payingOrder.serviceName}`,
                      amount: `€${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                      status: 'Completed',
                      logo: 'S'
                    };
                    localStorage.setItem('arrivio_transactions', JSON.stringify([newTrx, ...transactions]));

                    // Update order paymentStatus to "paid"
                    const ids = Array.isArray(payingOrder?.orderIds) ? payingOrder.orderIds : [payingOrder.id];
                    const STORAGE_KEY = "arrivio_service_orders_v1";
                    const storedOrders = localStorage.getItem(STORAGE_KEY);
                    if (storedOrders) {
                      const parsed = JSON.parse(storedOrders);
                      const set = new Set(ids);
                      const nextOrders = parsed.map(o => set.has(o.id) ? { ...o, paymentStatus: 'paid' } : o);
                      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextOrders));
                    }

                    // Show success
                    setPaymentSuccessOrder({
                      serviceName: payingOrder.serviceName,
                      totalCost,
                      nextBalance
                    });
                    setPayingOrder(null);
                  }}
                  className="w-full py-3 bg-[#0f4c3a] hover:bg-[#0a3120] text-white rounded-2xl text-[11px] font-extrabold uppercase tracking-widest transition-all shadow-md hover:shadow-emerald-950/20 active:scale-[0.98] disabled:opacity-30 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-1.5"
                >
                  Confirm & Pay
                </button>
                <button
                  onClick={() => setPayingOrder(null)}
                  className="w-full py-3 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-900 border border-gray-200 rounded-2xl text-[11px] font-extrabold uppercase tracking-widest transition-all active:scale-[0.98] cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── CUSTOM PAYMENT SUCCESS MODAL ── */}
      {paymentSuccessOrder && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-300">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-300" onClick={() => { setPaymentSuccessOrder(null); setOrdersSubTab("status"); refresh(); }} />
          <div className="relative w-full max-w-[390px] bg-white rounded-[28px] shadow-2xl border border-gray-100 overflow-hidden p-6 sm:p-7 text-center transform transition-all animate-in zoom-in-95 duration-250">
            
            {/* Animated Checkmark Circle */}
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-650 border border-emerald-100 flex items-center justify-center mx-auto mb-4 mt-2 ring-8 ring-emerald-50/50 shadow-inner">
              <svg className="w-8 h-8 animate-bounce duration-1000" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h3 className="text-xl font-black text-gray-900 tracking-tight leading-snug">Payment Successful!</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-[260px] mx-auto font-medium">Your Arrivio Credit transaction has been completed.</p>

            {/* Micro Details Box */}
            <div className="bg-emerald-50/20 border border-emerald-100/30 rounded-2xl p-4 my-5 space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-emerald-800 font-extrabold uppercase tracking-wider text-[9px]">Paid For</span>
                <span className="text-gray-800 font-bold">{paymentSuccessOrder.serviceName}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-emerald-800 font-extrabold uppercase tracking-wider text-[9px]">Deducted Cost</span>
                <span className="text-[#0f4c3a] font-black">€{paymentSuccessOrder.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="border-t border-emerald-100/50 pt-2 flex justify-between items-center">
                <span className="text-emerald-800 font-black uppercase tracking-widest text-[9px]">Remaining Balance</span>
                <span className="text-emerald-800 font-black text-sm">€{paymentSuccessOrder.nextBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setPaymentSuccessOrder(null);
                setOrdersSubTab("status");
                refresh();
              }}
              className="w-full py-3.5 bg-[#0f4c3a] hover:bg-[#0a3120] text-white rounded-2xl text-[11px] font-extrabold uppercase tracking-widest transition-all shadow-md hover:shadow-emerald-950/20 active:scale-[0.98] cursor-pointer"
            >
              Back to Orders
            </button>
          </div>
        </div>
      )}

      <SecureChatDrawer
        isOpen={Boolean(activeChat)}
        onClose={() => setActiveChat(null)}
        recipient={activeChat}
      />
    </div>
  );
}
