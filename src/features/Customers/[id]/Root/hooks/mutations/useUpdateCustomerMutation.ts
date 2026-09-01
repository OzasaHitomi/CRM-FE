import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateCustomer } from '@/services/internal/backend/v1/customers'
import type { UpdateCustomerRequest } from '@/services/internal/backend/v1/types/request/customer'

export const useUpdateCustomerMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ customerId, data }: { customerId: string; data: UpdateCustomerRequest }) =>
      updateCustomer(customerId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}
