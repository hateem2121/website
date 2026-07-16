import type { GlobalConfig } from 'payload'
import { adminOnly, anyone } from '../access'
import { COUNTRY_OPTIONS } from '../data/countries'

/**
 * The market exclusion list (spec §4.2, §8.4, Appendix B).
 *
 * SINGLE SOURCE OF TRUTH. Appendix B is explicit: this global gates the RFQ country dropdown,
 * buyer signup, and the contact form identically. The enforcement helper reads this global on
 * every submission — see src/hooks/enforceExclusionList.ts — so edits here take effect immediately
 * with no deploy, which Appendix B requires.
 *
 * Seeded with the six countries from the RFQ Plan. Dropdown-level exclusion only; no IP
 * geo-blocking at launch.
 */
export const ExclusionList: GlobalConfig = {
  slug: 'exclusion-list',
  label: 'Market exclusion list',
  admin: {
    group: 'Settings',
    description:
      'Countries we do not take new partnerships from. Applies to the quote form, buyer signup and the contact form — all three, automatically.',
  },
  access: {
    // Public read: the three public forms need it to build their country dropdowns.
    read: anyone,
    update: adminOnly,
  },
  fields: [
    {
      name: 'countries',
      type: 'select',
      hasMany: true,
      label: 'Excluded countries',
      options: COUNTRY_OPTIONS,
      // Seed per spec Appendix B.
      defaultValue: ['BD', 'CN', 'IN', 'IL', 'PK', 'LK'],
      admin: {
        description:
          'Anyone choosing one of these sees the polite message below and cannot submit. Changes take effect straight away.',
      },
    },
    {
      name: 'politeMessage',
      type: 'textarea',
      label: 'Message shown to excluded countries',
      // RFQ Plan copy C1 — PROVISIONAL, §16 register item 4, awaiting Hateem's approval.
      defaultValue:
        "Thank you for your interest in RUN APPAREL. We're currently unable to take on new partnerships in {country}, so this form can't be submitted for that market. We appreciate your understanding.",
      admin: {
        description:
          'Write {country} where the country name should appear — we fill it in automatically.',
      },
    },
  ],
}
