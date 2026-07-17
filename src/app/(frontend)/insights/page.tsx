import type { Metadata } from 'next'
import { RoutePlaceholder } from '@/components/frontend/RoutePlaceholder'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Insights',
  description:
    'Guides for brands, teams and sourcing partners — choosing a manufacturer, fabric certifications, tech packs and more.',
  path: '/insights',
})

export default function InsightsPage() {
  return (
    <RoutePlaceholder
      label="INSIGHTS"
      title="Notes from the factory floor."
      blurb="Practical guides for brands, teams and sourcing partners — the first articles are being written."
    />
  )
}
