import { createClient } from "@supabase/supabase-js";

/**
 * Browser-safe Supabase client (anon key).
 * Used for public view reads only.
 */
export function createAnonClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    return createClient(url, key);
}
