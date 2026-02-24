"use client";

import React, { useState, useCallback, useEffect } from "react";
import type { TouchpointConfig } from "@/lib/ezinfo-types";
import { validateGoogleReviewUrl } from "@/lib/validate-google-url";
import { sanitizeHex } from "@/lib/validate-hex-color";
import ReviewComposer from "./ReviewComposer";
import SurveyFlow from "./SurveyFlow";
import OfferCard from "./OfferCard";
import Toast from "./Toast";

/** Shared offer card element used across modes */
function renderOfferCard(config: TouchpointConfig, mode: "public" | "preview", accentColor: string, logEvent: (e: string) => void, setToast: (m: string) => void) {
    return (
        <OfferCard
            config={config}
            mode={mode}
            accentColor={accentColor}
            logEvent={logEvent}
            onToast={setToast}
        />
    );
}

/**
 * Render-only middleware preview.
 * Used by public page (mode="public") and admin live preview (mode="preview").
 * Handles GOOGLE_REVIEWS (assist/direct) and SURVEY modes.
 */

interface MiddlewarePreviewProps {
    config: TouchpointConfig;
    mode: "public" | "preview";
}

export default function MiddlewarePreview({ config, mode }: MiddlewarePreviewProps) {
    const [toast, setToast] = useState<string | null>(null);

    const isSurveyMode = config.primary_mode === "SURVEY";

    /* ── Auto-redirect for direct mode (public only, Google Reviews mode only) ── */
    useEffect(() => {
        if (isSurveyMode) return;
        if (mode === "public" && config.redirect_mode === "direct" && config.google_review_url) {
            const urlCheck = validateGoogleReviewUrl(config.google_review_url);
            if (!urlCheck.valid) return;
            fetch("/api/ezinfo/event", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ touchpoint_id: config.touchpoint_id, event_type: "google_click" }),
            }).catch(() => { });
            const t = setTimeout(() => {
                window.location.href = config.google_review_url;
            }, 800);
            return () => clearTimeout(t);
        }
    }, [mode, config.redirect_mode, config.google_review_url, config.touchpoint_id, isSurveyMode]);

    /* ── Log event (public only) ── */
    const logEvent = useCallback(
        (eventType: string) => {
            if (mode !== "public") return;
            fetch("/api/ezinfo/event", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    touchpoint_id: config.touchpoint_id,
                    event_type: eventType,
                }),
            }).catch(() => { });
        },
        [config.touchpoint_id, mode]
    );

    useEffect(() => {
        logEvent("page_view");
    }, [logEvent]);

    const accentColor = sanitizeHex(config.theme_shade_color)
        || sanitizeHex(config.brand_accent)
        || "#f15a2d";

    const styleBlock = `
        .ez-preview-container .text-accent { color: ${accentColor} !important; }
        .ez-preview-container .text-accent\\/70 { color: ${accentColor}b3 !important; }
        .ez-preview-container .bg-accent\\/5 { background-color: ${accentColor}0d !important; }
        .ez-preview-container .bg-accent\\/10 { background-color: ${accentColor}1a !important; }
        .ez-preview-container .bg-accent\\/20 { background-color: ${accentColor}33 !important; }
        .ez-preview-container .bg-accent\\/60 { background-color: ${accentColor}99 !important; }
        .ez-preview-container .border-accent\\/10 { border-color: ${accentColor}1a !important; }
        .ez-preview-container .border-accent\\/20 { border-color: ${accentColor}33 !important; }
        .ez-preview-container .border-accent\\/30 { border-color: ${accentColor}4d !important; }
        .ez-preview-container .ring-accent\\/30 { box-shadow: 0 0 0 1px ${accentColor}4d !important; }
        .ez-preview-container input:focus,
        .ez-preview-container textarea:focus {
            border-color: ${accentColor} !important;
            box-shadow: 0 0 0 1px ${accentColor} !important;
        }
    `;

    /* ── Wrapper Styles ── */
    const wrapperStyle: React.CSSProperties = {
        backgroundColor: sanitizeHex(config.theme_bg_color) || undefined,
        minHeight: mode === "public" ? "100vh" : "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    };

    const shadeStyle: React.CSSProperties = {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "50%",
        background: config.theme_shade_color
            ? `radial-gradient(ellipse at top, ${config.theme_shade_color}40, transparent 70%)`
            : undefined,
        pointerEvents: "none",
    };

    /* ── Copy & Open Google Reviews (for direct mode) ── */
    const handleCopyAndReview = async () => {
        logEvent("copy_click");
        logEvent("google_click");
        if (mode !== "preview" && config.google_review_url) {
            window.open(config.google_review_url, "_blank", "noopener");
        }
    };

    /* ── Direct redirect mode (Google Reviews only) ── */
    if (!isSurveyMode && config.redirect_mode === "direct") {
        return (
            <div style={wrapperStyle} className="ez-preview-container">
                {config.theme_shade_color && <div style={shadeStyle} />}
                <style dangerouslySetInnerHTML={{ __html: styleBlock }} />
                <div className="w-full max-w-lg mx-auto relative z-10 px-6">
                    <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-surface/80 backdrop-blur-xl shadow-xl shadow-black/40">
                        <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />

                        <div className="p-8 space-y-6 text-center">
                            {/* Spinner — static in preview */}
                            <div className="flex justify-center pb-2">
                                <div
                                    className={`h-12 w-12 rounded-full border-[3px] border-white/10 border-t-accent ${mode === "public" ? "animate-spin" : ""}`}
                                    style={{ borderTopColor: accentColor }}
                                />
                            </div>

                            <div className="space-y-3">
                                <h2 className="text-[22px] font-bold text-white tracking-tight leading-snug">
                                    Redirecting to Google Reviews…
                                </h2>
                                <p className="text-[15px] text-muted/60 max-w-[280px] mx-auto leading-relaxed">
                                    You&apos;ll be taken there in a moment.
                                </p>
                            </div>

                            {mode === "preview" && (
                                <div className="pt-2">
                                    <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-accent/80">
                                        <span className="h-2 w-2 rounded-full bg-accent/60" />
                                        Preview — would redirect now
                                    </span>
                                </div>
                            )}

                            <div className="pt-4">
                                <button
                                    onClick={handleCopyAndReview}
                                    className={`w-full shadow-lg shadow-black/20 rounded-xl px-4 py-4 text-[15px] font-bold text-white transition-all flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] ${mode === "preview" ? "cursor-default" : ""}`}
                                    style={{ backgroundColor: accentColor }}
                                >
                                    <svg className="h-5 w-5 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                    </svg>
                                    Open Google Reviews
                                </button>
                            </div>
                        </div>

                        {/* Offer inside direct mode container */}
                        {renderOfferCard(config, mode, accentColor, logEvent, setToast)}

                        <div className="border-t border-white/5 px-6 py-3 text-center">
                            <span className="text-[9px] text-muted/30 uppercase tracking-widest">Powered by EZinfo</span>
                        </div>
                    </div>
                </div>

                {toast && <Toast message={toast} onDone={() => setToast(null)} />}
            </div>
        );
    }

    /* ── Survey mode OR Assist mode ── */
    return (
        <div style={wrapperStyle} className="ez-preview-container">
            {config.theme_shade_color && <div style={shadeStyle} />}
            <style dangerouslySetInnerHTML={{ __html: styleBlock }} />
            <div className="w-full max-w-lg mx-auto relative z-10 px-4">
                <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-surface/80 backdrop-blur-xl shadow-xl shadow-black/40">
                    <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />

                    {isSurveyMode ? (
                        <SurveyFlow
                            config={config}
                            mode={mode}
                            accentColor={accentColor}
                            logEvent={logEvent}
                            onToast={setToast}
                            renderOffer={() => renderOfferCard(config, mode, accentColor, logEvent, setToast)}
                        />
                    ) : (
                        <>
                            <ReviewComposer
                                config={config}
                                mode={mode}
                                accentColor={accentColor}
                                logEvent={logEvent}
                                onToast={setToast}
                            />

                            {/* Offer inside assist mode container */}
                            {renderOfferCard(config, mode, accentColor, logEvent, setToast)}
                        </>
                    )}

                    <div className="border-t border-white/5 px-6 py-3 text-center">
                        <span className="text-[9px] text-muted/30 uppercase tracking-widest">Powered by EZinfo</span>
                    </div>
                </div>
            </div>

            {toast && <Toast message={toast} onDone={() => setToast(null)} />}
        </div>
    );
}
