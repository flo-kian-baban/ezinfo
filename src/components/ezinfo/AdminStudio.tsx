"use client";

import React, { useState, useEffect, useRef } from "react";
import type { TouchpointConfig, SurveyQuestion } from "@/lib/ezinfo-types";
import MiddlewarePreview from "./MiddlewarePreview";
import { ThemeSection, ContentSection, GoogleSection, OfferSection } from "./BuilderSections";
import SurveyBuilderSection from "./SurveyBuilderSection";
import SubmissionsPanel from "./SubmissionsPanel";

/* ─── Props ─── */
interface AdminStudioProps {
    initialConfig: TouchpointConfig;
    adminEmail: string;
}

/* ─── Admin Studio ─── */
export default function AdminStudio({ initialConfig, adminEmail }: AdminStudioProps) {
    const [saved, setSaved] = useState<TouchpointConfig>(initialConfig);
    const [draft, setDraft] = useState<TouchpointConfig>(initialConfig);
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");
    const [showSubmissions, setShowSubmissions] = useState(false);
    const topRef = useRef<HTMLDivElement>(null);
    const phoneRef = useRef<HTMLDivElement>(null);
    const [phoneScale, setPhoneScale] = useState(1);

    const hasChanges = JSON.stringify(draft) !== JSON.stringify(saved);

    /* Track phone frame width to ensure 375px logical viewport */
    useEffect(() => {
        if (!phoneRef.current) return;
        const observer = new ResizeObserver((entries) => {
            const width = entries[0].contentRect.width;
            setPhoneScale(width / 375); // 375px base logical width
        });
        observer.observe(phoneRef.current);
        return () => observer.disconnect();
    }, []);

    /* Clear save toast */
    useEffect(() => {
        if (saveStatus === "idle") return;
        const t = setTimeout(() => setSaveStatus("idle"), 2500);
        return () => clearTimeout(t);
    }, [saveStatus]);

    /* ── Update draft field ── */
    const update = <K extends keyof TouchpointConfig>(key: K, value: TouchpointConfig[K]) => {
        setDraft((prev) => ({ ...prev, [key]: value }));
    };

    /* ── Update survey questions ── */
    const updateQuestions = (questions: SurveyQuestion[]) => {
        setDraft((prev) => ({ ...prev, survey_questions: questions }));
    };

    /* ── Save ── */
    const handleSave = async () => {
        setSaving(true);
        setSaveStatus("idle");
        try {
            const res = await fetch("/api/ezinfo/touchpoint/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    slug: draft.slug,
                    email: adminEmail,
                    patch: {
                        enabled: draft.enabled,
                        primary_mode: draft.primary_mode,
                        redirect_mode: draft.redirect_mode,
                        google_review_enabled: draft.google_review_enabled,
                        google_review_url: draft.google_review_url,
                        prompt_title: draft.prompt_title,
                        prompt_subtitle: draft.prompt_subtitle,
                        ai_enabled: draft.ai_enabled,
                        theme_bg_color: draft.theme_bg_color,
                        theme_shade_color: draft.theme_shade_color,
                        loyalty_offer_enabled: draft.offer_enabled,
                        loyalty_offer_title: draft.offer_title,
                        loyalty_offer_description: draft.offer_description,
                        loyalty_offer_terms: draft.offer_terms,
                        survey_questions: draft.survey_questions || [],
                    },
                }),
            });
            const json = await res.json();
            if (json.ok) {
                setSaved({ ...draft });
                setSaveStatus("saved");
            } else {
                setSaveStatus("error");
            }
        } catch {
            setSaveStatus("error");
        } finally {
            setSaving(false);
        }
    };

    const isGoogleMode = draft.primary_mode === "GOOGLE_REVIEWS";
    const isSurveyMode = draft.primary_mode === "SURVEY";

    return (
        <div className="w-full h-screen flex flex-col bg-[#141414] overflow-hidden" ref={topRef}>
            {/* ══════════════ TOP BUILDER BAR ══════════════ */}
            <div className="sticky top-0 z-50 bg-[#141414] border-b border-white/5">
                <div className="mx-auto max-w-[1440px] flex items-center justify-between px-6 py-3">
                    {/* Left */}
                    <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-accent" />
                        <span className="text-xs font-semibold text-foreground tracking-wide">Builder</span>
                        <span className="text-muted/30">/</span>
                        <span className="text-xs text-muted/60">{draft.slug}</span>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-3">
                        {/* Submissions */}
                        <button
                            onClick={() => setShowSubmissions(true)}
                            className="rounded-md px-3 py-1.5 text-xs font-medium text-muted/70 bg-white/5 hover:bg-white/10 border border-white/5 transition-colors flex items-center gap-1.5"
                        >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                            </svg>
                            Submissions
                        </button>

                        {/* Status */}
                        <div className="hidden sm:flex items-center text-xs font-medium">
                            {hasChanges && saveStatus === "idle" && (
                                <span className="text-amber-400">Unsaved changes</span>
                            )}
                            {saveStatus === "saved" && (
                                <span className="text-emerald-400">Saved ✓</span>
                            )}
                            {saveStatus === "error" && (
                                <span className="text-red-400">Save failed</span>
                            )}
                        </div>

                        {/* Save */}
                        <button
                            onClick={handleSave}
                            disabled={saving || !hasChanges}
                            className="rounded-md px-4 py-1.5 text-xs font-semibold text-white bg-accent hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? "Saving…" : "Save"}
                        </button>
                    </div>
                </div>
            </div>

            {/* ══════════════ WORKSPACE ══════════════ */}
            <div className="flex-1 w-full max-w-[1440px] mx-auto px-6 py-4 overflow-hidden min-h-0">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">

                    {/* ────── LEFT: Builder Controls (6 cols) ────── */}
                    <div className="lg:col-span-6 xl:col-span-6 h-full overflow-y-auto pr-2 scrollbar-thin">
                        <div className="bg-[#1e1e1e] rounded-xl border border-white/5 p-6 shadow-sm">

                            {/* ── Mode Picker ── */}
                            <div className="py-6 border-b border-white/5 space-y-4">
                                <h3 className="text-sm font-semibold text-foreground/90">Primary Mode</h3>
                                <div className="flex rounded-md bg-black/40 p-1 border border-white/5">
                                    <button
                                        onClick={() => update("primary_mode", "GOOGLE_REVIEWS")}
                                        className={`flex-1 rounded px-3 py-2 text-xs font-medium transition-colors flex items-center justify-center gap-2 ${isGoogleMode
                                            ? "bg-white/10 text-foreground"
                                            : "text-muted/60 hover:text-muted"
                                            }`}
                                    >
                                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        Google Reviews
                                    </button>
                                    <button
                                        onClick={() => update("primary_mode", "SURVEY")}
                                        className={`flex-1 rounded px-3 py-2 text-xs font-medium transition-colors flex items-center justify-center gap-2 ${isSurveyMode
                                            ? "bg-white/10 text-foreground"
                                            : "text-muted/60 hover:text-muted"
                                            }`}
                                    >
                                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                                        </svg>
                                        Survey
                                    </button>
                                </div>
                                <p className="text-xs text-muted/50">
                                    {isGoogleMode
                                        ? "Visitors will be guided to leave a Google Review."
                                        : "Visitors will complete your custom survey."
                                    }
                                </p>
                            </div>

                            {/* Mode-specific sections */}
                            {isGoogleMode && (
                                <>
                                    <ContentSection draft={draft} update={update} />
                                    <GoogleSection draft={draft} update={update} />
                                </>
                            )}

                            {isSurveyMode && (
                                <SurveyBuilderSection
                                    questions={draft.survey_questions || []}
                                    onChange={updateQuestions}
                                />
                            )}

                            {/* Common sections */}
                            <ThemeSection draft={draft} update={update} />
                            <OfferSection draft={draft} update={update} />
                        </div>
                    </div>

                    {/* ────── RIGHT: Preview Canvas (6 cols) ────── */}
                    <div className="lg:col-span-6 xl:col-span-6 h-full flex flex-col items-center justify-center p-4">
                        {/* Device Frame Wrapper */}
                        <div ref={phoneRef} className="relative w-full max-w-[400px] max-h-[866px] aspect-[9/19.5] rounded-[48px] border-[8px] border-[#2a2a2a] bg-black shadow-2xl flex-shrink-0 mx-auto overflow-hidden ring-1 ring-white/10 flex flex-col">

                            {/* Device 'Island' or Notch simulation */}
                            <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-50 pointer-events-none">
                                <div className="w-1/3 h-5 bg-[#2a2a2a] rounded-b-xl" />
                            </div>

                            {/* Canvas top bar indicates Live Preview */}
                            <div className="absolute top-8 w-full flex justify-center z-40 pointer-events-none">
                                <div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                                    <span className="text-[10px] font-bold tracking-widest uppercase text-white/90">Live Preview</span>
                                </div>
                            </div>

                            {/* Scaled viewport container to ensure 375px logical width */}
                            <div className="flex-1 w-full bg-black relative overflow-hidden isolate">
                                <div
                                    className="absolute top-0 left-0 bg-black flex flex-col overflow-y-auto scrollbar-hide touch-pan-y"
                                    style={{
                                        width: '375px',
                                        height: `${100 / phoneScale}%`,
                                        transform: `scale(${phoneScale})`,
                                        transformOrigin: 'top left'
                                    }}
                                >
                                    <MiddlewarePreview config={draft} mode="preview" />
                                </div>
                            </div>

                            {/* Device Bottom Indicator Line */}
                            <div className="absolute bottom-2 inset-x-0 h-1 flex justify-center z-50 pointer-events-none">
                                <div className="w-1/3 h-1 bg-white/30 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Submissions Panel (modal) ── */}
            {showSubmissions && (
                <SubmissionsPanel
                    slug={draft.slug}
                    adminEmail={adminEmail}
                    onClose={() => setShowSubmissions(false)}
                />
            )}
        </div>
    );
}
