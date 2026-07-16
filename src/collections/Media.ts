import type { CollectionConfig } from 'payload'
import { anyone, staffCanWrite } from '../access'

/**
 * Public media (spec §4.1) — stored in the `run-assets` R2 bucket via the storage adapter.
 *
 * Alt text is required, for SEO and because a screen reader has nothing else to announce.
 *
 * No image resizing here: `sharp` does not run on Cloudflare Workers (spec §2), so `crop` and
 * `focalPoint` stay off and sized variants come from the Phase 4 asset pipeline instead.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Image or file', plural: 'Media' },
  admin: {
    group: 'Content',
    description: 'Images used across the public site. Anything uploaded here is publicly readable.',
  },
  access: {
    read: anyone,
    create: staffCanWrite,
    update: staffCanWrite,
    delete: staffCanWrite,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Describe this image',
      required: true,
      admin: {
        description:
          'One plain sentence describing what is in the image — read aloud to blind visitors and used by Google. Example: "Cyclist in a custom RUN team jersey".',
      },
    },
  ],
  upload: {
    // These are not supported on Workers yet due to lack of sharp
    crop: false,
    focalPoint: false,
  },
}
