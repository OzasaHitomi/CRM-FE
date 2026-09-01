import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateUserStatus } from '@/services/internal/backend/v1/admin/users'
import type { UpdateUserStatusRequest } from '@/services/internal/backend/v1/types/request/admin/user'

export const useUpdateUserStatusMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserStatusRequest }) =>
      updateUserStatus(userId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
    },
  })
}
