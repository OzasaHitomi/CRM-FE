import { useMutation, useQueryClient } from '@tanstack/react-query'

import { assignCustomerUser } from '@/services/internal/backend/v1/customers'

export const useAssignCustomerMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: assignCustomerUser,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}
