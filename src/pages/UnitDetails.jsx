import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PropertiesNavbar from '../components/layout/PropertiesNavbar';
import Footer from '../components/layout/Footer';
import { useProperty } from '../supabase/hooks/useProperty';
import { ArrowLeft, Loader2 } from 'lucide-react';
import UnitGallery from '../components/unitdetails/UnitGallery';
import UnitStats from '../components/unitdetails/UnitStats';
import Amenities from '../components/unitdetails/Amenities';
import UnitBox from '../components/unitdetails/UnitBox';
import { useReservation } from '../context/ReservationContext';

const UnitDetails = () => {
  const { slug, unitId } = useParams();
  const navigate = useNavigate();
  const { property, loading } = useProperty(slug);
  const { addReservation, reservations } = useReservation();

  // Find the specific unit
  const unit = property?.units?.find(u => u.id === unitId) || null;

  // Unit type labels
  const unitTypeLabels = {
    studio: 'Private Studio',
    one_bedroom: '1-Bedroom Apartment',
    two_bedroom: '2-Bedroom Apartment',
    shared_room: 'Shared Room',
  };
  const formattedTitle = unit ? (unitTypeLabels[unit.unit_type] || unit.unit_type?.replace(/_/g, ' ')) : '';

  const existingReservation = reservations.find(r => r.propertyId === property?.id && r.unitType === formattedTitle);

  const [quantity, setQuantity] = useState(existingReservation ? existingReservation.quantity : 0);
  const [isAdded, setIsAdded] = useState(false);
  const [isShared, setIsShared] = useState(existingReservation ? existingReservation.isShared : false);
  const [sharedCount, setSharedCount] = useState(existingReservation?.isShared ? existingReservation.sharedCount : 1);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-[#f2f2f2]">
        <PropertiesNavbar />
        <main className="flex-grow pt-32 pb-24 flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-[#0f4c3a]" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!property || !unit) {
    return (
      <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-[#f2f2f2]">
        <PropertiesNavbar />
        <main className="flex-grow pt-32 pb-24 flex items-center justify-center">
          <div className="text-xl">Unit not found.</div>
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
  const isIndividual = unit.unit_type === 'one_bedroom' || unit.unit_type === 'two_bedroom';

  const handleAddToOverview = () => {
    addReservation({
      propertyId: property.id,
      propertyName: property.name,
      propertyCity: property.city,
      propertyNeighborhood: property.neighborhood || property.district,
      propertyImage: property.image,
      unitType: formattedTitle,
      unitPrice: unitPrice,
      quantity: quantity,
      isShared: isShared,
      sharedCount: isShared ? sharedCount : 0
    }, !!existingReservation);

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 800);
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

          <div className="flex flex-col lg:flex-row gap-10">

            {/* Left: Gallery & Details */}
            <div className="w-full lg:w-2/3 flex flex-col gap-8">
              <UnitGallery galleryImages={galleryImages} />
              <UnitStats property={property} formattedTitle={formattedTitle} unit={unit} />
              <Amenities isStudio={isStudio} property={property} formattedTitle={formattedTitle} unit={unit} />
            </div>

            {/* Right: Pricing & CTA */}
            <div className="w-full lg:w-1/3">
              <UnitBox
                unitPrice={unitPrice}
                totalAvailable={totalAvailable}
                quantity={quantity}
                setQuantity={setQuantity}
                isAdded={isAdded}
                handleAddToOverview={handleAddToOverview}
                isIndividual={isIndividual}
                isShared={isShared}
                setIsShared={setIsShared}
                sharedCount={sharedCount}
                setSharedCount={setSharedCount}
                property={property}
                existingReservation={!!existingReservation}
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
