import type { Field } from 'payload'

/**
 * Shared SEO group (spec §4.1 — categories, products, pages, posts each carry one).
 *
 * Labels and descriptions are written for non-technical editors, per spec §4's standing rule.
 */
export const seoField: Field = {
  name: 'seo',
  type: 'group',
  label: 'Search engine listing',
  admin: {
    description:
      'Controls how this page looks in Google results and when shared on social media. Safe to leave blank — we fall back to the title and description above.',
  },
  fields: [
    {
      name: 'metaTitle',
      type: 'text',
      label: 'Google headline',
      admin: {
        description: 'Aim for under 60 characters — Google cuts off longer titles.',
      },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      label: 'Google description',
      admin: {
        description:
          'The grey summary under the headline in search results. Aim for 150–160 characters.',
      },
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Social sharing image',
      admin: {
        description:
          'Shown when someone pastes this page into LinkedIn or WhatsApp. Landscape works best (1200 × 630 pixels).',
      },
    },
  ],
}
