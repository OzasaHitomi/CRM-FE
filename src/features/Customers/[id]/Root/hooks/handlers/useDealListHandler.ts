import { useState } from 'react'

export const useDealListHandler = () => {
  const [expandedDealId, setExpandedDealId] = useState<string | null>(null)

  const onToggleDealExpand = (dealId: string) => {
    setExpandedDealId((prev) => (prev === dealId ? null : dealId))
  }

  return {
    uiState: { expandedDealId },
    handlers: { onToggleDealExpand },
  }
}
