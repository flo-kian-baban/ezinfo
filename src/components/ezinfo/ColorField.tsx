"use client";

import React, { useState, useEffect, useRef } from "react";
import { isValidHex } from "@/lib/validate-hex-color";

/* ─────────────────────────────────────────────── */
/*  Custom Color Picker                            */
/* ─────────────────────────────────────────────── */

/* ── Color conversion helpers ── */
function hexToHsv(hex: string): [number, number, number] {
    const h = hex.replace("#", "");
    const r = parseInt(h.substring(0, 2), 16) / 255;
    const g = parseInt(h.substring(2, 4), 16) / 255;
    const b = parseInt(h.substring(4, 6), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const d = max - min;
    const s = max === 0 ? 0 : d / max;
    const v = max;
    let hue = 0;
    if (d !== 0) {
        if (max === r) hue = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        else if (max === g) hue = ((b - r) / d + 2) / 6;
        else hue = ((r - g) / d + 4) / 6;
    }
    return [hue * 360, s * 100, v * 100];
}

function hsvToHex(h: number, s: number, v: number): string {
    const hh = h / 360, ss = s / 100, vv = v / 100;
    const i = Math.floor(hh * 6);
    const f = hh * 6 - i;
    const p = vv * (1 - ss), q = vv * (1 - f * ss), t = vv * (1 - (1 - f) * ss);
    let r: number, g: number, b: number;
    switch (i % 6) {
        case 0: r = vv; g = t; b = p; break;
        case 1: r = q; g = vv; b = p; break;
        case 2: r = p; g = vv; b = t; break;
        case 3: r = p; g = q; b = vv; break;
        case 4: r = t; g = p; b = vv; break;
        default: r = vv; g = p; b = q; break;
    }
    const toHex = (n: number) => Math.round(n * 255).toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export const BG_PRESETS: string[] = [];
export const ACCENT_PRESETS: string[] = [];

export default function ColorField({
    label,
    value,
    onChange,
    placeholder,
    hint,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    presets: string[];
    placeholder: string;
    hint: string;
}) {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLDivElement>(null);

    const currentHex = isValidHex(value) ? value : placeholder;
    const [hue, sat, bright] = hexToHsv(currentHex);

    // Close on click-outside
    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
        onChange(hsvToHex(hue, x * 100, (1 - y) * 100));
    };

    const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(hsvToHex(Number(e.target.value), sat, bright));
    };

    return (
        <div ref={wrapperRef} className="relative">
            <label className="block text-[11px] font-semibold uppercase tracking-widest text-muted/50 mb-2">
                {label}
            </label>
            <div className="flex items-center gap-2.5">
                {/* Swatch trigger */}
                <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className="h-9 w-9 rounded-lg border border-white/15 flex-shrink-0 shadow-inner transition-all duration-200 hover:border-white/30 hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/30"
                    style={{ backgroundColor: currentHex }}
                />
                {/* Hex input */}
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-foreground placeholder:text-muted/30 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20 transition-all font-mono"
                />
            </div>
            <p className="text-[11px] text-muted/40 mt-1">{hint}</p>

            {/* ── Custom Picker Popup ── */}
            {open && (
                <div className="absolute top-full left-0 mt-2 z-50 w-56 rounded-xl border border-white/10 bg-[#1a1a2e]/95 backdrop-blur-xl shadow-2xl shadow-black/60 p-3 space-y-3">
                    {/* Saturation / Brightness canvas */}
                    <div
                        ref={canvasRef}
                        className="relative h-32 w-full rounded-lg cursor-crosshair overflow-hidden"
                        style={{ backgroundColor: `hsl(${hue}, 100%, 50%)` }}
                        onClick={handleCanvasClick}
                    >
                        {/* White → transparent (left to right = saturation) */}
                        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #fff, transparent)" }} />
                        {/* Transparent → black (top to bottom = brightness) */}
                        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent, #000)" }} />
                        {/* Thumb */}
                        <div
                            className="absolute h-3.5 w-3.5 rounded-full border-2 border-white shadow-[0_0_4px_rgba(0,0,0,0.5)] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                            style={{
                                left: `${sat}%`,
                                top: `${100 - bright}%`,
                                backgroundColor: currentHex,
                            }}
                        />
                    </div>

                    {/* Hue slider */}
                    <input
                        type="range"
                        min="0"
                        max="360"
                        value={hue}
                        onChange={handleHueChange}
                        className="w-full h-2.5 rounded-full appearance-none cursor-pointer"
                        style={{
                            background: "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
                        }}
                    />

                    {/* Current color preview row */}
                    <div className="flex items-center gap-2">
                        <div
                            className="h-6 w-6 rounded-md border border-white/10"
                            style={{ backgroundColor: currentHex }}
                        />
                        <span className="text-xs font-mono text-muted/60">{currentHex.toUpperCase()}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
