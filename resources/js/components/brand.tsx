export function BrandMark({ className = 'h-10 w-10' }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 64 64"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Mobile Lube logo"
        >
            <defs>
                <linearGradient id="oilGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3a3a3a" />
                    <stop offset="60%" stopColor="#0a0a0a" />
                    <stop offset="100%" stopColor="#000" />
                </linearGradient>
                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fff1c6" />
                    <stop offset="45%" stopColor="#ffcc4a" />
                    <stop offset="100%" stopColor="#b45a00" />
                </linearGradient>
                <linearGradient id="gearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#e5e7eb" />
                    <stop offset="100%" stopColor="#4b5563" />
                </linearGradient>
            </defs>
            <g transform="translate(32 34)">
                {Array.from({ length: 10 }).map((_, i) => {
                    const angle = (i / 10) * 360;

                    return (
                        <rect
                            key={i}
                            x="-3"
                            y="-26"
                            width="6"
                            height="9"
                            rx="1.2"
                            fill="url(#gearGrad)"
                            transform={`rotate(${angle})`}
                        />
                    );
                })}
                <circle r="19" fill="url(#gearGrad)" />
                <circle r="13" fill="#0a0a0a" />
            </g>
            <path
                d="M22 6 C 26 14, 34 22, 34 32 C 34 41, 28 47, 22 47 C 16 47, 10 41, 10 32 C 10 22, 18 14, 22 6 Z"
                fill="url(#oilGrad)"
                stroke="url(#goldGrad)"
                strokeWidth="1.4"
            />
            <path
                d="M16 26 L22 22 L22 24.5 L26 24.5 L26 28 L22 28 L22 30.5 Z"
                fill="url(#goldGrad)"
            />
            <ellipse cx="17" cy="14" rx="1.4" ry="2.6" fill="#fff" opacity="0.6" />
        </svg>
    );
}

export function FullLogo({ className = '' }: { className?: string }) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <BrandMark className="h-11 w-11 shrink-0" />
            <div className="leading-none">
                <div className="flex items-baseline gap-1">
                    <span className="text-chrome text-xl font-black tracking-tight">MOBILE</span>
                </div>
                <div className="text-gold-grad -mt-1 text-2xl font-black italic tracking-tight">LUBE</div>
                <div className="mt-0.5 text-[8px] font-bold uppercase tracking-[0.25em] text-gold-400">
                    We Come To You
                </div>
            </div>
        </div>
    );
}

export function CompactLogo({ className = '' }: { className?: string }) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <BrandMark className="h-9 w-9 shrink-0" />
            <div className="leading-tight">
                <div className="text-sm font-black tracking-tight text-white">
                    MOBILE <span className="text-gold-grad">LUBE</span>
                </div>
                <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gold-400/80">
                    LLC · We come to you
                </div>
            </div>
        </div>
    );
}
