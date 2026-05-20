import React from 'react';

const Amenities = ({ isStudio, property, formattedTitle, unit }) => {
  // Get amenities from unit or property
  const unitAmenities = unit?.unit_amenities || [];
  const propertyAmenities = property?.amenitiesByCategory || null;

  // Group unit amenities by category
  const grouped = {};
  unitAmenities.forEach(ua => {
    const a = ua.amenity_catalogue;
    if (!a) return;
    const cat = a.category || 'other';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(a.name);
  });

  // If unit has no amenities, fall back to property-level
  const amenityGroups = Object.keys(grouped).length > 0 ? grouped : propertyAmenities;
  const hasAmenities = amenityGroups && Object.keys(amenityGroups).length > 0;

  const categoryLabels = {
    connectivity: 'Connectivity',
    appliances: 'Appliances',
    furniture: 'Furniture',
    building: 'Building',
    services: 'Services',
    security: 'Security',
    other: 'Other',
  };

  return (
    <div className="flex flex-col gap-8 py-4">
      {/* About */}
      <div className="space-y-3">
        <h2 className="text-xl font-heading font-bold text-[#111827]">About this unit</h2>
        <p className="text-[14px] text-[#4b5563] leading-relaxed max-w-2xl">
          {unit?.description || `${isStudio ? 'A fully private studio' : formattedTitle} in ${property.name}. Fully furnished and move-in ready, designed for modern professionals relocating to ${property.city}.`}
        </p>
      </div>

      {/* Amenities */}
      {hasAmenities && (
        <div className="space-y-6">
          <h2 className="text-xl font-heading font-bold text-[#111827]">Amenities</h2>

          <div className="space-y-6">
            {Object.entries(amenityGroups).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4A017] mb-3">
                  {categoryLabels[category] || category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(items) ? items : []).map((name, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-2 rounded-xl bg-[#f7f7f7] border border-[#f2f2f2] text-[13px] font-medium text-[#374151] hover:bg-white hover:shadow-sm transition-all"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Furnished badge */}
      {unit?.is_furnished && (
        <div className="flex items-center gap-2 px-4 py-3 bg-[#0f4c3a]/5 rounded-xl border border-[#0f4c3a]/10">
          <span className="w-2 h-2 rounded-full bg-[#0f4c3a]"></span>
          <span className="text-[13px] font-semibold text-[#0f4c3a]">Fully furnished & move-in ready</span>
        </div>
      )}
    </div>
  );
};

export default Amenities;
