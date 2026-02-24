import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testFlow() {
    console.log("1. Provisioning test...");
    const { data: prov, error: provErr } = await supabase.rpc("ezinfo_auto_provision", {
        p_business_name: "Auth Test " + Date.now(),
        p_owner_name: null,
        p_email: "authtest@check.com",
        p_phone: null,
        p_google_review_url: "https://g.page/r/test",
        p_notes: null,
        p_source: "test"
    });

    if (provErr) {
        console.error("Provision Error:", provErr);
        return;
    }

    console.log("Provisioned:", prov);

    if (!prov.ok) {
        console.error("Failed to provision natively:", prov.error);
        return;
    }

    const { slug, admin_token } = prov;

    console.log(`2. Validating config for ${slug} with token ${admin_token}...`);

    const { data: config, error: configErr } = await supabase.rpc("ezinfo_get_admin_config", {
        p_slug: slug,
        p_token: admin_token
    });

    if (configErr) {
        console.error("Config fetch rpc error:", configErr);
        return;
    }

    console.log("Config Result:", config);
}

testFlow().catch(console.error);
