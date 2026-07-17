import type { Metadata } from 'next'
import { RoutePlaceholder } from '@/components/frontend/RoutePlaceholder'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Catalog',
  description:
    'Team wear, active wear, casual wear, outerwear and sports accessories — RUN APPAREL, made to order for B2B partners.',
  path: '/catalog',
})

export default function CatalogPage() {
  return (
    <RoutePlaceholder
      label="CATALOG"
      title="Five families, made to order."
      blurb="Team wear, active wear, casual wear, outerwear and accessories. The filterable catalog and category pages are being built."
    />
  )
}
