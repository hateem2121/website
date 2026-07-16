import type { GlobalConfig } from 'payload'
import { anyone, staffCanWrite } from '../access'

/**
 * Main menu (spec §4.2 `navigation`) — CMS-editable menu structure.
 *
 * Two levels only (item → children). Deeper nesting is not in the spec and each level of recursion
 * costs another database table on D1.
 *
 * Not seeded: the menu depends on the §5 pages, which are built and copy-approved in Phase 3.
 */
export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Main menu',
  admin: {
    group: 'Settings',
    description: 'The links across the top of every page.',
  },
  access: {
    read: anyone,
    update: staffCanWrite,
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: 'Menu items',
      labels: { singular: 'Menu item', plural: 'Menu items' },
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', label: 'Text', required: true },
            {
              name: 'href',
              type: 'text',
              label: 'Link',
              required: true,
              admin: { description: 'A path like /about, or a full https:// address.' },
            },
          ],
        },
        {
          name: 'children',
          type: 'array',
          label: 'Dropdown items (optional)',
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
  ],
}
