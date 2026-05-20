import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowRight } from 'lucide-react';

const SharedSection = ({ property, sharedOptions = [] }) => {
  const navigate = useNavigate();
  const slug = property.slug || property.id;

  return (
    <div className="space-y-5">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#0f4c3a]/5 flex items-center justify-center">
          <Users className="text-[#0f4c3a]" size={20} />
        </div>
        <div>
          <h2 className="text-xl font-heading font-bold text-[#111827]">Apartments & Shared Rooms</h2>
          <p className="text-[12px] text-[#9ca3af]">Select a unit type to view details and pricing</p>
        </div>
      </div>

      {/* Type groups */}
      {sharedOptions.map((option, index) => {
        const optionUnits = option.units || [];

        return (
          <div key={index} className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] overflow-hidden">
            {/* Group header — colored left border */}
            <div className="flex items-center justify-between p-5 border-l-4 border-l-[#0f4c3a] bg-[#f7f7f7]/50">
              <div>
                <h3 className="text-[16px] font-heading font-semibold text-[#111827]">{option.title}</h3>
                <p className="text-[12px] text-[#6b7280] mt-0.5">{option.description}</p>
              </div>
              <div className="text-right shrink-0 ml-4">
                <span className="text-[10px] text-[#9ca3af] font-medium">from </span>
                <span className="font-bold text-lg text-[#111827]">€{option.price?.toLocaleString()}</span>
                <span className="text-[#9ca3af] text-[12px]"> /mo</span>
              </div>
            </div>

            {/* Units table */}
            {optionUnits.length > 0 && (
              <div>
                {/* Table header */}
                <div className="flex items-center px-5 py-2 bg-[#f7f7f7] text-[10px] font-bold uppercase tracking-widest text-[#9ca3af] border-t border-[#e5e7eb]">
                  <span className="flex-1">Unit</span>
                  <span className="w-20 text-center hidden sm:block">Size</span>
                  <span className="w-16 text-center hidden sm:block">Floor</span>
                  <span className="w-16 text-center">Status</span>
                  <span className="w-8"></span>
                </div>

                {/* Unit rows */}
                {optionUnits.map((unit, i) => {
                  const pricing = unit.unit_pricing_rules || [];
                  const b2b = pricing.find(p => p.tenant_type === 'b2b');
                  const cheapest = pricing.length > 0
                    ? pricing.reduce((min, p) => p.monthly_rent_cents < min.monthly_rent_cents ? p : min, pricing[0])
                    : null;
                  const activePricing = b2b || cheapest;
                  const price = activePricing ? activePricing.monthly_rent_cents / 100 : option.price || 0;
                  const isAvailable = unit.status === 'available';

                  return (
                    <div
                      key={unit.id}
                      className={`flex items-center px-5 py-3.5 border-t border-[#f2f2f2] hover:bg-[#0f4c3a]/[0.02] transition-colors cursor-pointer group ${
                        i % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'
                      }`}
                      onClick={() => navigate(`/property/${slug}/unit/${unit.id}`)}
                    >
                      {/* Unit name + tier */}
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-[13px] font-semibold text-[#111827]">
                          {unit.unit_number}
                        </span>
                        {unit.tier && unit.tier !== 'standard' && (
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                            unit.tier === 'premium' ? 'bg-gradient-to-r from-[#B8860B] to-[#DAA520] text-white' : 'bg-[#0f4c3a] text-white'
                          }`}>
                            {unit.tier}
                          </span>
                        )}
                      </div>

                      {/* Size */}
                      <span className="w-20 text-center text-[12px] text-[#6b7280] hidden sm:block">
                        {unit.size_sqm ? `${unit.size_sqm} m²` : '–'}
                      </span>

                      {/* Floor */}
                      <span className="w-16 text-center text-[12px] text-[#6b7280] hidden sm:block">
                        {unit.floor !== null && unit.floor !== undefined ? unit.floor : '–'}
                      </span>

                      {/* Status */}
                      <span className="w-16 flex justify-center">
                        {isAvailable ? (
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-[#EA4335]"></span>
                          </span>
                        )}
                      </span>

                      {/* Arrow */}
                      <span className="w-8 flex justify-end">
                        <ArrowRight size={14} className="text-[#d1d5db] group-hover:text-[#0f4c3a] group-hover:translate-x-0.5 transition-all" />
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SharedSection;
