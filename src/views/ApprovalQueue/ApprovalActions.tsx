'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Approve / reject buttons for one buyer (spec §10, E2-B).
 *
 * Goes through Payload's REST API rather than writing to the database directly, on purpose: the
 * `status` field is admin-only at the field level, so the API re-checks permission on every call.
 * The button is a convenience; the API is the thing enforcing the rule. A crafted request from a
 * non-admin gets rejected exactly the same way.
 */
export const ApprovalActions: React.FC<{ buyerId: number | string; email: string }> = ({
  buyerId,
  email,
}) => {
  const router = useRouter()
  const [busy, setBusy] = useState<null | 'approved' | 'rejected'>(null)
  const [showReason, setShowReason] = useState(false)
  const [reason, setReason] = useState('')
  const [error, setError] = useState<string | null>(null)

  const setStatus = async (status: 'approved' | 'rejected') => {
    setBusy(status)
    setError(null)
    try {
      const res = await fetch(`/api/buyers/${buyerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(
          status === 'rejected' && reason.trim()
            ? { status, rejectionReason: reason.trim() }
            : { status },
        ),
      })
      if (!res.ok) {
        const body = (await res.json().catch((): null => null)) as {
          errors?: { message: string }[]
        } | null
        throw new Error(body?.errors?.[0]?.message ?? `Could not update ${email}.`)
      }
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setBusy(null)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', alignItems: 'flex-end' }}>
      <div style={{ display: 'flex', gap: '.5rem' }}>
        <button
          type="button"
          className="btn btn--style-primary btn--size-small"
          disabled={busy !== null}
          onClick={() => setStatus('approved')}
        >
          {busy === 'approved' ? 'Approving…' : 'Approve'}
        </button>
        <button
          type="button"
          className="btn btn--style-secondary btn--size-small"
          disabled={busy !== null}
          onClick={() => (showReason ? setStatus('rejected') : setShowReason(true))}
        >
          {busy === 'rejected' ? 'Rejecting…' : showReason ? 'Confirm reject' : 'Reject'}
        </button>
      </div>

      {showReason && (
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason (optional)"
          aria-label={`Reason for rejecting ${email}`}
          style={{ width: '16rem', padding: '.35rem .5rem' }}
        />
      )}

      {error && (
        <p role="alert" style={{ color: 'var(--theme-error-500)', margin: 0, fontSize: '.8rem' }}>
          {error}
        </p>
      )}
    </div>
  )
}
