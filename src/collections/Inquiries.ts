import type { CollectionConfig } from 'payload'
import { adminOnly, staffOnly, staffOnlyField } from '../access'
import { COUNTRY_OPTIONS } from '../data/countries'
import { attributionFields, consentFields, setEUDoubleOptIn } from '../fields/consent'
import { privateFileFields } from '../fields/privateFiles'
import { assertCountryAllowed } from '../hooks/enforceExclusionList'

/**
 * Public contact form submissions (spec §9, §4.1 `inquiries`).
 *
 * Purpose is zero-friction first contact (QF3-A): never force signup. Hence public `create` and no
 * relationship to `buyers`.
 *
 * Reads are staff-only — this holds names, emails and tech packs belonging to other people.
 */
export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  labels: { singular: 'Inquiry', plural: 'Inquiries' },
  defaultSort: '-createdAt',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'company', 'country', 'status', 'createdAt'],
    group: 'Buyers',
    description: 'Messages sent through the contact form.',
  },
  access: {
    // Public: the contact form posts here without an account (spec §9).
    create: () => true,
    read: staffOnly,
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
    beforeChange: [({ data }) => setEUDoubleOptIn(data)],
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', label: 'Name', required: true },
        { name: 'email', type: 'email', label: 'Email', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'company', type: 'text', label: 'Company (optional)' },
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
      name: 'message',
      type: 'textarea',
      label: 'Message',
      required: true,
    },
    privateFileFields('Tech pack (optional)'),
    consentFields,
    attributionFields,
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'new',
      index: true,
      options: [
        { label: 'New', value: 'new' },
        { label: 'In review', value: 'in-review' },
        { label: 'Replied', value: 'replied' },
        { label: 'Closed', value: 'closed' },
      ],
      access: { create: staffOnlyField, update: staffOnlyField },
      admin: { position: 'sidebar' },
    },
    {
      name: 'internalNotes',
      type: 'textarea',
      label: 'Internal notes',
      access: { read: staffOnlyField, create: staffOnlyField, update: staffOnlyField },
    },
  ],
  timestamps: true,
}
