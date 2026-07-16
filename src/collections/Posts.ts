import type { CollectionConfig } from 'payload'
import { publishedOrStaff, staffCanWrite } from '../access'
import { seoField } from '../fields/seo'
import { slugField } from '../fields/slug'

/**
 * Blog / insights articles (spec §4.1 `posts`). 3–5 seed articles are drafted in Phase 3, where
 * Hateem approves copy page by page — nothing is seeded here.
 *
 * `authorLabel` is free text rather than a relationship to `admins`: the spec asks for an author
 * label, and tying bylines to staff logins would leak internal account names onto the public site.
 */
export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Post', plural: 'Posts' },
  defaultSort: '-publishedDate',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'authorLabel', 'publishedDate', '_status'],
    group: 'Content',
    description: 'Blog and insight articles.',
    livePreview: {
      url: ({ data }) => `/insights/${data?.slug ?? ''}`,
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 812 },
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
    { name: 'title', type: 'text', label: 'Title', required: true },
    slugField('title'),
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Summary',
      admin: { description: 'One or two sentences, shown on the blog index and in search results.' },
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      label: 'Cover image',
    },
    { name: 'body', type: 'richText', label: 'Article' },
    {
      type: 'row',
      fields: [
        {
          name: 'authorLabel',
          type: 'text',
          label: 'Author byline',
          admin: { description: 'Shown publicly, e.g. "RUN APPAREL" or a person’s name.' },
        },
        {
          name: 'publishedDate',
          type: 'date',
          label: 'Publish date',
          admin: { date: { pickerAppearance: 'dayOnly' } },
        },
      ],
    },
    seoField,
  ],
}
