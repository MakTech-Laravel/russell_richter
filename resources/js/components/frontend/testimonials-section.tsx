import { FrontendSection } from '@/components/frontend/frontend-container';
import { ReviewsSlider } from '@/components/frontend/reviews-slider';
import { SectionHeader } from '@/components/frontend/section-header';

export interface GoogleReview {
    id: string;
    name: string;
    date: string;
    text: string;
    rating: number;
    photoUrl: string | null;
}

export interface GoogleReviewSummary {
    rating: number | null;
    totalReviews: number | null;
    source: 'google' | 'local';
    profileUrl: string | null;
    writeReviewUrl: string;
}

interface TestimonialsSectionProps {
    reviews: GoogleReview[];
    summary: GoogleReviewSummary;
}

export function TestimonialsSection({ reviews, summary }: TestimonialsSectionProps) {
    return (
        <FrontendSection>
            <SectionHeader
                tag="Customer Reviews"
                title={
                    <>
                        What your <span className="text-gold-grad">neighbors</span> say
                    </>
                }
                subtitle={
                    summary.rating
                        ? summary.source === 'google'
                            ? `${summary.rating.toFixed(1)}★ average from ${summary.totalReviews ?? reviews.length} Google reviews`
                            : `${summary.rating.toFixed(1)}★ average from ${summary.totalReviews ?? reviews.length} customer reviews`
                        : undefined
                }
            />
            <div className="mt-8 flex justify-center">
                <a
                    href={summary.writeReviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-btn-primary inline-flex h-12 items-center justify-center gap-2 rounded-lg px-6 text-sm font-bold uppercase tracking-wider"
                >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M10 1.5l2.6 5.3 5.9.8-4.3 4.1 1 5.8L10 14.8l-5.3 2.7 1-5.8L1.5 7.6l5.9-.8z" />
                    </svg>
                    Write a Review
                </a>
            </div>
            <div className="mt-8 lg:mt-14">
                <ReviewsSlider reviews={reviews} summary={summary} />
            </div>
            {summary.source === 'google' && summary.profileUrl && (
                <div className="mt-8 flex justify-center">
                    <a
                        href={summary.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-btn-outline inline-flex h-12 items-center justify-center gap-2 rounded-lg px-6 text-sm font-bold uppercase tracking-wider"
                    >
                        See all reviews on Google
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                </div>
            )}
        </FrontendSection>
    );
}
