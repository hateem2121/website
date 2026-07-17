import type { Metadata } from 'next'
import { RoutePlaceholder } from '@/components/frontend/RoutePlaceholder'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Heritage',
  description:
    'The RUN APPAREL story — from a Sialkot workshop in 1889 to a modern B2B apparel division of Durus Industries.',
  path: '/about',
})

export default function AboutPage() {
  return (
    <RoutePlaceholder
      label="HERITAGE · SINCE 1889"
      title="A family that never looks back."
      blurb="From a Sialkot leather workshop in 1889 to a modern B2B apparel division — the full timeline is on its way."
    />
  )
}
