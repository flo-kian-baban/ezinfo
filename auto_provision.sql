-- =========================================================
-- EZinfo: Auto-Provisioning Function (Email Auth)
-- Run this in Supabase SQL Editor
-- =========================================================

CREATE OR REPLACE FUNCTION public.ezinfo_auto_provision(
  p_business_name text,
  p_owner_name text,
  p_email text,
  p_phone text,
  p_google_review_url text,
  p_notes text,
  p_source text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_base_slug text;
  v_slug text;
  v_counter integer := 1;
  v_business_id uuid;
  v_touchpoint_id uuid;
  v_application_id uuid;
BEGIN
  -- 1. Generate SEO-friendly slug
  v_base_slug := trim(both '-' from regexp_replace(lower(p_business_name), '[^a-z0-9]+', '-', 'g'));
  IF v_base_slug = '' OR v_base_slug IS NULL THEN
    v_base_slug := 'touchpoint';
  END IF;
  v_slug := v_base_slug;

  -- Ensure uniqueness
  WHILE EXISTS (SELECT 1 FROM ezinfo.businesses WHERE slug = v_slug) LOOP
    v_counter := v_counter + 1;
    v_slug := v_base_slug || '-' || v_counter;
  END LOOP;

  -- 2. Insert Business (Saving the email directly, no token hash)
  INSERT INTO ezinfo.businesses (name, slug, email)
  VALUES (p_business_name, v_slug, p_email)
  RETURNING id INTO v_business_id;

  -- 3. Insert Touchpoint
  INSERT INTO ezinfo.touchpoints (
    business_id, 
    enabled, 
    redirect_mode, 
    google_review_enabled, 
    google_review_url,
    prompt_title,
    prompt_subtitle,
    ai_enabled
  )
  VALUES (
    v_business_id,
    true,
    'assist',
    true,
    p_google_review_url,
    'Share your experience!',
    'Write a quick review and we''ll help you polish it up.',
    false
  )
  RETURNING id INTO v_touchpoint_id;

  -- 4. Insert Application Record
  INSERT INTO ezinfo.applications (
    business_name, owner_name, email, phone, google_review_url, notes, source, status
  )
  VALUES (
    p_business_name, p_owner_name, p_email, p_phone, p_google_review_url, p_notes, p_source, 'approved'
  )
  RETURNING id INTO v_application_id;

  -- Return the slug to the client so they can access their dashboard via email
  RETURN jsonb_build_object(
    'ok', true,
    'slug', v_slug,
    'business_id', v_business_id,
    'touchpoint_id', v_touchpoint_id,
    'application_id', v_application_id
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('ok', false, 'error', SQLERRM);
END;
$$;
