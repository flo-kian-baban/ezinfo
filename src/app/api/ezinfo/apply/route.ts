import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { validateGoogleReviewUrl } from "@/lib/validate-google-url";
import { createTrace } from "@/lib/trace";

export async function POST(req: NextRequest) {
    const trace = createTrace("ezinfo/apply", req);

    try {
        const body = await req.json();
        const { business_name, owner_name, email, phone, google_review_url, notes } = body;

        trace.info("Apply request received", { business_name, email: email?.slice(0, 3) + "***" });

        /* ── Validate required fields ── */
        if (!business_name?.trim() || !email?.trim() || !google_review_url?.trim()) {
            return trace.fail("business_name, email, and google_review_url are required.", 400);
        }

        /* ── Validate google_review_url ── */
        const urlCheck = validateGoogleReviewUrl(google_review_url);
        if (!urlCheck.valid) {
            return trace.fail(urlCheck.error!, 400, { field: "google_review_url" });
        }

        /* ── Provision via SECURITY DEFINER function ── */
        const supabase = createAdminClient();
        const { data, error } = await supabase.rpc("ezinfo_auto_provision", {
            p_business_name: business_name.trim(),
            p_owner_name: owner_name?.trim() || null,
            p_email: email.trim(),
            p_phone: phone?.trim() || null,
            p_google_review_url: google_review_url.trim(),
            p_notes: notes?.trim() || null,
            p_source: "landing",
        });

        if (error) {
            return trace.fail(error.message, 500, { source: "supabase_rpc", code: error.code });
        }

        if (!data || !data.ok) {
            return trace.fail(data?.error || "Provisioning failed", 500, { rpcData: data });
        }

        const isExisting = data.already_exists === true;
        trace.info(isExisting ? "Returned existing business" : "New business provisioned", {
            slug: data.slug,
            already_exists: isExisting,
        });

        return trace.success({ already_exists: isExisting, application: data, provisioned: data });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown server error";
        return trace.fail(message, 500, { source: "uncaught" });
    }
}
