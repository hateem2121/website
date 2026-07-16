import type { CollectionConfig } from 'payload'
import { adminOnly, ownRFQsOrStaff, staffOnly, staffOnlyField } from '../access'
import { COUNTRY_OPTIONS, CURRENCY_OPTIONS, DEFAULT_CURRENCY } from '../data/countries'
import {
  ADULT_SIZE_OPTIONS,
  BRANDING_OPTIONS,
  CERTIFICATION_OPTIONS,
  ONE_SIZE_OPTION,
  YOUTH_SIZE_OPTIONS,
} from '../data/catalog-options'
import { attributionFields, consentFields, setEUDoubleOptIn } from '../fields/consent'
import { privateFileFields } from '../fields/privateFiles'
import { assertCountryAllowed } from '../hooks/enforceExclusionList'

/**
 * Quote requests (spec §4.1 `rfqs`, §8). One engine, two entry points: guest and portal (§8.1).
 *
 * This collection is the RECORD. The 4-step form, its conditional cascades, anti-abuse and emails
 * are Phase 5 — but every validation rule the form will enforce in the browser is mirrored here,
 * because spec §8.8 and RFQ Plan §10 both require the server to be authoritative.
 *
 * Provisional option values: branding (RFQ Plan §16 item 3) and sizes (§16 item 2) are drafts
 * awaiting Hateem's approval. Certifications (§4.7) are NOT provisional — they trace to the
 * Company Master Prompt.
 */
export const RFQs: CollectionConfig = {
  slug: 'rfqs',
  labels: { singular: 'Quote request', plural: 'Quote requests' },
  defaultSort: '-submittedAt',
  admin: {
    useAsTitle: 'referenceNumber',
    defaultColumns: ['referenceNumber', 'company', 'country', 'requestType', 'status', 'submittedAt'],
    group: 'Buyers',
    description: 'Every quote request, from guests and from portal accounts.',
  },
  access: {
    // Public: the guest RFQ path requires no account (spec §8.1, QF3).
    create: () => true,
    // Staff see all; an approved buyer sees only their own — this powers "My RFQs" (spec §10).
    read: ownRFQsOrStaff,
    update: staffOnly,
    delete: adminOnly,
  },
  hooks: {
    beforeValidate: [
      async ({ data, req, operation }) => {
        if (operation === 'create' && data?.country) {
          await assertCountryAllowed(req, data.country as string)
        }
        return data
      },
    ],
    beforeChange: [
      async ({ data, req, operation }) => {
        let next = setEUDoubleOptIn(data)

        if (operation === 'create') {
          next = { ...next, submittedAt: next.submittedAt ?? new Date().toISOString() }

          if (!next.referenceNumber) {
            // Sequential per calendar year, e.g. RFQ-2026-000123 (spec §4.1).
            // Volume here is a handful a day, so a count-and-increment is adequate; the unique
            // index below is the backstop. Phase 5 owns the submit path and can harden this if
            // concurrent submissions ever become realistic.
            const year = new Date().getFullYear()
            const { totalDocs } = await req.payload.count({
              collection: 'rfqs',
              where: { referenceNumber: { like: `RFQ-${year}-` } },
              req,
            })
            next = {
              ...next,
              referenceNumber: `RFQ-${year}-${String(totalDocs + 1).padStart(6, '0')}`,
            }
          }
        }
        return next
      },
    ],
  },
  fields: [
    {
      name: 'referenceNumber',
      type: 'text',
      label: 'Reference',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Generated automatically. This is the number quoted to the buyer.',
      },
    },
    {
      name: 'source',
      type: 'select',
      label: 'Came from',
      required: true,
      defaultValue: 'guest',
      options: [
        { label: 'Guest form', value: 'guest' },
        { label: 'Buyer portal', value: 'portal' },
      ],
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'buyer',
      type: 'relationship',
      relationTo: 'buyers',
      label: 'Buyer account',
      index: true, // "My RFQs" filters on this
      admin: {
        position: 'sidebar',
        description:
          'Set when the request came from a logged-in buyer, or when a guest later creates an account.',
      },
    },
    {
      name: 'submittedAt',
      type: 'date',
      label: 'Submitted',
      admin: { position: 'sidebar', readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contact',
          description: 'Required (spec §8.2). Pre-filled and locked when a buyer is signed in.',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'name', type: 'text', label: 'Name', required: true },
                { name: 'company', type: 'text', label: 'Company', required: true },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'email', type: 'email', label: 'Email', required: true },
                { name: 'phone', type: 'text', label: 'Phone (optional)' },
              ],
            },
            {
              name: 'country',
              type: 'select',
              label: 'Country',
              required: true,
              options: COUNTRY_OPTIONS,
            },
          ],
        },
        {
          label: 'Request',
          fields: [
            {
              name: 'requestType',
              type: 'select',
              label: 'Request type',
              required: true,
              defaultValue: 'bulk',
              options: [
                { label: 'Bulk order quote', value: 'bulk' },
                { label: 'Sample request', value: 'sample' },
              ],
            },
            {
              name: 'styles',
              type: 'array',
              label: 'Styles',
              minRows: 1,
              labels: { singular: 'Style', plural: 'Styles' },
              admin: { initCollapsed: true },
              validate: (value: unknown) => {
                const rows = (value ?? []) as Array<Record<string, unknown>>
                if (!rows.length) return 'Add at least one style.'
                // Style anchor rule (spec §8.2 / RQ10, error copy C8): no empty RFQs.
                const anchorless = rows.findIndex(
                  (r) => !r.productRef && !r.category && !String(r.description ?? '').trim(),
                )
                if (anchorless !== -1) {
                  return `Style ${anchorless + 1}: tell us at least one thing about this style — pick a product, choose a category, or describe it in a sentence.`
                }
                return true
              },
              fields: [
                // --- the anchor: at least one of these three (spec §8.2) ---
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'productRef',
                      type: 'relationship',
                      relationTo: 'products',
                      label: 'Product (optional)',
                    },
                    {
                      name: 'category',
                      type: 'relationship',
                      relationTo: 'categories',
                      label: 'Category (optional)',
                    },
                  ],
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Describe the style (optional)',
                },
                // --- fabric cascade ---
                {
                  name: 'fabricFamily',
                  type: 'relationship',
                  relationTo: 'fabric-library',
                  label: 'Fabric',
                },
                {
                  name: 'fibres',
                  type: 'array',
                  label: 'Fibres',
                  labels: { singular: 'Fibre', plural: 'Fibres' },
                  // Blend must total 100% when more than one fibre is entered (spec §4.1, copy C9).
                  validate: (value: unknown) => {
                    const rows = (value ?? []) as Array<{ percentage?: number }>
                    if (rows.length <= 1) return true
                    const total = rows.reduce((sum, r) => sum + (Number(r.percentage) || 0), 0)
                    if (total !== 100) {
                      return `Fibre percentages need to total 100% — you're at ${total}%.`
                    }
                    return true
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'fibre', type: 'text', label: 'Fibre', required: true },
                        {
                          name: 'percentage',
                          type: 'number',
                          label: '%',
                          min: 0,
                          max: 100,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'certificationsRequested',
                  type: 'select',
                  hasMany: true,
                  label: 'Certifications requested',
                  options: [...CERTIFICATION_OPTIONS],
                  admin: {
                    description:
                      'These certifications sit with Durus Industries and our certified suppliers — not with RUN itself.',
                  },
                },
                {
                  name: 'brandingOptions',
                  type: 'select',
                  hasMany: true,
                  label: 'Branding & customisation',
                  // PROVISIONAL — RFQ Plan §16 register item 3.
                  options: [...BRANDING_OPTIONS],
                },
                {
                  name: 'brandingOther',
                  type: 'text',
                  label: 'Other branding',
                  admin: { condition: (_, sibling) => sibling?.brandingOptions?.includes?.('other') },
                },
                // --- colours: unlimited; totals only validated when quantities are entered ---
                {
                  name: 'colours',
                  type: 'array',
                  label: 'Colours',
                  labels: { singular: 'Colour', plural: 'Colours' },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'colour', type: 'text', label: 'Colour', required: true },
                        {
                          name: 'quantity',
                          type: 'number',
                          label: 'Quantity (optional)',
                          min: 0,
                        },
                      ],
                    },
                  ],
                },
                // --- sizes: per-size quantities, or leave quantities blank to just multi-select ---
                {
                  name: 'sizes',
                  type: 'array',
                  label: 'Sizes',
                  labels: { singular: 'Size', plural: 'Sizes' },
                  admin: {
                    description:
                      'Enter quantities per size, or just list the sizes and we will size-curve with you.',
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'size',
                          type: 'select',
                          label: 'Size',
                          required: true,
                          // PROVISIONAL — RFQ Plan §16 register item 2.
                          options: [...ADULT_SIZE_OPTIONS, ...YOUTH_SIZE_OPTIONS, ONE_SIZE_OPTION],
                        },
                        { name: 'quantity', type: 'number', label: 'Quantity (optional)', min: 0 },
                      ],
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'quantity',
                      type: 'number',
                      label: 'Total quantity',
                      min: 0,
                      admin: {
                        description:
                          'A low quantity never blocks the request — we just flag that it may not be feasible.',
                      },
                    },
                    {
                      name: 'targetPrice',
                      type: 'number',
                      label: 'Target price per unit (optional)',
                      min: 0,
                    },
                    {
                      name: 'currency',
                      type: 'select',
                      label: 'Currency',
                      defaultValue: DEFAULT_CURRENCY,
                      options: CURRENCY_OPTIONS,
                      admin: {
                        description: 'Pre-selected from the country above; the buyer can change it.',
                      },
                    },
                  ],
                },
                privateFileFields('Tech packs & artwork'),
              ],
            },
          ],
        },
        {
          label: 'Consents & attribution',
          fields: [consentFields, attributionFields],
        },
        {
          label: 'Ops',
          description: 'Internal only — never visible to the buyer.',
          fields: [
            {
              name: 'status',
              type: 'select',
              label: 'Status',
              defaultValue: 'new',
              index: true,
              options: [
                { label: 'New', value: 'new' },
                { label: 'In review', value: 'in-review' },
                { label: 'Quoted', value: 'quoted' },
                { label: 'Won', value: 'won' },
                { label: 'Lost', value: 'lost' },
                { label: 'Archived', value: 'archived' },
              ],
              access: { create: staffOnlyField, update: staffOnlyField },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'assignee',
                  type: 'relationship',
                  relationTo: 'admins',
                  label: 'Owner',
                  access: { read: staffOnlyField, create: staffOnlyField, update: staffOnlyField },
                },
                {
                  name: 'followUpDate',
                  type: 'date',
                  label: 'Follow up on',
                  access: { read: staffOnlyField, create: staffOnlyField, update: staffOnlyField },
                  admin: { date: { pickerAppearance: 'dayOnly' } },
                },
              ],
            },
            {
              name: 'internalNotes',
              type: 'textarea',
              label: 'Internal notes',
              access: { read: staffOnlyField, create: staffOnlyField, update: staffOnlyField },
            },
            {
              name: 'outcome',
              type: 'textarea',
              label: 'Outcome',
              access: { read: staffOnlyField, create: staffOnlyField, update: staffOnlyField },
            },
          ],
        },
      ],
    },
  ],
  timestamps: true,
}
