export const MOBILE_LUBE = {
    name: 'Mobile Lube, LLC',
    phone: '(361) 655-5323',
    phoneHref: 'tel:+13616555323',
    email: 'mobilelube08@gmail.com',
    emailHref: 'mailto:mobilelube08@gmail.com',
    domain: 'mobilelube.co',
    serviceArea: 'Victoria County, Texas',
    hours: 'Mon–Fri, 8 AM – 6 PM',
    tagline: 'WE COME TO YOU',
    subtitle: 'Home, office or jobsite. Save time, skip the waiting room.',
} as const;

export const NAV_LINKS = [
    { label: 'Services', href: '#services' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Why Us', href: '#why' },
    { label: 'Service Areas', href: '#areas' },
    { label: 'FAQ', href: '#faq' },
] as const;

export const TRUST_STATS = [
    { value: '12k+', label: 'Vehicles Serviced' },
    { value: '4.9★', label: 'Avg. Rating' },
    { value: '30 min', label: 'Avg. Oil Change' },
    { value: '100%', label: 'Spill-Free Tech' },
] as const;

export const HOW_IT_WORKS = [
    { num: '01', title: 'Book online', description: 'Pick your service, vehicle, time and location in under 60 seconds.' },
    { num: '02', title: 'We come to you', description: 'Our certified tech arrives in a fully equipped service truck.' },
    { num: '03', title: 'Get back to your day', description: 'Spill-free service, digital invoice, and service history tracking.' },
] as const;

export const TESTIMONIALS = [
    {
        name: 'Jessica R.',
        date: 'April 2026',
        text: 'They came out to my house the same day I called and changed my brakes. The convenience alone was amazing — friendly, professional, and very knowledgeable. Will absolutely use again!',
    },
    {
        name: 'Taylor Miller',
        date: 'March 2026',
        text: 'Highly recommend for your next oil change! Handled my truck with total professionalism — incredibly fast. No fighting traffic or sitting in a waiting room.',
    },
    {
        name: 'Papa Jon',
        date: 'March 2026',
        text: 'Fantastic! Professional and knowledgeable. I use Mobile Lube for all 3 of my family vehicles AND our church buses and vans.',
    },
    {
        name: 'Holli Carroll',
        date: 'Feb 2026',
        text: 'Jeep needed brakes and an oil change. Showed up on time, fast, efficient, and professional. The system is clean — no mess. Five stars all the way.',
    },
] as const;

export const SERVICE_AREAS = [
    'Victoria, TX',
    'Port Lavaca, TX',
    'Edna, TX',
    'Goliad, TX',
    'Cuero, TX',
    'Yoakum, TX',
    'Hallettsville, TX',
    'Refugio, TX',
] as const;

export const SERVICE_HIGHLIGHTS = [
    {
        title: 'Full Synthetic Oil Change',
        icon: 'droplets',
        description: 'Premium synthetic oil, filter, fluid inspection, tire pressure & battery check.',
    },
    {
        title: 'Conventional Oil Change',
        icon: 'wrench',
        description: 'Up to 6 quarts, filter replacement, and multi-point inspection.',
    },
    {
        title: 'Diesel Oil Change',
        icon: 'truck',
        description: 'Heavy-duty diesel oil, filter, fluid inspection for trucks & fleets.',
    },
    {
        title: 'Filter Replacement',
        icon: 'filter',
        description: 'Engine & cabin air filters — free install with any oil change.',
    },
    {
        title: 'Tire Rotation',
        icon: 'circle',
        description: 'Manufacturer-recommended rotation with tread depth inspection.',
    },
    {
        title: 'Battery Replacement',
        icon: 'battery',
        description: 'Testing, terminal cleaning, and on-site battery replacement.',
    },
] as const;

export const PRICING_PACKAGES = [
    {
        name: 'Full Synthetic Oil Change',
        price: 120,
        popular: true,
        features: [
            'Up to 6 quarts premium synthetic oil',
            'Premium oil filter',
            'Fluid inspection',
            'Tire pressure check',
            'Battery health check',
            'Additional oil: $9.00/qt',
        ],
    },
    {
        name: 'Conventional Oil Change',
        price: 99,
        popular: false,
        features: [
            'Up to 6 quarts of oil',
            'Filter replacement',
            'Multi-point inspection',
            'On-site mobile service',
            'Additional oil: $6.00/qt',
        ],
    },
    {
        name: 'Diesel Oil Change',
        price: 180,
        popular: false,
        features: [
            'Up to 13 quarts diesel-rated oil',
            'Heavy-duty oil filter',
            'Multi-point inspection',
            'Fluid inspection',
            'Additional oil: $9.00/qt',
            'DEF: $8.00/gallon',
        ],
    },
] as const;

export const ADD_ON_SERVICES = [
    {
        name: 'Engine Air Filter',
        price: '$25 install + filter cost',
        note: 'Free install with oil change',
    },
    {
        name: 'Cabin Air Filter',
        price: '$25 install + filter cost',
        note: 'Free install with oil change',
    },
    {
        name: 'Tire Rotation',
        price: '$50',
        note: null,
    },
    {
        name: 'Wiper Blade Replacement',
        price: '$25 install + wiper cost',
        note: 'Free install with oil change',
    },
    {
        name: 'Battery Replacement',
        price: '$275',
        note: 'Includes battery & labor for most vehicles',
    },
] as const;

export const WHY_CHOOSE = [
    { title: 'Convenience', description: 'We come to your home, office, or job site — no waiting rooms.' },
    { title: 'Time-Saving', description: 'Get back to your day while we handle your vehicle maintenance.' },
    { title: 'Transparent Pricing', description: 'Clear, upfront pricing with no hidden fees or surprises.' },
    { title: 'Quality Products', description: 'Premium oils, filters, and parts that meet manufacturer specs.' },
    { title: 'Experienced Technicians', description: 'Professional, reliable service you can trust every visit.' },
    { title: 'Flexible Scheduling', description: 'Book appointments that fit your busy schedule.' },
] as const;

export const FAQ_ITEMS = [
    {
        question: 'What is Mobile Lube?',
        answer: 'Mobile Lube is a convenient on-site service that brings professional oil changes and vehicle maintenance directly to your home, workplace, or job site in Victoria County, Texas.',
    },
    {
        question: 'What types of vehicles do you service?',
        answer: 'We service most cars, trucks, SUVs, and light-duty diesel pickups. Contact us for specialty or fleet vehicles.',
    },
    {
        question: 'How long does an oil change take?',
        answer: 'A typical oil change takes about 30 minutes, depending on the vehicle and additional services requested.',
    },
    {
        question: 'What area do you serve?',
        answer: 'We proudly serve all of Victoria County, Texas — home, office, or job site.',
    },
    {
        question: 'What are your hours?',
        answer: 'Monday through Friday, 8 AM to 6 PM. Contact us to schedule your appointment.',
    },
    {
        question: 'Do you offer fleet services?',
        answer: 'Yes! We offer customized fleet maintenance plans for businesses. Submit a fleet inquiry and we will contact you with pricing.',
    },
] as const;
