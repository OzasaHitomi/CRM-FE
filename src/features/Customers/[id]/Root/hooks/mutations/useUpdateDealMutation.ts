import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateDeal } from '@/services/internal/backend/v1/deals'
import type { UpdateDealRequest } from '@/services/internal/backend/v1/types/request/deal'

export const useUpdateDealMutation = (customerId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ dealId, data }: { dealId: string; data: UpdateDealRequest }) =>
      updateDeal(dealId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['customers', customerId] })
    },
  })
}
