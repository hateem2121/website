/**
 * ISO 3166-1 alpha-2 countries, with the two flags the spec needs attached at source:
 *
 *   eu       — drives the EU double-opt-in requirement on marketing consent (spec §8.6).
 *   currency — ISO 4217 code for the RFQ target-price auto-preselect (spec §4.1, RFQ Plan §4.6).
 *              Static lookup by design: "The map is a static lookup — no external API."
 *
 * Vendored rather than pulled from a package: the list is stable, and a dependency here would
 * need Hateem's approval (CLAUDE.md §6) for data that changes a few times a decade.
 *
 * PROVISIONAL — the country→currency pairs are RFQ Plan §16 register item 6. The Plan marks the
 * principle as spec-fixed and the example pairs as illustrative, so these await Hateem's review.
 * Default is USD wherever a country has no entry below.
 */

export type Country = {
  /** ISO 3166-1 alpha-2 */
  code: string
  name: string
  /** EU member state — triggers double opt-in on marketing consent (spec §8.6) */
  eu?: true
  /** ISO 4217; omitted means fall back to DEFAULT_CURRENCY */
  currency?: string
}

export const DEFAULT_CURRENCY = 'USD'

export const COUNTRIES: readonly Country[] = [
  { code: 'AF', name: 'Afghanistan', currency: 'AFN' },
  { code: 'AL', name: 'Albania', currency: 'ALL' },
  { code: 'DZ', name: 'Algeria', currency: 'DZD' },
  { code: 'AD', name: 'Andorra', currency: 'EUR' },
  { code: 'AO', name: 'Angola', currency: 'AOA' },
  { code: 'AG', name: 'Antigua and Barbuda', currency: 'XCD' },
  { code: 'AR', name: 'Argentina', currency: 'ARS' },
  { code: 'AM', name: 'Armenia', currency: 'AMD' },
  { code: 'AU', name: 'Australia', currency: 'AUD' },
  { code: 'AT', name: 'Austria', eu: true, currency: 'EUR' },
  { code: 'AZ', name: 'Azerbaijan', currency: 'AZN' },
  { code: 'BS', name: 'Bahamas', currency: 'BSD' },
  { code: 'BH', name: 'Bahrain', currency: 'BHD' },
  { code: 'BD', name: 'Bangladesh', currency: 'BDT' },
  { code: 'BB', name: 'Barbados', currency: 'BBD' },
  { code: 'BY', name: 'Belarus', currency: 'BYN' },
  { code: 'BE', name: 'Belgium', eu: true, currency: 'EUR' },
  { code: 'BZ', name: 'Belize', currency: 'BZD' },
  { code: 'BJ', name: 'Benin', currency: 'XOF' },
  { code: 'BT', name: 'Bhutan', currency: 'BTN' },
  { code: 'BO', name: 'Bolivia', currency: 'BOB' },
  { code: 'BA', name: 'Bosnia and Herzegovina', currency: 'BAM' },
  { code: 'BW', name: 'Botswana', currency: 'BWP' },
  { code: 'BR', name: 'Brazil', currency: 'BRL' },
  { code: 'BN', name: 'Brunei Darussalam', currency: 'BND' },
  // Bulgaria adopted the euro on 2026-01-01 (Council decision, July 2025).
  { code: 'BG', name: 'Bulgaria', eu: true, currency: 'EUR' },
  { code: 'BF', name: 'Burkina Faso', currency: 'XOF' },
  { code: 'BI', name: 'Burundi', currency: 'BIF' },
  { code: 'CV', name: 'Cabo Verde', currency: 'CVE' },
  { code: 'KH', name: 'Cambodia', currency: 'KHR' },
  { code: 'CM', name: 'Cameroon', currency: 'XAF' },
  { code: 'CA', name: 'Canada', currency: 'CAD' },
  { code: 'CF', name: 'Central African Republic', currency: 'XAF' },
  { code: 'TD', name: 'Chad', currency: 'XAF' },
  { code: 'CL', name: 'Chile', currency: 'CLP' },
  { code: 'CN', name: 'China', currency: 'CNY' },
  { code: 'CO', name: 'Colombia', currency: 'COP' },
  { code: 'KM', name: 'Comoros', currency: 'KMF' },
  { code: 'CG', name: 'Congo', currency: 'XAF' },
  { code: 'CD', name: 'Congo, Democratic Republic of the', currency: 'CDF' },
  { code: 'CR', name: 'Costa Rica', currency: 'CRC' },
  { code: 'CI', name: "Côte d'Ivoire", currency: 'XOF' },
  { code: 'HR', name: 'Croatia', eu: true, currency: 'EUR' },
  { code: 'CU', name: 'Cuba', currency: 'CUP' },
  { code: 'CY', name: 'Cyprus', eu: true, currency: 'EUR' },
  { code: 'CZ', name: 'Czechia', eu: true, currency: 'CZK' },
  { code: 'DK', name: 'Denmark', eu: true, currency: 'DKK' },
  { code: 'DJ', name: 'Djibouti', currency: 'DJF' },
  { code: 'DM', name: 'Dominica', currency: 'XCD' },
  { code: 'DO', name: 'Dominican Republic', currency: 'DOP' },
  { code: 'EC', name: 'Ecuador', currency: 'USD' },
  { code: 'EG', name: 'Egypt', currency: 'EGP' },
  { code: 'SV', name: 'El Salvador', currency: 'USD' },
  { code: 'GQ', name: 'Equatorial Guinea', currency: 'XAF' },
  { code: 'ER', name: 'Eritrea', currency: 'ERN' },
  { code: 'EE', name: 'Estonia', eu: true, currency: 'EUR' },
  { code: 'SZ', name: 'Eswatini', currency: 'SZL' },
  { code: 'ET', name: 'Ethiopia', currency: 'ETB' },
  { code: 'FJ', name: 'Fiji', currency: 'FJD' },
  { code: 'FI', name: 'Finland', eu: true, currency: 'EUR' },
  { code: 'FR', name: 'France', eu: true, currency: 'EUR' },
  { code: 'GA', name: 'Gabon', currency: 'XAF' },
  { code: 'GM', name: 'Gambia', currency: 'GMD' },
  { code: 'GE', name: 'Georgia', currency: 'GEL' },
  { code: 'DE', name: 'Germany', eu: true, currency: 'EUR' },
  { code: 'GH', name: 'Ghana', currency: 'GHS' },
  { code: 'GR', name: 'Greece', eu: true, currency: 'EUR' },
  { code: 'GD', name: 'Grenada', currency: 'XCD' },
  { code: 'GT', name: 'Guatemala', currency: 'GTQ' },
  { code: 'GN', name: 'Guinea', currency: 'GNF' },
  { code: 'GW', name: 'Guinea-Bissau', currency: 'XOF' },
  { code: 'GY', name: 'Guyana', currency: 'GYD' },
  { code: 'HT', name: 'Haiti', currency: 'HTG' },
  { code: 'HN', name: 'Honduras', currency: 'HNL' },
  { code: 'HK', name: 'Hong Kong', currency: 'HKD' },
  { code: 'HU', name: 'Hungary', eu: true, currency: 'HUF' },
  { code: 'IS', name: 'Iceland', currency: 'ISK' },
  { code: 'IN', name: 'India', currency: 'INR' },
  { code: 'ID', name: 'Indonesia', currency: 'IDR' },
  { code: 'IR', name: 'Iran', currency: 'IRR' },
  { code: 'IQ', name: 'Iraq', currency: 'IQD' },
  { code: 'IE', name: 'Ireland', eu: true, currency: 'EUR' },
  { code: 'IL', name: 'Israel', currency: 'ILS' },
  { code: 'IT', name: 'Italy', eu: true, currency: 'EUR' },
  { code: 'JM', name: 'Jamaica', currency: 'JMD' },
  { code: 'JP', name: 'Japan', currency: 'JPY' },
  { code: 'JO', name: 'Jordan', currency: 'JOD' },
  { code: 'KZ', name: 'Kazakhstan', currency: 'KZT' },
  { code: 'KE', name: 'Kenya', currency: 'KES' },
  { code: 'KI', name: 'Kiribati', currency: 'AUD' },
  { code: 'KW', name: 'Kuwait', currency: 'KWD' },
  { code: 'KG', name: 'Kyrgyzstan', currency: 'KGS' },
  { code: 'LA', name: "Lao People's Democratic Republic", currency: 'LAK' },
  { code: 'LV', name: 'Latvia', eu: true, currency: 'EUR' },
  { code: 'LB', name: 'Lebanon', currency: 'LBP' },
  { code: 'LS', name: 'Lesotho', currency: 'LSL' },
  { code: 'LR', name: 'Liberia', currency: 'LRD' },
  { code: 'LY', name: 'Libya', currency: 'LYD' },
  { code: 'LI', name: 'Liechtenstein', currency: 'CHF' },
  { code: 'LT', name: 'Lithuania', eu: true, currency: 'EUR' },
  { code: 'LU', name: 'Luxembourg', eu: true, currency: 'EUR' },
  { code: 'MO', name: 'Macao', currency: 'MOP' },
  { code: 'MG', name: 'Madagascar', currency: 'MGA' },
  { code: 'MW', name: 'Malawi', currency: 'MWK' },
  { code: 'MY', name: 'Malaysia', currency: 'MYR' },
  { code: 'MV', name: 'Maldives', currency: 'MVR' },
  { code: 'ML', name: 'Mali', currency: 'XOF' },
  { code: 'MT', name: 'Malta', eu: true, currency: 'EUR' },
  { code: 'MH', name: 'Marshall Islands', currency: 'USD' },
  { code: 'MR', name: 'Mauritania', currency: 'MRU' },
  { code: 'MU', name: 'Mauritius', currency: 'MUR' },
  { code: 'MX', name: 'Mexico', currency: 'MXN' },
  { code: 'FM', name: 'Micronesia', currency: 'USD' },
  { code: 'MD', name: 'Moldova', currency: 'MDL' },
  { code: 'MC', name: 'Monaco', currency: 'EUR' },
  { code: 'MN', name: 'Mongolia', currency: 'MNT' },
  { code: 'ME', name: 'Montenegro', currency: 'EUR' },
  { code: 'MA', name: 'Morocco', currency: 'MAD' },
  { code: 'MZ', name: 'Mozambique', currency: 'MZN' },
  { code: 'MM', name: 'Myanmar', currency: 'MMK' },
  { code: 'NA', name: 'Namibia', currency: 'NAD' },
  { code: 'NR', name: 'Nauru', currency: 'AUD' },
  { code: 'NP', name: 'Nepal', currency: 'NPR' },
  { code: 'NL', name: 'Netherlands', eu: true, currency: 'EUR' },
  { code: 'NZ', name: 'New Zealand', currency: 'NZD' },
  { code: 'NI', name: 'Nicaragua', currency: 'NIO' },
  { code: 'NE', name: 'Niger', currency: 'XOF' },
  { code: 'NG', name: 'Nigeria', currency: 'NGN' },
  { code: 'KP', name: "Korea, Democratic People's Republic of", currency: 'KPW' },
  { code: 'MK', name: 'North Macedonia', currency: 'MKD' },
  { code: 'NO', name: 'Norway', currency: 'NOK' },
  { code: 'OM', name: 'Oman', currency: 'OMR' },
  { code: 'PK', name: 'Pakistan', currency: 'PKR' },
  { code: 'PW', name: 'Palau', currency: 'USD' },
  { code: 'PS', name: 'Palestine, State of', currency: 'ILS' },
  { code: 'PA', name: 'Panama', currency: 'PAB' },
  { code: 'PG', name: 'Papua New Guinea', currency: 'PGK' },
  { code: 'PY', name: 'Paraguay', currency: 'PYG' },
  { code: 'PE', name: 'Peru', currency: 'PEN' },
  { code: 'PH', name: 'Philippines', currency: 'PHP' },
  { code: 'PL', name: 'Poland', eu: true, currency: 'PLN' },
  { code: 'PT', name: 'Portugal', eu: true, currency: 'EUR' },
  { code: 'QA', name: 'Qatar', currency: 'QAR' },
  { code: 'RO', name: 'Romania', eu: true, currency: 'RON' },
  { code: 'RU', name: 'Russian Federation', currency: 'RUB' },
  { code: 'RW', name: 'Rwanda', currency: 'RWF' },
  { code: 'KN', name: 'Saint Kitts and Nevis', currency: 'XCD' },
  { code: 'LC', name: 'Saint Lucia', currency: 'XCD' },
  { code: 'VC', name: 'Saint Vincent and the Grenadines', currency: 'XCD' },
  { code: 'WS', name: 'Samoa', currency: 'WST' },
  { code: 'SM', name: 'San Marino', currency: 'EUR' },
  { code: 'ST', name: 'Sao Tome and Principe', currency: 'STN' },
  { code: 'SA', name: 'Saudi Arabia', currency: 'SAR' },
  { code: 'SN', name: 'Senegal', currency: 'XOF' },
  { code: 'RS', name: 'Serbia', currency: 'RSD' },
  { code: 'SC', name: 'Seychelles', currency: 'SCR' },
  { code: 'SL', name: 'Sierra Leone', currency: 'SLE' },
  { code: 'SG', name: 'Singapore', currency: 'SGD' },
  { code: 'SK', name: 'Slovakia', eu: true, currency: 'EUR' },
  { code: 'SI', name: 'Slovenia', eu: true, currency: 'EUR' },
  { code: 'SB', name: 'Solomon Islands', currency: 'SBD' },
  { code: 'SO', name: 'Somalia', currency: 'SOS' },
  { code: 'ZA', name: 'South Africa', currency: 'ZAR' },
  { code: 'KR', name: 'Korea, Republic of', currency: 'KRW' },
  { code: 'SS', name: 'South Sudan', currency: 'SSP' },
  { code: 'ES', name: 'Spain', eu: true, currency: 'EUR' },
  { code: 'LK', name: 'Sri Lanka', currency: 'LKR' },
  { code: 'SD', name: 'Sudan', currency: 'SDG' },
  { code: 'SR', name: 'Suriname', currency: 'SRD' },
  { code: 'SE', name: 'Sweden', eu: true, currency: 'SEK' },
  { code: 'CH', name: 'Switzerland', currency: 'CHF' },
  { code: 'SY', name: 'Syrian Arab Republic', currency: 'SYP' },
  { code: 'TW', name: 'Taiwan', currency: 'TWD' },
  { code: 'TJ', name: 'Tajikistan', currency: 'TJS' },
  { code: 'TZ', name: 'Tanzania', currency: 'TZS' },
  { code: 'TH', name: 'Thailand', currency: 'THB' },
  { code: 'TL', name: 'Timor-Leste', currency: 'USD' },
  { code: 'TG', name: 'Togo', currency: 'XOF' },
  { code: 'TO', name: 'Tonga', currency: 'TOP' },
  { code: 'TT', name: 'Trinidad and Tobago', currency: 'TTD' },
  { code: 'TN', name: 'Tunisia', currency: 'TND' },
  { code: 'TR', name: 'Türkiye', currency: 'TRY' },
  { code: 'TM', name: 'Turkmenistan', currency: 'TMT' },
  { code: 'TV', name: 'Tuvalu', currency: 'AUD' },
  { code: 'UG', name: 'Uganda', currency: 'UGX' },
  { code: 'UA', name: 'Ukraine', currency: 'UAH' },
  { code: 'AE', name: 'United Arab Emirates', currency: 'AED' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP' },
  { code: 'US', name: 'United States of America', currency: 'USD' },
  { code: 'UY', name: 'Uruguay', currency: 'UYU' },
  { code: 'UZ', name: 'Uzbekistan', currency: 'UZS' },
  { code: 'VU', name: 'Vanuatu', currency: 'VUV' },
  { code: 'VA', name: 'Holy See', currency: 'EUR' },
  { code: 'VE', name: 'Venezuela', currency: 'VES' },
  { code: 'VN', name: 'Viet Nam', currency: 'VND' },
  { code: 'YE', name: 'Yemen', currency: 'YER' },
  { code: 'ZM', name: 'Zambia', currency: 'ZMW' },
  { code: 'ZW', name: 'Zimbabwe', currency: 'ZWG' },
] as const

/** Payload `select` options, alphabetical by country name. */
export const COUNTRY_OPTIONS = COUNTRIES.map(({ code, name }) => ({ label: name, value: code })).sort(
  (a, b) => a.label.localeCompare(b.label, 'en'),
)

const BY_CODE = new Map(COUNTRIES.map((c) => [c.code, c]))

export const getCountry = (code: string | null | undefined): Country | undefined =>
  code ? BY_CODE.get(code) : undefined

export const isValidCountryCode = (code: string | null | undefined): boolean =>
  Boolean(code && BY_CODE.has(code))

/** EU member state → marketing opt-in needs double opt-in (spec §8.6). */
export const isEUCountry = (code: string | null | undefined): boolean =>
  Boolean(getCountry(code)?.eu)

/** Static ISO-4217 preselect for the RFQ target price; always changeable by the buyer. */
export const currencyForCountry = (code: string | null | undefined): string =>
  getCountry(code)?.currency ?? DEFAULT_CURRENCY

/** Every currency actually reachable from the country map, plus the default. */
export const CURRENCY_OPTIONS = Array.from(
  new Set([DEFAULT_CURRENCY, ...COUNTRIES.map((c) => c.currency).filter(Boolean as unknown as (v: string | undefined) => v is string)]),
)
  .sort()
  .map((code) => ({ label: code, value: code }))
