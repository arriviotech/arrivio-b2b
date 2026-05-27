import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PropertiesNavbar from '../components/layout/PropertiesNavbar';
import Footer from '../components/layout/Footer';
import { useProperty } from '../supabase/hooks/useProperty';
import { ArrowLeft, Loader2, SearchX, ArrowRight } from 'lucide-react';
import UnitGallery from '../components/unitdetails/UnitGallery';
import UnitStats from '../components/unitdetails/UnitStats';
import Amenities from '../components/unitdetails/Amenities';
import UnitBox from '../components/unitdetails/UnitBox';
import { useReservation } from '../context/ReservationContext';

const UnitDetails = () => {
  const { slug, unitId } = useParams();
  const navigate = useNavigate();
  const { property, loading } = useProperty(slug);
  const { addReservation, removeReservation, reservations } = useReservation();

  // Find the specific unit
  const unit = property?.units?.find(u => u.id === unitId) || null;

  // Unit type labels
  const unitTypeLabels = {
    studio: 'Studio',
    one_bedroom: 'Single Room',
    shared_room: 'Shared Room',
  };
  const formattedTitle = unit ? (unitTypeLabels[unit.unit_type] || unit.unit_type?.replace(/_/g, ' ')) : '';

  const existingReservation = reservations.find(r => r.propertyId === property?.id && r.unitType === formattedTitle);

  const [quantity, setQuantity] = useState(existingReservation ? existingReservation.quantity : 0);

  // Keep local quantity in sync with the reservation context. Needed for two cases:
  // (1) Initial load — property/unit aren't ready on first render, so existingReservation
  //     is undefined and useState defaults to 0. Once data arrives, we sync.
  // (2) User updates the cart elsewhere (e.g., on the Proposal page) — this page reflects it.
  useEffect(() => {
    setQuantity(existingReservation?.quantity || 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingReservation?.quantity]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-[#f2f2f2]">
        <PropertiesNavbar />
        <main className="flex-grow pt-40 pb-32 flex items-center justify-center px-6">
          <div className="text-center">
            <Loader2 size={44} className="animate-spin text-[#0f4c3a] mx-auto mb-5" />
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Loading unit details…</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!property || !unit) {
    return (
      <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-[#f2f2f2]">
        <PropertiesNavbar />
        <main className="flex-grow pt-40 pb-32 flex items-center justify-center px-6">
          <div className="bg-white rounded-3xl p-10 md:p-14 text-center shadow-sm border border-gray-100 max-w-md w-full">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <SearchX className="w-10 h-10 text-red-400" />
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-medium text-gray-900 mb-3">Unit not found</h1>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              This unit may have been removed or is no longer available.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/properties"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0f4c3a] hover:bg-[#1A2E22] text-white px-6 py-3 rounded-xl text-sm font-bold transition-all"
              >
                Browse Properties
                <ArrowRight size={14} />
              </Link>
              <button
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-xl text-sm font-bold transition-all"
              >
                <ArrowLeft size={14} />
                Go Back
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Get pricing — prefer b2b, fallback to cheapest
  const pricingRules = unit.unit_pricing_rules || [];
  const b2bPricing = pricingRules.find(p => p.tenant_type === 'b2b');
  const cheapestPricing = pricingRules.length > 0
    ? pricingRules.reduce((min, p) => p.monthly_rent_cents < min.monthly_rent_cents ? p : min, pricingRules[0])
    : null;
  const activePricing = b2bPricing || cheapestPricing;
  const unitPrice = activePricing ? activePricing.monthly_rent_cents / 100 : property.price || 0;

  // Availability — count same-type units that are available
  const sameTypeUnits = (property.units || []).filter(u => u.unit_type === unit.unit_type);
  const totalAvailable = sameTypeUnits.filter(u => u.status === 'available').length;

  // Gallery — use property photos, preferring unit-specific ones
  const allPhotos = property.gallery || [];
  const galleryImages = allPhotos.length > 0
    ? allPhotos.map(p => p.url || p)
    : [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
    ];

  const isStudio = unit.unit_type === 'studio';

  const handleAddToProposal = () => {
    addReservation({
      propertyId: property.id,
      propertySlug: property.slug,
      propertyName: property.name,
      propertyCity: property.city,
      propertyNeighborhood: property.neighborhood || property.district,
      propertyImage: property.image,
      unitType: formattedTitle,
      unitTypeKey: unit.unit_type,
      unitPrice: unitPrice,
      quantity: quantity,
      maxAvailable: totalAvailable,
    }, true /* isUpdate=true → stepper sets absolute qty */);
  };

  const handleRemoveFromProposal = () => {
    removeReservation(property.id, formattedTitle);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-[#f2f2f2]">
      <PropertiesNavbar />

      <main className="flex-grow pt-28 pb-24">
        <div className="max-w-7xl mx-auto px-6">

          <div className="mb-6 space-y-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-[#4b5563] hover:text-[#111827] transition-colors group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-widest">Back</span>
            </button>

            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#111827]">
              <Link to="/" className="hover:underline">Home</Link>
              <span className="text-[#9ca3af]">/</span>
              <Link to="/properties" className="hover:underline">Properties</Link>
              <span className="text-[#9ca3af]">/</span>
              <Link to={`/properties?city=${property.city}`} className="hover:underline">{property.city}</Link>
              <span className="text-[#9ca3af]">/</span>
              <Link to={`/property/${slug}`} className="hover:underline">{property.name}</Link>
              <span className="text-[#9ca3af]">/</span>
              <span className="text-[#0f4c3a] truncate max-w-[200px] md:max-w-none">{formattedTitle}</span>
            </div>
          </div>

          {/* Title strip — full width, above the columns */}
          <div className="mb-6">
            <UnitStats property={property} formattedTitle={formattedTitle} unit={unit} />
          </div>

          <div className="flex flex-col lg:flex-row gap-10">

            {/* Left: Gallery + Description/Amenities */}
            <div className="w-full lg:w-2/3 flex flex-col gap-8">
              <UnitGallery galleryImages={galleryImages} />
              <Amenities isStudio={isStudio} property={property} formattedTitle={formattedTitle} unit={unit} />
            </div>

            {/* Right: Sticky buy box with specs */}
            <div className="w-full lg:w-1/3">
              <UnitBox
                unit={unit}
                property={property}
                formattedTitle={formattedTitle}
                unitPrice={unitPrice}
                totalAvailable={totalAvailable}
                quantity={quantity}
                setQuantity={setQuantity}
                handleAddToProposal={handleAddToProposal}
                handleRemoveFromProposal={handleRemoveFromProposal}
                existingReservation={existingReservation}
              />
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UnitDetails;
