import React, { useState } from "react";
import { XCircle } from "lucide-react";

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
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

export default function OrdersList({ orders, loading, canCancel, onCancel }) {
  const [expandedId, setExpandedId] = useState(null);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-8 text-gray-500">
        Loading orders...
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center text-gray-500">
        No orders found.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="divide-y divide-gray-50">
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

          return (
            <div key={o.id} className="px-6 py-5">
              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-gray-900 truncate">
                      {o.serviceName || "Service Order"}
                    </p>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${badgeClass(o.status)}`}>
                      {String(o.status || "pending").toUpperCase()}
                    </span>
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
                    <span>{formatDate(o.orderedAt)}</span>
                    <span className="text-gray-300">•</span>
                    <span>Qty {o.quantity}</span>
                    {employees.length > 0 ? (
                      <>
                        <span className="text-gray-300">•</span>
                        <span>{employeesLabel}</span>
                      </>
                    ) : null}
                    {hasNotes ? (
                      <>
                        <span className="text-gray-300">•</span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-50 border border-gray-200 text-[11px] font-bold text-gray-600">
                          Note added
                        </span>
                      </>
                    ) : null}
                  </div>

                  {globalNote ? (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-1">
                      {globalNote}
                    </p>
                  ) : employeeNotes.length === 1 ? (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-1">
                      {employeeNotes[0].name}: {employeeNotes[0].notes}
                    </p>
                  ) : employeeNotes.length > 1 ? (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-1">
                      Employee notes added ({employeeNotes.length})
                    </p>
                  ) : null}
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setExpandedId((cur) => (cur === o.id ? null : o.id))}
                    className={`h-9 px-3 rounded-xl border text-sm font-bold transition-colors ${isExpanded
                      ? "bg-[#0a1a12] text-white border-[#0a1a12]"
                      : "bg-white text-gray-700 border-gray-200 hover:border-[#1e6f50] hover:text-[#1e6f50]"
                      }`}
                  >
                    {isExpanded ? "Hide details" : "Details"}
                  </button>

                  {canCancel && (o.status === "pending" || o.status === "active") ? (
                    <button
                      onClick={() => onCancel?.(o)}
                      className="h-9 px-3 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:border-red-300 hover:text-red-700 hover:bg-red-50 transition-colors flex items-center gap-2"
                      aria-label="Cancel order"
                    >
                      <XCircle className="w-4 h-4" />
                      Cancel
                    </button>
                  ) : null}

                  {typeof o.priceEur === "number" ? (
                    <p className="font-bold text-gray-900">€{o.priceEur.toFixed(0)}</p>
                  ) : null}
                </div>
              </div>

              {isExpanded ? (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  {employees.length > 0 ? (
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Employees</p>
                      {o.isAllEmployees ? (
                        <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-900">
                          All employees
                        </div>
                      ) : (
                        // If transport details exist, show a merged single-column list with scroll
                        (o.isTransport && employeeDetails.some((d) => d?.pickupTime || d?.reference)) ? (
                          <div className="max-h-44 overflow-auto pr-1">
                            <div className="rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
                              {employeeDetails
                                .filter((d) => d?.pickupTime || d?.reference || d?.name)
                                .map((d) => (
                                  <div key={d.name} className="px-3 py-3 bg-white flex items-center justify-between gap-3 hover:bg-gray-50">
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-bold text-gray-900 truncate">{d.name}</p>
                                      {(d.reference || d.notes) ? (
                                        <p className="text-sm text-gray-600 mt-0.5 truncate">{d.reference || d.notes}</p>
                                      ) : null}
                                    </div>
                                    <div className="shrink-0 text-sm text-gray-700 font-semibold text-right">
                                      {d.pickupTime ? <span>{d.pickupTime}</span> : null}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        ) : (
                          <div className="max-h-44 overflow-auto pr-1">
                            <div className="rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
                              {employees.map((name) => (
                                <div key={name} className="px-3 py-3 bg-white flex items-center justify-between gap-3 hover:bg-gray-50">
                                  <p className="text-sm font-bold text-gray-900 truncate">{name}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  ) : null}

                  {hasNotes ? (
                    <div className={employees.length ? "mt-4" : ""}>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Notes</p>
                      <div className="space-y-2">
                        {globalNote ? (
                          <div className="border border-gray-200 rounded-xl p-3 bg-gray-50 text-sm text-gray-800 whitespace-pre-wrap">
                            {globalNote}
                          </div>
                        ) : null}

                        {employeeNotes.length > 0 ? (
                          <div className="divide-y divide-gray-100 rounded-xl border border-gray-200 overflow-hidden">
                            {employeeNotes.map((n) => (
                              <div key={`${n.name}:${n.notes}`} className="p-3 bg-white">
                                <p className="text-sm font-bold text-gray-900">{n.name}</p>
                                <p className="text-sm text-gray-700 whitespace-pre-wrap mt-0.5">{n.notes}</p>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ) : null}

                  {/* Transport details are merged into the Employees block for a cleaner single-column layout. */}

                  {!hasNotes && employees.length === 0 ? (
                    <p className="text-sm text-gray-600">No details available.</p>
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
