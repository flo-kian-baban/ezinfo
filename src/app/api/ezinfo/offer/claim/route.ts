import { NextRequest } from "next/server";
import { createEzinfoClient } from "@/lib/supabase-admin";
import { createTrace } from "@/lib/trace";

export async function POST(req: NextRequest) {
    const trace = createTrace("ezinfo/offer/claim", req);

    try {
        const body = await req.json();
        const { touchpoint_id, email } = body;

        if (!touchpoint_id) {
            return trace.fail("touchpoint_id is required.", 400);
        }

        if (!email) {
            return trace.fail("An email is required to claim the offer.", 400);
        }

        trace.info("Claim request received", {
            touchpoint_id,
            hasEmail: !!email,
        });

        const supabase = createEzinfoClient();

        // Lookup business_id safely
        const { data: tp, error: tpError } = await supabase
            .from("touchpoints")
            .select("business_id")
            .eq("id", touchpoint_id)
            .single();

        if (tpError || !tp?.business_id) {
            return trace.fail("Invalid touchpoint", 404);
        }

        const business_id = tp.business_id;

        const { data, error } = await supabase
            .from("loyalty_leads")
            .insert({
                touchpoint_id,
                business_id,
                email: email || null,
            })
            .select()
            .single();

        if (error) {
            return trace.fail(error.message, 500, { source: "supabase_insert", code: error.code });
        }

        trace.info("Offer lead captured successfully", { lead_id: data.id });
        return trace.success({ lead: data });

    } catch (err: unknown) {
        if (err instanceof Error) {
            return trace.fail(err.message, 500, { source: "uncaught" });
        }
        return trace.fail("Unknown error", 500, { source: "uncaught" });
    }
}
