import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PropertiesNavbar from '../components/layout/PropertiesNavbar';
import Footer from '../components/layout/Footer';
import { useProperty } from '../supabase/hooks/useProperty';
import { ArrowLeft, Loader2, SearchX, ArrowRight } from 'lucide-react';
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
        <main className="flex-grow pt-40 pb-32 flex items-center justify-center px-6">
          <div className="text-center">
            <Loader2 size={44} className="animate-spin text-[#0f4c3a] mx-auto mb-5" />
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Loading property…</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-[#f2f2f2]">
        <PropertiesNavbar />
        <main className="flex-grow pt-40 pb-32 flex items-center justify-center px-6">
          <div className="bg-white rounded-3xl p-10 md:p-14 text-center shadow-sm border border-gray-100 max-w-md w-full">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <SearchX className="w-10 h-10 text-red-400" />
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-medium text-gray-900 mb-3">Property not found</h1>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              We couldn't find this property. It may have been removed, or the link is incorrect.
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
      description: "Full apartment with one private bedroom",
      price: cheapest > 0 ? cheapest / 100 : property.price,
      units: oneBedUnits,
    });
  }

  if (twoBedUnits.length > 0) {
    const cheapest = Math.min(...twoBedUnits.flatMap(u => (u.unit_pricing_rules || []).map(p => p.monthly_rent_cents)));
    sharedOptions.push({
      title: "2-Bedroom Apartment",
      description: "Full apartment with two private bedrooms",
      price: cheapest > 0 ? cheapest / 100 : property.price + 200,
      units: twoBedUnits,
    });
  }

  if (sharedUnits.length > 0) {
    const cheapest = Math.min(...sharedUnits.flatMap(u => (u.unit_pricing_rules || []).map(p => p.monthly_rent_cents)));
    sharedOptions.push({
      title: "Shared Room",
      description: "Private bedroom with shared common areas",
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
