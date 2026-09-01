import { useNavigate } from 'react-router-dom'

import { toaster } from '@/components/ui/toaster'
import { extractErrorMessage } from '@/share/logic/extractErrorMessage'
import { useLogoutMutation } from '@/share/hooks/mutations/useLogoutMutation'

export const useLogoutHandler = () => {
  const logoutMutation = useLogoutMutation()
  const navigate = useNavigate()

  const onLogout = async () => {
    try {
      await logoutMutation.mutateAsync()
      void navigate('/login', { replace: true })
    } catch (e) {
      toaster.create({
        type: 'error',
        description: extractErrorMessage(e, 'ログアウトに失敗しました'),
      })
    }
  }

  return {
    handlers: { onLogout },
  }
}
