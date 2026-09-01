import { z } from 'zod'

export const dealStatusSchema = z.enum([
  'lead',
  'hearing',
  'proposal',
  'negotiation',
  'closed_won',
  'closed_lost',
])

export type DealStatus = z.infer<typeof dealStatusSchema>
