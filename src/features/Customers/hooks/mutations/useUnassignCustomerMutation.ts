import { useMutation, useQueryClient } from '@tanstack/react-query'

import { unassignCustomerUser } from '@/services/internal/backend/v1/customers'

export const useUnassignCustomerMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: unassignCustomerUser,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}
