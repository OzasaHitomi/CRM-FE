import { Badge } from '@chakra-ui/react'

import type { IndustryType } from '@/share/types/industryType'

type IndustryBadgeProps = {
  industry: IndustryType
}

const INDUSTRY_COLOR_PALETTE: Record<IndustryType, string> = {
  manufacturing: 'orange',
  retail: 'pink',
  finance: 'green',
  technology: 'blue',
  other: 'gray',
}

export const IndustryBadge = ({ industry }: IndustryBadgeProps) => {
  return <Badge colorPalette={INDUSTRY_COLOR_PALETTE[industry]}>{industry}</Badge>
}
