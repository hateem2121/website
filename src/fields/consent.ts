import type { Field } from 'payload'
import { isEUCountry } from '../data/countries'
import { staffOnlyField } from '../access'

/**
 * Consent block shared by `rfqs` (spec §4.1, §8.6) and `inquiries` (spec §9).
 *
 * These fields are a legal record, not a form control. They are read-only in the admin panel: an
 * editor must never be able to retroactively tick a consent a buyer did not give. Values are
 * written server-side at submit time in Phase 5.
 *
 * Consent copy (C5/C6) is RFQ Plan §16 register item 4 — provisional pending Hateem's approval.
 * `consentPolicyVersion` exists so a copy change does not silently rewrite the meaning of consents
 * already collected: spec §8.6 requires versioned consent copy.
 */
export const consentFields: Field = {
  name: 'consents',
  type: 'group',
  label: 'Consents (legal record)',
  admin: {
    description:
      'Captured automatically when the form was submitted. Read-only on purpose — this is the record of what the sender actually agreed to.',
  },
  fields: [
    {
      name: 'processingConsent',
      type: 'checkbox',
      label: 'Agreed to data processing',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'processingConsentAt',
      type: 'date',
      label: 'Agreed at',
      admin: { readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'consentPolicyVersion',
      type: 'text',
      label: 'Privacy policy version agreed to',
      admin: {
        readOnly: true,
        description: 'Which version of the policy text was on screen at the time.',
      },
    },
    {
      name: 'marketingOptIn',
      type: 'checkbox',
      label: 'Opted in to marketing',
      // Unticked by default is a legal requirement, not a preference (spec §4.1, §8.6).
      defaultValue: false,
      admin: { readOnly: true },
    },
    {
      name: 'marketingDoubleOptInRequired',
      type: 'checkbox',
      label: 'EU double opt-in required',
      defaultValue: false,
      admin: {
        readOnly: true,
        description:
          'Set automatically for EU senders. Marketing mail must not go out until they confirm a second time.',
      },
    },
    {
      name: 'marketingDoubleOptInConfirmedAt',
      type: 'date',
      label: 'Double opt-in confirmed at',
      admin: { readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'consentSource',
      type: 'text',
      label: 'Collected from',
      admin: {
        readOnly: true,
        description: 'Which form and page the consent was given on.',
      },
    },
  ],
}

/**
 * Derives the EU double-opt-in flag from the record's country (spec §8.6).
 *
 * Attach as a collection `beforeChange` hook. Kept beside the field definition so the flag and the
 * country list cannot drift apart.
 */
export const setEUDoubleOptIn = <T extends { country?: string | null; consents?: Record<string, unknown> }>(
  data: T,
): T => {
  if (!data?.consents) return data
  return {
    ...data,
    consents: {
      ...data.consents,
      marketingDoubleOptInRequired: Boolean(data.consents.marketingOptIn) && isEUCountry(data.country),
    },
  }
}

/**
 * UTM / referrer capture (spec §4.1 "Attribution", §8.9).
 *
 * Consent-aware: the RFQ submit handler only populates these when analytics consent was given
 * (spec §13). Staff-only — attribution is internal ops data, never shown to the sender.
 */
export const attributionFields: Field = {
  name: 'attribution',
  type: 'group',
  label: 'Where this lead came from',
  access: {
    read: staffOnlyField,
    update: staffOnlyField,
  },
  admin: {
    description: 'Captured only when the visitor accepted analytics cookies.',
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'utmSource', type: 'text', label: 'utm_source', admin: { readOnly: true } },
        { name: 'utmMedium', type: 'text', label: 'utm_medium', admin: { readOnly: true } },
        { name: 'utmCampaign', type: 'text', label: 'utm_campaign', admin: { readOnly: true } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'utmTerm', type: 'text', label: 'utm_term', admin: { readOnly: true } },
        { name: 'utmContent', type: 'text', label: 'utm_content', admin: { readOnly: true } },
      ],
    },
    {
      name: 'landingPage',
      type: 'text',
      label: 'First page they landed on',
      admin: { readOnly: true },
    },
    { name: 'referrer', type: 'text', label: 'Referring site', admin: { readOnly: true } },
  ],
}
