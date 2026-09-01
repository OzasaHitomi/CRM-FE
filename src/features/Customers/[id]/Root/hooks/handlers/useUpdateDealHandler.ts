import { useState } from 'react'
import { flattenError } from 'zod'

import { toaster } from '@/components/ui/toaster'
import { extractErrorMessage } from '@/share/logic/extractErrorMessage'

import { useUpdateDealMutation } from '@/features/Customers/[id]/Root/hooks/mutations/useUpdateDealMutation'
import {
  dealFormSchema,
  type DealForm,
  type DealFormErrors,
} from '@/features/Customers/[id]/Root/types/dealForm'
import type { UpdateDealRequest } from '@/services/internal/backend/v1/types/request/deal'
import type { DealResponseItem } from '@/services/internal/backend/v1/types/response/customer'

const EMPTY_DEAL_FORM: DealForm = {
  title: '',
  amount: 0,
  plan: 'starter',
  licenseCount: 0,
  contractPeriod: 0,
}

export const useUpdateDealHandler = (customerId: string) => {
  const [isEditDealDialogOpen, setIsEditDealDialogOpen] = useState(false)
  const [editingDealId, setEditingDealId] = useState<string | null>(null)
  const [editDealForm, setEditDealForm] = useState<DealForm>(EMPTY_DEAL_FORM)
  const [errors, setErrors] = useState<DealFormErrors>({})

  const updateDealMutation = useUpdateDealMutation(customerId)

  const onOpenEditDealDialog = (deal: DealResponseItem) => {
    setEditingDealId(deal.dealId)
    setEditDealForm({
      title: deal.title,
      amount: deal.amount,
      plan: deal.plan,
      licenseCount: deal.licenseCount,
      contractPeriod: deal.contractPeriod,
    })
    setIsEditDealDialogOpen(true)
  }

  const onCloseEditDealDialog = () => {
    setIsEditDealDialogOpen(false)
    setEditingDealId(null)
    setErrors({})
  }

  const onChangeEditDealFormField = <K extends keyof DealForm>(key: K, value: DealForm[K]) => {
    setEditDealForm((prev) => ({ ...prev, [key]: value }))
  }

  const onSubmitEditDeal = async () => {
    if (!editingDealId) return

    const result = dealFormSchema.safeParse(editDealForm)
    if (!result.success) {
      const fieldErrors = flattenError(result.error).fieldErrors
      setErrors({
        title: fieldErrors.title?.[0],
        amount: fieldErrors.amount?.[0],
        plan: fieldErrors.plan?.[0],
        licenseCount: fieldErrors.licenseCount?.[0],
        contractPeriod: fieldErrors.contractPeriod?.[0],
      })
      return
    }
    setErrors({})

    const request: UpdateDealRequest = result.data

    try {
      await updateDealMutation.mutateAsync({ dealId: editingDealId, data: request })
      onCloseEditDealDialog()
      toaster.create({
        type: 'success',
        description: '商談情報を更新しました',
      })
    } catch (e) {
      setErrors({ common: extractErrorMessage(e, '商談情報の更新に失敗しました') })
    }
  }

  return {
    data: { editDealForm, editDealFormErrors: errors },
    uiState: {
      isEditDealDialogOpen,
      isUpdatingDeal: updateDealMutation.isPending,
    },
    handlers: {
      onOpenEditDealDialog,
      onCloseEditDealDialog,
      onChangeEditDealFormField,
      onSubmitEditDeal,
    },
  }
}
