/**
 * Hex color validation & sanitization.
 * Shared between server API routes and client components.
 *
 * Only accepts strict #RRGGBB format (6 hex digits).
 * This prevents CSS injection via color fields that flow into
 * <style> blocks and inline styles.
 */

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

/** Returns true if the value is a valid #RRGGBB hex string. */
export function isValidHex(value: string): boolean {
    return HEX_RE.test(value);
}

/**
 * Returns the value if it's a valid hex, otherwise returns the fallback.
 * Use this at every point where a color flows into CSS.
 */
export function sanitizeHex(
    value: string | null | undefined,
    fallback?: string
): string | undefined {
    if (!value) return fallback;
    return HEX_RE.test(value) ? value : fallback;
}

/** Color field names that must be validated on the API layer. */
export const COLOR_FIELDS = [
    "theme_bg_color",
    "theme_shade_color",
    "brand_accent",
] as const;
