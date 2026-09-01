import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createCustomer } from '@/services/internal/backend/v1/customers'

export const useCreateCustomerMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}
