import { z } from 'zod'

import { activityTypeSchema } from '@/share/types/activityType'

export const createActivityLogResponseSchema = z.object({
  activityLogId: z.string(),
  type: activityTypeSchema,
  activityDate: z.iso.date(),
  note: z.string().nullable(),
})

export type CreateActivityLogResponse = z.infer<typeof createActivityLogResponseSchema>

export const updateActivityLogResponseSchema = z.object({
  activityLogId: z.string(),
  type: activityTypeSchema,
  activityDate: z.iso.date(),
  note: z.string().nullable(),
})

export type UpdateActivityLogResponse = z.infer<typeof updateActivityLogResponseSchema>
