import { useGetCustomersQuery } from '@/features/Customers/Root/hooks/queries/useGetCustomersQuery'

export const useGetCustomersHandler = () => {
  const customersQuery = useGetCustomersQuery()

  return {
    data: { customers: customersQuery.data ?? [] },
    uiState: { isLoading: customersQuery.isLoading, isError: customersQuery.isError },
  }
}
