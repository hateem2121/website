import type { CollectionConfig } from 'payload'
import { adminOnly, anyone, staffCanWrite } from '../access'
import { seoField } from '../fields/seo'
import { slugField } from '../fields/slug'

/**
 * The five authoritative categories (spec §4.1, §21.6).
 *
 * These are the exclusive site-wide taxonomy — nav, catalog, RFQ dropdown, and reporting all read
 * from here. Seeded and order-locked; the spec is explicit that no additional top-level categories
 * may be invented.
 *
 * Create and delete are therefore restricted to admins (an editor cannot reshape the taxonomy),
 * and `order` is read-only so the locked sequence cannot be nudged by accident. See BUILD_LOG for
 * the open question on whether to hard-lock create/delete entirely.
 */
export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Category', plural: 'Categories' },
  defaultSort: 'order',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['order', 'name', 'slug'],
    group: 'Catalog',
    description:
      'The five product families the whole site is organised around. These are fixed — please do not add new ones.',
  },
  access: {
    read: anyone,
    create: adminOnly,
    delete: adminOnly,
    update: staffCanWrite,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Category name',
      required: true,
    },
    slugField('name'),
    {
      name: 'order',
      type: 'number',
      label: 'Position',
      required: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'The locked running order used across the site. Set at build time.',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Header image',
      admin: { description: 'The wide image at the top of this category’s page.' },
    },
    {
      name: 'intro',
      type: 'richText',
      label: 'Introduction',
      admin: {
        description:
          'A short introduction shown under the header. Left blank until the Phase 3 copy review.',
      },
    },
    seoField,
  ],
}
