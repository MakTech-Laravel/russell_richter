import { Head } from '@inertiajs/react';

import { AreasServedSection } from '@/components/frontend/areas-served-section';
import { CtaSection } from '@/components/frontend/cta-section';
import { FaqSection } from '@/components/frontend/faq-section';
import { FleetSection } from '@/components/frontend/fleet-section';
import { HeroSection } from '@/components/frontend/hero-section';
import { HowItWorksSection } from '@/components/frontend/how-it-works-section';
import { PricingSection } from '@/components/frontend/pricing-section';
import { ServicesSection } from '@/components/frontend/services-section';
import { TestimonialsSection } from '@/components/frontend/testimonials-section';
import { TrustBarSection } from '@/components/frontend/trust-bar-section';
import { WhyChooseSection } from '@/components/frontend/why-choose-section';
import FrontendLayout from '@/layouts/frontend-layout';
import { MOBILE_LUBE, SERVICE_HIGHLIGHTS, WHY_CHOOSE } from '@/lib/mobile-lube';

interface PricingPackage {
    id: number;
    name: string;
    price: number;
    popular: boolean;
    features: string[];
}

interface AddOnService {
    id: number;
    name: string;
    price: string;
    note: string | null;
}

interface FaqItem {
    question: string;
    answer: string;
}

interface HomeProps {
    pricingPackages: PricingPackage[];
    addOnServices: AddOnService[];
    faqs: FaqItem[];
}

export default function Home({ pricingPackages, addOnServices, faqs }: HomeProps) {
    return (
        <FrontendLayout>
            <Head title={`${MOBILE_LUBE.name} | Mobile Oil Change in ${MOBILE_LUBE.serviceArea}`}>
                <meta
                    head-key="description"
                    name="description"
                    content={`${MOBILE_LUBE.tagline} — Professional mobile oil changes and maintenance in ${MOBILE_LUBE.serviceArea}. ${MOBILE_LUBE.subtitle}`}
                />
            </Head>

            <HeroSection />
            <TrustBarSection />
            <ServicesSection services={SERVICE_HIGHLIGHTS} />
            <PricingSection packages={pricingPackages} addOns={addOnServices} />
            <WhyChooseSection items={WHY_CHOOSE} />
            <HowItWorksSection />
            <TestimonialsSection />
            <AreasServedSection />
            <FleetSection />
            <FaqSection items={faqs} />
            <CtaSection />
        </FrontendLayout>
    );
}
