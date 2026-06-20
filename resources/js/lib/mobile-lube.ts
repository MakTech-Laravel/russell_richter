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
    { label: 'Home', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'About', href: '#about' },
    { label: 'Fleet', href: '#fleet' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
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
