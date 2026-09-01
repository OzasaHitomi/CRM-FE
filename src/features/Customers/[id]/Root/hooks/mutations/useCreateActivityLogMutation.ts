import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createActivityLog } from '@/services/internal/backend/v1/deals'
import type { CreateActivityLogRequest } from '@/services/internal/backend/v1/types/request/activityLog'

export const useCreateActivityLogMutation = (customerId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ dealId, data }: { dealId: string; data: CreateActivityLogRequest }) =>
      createActivityLog(dealId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['customers', customerId] })
    },
  })
}
