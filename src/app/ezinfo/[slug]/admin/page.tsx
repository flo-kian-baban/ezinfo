"use client";

import React, { useState, use } from "react";
import AdminStudio from "@/components/ezinfo/AdminStudio";
import type { TouchpointConfig } from "@/lib/ezinfo-types";

export default function EzinfoAdminPage(props: {
    params: Promise<{ slug: string }>;
}) {
    const params = use(props.params);
    const slug = params.slug;

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [config, setConfig] = useState<TouchpointConfig | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch("/api/ezinfo/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug, email }),
            });

            const data = await res.json();

            if (!res.ok || !data.ok) {
                setError(data.error || "Invalid email or access denied.");
                return;
            }

            // data.config contains the touchpoint config
            setConfig({
                ...data.config,
                primary_mode: data.config.primary_mode ?? "GOOGLE_REVIEWS",
                redirect_mode: data.config.redirect_mode ?? "assist",
                offer_enabled: data.config.loyalty_offer_enabled,
                offer_title: data.config.loyalty_offer_title,
                offer_description: data.config.loyalty_offer_description,
                offer_terms: data.config.loyalty_offer_terms,
                survey_questions: (data.config.survey_questions || []).map((q: Record<string, unknown>) => ({
                    id: q.id,
                    sort_order: q.sort_order ?? 0,
                    question_type: q.question_type ?? "short_answer",
                    question_text: q.question_text ?? "",
                    options: Array.isArray(q.options) ? q.options : [],
                })),
            });
        } catch (err) {
            console.error("Login err:", err);
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (config) {
        return <AdminStudio initialConfig={config} adminEmail={email} />;
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="w-full max-w-md mx-auto relative overflow-hidden rounded-[24px] border border-white/10 bg-surface/50 backdrop-blur-xl p-8 sm:p-12 shadow-2xl">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

                <div className="mb-8 text-center">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 border border-accent/20 mb-6 shadow-neon text-accent">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Admin Access Required</h1>
                    <p className="text-sm text-muted/80">
                        Enter the email address registered to this touchpoint to access the command dashboard.
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted/70 mb-2 ml-1">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="hello@yourbusiness.com"
                            className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3.5 text-base text-foreground placeholder:text-muted/30 transition-all duration-300 focus:border-accent/50 focus:bg-accent/[0.03] focus:outline-none focus:ring-1 focus:ring-accent/20 hover:border-white/20"
                        />
                    </div>

                    {error && (
                        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-accent px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-black transition-all hover:bg-white hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-neon"
                    >
                        {loading ? "Authenticating..." : "Access Dashboard"}
                    </button>
                </form>
            </div>
        </div>
    );
}
