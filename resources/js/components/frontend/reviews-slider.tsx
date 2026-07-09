import { useCallback, useEffect, useMemo, useState } from 'react';

import type { GoogleReview, GoogleReviewSummary } from '@/components/frontend/testimonials-section';

interface ReviewsSliderProps {
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

function ReviewCard({ review, showGoogleBadge }: { review: GoogleReview; showGoogleBadge: boolean }) {
    return (
        <div className="relative h-full rounded-2xl border border-white/5 bg-gradient-to-br from-ink-800 to-ink-900 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
                <StarRating rating={review.rating} />
                {showGoogleBadge && <GoogleBadge />}
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
    );
}

export function ReviewsSlider({ reviews, summary }: ReviewsSliderProps) {
    const slidesPerView = useMemo(() => {
        if (typeof window === 'undefined') {
            return 2;
        }

        return window.innerWidth >= 768 ? 2 : 1;
    }, []);

    const [visibleCount, setVisibleCount] = useState(slidesPerView);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const slideCount = Math.max(reviews.length, 1);
    const maxIndex = Math.max(slideCount - visibleCount, 0);

    useEffect(() => {
        const handleResize = () => {
            setVisibleCount(window.innerWidth >= 768 ? 2 : 1);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        setActiveIndex((current) => Math.min(current, maxIndex));
    }, [maxIndex]);

    const goToNext = useCallback(() => {
        setActiveIndex((current) => (current >= maxIndex ? 0 : current + 1));
    }, [maxIndex]);

    const goToPrevious = useCallback(() => {
        setActiveIndex((current) => (current <= 0 ? maxIndex : current - 1));
    }, [maxIndex]);

    useEffect(() => {
        if (isPaused || reviews.length <= visibleCount) {
            return;
        }

        const interval = window.setInterval(goToNext, 5000);

        return () => window.clearInterval(interval);
    }, [goToNext, isPaused, reviews.length, visibleCount]);

    if (reviews.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-white/10 bg-ink-800/40 p-10 text-center text-sm text-slate-400">
                No reviews yet. Be the first to share your experience on Google.
            </div>
        );
    }

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="overflow-hidden">
                <div
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{
                        transform: `translateX(-${(activeIndex * 100) / visibleCount}%)`,
                    }}
                >
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="shrink-0 px-2.5"
                            style={{ width: `${100 / visibleCount}%` }}
                        >
                            <ReviewCard review={review} showGoogleBadge={summary.source === 'google'} />
                        </div>
                    ))}
                </div>
            </div>

            {reviews.length > visibleCount && (
                <>
                    <button
                        type="button"
                        onClick={goToPrevious}
                        className="absolute top-1/2 left-0 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-ink-900/90 text-white transition hover:border-gold-500/40 hover:text-gold-300"
                        aria-label="Previous review"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={goToNext}
                        className="absolute top-1/2 right-0 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-ink-900/90 text-white transition hover:border-gold-500/40 hover:text-gold-300"
                        aria-label="Next review"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    <div className="mt-6 flex justify-center gap-2">
                        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => setActiveIndex(index)}
                                className={`h-2 rounded-full transition-all ${index === activeIndex ? 'w-6 bg-gold-400' : 'w-2 bg-white/20 hover:bg-white/40'
                                    }`}
                                aria-label={`Go to review slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
