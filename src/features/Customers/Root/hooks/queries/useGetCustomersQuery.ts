import { useQuery } from '@tanstack/react-query'

import { getCustomers } from '@/services/internal/backend/v1/customers'

export const useGetCustomersQuery = (page: number) => {
  return useQuery({
    // queryKeyにpageを含めることで、ページが変わるたびに自動で再取得される
    queryKey: ['customers', page],
    queryFn: () => getCustomers({ page }),
  })
}
