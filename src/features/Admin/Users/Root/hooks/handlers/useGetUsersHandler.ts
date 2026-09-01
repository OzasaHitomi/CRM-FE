import { useGetUsersQuery } from '@/features/Admin/Users/Root/hooks/queries/useGetUsersQuery'

export const useGetUsersHandler = () => {
  const usersQuery = useGetUsersQuery()

  return {
    data: { users: usersQuery.data ?? [] },
    uiState: { isLoading: usersQuery.isLoading, isError: usersQuery.isError },
  }
}
