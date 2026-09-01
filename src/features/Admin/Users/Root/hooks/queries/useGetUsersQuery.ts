import { useQuery } from '@tanstack/react-query'

import { getUsers } from '@/services/internal/backend/v1/admin/users'

export const useGetUsersQuery = () => {
  return useQuery({
    queryKey: ['adminUsers'],
    queryFn: getUsers,
  })
}
