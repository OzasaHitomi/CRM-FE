import { useMutation } from '@tanstack/react-query'

import { login } from '@/services/internal/backend/v1/auth'
import type { LoginRequest } from '@/services/internal/backend/v1/types/request/auth'

export const useLoginMutation = () => {
  return useMutation<void, Error, LoginRequest>({
    mutationFn: login,
  })
}
