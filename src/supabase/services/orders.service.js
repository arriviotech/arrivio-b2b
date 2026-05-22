import { MOCK_EMPLOYEES } from "../../data/mockEmployees";

const STORAGE_KEY = "arrivio_service_orders_v1";
let memoryOrders = [];

function generateLocalId() {
  const c = globalThis?.crypto;
  if (c && typeof c.randomUUID === "function") return `local-${c.randomUUID()}`;
  return `local-${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`;
}

function readLocalOrders() {
  try {
    if (typeof localStorage === "undefined") return memoryOrders;
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return memoryOrders;
  }
}

function writeLocalOrders(orders) {
  memoryOrders = Array.isArray(orders) ? orders : [];
  try {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryOrders));
  } catch {
    // ignore: fall back to in-memory orders
  }
}

function normalizeOrder(row) {
  return {
    id: row.id,
    serviceId: row.service_id,
    serviceName: row.service_name ?? null,
    employeeId: row.employee_id ?? row.employeeId ?? null,
    employeeName: row.employee_name ?? row.employeeName ?? null,
    quantity: row.quantity ?? 1,
    specialRequests: row.special_requests ?? "",
    status: row.status ?? "pending",
    orderedAt: row.ordered_at ?? row.created_at ?? null,
    priceEur: row.price_eur ?? null,
    customFields: row.custom_fields ?? row.customFields ?? null,
  };
}

export async function createServiceOrder({
  service,
  quantity,
  specialRequests,
  recipientType = "all",
  employeeIds = [],
  customFields = {},
}) {
  const employeePool =
    recipientType === "all"
      ? MOCK_EMPLOYEES
      : MOCK_EMPLOYEES.filter((e) => employeeIds.includes(e.id));

  // B2B demo/MVP: store orders locally (no Supabase dependency).
  const orders = readLocalOrders();
  const now = new Date().toISOString();
  const newOrders = employeePool.map((emp) => ({
    id: generateLocalId(),
    serviceId: service.id,
    serviceName: service.name,
    employeeId: emp.id,
    employeeName: emp.name,
    quantity,
    specialRequests: specialRequests || "",
    customFields: customFields?.[emp.id] ?? null,
    status: "pending",
    orderedAt: now,
    priceEur: service.priceEur,
  }));
  const next = [...newOrders, ...orders];
  writeLocalOrders(next);
  return newOrders;
}

export async function getServiceOrders({ status } = {}) {
  const orders = readLocalOrders();
  return status && status !== "all"
    ? orders.filter((o) => o.status === status)
    : orders;
}

export async function updateServiceOrderStatus({ id, status }) {
  const orders = readLocalOrders();
  const next = orders.map((o) => (o.id === id ? { ...o, status } : o));
  writeLocalOrders(next);
  const updated = next.find((o) => o.id === id);
  return updated ?? null;
}

export async function updateServiceOrderStatusBulk({ ids, status }) {
  const set = new Set(ids || []);
  if (set.size === 0) return [];
  const orders = readLocalOrders();
  const next = orders.map((o) => (set.has(o.id) ? { ...o, status } : o));
  writeLocalOrders(next);
  return next.filter((o) => set.has(o.id));
}
