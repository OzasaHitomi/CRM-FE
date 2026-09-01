import { useState } from 'react'

import { toaster } from '@/components/ui/toaster'
import { extractErrorMessage } from '@/share/logic/extractErrorMessage'
import type { DealStatus } from '@/share/types/dealStatus'

import { useUpdateDealStatusMutation } from '@/features/Customers/[id]/Root/hooks/mutations/useUpdateDealStatusMutation'

const TERMINAL_STATUSES: DealStatus[] = ['closed_won', 'closed_lost']

export const useUpdateDealStatusHandler = (customerId: string) => {
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    dealId: string
    status: DealStatus
  } | null>(null)

  const updateDealStatusMutation = useUpdateDealStatusMutation(customerId)

  const onSubmitDealStatusChange = async (dealId: string, status: DealStatus) => {
    try {
      await updateDealStatusMutation.mutateAsync({ dealId, status })
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

  const onSelectDealStatus = async (dealId: string, status: DealStatus) => {
    if (TERMINAL_STATUSES.includes(status)) {
      setPendingStatusChange({ dealId, status })
      return
    }
    await onSubmitDealStatusChange(dealId, status)
  }

  const onConfirmDealStatusChange = async () => {
    if (!pendingStatusChange) return
    await onSubmitDealStatusChange(pendingStatusChange.dealId, pendingStatusChange.status)
    setPendingStatusChange(null)
  }

  const onCancelDealStatusChange = () => {
    setPendingStatusChange(null)
  }

  return {
    uiState: {
      isConfirmDealStatusDialogOpen: pendingStatusChange !== null,
      isUpdatingDealStatus: updateDealStatusMutation.isPending,
    },
    handlers: {
      onSelectDealStatus,
      onConfirmDealStatusChange,
      onCancelDealStatusChange,
    },
  }
}
