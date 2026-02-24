import React from "react";
import type { TouchpointConfig } from "@/lib/ezinfo-types";
import { Section, Toggle, inputClass, labelClass } from "./AdminPrimitives";
import ColorField, { BG_PRESETS, ACCENT_PRESETS } from "./ColorField";

/* ─── Shared props for all builder sections ─── */
interface SectionProps {
    draft: TouchpointConfig;
    update: <K extends keyof TouchpointConfig>(key: K, value: TouchpointConfig[K]) => void;
}

/* ─── Routing Mode ─── */
export function RoutingSection({ draft, update }: SectionProps) {
    const isAssist = draft.redirect_mode === "assist";
    return (
        <Section title="Routing Mode">
            <div className="flex rounded-md bg-black/40 p-1 border border-white/5">
                <button
                    onClick={() => update("redirect_mode", "assist")}
                    className={`flex-1 rounded px-3 py-1.5 text-xs font-medium transition-colors ${isAssist ? "bg-white/10 text-foreground" : "text-muted/60 hover:text-muted"
                        }`}
                >
                    Review Assist
                </button>
                <button
                    onClick={() => update("redirect_mode", "direct")}
                    className={`flex-1 rounded px-3 py-1.5 text-xs font-medium transition-colors ${!isAssist ? "bg-white/10 text-foreground" : "text-muted/60 hover:text-muted"
                        }`}
                >
                    Direct Redirect
                </button>
            </div>
            <p className="text-xs text-muted/60">
                {isAssist
                    ? "Show the EZinfo page with AI helper to polish reviews, then send users to Google."
                    : "Skip the EZinfo page entirely and send users straight to Google Reviews."}
            </p>
        </Section>
    );
}

/* ─── Theme Colors ─── */
export function ThemeSection({ draft, update }: SectionProps) {
    return (
        <Section title="Theme Colors">
            <ColorField
                label="Background Color"
                value={draft.theme_bg_color || ""}
                onChange={(v) => update("theme_bg_color", v)}
                presets={BG_PRESETS}
                placeholder="#0F172A"
                hint="The main background color of the page."
            />
            <div className="mt-4">
                <ColorField
                    label="Accent / Button Color"
                    value={draft.theme_shade_color || ""}
                    onChange={(v) => update("theme_shade_color", v)}
                    presets={ACCENT_PRESETS}
                    placeholder="#f15a2d"
                    hint="Controls the CTA button, top line, and shade gradient."
                />
            </div>
        </Section>
    );
}

/* ─── Content (Assist only) ─── */
export function ContentSection({ draft, update }: SectionProps) {
    return (
        <Section title="Content" show={draft.redirect_mode === "assist" && draft.primary_mode !== "SURVEY"}>
            <div>
                <label className={labelClass}>Prompt Title</label>
                <input
                    value={draft.prompt_title}
                    onChange={(e) => update("prompt_title", e.target.value)}
                    className={inputClass}
                    placeholder="How was your visit?"
                />
            </div>
            <div>
                <label className={labelClass}>Prompt Subtitle</label>
                <textarea
                    rows={2}
                    value={draft.prompt_subtitle}
                    onChange={(e) => update("prompt_subtitle", e.target.value)}
                    className={`${inputClass} resize-none`}
                    placeholder="Write a quick review and we'll help polish it."
                />
            </div>
        </Section>
    );
}

/* ─── Google Review Destination ─── */
export function GoogleSection({ draft, update }: SectionProps) {
    return (
        <Section title="Google Review Destination">
            <div>
                <label className={labelClass}>Google Place Review URL</label>
                <input
                    value={draft.google_review_url}
                    onChange={(e) => update("google_review_url", e.target.value)}
                    className={inputClass}
                    placeholder="https://g.page/r/..."
                />
            </div>
            <div className="flex items-center justify-between">
                <button
                    onClick={() => window.open(draft.google_review_url, "_blank", "noopener")}
                    disabled={!draft.google_review_url}
                    className="text-xs text-accent hover:text-accent-hover font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Test link ↗
                </button>
            </div>
        </Section>
    );
}

/* ─── Offer ─── */
export function OfferSection({ draft, update }: SectionProps) {
    return (
        <Section title="Offer">
            <Toggle
                label="Enable Offer"
                description="Display an optional offer on your page (not gated by reviews)."
                checked={!!draft.offer_enabled}
                onChange={(v) => update("offer_enabled", v)}
            />

            {draft.offer_enabled && (
                <div className="space-y-4 pt-2 border-t border-white/5 mt-4">
                    <div>
                        <label className={labelClass}>Offer Title</label>
                        <input
                            value={draft.offer_title || ""}
                            onChange={(e) => update("offer_title", e.target.value)}
                            className={inputClass}
                            placeholder="e.g. 10% Off Your Next Visit"
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Offer Description</label>
                        <textarea
                            rows={2}
                            value={draft.offer_description || ""}
                            onChange={(e) => update("offer_description", e.target.value)}
                            className={`${inputClass} resize-none`}
                            placeholder="Enjoy a discount on us as a thank you!"
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Terms & Conditions (Optional)</label>
                        <textarea
                            rows={2}
                            value={draft.offer_terms || ""}
                            onChange={(e) => update("offer_terms", e.target.value)}
                            className={`${inputClass} resize-none`}
                            placeholder="e.g. Cannot be combined with other offers. One per customer."
                        />
                    </div>
                </div>
            )}
        </Section>
    );
}
