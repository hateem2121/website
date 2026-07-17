import type { Metadata } from 'next'
import { RoutePlaceholder } from '@/components/frontend/RoutePlaceholder'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Capabilities',
  description:
    'Five-stage manufacturing with 5+ QC checkpoints, 3D prototyping and 100,000+ units per month — RUN APPAREL, Sialkot.',
  path: '/capabilities',
})

export default function CapabilitiesPage() {
  return (
    <RoutePlaceholder
      label="CAPABILITIES"
      title="From tech pack to shipment."
      blurb="Five production stages, five-plus QC checkpoints, 3D prototyping and 100,000+ units a month — detailed here shortly."
    />
  )
}
