import { toaster } from '@/components/ui/toaster'
import { extractErrorMessage } from '@/share/logic/extractErrorMessage'

import { useUpdateUserStatusMutation } from '@/features/Admin/Users/Root/hooks/mutations/useUpdateUserStatusMutation'

export const useUpdateUserStatusHandler = () => {
  const updateUserStatusMutation = useUpdateUserStatusMutation()

  const onToggleUserStatus = async (userId: string, currentIsActive: boolean) => {
    try {
      await updateUserStatusMutation.mutateAsync({
        userId,
        data: { isActive: !currentIsActive },
      })
      toaster.create({
        type: 'success',
        description: 'ステータスを変更しました',
      })
    } catch (e) {
      toaster.create({
        type: 'error',
        description: extractErrorMessage(e, 'ステータスの変更に失敗しました'),
      })
    }
  }

  return {
    uiState: { isUpdatingUserStatus: updateUserStatusMutation.isPending },
    handlers: { onToggleUserStatus },
  }
}
