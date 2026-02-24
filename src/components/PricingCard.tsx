import React from "react";
import Button from "./Button";
import Badge from "./Badge";

interface PricingCardProps {
    price: string;
    period: string;
    features: string[];
    badge?: string | null;
    ctaText: string;
    ctaHref: string;
}

export default function PricingCard({
    price,
    period,
    features,
    badge,
    ctaText,
    ctaHref,
}: PricingCardProps) {
    return (
        <div className="relative mx-auto max-w-lg overflow-hidden rounded-[32px] border border-white/10 bg-surface/40 backdrop-blur-xl p-10 hover:border-accent/30 transition-all duration-500 group">
            <div className="absolute top-0 right-0 -mr-24 -mt-24 h-80 w-80 rounded-full bg-accent/[0.03] blur-[100px] transition-all duration-500 group-hover:bg-accent/[0.06]" />
            <div className="absolute bottom-0 left-0 -ml-24 -mb-24 h-80 w-80 rounded-full bg-white/[0.02] blur-[100px] transition-all duration-500 group-hover:bg-white/[0.05]" />

            {badge && (
                <div className="mb-6 flex justify-center">
                    <Badge className="bg-accent text-white border-transparent shadow-neon">
                        {badge}
                    </Badge>
                </div>
            )}

            <div className="text-center relative z-10">
                <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold tracking-tighter text-white drop-shadow-sm">{price}</span>
                    <span className="text-lg text-muted/60">/{period}</span>
                </div>
                <p className="mt-4 text-sm font-medium text-accent uppercase tracking-widest">
                    All Systems Go
                </p>
            </div>

            <div className="my-8 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <ul className="space-y-4 relative z-10 mb-10">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-left">
                        <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                        </div>
                        <span className="text-[15px] text-muted group-hover:text-foreground transition-colors">
                            {feature}
                        </span>
                    </li>
                ))}
            </ul>

            <div className="relative z-10">
                <Button
                    variant="primary"
                    size="lg"
                    href={ctaHref}
                    className="w-full shadow-neon hover:scale-[1.02] transition-transform duration-200"
                >
                    {ctaText}
                </Button>
                <p className="mt-4 text-center text-xs text-muted/40">
                    Secure processing. Instant setup.
                </p>
            </div>
        </div>
    );
}
