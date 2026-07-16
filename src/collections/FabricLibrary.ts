import type { CollectionConfig } from 'payload'
import { anyone, staffCanWrite } from '../access'

/**
 * The data layer powering the RFQ fabric → fibre cascade (spec §4.1, Appendix A).
 *
 * DELIBERATELY UNSEEDED. The fabric and fibre lists must be imported verbatim from RFQ Plan §8,
 * which is register item 1 in the Plan's §16 approval checklist and is still awaiting Hateem's
 * line-by-line review. Seeding drafted content here would quietly turn an unapproved draft into
 * the thing the RFQ form asks buyers to choose from.
 *
 * Shape note: the spec describes this as `category → fabricFamilies[] → allowedFibres[]`. Modelled
 * as one document per fabric family carrying a category relationship, which expresses the same
 * graph while letting the RFQ form fetch a category's families with a single query, and letting an
 * editor edit one family without opening a document containing all of them.
 *
 * Appendix A confirmed additions to carry over at seed time: Team Wear gains neoprene and
 * swim/beach fabrics (Wetsuit Edition); Outer Wear gains leather. Anything that does not map
 * cleanly to one of the five categories is a question for Hateem, never a guess.
 */
export const FabricLibrary: CollectionConfig = {
  slug: 'fabric-library',
  labels: { singular: 'Fabric family', plural: 'Fabric library' },
  defaultSort: 'code',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['code', 'name', 'category'],
    group: 'Catalog',
    description:
      'The fabrics and fibres buyers can pick from in the quote form. Empty until the fabric list is approved.',
  },
  access: {
    // Public read: the guest RFQ form (no account) must be able to build its dropdowns.
    read: anyone,
    create: staffCanWrite,
    update: staffCanWrite,
    delete: staffCanWrite,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'code',
          type: 'text',
          label: 'Code',
          required: true,
          unique: true,
          index: true,
          admin: { description: 'The reference from the RFQ plan, e.g. "TW-1".' },
        },
        {
          name: 'name',
          type: 'text',
          label: 'Fabric family',
          required: true,
          admin: { description: 'e.g. "Neoprene".' },
        },
      ],
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      label: 'Category',
      index: true, // the RFQ cascade filters on this
      admin: {
        position: 'sidebar',
        description: 'Which of the five families this fabric is offered under.',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notes',
      admin: { description: 'Optional guidance shown to the buyer when they pick this fabric.' },
    },
    {
      name: 'allowedFibres',
      type: 'array',
      label: 'Fibres available in this fabric',
      labels: { singular: 'Fibre', plural: 'Fibres' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'fibre', type: 'text', label: 'Fibre', required: true },
            {
              name: 'blendable',
              type: 'checkbox',
              label: 'Can be blended',
              defaultValue: true,
              admin: {
                description: 'Untick if this fibre can only be ordered on its own, never in a mix.',
              },
            },
          ],
        },
        { name: 'notes', type: 'text', label: 'Note (optional)' },
      ],
    },
  ],
}
