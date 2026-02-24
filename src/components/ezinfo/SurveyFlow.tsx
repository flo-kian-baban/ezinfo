"use client";

import React, { useState } from "react";
import type { SurveyQuestion, TouchpointConfig } from "@/lib/ezinfo-types";

interface SurveyFlowProps {
    config: TouchpointConfig;
    mode: "public" | "preview";
    accentColor: string;
    logEvent: (eventType: string) => void;
    onToast: (message: string) => void;
    renderOffer?: () => React.ReactNode;
}

export default function SurveyFlow({ config, mode, accentColor, logEvent, onToast, renderOffer }: SurveyFlowProps) {
    const questions = config.survey_questions || [];
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [email, setEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [completed, setCompleted] = useState(false);

    const totalSteps = questions.length;
    const isLastQuestion = currentStep === totalSteps - 1;
    const isEmailStep = currentStep === totalSteps;

    const currentQuestion: SurveyQuestion | undefined = questions[currentStep];

    const currentAnswer = currentQuestion ? (answers[currentQuestion.question_text] || "") : "";

    const handleNext = () => {
        if (isEmailStep) {
            handleSubmit();
            return;
        }
        if (currentStep < totalSteps) {
            setCurrentStep((s) => s + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep((s) => s - 1);
        }
    };

    const setAnswer = (value: string) => {
        if (!currentQuestion) return;
        setAnswers((prev) => ({ ...prev, [currentQuestion.question_text]: value }));
    };

    const handleSubmit = async () => {
        if (mode === "preview") {
            onToast("Preview mode: Survey would be submitted here.");
            setCompleted(true);
            logEvent("survey_submit");
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch("/api/ezinfo/survey/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    touchpoint_id: config.touchpoint_id,
                    email: email || null,
                    answers,
                }),
            });
            const json = await res.json();
            if (res.ok && json.submission_id) {
                setCompleted(true);
                onToast("Survey submitted successfully!");
                logEvent("survey_submit");
            } else {
                onToast("Something went wrong. Please try again.");
            }
        } catch {
            onToast("Network error. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (questions.length === 0) {
        return (
            <div className="p-8 text-center space-y-3">
                <h2 className="text-xl font-bold text-white tracking-tight">
                    {config.prompt_title || "Survey"}
                </h2>
                <p className="text-[15px] text-muted/60 max-w-[280px] mx-auto leading-relaxed">
                    This survey hasn&apos;t been configured yet. Please check back later.
                </p>
            </div>
        );
    }

    /* ── Completion screen ── */
    if (completed) {
        return (
            <>
                <div className="p-8 text-center space-y-5">
                    <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full border border-accent/20 shadow-[0_0_20px_rgba(var(--accent),0.1)]" style={{ background: `linear-gradient(135deg, ${accentColor}33, ${accentColor}0D)` }}>
                        <svg className="h-8 w-8 text-accent drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="space-y-2.5">
                        <h2 className="text-2xl font-bold text-white tracking-tight">Thank you!</h2>
                        <p className="text-[15px] text-muted/70 max-w-[280px] mx-auto leading-relaxed">
                            Your response has been submitted successfully.
                        </p>
                    </div>
                </div>

                {/* Offer shows only after survey completion */}
                {renderOffer && renderOffer()}
            </>
        );
    }

    /* ── Email capture step ── */
    if (isEmailStep) {
        return (
            <div className="p-6 space-y-6">
                {/* Progress */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-widest text-muted/40">Almost done</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-700 ease-out"
                            style={{ width: "100%", backgroundColor: accentColor }}
                        />
                    </div>
                </div>

                <div className="space-y-3 text-center">
                    <h2 className="text-[20px] font-bold text-white tracking-tight">One last thing</h2>
                    <p className="text-[14px] text-muted/60 leading-relaxed max-w-[280px] mx-auto">
                        Leave your email to stay connected (optional)
                    </p>
                </div>

                <div className="pt-2">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[14px] text-foreground placeholder:text-muted/30 transition-all focus:border-accent/40 focus:bg-black/60 focus:outline-none focus:ring-4 focus:ring-accent/10"
                    />
                </div>

                <div className="flex gap-3 pt-3">
                    <button
                        type="button"
                        onClick={handleBack}
                        className="flex-1 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 text-[14px] font-semibold text-white hover:bg-white-[0.06] hover:border-white/10 transition-all active:scale-[0.98]"
                    >
                        Back
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex-1 shadow-lg shadow-black/20 rounded-xl px-4 py-3 text-[14px] font-bold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                        style={{ backgroundColor: accentColor }}
                    >
                        {submitting ? "Submitting…" : "Submit"}
                    </button>
                </div>
            </div>
        );
    }

    /* ── Question step ── */
    return (
        <div className="p-5 space-y-5">
            {/* Progress bar */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-muted/40">
                        Step {currentStep + 1} of {totalSteps}
                    </span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{
                            width: `${((currentStep + 1) / (totalSteps + 1)) * 100}%`,
                            backgroundColor: accentColor,
                        }}
                    />
                </div>
            </div>

            {/* Question text */}
            <h2 className="text-[20px] font-bold text-white text-center tracking-tight leading-snug px-2">
                {currentQuestion?.question_text || "Question"}
            </h2>

            {/* Answer input */}
            <div className="pt-2">
                {currentQuestion?.question_type === "short_answer" && (
                    <textarea
                        rows={3}
                        value={currentAnswer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Type your answer…"
                        className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[14px] text-foreground placeholder:text-muted/30 transition-all resize-none focus:border-accent/40 focus:bg-black/60 focus:outline-none focus:ring-4 focus:ring-accent/10"
                    />
                )}

                {currentQuestion?.question_type === "multiple_choice" && (
                    <div className="space-y-2.5">
                        {(currentQuestion.options || []).map((opt, i) => {
                            const isSelected = currentAnswer === opt;
                            return (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setAnswer(opt)}
                                    className={`w-full text-left rounded-xl border px-4 py-3 text-[14px] font-medium transition-all duration-200 active:scale-[0.99] ${isSelected
                                        ? "border-accent/40 bg-accent/10 text-white shadow-sm"
                                        : "border-white/5 bg-white/[0.03] text-muted/70 hover:bg-white-[0.06] hover:text-white"
                                        }`}
                                    style={isSelected ? { borderColor: `${accentColor}55`, backgroundColor: `${accentColor}1A` } : undefined}
                                >
                                    <span className="flex items-center gap-3">
                                        <span
                                            className={`h-3.5 w-3.5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${isSelected ? "border-accent" : "border-white/20"
                                                }`}
                                            style={isSelected ? { borderColor: accentColor } : undefined}
                                        >
                                            {isSelected && (
                                                <span
                                                    className="h-1.5 w-1.5 rounded-full"
                                                    style={{ backgroundColor: accentColor }}
                                                />
                                            )}
                                        </span>
                                        {opt}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Nav buttons */}
            <div className="flex gap-3 pt-6">
                {currentStep > 0 && (
                    <button
                        type="button"
                        onClick={handleBack}
                        className="flex-1 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 text-[14px] font-semibold text-white hover:bg-white-[0.06] hover:border-white/10 transition-all active:scale-[0.98]"
                    >
                        Back
                    </button>
                )}
                <button
                    type="button"
                    onClick={handleNext}
                    disabled={!currentAnswer}
                    className={`${currentStep > 0 ? "flex-1" : "w-full"} shadow-lg shadow-black/20 rounded-xl px-4 py-3 text-[14px] font-bold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed`}
                    style={{ backgroundColor: accentColor }}
                >
                    {isLastQuestion ? "Next" : "Next"}
                </button>
            </div>
        </div>
    );
}
