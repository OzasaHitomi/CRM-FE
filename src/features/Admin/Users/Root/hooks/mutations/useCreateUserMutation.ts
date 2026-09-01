import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createUser } from '@/services/internal/backend/v1/admin/users'

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
    },
  })
}
