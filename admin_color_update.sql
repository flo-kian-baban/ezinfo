-- =========================================================
-- EZinfo: Add email and theme color columns + update functions
-- Run this in Supabase SQL Editor
-- =========================================================

-- Step 1: Add columns (safe to re-run)
ALTER TABLE ezinfo.touchpoints
  ADD COLUMN IF NOT EXISTS theme_bg_color text,
  ADD COLUMN IF NOT EXISTS theme_shade_color text;

ALTER TABLE ezinfo.businesses
  ADD COLUMN IF NOT EXISTS email text;

-- Step 2: Update view
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
  t.theme_shade_color
FROM ezinfo.touchpoints t
JOIN ezinfo.businesses b ON b.id = t.business_id;

-- Step 3: Replace get_admin_config to use email instead of token
CREATE OR REPLACE FUNCTION public.ezinfo_get_admin_config(p_slug text, p_email text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_biz RECORD;
  v_tp RECORD;
BEGIN
  SELECT id, name, email INTO v_biz
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
    'theme_shade_color', v_tp.theme_shade_color
  );
END;
$$;

-- Step 4: Replace update_touchpoint to use email instead of token
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
    theme_shade_color = COALESCE(p_patch->>'theme_shade_color', theme_shade_color)
  WHERE business_id = v_biz.id
  RETURNING * INTO v_tp;

  INSERT INTO ezinfo.touchpoint_versions (touchpoint_id, changed_by, snapshot)
  VALUES (v_tp.id, 'admin_email_' || p_slug, row_to_json(v_tp)::jsonb);

  RETURN jsonb_build_object('ok', true);
END;
$$;
