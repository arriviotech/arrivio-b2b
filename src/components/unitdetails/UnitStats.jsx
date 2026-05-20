import React from 'react';
import { MapPin, Layers, Ruler, DoorOpen, Users } from 'lucide-react';

const UnitStats = ({ property, formattedTitle, unit }) => {
  const unitTypeLabels = {
    studio: 'Studio',
    one_bedroom: '1 Bedroom',
    two_bedroom: '2 Bedrooms',
    shared_room: 'Shared Room',
  };

  const stats = [
    unit?.floor !== null && unit?.floor !== undefined && {
      icon: <Layers size={20} className="text-[#9ca3af]" />,
      label: "Floor",
      value: `${unit.floor}${unit.floor === 1 ? 'st' : unit.floor === 2 ? 'nd' : unit.floor === 3 ? 'rd' : 'th'} Floor`
    },
    unit?.size_sqm && {
      icon: <Ruler size={20} className="text-[#9ca3af]" />,
      label: "Size",
      value: `${unit.size_sqm} m²`
    },
    unit?.unit_type && {
      icon: <DoorOpen size={20} className="text-[#9ca3af]" />,
      label: "Type",
      value: unitTypeLabels[unit.unit_type] || unit.unit_type?.replace(/_/g, ' ')
    },
    unit?.max_occupants && {
      icon: <Users size={20} className="text-[#9ca3af]" />,
      label: "Occupants",
      value: `${unit.max_occupants} ${unit.max_occupants === 1 ? 'person' : 'people'}`
    },
  ].filter(Boolean);

  return (
    <div className="flex flex-col gap-6 pb-2">
      {/* Title & Location */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-[#111827] leading-tight tracking-tight">
            {formattedTitle}
          </h1>
          {unit?.tier && unit.tier !== 'standard' && (
            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
              unit.tier === 'premium' ? 'bg-gradient-to-r from-[#B8860B] to-[#DAA520] text-white' : 'bg-[#0f4c3a] text-white'
            }`}>
              {unit.tier}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-[#4b5563]">
          <MapPin size={16} className="text-[#6b7280]" />
          <span className="text-[14px] font-medium">
            {property.neighborhood || property.district}, {property.city}
          </span>
          <span className="text-[#d1d5db]">·</span>
          <span className="text-[14px] text-[#6b7280]">{property.name}</span>
        </div>
      </div>

      {/* Stats Bar */}
      {stats.length > 0 && (
        <div className="border-t border-[#f2f2f2] pt-6">
          <div className="flex flex-nowrap items-center overflow-x-auto no-scrollbar gap-0">
            {stats.map((stat, index) => (
              <React.Fragment key={stat.label}>
                <div className="flex items-center gap-3 pr-8 min-w-max">
                  {stat.icon}
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9ca3af] leading-none">
                      {stat.label}
                    </span>
                    <span className="text-[15px] font-bold text-[#111827] leading-tight">
                      {stat.value}
                    </span>
                  </div>
                </div>
                {index < stats.length - 1 && (
                  <div className="w-px h-8 bg-[#f2f2f2] mr-8 flex-shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UnitStats;
