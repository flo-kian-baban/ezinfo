import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkHash() {
    const { data, error } = await supabase
        .from('ezinfo_public_touchpoints')
        .select('*')
        .eq('slug', 'ezinfo-demo-000001')
        .single();

    // wait, we can't select admin_token_hash from public view!
    // we need to run a raw rest query or just use the service role on the base table.
    // wait, I tried this earlier and the base table is in the `ezinfo` schema and the REST API 
    // returned an error because `ezinfo` is not exposed in the API.

    // How can I check what the value is?
    // I can write a temporary RPC function to just select it and return it!
}

checkHash().catch(console.error);
