import { useNavigate } from 'react-router-dom'

import { toaster } from '@/components/ui/toaster'
import { extractErrorMessage } from '@/share/logic/extractErrorMessage'
import { useGetMeQuery } from '@/share/hooks/queries/useGetMeQuery'

import { useAssignCustomerMutation } from '@/features/Customers/hooks/mutations/useAssignCustomerMutation'
import { useUnassignCustomerMutation } from '@/features/Customers/hooks/mutations/useUnassignCustomerMutation'

type Options = {
  redirectToListOnUnassign?: boolean
}

export const useAssignCustomerHandler = (options?: Options) => {
  const navigate = useNavigate()
  const { data: me } = useGetMeQuery()
  const assignCustomerMutation = useAssignCustomerMutation()
  const unassignCustomerMutation = useUnassignCustomerMutation()

  const onAssignToMe = async (customerId: string) => {
    try {
      await assignCustomerMutation.mutateAsync(customerId)
      toaster.create({
        type: 'success',
        description: '担当者を割り当てました',
      })
    } catch (e) {
      toaster.create({
        type: 'error',
        description: extractErrorMessage(e, '担当者の割り当てに失敗しました'),
      })
    }
  }

  const onUnassign = async (customerId: string) => {
    try {
      await unassignCustomerMutation.mutateAsync(customerId)
      toaster.create({
        type: 'success',
        description: '担当を解除しました',
      })
      if (options?.redirectToListOnUnassign && me?.role === 'sales') {
        await navigate('/customers')
      }
    } catch (e) {
      toaster.create({
        type: 'error',
        description: extractErrorMessage(e, '担当解除に失敗しました'),
      })
    }
  }

  return {
    data: { me },
    uiState: {
      isAssigningCustomer: assignCustomerMutation.isPending,
      isUnassigningCustomer: unassignCustomerMutation.isPending,
    },
    handlers: { onAssignToMe, onUnassign },
  }
}
