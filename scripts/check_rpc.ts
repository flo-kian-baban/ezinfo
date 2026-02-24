import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRpc() {
    console.log("Testing ezinfo_auto_provision RPC...");
    const { data, error } = await supabase.rpc("ezinfo_auto_provision", {
        p_business_name: "Test Check",
        p_owner_name: null,
        p_email: "test@check.com",
        p_phone: null,
        p_google_review_url: "https://g.page/r/test",
        p_notes: null,
        p_source: "test"
    });

    if (error) {
        console.error("RPC Error:", error.message, error.code, error.details);
        return;
    }

    console.log("Success! RPC exists and returned:", data);
}

checkRpc().catch(console.error);
