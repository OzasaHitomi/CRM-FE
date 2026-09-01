import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateActivityLog } from '@/services/internal/backend/v1/deals'
import type { UpdateActivityLogRequest } from '@/services/internal/backend/v1/types/request/activityLog'

export const useUpdateActivityLogMutation = (customerId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      dealId,
      activityLogId,
      data,
    }: {
      dealId: string
      activityLogId: string
      data: UpdateActivityLogRequest
    }) => updateActivityLog(dealId, activityLogId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['customers', customerId] })
    },
  })
}
