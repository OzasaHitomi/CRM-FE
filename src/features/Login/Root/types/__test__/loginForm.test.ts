import { describe, expect, it } from 'vitest'

import { loginFormSchema } from '../loginForm'

describe('loginFormSchema', () => {
  it('emailとpasswordが正しい場合、successになること', () => {
    const result = loginFormSchema.safeParse({
      email: 'test@example.com',
      password: 'password',
    })

    expect(result.success).toBe(true)
  })

  it('emailが空の場合、必須エラーになること', () => {
    const result = loginFormSchema.safeParse({ email: '', password: 'password' })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('メールアドレスを入力してください')
  })

  it('emailが不正な形式の場合、形式エラーになること', () => {
    const result = loginFormSchema.safeParse({ email: 'invalid-email', password: 'password' })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('メールアドレスの形式が正しくありません')
  })

  it('passwordが空の場合、必須エラーになること', () => {
    const result = loginFormSchema.safeParse({ email: 'test@example.com', password: '' })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('パスワードを入力してください')
  })
})
