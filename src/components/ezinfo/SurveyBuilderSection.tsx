"use client";

import React from "react";
import type { SurveyQuestion } from "@/lib/ezinfo-types";
import { Section, inputClass, labelClass } from "./AdminPrimitives";

const MAX_QUESTIONS = 7;
const MAX_OPTIONS = 8;

interface SurveyBuilderSectionProps {
    questions: SurveyQuestion[];
    onChange: (questions: SurveyQuestion[]) => void;
}

export default function SurveyBuilderSection({ questions, onChange }: SurveyBuilderSectionProps) {
    const addQuestion = () => {
        if (questions.length >= MAX_QUESTIONS) return;
        onChange([
            ...questions,
            {
                sort_order: questions.length,
                question_type: "short_answer",
                question_text: "",
                options: [],
            },
        ]);
    };

    const removeQuestion = (idx: number) => {
        const next = questions.filter((_, i) => i !== idx).map((q, i) => ({ ...q, sort_order: i }));
        onChange(next);
    };

    const moveQuestion = (idx: number, dir: -1 | 1) => {
        const target = idx + dir;
        if (target < 0 || target >= questions.length) return;
        const next = [...questions];
        [next[idx], next[target]] = [next[target], next[idx]];
        onChange(next.map((q, i) => ({ ...q, sort_order: i })));
    };

    const updateQuestion = (idx: number, patch: Partial<SurveyQuestion>) => {
        const next = questions.map((q, i) => (i === idx ? { ...q, ...patch } : q));
        onChange(next);
    };

    const addOption = (qIdx: number) => {
        const q = questions[qIdx];
        if (q.options.length >= MAX_OPTIONS) return;
        updateQuestion(qIdx, { options: [...q.options, ""] });
    };

    const removeOption = (qIdx: number, oIdx: number) => {
        const q = questions[qIdx];
        updateQuestion(qIdx, { options: q.options.filter((_, i) => i !== oIdx) });
    };

    const updateOption = (qIdx: number, oIdx: number, value: string) => {
        const q = questions[qIdx];
        const opts = [...q.options];
        opts[oIdx] = value;
        updateQuestion(qIdx, { options: opts });
    };

    return (
        <Section title="Survey Questions">
            <div className="space-y-4">
                {questions.length === 0 && (
                    <p className="text-xs text-muted/50 text-center py-4">
                        No questions yet. Add your first question below.
                    </p>
                )}

                {questions.map((q, idx) => (
                    <div
                        key={idx}
                        className="rounded-xl border border-white/[0.06] bg-black/20 p-5 space-y-4 shadow-sm"
                    >
                        {/* Question header */}
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-muted/60 uppercase tracking-wider">
                                Q{idx + 1}
                            </span>
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => moveQuestion(idx, -1)}
                                    disabled={idx === 0}
                                    className="p-1 rounded text-muted/40 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                                    title="Move up"
                                >
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => moveQuestion(idx, 1)}
                                    disabled={idx === questions.length - 1}
                                    className="p-1 rounded text-muted/40 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                                    title="Move down"
                                >
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => removeQuestion(idx)}
                                    className="p-1 rounded text-red-400/60 hover:text-red-400 transition-colors"
                                    title="Remove question"
                                >
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Type toggle */}
                        <div className="flex rounded-md bg-black/40 p-1 border border-white/5">
                            <button
                                type="button"
                                onClick={() => updateQuestion(idx, { question_type: "short_answer", options: [] })}
                                className={`flex-1 rounded px-2.5 py-1.5 text-[11px] font-medium transition-colors ${q.question_type === "short_answer"
                                    ? "bg-white/10 text-foreground"
                                    : "text-muted/50 hover:text-muted"
                                    }`}
                            >
                                Short Answer
                            </button>
                            <button
                                type="button"
                                onClick={() => updateQuestion(idx, { question_type: "multiple_choice", options: q.options.length ? q.options : ["Option 1", "Option 2"] })}
                                className={`flex-1 rounded px-2.5 py-1.5 text-[11px] font-medium transition-colors ${q.question_type === "multiple_choice"
                                    ? "bg-white/10 text-foreground"
                                    : "text-muted/50 hover:text-muted"
                                    }`}
                            >
                                Multiple Choice
                            </button>
                        </div>

                        {/* Question text */}
                        <div className="pt-1">
                            <label className={labelClass}>Question Text</label>
                            <input
                                value={q.question_text}
                                onChange={(e) => updateQuestion(idx, { question_text: e.target.value })}
                                className={inputClass}
                                placeholder="Type your question…"
                            />
                        </div>

                        {/* Multiple choice options */}
                        {q.question_type === "multiple_choice" && (
                            <div className="space-y-2 pl-2 border-l-2 border-white/5">
                                <label className={labelClass}>Options</label>
                                {q.options.map((opt, oIdx) => (
                                    <div key={oIdx} className="flex items-center gap-2">
                                        <div className="h-3.5 w-3.5 rounded-full border-2 border-white/20 shrink-0" />
                                        <input
                                            value={opt}
                                            onChange={(e) => updateOption(idx, oIdx, e.target.value)}
                                            className={`${inputClass} flex-1`}
                                            placeholder={`Option ${oIdx + 1}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeOption(idx, oIdx)}
                                            className="p-1 text-muted/30 hover:text-red-400 transition-colors shrink-0"
                                        >
                                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                                {q.options.length < MAX_OPTIONS && (
                                    <button
                                        type="button"
                                        onClick={() => addOption(idx)}
                                        className="text-[11px] text-accent/70 hover:text-accent font-medium transition-colors flex items-center gap-1 pt-1"
                                    >
                                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                        Add option
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ))}

                {/* Add question button */}
                <div className="pt-2">
                    <button
                        type="button"
                        onClick={addQuestion}
                        disabled={questions.length >= MAX_QUESTIONS}
                        className="w-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] py-3.5 text-[13px] font-medium text-muted/50 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add Question {questions.length > 0 && `(${questions.length}/${MAX_QUESTIONS})`}
                    </button>
                </div>
            </div>
        </Section>
    );
}
