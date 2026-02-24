import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { validateGoogleReviewUrl } from "@/lib/validate-google-url";
import { isValidHex, COLOR_FIELDS } from "@/lib/validate-hex-color";
import { createTrace } from "@/lib/trace";

export async function POST(req: NextRequest) {
    const trace = createTrace("ezinfo/touchpoint/update", req);

    try {
        const body = await req.json();
        const { slug, email, patch } = body;

        if (!slug || !email || !patch) {
            return trace.fail("slug, email, and patch are required.", 400);
        }

        trace.info("Update request received", {
            slug,
            patchKeys: Object.keys(patch),
        });

        if (patch.google_review_url) {
            const urlCheck = validateGoogleReviewUrl(patch.google_review_url);
            if (!urlCheck.valid) {
                return trace.fail(urlCheck.error!, 400, { field: "google_review_url" });
            }
        }

        /* ── Validate color fields (prevent CSS injection) ── */
        for (const field of COLOR_FIELDS) {
            const val = patch[field];
            if (val !== undefined && val !== null && val !== "" && !isValidHex(val)) {
                return trace.fail(
                    `Invalid color for ${field}. Must be #RRGGBB format.`,
                    400,
                    { field, received: String(val).slice(0, 20) }
                );
            }
        }

        // Ensure survey_questions is an array if present
        if (patch.survey_questions !== undefined && !Array.isArray(patch.survey_questions)) {
            return trace.fail(
                `Invalid type for survey_questions. Must be an array.`,
                400,
                { field: "survey_questions", received: typeof patch.survey_questions }
            );
        }

        const supabase = createAdminClient();
        const { data, error } = await supabase.rpc("ezinfo_update_touchpoint", {
            p_slug: slug,
            p_email: email,
            p_patch: patch,
        });

        if (error) {
            return trace.fail(error.message, 500, { source: "supabase_rpc", code: error.code, slug });
        }

        if (!data?.ok) {
            return trace.fail(data?.error || "Update failed", 403, { slug });
        }

        trace.info("Touchpoint updated", { slug, touchpoint_id: data.touchpoint?.id });
        return trace.success({ touchpoint: data.touchpoint });
    } catch (err: unknown) {
        if (err instanceof Error) {
            return trace.fail(err.message, 500, { source: "uncaught" });
        }
        return trace.fail("Unknown error", 500, { source: "uncaught" });
    }
}
