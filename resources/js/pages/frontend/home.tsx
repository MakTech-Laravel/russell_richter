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
import {
    ADD_ON_SERVICES,
    FAQ_ITEMS,
    MOBILE_LUBE,
    PRICING_PACKAGES,
    SERVICE_HIGHLIGHTS,
    WHY_CHOOSE,
} from '@/lib/mobile-lube';

export default function Home() {
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
            <PricingSection packages={PRICING_PACKAGES} addOns={ADD_ON_SERVICES} />
            <WhyChooseSection items={WHY_CHOOSE} />
            <HowItWorksSection />
            <TestimonialsSection />
            <AreasServedSection />
            <FleetSection />
            <FaqSection items={FAQ_ITEMS} />
            <CtaSection />
        </FrontendLayout>
    );
}
