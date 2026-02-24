import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { createTrace } from "@/lib/trace";

export async function POST(req: NextRequest) {
    const trace = createTrace("ezinfo/admin/login", req);

    try {
        const body = await req.json();
        const { slug, email } = body;

        if (!slug || !email) {
            return trace.fail("slug and email are required.", 400);
        }

        trace.info("Admin login attempt", { slug, email: email.slice(0, 3) + "***" });

        const supabase = createAdminClient();
        const { data, error } = await supabase.rpc("ezinfo_get_admin_config", {
            p_slug: slug,
            p_email: email,
        });

        if (error) {
            return trace.fail(error.message, 500, { source: "supabase_rpc", code: error.code, slug });
        }

        if (!data?.ok) {
            trace.warn("Admin login denied", { slug, reason: data?.error });
            return trace.fail(data?.error || "Access denied", 403, { slug });
        }

        trace.info("Admin login successful", { slug, touchpoint_id: data.touchpoint_id });
        return trace.success({ config: data });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return trace.fail(message, 500, { source: "uncaught" });
    }
}
