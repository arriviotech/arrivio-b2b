import { supabase } from "../client";
import img1 from "../../data/properties/1.jpg";
import img2 from "../../data/properties/2.jpg";
import img3 from "../../data/properties/3.jpg";
import img4 from "../../data/properties/4.jpg";
import img5 from "../../data/properties/5.jpg";
import img6 from "../../data/properties/6.jpg";
import img7 from "../../data/properties/7.jpg";
import img8 from "../../data/properties/8.jpg";
import img9 from "../../data/properties/9.jpg";
import img10 from "../../data/properties/10.jpg";
import img11 from "../../data/properties/11.jpg";
import img12 from "../../data/properties/12.jpg";
import img13 from "../../data/properties/13.jpg";
import img14 from "../../data/properties/14.jpg";
import img15 from "../../data/properties/15.jpg";
import img16 from "../../data/properties/16.jpg";
import img17 from "../../data/properties/17.jpg";
import img18 from "../../data/properties/18.jpg";
import img19 from "../../data/properties/19.jpg";
import img20 from "../../data/properties/20.jpg";
import img21 from "../../data/properties/21.jpg";
import img22 from "../../data/properties/22.jpg";
import img23 from "../../data/properties/23.jpg";
import img24 from "../../data/properties/24.jpg";

const PREMIUM_IMAGES = [
  img1, img2, img3, img4, img5, img6, img7, img8, img9, img10,
  img11, img12, img13, img14, img15, img16, img17, img18, img19, img20,
  img21, img22, img23, img24
];

function getNumericId(id) {
  if (typeof id === 'number') return id;
  if (typeof id === 'string') {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  }
  return 0;
}

/**
 * Normalize DB response → B2B frontend shape
 * Adapted from B2C normalizer with B2B-specific adjustments:
 * - Uses b2b tenant_type pricing when available
 * - Computes unit breakdown by type (for B2B property cards)
 * - Replaces rating/reviews with available unit count
 */
export function normalizeProperty(data) {
  const EXCLUDED_AMENITIES = new Set([
    'single bed',
    'double bed',
    'sofa',
    'wardrobe',
    'desk',
    'dining table',
    'bookshelf',
    'bed',
    'chair',
    'table'
  ]);

  // Keep only 'shared_room' and 'one_bedroom' units, and filter out furniture from unit_amenities
  const units = (data.units || [])
    .filter((u) => u.unit_type === 'shared_room' || u.unit_type === 'one_bedroom')
    .map((u) => ({
      ...u,
      unit_amenities: (u.unit_amenities || []).filter(
        (ua) => !ua.amenity_catalogue || !EXCLUDED_AMENITIES.has(ua.amenity_catalogue.name.toLowerCase())
      )
    }));
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

  // Dynamically map premium images based on property ID
  const baseIndex = getNumericId(data.id);
  const numGalleryImages = 5;
  const assignedImages = [];
  for (let i = 0; i < numGalleryImages; i++) {
    const imgIndex = (baseIndex + i) % PREMIUM_IMAGES.length;
    assignedImages.push(PREMIUM_IMAGES[imgIndex]);
  }
  const coverImage = assignedImages[0];
  const gallery = assignedImages.map((img, idx) => ({
    url: img,
    alt: `${data.name || 'Property'} Photo ${idx + 1}`,
    caption: idx === 0 ? "Primary Photo" : `Gallery Photo ${idx}`,
    isPrimary: idx === 0,
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
    units,

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
