import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateDealStatus } from '@/services/internal/backend/v1/deals'
import type { DealStatus } from '@/share/types/dealStatus'

export const useUpdateDealStatusMutation = (customerId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ dealId, status }: { dealId: string; status: DealStatus }) =>
      updateDealStatus(dealId, { status }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['customers', customerId] })
    },
  })
}
