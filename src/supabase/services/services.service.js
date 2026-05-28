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
    features: row.features ?? [],
  };
}

function sortServices(services) {
  // Sort by category first, then by price (descending)
  return [...services].sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return b.priceEur - a.priceEur;
  });
}

export async function getServices() {
  // B2B demo/MVP: use local seed data only (no Supabase dependency).
  return sortServices(SERVICES_SEED.filter((s) => s.isActive).map(normalizeService));
}
