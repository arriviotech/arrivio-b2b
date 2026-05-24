import { SERVICES_SEED } from "../../data/servicesData";

function normalizeService(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    detailedDescription: row.detailedDescription ?? row.detailed_description ?? "",
    category: row.category,
    priceEur:
      typeof row.priceEur === "number"
        ? row.priceEur
        : (typeof row.price_eur === "number" ? row.price_eur : Number(row.price_eur ?? 0)),
    iconKey: row.iconKey ?? row.icon_key ?? null,
    isActive: row.isActive ?? row.is_active ?? true,
    createdAt: row.createdAt ?? row.created_at ?? null,
  };
}

const SERVICE_ORDER = [
  "Airport Pickup",
  "Airport Drop-off",
  "Housing Support",
  "Bank Account Setup",
  "Insurance Setup",
  "SIM Card Setup",
  "Anmeldung Support",
  "Tax ID Support",
  "City Integration Guide",
];

function sortServices(services) {
  const rank = new Map(SERVICE_ORDER.map((name, idx) => [name, idx]));
  return [...services].sort((a, b) => {
    const ra = rank.has(a.name) ? rank.get(a.name) : 999;
    const rb = rank.has(b.name) ? rank.get(b.name) : 999;
    if (ra !== rb) return ra - rb;
    return a.name.localeCompare(b.name);
  });
}

export async function getServices() {
  // B2B demo/MVP: use local seed data only (no Supabase dependency).
  return sortServices(SERVICES_SEED.filter((s) => s.isActive).map(normalizeService));
}
