import { z } from 'zod'

import { accountTypeSchema } from '@/share/types/accountType'

export const userFormSchema = z.object({
  name: z.string().min(1, { message: '表示名を入力してください' }),
  email: z
    .string()
    .min(1, { message: 'メールアドレスを入力してください' })
    .pipe(z.email({ message: 'メールアドレスの形式が正しくありません' })),
  password: z.string().min(1, { message: 'パスワードを入力してください' }),
  role: accountTypeSchema,
})

export type UserForm = z.infer<typeof userFormSchema>

export type UserFormErrors = Partial<Record<keyof UserForm, string>> & {
  common?: string
}
