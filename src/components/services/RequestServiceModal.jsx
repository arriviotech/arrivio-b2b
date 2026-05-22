import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, Minus, Plus, Check, Search, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { MOCK_EMPLOYEES } from "../../data/mockEmployees";

function formatArriving(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function EmployeeMultiSelect({
  selectedIds,
  onChange,
  portalContainer,
  scrollContainer,
  onOpenChange,
  closeSignal,
  onConfirmSelection,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const anchorRef = useRef(null);
  const [dropdownStyle, setDropdownStyle] = useState(null);

  const setOpenSafe = (next) => {
    setOpen(next);
    onOpenChange?.(next);
  };

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  useEffect(() => {
    if (closeSignal === undefined) return;
    setOpenSafe(false);
  }, [closeSignal]);

  useLayoutEffect(() => {
    if (!open) return;
    if (!portalContainer) return;
    if (!anchorRef.current) return;

    const compute = () => {
      const containerRect = portalContainer.getBoundingClientRect();
      const buttonRect = anchorRef.current.getBoundingClientRect();

      const left = Math.max(16, buttonRect.left - containerRect.left);
      const top = Math.max(16, buttonRect.bottom - containerRect.top + 8);
      const width = Math.min(containerRect.width - 32, buttonRect.width);

      setDropdownStyle({
        position: "absolute",
        left,
        top,
        width,
      });
    };

    compute();
    window.addEventListener("resize", compute);
    scrollContainer?.addEventListener?.("scroll", compute, { passive: true });

    return () => {
      window.removeEventListener("resize", compute);
      scrollContainer?.removeEventListener?.("scroll", compute);
    };
  }, [open, portalContainer, scrollContainer, query, selectedIds.length]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOCK_EMPLOYEES;
    return MOCK_EMPLOYEES.filter((e) =>
      `${e.name} ${e.role}`.toLowerCase().includes(q)
    );
  }, [query]);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const toggle = (id) => {
    const next = new Set(selectedSet);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange(Array.from(next));
  };

  return (
    <div className="relative">
      <div
        ref={anchorRef}
        className={`w-full h-12 px-3 bg-white border rounded-xl flex items-center gap-2 transition-colors ${open ? "border-[#1e6f50]" : "border-gray-200 hover:border-[#1e6f50]"}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <Search className="w-4 h-4 text-gray-400 shrink-0" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!open) setOpenSafe(true);
          }}
          onFocus={() => setOpenSafe(true)}
          placeholder="Search employees..."
          className="flex-1 min-w-0 h-10 bg-transparent text-sm font-semibold text-gray-900 placeholder:text-gray-300 focus:outline-none"
        />

        {selectedIds.length > 0 ? (
          <span className="shrink-0 inline-flex items-center justify-center min-w-7 h-7 px-2 rounded-full bg-gray-50 border border-gray-200 text-xs font-extrabold text-gray-700">
            {selectedIds.length}
          </span>
        ) : null}

        <button
          type="button"
          onClick={() => {
            if (selectedIds.length === 0) return;
            onConfirmSelection?.();
            setOpenSafe(false);
          }}
          className={`shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${selectedIds.length === 0
            ? "border-gray-200 text-gray-300 cursor-not-allowed"
            : "border-[#0a1a12] bg-[#0a1a12] text-white hover:bg-black"
            }`}
          aria-label="Confirm selected employees"
          disabled={selectedIds.length === 0}
        >
          <CheckCircle2 className="w-4 h-4" />
        </button>
      </div>

      {open ? (portalContainer ? createPortal(
        <div
          className="z-[140] bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden pointer-events-auto"
          style={dropdownStyle || undefined}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="max-h-72 overflow-auto">
            {filtered.map((emp) => {
              const checked = selectedSet.has(emp.id);
              return (
                <button
                  key={emp.id}
                  type="button"
                  onClick={() => toggle(emp.id)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-start justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{emp.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      {emp.role} · Arriving {formatArriving(emp.arrivingOn)}
                    </p>
                  </div>
                  <div className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 ${checked ? "bg-[#0a1a12] border-[#0a1a12] text-white" : "border-gray-200 text-transparent"}`}>
                    <Check className="w-4 h-4" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>,
        portalContainer
      ) : (
        <div className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
          <div className="max-h-72 overflow-auto">
            {filtered.map((emp) => {
              const checked = selectedSet.has(emp.id);
              return (
                <button
                  key={emp.id}
                  type="button"
                  onClick={() => toggle(emp.id)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-start justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{emp.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      {emp.role} Â· Arriving {formatArriving(emp.arrivingOn)}
                    </p>
                  </div>
                  <div className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 ${checked ? "bg-[#0a1a12] border-[#0a1a12] text-white" : "border-gray-200 text-transparent"}`}>
                    <Check className="w-4 h-4" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )) : null}
    </div>
  );
}

export default function RequestServiceModal({ isOpen, service, onClose, onConfirm }) {
  const [quantity, setQuantity] = useState(1);
  const [specialRequests, setSpecialRequests] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [recipientType, setRecipientType] = useState("all"); // 'all' | 'specific'
  const [employeeIds, setEmployeeIds] = useState([]);
  const [customByEmployee, setCustomByEmployee] = useState({});
  const [openAccordions, setOpenAccordions] = useState({});
  const [employeesConfirmed, setEmployeesConfirmed] = useState(false);
  const [employeePickerOpen, setEmployeePickerOpen] = useState(false);
  const [employeePickerCloseSignal, setEmployeePickerCloseSignal] = useState(0);
  const modalRef = useRef(null);
  const [portalEl, setPortalEl] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setPortalEl(null);
      return;
    }
    setPortalEl(modalRef.current);
  }, [isOpen]);

  const price = useMemo(() => Number(service?.priceEur || 0), [service]);
  const employeeCount = MOCK_EMPLOYEES.length;

  const selectedEmployees = useMemo(() => {
    const byId = new Map(MOCK_EMPLOYEES.map((e) => [e.id, e]));
    return employeeIds.map((id) => byId.get(id)).filter(Boolean);
  }, [employeeIds]);

  const showCustom = recipientType === "specific" && employeeIds.length > 1;
  const isTransport = service?.category === "transport";

  if (!isOpen || !service) return null;

  const dec = () => setQuantity((q) => Math.max(1, q - 1));
  const inc = () => setQuantity((q) => Math.min(99, q + 1));

  const handleClose = () => {
    if (submitting) return;
    setQuantity(1);
    setSpecialRequests("");
    setSubmitError("");
    setRecipientType("all");
    setEmployeeIds([]);
    setCustomByEmployee({});
    setOpenAccordions({});
    setEmployeesConfirmed(false);
    setEmployeePickerOpen(false);
    onClose?.();
  };

  const handleConfirm = async () => {
    if (recipientType === "specific" && (employeeIds.length === 0 || !employeesConfirmed)) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      await onConfirm?.({
        service,
        quantity,
        specialRequests,
        recipientType,
        employeeIds,
        customFields: customByEmployee,
      });
      handleClose();
    } catch (err) {
      console.error("Failed to create service order:", err);
      setSubmitError("Could not place the request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
        <div
        ref={modalRef}
        className="relative bg-white w-full max-w-[520px] rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{service.name}</h2>
            <p className="text-sm text-gray-500 mt-0.5">€{price.toFixed(0)}</p>
            {service.description ? (
              <p className="text-sm text-gray-600 mt-2 max-w-[440px]">
                {service.description}
              </p>
            ) : null}
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div ref={scrollRef} className="p-6 space-y-5 overflow-y-auto flex-1 min-h-0">
          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Who is this service for?</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRecipientType("all")}
                className={`p-4 rounded-2xl border text-left transition-colors ${recipientType === "all"
                  ? "border-[#0a1a12] bg-[#0a1a12]/5"
                  : "border-gray-200 hover:border-[#1e6f50]"
                  }`}
              >
                <p className="text-sm font-bold text-gray-900">All Employees</p>
                <p className="text-xs text-gray-500 mt-1">
                  {employeeCount} employees will receive this service.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setRecipientType("specific")}
                className={`p-4 rounded-2xl border text-left transition-colors ${recipientType === "specific"
                  ? "border-[#0a1a12] bg-[#0a1a12]/5"
                  : "border-gray-200 hover:border-[#1e6f50]"
                  }`}
              >
                <p className="text-sm font-bold text-gray-900">Select Specific Employees</p>
                <p className="text-xs text-gray-500 mt-1">
                  Choose one or more employees for this request.
                </p>
              </button>
            </div>

            {recipientType === "specific" ? (
              <div className="pt-2">
                <EmployeeMultiSelect
                  selectedIds={employeeIds}
                  onChange={(ids) => {
                    setEmployeeIds(ids);
                    setEmployeesConfirmed(false);
                  }}
                  portalContainer={portalEl}
                  scrollContainer={scrollRef.current}
                  onOpenChange={setEmployeePickerOpen}
                  closeSignal={employeePickerCloseSignal}
                  onConfirmSelection={() => {
                    setEmployeesConfirmed(true);
                    setEmployeePickerOpen(false);
                    setEmployeePickerCloseSignal((v) => v + 1);
                  }}
                />
                {employeeIds.length === 0 ? (
                  <p className="text-xs text-amber-700 mt-2">Select at least one employee.</p>
                ) : null}
              </div>
            ) : null}
          </div>



          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Special requests</p>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Any special requests? (optional)"
              className="w-full min-h-[96px] px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e6f50]/20 focus:border-[#1e6f50] transition-all placeholder:text-gray-300 font-medium resize-none"
              disabled={submitting}
            />
          </div>

          {submitError ? (
            <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm font-semibold">
              {submitError}
            </div>
          ) : null}

          {showCustom ? (
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Per-employee details</p>
              <div className="space-y-3">
                {selectedEmployees.map((emp) => {
                  const isOpenAcc = Boolean(openAccordions[emp.id]);
                  const entry = customByEmployee[emp.id] || {};
                  return (
                    <div key={emp.id} className="border border-gray-200 rounded-2xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setOpenAccordions((m) => ({ ...m, [emp.id]: !isOpenAcc }))}
                        className="w-full px-4 py-3 bg-gray-50/60 hover:bg-gray-50 transition-colors flex items-center justify-between"
                      >
                        <div className="text-left min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{emp.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5 truncate">
                            {emp.role} · Arriving {formatArriving(emp.arrivingOn)}
                          </p>
                        </div>
                        {isOpenAcc ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                      </button>

                      {isOpenAcc ? (
                        <div className="p-4 space-y-3 bg-white">
                          {isTransport ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Pickup time</p>
                                <input
                                  type="time"
                                  value={entry.pickupTime || ""}
                                  onChange={(e) =>
                                    setCustomByEmployee((m) => ({
                                      ...m,
                                      [emp.id]: { ...entry, pickupTime: e.target.value },
                                    }))
                                  }
                                  className="w-full h-11 px-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e6f50]/20 focus:border-[#1e6f50] transition-all font-medium"
                                />
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Flight / reference</p>
                                <input
                                  value={entry.reference || ""}
                                  onChange={(e) =>
                                    setCustomByEmployee((m) => ({
                                      ...m,
                                      [emp.id]: { ...entry, reference: e.target.value },
                                    }))
                                  }
                                  placeholder="e.g. LH1234"
                                  className="w-full h-11 px-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e6f50]/20 focus:border-[#1e6f50] transition-all placeholder:text-gray-300 font-medium"
                                />
                              </div>
                            </div>
                          ) : null}

                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Notes</p>
                            <textarea
                              value={entry.notes || ""}
                              onChange={(e) =>
                                setCustomByEmployee((m) => ({
                                  ...m,
                                  [emp.id]: { ...entry, notes: e.target.value },
                                }))
                              }
                              placeholder="Any per-employee details..."
                              className="w-full min-h-[84px] px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e6f50]/20 focus:border-[#1e6f50] transition-all placeholder:text-gray-300 font-medium resize-none"
                            />
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>

        <div className="p-5 border-t border-gray-100 flex items-center justify-between gap-3">
          <button
            onClick={handleClose}
            className="h-11 px-4 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors w-full"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="h-11 px-4 rounded-xl bg-[#0a1a12] text-white font-bold hover:bg-black transition-colors w-full disabled:opacity-60"
            disabled={submitting || (recipientType === "specific" && (employeeIds.length === 0 || !employeesConfirmed))}
          >
            {submitting ? "Confirming..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
