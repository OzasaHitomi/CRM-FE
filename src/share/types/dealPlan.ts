import { z } from 'zod'

export const dealPlanSchema = z.enum(['starter', 'professional', 'enterprise'])

export type DealPlan = z.infer<typeof dealPlanSchema>
