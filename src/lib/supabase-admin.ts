import { createClient } from "@supabase/supabase-js";
import "server-only";

/**
 * Server-only Supabase admin client (service role).
 * The "server-only" import above causes a build error if this module
 * is ever imported by a client component, preventing key leakage.
 */
export function createAdminClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        throw new Error("Missing SUPABASE_URL or SERVICE_ROLE_KEY env vars");
    }

    return createClient(url, key, {
        auth: { autoRefreshToken: false, persistSession: false },
    });
}
