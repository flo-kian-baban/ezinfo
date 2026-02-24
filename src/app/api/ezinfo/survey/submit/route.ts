import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { createTrace } from "@/lib/trace";

export async function POST(req: NextRequest) {
    const trace = createTrace("ezinfo/survey/submit", req);

    try {
        const body = await req.json();
        const { touchpoint_id, email, answers } = body;

        if (!touchpoint_id) {
            return trace.fail("touchpoint_id is required.", 400);
        }

        if (!answers || typeof answers !== "object") {
            return trace.fail("answers object is required.", 400);
        }

        trace.info("Survey submission received", {
            touchpoint_id,
            hasEmail: !!email,
            answerCount: Object.keys(answers).length,
        });

        const supabase = createAdminClient();

        // Verify touchpoint exists
        const { data: tp, error: tpError } = await supabase
            .from("touchpoints")
            .select("id")
            .eq("id", touchpoint_id)
            .single();

        if (tpError || !tp) {
            return trace.fail("Invalid touchpoint", 404);
        }

        const { data, error } = await supabase
            .from("survey_submissions")
            .insert({
                touchpoint_id,
                email: email || null,
                answers,
            })
            .select()
            .single();

        if (error) {
            return trace.fail(error.message, 500, {
                source: "supabase_insert",
                code: error.code,
            });
        }

        trace.info("Survey submission saved", { submission_id: data.id });
        return trace.success({ submission_id: data.id });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return trace.fail(message, 500, { source: "uncaught" });
    }
}
