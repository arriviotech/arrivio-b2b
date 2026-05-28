import React, { useState } from "react";
import { XCircle, Plane, Home, Shield, FileText, Truck, HelpCircle, Briefcase, MapPin, ChevronDown, ChevronUp, Phone, MessageCircle, Lock } from "lucide-react";

function badgeClass(status) {
  switch (status) {
    case "active":
      return "bg-blue-50 text-blue-700 border-blue-100/60";
    case "delivered":
      return "bg-emerald-50 text-emerald-705 border-emerald-100/60";
    case "cancelled":
      return "bg-gray-50 text-gray-500 border-gray-200";
    case "pending":
    default:
      return "bg-amber-50 text-amber-705 border-amber-100/60";
  }
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

function getServiceIcon(serviceName) {
  const name = (serviceName || "").toLowerCase();
  if (name.includes("airport") || name.includes("pickup") || name.includes("transfer") || name.includes("driver")) return Plane;
  if (name.includes("housing") || name.includes("stay") || name.includes("apartment") || name.includes("room")) return Home;
  if (name.includes("registration") || name.includes("anmeldung") || name.includes("city")) return MapPin;
  if (name.includes("insurance") || name.includes("health") || name.includes("tk")) return Shield;
  if (name.includes("tax") || name.includes("steuer") || name.includes("id")) return FileText;
  if (name.includes("moving") || name.includes("relocation") || name.includes("delivery") || name.includes("transport")) return Truck;
  if (name.includes('work') || name.includes('visa') || name.includes('permit') || name.includes('job')) return Briefcase;
  return HelpCircle;
}

function getTrackingSteps(serviceName, serviceCategory, isTransportFlag) {
  const name = (serviceName || '').toLowerCase();

  if (name.includes('airport') || name.includes('pickup') || name.includes('transfer') || isTransportFlag) {
    return ['Confirmed', 'Driver Assigned', 'On the Way', 'Dropped Off'];
  }
  if (name.includes('anmeldung')) {
    return ['Docs Prep', 'Appt Booked', 'Office Visit', 'Registered'];
  }
  if (name.includes('bank')) {
    return ['Bank Selected', 'Form Filled', 'ID Verified', 'Account Open'];
  }
  if (name.includes('krankenkasse')) {
    return ['Provider Chosen', 'Applied', 'Processing', 'Cert Issued'];
  }
  if (name.includes('sim') || name.includes('mobile')) {
    return ['Carrier Picked', 'SIM Ordered', 'Delivered', 'Activated'];
  }
  if (name.includes('utilities') || name.includes('broadband')) {
    return ['Providers Picked', 'Contracts Sent', 'Processing', 'Connected'];
  }
  if (name.includes('liability') || name.includes('insurance')) {
    return ['Intro Made', 'Quote Rcvd', 'Signed', 'Policy Active'];
  }
  if (name.includes('steuer') || name.includes('finanzamt')) {
    return ['Data Collected', 'App Submitted', 'Processing', 'Tax ID Rcvd'];
  }
  if (name.includes('language')) {
    return ['Level Check', 'School Found', 'Enrolled', 'Course Started'];
  }
  if (name.includes('school')) {
    return ['Consultation', 'School Search', 'Applied', 'Place Secured'];
  }
  if (name.includes('kita')) {
    return ['Docs Gathered', 'Youth Office', 'Processing', 'Voucher Rcvd'];
  }
  if (name.includes('city orientation')) {
    return ['Consultation', 'Itinerary Set', 'Tour Active', 'Tour Completed'];
  }
  if (name.includes('buddy') || name.includes('integration')) {
    return ['Matched', 'Intro Call', 'Program Active', 'Completed'];
  }
  if (name.includes('consultant') || name.includes('retainer')) {
    return ['Requested', 'Assigned', 'In Progress', 'Completed'];
  }
  
  return ['Assigned', 'Documents', 'Under Review', 'Completed'];
}

export default function OrdersList({
  orders,
  loading,
  canCancel,
  onCancel,
  onPay,
  onOpenChat,
  refresh,
  isCartMode = false,
  selectedOrderIds = [],
  onToggleSelectOrder
}) {
  const [expandedId, setExpandedId] = useState(null);
  const [selectedEmployeeMap, setSelectedEmployeeMap] = useState({});

  if (loading) {
    return (
      <div className="bg-white rounded-[24px] border border-gray-100 p-12 text-center text-gray-400 font-bold flex flex-col items-center justify-center shadow-sm animate-in fade-in duration-300">
        <div className="w-8 h-8 border-4 border-[#0f4c3a]/20 border-t-[#0f4c3a] rounded-full animate-spin mb-3" />
        <span className="text-[10px] font-black uppercase tracking-wider">Loading orders...</span>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-[28px] border border-dashed border-gray-200 p-16 text-center flex flex-col items-center animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <Briefcase className="w-7 h-7 text-gray-300" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">No orders found</h3>
        <p className="text-sm text-gray-400 max-w-xs mx-auto">There are no relocation orders registered in this category.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {orders.map((o) => {
        const employees = Array.isArray(o.employees) ? o.employees : [];
        const globalNote = o.specialRequests ? String(o.specialRequests).trim() : "";
        const employeeDetails = Array.isArray(o.employeeDetails) ? o.employeeDetails : [];
        const employeeNotes = employeeDetails
          .map((d) => ({ name: d?.name || "Employee", notes: typeof d?.notes === "string" ? d.notes.trim() : "" }))
          .filter((d) => d.notes);
        const hasNotes = Boolean(globalNote) || employeeNotes.length > 0;
        const isExpanded = expandedId === o.id;
        const employeesLabel = o.isAllEmployees ? "All employees" : `${employees.length} employee${employees.length === 1 ? "" : "s"}`;
        const IconComponent = getServiceIcon(o.serviceName);

        // Resolve active employee currently being tracked
        const selectedEmp = selectedEmployeeMap[o.id] || employees[0] || null;

        return (
          <div
            key={o.id}
            onClick={() => setExpandedId((cur) => (cur === o.id ? null : o.id))}
            className="bg-white hover:bg-gradient-to-r hover:from-emerald-50/10 hover:to-white border border-gray-100/80 rounded-[24px] p-5 sm:p-6 transition-all duration-300 hover:shadow-md active:border-emerald-100/80 flex flex-col gap-4 relative overflow-hidden group shadow-[0_2px_15px_rgba(0,0,0,0.015)] cursor-pointer select-none"
          >
            {/* Main Row Content */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">

              {/* Left Column: Icon + Service Details */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {isCartMode && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation(); // Avoid card expansion
                      onToggleSelectOrder?.(o.id);
                    }}
                    className="pr-1 flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${selectedOrderIds.includes(o.id)
                        ? "bg-[#0f4c3a] border-transparent text-white shadow-sm"
                        : "border-gray-300 hover:border-gray-400 bg-white"
                      }`}>
                      {selectedOrderIds.includes(o.id) && (
                        <svg className="w-3.5 h-3.5 stroke-[3.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                )}
                <div className="w-12 h-12 rounded-2xl bg-emerald-50/50 text-[#0f4c3a] border border-[#0f4c3a]/10 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <IconComponent size={20} className="stroke-[2.5]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-gray-900 text-base tracking-tight truncate">
                      {o.serviceName || "Service Order"}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border select-none shrink-0 ${badgeClass(o.status)}`}>
                      {o.status}
                    </span>
                  </div>

                  {/* Subtitle details */}
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-gray-400 font-medium">
                    <span>{formatDate(o.orderedAt)}</span>
                    {employees.length > 0 && (
                      <>
                        <span className="text-gray-200 font-light">•</span>
                        <span className="text-[#0f4c3a] font-bold">{employeesLabel}</span>
                      </>
                    )}
                    {hasNotes && (
                      <>
                        <span className="text-gray-200 font-light">•</span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-50 border border-gray-200 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                          Notes Added
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Make Payment / Paid Tag + Price + Chevron */}
              <div className="flex items-center gap-4 shrink-0 justify-end pt-4 md:pt-0 border-t md:border-t-0 border-gray-50">

                {/* Paid Tag or Make Payment Button */}
                {o.paymentStatus === "paid" ? (
                  <span className="inline-flex items-center gap-1.5 px-4.5 h-9 bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase tracking-wider rounded-xl border border-emerald-100/60 shadow-sm shrink-0 select-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Paid via Credits
                  </span>
                ) : (
                  !isCartMode && (o.status === "pending" || o.status === "active") && onPay ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Avoid toggling expansion
                        onPay?.(o);
                      }}
                      className="h-9 px-4.5 bg-[#0f4c3a] hover:bg-[#0a3120] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-emerald-950/20 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                    >
                      Make Payment
                    </button>
                  ) : null
                )}

                {/* Price Display */}
                {typeof o.priceEur === "number" ? (
                  <div className="text-right flex flex-col items-end justify-center shrink-0 min-w-[85px] ml-1">
                    {employees.length > 0 && (
                      <p className="text-[10px] text-gray-400 font-extrabold tracking-wider">
                        {employees.length} × €{o.priceEur}
                      </p>
                    )}
                    <p className="font-bold text-gray-900 text-base leading-none">
                      €{(o.priceEur * (employees.length || 1)).toFixed(0)}
                    </p>
                  </div>
                ) : null}

                {/* Interactive Chevron Toggle Indicator */}
                <div className="text-gray-300 group-hover:text-gray-400 transition-colors shrink-0 pr-1">
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>
            </div>

            {/* Note Preview Banner (when closed) */}
            {!isExpanded && globalNote && (
              <div className="text-xs text-gray-500 bg-gray-50/50 rounded-xl p-3 border border-gray-100/40 line-clamp-1">
                <span className="font-bold text-[#0f4c3a] uppercase text-[9px] tracking-wider mr-1.5">Note:</span>
                {globalNote}
              </div>
            )}

            {/* Expanded Section Details */}
            {isExpanded && (
              <div className="pt-5 border-t border-gray-100 animate-in slide-in-from-top-4 duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

                  {/* Left Column (col-span 2): Timeline & Employee Selection */}
                  <div className="lg:col-span-2 space-y-5 flex flex-col justify-between">

                    {/* ── REAL-TIME RELOCATION TRACKING TIMELINE ── */}
                    {o.paymentStatus === "paid" && (o.status === "active" || o.status === "pending") && (
                      <div key={selectedEmp} className="bg-gray-50/50 border border-gray-100 rounded-2xl p-5 flex-1 flex flex-col justify-center animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center justify-between gap-3 mb-4">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Real-Time Tracking: <span className="text-[#0f4c3a] font-extrabold">{selectedEmp}</span>
                          </p>
                        </div>

                        {o.status === "cancelled" ? (
                          <div className="text-center py-4 text-xs text-gray-400 font-bold uppercase tracking-wider">
                            🚫 Service Cancelled- Tracking Suspended
                          </div>
                        ) : (
                          (() => {
                            const steps = getTrackingSteps(o.serviceName, o.serviceCategory, o.isTransport);

                            // Resolve current step for selectedEmp
                            let currentStep = 0;
                            if (o.status === "delivered") {
                              currentStep = 3;
                            } else if (selectedEmp) {
                              const customStep = o.employeeTracking?.[selectedEmp];
                              if (typeof customStep === "number") {
                                currentStep = customStep;
                              } else {
                                // Pseudo-random variety based on char code
                                const charSum = selectedEmp.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
                                currentStep = charSum % 3;
                              }
                            }

                            return (
                              <div className="relative flex items-center justify-between mt-5 mb-3 px-3">
                                {/* Background connector line */}
                                <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[3px] bg-gray-100 z-0 rounded-full">
                                  <div
                                    className="h-full bg-[#0f4c3a] transition-all duration-500 rounded-full"
                                    style={{ width: `${(currentStep / 3) * 100}%` }}
                                  />
                                </div>

                                {/* Step Nodes */}
                                {steps.map((label, idx) => {
                                  const isDone = idx < currentStep;
                                  const isActive = idx === currentStep;

                                  return (
                                    <div
                                      key={label}
                                      className="flex flex-col items-center gap-2 relative z-10 select-none animate-in fade-in duration-300"
                                    >
                                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all border ${isDone
                                          ? "bg-[#0f4c3a] text-white border-[#0f4c3a] shadow-sm"
                                          : isActive
                                            ? "bg-white text-[#0f4c3a] border-[#0f4c3a] ring-4 ring-[#0f4c3a]/15 shadow-sm"
                                            : "bg-white text-gray-400 border-gray-200 shadow-sm"
                                        }`}>
                                        {isDone ? "✓" : idx + 1}
                                      </div>
                                      <span className={`text-[9px] font-extrabold uppercase tracking-wider whitespace-nowrap ${isActive ? "text-[#0f4c3a]" : "text-gray-400"
                                        }`}>
                                        {label}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })()
                        )}
                      </div>
                    )}

                    {/* ── EMPLOYEES INDIVIDUAL TRACKING GRID ── */}
                    {o.paymentStatus === "paid" && (o.status === "active" || o.status === "pending") && employees.length > 0 && (
                      <div className="bg-white border border-gray-100 rounded-2xl p-5">
                        <div className="flex flex-col gap-0.5 mb-3.5">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                            Individual Employee Status & Tracking
                          </p>
                          <p className="text-[10px] text-gray-400 font-semibold leading-snug">
                            Select an employee below to view their specific progress timeline
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1.5 arrivio-scrollbar">
                          {employees.map((name) => {
                            const steps = getTrackingSteps(o.serviceName, o.serviceCategory, o.isTransport);

                            let stepIdx = 0;
                            if (o.status === "delivered") {
                              stepIdx = 3;
                            } else if (o.status === "cancelled") {
                              stepIdx = -1;
                            } else {
                              const customStep = o.employeeTracking?.[name];
                              if (typeof customStep === "number") {
                                stepIdx = customStep;
                              } else {
                                const charSum = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
                                stepIdx = charSum % 3;
                              }
                            }

                            const getBadgeStyles = (idx) => {
                              if (idx === -1) return "bg-rose-50 text-rose-700 border-rose-100";
                              switch (idx) {
                                case 3:
                                  return "bg-emerald-50 text-emerald-700 border-emerald-100";
                                case 2:
                                  return "bg-amber-50 text-amber-750 border-amber-100";
                                case 1:
                                  return "bg-sky-50 text-sky-700 border-sky-100";
                                case 0:
                                default:
                                  return "bg-gray-50 text-gray-500 border-gray-200";
                              }
                            };

                            const statusText = stepIdx === -1 ? "Cancelled" : steps[stepIdx];
                            const isSelected = selectedEmp === name;

                            return (
                              <div
                                key={name}
                                onClick={(e) => {
                                  e.stopPropagation(); // Avoid card close
                                  setSelectedEmployeeMap(prev => ({ ...prev, [o.id]: name }));
                                }}
                                className={`h-9 rounded-full px-4 flex items-center gap-2.5 transition-all cursor-pointer border select-none ${isSelected
                                    ? "bg-[#0f4c3a] text-white border-transparent shadow-md scale-102 font-bold"
                                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-350 font-semibold"
                                  }`}
                              >
                                <span className="text-xs truncate max-w-[120px]">
                                  {name}
                                </span>

                                <span
                                  className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider transition-all shrink-0 select-none ${isSelected
                                      ? "bg-white/20 text-white border border-white/30"
                                      : getBadgeStyles(stepIdx) + " border"
                                    }`}
                                >
                                  {statusText}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* ── CART RECIPIENT EMPLOYEES LIST ── */}
                    {o.paymentStatus !== "paid" && employees.length > 0 && (
                      <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-5">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                          Assigned Employees
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {o.isAllEmployees ? (
                            <div className="px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800 shadow-sm flex items-center gap-1.5 hover:border-emerald-100 transition-colors">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#0f4c3a]/60"></div>
                              All Employees ({employees.length})
                            </div>
                          ) : (
                            employees.map((name) => (
                              <div
                                key={name}
                                className="px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800 shadow-sm flex items-center gap-1.5 hover:border-emerald-100 transition-colors"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-[#0f4c3a]/60"></div>
                                {name}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column (col-span 1): Driver/Specialist Profile & Notes */}
                  <div className="lg:col-span-1 space-y-5 flex flex-col justify-between">

                    {/* ── DRIVER / SPECIALIST PROFILE CARD ── */}
                    {o.paymentStatus === "paid" && (o.status === "active" || o.status === "pending") && (() => {
                      const isTransportType = getTrackingSteps(o.serviceName, o.serviceCategory, o.isTransport).includes('Driver Assigned');
                      const name = isTransportType ? "Thomas Miller" : "Elena Rostova";
                      const avatar = isTransportType ? "TM" : "ER";

                      return (
                        <div className="bg-white border border-gray-200 rounded-3xl p-5 flex flex-col items-center text-center justify-between gap-5 shadow-sm hover:border-[#0f4c3a]/25 transition-colors duration-300 animate-in fade-in duration-300 flex-1 min-h-[220px]">
                          <div className="flex flex-col items-center">
                            <div className="w-14 h-14 rounded-2xl bg-[#0f4c3a]/10 border border-[#0f4c3a]/15 text-[#0f4c3a] flex items-center justify-center font-black text-base shadow-sm mb-3">
                              {avatar}
                            </div>

                            <h4 className="text-base font-extrabold text-gray-900 leading-none">{name}</h4>

                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[8px] font-black uppercase tracking-wider border border-emerald-100/40 mt-2 select-none">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              {isTransportType ? "Driver" : "Specialist"} Online
                            </span>

                            <p className="text-xs text-gray-500 mt-3 font-semibold leading-relaxed max-w-[200px]">
                              {isTransportType
                                ? "Toyota Camry (Black) • Plate: M-AV 8820 • ⭐ 4.9"
                                : "Dedicated Arrivio Senior Relocation Manager"
                              }
                            </p>
                          </div>

                          {/* Secure Actions */}
                          <div className="flex flex-col gap-2 w-full shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenChat?.({
                                  name,
                                  category: isTransportType ? "transport" : "consultancy",
                                  serviceName: o.serviceName
                                });
                              }}
                              className="h-10 w-full bg-[#0f4c3a] hover:bg-[#0a3120] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
                            >
                              <Phone size={13} className="stroke-[2.5]" />
                              Secure Call
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenChat?.({
                                  name,
                                  category: isTransportType ? "transport" : "consultancy",
                                  serviceName: o.serviceName
                                });
                              }}
                              className="h-10 w-full bg-white hover:bg-gray-50 text-gray-655 border border-gray-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
                            >
                              <MessageCircle size={13} className="stroke-[2.5]" />
                              Secure Chat
                            </button>
                          </div>
                        </div>
                      );
                    })()}

                    {/* ── NOTES ── */}
                    {hasNotes && (
                      <div className="bg-gray-50/40 border border-gray-150 rounded-2xl p-5 flex-1 min-h-[140px]">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2.5">Notes</p>
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-1 arrivio-scrollbar">
                          {globalNote ? (
                            <div className="border border-gray-200 rounded-xl p-3 bg-white text-xs text-gray-700 font-semibold whitespace-pre-wrap">
                              {globalNote}
                            </div>
                          ) : null}

                          {employeeNotes.map((n) => (
                            <div key={`${n.name}:${n.notes}`} className="p-3 bg-white rounded-xl border border-gray-150">
                              <p className="text-xs font-black text-gray-950">{n.name}</p>
                              <p className="text-xs text-gray-505 font-medium whitespace-pre-wrap mt-0.5">{n.notes}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Destructive Cancel Relocation Order action placed neatly inside the expanded details section */}
                {canCancel && o.paymentStatus !== "paid" && (o.status === "pending" || o.status === "active") && (
                  <div className="flex justify-end pt-4 mt-4 border-t border-gray-100/50">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent toggling card expansion on button click
                        onCancel?.(o);
                      }}
                      className="h-9 px-4 bg-rose-50 hover:bg-rose-100/60 border border-rose-100 text-rose-700 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <XCircle size={14} className="shrink-0" />
                      Cancel Relocation Order
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
