import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  Building2,
  MapPin,
  Sparkles,
  CheckCircle2,
  MessageSquare,
  Calendar,
  Info,
  X,
  Plus,
} from 'lucide-react';
import PropertiesNavbar from '../components/layout/PropertiesNavbar';
import Footer from '../components/layout/Footer';
import { useReservation } from '../context/ReservationContext';
import { useArixDesigner } from '../context/ArixDesignerContext';
import { ARIX_ENABLED } from '../App';

// Cities Arrivio currently operates in. Add to this list as coverage grows.
const SUPPORTED_CITIES = ['Aachen', 'Berlin', 'Bonn', 'Hamburg'];

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
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isActive
                    ? 'bg-[#0f4c3a] text-white'
                    : isPast
                      ? 'bg-[#0f4c3a]/30 text-[#0f4c3a]'
                      : 'bg-gray-200 text-gray-400'
                }`}
              >
                {stepNum}
              </div>
              <span
                className={`text-xs font-semibold uppercase tracking-widest ${
                  isActive ? 'text-[#0f4c3a]' : 'text-gray-400'
                }`}
              >
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

const SLOT_SUFFIX_BY_LABEL = { Studio: 'studio', 'Single Room': 'one_bedroom' };

const ProposalSummary = ({ reservations }) => {
  const { getDesignForProperty, getSharedDesignForProperty } = useArixDesigner();

  const housing = reservations.filter((r) => r.propertyId !== 'services');
  const totalUnits = housing.reduce((acc, r) => acc + (r.quantity || 0), 0);
  const propertyMap = {};
  housing.forEach((r) => {
    if (!propertyMap[r.propertyId]) {
      propertyMap[r.propertyId] = {
        id: r.propertyId,
        name: r.propertyName,
        image: r.propertyImage,
        city: r.propertyCity,
        units: [],
      };
    }
    propertyMap[r.propertyId].units.push(r);
  });
  const properties = Object.values(propertyMap);
  const propertiesCount = properties.length;
  const cities = new Set(housing.map((r) => r.propertyCity).filter(Boolean));
  const citiesCount = cities.size;

  const housingMonthly = housing.reduce(
    (sum, r) => sum + Math.round((r.unitPrice || 0) * (r.quantity || 0)),
    0,
  );

  const furnitureMonthly = !ARIX_ENABLED
    ? 0
    : properties.reduce((acc, prop) => {
        const labels = [...new Set(prop.units.map((u) => u.unitType).filter(Boolean))];
        return (
          acc +
          labels.reduce((s, label) => {
            if (label === 'Shared Room') {
              return s + (getSharedDesignForProperty(prop.id)?.addOnTotal || 0);
            }
            const suffix = SLOT_SUFFIX_BY_LABEL[label];
            if (!suffix) return s;
            return s + (getDesignForProperty(`${prop.id}_${suffix}`)?.addOnTotal || 0);
          }, 0)
        );
      }, 0);

  const monthlyTotal = housingMonthly + furnitureMonthly;
  const formatCurrency = (n) =>
    new Intl.NumberFormat('en-DE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
        You&rsquo;re scheduling about
      </div>
      <h2 className="text-base font-bold text-gray-900 mb-4">Your proposal</h2>

      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center mb-1 text-[#0f4c3a]">
            <BedDouble size={14} />
          </div>
          <div className="text-lg font-bold text-gray-900 leading-none">{totalUnits}</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">
            {totalUnits === 1 ? 'Unit' : 'Units'}
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center mb-1 text-[#0f4c3a]">
            <Building2 size={14} />
          </div>
          <div className="text-lg font-bold text-gray-900 leading-none">{propertiesCount}</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">
            {propertiesCount === 1 ? 'Property' : 'Properties'}
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center mb-1 text-[#0f4c3a]">
            <MapPin size={14} />
          </div>
          <div className="text-lg font-bold text-gray-900 leading-none">{citiesCount}</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">
            {citiesCount === 1 ? 'City' : 'Cities'}
          </div>
        </div>
      </div>

      <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
        Properties
      </div>
      <ul className="space-y-2 mb-5">
        {properties.map((p) => {
          const qty = p.units.reduce((s, u) => s + (u.quantity || 0), 0);
          // Per-property monthly = housing rent × quantity + furniture across slots
          const propHousing = p.units.reduce(
            (s, u) => s + Math.round((u.unitPrice || 0) * (u.quantity || 0)),
            0,
          );
          const propLabels = [...new Set(p.units.map((u) => u.unitType).filter(Boolean))];
          const propFurniture = !ARIX_ENABLED
            ? 0
            : propLabels.reduce((s, label) => {
                if (label === 'Shared Room') {
                  return s + (getSharedDesignForProperty(p.id)?.addOnTotal || 0);
                }
                const suffix = SLOT_SUFFIX_BY_LABEL[label];
                if (!suffix) return s;
                return s + (getDesignForProperty(`${p.id}_${suffix}`)?.addOnTotal || 0);
              }, 0);
          const propMonthly = propHousing + propFurniture;
          return (
            <li key={p.id} className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-gray-100 bg-gray-50">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow min-w-0">
                <div className="text-xs font-bold text-gray-900 truncate">{p.name}</div>
                <div className="text-[10px] text-gray-500 truncate">
                  {p.city} · {qty} {qty === 1 ? 'unit' : 'units'}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs font-bold text-[#0f4c3a]">
                  {formatCurrency(propMonthly)}
                  <span className="text-[9px] font-normal text-[#0f4c3a]/60">/mo</span>
                </div>
                {propFurniture > 0 && (
                  <div className="text-[9px] text-gray-400 leading-tight inline-flex items-center gap-0.5">
                    <Sparkles size={8} className="text-[#0f4c3a]" />
                    incl.
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="pt-4 border-t border-gray-100 space-y-1.5 text-xs">
        <div className="flex justify-between text-gray-600">
          <span>Housing</span>
          <span className="font-bold text-gray-900">{formatCurrency(housingMonthly)}/mo</span>
        </div>
        {furnitureMonthly > 0 && (
          <div className="flex justify-between text-gray-600">
            <span className="inline-flex items-center gap-1">
              <Sparkles size={10} className="text-[#0f4c3a]" />
              Furniture add-on
            </span>
            <span className="font-bold text-gray-900">{formatCurrency(furnitureMonthly)}/mo</span>
          </div>
        )}
        <div className="flex justify-between pt-2 mt-1 border-t border-gray-100">
          <span className="text-[11px] font-bold uppercase tracking-widest text-gray-700">
            Estimated Monthly
          </span>
          <span className="text-base font-bold text-[#0f4c3a]">
            {formatCurrency(monthlyTotal)}
            <span className="text-xs font-normal text-[#0f4c3a]/60">/mo</span>
          </span>
        </div>
      </div>
    </div>
  );
};

const DiscoveryCallInfo = ({ fields, onEdit, isLivePreview = false }) => {
  const hasAny =
    fields &&
    ((fields.cities && fields.cities.length > 0) ||
      fields.headcount ||
      fields.timeline ||
      fields.notes);

  return (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
      30-minute discovery call
    </div>
    <h2 className="text-base font-bold text-gray-900 mb-4">What we&rsquo;ll cover</h2>

    <ul className="space-y-3 mb-5 text-xs text-gray-700">
      <li className="flex items-start gap-2.5">
        <div className="w-5 h-5 rounded-md bg-[#0f4c3a]/10 text-[#0f4c3a] flex items-center justify-center flex-shrink-0 mt-0.5">
          <CheckCircle2 size={12} />
        </div>
        <span>Your team size, cities, and timeline to scope the right housing.</span>
      </li>
      <li className="flex items-start gap-2.5">
        <div className="w-5 h-5 rounded-md bg-[#0f4c3a]/10 text-[#0f4c3a] flex items-center justify-center flex-shrink-0 mt-0.5">
          <Building2 size={12} />
        </div>
        <span>A quick tour of buildings that match Studios, Single Rooms, Shared.</span>
      </li>
      <li className="flex items-start gap-2.5">
        <div className="w-5 h-5 rounded-md bg-[#0f4c3a]/10 text-[#0f4c3a] flex items-center justify-center flex-shrink-0 mt-0.5">
          <Sparkles size={12} />
        </div>
        <span>Furniture, relocation services, brokerage fees pricing transparency.</span>
      </li>
      <li className="flex items-start gap-2.5">
        <div className="w-5 h-5 rounded-md bg-[#0f4c3a]/10 text-[#0f4c3a] flex items-center justify-center flex-shrink-0 mt-0.5">
          <MessageSquare size={12} />
        </div>
        <span>Questions, paperwork, and custom requests.</span>
      </li>
    </ul>

    {hasAny && (
      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-baseline justify-between mb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            {isLivePreview ? 'Your brief · live preview' : 'Your brief'}
          </span>
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="text-[10px] font-bold uppercase tracking-widest text-[#0f4c3a] hover:underline"
            >
              Edit
            </button>
          )}
        </div>

        <dl className="space-y-3">
          {fields.cities && fields.cities.length > 0 && (
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-md bg-[#0f4c3a]/10 text-[#0f4c3a] flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin size={11} />
              </div>
              <div className="flex-1 min-w-0">
                <dt className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                  Cities
                </dt>
                <dd className="flex flex-wrap gap-1">
                  {fields.cities.map((c) => {
                    const isUnsupported = (fields.unsupported || []).some(
                      (u) => u.toLowerCase() === c.toLowerCase(),
                    );
                    return (
                      <span
                        key={c}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          isUnsupported
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-[#0f4c3a]/10 text-[#0f4c3a]'
                        }`}
                      >
                        {c}
                        {isUnsupported && <span className="ml-1 opacity-70">!</span>}
                      </span>
                    );
                  })}
                </dd>
              </div>
            </div>
          )}

          {fields.headcount && (
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-md bg-[#0f4c3a]/10 text-[#0f4c3a] flex items-center justify-center flex-shrink-0 mt-0.5">
                <BedDouble size={11} />
              </div>
              <div className="flex-1 min-w-0">
                <dt className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">
                  Headcount
                </dt>
                <dd className="text-sm font-bold text-gray-900 leading-tight">
                  {fields.headcount}
                </dd>
              </div>
            </div>
          )}

          {fields.timeline && (
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-md bg-[#0f4c3a]/10 text-[#0f4c3a] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Calendar size={11} />
              </div>
              <div className="flex-1 min-w-0">
                <dt className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">
                  Timeline
                </dt>
                <dd className="text-xs font-bold text-gray-900 leading-tight">
                  {fields.timeline}
                </dd>
              </div>
            </div>
          )}

          {fields.notes && (
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-md bg-[#0f4c3a]/10 text-[#0f4c3a] flex items-center justify-center flex-shrink-0 mt-0.5">
                <MessageSquare size={11} />
              </div>
              <div className="flex-1 min-w-0">
                <dt className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">
                  Notes
                </dt>
                <dd className="text-[11px] text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {fields.notes}
                </dd>
              </div>
            </div>
          )}

          {fields.unsupported && fields.unsupported.length > 0 && (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-lg px-2.5 py-1.5 text-[10px] text-amber-900 leading-snug">
              <Info size={11} className="mt-0.5 flex-shrink-0 text-amber-600" />
              <span>
                Not currently served: <strong>{fields.unsupported.join(', ')}</strong>
              </span>
            </div>
          )}
        </dl>
      </div>
    )}
  </div>
  );
};

const BriefForm = ({ onContinue, onSkip, onPreview }) => {
  const [selectedCities, setSelectedCities] = useState([]);
  const [customInput, setCustomInput] = useState('');
  const [headcount, setHeadcount] = useState('');
  const [timeline, setTimeline] = useState('');
  const [notes, setNotes] = useState('');

  const toggleCity = (city) => {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city],
    );
  };

  const addCustomCity = () => {
    const c = customInput.trim();
    if (c && !selectedCities.includes(c)) {
      setSelectedCities([...selectedCities, c]);
    }
    setCustomInput('');
  };

  const unsupported = selectedCities.filter(
    (c) => !SUPPORTED_CITIES.some((sc) => sc.toLowerCase() === c.toLowerCase()),
  );

  // Structured brief data — used for both live preview rendering AND for
  // formatting the string that gets attached to the Cal.com booking notes.
  const briefFields = {
    cities: selectedCities,
    unsupported,
    headcount: headcount.trim(),
    timeline: timeline.trim(),
    notes: notes.trim(),
  };

  // Live preview — emit current fields whenever they change
  useEffect(() => {
    if (onPreview) onPreview(briefFields);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCities, headcount, timeline, notes]);

  const handleSubmit = () => {
    onContinue(briefFields);
  };

  const hasAny =
    selectedCities.length > 0 || headcount.trim() || timeline.trim() || notes.trim();

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-1">A few quick questions</h2>
      <p className="text-sm text-gray-500 mb-6">
        Helps us prep every field is optional. You can skip and book directly.
      </p>

      {/* Cities */}
      <div className="mb-6">
        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
          Cities you&rsquo;re considering
        </label>

        <div className="flex flex-wrap gap-2 mb-3">
          {SUPPORTED_CITIES.map((city) => {
            const isActive = selectedCities.some((c) => c.toLowerCase() === city.toLowerCase());
            return (
              <button
                key={city}
                type="button"
                onClick={() => toggleCity(city)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  isActive
                    ? 'border-[#0f4c3a] bg-[#0f4c3a] text-white shadow-sm'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-[#0f4c3a]/40'
                }`}
              >
                {city}
              </button>
            );
          })}
        </div>

        {/* Selected (incl. custom) chips */}
        {selectedCities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedCities.map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-700"
              >
                {c}
                <button
                  type="button"
                  onClick={() => toggleCity(c)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove"
                >
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Custom city input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustomCity();
              }
            }}
            placeholder="Add another city (e.g. Munich)"
            className="flex-grow px-3 py-2 rounded-lg bg-gray-50 border border-transparent text-sm focus:bg-white focus:border-[#0f4c3a]/30 focus:ring-2 focus:ring-[#0f4c3a]/10 transition-all outline-none placeholder:text-gray-400"
          />
          <button
            type="button"
            onClick={addCustomCity}
            disabled={!customInput.trim()}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={12} strokeWidth={3} />
            Add
          </button>
        </div>

        {unsupported.length > 0 && (
          <div className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 text-[11px] text-amber-900 leading-snug">
            <Info size={12} className="mt-0.5 flex-shrink-0 text-amber-600" />
            <span>
              We don&rsquo;t currently operate in{' '}
              <strong>{unsupported.join(', ')}</strong> but we may have partner options.
              Let&rsquo;s still talk.
            </span>
          </div>
        )}
      </div>

      {/* Headcount + Timeline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
            Approx headcount
          </label>
          <input
            type="text"
            value={headcount}
            onChange={(e) => setHeadcount(e.target.value)}
            placeholder="e.g. 20"
            className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-transparent text-sm focus:bg-white focus:border-[#0f4c3a]/30 focus:ring-2 focus:ring-[#0f4c3a]/10 transition-all outline-none placeholder:text-gray-400"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
            Timeline
          </label>
          <input
            type="text"
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            placeholder="e.g. Q3 2026 → Q1 2027"
            className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-transparent text-sm focus:bg-white focus:border-[#0f4c3a]/30 focus:ring-2 focus:ring-[#0f4c3a]/10 transition-all outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Notes */}
      <div className="mb-6">
        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
          Anything else
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Special requirements, parking, accessibility, budget caps, etc."
          rows={4}
          className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-transparent text-sm focus:bg-white focus:border-[#0f4c3a]/30 focus:ring-2 focus:ring-[#0f4c3a]/10 transition-all outline-none resize-none placeholder:text-gray-400"
        />
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className="w-full py-3 rounded-xl bg-[#0f4c3a] hover:bg-[#1A2E22] text-white font-bold text-sm transition-colors shadow-md flex items-center justify-center gap-2"
      >
        {hasAny ? 'Continue with brief' : 'Continue to scheduling'}
        <ArrowRight size={16} />
      </button>

      {!hasAny && onSkip && (
        <button
          type="button"
          onClick={onSkip}
          className="w-full mt-2 py-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[#0f4c3a] transition-colors"
        >
          book directly without details →
        </button>
      )}
    </div>
  );
};

const MeetingSchedule = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { reservations } = useReservation();
  const proposalNotes = location.state?.bookingNotes || '';
  // Trust the LIVE cart only bookingNotes in location.state is a snapshot
  // that can go stale if the user navigates back and clears their cart.
  const hasProposal = reservations.length > 0;

  // Discovery flow state 'picker' | 'brief' | 'iframe'.
  // hasProposal short-circuits to iframe (user already gave context).
  const [discoveryStep, setDiscoveryStep] = useState('picker');
  // Submitted brief (structured fields) for the discovery flow
  const [discoveryFields, setDiscoveryFields] = useState(null);
  // Live brief preview while user is filling out the form (mirrored to sidebar)
  const [livePreviewFields, setLivePreviewFields] = useState(null);

  // Format the structured fields → string used by Cal.com via URL notes param
  const formatBriefString = (fields) => {
    if (!fields) return '';
    const lines = [];
    if (fields.cities && fields.cities.length)
      lines.push(`Cities of interest: ${fields.cities.join(', ')}`);
    if (fields.headcount) lines.push(`Approx headcount: ${fields.headcount}`);
    if (fields.timeline) lines.push(`Timeline: ${fields.timeline}`);
    if (fields.notes) lines.push(`Additional notes:\n${fields.notes}`);
    if (fields.unsupported && fields.unsupported.length)
      lines.push(`(Heads up not currently served by Arrivio: ${fields.unsupported.join(', ')})`);
    return lines.join('\n\n');
  };

  const baseUrl =
    'https://cal.com/arrivio/strategy-call?theme=light&primaryColor=%230f4c3a&hideEventTypeDetails=false&layout=month_view';
  const finalNotes = hasProposal ? proposalNotes : formatBriefString(discoveryFields);
  const iframeUrl = finalNotes ? `${baseUrl}&notes=${encodeURIComponent(finalNotes)}` : baseUrl;

  const showPicker = !hasProposal && discoveryStep === 'picker';
  const showBrief = !hasProposal && discoveryStep === 'brief';
  const showIframe = hasProposal || discoveryStep === 'iframe';

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-background-neutral">
      <PropertiesNavbar />

      <main className="flex-grow pt-28 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <button
            onClick={() => navigate(hasProposal ? '/proposal' : '/properties')}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[#0f4c3a] transition-colors mb-8 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            {hasProposal ? 'Back to Proposal' : 'Back to Properties'}
          </button>

          <div className="mb-10">
            {hasProposal && <StepIndicator current={3} />}
            <h1 className="text-4xl md:text-5xl font-serif text-[#111827] font-medium mb-2">
              {hasProposal
                ? 'Schedule your call'
                : showBrief
                  ? 'Tell us a bit, then book'
                  : showIframe
                    ? 'Book your discovery call'
                    : 'How would you like to start?'}
            </h1>
            <p className="text-gray-500 text-base max-w-2xl">
              {hasProposal
                ? "Pick a time. We'll walk through your proposal, confirm pricing, and answer questions live."
                : showBrief
                  ? "A 60-second brief helps the call jump straight to what matters. All fields are optional skip what doesn't apply."
                  : showIframe
                    ? "Pick a time we'll talk through your needs, options, and pricing live."
                    : 'Browse properties first for a tailored proposal, or jump straight into a discovery call with our team.'}
            </p>
          </div>

          <div className={`flex flex-col lg:flex-row gap-8 ${showPicker ? 'lg:justify-center' : ''}`}>
            {/* Left column full width in picker mode (no sidebar) */}
            <div className={`w-full ${showPicker ? 'lg:max-w-3xl mx-auto' : 'lg:w-2/3'} lg:pt-6`}>
              {showPicker && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => navigate('/properties')}
                    className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:border-[#0f4c3a] hover:shadow-md transition-all text-left flex flex-col"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#0f4c3a]/10 text-[#0f4c3a] flex items-center justify-center mb-4">
                      <Building2 size={22} />
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[#0f4c3a] mb-1">
                      Recommended
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Browse properties first</h3>
                    <p className="text-sm text-gray-500 mb-5 flex-grow">
                      Pick units that fit, build a proposal, then book a call grounded in real
                      options.
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-[#0f4c3a] group-hover:translate-x-1 transition-transform">
                      Browse properties
                      <ArrowRight size={12} />
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDiscoveryStep('brief')}
                    className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:border-[#0f4c3a] hover:shadow-md transition-all text-left flex flex-col"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center mb-4">
                      <Calendar size={22} />
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                      Open conversation
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Book a discovery call</h3>
                    <p className="text-sm text-gray-500 mb-5 flex-grow">
                      Talk to us first. We&rsquo;ll learn about your team, cities, and timeline
                      and walk through options live.
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-gray-700 group-hover:text-[#0f4c3a] group-hover:translate-x-1 transition-all">
                      Schedule discovery call
                      <ArrowRight size={12} />
                    </span>
                  </button>
                </div>
              )}

              {showBrief && (
                <>
                  <button
                    type="button"
                    onClick={() => setDiscoveryStep('picker')}
                    className="text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-[#0f4c3a] transition-colors mb-3 inline-flex items-center gap-1"
                  >
                    <ArrowLeft size={11} />
                    Back to options
                  </button>
                  <BriefForm
                    onPreview={setLivePreviewFields}
                    onContinue={(fields) => {
                      setDiscoveryFields(fields);
                      setDiscoveryStep('iframe');
                    }}
                    onSkip={() => {
                      setDiscoveryFields(null);
                      setDiscoveryStep('iframe');
                    }}
                  />
                </>
              )}

              {showIframe && (
                <>
                  {!hasProposal && (
                    <button
                      type="button"
                      onClick={() => setDiscoveryStep('brief')}
                      className="text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-[#0f4c3a] transition-colors mb-3 inline-flex items-center gap-1"
                    >
                      <ArrowLeft size={11} />
                      Edit my brief
                    </button>
                  )}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <iframe
                      src={iframeUrl}
                      title="Arrivio Strategy Call"
                      className="w-full h-[700px] border-0 bg-white"
                      loading="lazy"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-3 leading-snug">
                    Powered by Cal.com.
                    {hasProposal
                      ? " Your proposal details will be sent to our team with the booking — no need to re-explain on the call."
                      : finalNotes
                        ? ' Your brief is included with the booking so we can prepare.'
                        : " Once you book, you'll get a confirmation email with the meeting link."}
                  </p>
                </>
              )}
            </div>

            {/* Right column: contextual sidebar (hidden in picker mode) */}
            {!showPicker && (
              <div className="w-full lg:w-1/3 lg:pt-[76px]">
                <div className="lg:sticky lg:top-28">
                  {hasProposal && <ProposalSummary reservations={reservations} />}
                  {!hasProposal && (showBrief || showIframe) && (
                    <DiscoveryCallInfo
                      fields={showBrief ? livePreviewFields : discoveryFields}
                      isLivePreview={showBrief}
                      onEdit={showIframe ? () => setDiscoveryStep('brief') : undefined}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MeetingSchedule;
