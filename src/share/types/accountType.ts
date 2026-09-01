import { z } from 'zod'

export const accountTypeSchema = z.enum(['sales', 'manager', 'admin'])

export type AccountType = z.infer<typeof accountTypeSchema>
