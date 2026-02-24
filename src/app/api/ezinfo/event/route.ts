import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { createTrace } from "@/lib/trace";

const VALID_EVENTS = ["page_view", "ai_generate", "copy_click", "google_click"];

export async function POST(req: NextRequest) {
    const trace = createTrace("ezinfo/event", req);

    try {
        const body = await req.json();
        const { touchpoint_id, event_type } = body;

        if (!touchpoint_id || !event_type) {
            return trace.fail("touchpoint_id and event_type are required.", 400);
        }

        if (!VALID_EVENTS.includes(event_type)) {
            return trace.fail(
                `Invalid event_type. Must be one of: ${VALID_EVENTS.join(", ")}`,
                400,
                { received: event_type }
            );
        }

        const supabase = createAdminClient();
        const { data, error } = await supabase.rpc("ezinfo_log_event", {
            p_touchpoint_id: touchpoint_id,
            p_event_type: event_type,
        });

        if (error) {
            return trace.fail(error.message, 500, {
                source: "supabase_rpc",
                code: error.code,
                touchpoint_id,
                event_type,
            });
        }

        return trace.success({ event_id: data?.event_id, event_type });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return trace.fail(message, 500, { source: "uncaught" });
    }
}
