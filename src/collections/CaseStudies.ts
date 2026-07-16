import type { CollectionConfig } from 'payload'
import { publishedOrStaff, staffCanWrite } from '../access'
import { slugField } from '../fields/slug'

/**
 * Anonymized case studies (spec §4.1 `caseStudies`), shown on the RFQ thank-you page (§8/§14).
 *
 * ANONYMIZED ONLY. The spec is unambiguous: "Never real client names without explicit new
 * instruction." Hence there is no client-name field at all — the schema itself makes the mistake
 * hard to make, rather than relying on an editor remembering the rule. `anonymizedClient` is
 * described with the spec's own example so the expected shape is obvious in the form.
 */
export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  labels: { singular: 'Case study', plural: 'Case studies' },
  admin: {
    useAsTitle: 'anonymizedClient',
    defaultColumns: ['anonymizedClient', 'sector', 'region', '_status'],
    group: 'Content',
    description: 'Anonymous customer stories. Never name a real client here.',
  },
  versions: { drafts: true },
  access: {
    read: publishedOrStaff,
    create: staffCanWrite,
    update: staffCanWrite,
    delete: staffCanWrite,
  },
  fields: [
    {
      name: 'anonymizedClient',
      type: 'text',
      label: 'How to refer to this client',
      required: true,
      admin: {
        description:
          'Describe them, do not name them — e.g. "A European cycling brand". Real client names must never appear here.',
      },
    },
    slugField('anonymizedClient'),
    {
      type: 'row',
      fields: [
        {
          name: 'sector',
          type: 'text',
          label: 'Sector',
          admin: { description: 'e.g. "Cycling", "Team sports".' },
        },
        {
          name: 'region',
          type: 'text',
          label: 'Region',
          admin: { description: 'e.g. "Europe", "North America".' },
        },
      ],
    },
    { name: 'challenge', type: 'richText', label: 'The challenge' },
    { name: 'solution', type: 'richText', label: 'What we did' },
    { name: 'results', type: 'richText', label: 'The results' },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'Images',
      admin: { description: 'Make sure nothing visible identifies the client — logos, labels, tags.' },
    },
  ],
}
