export const SERVICE_CATEGORIES = [
  { key: "all", label: "All" },
  { key: "arrival", label: "Arrival & Transport" },
  { key: "legal_tax", label: "Legal & Tax" },
  { key: "finance_insurance", label: "Finance & Health" },
  { key: "living", label: "Home Setup" },
  { key: "family_education", label: "Family & Edu" },
  { key: "integration", label: "Integration & Consulting" },
];

export const SERVICES_SEED = [
  {
    id: "svc-airport-meet-greet",
    name: "Airport Pickup + Meet & Greet",
    description: "Premium transfer from the airport with a consultant meet & greet and a 1-hour orientation to get you settled immediately.",
    detailedDescription: "A stress-free arrival experience. Our partner transfer provider will pick you up, and a dedicated Arrivio consultant will meet you at your new home to provide a 1-hour neighborhood orientation, covering local transit, supermarkets, and essential settling-in tips.",
    category: "arrival",
    priceEur: 200,
    iconKey: "Plane",
    isActive: true,
    features: [
      { label: "Transfer", value: "Premium sedan airport pickup" },
      { label: "Orientation", value: "1-hour neighborhood guide with consultant" },
      { label: "Pricing", value: "EUR 200 + VAT" }
    ]
  },
  {
    id: "svc-airport-pickup",
    name: "Airport Pickup Only",
    description: "Direct, comfortable point-to-point transfer with a professional driver in a premium sedan.",
    detailedDescription: "Seamless sedan transfer from the airport directly to your temporary or permanent housing. No consultant attendance, fully coordinated by Arrivio with our trusted premium transfer partners.",
    category: "arrival",
    priceEur: 100,
    iconKey: "Car",
    isActive: true,
    features: [
      { label: "Service", value: "Direct point-to-point transfer" },
      { label: "Vehicle", value: "Premium sedan to your housing" },
      { label: "Pricing", value: "EUR 100 + VAT" }
    ]
  },
  {
    id: "svc-anmeldung",
    name: "Anmeldung Accompaniment",
    description: "Complete assistance with registering your German address. We book the appointment and accompany you.",
    detailedDescription: "Navigating German bureaucracy made easy. We secure your Bürgeramt (citizens' office) appointment and provide a bilingual consultant to accompany you in person to successfully file your Anmeldebescheinigung (registration certificate).",
    category: "legal_tax",
    priceEur: 150,
    iconKey: "FileText",
    isActive: true,
    features: [
      { label: "Booking", value: "Bürgeramt appointment secured" },
      { label: "Support", value: "In-person consultant accompaniment" },
      { label: "Pricing", value: "EUR 150 + VAT" }
    ]
  },
  {
    id: "svc-bank",
    name: "Bank Account Opening",
    description: "Expert help selecting an expat-friendly bank and navigating the account opening process.",
    detailedDescription: "We assist you in selecting the right expat-friendly bank (e.g., N26, Revolut, or Sparkasse), fill out all necessary forms, and provide full support during the often tricky ID-verification process.",
    category: "finance_insurance",
    priceEur: 150,
    iconKey: "Landmark",
    isActive: true,
    features: [
      { label: "Selection", value: "N26, Revolut, Sparkasse & more" },
      { label: "Support", value: "Form-filling & ID-verification guidance" },
      { label: "Pricing", value: "EUR 150 + VAT" }
    ]
  },
  {
    id: "svc-krankenkasse",
    name: "Krankenkasse Setup",
    description: "Navigate the German public health insurance system. We help you choose a provider and apply.",
    detailedDescription: "Statutory health insurance (Krankenkasse) is mandatory. We help you choose the best provider for your needs (TK, AOK, Barmer, etc.), handle the application process, and ensure you obtain your Mitgliedsbescheinigung (membership certificate) promptly.",
    category: "finance_insurance",
    priceEur: 100,
    iconKey: "HeartPulse",
    isActive: true,
    features: [
      { label: "Selection", value: "Guidance on statutory health funds" },
      { label: "Outcome", value: "Obtain your Mitgliedsbescheinigung" },
      { label: "Pricing", value: "EUR 100 + VAT" }
    ]
  },
  {
    id: "svc-sim",
    name: "SIM Card / Mobile Setup",
    description: "Stay connected from day one. We help you choose a mobile provider and activate your SIM.",
    detailedDescription: "We assist with German carrier selection, plan setup, and immediate SIM activation so you have mobile data the moment you arrive. (Note: Resident pays the carrier directly for the ongoing plan).",
    category: "living",
    priceEur: 50,
    iconKey: "Smartphone",
    isActive: true,
    features: [
      { label: "Support", value: "Carrier selection & fast activation" },
      { label: "Note", value: "Data plan cost paid separately by resident" },
      { label: "Pricing", value: "EUR 50 + VAT" }
    ]
  },
  {
    id: "svc-utilities",
    name: "Utilities & Broadband Setup",
    description: "Complete home setup: electricity, water, gas, internet, and the mandatory broadcasting fee.",
    detailedDescription: "We take the hassle out of moving in. We arrange and set up contracts for electricity, water, gas, home internet (broadband), and register you for the mandatory GEZ broadcasting fee.",
    category: "living",
    priceEur: 150,
    iconKey: "Zap",
    isActive: true,
    features: [
      { label: "Contracts", value: "Electricity, water, gas, internet, GEZ" },
      { label: "Note", value: "Resident pays utility providers monthly" },
      { label: "Pricing", value: "EUR 150 + VAT" }
    ]
  },
  {
    id: "svc-liability",
    name: "Liability Insurance Intro",
    description: "An introduction to trusted insurance partners for personal liability and home contents insurance.",
    detailedDescription: "Personal liability insurance is virtually mandatory for renting in Germany. We provide a pure, vetted introduction to our trusted insurance partners so you can quickly secure the coverage you need.",
    category: "finance_insurance",
    priceEur: 100,
    iconKey: "ShieldCheck",
    isActive: true,
    features: [
      { label: "Service", value: "Vetted insurance partner introduction" },
      { label: "Note", value: "Resident contracts directly with insurer" },
      { label: "Pricing", value: "EUR 100 + VAT" }
    ]
  },
  {
    id: "svc-steuer-id",
    name: "Steuer-ID & Finanzamt",
    description: "Ensure you get your Tax ID on time. We also assist married couples with tax class changes.",
    detailedDescription: "We proactively track your Steuer-ID generation after your Anmeldung. For married couples, we assist with applying for a tax class change (e.g., 4/4 to 3/5) to optimize your monthly net income and ensure proper ELStAM setup.",
    category: "legal_tax",
    priceEur: 150,
    iconKey: "BadgeInfo",
    isActive: true,
    features: [
      { label: "Tracking", value: "Steuer-ID tracking post-Anmeldung" },
      { label: "Tax Class", value: "Change (e.g. 4/4 to 3/5) & ELStAM setup" },
      { label: "Pricing", value: "EUR 150 + VAT" }
    ]
  },
  {
    id: "svc-language",
    name: "Language Course Enrolment",
    description: "Immerse in the culture. We find the right language school for your level and handle enrolment.",
    detailedDescription: "We identify a suitable German language course that fits your current proficiency level and schedule, and handle the administrative enrolment process on your behalf. (Tuition is paid separately).",
    category: "family_education",
    priceEur: 100,
    iconKey: "GraduationCap",
    isActive: true,
    features: [
      { label: "Support", value: "School identification & full enrolment" },
      { label: "Note", value: "Tuition (EUR 100-1,500) paid separately" },
      { label: "Pricing", value: "EUR 100 + VAT" }
    ]
  },
  {
    id: "svc-school-1st",
    name: "School Search (1st child)",
    description: "Expert consultation and search for international or local public schools for your first child.",
    detailedDescription: "A comprehensive service to identify, apply to, and secure a spot in a suitable international, bilingual, or local public school for your first accompanying child, ensuring a smooth educational transition.",
    category: "family_education",
    priceEur: 400,
    iconKey: "School",
    isActive: true,
    features: [
      { label: "Service", value: "Consultation, search & secure placement" },
      { label: "Scope", value: "First accompanying child" },
      { label: "Pricing", value: "EUR 400 + VAT" }
    ]
  },
  {
    id: "svc-school-add",
    name: "School Search (Add. child)",
    description: "Additional school search and placement services for siblings.",
    detailedDescription: "Discounted additional school search, application, and placement service for each subsequent sibling after the first child.",
    category: "family_education",
    priceEur: 150,
    iconKey: "Users",
    isActive: true,
    features: [
      { label: "Service", value: "Search & secure placement for siblings" },
      { label: "Scope", value: "Per additional child" },
      { label: "Pricing", value: "EUR 150 + VAT" }
    ]
  },
  {
    id: "svc-kita",
    name: "Kita-Gutschein Application",
    description: "Navigate the complex German daycare system and apply for a Kita voucher.",
    detailedDescription: "We handle the bureaucratic process of applying for the subsidized Kita-Gutschein (daycare voucher) required to secure a place in a local German kindergarten or daycare.",
    category: "family_education",
    priceEur: 110,
    iconKey: "Baby",
    isActive: true,
    features: [
      { label: "Service", value: "Full subsidized Kita voucher application" },
      { label: "Scope", value: "Priced per child" },
      { label: "Pricing", value: "EUR 110 + VAT" }
    ]
  },
  {
    id: "svc-city-half",
    name: "City Orientation (Half-Day)",
    description: "A 3-hour guided tour tailored to your new neighborhood and daily life essentials.",
    detailedDescription: "A local expert consultant accompanies you for a 3-hour tour around your specific target neighborhood. Learn to navigate the public transit system, locate the best supermarkets, pharmacies, and discover local hotspots.",
    category: "integration",
    priceEur: 450,
    iconKey: "Map",
    isActive: true,
    features: [
      { label: "Duration", value: "3 hours (Half-Day guided tour)" },
      { label: "Focus", value: "Neighborhood, transit, essential shops" },
      { label: "Pricing", value: "EUR 450 + VAT" }
    ]
  },
  {
    id: "svc-city-full",
    name: "City Orientation (Full-Day)",
    description: "A comprehensive 6-hour orientation covering neighborhoods, schools, and cultural integration.",
    detailedDescription: "An extended 6-hour deep dive into your new city. This full-day tour includes everything in the half-day package, plus tailored visits to potential schools, kindergartens, or local doctors as needed.",
    category: "integration",
    priceEur: 750,
    iconKey: "MapPinned",
    isActive: true,
    features: [
      { label: "Duration", value: "6 hours (Full-Day extended tour)" },
      { label: "Focus", value: "Neighborhood + School/GP visits" },
      { label: "Pricing", value: "EUR 750 + VAT" }
    ]
  },
  {
    id: "svc-consultant-hourly",
    name: "Additional Consultant Time",
    description: "Flexible, on-demand support from our relocation experts for ad-hoc issues.",
    detailedDescription: "Book additional time with our expert consultants by the hour for any unplanned relocation work, specific custom requests, or complex troubleshooting beyond the scope of standard packages.",
    category: "integration",
    priceEur: 150,
    iconKey: "Clock",
    isActive: true,
    features: [
      { label: "Scope", value: "Flexible, on-demand custom support" },
      { label: "Rate", value: "Billed per hour of consultant time" },
      { label: "Pricing", value: "EUR 150 + VAT / hour" }
    ]
  },
  {
    id: "svc-buddy",
    name: "Cultural Integration Buddy",
    description: "A 3-month integration program pairing you with a local peer or consultant.",
    detailedDescription: "Ease into your new life with a dedicated peer or consultant-led buddy for your first 3 months. Receive ongoing advice on social nuances, cultural integration, and general life in Germany.",
    category: "integration",
    priceEur: 1200,
    iconKey: "UserPlus",
    isActive: true,
    features: [
      { label: "Duration", value: "First 3 months in Germany" },
      { label: "Service", value: "Dedicated local peer or consultant buddy" },
      { label: "Pricing", value: "EUR 1,200 + VAT" }
    ]
  },
  {
    id: "svc-retainer",
    name: "Extended Consultant Retainer",
    description: "Continuous peace of mind with a monthly retainer for priority consultant support.",
    detailedDescription: "For corporate partners who want to provide their employees with continuous, ongoing settlement support long after the initial relocation programme has concluded. Includes priority access to our consultants.",
    category: "integration",
    priceEur: 500,
    iconKey: "Briefcase",
    isActive: true,
    features: [
      { label: "Term", value: "Ongoing priority support (Monthly)" },
      { label: "Service", value: "Continuous post-arrival settlement help" },
      { label: "Pricing", value: "EUR 500 + VAT / month" }
    ]
  }
];
