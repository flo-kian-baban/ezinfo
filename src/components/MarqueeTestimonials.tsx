"use client";

import React from "react";

interface Testimonial {
    name: string;
    role: string;
    content: string;
    company?: string;
}

interface MarqueeTestimonialsProps {
    testimonials: Testimonial[];
}

function TestimonialCard({ name, role, content, company }: Testimonial) {
    return (
        <div className="mx-4 flex w-[360px] flex-shrink-0 flex-col justify-between rounded-[24px] border border-white/5 bg-surface p-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)] transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:bg-surface-hover hover:shadow-lg select-none">
            <div className="mb-6">
                <div className="flex gap-2 mb-4 opacity-80">
                    {[1, 2, 3, 4, 5].map(star => (
                        <svg key={star} className="w-3.5 h-3.5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    ))}
                </div>
                <p className="text-[15px] font-medium leading-relaxed text-muted">
                    &ldquo;{content}&rdquo;
                </p>
            </div>

            <div className="flex items-center gap-4 pt-6 mt-auto border-t border-white/5">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-foreground">
                    {name.charAt(0)}
                </div>
                <div>
                    <p className="text-sm font-bold text-foreground">{name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted">
                        <span>{role}</span>
                        {company && (
                            <>
                                <span className="h-0.5 w-0.5 rounded-full bg-muted" />
                                <span className="text-muted/80">{company}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function MarqueeTestimonials({
    testimonials,
}: MarqueeTestimonialsProps) {
    const row1 = testimonials.slice(0, Math.ceil(testimonials.length / 2));
    const row2 = testimonials.slice(Math.ceil(testimonials.length / 2));

    return (
        <div className="flex flex-col gap-6 overflow-hidden py-10">
            {/* Gradient Overlay - Dark theme */}
            <div className="relative w-full">
                <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-32 bg-gradient-to-r from-[var(--color-background)] to-transparent" />
                <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-32 bg-gradient-to-l from-[var(--color-background)] to-transparent" />

                {/* Row 1 — left */}
                <div className="flex overflow-hidden py-4">
                    <div className="animate-marquee flex">
                        {[...row1, ...row1, ...row1].map((t, i) => (
                            <TestimonialCard key={`r1-${i}`} {...t} />
                        ))}
                    </div>
                </div>

                {/* Row 2 — right */}
                <div className="flex overflow-hidden py-4">
                    <div className="animate-marquee-reverse flex">
                        {[...row2, ...row2, ...row2].map((t, i) => (
                            <TestimonialCard key={`r2-${i}`} {...t} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
