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
  /**
   * The database table stays `users` while the collection is `admins`.
   *
   * This is deliberate and load-bearing. The spec renames the template's Users collection to
   * `admins`, but a real admin account already exists in the production `users` table. Changing
   * the table name would mean renaming `users`, `users_sessions`, five indexes, and the `users_id`
   * foreign-key columns inside payload_locked_documents_rels and payload_preferences_rels — on a
   * live database, to gain nothing a user can see. Payload cannot detect a rename (it diffs
   * snapshots), so its generated migration would drop and recreate, destroying the account.
   *
   * Keeping dbName pins the physical table, so the rename is purely a CMS-level concept and the
   * existing row is never touched. Do not remove this without a migration that renames all of the
   * above together.
   */
  dbName: 'users',
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
