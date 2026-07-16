import type { Field } from 'payload'
import { staffOnlyField } from '../access'

/**
 * References to files in the PRIVATE `run-private` bucket (spec §4.1, §8.7, Appendix C).
 *
 * These are references, not Payload uploads, and that is deliberate: spec §8.7 requires files to
 * go direct-to-R2 via a presigned URL so they never stream through the Worker. Payload's upload
 * field would do the opposite. The Worker only ever stores the key.
 *
 * Quarantine model (spec §8.7): files are never executed or rendered inline, and are downloaded by
 * staff only via short-lived signed URLs with `Content-Disposition: attachment`. The `unscanned`
 * label is the honest signal that no AV scanning happened — staff SOP is to scan on download.
 *
 * Fields only. The presigned-upload route, MIME sniffing, and the size/count limits in Appendix C
 * are built in Phase 5, where Hateem approves those limits at the gate.
 */
export const privateFileFields = (label = 'Attached files'): Field => ({
  name: 'files',
  type: 'array',
  label,
  access: {
    // Never readable by anyone outside staff — these are buyers' confidential tech packs.
    read: staffOnlyField,
    create: staffOnlyField,
    update: staffOnlyField,
  },
  admin: {
    description: 'Uploaded by the sender. Download to your machine and virus-scan before opening.',
    readOnly: true,
  },
  fields: [
    { name: 'key', type: 'text', label: 'Storage key', required: true },
    { name: 'filename', type: 'text', label: 'Original filename' },
    { name: 'sizeBytes', type: 'number', label: 'Size (bytes)' },
    { name: 'mimeType', type: 'text', label: 'Detected type' },
    {
      name: 'scanStatus',
      type: 'select',
      label: 'Scan status',
      defaultValue: 'unscanned',
      options: [
        { label: 'Unscanned — scan before opening', value: 'unscanned' },
        { label: 'Scanned clean (by staff)', value: 'scanned-clean' },
        { label: 'Quarantined', value: 'quarantined' },
      ],
    },
  ],
})
