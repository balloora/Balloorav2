/**
 * Format an integer amount of the smallest currency unit (e.g. cents) as a
 * localized currency string. Storing money as integer cents avoids
 * floating-point rounding errors.
 */
export function formatPrice(cents: number, currency = "usd", locale = "en-US"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

/** Merge conditional class name strings, dropping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** URL-safe slug from an arbitrary string. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
