import { NextRequest } from "next/server";
import { createTrace } from "@/lib/trace";

/**
 * AI Review Rewrite — Pilot Implementation (rule-based)
 *
 * Polishes user-written review text based on tone + mode settings.
 * Swap this out for an LLM call (OpenAI, Gemini, etc.) when ready.
 */
export async function POST(req: NextRequest) {
    const trace = createTrace("ezinfo/ai/rewrite", req);

    try {
        const body = await req.json();
        const { text, ai_tone, ai_mode } = body;

        if (!text?.trim()) {
            return trace.fail("text is required.", 400);
        }

        trace.info("AI rewrite requested", {
            inputLength: text.trim().length,
            tone: ai_tone || "professional",
            mode: ai_mode || "normal",
        });

        const rewritten = rewriteReview(text.trim(), ai_tone || "professional", ai_mode || "normal");

        trace.info("AI rewrite completed", { outputLength: rewritten.length });
        return trace.success({ rewritten_text: rewritten });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return trace.fail(message, 500, { source: "uncaught" });
    }
}

/* ─── Rule-based rewriter (pilot) ─── */
function rewriteReview(
    text: string,
    tone: string,
    mode: string
): string {
    // Clean up the text
    let result = text
        // Capitalize first letter of each sentence
        .replace(/(^|[.!?]\s+)([a-z])/g, (_, sep, ch) => sep + ch.toUpperCase())
        // Fix common abbreviations
        .replace(/\bi\b/g, "I")
        .replace(/\bdont\b/gi, "don't")
        .replace(/\bcant\b/gi, "can't")
        .replace(/\bwont\b/gi, "won't")
        .replace(/\bwouldnt\b/gi, "wouldn't")
        .replace(/\bcouldnt\b/gi, "couldn't")
        .replace(/\bshouldnt\b/gi, "shouldn't")
        .replace(/\bdidnt\b/gi, "didn't")
        .replace(/\bisnt\b/gi, "isn't")
        .replace(/\barent\b/gi, "aren't")
        .replace(/\bwasnt\b/gi, "wasn't")
        .replace(/\bwerent\b/gi, "weren't")
        .replace(/\bhasnt\b/gi, "hasn't")
        .replace(/\bhavent\b/gi, "haven't")
        .replace(/\bthats\b/gi, "that's")
        .replace(/\btheyre\b/gi, "they're")
        .replace(/\bwere\b(?!\s)/gi, "we're")
        .replace(/\byoure\b/gi, "you're")
        .replace(/\bits\b(?=\s+\w)/gi, "it's")
        // Ensure it ends with punctuation
        .replace(/\s+$/, "");

    if (!/[.!?]$/.test(result)) {
        result += ".";
    }

    // Capitalize first character
    result = result.charAt(0).toUpperCase() + result.slice(1);

    // Tone adjustments
    if (tone === "friendly") {
        // Add a warm closer if none exists
        if (!/recommend|highly|love|amazing|fantastic|wonderful/i.test(result)) {
            result += " Highly recommend!";
        }
    } else {
        // Professional: ensure no excessive punctuation
        result = result.replace(/!{2,}/g, "!").replace(/\.{2,}/g, ".");
    }

    // Mode adjustments
    if (mode === "short") {
        // Trim to ~2 sentences
        const sentences = result.match(/[^.!?]+[.!?]+/g) || [result];
        result = sentences.slice(0, 2).join(" ").trim();
    } else if (mode === "detailed") {
        // Keep everything as-is, the text is already the user's full input
    }

    return result;
}
