import { createAnonClient } from "@/lib/supabase";
import MiddlewarePreview from "@/components/ezinfo/MiddlewarePreview";
import type { TouchpointConfig } from "@/lib/ezinfo-types";
import { sanitizeHex } from "@/lib/validate-hex-color";
import type { Metadata } from "next";

/* ── M-2: Per-slug OG metadata for social sharing ── */
export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const supabase = createAnonClient();
    const { data } = await supabase
        .from("ezinfo_public_touchpoints")
        .select("business_name, slug")
        .eq("slug", slug)
        .single();

    const title = data?.business_name
        ? `${data.business_name} — EZinfo`
        : "EZinfo";
    const description = data?.business_name
        ? `Leave a review for ${data.business_name}. Powered by EZinfo.`
        : "Your branded review page powered by EZinfo.";

    return {
        title,
        description,
        openGraph: { title, description, type: "website" },
        twitter: { card: "summary", title, description },
    };
}
export default async function EzinfoPublicPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const supabase = createAnonClient();

    const { data, error } = await supabase
        .from("ezinfo_public_touchpoints")
        .select("slug, business_name, touchpoint_id, enabled, primary_mode, redirect_mode, google_review_enabled, google_review_url, prompt_title, prompt_subtitle, ai_enabled, brand_name, brand_logo_url, brand_accent, theme_bg_color, theme_shade_color, loyalty_offer_enabled, loyalty_offer_title, loyalty_offer_description, loyalty_offer_terms")
        .eq("slug", slug)
        .single();

    /* Fetch survey questions if in survey mode */
    let surveyQuestions: { id: string; sort_order: number; question_type: string; question_text: string; options: string[] }[] = [];
    if (data && data.primary_mode === "SURVEY") {
        const { data: qData } = await supabase
            .from("survey_questions")
            .select("id, sort_order, question_type, question_text, options")
            .eq("touchpoint_id", data.touchpoint_id)
            .order("sort_order", { ascending: true });
        surveyQuestions = (qData || []) as typeof surveyQuestions;
    }

    /* ── Not Found: clean branded fallback ── */
    if (error || !data) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="w-full max-w-md mx-auto">
                    <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-surface/80 backdrop-blur-xl shadow-xl shadow-black/40">
                        <div className="h-1 w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        <div className="p-8 sm:p-10 text-center space-y-5">
                            <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-white/5 border border-white/10">
                                <svg className="h-8 w-8 text-muted/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                </svg>
                            </div>
                            <h1 className="text-xl font-bold text-white">Page Not Found</h1>
                            <p className="text-sm text-muted/60 leading-relaxed">
                                This EZinfo page doesn&apos;t exist or has been removed. If you scanned a card, the business may not have set up their page yet.
                            </p>
                        </div>
                        <div className="border-t border-white/5 px-6 py-3 text-center">
                            <span className="text-[9px] text-muted/30 uppercase tracking-widest">Powered by EZinfo</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /* ── Disabled: clean fallback with optional Google Reviews button ── */
    if (!data.enabled) {
        const accentColor = sanitizeHex(data.theme_shade_color) || sanitizeHex(data.brand_accent) || "#f15a2d";
        const hasValidGoogleUrl = data.google_review_url?.startsWith("https://");

        return (
            <div
                className="flex items-center justify-center min-h-screen p-4"
                style={{ backgroundColor: sanitizeHex(data.theme_bg_color) || undefined }}
            >
                <div className="w-full max-w-md mx-auto">
                    <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-surface/80 backdrop-blur-xl shadow-xl shadow-black/40">
                        <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />
                        <div className="p-8 sm:p-10 text-center space-y-5">
                            <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-white/5 border border-white/10">
                                <svg className="h-8 w-8 text-muted/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                            </div>
                            <h1 className="text-xl font-bold text-white">This Page Is Not Active</h1>
                            <p className="text-sm text-muted/60 leading-relaxed">
                                {data.business_name
                                    ? `${data.business_name} has temporarily paused this page.`
                                    : "This page is currently disabled by the owner."}
                            </p>

                            {hasValidGoogleUrl && (
                                <a
                                    href={data.google_review_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 w-full rounded-xl px-4 py-3.5 text-sm font-bold text-white transition-all shadow-sm hover:opacity-90 active:scale-[0.98]"
                                    style={{ backgroundColor: accentColor }}
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                    </svg>
                                    Leave a Google Review
                                </a>
                            )}
                        </div>
                        <div className="border-t border-white/5 px-6 py-3 text-center">
                            <span className="text-[9px] text-muted/30 uppercase tracking-widest">Powered by EZinfo</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const config: TouchpointConfig = {
        slug: data.slug,
        business_name: data.business_name,
        touchpoint_id: data.touchpoint_id,
        enabled: data.enabled,
        primary_mode: data.primary_mode ?? "GOOGLE_REVIEWS",
        redirect_mode: data.redirect_mode ?? "assist",
        google_review_enabled: data.google_review_enabled,
        google_review_url: data.google_review_url,
        prompt_title: data.prompt_title,
        prompt_subtitle: data.prompt_subtitle,
        ai_enabled: data.ai_enabled,
        brand_name: data.brand_name,
        brand_logo_url: data.brand_logo_url,
        brand_accent: data.brand_accent,
        theme_bg_color: data.theme_bg_color,
        theme_shade_color: data.theme_shade_color,
        offer_enabled: data.loyalty_offer_enabled,
        offer_title: data.loyalty_offer_title,
        offer_description: data.loyalty_offer_description,
        offer_terms: data.loyalty_offer_terms,
        survey_questions: surveyQuestions.map(q => ({
            id: q.id,
            sort_order: q.sort_order,
            question_type: q.question_type as 'short_answer' | 'multiple_choice',
            question_text: q.question_text,
            options: Array.isArray(q.options) ? q.options : [],
        })),
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <MiddlewarePreview mode="public" config={config} />
        </div>
    );
}
