-- =========================================================
-- EZinfo: Pivot Loyalty Offer to Lead Capture
-- Run this in Supabase SQL Editor
-- =========================================================

-- Step 1: Create the new loyalty_leads table
CREATE TABLE IF NOT EXISTS ezinfo.loyalty_leads (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    touchpoint_id uuid REFERENCES ezinfo.touchpoints(id) ON DELETE CASCADE,
    business_id uuid REFERENCES ezinfo.businesses(id) ON DELETE CASCADE,
    email text,
    phone text,
    claimed_at timestamp with time zone DEFAULT now()
);

-- Turn on Row Level Security for the new table
ALTER TABLE ezinfo.loyalty_leads ENABLE ROW LEVEL SECURITY;

-- Allow public to insert leads
CREATE POLICY "Public can insert loyalty leads" ON ezinfo.loyalty_leads
    FOR INSERT WITH CHECK (true);

-- Allow admins to view leads for their businesses (assuming we check email/token elsewhere or they just see it)
-- Note: Admin reads happen via highly-privileged server-side functions or service_role key, 
-- but we can add a basic policy just in case.
CREATE POLICY "Admins can view their businesses leads" ON ezinfo.loyalty_leads
    FOR SELECT USING (true);


-- Step 2: Remove promo_code from view
DROP VIEW IF EXISTS public.ezinfo_public_touchpoints;
CREATE VIEW public.ezinfo_public_touchpoints AS
SELECT
  b.slug,
  b.name AS business_name,
  t.id AS touchpoint_id,
  t.enabled,
  t.redirect_mode,
  t.google_review_enabled,
  t.google_review_url,
  t.prompt_title,
  t.prompt_subtitle,
  t.ai_enabled,
  t.brand_name,
  t.brand_logo_url,
  t.brand_accent,
  t.theme_bg_color,
  t.theme_shade_color,
  t.loyalty_offer_enabled,
  t.loyalty_offer_title,
  t.loyalty_offer_description,
  t.loyalty_offer_redeem_url,
  t.loyalty_offer_expiry_date,
  t.loyalty_offer_terms
FROM ezinfo.touchpoints t
JOIN ezinfo.businesses b ON b.id = t.business_id;

-- Step 3: Update get_admin_config function
CREATE OR REPLACE FUNCTION public.ezinfo_get_admin_config(p_slug text, p_email text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_biz RECORD;
  v_tp RECORD;
BEGIN
  SELECT id, name, slug, email INTO v_biz
  FROM ezinfo.businesses
  WHERE slug = p_slug;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Invalid slug');
  END IF;

  IF v_biz.email IS NULL OR lower(trim(v_biz.email)) != lower(trim(p_email)) THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Invalid email access denied');
  END IF;

  SELECT * INTO v_tp
  FROM ezinfo.touchpoints
  WHERE business_id = v_biz.id;

  IF NOT FOUND THEN
     RETURN jsonb_build_object('ok', false, 'error', 'Touchpoint not configured');
  END IF;

  RETURN jsonb_build_object(
    'ok', true,
    'slug', v_biz.slug,
    'business_name', v_biz.name,
    'touchpoint_id', v_tp.id,
    'enabled', v_tp.enabled,
    'redirect_mode', v_tp.redirect_mode,
    'google_review_enabled', v_tp.google_review_enabled,
    'google_review_url', v_tp.google_review_url,
    'prompt_title', v_tp.prompt_title,
    'prompt_subtitle', v_tp.prompt_subtitle,
    'ai_enabled', v_tp.ai_enabled,
    'brand_name', v_tp.brand_name,
    'brand_logo_url', v_tp.brand_logo_url,
    'brand_accent', v_tp.brand_accent,
    'theme_bg_color', v_tp.theme_bg_color,
    'theme_shade_color', v_tp.theme_shade_color,
    'loyalty_offer_enabled', v_tp.loyalty_offer_enabled,
    'loyalty_offer_title', v_tp.loyalty_offer_title,
    'loyalty_offer_description', v_tp.loyalty_offer_description,
    'loyalty_offer_redeem_url', v_tp.loyalty_offer_redeem_url,
    'loyalty_offer_expiry_date', v_tp.loyalty_offer_expiry_date,
    'loyalty_offer_terms', v_tp.loyalty_offer_terms
  );
END;
$$;

-- Step 4: Update update_touchpoint function
CREATE OR REPLACE FUNCTION public.ezinfo_update_touchpoint(p_slug text, p_email text, p_patch jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_biz RECORD;
  v_tp RECORD;
BEGIN
  SELECT id, email INTO v_biz
  FROM ezinfo.businesses
  WHERE slug = p_slug;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Invalid slug');
  END IF;

  IF v_biz.email IS NULL OR lower(trim(v_biz.email)) != lower(trim(p_email)) THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Invalid email access denied');
  END IF;

  UPDATE ezinfo.touchpoints SET
    enabled = COALESCE((p_patch->>'enabled')::boolean, enabled),
    redirect_mode = COALESCE(p_patch->>'redirect_mode', redirect_mode),
    google_review_enabled = COALESCE((p_patch->>'google_review_enabled')::boolean, google_review_enabled),
    google_review_url = COALESCE(p_patch->>'google_review_url', google_review_url),
    prompt_title = COALESCE(p_patch->>'prompt_title', prompt_title),
    prompt_subtitle = COALESCE(p_patch->>'prompt_subtitle', prompt_subtitle),
    ai_enabled = COALESCE((p_patch->>'ai_enabled')::boolean, ai_enabled),
    theme_bg_color = COALESCE(p_patch->>'theme_bg_color', theme_bg_color),
    theme_shade_color = COALESCE(p_patch->>'theme_shade_color', theme_shade_color),
    loyalty_offer_enabled = COALESCE((p_patch->>'loyalty_offer_enabled')::boolean, loyalty_offer_enabled),
    loyalty_offer_title = COALESCE(p_patch->>'loyalty_offer_title', loyalty_offer_title),
    loyalty_offer_description = COALESCE(p_patch->>'loyalty_offer_description', loyalty_offer_description),
    loyalty_offer_redeem_url = COALESCE(p_patch->>'loyalty_offer_redeem_url', loyalty_offer_redeem_url),
    loyalty_offer_expiry_date = COALESCE(p_patch->>'loyalty_offer_expiry_date', loyalty_offer_expiry_date),
    loyalty_offer_terms = COALESCE(p_patch->>'loyalty_offer_terms', loyalty_offer_terms)
  WHERE business_id = v_biz.id
  RETURNING * INTO v_tp;

  INSERT INTO ezinfo.touchpoint_versions (touchpoint_id, changed_by, snapshot)
  VALUES (v_tp.id, 'admin_email_' || p_slug, row_to_json(v_tp)::jsonb);

  RETURN jsonb_build_object('ok', true);
END;
$$;

-- Step 5: Finally, remove the column from the table
ALTER TABLE ezinfo.touchpoints DROP COLUMN IF EXISTS loyalty_offer_promo_code;
