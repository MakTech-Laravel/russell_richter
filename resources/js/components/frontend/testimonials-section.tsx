import { FrontendSection } from '@/components/frontend/frontend-container';
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

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex text-gold-400" aria-label={`${rating} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, index) => (
                <svg
                    key={index}
                    className={`h-4 w-4 ${index < rating ? 'text-gold-400' : 'text-slate-600'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M10 1.5l2.6 5.3 5.9.8-4.3 4.1 1 5.8L10 14.8l-5.3 2.7 1-5.8L1.5 7.6l5.9-.8z" />
                </svg>
            ))}
        </div>
    );
}

function GoogleBadge() {
    return (
        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" aria-hidden="true">
                <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
            </svg>
            Google Review
        </div>
    );
}

function ReviewerAvatar({ name, photoUrl }: { name: string; photoUrl: string | null }) {
    const initials = name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    if (photoUrl) {
        return (
            <img
                src={photoUrl}
                alt={name}
                className="h-9 w-9 rounded-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
            />
        );
    }

    return (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-gold-300 to-gold-600 text-sm font-bold text-ink-900">
            {initials}
        </div>
    );
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
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:mt-14">
                {reviews.map((review) => (
                    <div
                        key={review.id}
                        className="relative rounded-2xl border border-white/5 bg-gradient-to-br from-ink-800 to-ink-900 p-5 sm:p-6"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <StarRating rating={review.rating} />
                            {summary.source === 'google' && <GoogleBadge />}
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-slate-300">&ldquo;{review.text}&rdquo;</p>
                        <div className="mt-4 flex items-center gap-3 border-t border-white/5 pt-4">
                            <ReviewerAvatar name={review.name} photoUrl={review.photoUrl} />
                            <div>
                                <div className="text-sm font-bold text-white">{review.name}</div>
                                <div className="text-[11px] text-slate-500">{review.date}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {(summary.profileUrl || summary.source === 'google') && (
                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    {summary.source === 'google' && summary.profileUrl && (
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
                    )}
                </div>
            )}
        </FrontendSection>
    );
}
