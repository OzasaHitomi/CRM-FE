import { z } from 'zod'

import { activityTypeSchema } from '@/share/types/activityType'

export const activityLogFormSchema = z.object({
  type: activityTypeSchema,
  activityDate: z.string().min(1, { message: '活動日を入力してください' }),
  note: z.string(),
})

export type ActivityLogForm = z.infer<typeof activityLogFormSchema>

export type ActivityLogFormErrors = Partial<Record<keyof ActivityLogForm, string>> & {
  common?: string
}
