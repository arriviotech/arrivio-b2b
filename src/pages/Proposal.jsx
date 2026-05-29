import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import PropertiesNavbar from '../components/layout/PropertiesNavbar';
import Footer from '../components/layout/Footer';
import { useReservation } from '../context/ReservationContext';
import { ArrowLeft, Building2, Search, Receipt, Check, Minus, Plus, X, Home, BadgeInfo, ChevronDown } from 'lucide-react';
import { generateNativePDF } from '../components/proposal/Pdf';
import Summary from '../components/proposal/Summary';
import FeesAndInclusions from '../components/proposal/FeesAndInclusions';
import { useArixDesigner } from '../context/ArixDesignerContext';
import PropertyListWithDrawer from '../components/proposal/PropertyListWithDrawer';
import { supabase } from '../supabase/client';
import { toB2BUnitType } from '../utils/unitType';
import { ARIX_ENABLED } from '../App';
import { useServices } from '../supabase/hooks/useServices';
import { SERVICE_CATEGORIES } from '../data/servicesData';

// Reverse map: formatted display label → raw DB unit_type
// Used to look up availability for cart items added before unitTypeKey was stored.
const UNIT_TYPE_KEY_BY_LABEL = {
  'Studio': 'studio',
  'Single Room': 'one_bedroom',
  'Shared Room': 'shared_room',
};

const SectionHeader = ({ number, title, subtitle }) => (
  <div className="flex items-baseline gap-3 mb-5">
    <div className="w-8 h-8 rounded-full bg-[#0f4c3a]/10 text-[#0f4c3a] flex items-center justify-center text-sm font-bold flex-shrink-0">
      {number}
    </div>
    <div className="flex items-baseline gap-2 flex-wrap">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      {subtitle && <span className="text-xs text-gray-400 font-medium">{subtitle}</span>}
    </div>
  </div>
);

const StepIndicator = ({ current }) => {
  const steps = ['Browse', 'Review', 'Schedule'];
  return (
    <div className="flex items-center gap-3 mb-4 flex-wrap">
      {steps.map((step, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === current;
        const isPast = stepNum < current;
        return (
          <React.Fragment key={step}>
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                isActive ? 'bg-[#0f4c3a] text-white' : isPast ? 'bg-[#0f4c3a]/30 text-[#0f4c3a]' : 'bg-gray-200 text-gray-400'
              }`}>
                {stepNum}
              </div>
              <span className={`text-xs font-semibold uppercase tracking-widest ${
                isActive ? 'text-[#0f4c3a]' : 'text-gray-400'
              }`}>
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-8 h-px ${isPast ? 'bg-[#0f4c3a]/30' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const Proposal = () => {
  const navigate = useNavigate();
  const { reservations, removeReservation, updateQuantity } = useReservation();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [additionalNotes, setAdditionalNotes] = useState('');
  // { [serviceId]: quantity } — scalable services use the qty, toggle ones use 1.
  const [selectedServices, setSelectedServices] = useState({});

  // Pull services from the same source as the Dashboard Services page,
  // so prices and the full catalogue stay in sync automatically.
  const { services: rawServices, loading: servicesLoading } = useServices();
  const mappedServices = useMemo(() => {
    return (rawServices || []).map((s) => ({
      id: s.id,
      icon: Icons[s.iconKey] || Icons.Package,
      label: s.name,
      desc: s.description || '',
      category: s.category,
      scalable: true,
      priceEur: s.priceEur || 0,
      details: s.features || [],
    }));
  }, [rawServices]);

  const [serviceCategory, setServiceCategory] = useState('all');
  const filteredServices = useMemo(() => {
    if (serviceCategory === 'all') return mappedServices;
    return mappedServices.filter((s) => s.category === serviceCategory);
  }, [mappedServices, serviceCategory]);
  const [hoveredServiceId, setHoveredServiceId] = useState(null);

  const toggleService = (id) => {
    setSelectedServices((prev) => {
      if (prev[id]) {
        const { [id]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: 1 };
    });
  };

  const setServiceQty = (id, qty) => {
    if (qty <= 0) {
      setSelectedServices((prev) => {
        const { [id]: _removed, ...rest } = prev;
        return rest;
      });
      return;
    }
    setSelectedServices((prev) => ({ ...prev, [id]: qty }));
  };

  const selectedServiceCount = Object.keys(selectedServices).length;
  // Services are one-time charges. For scalable services qty = employee count;
  // for non-scalable qty is always 1.
  const servicesTotal = Object.entries(selectedServices).reduce((sum, [id, qty]) => {
    const svc = mappedServices.find((s) => s.id === id);
    if (!svc || !svc.priceEur) return sum;
    return sum + svc.priceEur * (svc.scalable ? qty : 1);
  }, 0);

  const propertiesData = reservations.reduce((acc, current) => {
    if (!acc[current.propertyId]) {
      acc[current.propertyId] = {
        id: current.propertyId,
        slug: current.propertySlug,
        name: current.propertyName,
        image: current.propertyImage,
        city: current.propertyCity,
        neighborhood: current.propertyNeighborhood,
        units: []
      };
    }
    acc[current.propertyId].units.push(current);
    return acc;
  }, {});

  const groupedProperties = Object.values(propertiesData);

  // Live availability + slug per propertyId — fetched from Supabase on mount.
  const [availabilityMap, setAvailabilityMap] = useState({});
  const [slugMap, setSlugMap] = useState({});

  useEffect(() => {
    const propertyIds = [...new Set(reservations.map(r => r.propertyId).filter(Boolean))];
    if (propertyIds.length === 0) return;

    (async () => {
      const [unitsRes, propsRes] = await Promise.all([
        supabase
          .from('units')
          .select('property_id, unit_type, status')
          .in('property_id', propertyIds)
          .eq('status', 'available'),
        supabase
          .from('properties')
          .select('id, slug')
          .in('id', propertyIds),
      ]);

      if (unitsRes.error) console.error('Failed to fetch live availability:', unitsRes.error);
      if (propsRes.error) console.error('Failed to fetch property slugs:', propsRes.error);

      const aMap = {};
      (unitsRes.data || []).forEach(u => {
        const key = `${u.property_id}:${toB2BUnitType(u.unit_type)}`;
        aMap[key] = (aMap[key] || 0) + 1;
      });
      setAvailabilityMap(aMap);

      const sMap = {};
      (propsRes.data || []).forEach(p => { sMap[p.id] = p.slug; });
      setSlugMap(sMap);
    })();
  }, [reservations.length]);

  // Hydrate reservations with live availability + slug so the +/− stepper caps
  // correctly and "View" navigates to the right property, even for items that
  // were in the cart before these fields were stored.
  const hydratedProperties = useMemo(() => {
    return groupedProperties.map(property => ({
      ...property,
      slug: slugMap[property.id] || property.slug,
      units: property.units.map(unit => {
        const typeKey = unit.unitTypeKey || UNIT_TYPE_KEY_BY_LABEL[unit.unitType];
        const liveMax = typeKey ? availabilityMap[`${property.id}:${typeKey}`] : undefined;
        return {
          ...unit,
          maxAvailable: liveMax !== undefined ? liveMax : unit.maxAvailable,
        };
      }),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reservations, availabilityMap, slugMap]);

  const cityCounts = useMemo(() => {
    const counts = {};
    reservations.forEach(r => {
      if (r.isService || r.propertyId === 'services') return;
      counts[r.propertyCity] = (counts[r.propertyCity] || 0) + r.quantity;
    });
    return Object.entries(counts);
  }, [reservations]);

  const estimatedMonthlyCost = useMemo(() => {
    return reservations.reduce((sum, r) => {
      if (r.isService || r.propertyId === 'services') return sum;
      return sum + (r.unitPrice || 0) * (r.quantity || 0);
    }, 0);
  }, [reservations]);

  const { getDesignForProperty, getSharedDesignForProperty } = useArixDesigner();

  // Sum furniture designs across all unit-type slots a property has.
  // Studio → state[`${id}_studio`], Single Room → state[`${id}_one_bedroom`],
  // Shared Room → state[`${id}_shared`] (via getSharedDesignForProperty).
  const slotForLabel = (label) => {
    if (label === 'Studio') return { slot: 'regular', key: 'studio' };
    if (label === 'Single Room') return { slot: 'regular', key: 'one_bedroom' };
    if (label === 'Shared Room') return { slot: 'shared', key: 'shared' };
    return null;
  };
  const designsForProperty = (prop) => {
    const labels = [...new Set((prop.units || []).map((u) => u.unitType).filter(Boolean))];
    return labels
      .map((label) => {
        const meta = slotForLabel(label);
        if (!meta) return null;
        const design =
          meta.slot === 'shared'
            ? getSharedDesignForProperty(prop.id)
            : getDesignForProperty(`${prop.id}_${meta.key}`);
        return { label, design };
      })
      .filter(Boolean);
  };

  const furnitureAddOnTotal = useMemo(() => {
    if (!ARIX_ENABLED) return 0;
    return groupedProperties.reduce((acc, prop) => {
      const slotDesigns = designsForProperty(prop);
      return acc + slotDesigns.reduce((s, sd) => s + (sd.design?.addOnTotal || 0), 0);
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupedProperties, getDesignForProperty, getSharedDesignForProperty]);

  const furnitureCount = useMemo(() => {
    if (!ARIX_ENABLED) return 0;
    return groupedProperties.reduce((acc, prop) => {
      const slotDesigns = designsForProperty(prop);
      return acc + slotDesigns.reduce((s, sd) => s + (sd.design?.selectedItems?.length || 0), 0);
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupedProperties, getDesignForProperty, getSharedDesignForProperty]);

  const estimatedMonthlyTotalWithAddons = estimatedMonthlyCost + furnitureAddOnTotal;

  const resolvedServices = Object.entries(selectedServices).map(([id, qty]) => {
    const svc = mappedServices.find((s) => s.id === id);
    return { id, label: svc?.label || id, qty, scalable: !!svc?.scalable };
  });

  // Furniture add-ons per property (from Arix Designer selections).
  // One entry per unit-type slot that actually has items selected.
  const resolvedFurniture = !ARIX_ENABLED
    ? []
    : groupedProperties.flatMap((prop) =>
        designsForProperty(prop)
          .map(({ label, design }) => ({
            propertyId: prop.id,
            propertyName: prop.name,
            unitLabel: label,
            items: (design?.selectedItems || []).map((it) => ({
              id: it.id,
              name: it.name,
              price: it.price || 0,
            })),
            total: design?.addOnTotal || 0,
          }))
          .filter((f) => f.items.length > 0),
      );

  const pdfPayload = {
    groupedProperties,
    services: resolvedServices,
    furniture: resolvedFurniture,
    additionalNotes,
    estimatedMonthlyCost,
    cityCounts,
  };

  const handleCheckout = async () => {
    if (reservations.length === 0) return;
    setIsProcessingCheckout(true);
    try {
      const blob = await generateNativePDF({ ...pdfPayload, asBlob: true });
      const formData = new FormData();
      formData.append('file', blob, `Arrivio_Proposal_${new Date().toISOString().slice(0, 10)}.pdf`);
      const res = await fetch('https://tmpfiles.org/api/v1/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.status === 'success') {
        const fileUrl = data.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
        const notesLine = additionalNotes.trim()
          ? `Additional notes from prospect:\n${additionalNotes.trim()}\n\n`
          : '';
        const servicesLine = selectedServiceCount > 0
          ? `Requested relocation services:\n${Object.entries(selectedServices).map(([id, qty]) => {
              const svc = mappedServices.find(s => s.id === id);
              return `• ${svc?.label}${svc?.scalable ? ` (x${qty})` : ''}`;
            }).join('\n')}\n\n`
          : '';
        const furnitureLine = resolvedFurniture.length > 0
          ? `Furniture add-on (Arix Designer):\n${resolvedFurniture.map(f =>
              `• ${f.propertyName} · ${f.unitLabel}: ${f.items.map(i => i.name).join(', ')} (+€${f.total}/mo)`
            ).join('\n')}\n\n`
          : '';
        const notes = `${notesLine}${servicesLine}${furnitureLine}Here is my requested housing proposal:\n${fileUrl}\n(Note: Link expires in 60 minutes)`;
        // Keep the reservation cart populated so the Schedule page sidebar can
        // surface the proposal context. User can clear the cart manually after
        // booking confirms.
        navigate('/schedule', { state: { bookingNotes: notes } });
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Checkout failed! Could not generate or upload proposal.');
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (groupedProperties.length === 0) return;
    setIsGeneratingPDF(true);
    try {
      await generateNativePDF(pdfPayload);
    } catch (error) {
      console.error('PDF Error:', error);
      alert('PDF generation failed: ' + error.message);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const hasItems = groupedProperties.length > 0;

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-background-neutral">
      <PropertiesNavbar />

      <main className="flex-grow pt-28 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[#0f4c3a] transition-colors mb-8 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back
          </button>

          {/* Header */}
          <div className="mb-10">
            {hasItems && <StepIndicator current={2} />}
            <h1 className="text-4xl md:text-5xl font-serif text-[#111827] font-medium mb-2">Your Proposal</h1>
            <p className="text-gray-500 text-base max-w-2xl">
              Review what you've selected. We'll bundle this into a quote and walk you through it on the call.
            </p>
          </div>

          {!hasItems ? (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-200">
                <div className="w-20 h-20 bg-[#f4f4f4] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building2 className="w-10 h-10 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">No units selected yet</h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">Browse our available properties to find the perfect accommodation for your team's needs.</p>
                <button
                  onClick={() => navigate('/properties')}
                  className="bg-[#0f4c3a] hover:bg-[#1A2E22] text-white px-8 py-3 rounded-xl font-bold transition-colors inline-block"
                >
                  Browse Properties
                </button>
              </div>
            </div>
          ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3 space-y-12 lg:pt-6">

              {/* Section 1: Properties */}
              {hasItems && (
                <section>
                  <SectionHeader
                    number="1"
                    title="Selected Properties"
                    subtitle={`${groupedProperties.length} ${groupedProperties.length === 1 ? 'property' : 'properties'}`}
                  />
                  <PropertyListWithDrawer
                    properties={hydratedProperties}
                    navigate={navigate}
                    updateQuantity={updateQuantity}
                    removeReservation={removeReservation}
                  />
                </section>
              )}

              {/* Section 2: Relocation Services */}
              {hasItems && (
                <section>
                  <SectionHeader number="3" title="Relocation Services" subtitle="(Optional)" />
                  <p className="text-sm text-gray-500 -mt-2 mb-4">
                    Add-ons our team can bundle with this proposal. Final pricing on the call.
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 bg-gray-100/40 border border-gray-200/50 p-1 rounded-2xl w-max max-w-full mb-4 shadow-inner">
                    {SERVICE_CATEGORIES.map((c) => {
                      const active = serviceCategory === c.key;
                      return (
                        <button
                          key={c.key}
                          onClick={() => setServiceCategory(c.key)}
                          className={`h-8 px-4 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer select-none active:scale-95 ${active
                            ? 'bg-[#0f4c3a] text-white shadow-sm'
                            : 'text-gray-500 hover:text-[#0f4c3a] hover:bg-[#0f4c3a]/5'
                            }`}
                        >
                          {c.label}
                        </button>
                      );
                    })}
                  </div>

                  {selectedServiceCount > 0 && (
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        <span className="font-bold text-[#0f4c3a]">{selectedServiceCount}</span>
                        {' '}{selectedServiceCount === 1 ? 'service' : 'services'} selected
                      </span>
                      <button
                        onClick={() => setSelectedServices({})}
                        className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors"
                      >
                        Clear all
                      </button>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {servicesLoading ? (
                      <div className="col-span-full py-8 text-sm text-gray-400 text-center">Loading services…</div>
                    ) : filteredServices.length === 0 ? (
                      <div className="col-span-full py-8 text-sm text-gray-400 text-center">No services in this category.</div>
                    ) : filteredServices.map(({ id, icon: Icon, label, desc, scalable, priceEur, details }) => {
                      const qty = selectedServices[id] || 0;
                      const isSelected = qty > 0;

                      const tileClass = isSelected
                        ? 'border-[#0f4c3a] bg-[#0f4c3a]/5 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-[#0f4c3a]/30 hover:shadow-sm cursor-pointer';

                      const handleTileClick = isSelected ? undefined : () => toggleService(id);

                      return (
                        <div
                          key={id}
                          onClick={handleTileClick}
                          className={`relative p-4 rounded-xl border transition-all ${tileClass}`}
                        >
                          {isSelected && (
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleService(id); }}
                              className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-white border border-gray-200 hover:border-red-200 hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-gray-400 transition-colors"
                              title="Remove"
                            >
                              <X size={12} />
                            </button>
                          )}

                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors ${
                            isSelected ? 'bg-[#0f4c3a] text-white' : 'bg-gray-50 text-[#0f4c3a] border border-gray-100'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <div className="text-sm font-bold text-gray-900 leading-tight">{label}</div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <div className="text-xs font-extrabold text-[#0f4c3a] bg-[#0f4c3a]/5 px-2 py-0.5 rounded-md whitespace-nowrap">
                                €{priceEur}
                              </div>
                              {details && details.length > 0 && (
                                <div
                                  className="relative inline-block"
                                  onMouseEnter={() => setHoveredServiceId(id)}
                                  onMouseLeave={() => setHoveredServiceId(null)}
                                >
                                  <BadgeInfo
                                    size={14}
                                    className="text-gray-400 hover:text-[#0f4c3a] transition-colors cursor-help shrink-0"
                                  />
                                  
                                  {hoveredServiceId === id && (
                                    <div className="absolute right-0 bottom-full mb-2.5 w-64 bg-white border border-gray-100 p-3.5 rounded-xl shadow-xl z-[60] pointer-events-none text-left animate-in fade-in slide-in-from-bottom-1 duration-200">
                                      <div className="text-[10px] font-bold text-gray-400 mb-2 pb-1 border-b border-gray-100 uppercase tracking-widest">
                                        Specifications
                                      </div>
                                      <div className="space-y-2">
                                        {details.map((detail, idx) => (
                                          <div key={idx} className="flex flex-col gap-0.5 text-[10px] leading-snug">
                                            <span className="font-extrabold text-[#0f4c3a] uppercase tracking-wider">{detail.label}</span>
                                            <span className="text-gray-600 font-medium">{detail.value}</span>
                                          </div>
                                        ))}
                                      </div>
                                      {/* Popover Arrow */}
                                      <div className="absolute top-full right-1 -translate-y-1 w-2.5 h-2.5 bg-white border-r border-b border-gray-100 rotate-45" />
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-xs text-gray-500 leading-snug">{desc}</div>

                          {isSelected && scalable && (
                            <div className="mt-3 pt-3 border-t border-[#0f4c3a]/15 flex items-center gap-3">
                              <div className="flex items-center bg-white rounded-lg border border-gray-200 overflow-hidden shrink-0">
                                <button
                                  onClick={(e) => { e.stopPropagation(); setServiceQty(id, qty - 1); }}
                                  disabled={qty <= 1}
                                  className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                  title={qty <= 1 ? 'Use × to remove' : 'Decrease'}
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="w-9 text-center text-sm font-bold text-gray-900 py-1 border-x border-gray-200">{qty}</span>
                                <button
                                  onClick={(e) => { e.stopPropagation(); setServiceQty(id, qty + 1); }}
                                  className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                                  title="Increase"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                              <span className="text-[11px] text-gray-500">employees</span>
                            </div>
                          )}

                          {isSelected && !scalable && (
                            <div className="mt-3 pt-3 border-t border-[#0f4c3a]/15 flex items-center gap-1.5 text-xs text-[#0f4c3a] font-bold">
                              <Check size={13} strokeWidth={3} />
                              Added
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Section 3: Notes */}
              {hasItems && (
                <section>
                  <SectionHeader number="4" title="Notes for the Arrivio Team" subtitle="(Optional)" />
                  <div className="bg-white rounded-2xl p-6 md:p-7 shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 mb-4">
                      Headcount waves, timing, special requirements anything our team should know before the call.
                    </p>
                    <textarea
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      placeholder="e.g. 8 engineers moving in July, 4 more in September. Need parking at the Berlin units."
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent text-sm focus:bg-white focus:border-[#0f4c3a]/20 focus:ring-2 focus:ring-[#0f4c3a]/5 transition-all outline-none resize-none placeholder:text-gray-400"
                    />
                    {additionalNotes.length > 0 && (
                      <p className="text-[10px] text-gray-400 mt-2 text-right">{additionalNotes.length} chars</p>
                    )}
                  </div>
                </section>
              )}

            </div>

            {/* Right column: Summary + Fees act as ONE unit, fixed to the right, no inner scroller */}
            <div className="w-full lg:w-1/3 lg:pt-[76px]">
              <div className="lg:sticky lg:top-28 space-y-4">
                <Summary
                  reservations={reservations}
                  groupedProperties={groupedProperties}
                  handleCheckout={handleCheckout}
                  handleDownloadPDF={handleDownloadPDF}
                  isGeneratingPDF={isGeneratingPDF}
                  isProcessingCheckout={isProcessingCheckout}
                  servicesCount={selectedServiceCount}
                  servicesTotal={servicesTotal}
                  estimatedMonthlyCost={estimatedMonthlyTotalWithAddons}
                  furnitureAddOnTotal={furnitureAddOnTotal}
                  furnitureCount={furnitureCount}
                  cityCounts={cityCounts}
                />
                {hasItems && (
                  <FeesAndInclusions
                    estimatedMonthlyCost={estimatedMonthlyTotalWithAddons}
                    furnitureAddOnTotal={furnitureAddOnTotal}
                  />
                )}
              </div>
            </div>
          </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Proposal;
