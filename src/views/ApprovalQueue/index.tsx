import React from 'react'
import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import { isAdminUser } from '../../access'
import { getCountry } from '../../data/countries'
import { ApprovalActions } from './ApprovalActions'

/**
 * Buyer Approval Queue (spec §4.1, §10 E2-B) at /admin/approval-queue.
 *
 * THIS VIEW ENFORCES ITS OWN ACCESS. Payload only guarantees that whoever reaches a custom admin
 * view could access the admin panel at all — it does not apply any collection's access rules to a
 * custom view. Without the isAdminUser check below, an `editor` would see every pending buyer's
 * name, company and email. The approve/reject calls are separately re-checked by the REST API, so
 * this check is about not leaking the list itself.
 *
 * Renders inside DefaultTemplate explicitly: a brand-new custom root view is rendered bare by
 * Payload, with no nav or sidebar, unless the template is supplied here.
 */
export const ApprovalQueue: React.FC<AdminViewServerProps> = async ({
  initPageResult,
  params,
  searchParams,
}) => {
  const { req, permissions, visibleEntities, locale } = initPageResult
  const { payload, user, i18n } = req

  const chrome = (children: React.ReactNode) => (
    <DefaultTemplate
      i18n={i18n}
      locale={locale}
      params={params}
      payload={payload}
      permissions={permissions}
      searchParams={searchParams}
      user={user || undefined}
      visibleEntities={visibleEntities}
    >
      <Gutter>{children}</Gutter>
    </DefaultTemplate>
  )

  if (!isAdminUser(user)) {
    return chrome(
      <>
        <h1>Approval queue</h1>
        <p>
          You need an admin account to review buyer signups. Ask Hateem if you think you should have
          access.
        </p>
      </>,
    )
  }

  const pending = await payload.find({
    collection: 'buyers',
    where: { status: { equals: 'pending' } },
    sort: 'createdAt',
    limit: 100,
    depth: 0,
    req,
  })

  return chrome(
    <>
      <h1>Approval queue</h1>
      <p>
        {pending.totalDocs === 0
          ? 'Nothing waiting — every buyer signup has been reviewed.'
          : `${pending.totalDocs} buyer${pending.totalDocs === 1 ? '' : 's'} waiting for review. We promise a decision within 2 business days.`}
      </p>

      {pending.totalDocs > 0 && (
        <table className="table" style={{ width: '100%', marginTop: '1.5rem' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Company</th>
              <th style={{ textAlign: 'left' }}>Person</th>
              <th style={{ textAlign: 'left' }}>Country</th>
              <th style={{ textAlign: 'left' }}>Email verified</th>
              <th style={{ textAlign: 'left' }}>Signed up</th>
              <th style={{ textAlign: 'right' }}>Decision</th>
            </tr>
          </thead>
          <tbody>
            {pending.docs.map((buyer) => (
              <tr key={String(buyer.id)}>
                <td>
                  <a href={`/admin/collections/buyers/${buyer.id}`}>{buyer.company ?? '—'}</a>
                </td>
                <td>{buyer.name ?? '—'}</td>
                <td>{getCountry(buyer.country)?.name ?? buyer.country ?? '—'}</td>
                <td>
                  {buyer._verified ? (
                    'Yes'
                  ) : (
                    <span title="They have not clicked the link in their verification email yet.">
                      Not yet
                    </span>
                  )}
                </td>
                <td>
                  {buyer.createdAt
                    ? new Date(buyer.createdAt).toLocaleDateString('en-GB')
                    : '—'}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <ApprovalActions buyerId={buyer.id} email={buyer.email ?? ''} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>,
  )
}
