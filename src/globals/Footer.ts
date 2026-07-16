import type { GlobalConfig } from 'payload'
import { anyone, staffCanWrite } from '../access'

/**
 * Footer (spec §4.2 `footer`) — CMS-editable column structure.
 *
 * Not seeded: footer links point at the §5 pages and the legal pages, which land in Phases 3 and 7.
 */
export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  admin: {
    group: 'Settings',
    description: 'The link columns at the bottom of every page.',
  },
  access: {
    read: anyone,
    update: staffCanWrite,
  },
  fields: [
    {
      name: 'columns',
      type: 'array',
      label: 'Columns',
      labels: { singular: 'Column', plural: 'Columns' },
      admin: { initCollapsed: true },
      fields: [
        { name: 'heading', type: 'text', label: 'Column heading', required: true },
        {
          name: 'links',
          type: 'array',
          label: 'Links',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'label', type: 'text', label: 'Text', required: true },
                { name: 'href', type: 'text', label: 'Link', required: true },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'legalLine',
      type: 'text',
      label: 'Copyright line',
      admin: { description: 'The small print at the very bottom.' },
    },
  ],
}
