/**
 * Service types. `services.service_type` stores the `name`; `slug` maps to
 * /services?type=<slug>.
 */
export const serviceTypes = [
  { name: "Venue", plural: "Venues", slug: "venues" },
  { name: "Event Package", plural: "Event Packages", slug: "event-packages" },
  { name: "Other", plural: "Other Services", slug: "other" },
] as const;

export type ServiceTypeName = (typeof serviceTypes)[number]["name"];

/** Contact address quote requests are sent to. */
export const QUOTE_EMAIL = "hello@balloora.events";

/** mailto: link that opens a quote request pre-filled for a service. */
export function quoteMailto(serviceTitle?: string): string {
  const subject = serviceTitle ? `Quote request: ${serviceTitle}` : "Quote request";
  const body = [
    "Hi Balloora team,",
    "",
    serviceTitle ? `I'm interested in "${serviceTitle}".` : "I'd like a quote for my event.",
    "",
    "Event date:",
    "Number of guests:",
    "Occasion:",
    "Anything else we should know:",
  ].join("\n");
  return `mailto:${QUOTE_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
