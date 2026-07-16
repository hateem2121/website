/**
 * Shared option lists for the catalog and RFQ schema.
 *
 * Provenance matters here, so each list records it:
 *   SETTLED     — traced to the constitution; safe to rely on.
 *   PROVISIONAL — RFQ Plan §16 register; drafted content awaiting Hateem's line-by-line approval.
 *
 * Provisional lists are option *values* only — no structure depends on them, and no content has
 * been entered against them yet, so a correction after §16 review is a value edit, not a data
 * migration. See BUILD_LOG.md for the open-question batch.
 */

/**
 * SETTLED — Company Master Prompt compliance list, via RFQ Plan §4.7 (not a §16 register item).
 *
 * Ecosystem framing is binding UI/copy law (spec §21.7): these certifications sit with Durus
 * Industries and certified suppliers, NEVER with RUN itself. Never render this list under a claim
 * that "RUN is certified". The trust note (RFQ Plan copy C3) must render alongside this field.
 */
export const CERTIFICATION_OPTIONS = [
  { label: 'GOTS (Global Organic Textile Standard)', value: 'gots' },
  { label: 'OEKO-TEX Standard 100', value: 'oeko-tex-standard-100' },
  { label: 'OEKO-TEX Made in Green', value: 'oeko-tex-made-in-green' },
  { label: 'GRS (Global Recycled Standard)', value: 'grs' },
  { label: 'RCS (Recycled Claim Standard)', value: 'rcs' },
  { label: 'Organic 100 Content Standard', value: 'organic-100' },
  { label: 'ISO 9001 (Quality Management System)', value: 'iso-9001' },
  { label: 'SMETA / Sedex', value: 'smeta-sedex' },
  { label: 'BSCI (Business Social Compliance Initiative)', value: 'bsci' },
] as const

/** PROVISIONAL — RFQ Plan §4.4, §16 register item 2. Adult range. */
export const ADULT_SIZE_OPTIONS = [
  { label: 'XS', value: 'xs' },
  { label: 'S', value: 's' },
  { label: 'M', value: 'm' },
  { label: 'L', value: 'l' },
  { label: 'XL', value: 'xl' },
  { label: '2XL', value: '2xl' },
  { label: '3XL', value: '3xl' },
  { label: '4XL', value: '4xl' },
  { label: '5XL', value: '5xl' },
] as const

/** PROVISIONAL — RFQ Plan §4.4, §16 register item 2. Youth bands (spec §4.1 requires Youth). */
export const YOUTH_SIZE_OPTIONS = [
  { label: '4–5Y', value: 'y4-5' },
  { label: '6–7Y', value: 'y6-7' },
  { label: '8–9Y', value: 'y8-9' },
  { label: '10–11Y', value: 'y10-11' },
  { label: '12–13Y', value: 'y12-13' },
  { label: '14–15Y', value: 'y14-15' },
] as const

/**
 * PROVISIONAL — RFQ Plan §4.4, §16 register item 2.
 * One-Size is offered automatically when category = Sports Accessories (spec §4.1).
 */
export const ONE_SIZE_OPTION = { label: 'One-Size', value: 'one-size' } as const

/** Every size, grouped for editor-facing dropdowns. */
export const SIZE_OPTIONS = [
  ...ADULT_SIZE_OPTIONS,
  ...YOUTH_SIZE_OPTIONS,
  ONE_SIZE_OPTION,
] as const

/**
 * PROVISIONAL — RFQ Plan §4.8, §16 register item 3.
 *
 * Sublimation printing and precision embroidery are confirmed in-house capabilities (Company
 * Master Prompt, manufacturing step 4). The remainder is regenerated content and needs
 * confirmation against RUN's actual offerings before it is shown to a buyer.
 */
export const BRANDING_OPTIONS = [
  { label: 'All-over sublimation print', value: 'sublimation' },
  { label: 'Screen print', value: 'screen-print' },
  { label: 'Embroidery', value: 'embroidery' },
  { label: 'Heat transfer / vinyl', value: 'heat-transfer' },
  { label: 'Woven label', value: 'woven-label' },
  { label: 'Printed (tagless) neck label', value: 'tagless-neck-label' },
  { label: 'Hang tags', value: 'hang-tags' },
  { label: 'Custom packaging / poly bags', value: 'custom-packaging' },
  { label: 'Plain (no branding)', value: 'plain' },
  { label: 'Other (describe below)', value: 'other' },
] as const

/** Slug of the one category that unlocks One-Size (spec §4.1). Kept here so RFQ logic and the
 *  category seed cannot drift apart. */
export const SPORTS_ACCESSORIES_SLUG = 'sports-accessories'
