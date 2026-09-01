import { useQuery } from '@tanstack/react-query'

import { getCustomers } from '@/services/internal/backend/v1/customers'

export const useGetCustomersQuery = () => {
  return useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers,
  })
}
