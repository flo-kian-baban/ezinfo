/** Touchpoint primary mode */
export type TouchpointMode = 'GOOGLE_REVIEWS' | 'SURVEY';

/** Survey question shape */
export interface SurveyQuestion {
    id?: string;
    sort_order: number;
    question_type: 'short_answer' | 'multiple_choice';
    question_text: string;
    options: string[];
}

/** Touchpoint config shape shared by public + admin */
export interface TouchpointConfig {
    slug: string;
    business_name: string;
    touchpoint_id: string;
    enabled: boolean;
    primary_mode: TouchpointMode;
    redirect_mode: "assist" | "direct";
    google_review_enabled: boolean;
    google_review_url: string;
    prompt_title: string;
    prompt_subtitle: string;
    ai_enabled: boolean;
    brand_name: string | null;
    brand_logo_url: string | null;
    brand_accent: string | null;
    theme_bg_color: string | null;
    theme_shade_color: string | null;
    offer_enabled?: boolean;
    offer_title?: string | null;
    offer_description?: string | null;
    offer_terms?: string | null;
    survey_questions?: SurveyQuestion[];
}
