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
  if (name.includes("work") || name.includes("visa") || name.includes("permit") || name.includes("job")) return Briefcase;
  return HelpCircle;
}

export default function OrdersList({ orders, loading, canCancel, onCancel, onPay, onOpenChat, refresh }) {
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
                  (o.status === "pending" || o.status === "active") && onPay ? (
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
              <div className="pt-4 border-t border-gray-100 animate-in slide-in-from-top-4 duration-300 space-y-4">

                {/* ── CART RECIPIENT EMPLOYEES LIST ── */}
                {o.paymentStatus !== "paid" && employees.length > 0 && (
                  <div className="bg-gray-50/70 border border-gray-100/80 rounded-2xl p-4.5 animate-in fade-in duration-300">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                      Assigned Employees
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {employees.map((name) => (
                        <div
                          key={name}
                          className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800 shadow-sm flex items-center gap-1.5 hover:border-emerald-100 transition-colors"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-[#0f4c3a]/60"></div>
                          {name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* ── REAL-TIME RELOCATION TRACKING TIMELINE ── */}
                {o.paymentStatus === "paid" && (o.status === "active" || o.status === "pending") && (
                  <div key={selectedEmp} className="bg-gray-50/70 border border-gray-100 rounded-2xl p-4.5 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Real-Time Tracking: <span className="text-[#0f4c3a] font-extrabold">{selectedEmp}</span>
                      </p>
                    </div>

                    {o.status === "cancelled" ? (
                      <div className="text-center py-2 text-xs text-gray-400 font-bold uppercase tracking-wider">
                        🚫 Service Cancelled — Tracking Suspended
                      </div>
                    ) : (
                      (() => {
                        const isTransport = o.serviceCategory === "transport" || o.isTransport;
                        const steps = isTransport
                          ? ["Confirmed", "Driver Reached", "On the Way", "Dropped Off"]
                          : ["Assigned", "Documents", "Under Review", "Completed"];
                        
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
                          <div className="relative flex items-center justify-between mt-5 mb-2 px-3">
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
                                  className="flex flex-col items-center gap-1.5 relative z-10 select-none"
                                >
                                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black transition-all border ${
                                    isDone 
                                      ? "bg-[#0f4c3a] text-white border-[#0f4c3a] shadow-sm" 
                                      : isActive 
                                      ? "bg-white text-[#0f4c3a] border-[#0f4c3a] ring-4 ring-[#0f4c3a]/15 shadow-sm" 
                                      : "bg-white text-gray-400 border-gray-200 shadow-sm"
                                  }`}>
                                    {isDone ? "✓" : idx + 1}
                                  </div>
                                  <span className={`text-[9px] font-extrabold uppercase tracking-wider whitespace-nowrap ${
                                    isActive ? "text-[#0f4c3a]" : "text-gray-400"
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

                {/* ── DRIVER / SPECIALIST PROFILE CARD ── */}
                {o.paymentStatus === "paid" && (o.status === "active" || o.status === "pending") && (() => {
                  const isTransport = o.serviceCategory === "transport" || o.isTransport;
                  const name = isTransport ? "Thomas Miller" : "Elena Rostova";
                  const avatar = isTransport ? "TM" : "ER";
                  
                  return (
                    <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm hover:border-emerald-100/50 transition-colors animate-in fade-in duration-300">
                      <div className="flex items-center gap-3.5 w-full sm:w-auto">
                        <div className="w-11 h-11 rounded-2xl bg-[#0f4c3a]/10 border border-[#0f4c3a]/15 text-[#0f4c3a] flex items-center justify-center font-extrabold text-sm shrink-0">
                          {avatar}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-sm font-extrabold text-gray-900 leading-none">{name}</h4>
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[8px] font-black uppercase tracking-wider border border-emerald-100/40">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              {isTransport ? "Driver" : "Specialist"} Online
                            </span>
                          </div>
                          
                          <p className="text-xs text-gray-500 mt-1 font-medium leading-relaxed truncate">
                            {isTransport 
                              ? "Toyota Camry (Black) • Plate: M-AV 8820 • ⭐ 4.9" 
                              : "Dedicated Arrivio Senior Relocation Manager"
                            }
                          </p>
                        </div>
                      </div>

                      {/* Secure Actions */}
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenChat?.({
                              name,
                              category: isTransport ? "transport" : "consultancy",
                              serviceName: o.serviceName
                            });
                          }}
                          className="h-9 px-3.5 bg-[#0f4c3a] hover:bg-[#0a3120] text-white rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                        >
                          <Phone size={12} className="stroke-[2.5]" />
                          Secure Call
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenChat?.({
                              name,
                              category: isTransport ? "transport" : "consultancy",
                              serviceName: o.serviceName
                            });
                          }}
                          className="h-9 px-3.5 bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                        >
                          <MessageCircle size={12} className="stroke-[2.5]" />
                          Secure Chat
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* ── EMPLOYEES INDIVIDUAL TRACKING GRID ── */}
                {o.paymentStatus === "paid" && (o.status === "active" || o.status === "pending") && employees.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-2.5">
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                          Individual Employee Status & Tracking
                        </p>
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                          Select an employee to link and track their status on the live timeline above
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto pr-1.5 pt-1.5 arrivio-scrollbar">
                      {employees.map((name) => {
                        const isTransport = o.serviceCategory === "transport" || o.isTransport;
                        const steps = isTransport
                          ? ["Confirmed", "Driver Reached", "On the Way", "Dropped Off"]
                          : ["Assigned", "Documents", "Under Review", "Completed"];
                        
                        let stepIdx = 0;
                        if (o.status === "delivered") {
                          stepIdx = 3;
                        } else if (o.status === "cancelled") {
                          stepIdx = -1;
                        } else {
                          // Check specific employee tracking step
                          const customStep = o.employeeTracking?.[name];
                          if (typeof customStep === "number") {
                            stepIdx = customStep;
                          } else {
                            // Pseudo-random default based on character code sum to populate live dashboard variety!
                            const charSum = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
                            stepIdx = charSum % 3; // Default to 0, 1, or 2
                          }
                        }

                        // Colors for status badges
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
                            className={`h-9 rounded-full px-4 flex items-center gap-2.5 transition-all cursor-pointer border select-none ${
                              isSelected 
                                ? "bg-[#0f4c3a] text-white border-transparent shadow-md scale-102 font-bold" 
                                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 font-semibold"
                            }`}
                          >
                            <span className="text-xs truncate max-w-[120px]">
                              {name}
                            </span>
                            
                            {/* Static Status Badge inside pill */}
                            <span
                              className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider transition-all shrink-0 select-none ${
                                o.paymentStatus !== "paid" 
                                  ? "bg-gray-50 text-gray-400 border-gray-200" 
                                  : isSelected
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

                {hasNotes && (
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Notes</p>
                    <div className="space-y-2">
                      {globalNote ? (
                        <div className="border border-gray-200 rounded-xl p-3 bg-gray-50 text-xs text-gray-700 whitespace-pre-wrap">
                          {globalNote}
                        </div>
                      ) : null}

                      {employeeNotes.length > 0 ? (
                        <div className="divide-y divide-gray-100 rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                          {employeeNotes.map((n) => (
                            <div key={`${n.name}:${n.notes}`} className="p-3 bg-white hover:bg-gray-50 transition-colors">
                              <p className="text-xs font-bold text-gray-900">{n.name}</p>
                              <p className="text-xs text-gray-600 whitespace-pre-wrap mt-0.5">{n.notes}</p>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}

                {!hasNotes && employees.length === 0 && (
                  <p className="text-xs text-gray-400 italic">No details available.</p>
                )}

                {/* Destructive Cancel Relocation Order action placed neatly inside the expanded details section */}
                {canCancel && o.paymentStatus !== "paid" && (o.status === "pending" || o.status === "active") && (
                  <div className="flex justify-end pt-2 border-t border-gray-100/50">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent toggling card expansion on button click
                        onCancel?.(o);
                      }}
                      className="h-8 px-3 rounded-xl border border-red-100 bg-red-50/30 hover:bg-red-50 text-red-650 font-extrabold text-[10px] uppercase tracking-wider transition-all active:scale-95 duration-150 flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <XCircle size={13} className="shrink-0" />
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
