import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createDeal } from '@/services/internal/backend/v1/customers'
import type { CreateDealRequest } from '@/services/internal/backend/v1/types/request/deal'

export const useCreateDealMutation = (customerId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateDealRequest) => createDeal(customerId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['customers', customerId] })
    },
  })
}
