"use client";

import React, { useState } from "react";
import Button from "./Button";
import { validateGoogleReviewUrl } from "@/lib/validate-google-url";

export default function OrderForm() {
    const [submitted, setSubmitted] = useState<false | { slug: string; already_exists?: boolean }>(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /* ── Required fields ── */
    const [businessName, setBusinessName] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [email, setEmail] = useState("");
    const [googleReviewLink, setGoogleReviewLink] = useState("");
    const [urlError, setUrlError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setUrlError(null);

        // Client-side Google URL validation
        const urlCheck = validateGoogleReviewUrl(googleReviewLink);
        if (!urlCheck.valid) {
            setUrlError(urlCheck.error || "Invalid Google Review link.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/ezinfo/apply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    business_name: businessName,
                    owner_name: ownerName,
                    email,
                    google_review_url: googleReviewLink,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.ok) {
                const msg = data.error || "Something went wrong. Please try again.";
                console.error("[OrderForm] API error:", data);
                setError(msg);
                return;
            }

            // data.provisioned contains the slug; data.already_exists indicates idempotent return
            setSubmitted({
                slug: data.provisioned.slug,
                already_exists: data.already_exists || false,
            });
        } catch (err) {
            console.error("[OrderForm] Network error:", err);
            setError("Network error — please check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        const publicUrl = typeof window !== 'undefined' ? `${window.location.origin}/ezinfo/${submitted.slug}` : ``;
        const adminUrl = typeof window !== 'undefined' ? `${window.location.origin}/ezinfo/${submitted.slug}/admin` : ``;

        return (
            <div className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-[24px] border border-accent/20 bg-surface/80 backdrop-blur-xl p-8 sm:p-12 text-center shadow-lg shadow-accent/5 ring-1 ring-white/5">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
                <div className="flex flex-col items-center gap-6">
                    <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 text-accent shadow-neon ring-1 ring-accent/20">
                        <svg className="h-10 w-10 animate-pulse-glow" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                    </div>
                    <h3 className="text-3xl font-bold text-white tracking-tight">
                        {submitted.already_exists ? "Welcome Back" : "System Online"}
                    </h3>
                    <p className="text-lg text-muted/80 max-w-md leading-relaxed mb-4">
                        {submitted.already_exists
                            ? "Your touchpoint was already provisioned. Here are your existing links."
                            : "Your touchpoint has been instantly provisioned. You can access it right now."}
                    </p>

                    <div className="w-full space-y-4 text-left">
                        {/* Public Link */}
                        <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-accent mb-2">Public Touchpoint</label>
                            <div className="flex items-center justify-between gap-4">
                                <a href={publicUrl} target="_blank" rel="noreferrer" className="truncate text-sm font-mono text-white/90 hover:text-accent transition-colors">
                                    {publicUrl}
                                </a>
                                <button
                                    onClick={() => navigator.clipboard.writeText(publicUrl)}
                                    className="shrink-0 rounded p-2 hover:bg-white/10 text-muted hover:text-white transition-colors"
                                    title="Copy Link"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                </button>
                            </div>
                        </div>

                        {/* Admin Link */}
                        <div className="rounded-xl border border-accent/20 bg-accent/5 p-4 relative overflow-hidden">
                            <div className="absolute right-0 top-0 w-32 h-32 bg-accent/10 blur-3xl -mr-10 -mt-10 rounded-full" />
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#FF5A00] mb-2 relative z-10">Admin Dashboard</label>
                            <div className="flex items-center justify-between gap-4 relative z-10">
                                <a href={adminUrl} target="_blank" rel="noreferrer" className="truncate text-sm font-mono text-white/90 hover:text-accent transition-colors">
                                    {adminUrl}
                                </a>
                                <button
                                    onClick={() => navigator.clipboard.writeText(adminUrl)}
                                    className="shrink-0 rounded p-2 hover:bg-white/10 text-muted hover:text-white transition-colors"
                                    title="Copy Link"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <a href={adminUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-wider text-black hover:bg-white transition-colors shadow-neon">
                        Enter Command Dashboard
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </a>
                </div>
            </div>
        );
    }

    const inputClasses =
        "w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3.5 text-base text-foreground placeholder:text-muted/30 transition-all duration-300 focus:border-accent/50 focus:bg-accent/[0.03] focus:outline-none focus:ring-1 focus:ring-accent/20 hover:border-white/20";

    const labelClasses = "block text-xs font-semibold uppercase tracking-wider text-muted/70 mb-2 ml-1";

    return (
        <form
            onSubmit={handleSubmit}
            className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-[24px] border border-white/10 bg-surface/50 backdrop-blur-xl p-8 sm:p-12 shadow-2xl"
        >
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

            {/* ── Header ── */}
            <div className="mb-10 text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3 py-1 mb-4">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                    </span>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-accent">Secure Connection</span>
                </div>
                <h3 className="text-2xl font-bold text-white">Initialize Order</h3>
            </div>

            {/* ── Required fields ── */}
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="businessName" className={labelClasses}>
                            Business Name <span className="text-accent">*</span>
                        </label>
                        <input
                            id="businessName"
                            type="text"
                            required
                            placeholder="e.g. Bright Smile Dental"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            className={inputClasses}
                        />
                    </div>
                    <div>
                        <label htmlFor="ownerName" className={labelClasses}>
                            Owner / Manager <span className="text-accent">*</span>
                        </label>
                        <input
                            id="ownerName"
                            type="text"
                            required
                            placeholder="e.g. Jane Smith"
                            value={ownerName}
                            onChange={(e) => setOwnerName(e.target.value)}
                            className={inputClasses}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="email" className={labelClasses}>
                        Email Address <span className="text-accent">*</span>
                    </label>
                    <input
                        id="email"
                        type="email"
                        required
                        placeholder="you@business.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClasses}
                    />
                </div>

                <div>
                    <label htmlFor="googleReviewLink" className={labelClasses}>
                        Google Review Link <span className="text-accent">*</span>
                    </label>
                    <input
                        id="googleReviewLink"
                        type="url"
                        required
                        placeholder="https://g.page/r/..."
                        value={googleReviewLink}
                        onChange={(e) => {
                            setGoogleReviewLink(e.target.value);
                            if (urlError) setUrlError(null);
                        }}
                        className={`${inputClasses} ${urlError ? 'border-red-500/50 focus:ring-red-500/30' : ''}`}
                    />
                    {urlError ? (
                        <p className="mt-2 text-xs text-red-400 ml-1">{urlError}</p>
                    ) : (
                        <p className="mt-2 text-xs text-muted/50 ml-1">
                            Must be a Google Review link (g.page, google.com/maps, or maps.app.goo.gl).
                        </p>
                    )}
                </div>
            </div>



            {/* ── Admin dashboard callout ── */}
            <div className="mt-10 rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-colors">
                <div className="flex items-start gap-4">
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent ring-1 ring-accent/40">
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white mb-1">Advanced Configuration Access</h4>
                        <p className="text-xs text-muted leading-relaxed">
                            Upon activation, you will receive credentials for the Command Dashboard. From there, you can execute survey modules, enable feedback loops, and manage secondary link vectors.
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Error message ── */}
            {error && (
                <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                </div>
            )}

            {/* ── Submit ── */}
            <div className="mt-10">
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={loading}
                    className="w-full h-16 text-lg font-bold tracking-wide uppercase shadow-neon disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-3">
                            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Processing…
                        </span>
                    ) : (
                        "Initialize Order"
                    )}
                </Button>
            </div>
        </form>
    );
}
