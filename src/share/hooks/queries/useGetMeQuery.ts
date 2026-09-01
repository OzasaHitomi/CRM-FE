import { useQuery } from '@tanstack/react-query'

import { getMe } from '@/services/internal/backend/v1/auth'
import { sharedQueryKeys } from '@/share/hooks/queries/queryKeys'

export const useGetMeQuery = () => {
  return useQuery({
    queryKey: sharedQueryKeys.Me,
    queryFn: getMe,
    staleTime: Infinity,
    retry: false,
  })
}
