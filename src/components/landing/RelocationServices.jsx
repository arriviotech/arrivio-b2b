import React from 'react';
import { motion } from 'framer-motion';
import {
  Plane, Car, FileText, BadgeInfo, Landmark, HeartPulse, ShieldCheck,
  Smartphone, Zap, GraduationCap, School, Users, Baby,
  Map, MapPinned, Clock, UserPlus, Briefcase,
  Scale, Home, Compass, CreditCard, X, Settings, Check
} from 'lucide-react';
import { SERVICE_CATEGORIES, SERVICES_SEED } from '../../data/servicesData';

const ICON_MAP = {
  Plane, Car, FileText, BadgeInfo, Landmark, HeartPulse, ShieldCheck,
  Smartphone, Zap, GraduationCap, School, Users, Baby,
  Map, MapPinned, Clock, UserPlus, Briefcase,
};

const CATEGORY_META = {
  arrival:           { icon: Plane,         tagline: 'Airport pickup & first-day support' },
  legal_tax:         { icon: Scale,         tagline: 'Registration, Tax ID & compliance' },
  finance_insurance: { icon: CreditCard,    tagline: 'Banking, insurance & health cover' },
  living:            { icon: Home,          tagline: 'SIM cards, utilities & broadband' },
  family_education:  { icon: GraduationCap, tagline: 'Schools, Kita & language courses' },
  integration:       { icon: Compass,       tagline: 'City tours & cultural settling-in' },
};

const CATEGORIES = SERVICE_CATEGORIES.filter((c) => c.key !== 'all');

const CONCISE_DESCRIPTIONS = {
  'svc-airport-meet-greet': "Airport transfer with a consultant meet & greet and local orientation.",
  'svc-airport-pickup': "Private sedan transfer from the airport directly to your new home.",
  'svc-anmeldung': "Bürgeramt appointment booking with in-person accompaniment and support.",
  'svc-steuer-id': "Steuer-ID tracking and tax class change support after your Anmeldung.",
  'svc-bank': "Bank selection guidance and full account opening support for expats.",
  'svc-krankenkasse': "Health insurer selection and application support for new arrivals.",
  'svc-liability': "Vetted referrals for personal liability and home contents insurance.",
  'svc-sim': "Carrier selection and SIM activation so you're connected on arrival.",
  'svc-utilities': "Full setup of broadband, electricity, gas, and GEZ broadcasting fee.",
  'svc-school-search': "School search, visits arranged, and full enrolment support for your children.",
  'svc-kita': "Subsidised Kita voucher application and daycare placement support.",
  'svc-language': "Language school matching and enrolment handled for your level.",
  'svc-city-orientation': "Guided tour covering transit, local shops, and neighbourhood essentials.",
  'svc-consultant-support': "Flexible hourly sessions or a monthly retainer for ongoing settling-in help.",
  'svc-buddy': "A 3-month buddy program for cultural integration and local guidance.",
};

const LANDING_SERVICES = (() => {
  const list = [];
  let schoolSearchAdded = false;
  let cityOrientationAdded = false;
  let consultantSupportAdded = false;

  for (const s of SERVICES_SEED) {
    if (s.id === 'svc-school-1st' || s.id === 'svc-school-add') {
      if (!schoolSearchAdded) {
        list.push({
          id: 'svc-school-search',
          name: 'School Search & Placement',
          description: CONCISE_DESCRIPTIONS['svc-school-search'],
          category: 'family_education',
          iconKey: 'School'
        });
        schoolSearchAdded = true;
      }
    } else if (s.id === 'svc-city-half' || s.id === 'svc-city-full') {
      if (!cityOrientationAdded) {
        list.push({
          id: 'svc-city-orientation',
          name: 'City Orientation',
          description: CONCISE_DESCRIPTIONS['svc-city-orientation'],
          category: 'integration',
          iconKey: 'Map'
        });
        cityOrientationAdded = true;
      }
    } else if (s.id === 'svc-consultant-hourly' || s.id === 'svc-retainer') {
      if (!consultantSupportAdded) {
        list.push({
          id: 'svc-consultant-support',
          name: 'Consultant Support & Retainer',
          description: CONCISE_DESCRIPTIONS['svc-consultant-support'],
          category: 'integration',
          iconKey: 'Clock'
        });
        consultantSupportAdded = true;
      }
    } else {
      list.push({
        ...s,
        description: CONCISE_DESCRIPTIONS[s.id] || s.description
      });
    }
  }
  return list;
})();

const RelocationServices = () => {
  return (
    <section className="py-28 bg-[#f5f5f3] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#0f4c3a]/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 max-w-2xl mx-auto flex flex-col items-center"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="h-px w-8 bg-gray-300" />
            <span className="text-[11px] font-semibold text-gray-400 tracking-[0.2em] uppercase">Our Services</span>
            <span className="h-px w-8 bg-gray-300" />
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-5 text-center">
            Beyond Housing{' '}
            <br className="hidden md:block" />
            <span className="font-bold text-[#0f4c3a]">Complete Relocation Support</span>
          </h2>
          <p className="text-base md:text-lg text-gray-500 max-w-xl leading-relaxed mx-auto">
            We don't just provide apartments. We ensure your employees have everything they need to settle in smoothly from day one.
          </p>
        </motion.div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {CATEGORIES.map((cat, i) => {
            const meta = CATEGORY_META[cat.key];
            const CatIcon = meta?.icon ?? Briefcase;
            const catServices = LANDING_SERVICES.filter((s) => s.category === cat.key);

            return (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="relative group h-full"
              >
                <div
                  className="bg-white p-6 sm:p-7 rounded-2xl transition-all duration-500 h-full flex flex-col items-start text-left relative z-10 landing-card-hover border border-gray-100/50 shadow-sm"
                >
                  {/* Icon Container */}
                  <div className="w-14 h-14 rounded-full border border-gray-300 flex items-center justify-center mb-6 text-gray-650 group-hover:bg-[#0f4c3a] group-hover:border-[#0f4c3a] group-hover:text-white transition-all duration-500 shrink-0">
                    <CatIcon className="w-7 h-7" />
                  </div>

                  {/* Title */}
                  <h3 className="font-heading text-lg font-bold text-gray-900 mb-2 group-hover:text-[#0f4c3a] transition-colors duration-300">
                    {cat.label}
                  </h3>

                  {/* Divider Line */}
                  <div className="w-6 h-px bg-gray-200 mb-3 group-hover:w-10 transition-all duration-300" />

                  {/* Description / Tagline */}
                  <p className="text-gray-500 leading-relaxed text-sm font-medium mb-4">
                    {meta?.tagline}
                  </p>

                  {/* Checklist Stacked List */}
                  <div className="w-full border-t border-gray-100 mt-2 pt-5 space-y-4 flex-grow">
                    {catServices.map((service) => {
                      const SvcIcon = ICON_MAP[service.iconKey] || Check;
                      return (
                        <div key={service.id} className="text-left flex items-start gap-2.5">
                          <div className="w-5 h-5 rounded-full bg-[#0f4c3a]/10 flex items-center justify-center text-[#0f4c3a] shrink-0 mt-0.5">
                            <SvcIcon className="w-3 h-3" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-heading text-sm font-bold text-gray-900 leading-snug">
                              {service.name}
                            </h4>
                            <p className="text-xs text-gray-500 leading-relaxed mt-0.5 font-medium line-clamp-2">
                              {service.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default RelocationServices;
