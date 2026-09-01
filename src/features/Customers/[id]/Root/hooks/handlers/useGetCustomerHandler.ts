import { useGetCustomerQuery } from '@/features/Customers/[id]/Root/hooks/queries/useGetCustomerQuery'

export const useGetCustomerHandler = (customerId: string) => {
  const customerQuery = useGetCustomerQuery(customerId)

  return {
    data: { customer: customerQuery.data },
    uiState: { isLoading: customerQuery.isLoading, isError: customerQuery.isError },
  }
}
