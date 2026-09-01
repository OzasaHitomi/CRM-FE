import { useState } from 'react'
import { flattenError } from 'zod'

import { toaster } from '@/components/ui/toaster'
import { extractErrorMessage } from '@/share/logic/extractErrorMessage'

import { useCreateDealMutation } from '@/features/Customers/[id]/Root/hooks/mutations/useCreateDealMutation'
import {
  dealFormSchema,
  type DealForm,
  type DealFormErrors,
} from '@/features/Customers/[id]/Root/types/dealForm'
import type { CreateDealRequest } from '@/services/internal/backend/v1/types/request/deal'

const INITIAL_DEAL_FORM: DealForm = {
  title: '',
  amount: 0,
  plan: 'starter',
  licenseCount: 0,
  contractPeriod: 0,
}

export const useCreateDealHandler = (customerId: string) => {
  const [isAddDealDialogOpen, setIsAddDealDialogOpen] = useState(false)
  const [dealForm, setDealForm] = useState<DealForm>(INITIAL_DEAL_FORM)
  const [errors, setErrors] = useState<DealFormErrors>({})

  const createDealMutation = useCreateDealMutation(customerId)

  const onOpenCreateDealDialog = () => {
    setIsAddDealDialogOpen(true)
  }

  const onCloseCreateDealDialog = () => {
    setIsAddDealDialogOpen(false)
    setDealForm(INITIAL_DEAL_FORM)
    setErrors({})
  }

  const onChangeDealFormField = <K extends keyof DealForm>(key: K, value: DealForm[K]) => {
    setDealForm((prev) => ({ ...prev, [key]: value }))
  }

  const onSubmitCreateDeal = async () => {
    const result = dealFormSchema.safeParse(dealForm)
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

    const request: CreateDealRequest = result.data

    try {
      await createDealMutation.mutateAsync(request)
      onCloseCreateDealDialog()
      toaster.create({
        type: 'success',
        description: '商談を登録しました',
      })
    } catch (e) {
      setErrors({ common: extractErrorMessage(e, '商談の登録に失敗しました') })
    }
  }

  return {
    data: { dealForm, dealFormErrors: errors },
    uiState: { isAddDealDialogOpen, isCreatingDeal: createDealMutation.isPending },
    handlers: {
      onOpenCreateDealDialog,
      onCloseCreateDealDialog,
      onChangeDealFormField,
      onSubmitCreateDeal,
    },
  }
}
