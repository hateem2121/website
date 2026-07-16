import type { GlobalConfig } from 'payload'
import { adminOnly, anyone } from '../access'

/**
 * Site-wide settings (spec §4.2 `siteSettings`).
 *
 * Seeded via `defaultValue`, which Payload returns for a global that has never been saved — so the
 * values below are live from first boot without a data-writing seed step.
 *
 * Two seeded values are deliberately fake or hidden and MUST NOT be "fixed" without Hateem:
 *   · whatsappNumber is an obviously-dummy placeholder (spec §21.2, open item X3). The real number
 *     +92-336-1777313 from the Company Master Prompt is explicitly NOT used at launch.
 *   · moqWarningDefault is seeded at 250 but `showMoqPublicly` stays OFF (spec §8.3, RQ4) — no MOQ
 *     or price figure appears publicly until Hateem confirms real numbers.
 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: {
    group: 'Settings',
    description: 'Contact details, the WhatsApp button, and site-wide defaults.',
  },
  access: {
    // Public read: the footer, WhatsApp button and response promise render on public pages.
    read: anyone,
    update: adminOnly,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contact',
          fields: [
            {
              name: 'whatsappNumber',
              type: 'text',
              label: 'WhatsApp number',
              defaultValue: '+00-000-0000000',
              admin: {
                description:
                  'PLACEHOLDER — this is deliberately fake so nobody can call it by accident. Replace it with the real number when you are ready for the floating WhatsApp button to work.',
              },
            },
            {
              name: 'whatsappEnabled',
              type: 'checkbox',
              label: 'Show the floating WhatsApp button',
              defaultValue: false,
              admin: {
                description: 'Leave off until the number above is real.',
              },
            },
            {
              name: 'emails',
              type: 'group',
              label: 'Public email addresses',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'partner',
                      type: 'email',
                      label: 'Partnerships',
                      defaultValue: 'partner@wear-run.help',
                    },
                    {
                      name: 'info',
                      type: 'email',
                      label: 'General',
                      defaultValue: 'info@wear-run.help',
                    },
                    {
                      name: 'privacy',
                      type: 'email',
                      label: 'Privacy',
                      defaultValue: 'privacy@wear-run.help',
                    },
                  ],
                },
              ],
            },
            {
              name: 'address',
              type: 'textarea',
              label: 'Postal address',
            },
            {
              name: 'socialLinks',
              type: 'array',
              label: 'Social links',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'platform', type: 'text', label: 'Platform', required: true },
                    { name: 'url', type: 'text', label: 'Link', required: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Defaults',
          fields: [
            {
              name: 'responsePromise',
              type: 'text',
              label: 'Response promise',
              // Spec §21.5: this wording supersedes any "48 business hours" phrasing.
              defaultValue: 'within 2 business days',
              admin: {
                description:
                  'Used everywhere we promise a reply. Keep it consistent — it appears on forms and in emails.',
              },
            },
            {
              name: 'moqWarningDefault',
              type: 'number',
              label: 'Minimum order warning threshold',
              defaultValue: 250,
              min: 0,
              admin: {
                description:
                  'If someone asks for fewer than this many pieces of a style, the quote form gently warns them. It never blocks the request. Not shown publicly.',
              },
            },
            {
              name: 'showMoqPublicly',
              type: 'checkbox',
              label: 'Show minimum-order and price figures publicly',
              defaultValue: false,
              admin: {
                description:
                  'Off until you confirm real numbers. While off, no MOQ or price appears anywhere on the public site, whatever individual products say.',
              },
            },
          ],
        },
        {
          label: 'Announcement bar',
          fields: [
            {
              name: 'announcement',
              type: 'group',
              label: 'Announcement bar',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Show the announcement bar',
                  defaultValue: false,
                },
                { name: 'text', type: 'text', label: 'Message' },
                { name: 'href', type: 'text', label: 'Link (optional)' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
