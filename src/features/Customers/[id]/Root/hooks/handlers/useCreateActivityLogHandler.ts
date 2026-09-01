import { useState } from 'react'
import { flattenError } from 'zod'

import { toaster } from '@/components/ui/toaster'
import { extractErrorMessage } from '@/share/logic/extractErrorMessage'

import { useCreateActivityLogMutation } from '@/features/Customers/[id]/Root/hooks/mutations/useCreateActivityLogMutation'
import {
  activityLogFormSchema,
  type ActivityLogForm,
  type ActivityLogFormErrors,
} from '@/features/Customers/[id]/Root/types/activityLogForm'
import type { CreateActivityLogRequest } from '@/services/internal/backend/v1/types/request/activityLog'

const EMPTY_ACTIVITY_LOG_FORM: ActivityLogForm = {
  type: 'call',
  activityDate: '',
  note: '',
}

export const useCreateActivityLogHandler = (customerId: string) => {
  const [targetDealId, setTargetDealId] = useState<string | null>(null)
  const [activityLogForm, setActivityLogForm] = useState<ActivityLogForm>(EMPTY_ACTIVITY_LOG_FORM)
  const [errors, setErrors] = useState<ActivityLogFormErrors>({})

  const createActivityLogMutation = useCreateActivityLogMutation(customerId)

  const onOpenAddActivityLogDialog = (dealId: string) => {
    setTargetDealId(dealId)
    setActivityLogForm(EMPTY_ACTIVITY_LOG_FORM)
    setErrors({})
  }

  const onCloseAddActivityLogDialog = () => {
    setTargetDealId(null)
    setActivityLogForm(EMPTY_ACTIVITY_LOG_FORM)
    setErrors({})
  }

  const onChangeActivityLogFormField = <K extends keyof ActivityLogForm>(
    key: K,
    value: ActivityLogForm[K],
  ) => {
    setActivityLogForm((prev) => ({ ...prev, [key]: value }))
  }

  const onSubmitAddActivityLog = async () => {
    if (!targetDealId) return

    const result = activityLogFormSchema.safeParse(activityLogForm)
    if (!result.success) {
      const fieldErrors = flattenError(result.error).fieldErrors
      setErrors({
        type: fieldErrors.type?.[0],
        activityDate: fieldErrors.activityDate?.[0],
        note: fieldErrors.note?.[0],
      })
      return
    }
    setErrors({})

    const request: CreateActivityLogRequest = {
      type: result.data.type,
      activityDate: new Date(result.data.activityDate),
      note: result.data.note === '' ? null : result.data.note,
    }

    try {
      await createActivityLogMutation.mutateAsync({ dealId: targetDealId, data: request })
      onCloseAddActivityLogDialog()
      toaster.create({
        type: 'success',
        description: '活動履歴を登録しました',
      })
    } catch (e) {
      setErrors({ common: extractErrorMessage(e, '活動履歴の登録に失敗しました') })
    }
  }

  return {
    data: { activityLogForm, activityLogFormErrors: errors },
    uiState: {
      isAddActivityLogDialogOpen: targetDealId !== null,
      isCreatingActivityLog: createActivityLogMutation.isPending,
    },
    handlers: {
      onOpenAddActivityLogDialog,
      onCloseAddActivityLogDialog,
      onChangeActivityLogFormField,
      onSubmitAddActivityLog,
    },
  }
}
