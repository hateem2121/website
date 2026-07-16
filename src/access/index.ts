import type { Access, FieldAccess } from 'payload'

/**
 * Role-based access control (spec §4: "Access control: role-based; buyers can never reach /admin").
 *
 * Two auth-enabled collections exist — `admins` (staff) and `buyers` (portal accounts). Every rule
 * below therefore checks the user's COLLECTION before it checks anything else. Checking only a
 * `role` field would let a buyer with a crafted payload satisfy an admin rule.
 *
 * WHY APPROVAL IS RE-CHECKED ON EVERY REQUEST, not just at login:
 * a `beforeLogin` hook only runs during the login operation. It does not run for requests that
 * arrive with an already-issued session cookie, so a buyer who is approved, logs in, and is then
 * set back to `pending` would keep working until their token expired. Login hooks are a UX
 * courtesy; THESE functions are the security boundary. Enforce status here, always.
 */

type MaybeUser = {
  collection?: string
  role?: string
  status?: string
  _verified?: boolean
  id?: number | string
} | null

const asUser = (user: unknown): MaybeUser => (user ?? null) as MaybeUser

/** Staff of any role. Admin-panel access itself is gated by `config.admin.user = 'admins'`. */
export const isStaff = (user: unknown): boolean => asUser(user)?.collection === 'admins'

/** Staff with the `admin` role — manages buyers, RFQs, and settings (spec §4.1). */
export const isAdminUser = (user: unknown): boolean => {
  const u = asUser(user)
  return u?.collection === 'admins' && u.role === 'admin'
}

/** Staff with the `editor` role — manages content and products only (spec §4.1). */
export const isEditorUser = (user: unknown): boolean => {
  const u = asUser(user)
  return u?.collection === 'admins' && u.role === 'editor'
}

/**
 * A buyer who may see portal content: approved AND email-verified (spec §4.1).
 *
 * `_verified` is checked truthily rather than `!== false` on purpose. Payload's own login guard
 * uses a strict `=== false`, which a row whose `_verified` is NULL slips straight past — and this
 * project applies migrations to D1 as hand-written SQL, where a NULL is easy to leave behind.
 * Requiring a positive true closes that gap here regardless of how the row was created.
 */
export const isApprovedBuyer = (user: unknown): boolean => {
  const u = asUser(user)
  return u?.collection === 'buyers' && u.status === 'approved' && u._verified === true
}

// ---------------------------------------------------------------------------
// Collection-level access functions
// ---------------------------------------------------------------------------

/** Public read — the catalog and marketing content are public by design (spec §0.7). */
export const anyone: Access = () => true

export const adminOnly: Access = ({ req: { user } }) => isAdminUser(user)

export const staffOnly: Access = ({ req: { user } }) => isStaff(user)

/** Staff may write content; admins additionally manage everything else. */
export const staffCanWrite: Access = ({ req: { user } }) => isStaff(user)

/**
 * Public read of published documents only; staff see drafts too.
 *
 * Returns a Where constraint rather than a boolean so unpublished rows are filtered out of list
 * results instead of merely being hidden from a direct fetch.
 */
export const publishedOrStaff: Access = ({ req: { user } }) => {
  if (isStaff(user)) return true
  return { _status: { equals: 'published' } }
}

/** A buyer may read/update only their own record; admins may reach any (spec §10). */
export const ownBuyerRecordOrAdmin: Access = ({ req: { user } }) => {
  if (isAdminUser(user)) return true
  const u = asUser(user)
  if (u?.collection === 'buyers' && u.id != null) return { id: { equals: u.id } }
  return false
}

/**
 * RFQs: staff see everything. An approved buyer sees only RFQs linked to their own account —
 * this powers "My RFQs" (spec §10) and must never widen to another buyer's requests.
 */
export const ownRFQsOrStaff: Access = ({ req: { user } }) => {
  if (isStaff(user)) return true
  const u = asUser(user)
  if (isApprovedBuyer(user) && u?.id != null) return { buyer: { equals: u.id } }
  return false
}

// ---------------------------------------------------------------------------
// Field-level access
// ---------------------------------------------------------------------------

/** Internal ops fields (notes, assignee, outcome) — never exposed outside staff (spec §4.1). */
export const staffOnlyField: FieldAccess = ({ req: { user } }) => isStaff(user)

/** Admin-only fields, e.g. `buyers.notes` (spec §4.1 marks it admin-only). */
export const adminOnlyField: FieldAccess = ({ req: { user } }) => isAdminUser(user)
