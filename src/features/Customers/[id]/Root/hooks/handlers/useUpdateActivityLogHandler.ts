import { useState } from 'react'
import { flattenError } from 'zod'

import { toaster } from '@/components/ui/toaster'
import { extractErrorMessage } from '@/share/logic/extractErrorMessage'

import { useUpdateActivityLogMutation } from '@/features/Customers/[id]/Root/hooks/mutations/useUpdateActivityLogMutation'
import {
  activityLogFormSchema,
  type ActivityLogForm,
  type ActivityLogFormErrors,
} from '@/features/Customers/[id]/Root/types/activityLogForm'
import type { ActivityLogResponseItem } from '@/services/internal/backend/v1/types/response/customer'
import type { UpdateActivityLogRequest } from '@/services/internal/backend/v1/types/request/activityLog'

type EditActivityLogTarget = {
  dealId: string
  activityLogId: string
}

export const useUpdateActivityLogHandler = (customerId: string) => {
  const [target, setTarget] = useState<EditActivityLogTarget | null>(null)
  const [activityLogForm, setActivityLogForm] = useState<ActivityLogForm>({
    type: 'call',
    activityDate: '',
    note: '',
  })
  const [errors, setErrors] = useState<ActivityLogFormErrors>({})

  const updateActivityLogMutation = useUpdateActivityLogMutation(customerId)

  const onOpenEditActivityLogDialog = (dealId: string, log: ActivityLogResponseItem) => {
    setTarget({ dealId, activityLogId: log.activityLogId })
    setActivityLogForm({
      type: log.type,
      activityDate: log.activityDate,
      note: log.note ?? '',
    })
    setErrors({})
  }

  const onCloseEditActivityLogDialog = () => {
    setTarget(null)
    setErrors({})
  }

  const onChangeEditActivityLogFormField = <K extends keyof ActivityLogForm>(
    key: K,
    value: ActivityLogForm[K],
  ) => {
    setActivityLogForm((prev) => ({ ...prev, [key]: value }))
  }

  const onSubmitEditActivityLog = async () => {
    if (!target) return

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

    const request: UpdateActivityLogRequest = {
      type: result.data.type,
      activityDate: new Date(result.data.activityDate),
      note: result.data.note === '' ? null : result.data.note,
    }

    try {
      await updateActivityLogMutation.mutateAsync({
        dealId: target.dealId,
        activityLogId: target.activityLogId,
        data: request,
      })
      onCloseEditActivityLogDialog()
      toaster.create({
        type: 'success',
        description: '活動履歴を更新しました',
      })
    } catch (e) {
      setErrors({ common: extractErrorMessage(e, '活動履歴の更新に失敗しました') })
    }
  }

  return {
    data: { editActivityLogForm: activityLogForm, editActivityLogFormErrors: errors },
    uiState: {
      isEditActivityLogDialogOpen: target !== null,
      isUpdatingActivityLog: updateActivityLogMutation.isPending,
    },
    handlers: {
      onOpenEditActivityLogDialog,
      onCloseEditActivityLogDialog,
      onChangeEditActivityLogFormField,
      onSubmitEditActivityLog,
    },
  }
}
