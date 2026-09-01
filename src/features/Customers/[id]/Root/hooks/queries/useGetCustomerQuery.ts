import { useQuery } from '@tanstack/react-query'

import { getCustomer } from '@/services/internal/backend/v1/customers'

export const useGetCustomerQuery = (customerId: string) => {
  return useQuery({
    queryKey: ['customers', customerId],
    queryFn: () => getCustomer(customerId),
    retry: false,
  })
}
