"use client";

import React, { useState } from "react";
import type { TouchpointConfig } from "@/lib/ezinfo-types";

interface ReviewComposerProps {
    config: TouchpointConfig;
    mode: "public" | "preview";
    accentColor: string;
    logEvent: (eventType: string) => void;
    onToast: (message: string) => void;
}

export default function ReviewComposer({ config, mode, accentColor, logEvent, onToast }: ReviewComposerProps) {
    const [reviewText, setReviewText] = useState("");
    const [preAiText, setPreAiText] = useState<string | null>(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState(false);

    /* ── AI Rewrite (replaces text in-place, stores original for revert) ── */
    const handleAiRewrite = async () => {
        if (!reviewText.trim()) return;
        setAiLoading(true);
        setAiError(false);
        try {
            const res = await fetch("/api/ezinfo/ai/rewrite", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug: config.slug, text: reviewText }),
            });
            const json = await res.json();
            if (json.rewritten_text) {
                setPreAiText(reviewText);
                setReviewText(json.rewritten_text);
                logEvent("ai_generate");
            } else setAiError(true);
        } catch {
            setAiError(true);
        } finally {
            setAiLoading(false);
        }
    };

    const handleUndoAi = () => {
        if (preAiText !== null) {
            setReviewText(preAiText);
            setPreAiText(null);
        }
    };

    /* ── Copy & Open Google Reviews (combined action) ── */
    const handleCopyAndReview = async () => {
        const text = reviewText;
        if (!text) return;

        // Copy to clipboard
        try {
            await navigator.clipboard.writeText(text);
        } catch {
            // Fallback for non-HTTPS or restricted contexts (e.g. NFC WebViews)
            const ta = document.createElement("textarea");
            ta.value = text;
            ta.style.position = "fixed";
            ta.style.opacity = "0";
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
        }

        onToast("Copied! Opening Google Reviews…");
        logEvent("copy_click");
        logEvent("google_click");

        // Open Google Reviews (no-op in preview)
        if (mode !== "preview" && config.google_review_url) {
            window.open(config.google_review_url, "_blank", "noopener");
        }
    };

    return (
        <div className="p-5 space-y-5">
            <div className="space-y-2 text-center">
                <h2 className="text-[20px] font-bold text-white tracking-tight leading-snug px-2">
                    {config.prompt_title || "Your prompt title"}
                </h2>
                <p className="text-[14px] text-muted/60 max-w-[320px] mx-auto leading-relaxed">
                    {config.prompt_subtitle || "Your prompt subtitle"}
                </p>
            </div>

            <div>
                <textarea
                    rows={4}
                    placeholder="Write your review here…"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[14px] text-foreground placeholder:text-muted/30 transition-all resize-none focus:border-accent/40 focus:bg-black/60 focus:outline-none focus:ring-4 focus:ring-accent/10"
                />
            </div>

            <div className="pt-2 space-y-2.5">
                {preAiText === null ? (
                    <>
                        <button
                            onClick={handleAiRewrite}
                            disabled={aiLoading || !reviewText.trim()}
                            className={`w-full shadow-lg shadow-black/20 rounded-xl px-4 py-3 text-[14px] font-bold text-white transition-all flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed`}
                            style={{ backgroundColor: accentColor }}
                        >
                            {aiLoading ? (
                                <>
                                    <svg className="h-4 w-4 animate-spin drop-shadow-sm" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Improving…
                                </>
                            ) : (
                                <>
                                    <svg className="h-4 w-4 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                                    </svg>
                                    Improve with AI
                                </>
                            )}
                        </button>

                        <div className="text-center pt-0.5">
                            <button
                                onClick={handleCopyAndReview}
                                disabled={!reviewText.trim() && !config.google_review_url}
                                className="text-[12px] font-medium text-muted/50 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Skip & go to Google Reviews →
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <button
                            onClick={handleCopyAndReview}
                            disabled={!reviewText.trim() && !config.google_review_url}
                            className={`w-full shadow-lg shadow-black/20 rounded-xl px-4 py-3 text-[14px] font-bold text-white transition-all flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed ${mode === "preview" ? "cursor-default" : ""}`}
                            style={{ backgroundColor: accentColor }}
                        >
                            <svg className="h-4 w-4 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                            </svg>
                            Copy & Open Google Reviews
                        </button>

                        {preAiText !== null && (
                            <div className="text-center pt-0.5">
                                <button
                                    onClick={handleUndoAi}
                                    className="inline-flex items-center justify-center gap-1.5 text-[13px] font-medium text-muted/50 hover:text-white transition-colors"
                                >
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                                    </svg>
                                    Undo AI changes
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
