"use client";

import React, { useState, useEffect, useCallback } from "react";

interface Submission {
    id: string;
    type: "survey" | "offer_lead";
    email: string;
    timestamp: string;
    answers: Record<string, string>;
}

interface SubmissionsPanelProps {
    slug: string;
    adminEmail: string;
    onClose: () => void;
}

export default function SubmissionsPanel({ slug, adminEmail, onClose }: SubmissionsPanelProps) {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [exporting, setExporting] = useState(false);

    const fetchSubmissions = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/ezinfo/admin/submissions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug, email: adminEmail }),
            });
            const json = await res.json();
            if (json.ok !== false && json.submissions) {
                setSubmissions(json.submissions);
            } else {
                setError(json.error || "Failed to load submissions.");
            }
        } catch {
            setError("Network error.");
        } finally {
            setLoading(false);
        }
    }, [slug, adminEmail]);

    useEffect(() => {
        fetchSubmissions();
    }, [fetchSubmissions]);

    const handleExportCSV = async () => {
        setExporting(true);
        try {
            const res = await fetch("/api/ezinfo/admin/submissions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug, email: adminEmail, format: "csv" }),
            });
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${slug}-submissions.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch {
            /* ignore */
        } finally {
            setExporting(false);
        }
    };

    const formatDate = (ts: string) => {
        try {
            return new Date(ts).toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return ts;
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl max-h-[85vh] bg-surface border border-white/10 rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-accent" />
                        <h2 className="text-sm font-bold text-white">Submissions</h2>
                        <span className="text-xs text-muted/40">
                            {submissions.length} total
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleExportCSV}
                            disabled={exporting || submissions.length === 0}
                            className="rounded-md px-3 py-1.5 text-xs font-medium text-white bg-white/10 hover:bg-white/15 border border-white/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                        >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                            {exporting ? "Exporting…" : "Export CSV"}
                        </button>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-md text-muted/50 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto scrollbar-thin">
                    {loading && (
                        <div className="flex items-center justify-center py-16">
                            <div className="h-6 w-6 rounded-full border-2 border-white/10 border-t-accent animate-spin" />
                        </div>
                    )}

                    {error && (
                        <div className="px-6 py-8 text-center">
                            <p className="text-sm text-red-400">{error}</p>
                        </div>
                    )}

                    {!loading && !error && submissions.length === 0 && (
                        <div className="px-6 py-20 text-center">
                            <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-white/[0.03] border border-white/5 mb-5 shadow-sm">
                                <svg className="h-6 w-6 text-muted/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                </svg>
                            </div>
                            <p className="text-[15px] font-medium text-white/80">No submissions yet</p>
                            <p className="text-sm text-muted/50 mt-1.5 max-w-[260px] mx-auto leading-relaxed">Submissions will appear here once your page receives responses.</p>
                        </div>
                    )}

                    {!loading && !error && submissions.length > 0 && (
                        <div className="divide-y divide-white/5">
                            {submissions.map((s) => (
                                <div key={s.id} className="px-6 py-4 hover:bg-white/[0.02] transition-colors">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2.5">
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded truncate leading-none ${s.type === "survey"
                                                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                                }`}>
                                                {s.type === "survey" ? "Survey" : "Offer"}
                                            </span>
                                            <span className="text-[14px] text-white/90 font-medium truncate max-w-[200px]">
                                                {s.email || "Anonymous submission"}
                                            </span>
                                        </div>
                                        <span className="text-[13px] text-muted/50 shrink-0 font-medium tracking-tight">
                                            {formatDate(s.timestamp)}
                                        </span>
                                    </div>
                                    {s.type === "survey" && s.answers && Object.keys(s.answers).length > 0 && (
                                        <div className="mt-1 space-y-2.5 pl-3.5 border-l-2 border-white/10">
                                            {Object.entries(s.answers).map(([qText, answer]) => (
                                                <div key={qText} className="space-y-0.5">
                                                    <p className="text-[12px] font-medium text-white/40 truncate">{qText}</p>
                                                    <p className="text-[14px] text-white/80 leading-snug">{answer}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
