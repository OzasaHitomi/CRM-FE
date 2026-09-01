import { z } from 'zod'

export const activityTypeSchema = z.enum(['call', 'email', 'visit', 'online_meeting', 'other'])

export type ActivityType = z.infer<typeof activityTypeSchema>
