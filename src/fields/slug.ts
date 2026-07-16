import type { Field } from 'payload'

/** Lowercase, strip accents, collapse anything non-alphanumeric to single hyphens. */
export const slugify = (input: string): string =>
  input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/**
 * URL slug, auto-filled from another field but editable.
 *
 * Indexed + unique because slugs are the public URL key and are looked up on every page render.
 * Once a document is live its slug is a published URL — changing it breaks inbound links, hence
 * the warning in the description rather than silent regeneration on every title edit.
 */
export const slugField = (sourceField = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  label: 'URL slug',
  index: true,
  unique: true,
  admin: {
    position: 'sidebar',
    description:
      'The address bar version of the name (e.g. "team-wear"). Filled in for you. Changing it after this page is live will break any existing links to it.',
  },
  hooks: {
    beforeValidate: [
      ({ value, data, originalDoc }) => {
        if (typeof value === 'string' && value.trim()) return slugify(value)
        const source = (data?.[sourceField] ?? originalDoc?.[sourceField]) as string | undefined
        return source ? slugify(source) : value
      },
    ],
  },
})
