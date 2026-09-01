import { z } from 'zod'

import { industryTypeSchema } from '@/share/types/industryType'

export const customerFormSchema = z.object({
  companyName: z.string().min(1, { message: '会社名を入力してください' }),
  industry: industryTypeSchema,
  companySize: z.number().int().positive({ message: '従業員数は1以上で入力してください' }),
  contactName: z.string().min(1, { message: '担当者名を入力してください' }),
  phone: z.string().min(1, { message: '電話番号を入力してください' }),
  email: z
    .string()
    .min(1, { message: 'メールアドレスを入力してください' })
    .pipe(z.email({ message: 'メールアドレスの形式が正しくありません' })),
})

export type CustomerForm = z.infer<typeof customerFormSchema>

export type CustomerFormErrors = Partial<Record<keyof CustomerForm, string>> & {
  common?: string
}

export const CUSTOMER_FORM_FIELD_KEYS = [
  'companyName',
  'industry',
  'companySize',
  'contactName',
  'phone',
  'email',
] as const satisfies readonly (keyof CustomerForm)[]
