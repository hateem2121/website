import fs from 'fs'
import path from 'path'
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { CloudflareContext, getCloudflareContext } from '@opennextjs/cloudflare'
import { GetPlatformProxyOptions } from 'wrangler'
import { r2Storage } from '@payloadcms/storage-r2'

import { Admins } from './collections/Admins'
import { Buyers } from './collections/Buyers'
import { Categories } from './collections/Categories'
import { CaseStudies } from './collections/CaseStudies'
import { FabricLibrary } from './collections/FabricLibrary'
import { Inquiries } from './collections/Inquiries'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Products } from './collections/Products'
import { RFQs } from './collections/RFQs'
import { ExclusionList } from './globals/ExclusionList'
import { Footer } from './globals/Footer'
import { Navigation } from './globals/Navigation'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const realpath = (value: string) => (fs.existsSync(value) ? fs.realpathSync(value) : undefined)

const isCLI = process.argv.some((value) => realpath(value).endsWith(path.join('payload', 'bin.js')))
const isProduction = process.env.NODE_ENV === 'production'

const createLog =
  (level: string, fn: typeof console.log) => (objOrMsg: object | string, msg?: string) => {
    if (typeof objOrMsg === 'string') {
      fn(JSON.stringify({ level, msg: objOrMsg }))
    } else {
      fn(JSON.stringify({ level, ...objOrMsg, msg: msg ?? (objOrMsg as { msg?: string }).msg }))
    }
  }

const cloudflareLogger = {
  level: process.env.PAYLOAD_LOG_LEVEL || 'info',
  trace: createLog('trace', console.debug),
  debug: createLog('debug', console.debug),
  info: createLog('info', console.log),
  warn: createLog('warn', console.warn),
  error: createLog('error', console.error),
  fatal: createLog('fatal', console.error),
  silent: () => {},
} as any // Use PayloadLogger type when it's exported

const cloudflare =
  isCLI || !isProduction
    ? await getCloudflareContextFromWrangler()
    : await getCloudflareContext({ async: true })

export default buildConfig({
  admin: {
    // Naming `admins` here is what keeps buyers out of the admin panel: Payload refuses admin
    // access whenever the logged-in user's collection differs from this one, before any role
    // check runs (spec §4: "buyers can never reach /admin").
    user: Admins.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      views: {
        // Buyer Approval Queue (spec §4.1, §10). `path` is relative to the admin route, so this
        // resolves to /admin/approval-queue. Re-run `pnpm generate:importmap` after touching this.
        approvalQueue: {
          Component: '/views/ApprovalQueue#ApprovalQueue',
          path: '/approval-queue',
          exact: true,
          meta: { title: 'Approval queue' },
        },
      },
      // Custom views get no sidebar link automatically.
      afterNavLinks: ['/components/ApprovalQueueNavLink#ApprovalQueueNavLink'],
    },
  },
  collections: [
    // Content
    Pages,
    Posts,
    CaseStudies,
    Media,
    // Catalog
    Categories,
    Products,
    FabricLibrary,
    // Buyers & demand
    Buyers,
    RFQs,
    Inquiries,
    // Settings
    Admins,
  ],
  globals: [SiteSettings, ExclusionList, Navigation, Footer],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteD1Adapter({ binding: cloudflare.env.D1 }),
  logger: isProduction ? cloudflareLogger : undefined,
  plugins: [
    r2Storage({
      bucket: cloudflare.env.R2,
      collections: { media: true },
    }),
  ],
})

// Adapted from https://github.com/opennextjs/opennextjs-cloudflare/blob/d00b3a13e42e65aad76fba41774815726422cc39/packages/cloudflare/src/api/cloudflare-context.ts#L328C36-L328C46
function getCloudflareContextFromWrangler(): Promise<CloudflareContext> {
  return import(/* webpackIgnore: true */ `${'__wrangler'.replaceAll('_', '')}`).then(
    ({ getPlatformProxy }) =>
      getPlatformProxy({
        environment: process.env.CLOUDFLARE_ENV,
        remoteBindings: isProduction,
      } satisfies GetPlatformProxyOptions),
  )
}
