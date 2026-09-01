import { z } from 'zod'

export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'メールアドレスを入力してください' })
    .pipe(z.email({ message: 'メールアドレスの形式が正しくありません' })),
  password: z.string().min(1, { message: 'パスワードを入力してください' }),
})

export type LoginForm = z.infer<typeof loginFormSchema>

export type LoginErrors = Partial<Record<keyof LoginForm, string>> & {
  common?: string
}
