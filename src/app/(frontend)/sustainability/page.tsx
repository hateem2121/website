import type { Metadata } from 'next'
import { RoutePlaceholder } from '@/components/frontend/RoutePlaceholder'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Sustainability',
  description:
    'Certified-supplier materials, 40%+ less water and a 2030 carbon-neutral target — RUN APPAREL sustainability, backed by facts.',
  path: '/sustainability',
})

export default function SustainabilityPage() {
  return (
    <RoutePlaceholder
      label="FOR A BETTER TOMORROW"
      title="Backed by facts, not buzzwords."
      blurb="Certified-supplier materials, 40%+ less water, and a 2030 carbon-neutral target. Certifications sit within our ecosystem — never claimed by RUN itself."
    />
  )
}
