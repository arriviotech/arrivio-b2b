import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import PropertiesNavbar from '../components/layout/PropertiesNavbar';
import Footer from '../components/layout/Footer';
import PropertyCard from '../components/properties/PropertyCard';
import PropertySkeleton from '../components/properties/PropertySkeleton';
import SortDropdown from '../components/properties/SortDropdown';
import FilterSidePanel from '../components/properties/FilterSidePanel';
import { useProperties } from '../supabase/hooks/useProperties';
import { Home, SlidersHorizontal, X } from 'lucide-react';

const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCity = searchParams.get('city') || 'All';

  const { properties: allProperties, loading: isLoading } = useProperties();

  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('relevant');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isNavHidden, setIsNavHidden] = useState(false);
  // Multi-select room type filter. Empty set = no filter applied.
  const [selectedRoomTypes, setSelectedRoomTypes] = useState(new Set());
  const lastScrollY = useRef(0);

  const ROOM_TYPE_OPTIONS = [
    { key: 'studio', label: 'Studio' },
    { key: 'one_bedroom', label: 'Single Room' },
    { key: 'shared_room', label: 'Shared Room' },
  ];

  const toggleRoomType = (key) => {
    setSelectedRoomTypes((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  useEffect(() => {
    const NAVBAR_HEIGHT = 64; // px- matches h-16; desktop h-20 is 80 but 64 is the safer threshold
    const JITTER_THRESHOLD = 6;

    const handleScroll = () => {
      const current = window.scrollY;
      const delta = current - lastScrollY.current;

      if (Math.abs(delta) < JITTER_THRESHOLD) return;

      if (delta > 0 && current > NAVBAR_HEIGHT) {
        setIsNavHidden(true);
      } else if (delta < 0) {
        setIsNavHidden(false);
      }

      lastScrollY.current = current;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cityOptions = useMemo(() => {
    const cities = [...new Set(allProperties.map(p => p.city))].sort();
    return [
      { value: 'All', label: 'All cities' },
      ...cities.map(c => ({ value: c, label: c }))
    ];
  }, [allProperties]);

  const sortOptions = [
    { value: 'relevant', label: 'Most relevant' },
    { value: 'price_asc', label: 'Price: Low → High' },
    { value: 'price_desc', label: 'Price: High → Low' },
    { value: 'availability', label: 'Most available' }
  ];

  const handleCityChange = (city) => {
    setSelectedCity(city);
    if (city === 'All') {
      searchParams.delete('city');
    } else {
      searchParams.set('city', city);
    }
    setSearchParams(searchParams);
  };

  useEffect(() => {
    const cityParam = searchParams.get('city');
    if (cityParam && cityParam !== selectedCity) {
      setSelectedCity(cityParam);
    } else if (!cityParam && selectedCity !== 'All') {
      setSelectedCity('All');
    }
  }, [searchParams]);

  let filteredProperties = allProperties.filter(p => {
    if (selectedCity !== 'All' && p.city !== selectedCity) return false;
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      if (!p.name?.toLowerCase().includes(s) && !p.city?.toLowerCase().includes(s) && !(p.neighborhood || '').toLowerCase().includes(s) && !(p.address || '').toLowerCase().includes(s)) return false;
    }
    // Room-type filter — keep properties that have at least one unit of any selected type
    if (selectedRoomTypes.size > 0) {
      const breakdown = p.breakdown || {};
      const hasMatch = [...selectedRoomTypes].some((key) => (breakdown[key] || 0) > 0);
      if (!hasMatch) return false;
    }
    return true;
  });

  filteredProperties.sort((a, b) => {
    if (sortOrder === 'price_asc') return a.price - b.price;
    if (sortOrder === 'price_desc') return b.price - a.price;
    if (sortOrder === 'availability') return (b.availableUnits || 0) - (a.availableUnits || 0);
    return 0;
  });

  const hasPriceFilter = priceRange[0] > 0 || priceRange[1] < 2000;
  const hasRoomTypeFilter = selectedRoomTypes.size > 0;
  const activeFilterCount =
    (selectedCity !== 'All' ? 1 : 0) + (hasPriceFilter ? 1 : 0) + (hasRoomTypeFilter ? 1 : 0);

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-[#f2f2f2] relative">
      <PropertiesNavbar searchTerm={searchTerm} onSearchChange={setSearchTerm} isHidden={isNavHidden} />

      <main className="flex-grow pt-16 md:pt-20 pb-8">

        {/* ── STICKY NAV: city tabs (desktop) / filter-sort (mobile) ── */}
        {/* top animates between 64/80 (nav visible) and 0 (nav hidden) so the bar slides up to replace the navbar */}
        <div className={`sticky z-30 bg-white/80 backdrop-blur-xl border-b border-[#e5e7eb] px-4 md:px-8 transition-[top] duration-300 ease-out ${isNavHidden ? 'top-0' : 'top-16 md:top-20'}`}>
          <div className="max-w-7xl mx-auto h-12 flex items-center">

            {/* MOBILE: Filters + Sort (cities live inside the drawer) */}
            <div className="flex md:hidden items-center justify-between w-full">
              <button
                onClick={() => setIsFilterOpen(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-[12px] font-semibold whitespace-nowrap transition-all ${activeFilterCount > 0
                    ? 'border-[#0f4c3a] bg-[#0f4c3a] text-white shadow-sm'
                    : 'border-[#d1d5db] bg-white text-[#111827] shadow-sm'
                  }`}
              >
                <SlidersHorizontal size={13} className={activeFilterCount > 0 ? 'text-white' : 'text-[#6b7280]'} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-white text-[#0f4c3a] text-[10px] font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <SortDropdown value={sortOrder} options={sortOptions} onChange={setSortOrder} />
            </div>

            {/* DESKTOP: City tabs only- full width nav row */}
            <div className="hidden md:flex items-center overflow-x-auto no-scrollbar w-full">
              {cityOptions.map(city => (
                <button
                  key={city.value}
                  onClick={() => handleCityChange(city.value)}
                  className={`relative px-3.5 py-3 text-[12px] font-semibold whitespace-nowrap transition-colors ${selectedCity === city.value
                      ? 'text-[#0f4c3a]'
                      : 'text-[#9ca3af] hover:text-[#6b7280]'
                    }`}
                >
                  {city.label}
                  {selectedCity === city.value && (
                    <div className="absolute bottom-0 left-1 right-1 h-[2px] bg-[#0f4c3a] rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="max-w-7xl px-4 md:px-8 mx-auto mt-5 md:mt-6">

          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#111827] mb-3">
            <Link to="/" className="hover:underline">Home</Link>
            <span className="text-[#9ca3af]">/</span>
            <Link to="/properties" className="hover:underline">Properties</Link>
            <span className="text-[#9ca3af]">/</span>
            <span className="text-[#0f4c3a]">{selectedCity === 'All' ? 'Germany' : selectedCity}</span>
          </div>

          {/* ── META BAR: result count (all sizes) + Filters + Sort (desktop) ── */}
          <div className="flex items-end justify-between gap-4 mb-3 md:mb-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-[16px] md:text-xl lg:text-2xl font-serif font-semibold text-[#111827] leading-tight">
                {isLoading
                  ? 'Loading properties…'
                  : `${filteredProperties.length} ${filteredProperties.length === 1 ? 'property' : 'properties'} ${selectedCity === 'All' ? 'across Germany' : `in ${selectedCity}`}`}
              </h1>
              {!isLoading && filteredProperties.length !== allProperties.length && (
                <p className="text-[10px] md:text-[11px] text-[#9ca3af] mt-1">
                  Filtered from {allProperties.length} total
                </p>
              )}
            </div>
            {/* Right controls- desktop only. On mobile, Filters+Sort live in the sticky bar. */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsFilterOpen(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-[12px] font-semibold whitespace-nowrap transition-all ${activeFilterCount > 0
                    ? 'border-[#0f4c3a] bg-[#0f4c3a] text-white shadow-sm hover:bg-[#0a3a2b]'
                    : 'border-[#d1d5db] bg-white text-[#111827] shadow-sm hover:border-[#0f4c3a]/40'
                  }`}
              >
                <SlidersHorizontal size={13} className={activeFilterCount > 0 ? 'text-white' : 'text-[#6b7280]'} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-white text-[#0f4c3a] text-[10px] font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <SortDropdown value={sortOrder} options={sortOptions} onChange={setSortOrder} />
            </div>
          </div>

          {/* ── ROOM TYPE PILLS (multi-select) ── */}
          <div className="flex items-center gap-2 mb-3 md:mb-4 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#9ca3af] shrink-0">
              Room type
            </span>
            {ROOM_TYPE_OPTIONS.map(({ key, label }) => {
              const isActive = selectedRoomTypes.has(key);
              return (
                <button
                  key={key}
                  onClick={() => toggleRoomType(key)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all shrink-0 border ${
                    isActive
                      ? 'border-[#0f4c3a] bg-[#0f4c3a] text-white shadow-sm'
                      : 'border-[#e5e7eb] bg-white text-[#374151] hover:border-[#0f4c3a]/40'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* ── ACTIVE FILTER CHIPS (all sizes) ── */}
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2 mb-4 md:mb-5 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#9ca3af] shrink-0">Active</span>
              {selectedCity !== 'All' && (
                <button
                  onClick={() => handleCityChange('All')}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#e5e7eb] text-[11px] font-semibold text-[#374151] whitespace-nowrap hover:border-red-300 hover:bg-red-50 hover:text-red-600 active:bg-red-50 active:text-red-600 transition-colors group shadow-sm"
                >
                  <span>{selectedCity}</span>
                  <X size={11} className="text-[#9ca3af] group-hover:text-red-500 group-active:text-red-500 transition-colors" />
                </button>
              )}
              {hasPriceFilter && (
                <button
                  onClick={() => setPriceRange([0, 2000])}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#e5e7eb] text-[11px] font-semibold text-[#374151] whitespace-nowrap hover:border-red-300 hover:bg-red-50 hover:text-red-600 active:bg-red-50 active:text-red-600 transition-colors group shadow-sm"
                >
                  <span>€{priceRange[0]} – €{priceRange[1]}</span>
                  <X size={11} className="text-[#9ca3af] group-hover:text-red-500 group-active:text-red-500 transition-colors" />
                </button>
              )}
              {hasRoomTypeFilter && (
                <button
                  onClick={() => setSelectedRoomTypes(new Set())}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#e5e7eb] text-[11px] font-semibold text-[#374151] whitespace-nowrap hover:border-red-300 hover:bg-red-50 hover:text-red-600 active:bg-red-50 active:text-red-600 transition-colors group shadow-sm"
                >
                  <span>
                    {[...selectedRoomTypes]
                      .map((k) => ROOM_TYPE_OPTIONS.find((o) => o.key === k)?.label)
                      .filter(Boolean)
                      .join(' · ')}
                  </span>
                  <X size={11} className="text-[#9ca3af] group-hover:text-red-500 group-active:text-red-500 transition-colors" />
                </button>
              )}
              <button
                onClick={() => { handleCityChange('All'); setPriceRange([0, 2000]); setSelectedRoomTypes(new Set()); }}
                className="px-3 py-1 rounded-full text-[11px] font-semibold text-[#9ca3af] hover:text-[#111827] hover:bg-white hover:shadow-sm border border-transparent hover:border-[#e5e7eb] transition-all whitespace-nowrap shrink-0"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => <PropertySkeleton key={i} />)
            ) : filteredProperties.length > 0 ? (
              filteredProperties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 px-4 text-center bg-white/50 rounded-3xl border border-[#f2f2f2]">
                <div className="w-16 h-16 bg-[#0f4c3a]/5 rounded-full flex items-center justify-center mb-6">
                  <Home size={32} className="text-[#9ca3af]" />
                </div>
                <h2 className="text-xl font-serif font-bold text-[#111827] mb-2">No properties found</h2>
                <p className="text-[#4b5563] max-w-sm mb-8">
                  Try adjusting your filters or search term to find what you're looking for.
                </p>
                <button
                  onClick={() => { handleCityChange('All'); setPriceRange([0, 2000]); setSelectedRoomTypes(new Set()); }}
                  className="px-8 py-3 rounded-full bg-[#0f4c3a] text-white font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Mobile Filter Side Panel */}
      <FilterSidePanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedCity={selectedCity}
        onCityChange={handleCityChange}
        cityOptions={cityOptions}
        priceRange={priceRange}
        onPriceChange={setPriceRange}
        properties={allProperties}
        onClearAll={() => { handleCityChange('All'); setPriceRange([0, 2000]); setSelectedRoomTypes(new Set()); }}
        roomTypeOptions={ROOM_TYPE_OPTIONS}
        selectedRoomTypes={selectedRoomTypes}
        onToggleRoomType={toggleRoomType}
      />
    </div>
  );
};

export default Properties;
