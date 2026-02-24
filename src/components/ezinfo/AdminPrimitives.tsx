import React from "react";

/* ─── Toggle ─── */
export function Toggle({
    label,
    description,
    checked,
    onChange,
}: {
    label: string;
    description?: string;
    checked: boolean;
    onChange: (v: boolean) => void;
}) {
    return (
        <div className="flex items-start justify-between gap-4 py-1">
            <div className="flex-1">
                <span className="text-sm font-medium text-foreground">{label}</span>
                {description && <p className="text-xs text-muted/60 mt-1 leading-relaxed">{description}</p>}
            </div>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${checked ? "bg-accent" : "bg-white/20"
                    }`}
            >
                <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"
                        }`}
                />
            </button>
        </div>
    );
}

/* ─── Section ─── */
export function Section({
    title,
    children,
    show = true,
}: {
    title: string;
    children: React.ReactNode;
    show?: boolean;
}) {
    if (!show) return null;
    return (
        <div className="py-6 border-b border-white/5 last:border-0 space-y-4">
            <h3 className="text-sm font-semibold text-foreground/90">{title}</h3>
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );
}

/* ─── Shared CSS classes ─── */
export const inputClass =
    "w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground placeholder:text-muted/40 focus:border-accent/50 focus:bg-black/20 focus:outline-none transition-colors";

export const labelClass = "text-xs font-medium text-foreground/70 mb-1.5 block";
