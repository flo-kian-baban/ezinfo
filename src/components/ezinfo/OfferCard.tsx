"use client";

import React, { useState } from "react";
import type { TouchpointConfig } from "@/lib/ezinfo-types";

interface OfferCardProps {
    config: TouchpointConfig;
    mode: "public" | "preview";
    accentColor: string;
    logEvent: (eventType: string) => void;
    onToast: (message: string) => void;
}

export default function OfferCard({ config, mode, accentColor, logEvent, onToast }: OfferCardProps) {
    const [offerEmail, setOfferEmail] = useState("");
    const [offerClaiming, setOfferClaiming] = useState(false);
    const [offerClaimed, setOfferClaimed] = useState(false);
    const [offerError, setOfferError] = useState<string | null>(null);
    const [offerFormExpanded, setOfferFormExpanded] = useState(false);

    const handleClaimOffer = async (e: React.FormEvent) => {
        e.preventDefault();

        if (mode === "preview") {
            onToast("Preview mode: Lead would be captured here.");
            setOfferClaimed(true);
            return;
        }

        if (!offerEmail) {
            setOfferError("Please provide an email.");
            return;
        }

        setOfferClaiming(true);
        setOfferError(null);

        try {
            const res = await fetch("/api/ezinfo/offer/claim", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    touchpoint_id: config.touchpoint_id,
                    email: offerEmail,
                }),
            });

            const json = await res.json();
            if (res.ok && json.ok !== false) {
                setOfferClaimed(true);
                onToast("Offer claimed successfully!");
                logEvent("offer_claim");
            } else {
                setOfferError(json.error || "Failed to claim offer. Please try again.");
            }
        } catch (err) {
            setOfferError("An unexpected error occurred.");
        } finally {
            setOfferClaiming(false);
        }
    };

    if (!config.offer_enabled) return null;

    return (
        <div className="relative border-t border-white/5 bg-gradient-to-b from-white/[0.04] to-transparent px-5 py-4">
            {/* Decorative ambient glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}80, transparent)` }}></div>

            <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-accent/20 shadow-sm" style={{ background: `linear-gradient(135deg, ${accentColor}33, ${accentColor}0D)`, boxShadow: `0 0 15px -3px ${accentColor}80` }}>
                            <svg className="h-5 w-5 text-accent drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                            </svg>
                        </div>
                        <div className="space-y-0.5 pt-0.5 min-w-0">
                            <h3 className="text-[15px] font-extrabold text-white leading-tight truncate tracking-tight">
                                {offerClaimed ? "Offer Unlocked!" : (config.offer_title || "Special Offer")}
                            </h3>
                            {config.offer_description && !offerClaimed && (
                                <p className="text-[12px] text-muted/60 truncate">
                                    {config.offer_description}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {!offerClaimed ? (
                    <div className="pt-2">
                        <button
                            type="button"
                            onClick={() => setOfferFormExpanded(true)}
                            className="w-full rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 flex items-center justify-center px-4 py-3 text-[13px] font-bold text-white transition-all active:scale-[0.98]"
                        >
                            Claim this offer
                        </button>

                        {/* Modal Overlay */}
                        {offerFormExpanded && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
                                <div className="absolute inset-0" onClick={() => !offerClaiming && setOfferFormExpanded(false)}></div>
                                <div className="w-full max-w-sm relative z-10 bg-[#121212] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                                    {/* Modal Header */}
                                    <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/[0.02]">
                                        <h3 className="text-[15px] font-bold text-white flex items-center gap-2">
                                            <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
                                            </svg>
                                            Claim Offer
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={() => !offerClaiming && setOfferFormExpanded(false)}
                                            className="p-1.5 rounded-full hover:bg-white/10 text-muted/50 hover:text-white transition-colors disabled:opacity-50"
                                            disabled={offerClaiming}
                                        >
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Modal Body */}
                                    <form onSubmit={handleClaimOffer} className="space-y-4 p-5 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                                        <div className="space-y-2.5 relative z-10 pt-1">
                                            <label className="text-[12px] font-semibold text-muted/70 uppercase tracking-widest pl-1">Where should we send it?</label>
                                            <div className="relative">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                                    <svg className="h-4 w-4 text-muted/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                                    </svg>
                                                </div>
                                                <input
                                                    type="email"
                                                    placeholder="Email Address"
                                                    value={offerEmail}
                                                    onChange={(e) => setOfferEmail(e.target.value)}
                                                    className="w-full rounded-xl border border-white/10 bg-black/40 py-3.5 pl-10 pr-4 text-[14px] text-white placeholder-muted/50 transition-all duration-300 focus:border-accent/40 focus:ring-4 focus:ring-accent/10 focus:outline-none"
                                                    autoFocus
                                                />
                                            </div>
                                        </div>

                                        {offerError && (
                                            <p className="text-[12px] font-semibold text-red-400 text-center bg-red-400/10 py-2.5 rounded-lg relative z-10">{offerError}</p>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={offerClaiming || !offerEmail}
                                            className="w-full rounded-xl px-4 py-3.5 text-[14px] font-bold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2 relative z-10"
                                            style={{ backgroundColor: accentColor, boxShadow: `0 4px 20px -5px ${accentColor}60` }}
                                        >
                                            {offerClaiming ? (
                                                <svg className="h-5 w-5 animate-spin text-white/50" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12V0c-6.627 0-12 5.373-12 12h12z"></path>
                                                </svg>
                                            ) : "Submit & Reveal"}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="pt-3 animate-in fade-in zoom-in-95 duration-500">
                        <div className="relative overflow-hidden rounded-xl border border-accent/20 p-5 text-center" style={{ background: `linear-gradient(135deg, ${accentColor}1A, transparent)`, boxShadow: `0 0 30px -10px ${accentColor}40` }}>
                            {/* Confetti / Glow effect inside */}
                            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-accent/20 blur-2xl pointer-events-none"></div>
                            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-accent/20 blur-2xl pointer-events-none"></div>

                            <div className="relative z-10 space-y-3">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20 border border-accent/30 shadow-inner">
                                    <svg className="h-6 w-6 text-accent drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-lg font-extrabold tracking-tight text-white mb-0.5">Here is your offer!</h4>
                                    {config.offer_description && (
                                        <p className="text-[14px] font-bold text-accent break-words">{config.offer_description}</p>
                                    )}
                                </div>
                                {config.offer_terms && (
                                    <div className="pt-3 border-t border-accent/20">
                                        <p className="text-xs text-muted/70 leading-relaxed font-medium break-words max-w-sm mx-auto">{config.offer_terms}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
