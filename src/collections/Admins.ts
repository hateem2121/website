import type { CollectionConfig } from 'payload'
import { adminOnly, isAdminUser, staffOnly } from '../access'

const isProduction = process.env.NODE_ENV === 'production'

/**
 * Staff accounts (spec §4.1 `admins`) — the template's `Users` collection, renamed and scoped.
 *
 * This is the collection named by `config.admin.user`, which is what actually keeps buyers out of
 * /admin: Payload compares the logged-in user's collection against that setting and refuses admin
 * access on a mismatch, before any role check runs.
 *
 * 2–4 people. `admin` manages buyers/RFQs/settings; `editor` manages content/products.
 */
export const Admins: CollectionConfig = {
  slug: 'admins',
  labels: { singular: 'Staff account', plural: 'Staff accounts' },
  auth: {
    // Payload ships `secure: false`, which would send the login cookie over plain HTTP.
    // Production is HTTPS-only; local dev is http://localhost, where Secure cookies are dropped.
    cookies: {
      secure: isProduction,
      sameSite: 'Lax',
    },
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000, // 10 minutes, in MILLISECONDS
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Settings',
    description: 'The people who can sign in to this admin panel.',
  },
  access: {
    // Only an admin manages staff accounts; an editor must not be able to promote themselves.
    create: adminOnly,
    delete: adminOnly,
    update: ({ req: { user }, id }) => {
      if (isAdminUser(user)) return true
      // An editor may edit their own profile (name/password) but nobody else's.
      const uid = (user as { id?: number | string } | null)?.id
      return uid != null && String(uid) === String(id)
    },
    read: staffOnly,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Full name',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      label: 'Role',
      required: true,
      // Least privilege by default: a new account can touch content, nothing else.
      defaultValue: 'editor',
      options: [
        { label: 'Admin — everything, including buyers, quote requests and settings', value: 'admin' },
        { label: 'Editor — content and products only', value: 'editor' },
      ],
      access: {
        // Only an admin may set or change a role — otherwise an editor could promote themselves
        // by editing their own profile through the update rule above.
        create: ({ req: { user } }) => isAdminUser(user),
        update: ({ req: { user } }) => isAdminUser(user),
      },
      admin: {
        description: 'Admins can do everything. Editors can only manage pages, products and posts.',
      },
    },
  ],
  versions: false,
}
