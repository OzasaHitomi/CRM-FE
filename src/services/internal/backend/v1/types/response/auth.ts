import { z } from 'zod'

import { accountTypeSchema } from '@/share/types/accountType'

export const meResponseSchema = z.object({
  userId: z.string(),
  role: accountTypeSchema,
  name: z.string(),
})

export type MeResponse = z.infer<typeof meResponseSchema>
