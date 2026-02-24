import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { createTrace } from "@/lib/trace";

export async function POST(req: NextRequest) {
    const trace = createTrace("ezinfo/admin/submissions", req);

    try {
        const body = await req.json();
        const { slug, email, format } = body;

        if (!slug || !email) {
            return trace.fail("slug and email are required.", 400);
        }

        trace.info("Submissions request", { slug, format });

        const supabase = createAdminClient();

        // Auth: verify email matches business
        const { data: biz, error: bizError } = await supabase
            .from("businesses")
            .select("id, email")
            .eq("slug", slug)
            .single();

        if (bizError || !biz) {
            return trace.fail("Invalid slug", 404);
        }

        if (!biz.email || biz.email.toLowerCase().trim() !== email.toLowerCase().trim()) {
            return trace.fail("Access denied", 403);
        }

        // Get touchpoint
        const { data: tp } = await supabase
            .from("touchpoints")
            .select("id")
            .eq("business_id", biz.id)
            .single();

        if (!tp) {
            return trace.fail("No touchpoint found", 404);
        }

        // Fetch survey submissions
        const { data: surveyRows } = await supabase
            .from("survey_submissions")
            .select("id, email, answers, submitted_at")
            .eq("touchpoint_id", tp.id)
            .order("submitted_at", { ascending: false });

        // Fetch offer leads
        const { data: offerRows } = await supabase
            .from("loyalty_leads")
            .select("id, email, claimed_at")
            .eq("touchpoint_id", tp.id)
            .order("claimed_at", { ascending: false });

        const submissions = [
            ...(surveyRows || []).map((r: Record<string, unknown>) => ({
                id: r.id,
                type: "survey" as const,
                email: r.email || "",
                timestamp: r.submitted_at,
                answers: r.answers || {},
            })),
            ...(offerRows || []).map((r: Record<string, unknown>) => ({
                id: r.id,
                type: "offer_lead" as const,
                email: r.email || "",
                timestamp: r.claimed_at,
                answers: {},
            })),
        ].sort((a, b) => new Date(b.timestamp as string).getTime() - new Date(a.timestamp as string).getTime());

        // CSV export
        if (format === "csv") {
            // Collect all answer keys
            const allKeys = new Set<string>();
            for (const s of submissions) {
                if (s.answers && typeof s.answers === "object") {
                    Object.keys(s.answers as Record<string, unknown>).forEach((k) => allKeys.add(k));
                }
            }
            const answerKeys = Array.from(allKeys);

            const header = ["Type", "Email", "Timestamp", ...answerKeys].join(",");
            const rows = submissions.map((s) => {
                const answers = (s.answers && typeof s.answers === "object" ? s.answers : {}) as Record<string, string>;
                const answerCols = answerKeys.map((k) => `"${(answers[k] || "").replace(/"/g, '""')}"`);
                return [
                    s.type,
                    `"${String(s.email || "").replace(/"/g, '""')}"`,
                    s.timestamp,
                    ...answerCols,
                ].join(",");
            });

            const csv = [header, ...rows].join("\n");

            return new Response(csv, {
                headers: {
                    "Content-Type": "text/csv",
                    "Content-Disposition": `attachment; filename="${slug}-submissions.csv"`,
                },
            });
        }

        trace.info("Submissions fetched", { count: submissions.length });
        return trace.success({ submissions });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return trace.fail(message, 500, { source: "uncaught" });
    }
}
