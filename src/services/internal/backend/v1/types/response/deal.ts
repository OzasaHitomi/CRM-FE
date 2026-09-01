import { z } from 'zod'

import { dealPlanSchema } from '@/share/types/dealPlan'
import { dealStatusSchema } from '@/share/types/dealStatus'

export const updateDealResponseSchema = z.object({
  dealId: z.string(),
  title: z.string(),
  amount: z.number(),
  plan: dealPlanSchema,
  licenseCount: z.number(),
  contractPeriod: z.number(),
})

export type UpdateDealResponse = z.infer<typeof updateDealResponseSchema>

export const updateDealStatusResponseSchema = z.object({
  dealId: z.string(),
  status: dealStatusSchema,
})

export type UpdateDealStatusResponse = z.infer<typeof updateDealStatusResponseSchema>
