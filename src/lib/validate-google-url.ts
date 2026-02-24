/**
 * Google Review URL validator.
 * Shared between server API routes and client-side form validation.
 *
 * Accepted domains (all require https):
 *   - g.page           (e.g. https://g.page/r/CxxxxXXXX)
 *   - google.com/maps  (e.g. https://www.google.com/maps/place/...)
 *   - maps.google.com
 *   - search.google.com/local/writereview
 *   - maps.app.goo.gl  (shortened links)
 */

const ALLOWED_PATTERNS: RegExp[] = [
    /^https:\/\/g\.page\//i,
    /^https:\/\/(www\.)?google\.[a-z.]+\/maps\b/i,
    /^https:\/\/maps\.google\.[a-z.]+\//i,
    /^https:\/\/search\.google\.[a-z.]+\/local\/writereview/i,
    /^https:\/\/maps\.app\.goo\.gl\//i,
];

export interface ValidationResult {
    valid: boolean;
    error?: string;
}

export function validateGoogleReviewUrl(url: string | null | undefined): ValidationResult {
    if (!url || !url.trim()) {
        return { valid: false, error: "Google Review link is required." };
    }

    const trimmed = url.trim();

    // Must be HTTPS
    if (!trimmed.startsWith("https://")) {
        return {
            valid: false,
            error: "Link must start with https:// for security.",
        };
    }

    // Must be parseable as a URL
    try {
        new URL(trimmed);
    } catch {
        return { valid: false, error: "This doesn't look like a valid URL." };
    }

    // Must match a known Google review domain
    const isGoogle = ALLOWED_PATTERNS.some((pattern) => pattern.test(trimmed));
    if (!isGoogle) {
        return {
            valid: false,
            error:
                "Please use a Google Review link (g.page, google.com/maps, or maps.app.goo.gl).",
        };
    }

    return { valid: true };
}
