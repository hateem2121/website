import { APIError, type PayloadRequest } from 'payload'
import { getCountry } from '../data/countries'

/**
 * Server-side market exclusion check (spec §8.4, Appendix B).
 *
 * Appendix B is explicit that the SAME check applies at all three entry points — RFQ, buyer
 * signup, and contact form — and that the server revalidates to guard against dropdown tampering.
 * A hidden `<option>` is a UI convenience, not a control: without this, anyone can POST an excluded
 * country straight to the REST API.
 *
 * Reads the `exclusionList` global on every call rather than caching a copy, because Appendix B
 * requires the list to be admin-editable without a deploy — a cached copy would keep enforcing the
 * old list until the next release.
 */
export const assertCountryAllowed = async (
  req: PayloadRequest,
  country: string | null | undefined,
): Promise<void> => {
  if (!country) return

  const global = await req.payload.findGlobal({ slug: 'exclusion-list', req })
  const excluded = (global?.countries as string[] | undefined) ?? []

  if (!excluded.includes(country)) return

  const countryName = getCountry(country)?.name ?? country
  const template =
    (global?.politeMessage as string | undefined) ??
    "Thank you for your interest in RUN APPAREL. We're currently unable to take on new partnerships in {country}."

  // 403: a deliberate business rule, not a malformed request.
  throw new APIError(template.replace(/\{country\}/g, countryName), 403, undefined, true)
}
