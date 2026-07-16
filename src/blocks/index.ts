import type { Block } from 'payload'

/**
 * Content blocks for `pages` (spec §4.1: hero, rich text, media, stats, timeline, logo-marquee,
 * CTA-by-persona, FAQ).
 *
 * Each block becomes its own database table, so the set is kept to the ones the spec names rather
 * than speculative extras.
 *
 * Deliberately structure-only, no copy: spec §5's copy workflow (B1) is that Claude drafts every
 * page from the Company Master Prompt and Hateem approves it page by page, in Phase 3. Likewise
 * the CTA block takes persona labels as free text — inventing a fixed persona list would be a
 * visitor-facing decision that is Hateem's to make, not a schema detail.
 */

const linkFields: Block['fields'] = [
  {
    type: 'row',
    fields: [
      { name: 'buttonLabel', type: 'text', label: 'Button text' },
      {
        name: 'buttonHref',
        type: 'text',
        label: 'Button link',
        admin: { description: 'A path like /contact, or a full https:// address.' },
      },
    ],
  },
]

export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Hero banner', plural: 'Hero banners' },
  fields: [
    { name: 'heading', type: 'text', label: 'Headline', required: true },
    { name: 'subheading', type: 'textarea', label: 'Supporting line' },
    { name: 'backgroundImage', type: 'upload', relationTo: 'media', label: 'Background image' },
    ...linkFields,
  ],
}

export const RichTextBlock: Block = {
  slug: 'richText',
  labels: { singular: 'Text', plural: 'Text blocks' },
  fields: [{ name: 'content', type: 'richText', label: 'Text' }],
}

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  labels: { singular: 'Image', plural: 'Images' },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Image', required: true },
    { name: 'caption', type: 'text', label: 'Caption (optional)' },
    {
      name: 'width',
      type: 'select',
      label: 'Width',
      defaultValue: 'normal',
      options: [
        { label: 'Normal', value: 'normal' },
        { label: 'Wide', value: 'wide' },
        { label: 'Full bleed', value: 'full' },
      ],
    },
  ],
}

export const StatsBlock: Block = {
  slug: 'stats',
  labels: { singular: 'Statistics row', plural: 'Statistics rows' },
  fields: [
    { name: 'heading', type: 'text', label: 'Heading (optional)' },
    {
      name: 'stats',
      type: 'array',
      label: 'Numbers',
      minRows: 1,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'value',
              type: 'text',
              label: 'Number',
              required: true,
              admin: { description: 'e.g. "40%" or "1889".' },
            },
            { name: 'label', type: 'text', label: 'What it means', required: true },
          ],
        },
      ],
    },
  ],
}

export const TimelineBlock: Block = {
  slug: 'timeline',
  labels: { singular: 'Timeline', plural: 'Timelines' },
  fields: [
    { name: 'heading', type: 'text', label: 'Heading (optional)' },
    {
      name: 'entries',
      type: 'array',
      label: 'Moments',
      minRows: 1,
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'year', type: 'text', label: 'Year', required: true },
            { name: 'title', type: 'text', label: 'Title', required: true },
          ],
        },
        { name: 'description', type: 'textarea', label: 'Description' },
        { name: 'image', type: 'upload', relationTo: 'media', label: 'Image (optional)' },
      ],
    },
  ],
}

export const LogoMarqueeBlock: Block = {
  slug: 'logoMarquee',
  labels: { singular: 'Logo strip', plural: 'Logo strips' },
  fields: [
    { name: 'heading', type: 'text', label: 'Heading (optional)' },
    {
      name: 'logos',
      type: 'array',
      label: 'Logos',
      minRows: 1,
      admin: {
        description:
          'Certification logos may only be used once permission is confirmed, and each needs its caption.',
      },
      fields: [
        { name: 'logo', type: 'upload', relationTo: 'media', label: 'Logo', required: true },
        {
          name: 'caption',
          type: 'text',
          label: 'Caption',
          required: true,
          admin: {
            description:
              'Required. Say who holds the certification — never imply RUN itself is certified.',
          },
        },
      ],
    },
  ],
}

export const CTAByPersonaBlock: Block = {
  slug: 'ctaByPersona',
  labels: { singular: 'Call to action', plural: 'Calls to action' },
  fields: [
    { name: 'heading', type: 'text', label: 'Heading (optional)' },
    {
      name: 'variants',
      type: 'array',
      label: 'One card per audience',
      minRows: 1,
      fields: [
        {
          name: 'persona',
          type: 'text',
          label: 'Audience',
          required: true,
          admin: { description: 'Who this card speaks to, e.g. "Sports clubs" or "Retail brands".' },
        },
        { name: 'body', type: 'textarea', label: 'Message' },
        ...linkFields,
      ],
    },
  ],
}

export const FAQBlock: Block = {
  slug: 'faq',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  fields: [
    { name: 'heading', type: 'text', label: 'Heading (optional)' },
    {
      name: 'items',
      type: 'array',
      label: 'Questions',
      minRows: 1,
      fields: [
        { name: 'question', type: 'text', label: 'Question', required: true },
        { name: 'answer', type: 'richText', label: 'Answer' },
      ],
    },
  ],
}

export const pageBlocks: Block[] = [
  HeroBlock,
  RichTextBlock,
  MediaBlock,
  StatsBlock,
  TimelineBlock,
  LogoMarqueeBlock,
  CTAByPersonaBlock,
  FAQBlock,
]
