import { useMutation, useQueryClient } from '@tanstack/react-query'

import { logout } from '@/services/internal/backend/v1/auth'
export const useLogoutMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear()
    },
  })
}
