-- =========================================================
-- EZinfo v2: Primary Mode + Survey Questions + Submissions
-- Applied: 2026-02-23
-- =========================================================

-- 1. Add primary_mode column to touchpoints
ALTER TABLE ezinfo.touchpoints
  ADD COLUMN IF NOT EXISTS primary_mode text DEFAULT 'GOOGLE_REVIEWS'
    CHECK (primary_mode IN ('GOOGLE_REVIEWS', 'SURVEY'));

-- 2. Create survey_questions table
CREATE TABLE IF NOT EXISTS ezinfo.survey_questions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    touchpoint_id uuid REFERENCES ezinfo.touchpoints(id) ON DELETE CASCADE,
    sort_order int NOT NULL DEFAULT 0,
    question_type text NOT NULL CHECK (question_type IN ('short_answer','multiple_choice')),
    question_text text NOT NULL DEFAULT '',
    options jsonb DEFAULT '[]',
    created_at timestamptz DEFAULT now()
);

ALTER TABLE ezinfo.survey_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on survey_questions"
  ON ezinfo.survey_questions FOR ALL USING (true) WITH CHECK (true);

-- 3. Create survey_submissions table
CREATE TABLE IF NOT EXISTS ezinfo.survey_submissions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    touchpoint_id uuid REFERENCES ezinfo.touchpoints(id) ON DELETE CASCADE,
    email text,
    answers jsonb NOT NULL DEFAULT '{}',
    submitted_at timestamptz DEFAULT now()
);

ALTER TABLE ezinfo.survey_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert survey submissions"
  ON ezinfo.survey_submissions FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can read survey submissions"
  ON ezinfo.survey_submissions FOR SELECT USING (true);

-- 4. Update public view to include primary_mode
DROP VIEW IF EXISTS public.ezinfo_public_touchpoints;
CREATE VIEW public.ezinfo_public_touchpoints AS
SELECT
  b.slug,
  b.name AS business_name,
  t.id AS touchpoint_id,
  t.enabled,
  t.primary_mode,
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
  t.loyalty_offer_expiry_date,
  t.loyalty_offer_terms
FROM ezinfo.touchpoints t
JOIN ezinfo.businesses b ON b.id = t.business_id;

-- 5. Update get_admin_config to return mode + survey questions
CREATE OR REPLACE FUNCTION public.ezinfo_get_admin_config(p_slug text, p_email text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_biz RECORD;
  v_tp RECORD;
  v_questions jsonb;
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

  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'id', sq.id,
      'sort_order', sq.sort_order,
      'question_type', sq.question_type,
      'question_text', sq.question_text,
      'options', sq.options
    ) ORDER BY sq.sort_order
  ), '[]'::jsonb)
  INTO v_questions
  FROM ezinfo.survey_questions sq
  WHERE sq.touchpoint_id = v_tp.id;

  RETURN jsonb_build_object(
    'ok', true,
    'slug', v_biz.slug,
    'business_name', v_biz.name,
    'touchpoint_id', v_tp.id,
    'enabled', v_tp.enabled,
    'primary_mode', v_tp.primary_mode,
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
    'loyalty_offer_expiry_date', v_tp.loyalty_offer_expiry_date,
    'loyalty_offer_terms', v_tp.loyalty_offer_terms,
    'survey_questions', v_questions
  );
END;
$$;

-- 6. Update update_touchpoint to handle mode + survey questions
CREATE OR REPLACE FUNCTION public.ezinfo_update_touchpoint(p_slug text, p_email text, p_patch jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_biz RECORD;
  v_tp RECORD;
  v_q jsonb;
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
    primary_mode = COALESCE(p_patch->>'primary_mode', primary_mode),
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
    loyalty_offer_expiry_date = COALESCE(p_patch->>'loyalty_offer_expiry_date', loyalty_offer_expiry_date),
    loyalty_offer_terms = COALESCE(p_patch->>'loyalty_offer_terms', loyalty_offer_terms)
  WHERE business_id = v_biz.id
  RETURNING * INTO v_tp;

  -- Handle survey_questions (full replace)
  IF p_patch ? 'survey_questions' THEN
    DELETE FROM ezinfo.survey_questions WHERE touchpoint_id = v_tp.id;

    FOR v_q IN SELECT * FROM jsonb_array_elements(p_patch->'survey_questions')
    LOOP
      INSERT INTO ezinfo.survey_questions (touchpoint_id, sort_order, question_type, question_text, options)
      VALUES (
        v_tp.id,
        COALESCE((v_q->>'sort_order')::int, 0),
        COALESCE(v_q->>'question_type', 'short_answer'),
        COALESCE(v_q->>'question_text', ''),
        COALESCE(v_q->'options', '[]'::jsonb)
      );
    END LOOP;
  END IF;

  INSERT INTO ezinfo.touchpoint_versions (touchpoint_id, changed_by, snapshot)
  VALUES (v_tp.id, 'admin_email_' || p_slug, row_to_json(v_tp)::jsonb);

  RETURN jsonb_build_object('ok', true);
END;
$$;
