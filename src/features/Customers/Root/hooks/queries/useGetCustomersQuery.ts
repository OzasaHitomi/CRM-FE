import { useQuery } from '@tanstack/react-query'

import { getCustomers } from '@/services/internal/backend/v1/customers'
import type { GetCustomersRequestQueryParams } from '@/services/internal/backend/v1/types/request/customer'

export const useGetCustomersQuery = (params: GetCustomersRequestQueryParams) => {
  return useQuery({
    // queryKeyにparamsを含めることで、ページや業界フィルタが変わるたびに自動で再取得される
    queryKey: ['customers', params],
    queryFn: () => getCustomers(params),
  })
}
