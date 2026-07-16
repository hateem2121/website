import type { CollectionConfig } from 'payload'
import { publishedOrStaff, staffCanWrite } from '../access'
import { seoField } from '../fields/seo'
import { slugField } from '../fields/slug'
import { ADULT_SIZE_OPTIONS, ONE_SIZE_OPTION, YOUTH_SIZE_OPTIONS } from '../data/catalog-options'

/**
 * Catalog articles (spec §4.1 `products`). Public, Live Preview on, growing from under 20.
 *
 * `status (draft/published)` is implemented with Payload's built-in drafts rather than a hand-rolled
 * select: it gives the editor real Save-draft / Publish buttons, keeps unpublished rows out of
 * public queries via the `publishedOrStaff` rule, and is what Live Preview reads from.
 *
 * Everything in Specs is optional per article — this is a made-to-order manufacturer, not a
 * fixed-inventory shop (spec §0.6, §4.1).
 */
export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Product', plural: 'Products' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'updatedAt', '_status'],
    group: 'Catalog',
    description: 'The articles shown in the catalog, each with its 3D viewer and colourways.',
    livePreview: {
      url: ({ data }) => `/products/${data?.slug ?? ''}`,
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 812 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  versions: {
    drafts: true,
  },
  access: {
    read: publishedOrStaff,
    create: staffCanWrite,
    update: staffCanWrite,
    delete: staffCanWrite,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Product name',
      required: true,
    },
    slugField('title'),
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      label: 'Category',
      admin: {
        position: 'sidebar',
        description: 'Which of the five product families this belongs to.',
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      label: 'Short description',
      admin: { description: 'One or two sentences, used on catalog cards and in search results.' },
    },
    {
      name: 'longDescription',
      type: 'richText',
      label: 'Full description',
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Specs',
          description: 'All optional — fill in what you know. Everything here is made to order.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'fabricComposition',
                  type: 'text',
                  label: 'Fabric composition',
                  admin: { description: 'e.g. "88% recycled polyester, 12% elastane".' },
                },
                {
                  name: 'gsm',
                  type: 'number',
                  label: 'GSM (fabric weight)',
                  admin: { description: 'Grams per square metre. Leave blank if it varies.' },
                },
              ],
            },
            {
              name: 'availableSizes',
              type: 'select',
              hasMany: true,
              label: 'Available sizes',
              // PROVISIONAL values — RFQ Plan §16 register item 2, awaiting Hateem's approval.
              options: [...ADULT_SIZE_OPTIONS, ...YOUTH_SIZE_OPTIONS, ONE_SIZE_OPTION],
            },
            {
              name: 'keyFeatures',
              type: 'array',
              label: 'Key features',
              labels: { singular: 'Feature', plural: 'Features' },
              fields: [{ name: 'feature', type: 'text', required: true }],
            },
            {
              name: 'certificationsNote',
              type: 'textarea',
              label: 'Certifications note',
              admin: {
                description:
                  'Ecosystem framing is required: certifications sit with Durus Industries and our certified suppliers — never say "RUN is certified".',
              },
            },
          ],
        },
        {
          label: 'Colourways',
          fields: [
            {
              name: 'colorways',
              type: 'array',
              label: 'Colourways',
              minRows: 1, // spec §4.1: at least one
              labels: { singular: 'Colourway', plural: 'Colourways' },
              admin: {
                description: 'Each colourway a buyer can switch to in the 3D viewer.',
                initCollapsed: true,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'name', type: 'text', label: 'Colourway name', required: true },
                    {
                      name: 'swatchHex',
                      type: 'text',
                      label: 'Swatch colour',
                      required: true,
                      admin: { description: 'Hex code, e.g. #CDF345.' },
                      validate: (value: unknown) =>
                        typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value)
                          ? true
                          : 'Enter a 6-digit hex colour, like #CDF345.',
                    },
                  ],
                },
                {
                  name: 'textureSetKey',
                  type: 'text',
                  label: 'Texture set key',
                  admin: {
                    description:
                      'Set by the 3D pipeline — the folder prefix in storage holding this colourway’s textures. Leave alone unless asked.',
                  },
                },
                {
                  name: 'posterImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Poster image',
                  admin: {
                    description: 'The still image shown before the 3D viewer finishes loading.',
                  },
                },
                {
                  name: 'gallery',
                  type: 'upload',
                  relationTo: 'media',
                  hasMany: true,
                  label: 'Extra photos (optional)',
                },
              ],
            },
          ],
        },
        {
          label: '3D model',
          fields: [
            {
              name: 'model3d',
              type: 'group',
              label: '3D model',
              admin: {
                description: 'Managed by the 3D pipeline. A product without a model still publishes.',
              },
              fields: [
                {
                  name: 'glbFile',
                  type: 'text',
                  label: 'Model file key',
                  admin: {
                    description:
                      'The compressed model’s location in storage, set by the pipeline in Phase 4.',
                  },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'fileSizeKB',
                      type: 'number',
                      label: 'File size (KB)',
                      admin: { readOnly: true, description: 'Filled in automatically.' },
                    },
                    {
                      name: 'pipelineVersion',
                      type: 'text',
                      label: 'Pipeline version',
                      admin: { readOnly: true },
                    },
                  ],
                },
                {
                  name: 'fallbackMode',
                  type: 'select',
                  label: 'When there is no model yet',
                  required: true,
                  defaultValue: 'coming-soon',
                  options: [
                    { label: 'Show the 3D viewer', value: 'viewer' },
                    { label: 'Show a "3D coming soon" placeholder', value: 'coming-soon' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Commercial',
          description:
            'Nothing on this tab appears publicly until the "Show these publicly" switch is on.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'moqStartingAt',
                  type: 'number',
                  label: 'Minimum order from (pieces)',
                  min: 0,
                },
                {
                  name: 'priceStartingAtUSD',
                  type: 'number',
                  label: 'Price from (USD)',
                  min: 0,
                },
              ],
            },
            {
              name: 'showTeasers',
              type: 'checkbox',
              label: 'Show these publicly',
              // Spec §8.3: OFF until Hateem confirms real numbers (open item RQ4/RQ5).
              defaultValue: false,
              admin: {
                description:
                  'Off by default. When on, the product page shows "MOQ from X pcs · from $Y" — only if both numbers above are filled in.',
              },
            },
            {
              name: 'moqWarningOverride',
              type: 'number',
              label: 'Quote-form warning threshold for this product',
              min: 0,
              admin: {
                description:
                  'Optional. Overrides the site-wide default when warning a buyer that their quantity may be too low. Never shown publicly.',
              },
            },
          ],
        },
        {
          label: 'SEO',
          fields: [seoField],
        },
      ],
    },
  ],
}
