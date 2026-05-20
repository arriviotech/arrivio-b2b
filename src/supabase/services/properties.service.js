import { supabase } from "../client";

/**
 * Normalize DB response → B2B frontend shape
 * Adapted from B2C normalizer with B2B-specific adjustments:
 * - Uses b2b tenant_type pricing when available
 * - Computes unit breakdown by type (for B2B property cards)
 * - Replaces rating/reviews with available unit count
 */
export function normalizeProperty(data) {
  const units = data.units || [];
  const photos = data.property_photos || [];

  // Find cheapest monthly rent — prefer b2b pricing, fallback to any
  const allPricing = units.flatMap((unit) =>
    (unit.unit_pricing_rules || []).map((p) => ({
      tenantType: p.tenant_type,
      cents: p.monthly_rent_cents,
    }))
  );
  const b2bPricing = allPricing.filter((p) => p.tenantType === 'b2b');
  const pricingPool = b2bPricing.length > 0 ? b2bPricing : allPricing;
  const cheapestRentCents = pricingPool.length > 0
    ? Math.min(...pricingPool.map((p) => p.cents))
    : 0;

  // Cover image = primary photo, or first photo
  const sortedPhotos = [...photos].sort((a, b) => a.display_order - b.display_order);
  const primaryPhoto = sortedPhotos.find((p) => p.is_primary) || sortedPhotos[0];
  const coverImage = primaryPhoto?.storage_path || null;

  // All gallery images
  const gallery = sortedPhotos.map((p) => ({
    url: p.storage_path,
    alt: p.alt_text,
    caption: p.caption,
    isPrimary: p.is_primary,
  }));

  // Unit breakdown by type (for B2B property cards)
  const breakdown = {
    studio: units.filter((u) => u.unit_type === 'studio').length,
    one_bedroom: units.filter((u) => u.unit_type === 'one_bedroom').length,
    two_bedroom: units.filter((u) => u.unit_type === 'two_bedroom').length,
    shared_room: units.filter((u) => u.unit_type === 'shared_room').length,
  };

  // Aggregate amenities across all units → { category: [name, ...] }
  const amenities = (() => {
    const amenityMap = {};
    const seen = new Set();
    units.forEach((unit) => {
      (unit.unit_amenities || []).forEach((ua) => {
        const a = ua.amenity_catalogue;
        if (!a || seen.has(a.name)) return;
        seen.add(a.name);
        const cat = a.category || 'other';
        if (!amenityMap[cat]) amenityMap[cat] = [];
        amenityMap[cat].push(a.name);
      });
    });
    return Object.keys(amenityMap).length > 0 ? amenityMap : null;
  })();

  // Flat amenity list (for simple display)
  const amenityList = amenities
    ? Object.values(amenities).flat()
    : [];

  return {
    // Pass through all raw DB fields
    ...data,

    // Mapped fields for B2B components
    title: data.name,
    neighborhood: data.district || '',
    location: data.district ? `${data.district}, ${data.city}` : data.city,
    lat: data.latitude ? Number(data.latitude) : null,
    lng: data.longitude ? Number(data.longitude) : null,

    // Pricing (cents → euros)
    price: cheapestRentCents / 100,

    // Images
    image: coverImage,
    cover_image: coverImage,
    gallery,

    // Unit summary
    totalUnits: units.length,
    availableUnits: units.filter((u) => u.status === 'available').length,
    breakdown,

    // Amenities
    amenities: amenityList,
    amenitiesByCategory: amenities,

    // Address
    address: [data.address_line1, data.district, data.city].filter(Boolean).join(', '),

    // Property type
    category: data.property_type?.replace(/_/g, ' '),

    // Furnishing
    furnishing: units.some((u) => u.is_furnished === false) ? 'unfurnished' : 'furnished',

    // Details for stats display
    details: (() => {
      if (units.length === 0) return null;
      const sizes = units.map((u) => Number(u.size_sqm)).filter(Boolean);
      const floors = units.map((u) => u.floor).filter((f) => f !== null && f !== undefined);
      return {
        size: sizes.length ? (Math.min(...sizes) === Math.max(...sizes) ? Math.min(...sizes) : `${Math.min(...sizes)}–${Math.max(...sizes)}`) : null,
        floor: floors.length ? (Math.min(...floors) === Math.max(...floors) ? Math.min(...floors) : `${Math.min(...floors)}–${Math.max(...floors)}`) : null,
        unitTypes: [...new Set(units.map((u) => u.unit_type?.replace(/_/g, ' ')))],
        totalUnits: units.length,
      };
    })(),
  };
}

/* =========================================================
   GET ALL PROPERTIES (with photos, units, pricing, amenities)
========================================================= */
export async function getProperties() {
  const { data, error } = await supabase
    .from("properties")
    .select(`
      *,
      property_photos (
        id,
        storage_path,
        alt_text,
        caption,
        is_primary,
        display_order,
        unit_id
      ),
      units (
        id,
        slug,
        unit_number,
        unit_type,
        tier,
        floor,
        size_sqm,
        max_occupants,
        is_furnished,
        status,
        available_for,
        unit_pricing_rules (
          tenant_type,
          monthly_rent_cents,
          security_deposit_cents,
          holding_deposit_cents,
          min_stay_months,
          max_stay_months,
          discount_pct
        ),
        unit_amenities (
          amenity_catalogue (
            name,
            icon_key,
            category
          )
        )
      )
    `)
    .eq("status", "active")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error fetching properties:", error);
    throw error;
  }

  return (data || []).map(normalizeProperty);
}

/* =========================================================
   GET SINGLE PROPERTY BY SLUG
========================================================= */
export async function getPropertyBySlug(slug) {
  const { data, error } = await supabase
    .from("properties")
    .select(`
      *,
      property_photos (
        id,
        storage_path,
        alt_text,
        caption,
        is_primary,
        display_order,
        unit_id
      ),
      units (
        id,
        slug,
        unit_number,
        unit_type,
        tier,
        floor,
        size_sqm,
        max_occupants,
        is_furnished,
        status,
        available_for,
        description,
        unit_pricing_rules (
          tenant_type,
          monthly_rent_cents,
          security_deposit_cents,
          holding_deposit_cents,
          min_stay_months,
          max_stay_months,
          discount_pct
        ),
        unit_amenities (
          amenity_catalogue (
            name,
            icon_key,
            category
          )
        )
      )
    `)
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching property:", error);
    throw error;
  }

  return normalizeProperty(data);
}
