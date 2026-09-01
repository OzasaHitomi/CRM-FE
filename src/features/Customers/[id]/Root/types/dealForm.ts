import { z } from 'zod'

import { dealPlanSchema } from '@/share/types/dealPlan'

export const dealFormSchema = z.object({
  title: z.string().min(1, { message: '商談名を入力してください' }),
  amount: z.number().int().positive({ message: '金額は1以上で入力してください' }),
  plan: dealPlanSchema,
  licenseCount: z.number().int().positive({ message: 'ライセンス数は1以上で入力してください' }),
  contractPeriod: z.number().int().positive({ message: '契約期間は1以上で入力してください' }),
})

export type DealForm = z.infer<typeof dealFormSchema>

export type DealFormErrors = Partial<Record<keyof DealForm, string>> & {
  common?: string
}
