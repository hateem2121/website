import type { CollectionConfig } from 'payload'
import { publishedOrStaff, staffCanWrite } from '../access'
import { pageBlocks } from '../blocks'
import { seoField } from '../fields/seo'
import { slugField } from '../fields/slug'

/**
 * Block-based marketing pages (spec §4.1 `pages`). Live Preview on.
 *
 * Page copy is drafted and approved page-by-page in Phase 3 (spec §5, workflow B1) — this is the
 * container only.
 */
export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Page', plural: 'Pages' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt', '_status'],
    group: 'Content',
    description: 'The marketing pages, built by stacking blocks.',
    livePreview: {
      url: ({ data }) => {
        const slug = (data?.slug as string) ?? ''
        // The home page lives at / rather than /home.
        return slug === 'home' ? '/' : `/${slug}`
      },
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 812 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  versions: { drafts: true },
  access: {
    read: publishedOrStaff,
    create: staffCanWrite,
    update: staffCanWrite,
    delete: staffCanWrite,
  },
  fields: [
    { name: 'title', type: 'text', label: 'Page title', required: true },
    slugField('title'),
    {
      name: 'layout',
      type: 'blocks',
      label: 'Page content',
      blocks: pageBlocks,
      admin: {
        description: 'Add, reorder and remove blocks to build the page.',
        initCollapsed: true,
      },
    },
    seoField,
  ],
}
