import React from 'react'
import type { ServerProps } from 'payload'
import { isAdminUser } from '../access'

/**
 * Nav link to the Approval Queue.
 *
 * Payload builds the admin sidebar from collections and globals only, so a custom view gets no
 * link automatically — it has to be added here.
 *
 * Hidden from editors, matching the view's own access check. This is cosmetic: the view enforces
 * access itself. Hiding a link is never a security control.
 */
export const ApprovalQueueNavLink: React.FC<ServerProps> = ({ user }) => {
  if (!isAdminUser(user)) return null

  return (
    <a className="nav__link" href="/admin/approval-queue">
      <span className="nav__link-label">Approval queue</span>
    </a>
  )
}
