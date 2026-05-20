import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PropertiesNavbar from '../components/layout/PropertiesNavbar';
import Footer from '../components/layout/Footer';
import { useProperty } from '../supabase/hooks/useProperty';
import { ArrowLeft, Loader2 } from 'lucide-react';
import PropertyInfo from '../components/propertydetails/PropertyInfo';
import StudioSection from '../components/propertydetails/StudioSection';
import SharedSection from '../components/propertydetails/SharedSection';

const PropertyDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { property, loading } = useProperty(slug);

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

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-[#f2f2f2]">
        <PropertiesNavbar />
        <main className="flex-grow pt-32 pb-24 flex items-center justify-center">
          <div className="text-xl">Property not found.</div>
        </main>
        <Footer />
      </div>
    );
  }

  // Group units by type for sections
  const units = property.units || [];
  const studioUnits = units.filter(u => u.unit_type === 'studio');
  const sharedUnits = units.filter(u => u.unit_type === 'shared_room');
  const oneBedUnits = units.filter(u => u.unit_type === 'one_bedroom');
  const twoBedUnits = units.filter(u => u.unit_type === 'two_bedroom');

  // Build shared options from real unit data
  const sharedOptions = [];

  if (oneBedUnits.length > 0) {
    const cheapest = Math.min(...oneBedUnits.flatMap(u => (u.unit_pricing_rules || []).map(p => p.monthly_rent_cents)));
    sharedOptions.push({
      title: "1-Bedroom Apartment",
      description: `${oneBedUnits.length} available — 1 bedroom apartment`,
      price: cheapest > 0 ? cheapest / 100 : property.price,
      units: oneBedUnits,
    });
  }

  if (twoBedUnits.length > 0) {
    const cheapest = Math.min(...twoBedUnits.flatMap(u => (u.unit_pricing_rules || []).map(p => p.monthly_rent_cents)));
    sharedOptions.push({
      title: "2-Bedroom Apartment",
      description: `${twoBedUnits.length} available — 2 bedroom apartment`,
      price: cheapest > 0 ? cheapest / 100 : property.price + 200,
      units: twoBedUnits,
    });
  }

  if (sharedUnits.length > 0) {
    const cheapest = Math.min(...sharedUnits.flatMap(u => (u.unit_pricing_rules || []).map(p => p.monthly_rent_cents)));
    sharedOptions.push({
      title: "Shared Room",
      description: `${sharedUnits.length} available — shared room`,
      price: cheapest > 0 ? cheapest / 100 : property.price - 100,
      units: sharedUnits,
    });
  }

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
              <span className="text-[#0f4c3a] truncate max-w-[200px] md:max-w-none">{property.name}</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

            {/* Left side: Overall Property Details — sticky */}
            <div className="w-full lg:w-[380px] shrink-0">
              <div className="lg:sticky lg:top-24">
                <PropertyInfo property={property} />
              </div>
            </div>

            {/* Right side: Unit Sections */}
            <div className="flex-1 min-w-0 flex flex-col gap-8">

              {/* Studio Section */}
              {studioUnits.length > 0 && (
                <StudioSection property={property} units={studioUnits} />
              )}

              {/* Shared/Apartment Section */}
              {sharedOptions.length > 0 && (
                <SharedSection property={property} sharedOptions={sharedOptions} />
              )}

            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PropertyDetails;
