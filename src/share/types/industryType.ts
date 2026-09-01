import { z } from 'zod'

export const industryTypeSchema = z.enum([
  'manufacturing',
  'retail',
  'finance',
  'technology',
  'other',
])

export type IndustryType = z.infer<typeof industryTypeSchema>
