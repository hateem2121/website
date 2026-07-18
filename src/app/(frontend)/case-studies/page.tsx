import type { Metadata } from 'next'
import { RoutePlaceholder } from '@/components/frontend/RoutePlaceholder'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Case Studies',
  description: 'Anonymised stories of what RUN APPAREL builds for brands, teams and organisations.',
  path: '/case-studies',
})

export default function CaseStudiesPage() {
  return (
    <RoutePlaceholder
      label="SELECTED WORK"
      title="Partners, anonymised."
      blurb="Anonymised case studies — sector, region, challenge and result — are on the way."
    />
  )
}
