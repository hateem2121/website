import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'
import { adminOnly, adminOnlyField, isAdminUser, ownBuyerRecordOrAdmin, staffOnly } from '../access'
import { COUNTRY_OPTIONS } from '../data/countries'
import { assertCountryAllowed } from '../hooks/enforceExclusionList'

const isProduction = process.env.NODE_ENV === 'production'

/**
 * Buyer portal accounts (spec §4.1, §10) — a SEPARATE auth collection from `admins`.
 *
 * Because `config.admin.user` names `admins`, a buyer can never reach /admin: Payload refuses
 * admin access whenever the logged-in user's collection differs from that setting.
 *
 * Flow (spec §4.1): public self-signup → email verification → status `pending` → an admin
 * approves or rejects in the Approval Queue → approval/rejection email (Resend, Phase 5).
 *
 * Note on `verifiedEmail`: the spec lists it as a field, and Payload's built-in verify flow
 * already maintains exactly that boolean as `_verified`. Adding a second field would give us two
 * sources of truth for one fact, so we use the built-in and do not duplicate it.
 */
export const Buyers: CollectionConfig = {
  slug: 'buyers',
  labels: { singular: 'Buyer', plural: 'Buyers' },
  auth: {
    // Payload's built-in email verification (spec §4.1). The default verification email links into
    // /admin, which is wrong for buyers — Phase 5 overrides generateEmailHTML to a portal route
    // when Resend is wired up.
    verify: true,
    cookies: {
      // Ships as `false` by default, which would send the session cookie over plain HTTP.
      secure: isProduction,
      sameSite: 'Lax',
    },
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000, // milliseconds
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'company', 'country', 'status', 'createdAt'],
    group: 'Buyers',
    description: 'People who signed up for the buyer portal. New signups need approving.',
  },
  access: {
    // Public self-signup (spec §10). Safe only because `status` and `role`-like fields below are
    // not writable by the person signing up — see the field-level access on `status`.
    create: () => true,
    read: ownBuyerRecordOrAdmin,
    update: ownBuyerRecordOrAdmin,
    delete: adminOnly,
    // Belt and braces alongside config.admin.user: never show this collection to a non-staff user.
    admin: ({ req: { user } }) => staffOnly({ req: { user } } as never) as boolean,
  },
  hooks: {
    beforeValidate: [
      async ({ data, req, operation }) => {
        // Appendix B: the exclusion check is enforced identically at signup, RFQ and contact form.
        if (operation === 'create' && data?.country) {
          await assertCountryAllowed(req, data.country as string)
        }
        return data
      },
    ],
    beforeLogin: [
      ({ req, user }) => {
        // A courtesy message only — NOT the security boundary. Access functions re-check status on
        // every request; this hook never runs for a request bearing an existing session cookie.
        const status = (user as { status?: string } | null)?.status
        if (status === 'pending') {
          throw new APIError(
            'Your account is still under review — we respond within 2 business days.',
            403,
            undefined,
            true,
          )
        }
        if (status === 'rejected') {
          throw new APIError(
            'This account is not approved for the buyer portal. Please contact partner@wear-run.help.',
            403,
            undefined,
            true,
          )
        }
        // Return nothing: Payload replaces `user` with whatever this hook returns.
        return undefined
      },
    ],
  },
  fields: [
    // email + password come from `auth: true`.
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', label: 'Full name', required: true },
        { name: 'company', type: 'text', label: 'Company', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'country',
          type: 'select',
          label: 'Country',
          required: true,
          options: COUNTRY_OPTIONS,
        },
        { name: 'phone', type: 'text', label: 'Phone (optional)' },
      ],
    },
    {
      name: 'website',
      type: 'text',
      label: 'Company website (optional)',
    },
    {
      name: 'status',
      type: 'select',
      label: 'Approval status',
      required: true,
      defaultValue: 'pending',
      index: true, // the Approval Queue filters on this
      options: [
        { label: 'Pending — waiting for review', value: 'pending' },
        { label: 'Approved — can use the portal', value: 'approved' },
        { label: 'Rejected — cannot use the portal', value: 'rejected' },
      ],
      access: {
        // THE load-bearing rule on this collection. `create` is public, so without this a signup
        // could POST `status: "approved"` and approve itself. Only staff may set or change it.
        create: ({ req: { user } }) => isAdminUser(user),
        update: ({ req: { user } }) => isAdminUser(user),
      },
      admin: {
        position: 'sidebar',
        description: 'Only approved buyers with a verified email address can sign in to the portal.',
      },
    },
    {
      name: 'rejectionReason',
      type: 'textarea',
      label: 'Reason (optional)',
      access: {
        create: ({ req: { user } }) => isAdminUser(user),
        update: ({ req: { user } }) => isAdminUser(user),
      },
      admin: {
        position: 'sidebar',
        condition: (data) => data?.status === 'rejected',
        description: 'Included in the rejection email if you fill it in.',
      },
    },
    {
      name: 'savedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      label: 'Saved products',
      admin: {
        description: 'Their "Add to list" selections, which they can turn into a quote request.',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Internal notes',
      access: {
        // Spec §4.1 marks notes admin-only — the buyer must never read these about themselves.
        read: adminOnlyField,
        create: adminOnlyField,
        update: adminOnlyField,
      },
      admin: { description: 'Private. Never shown to the buyer.' },
    },
  ],
  timestamps: true, // provides createdAt (spec §4.1)
}
