import { describe, expect, it } from 'vitest'

import { userFormSchema } from '../userForm'

const validForm = {
  name: 'Priya Nair',
  email: 'priya.nair@novel.co',
  password: 'password',
  role: 'sales' as const,
}

describe('userFormSchema', () => {
  it('全て正しい値の場合、successになること', () => {
    const result = userFormSchema.safeParse(validForm)

    expect(result.success).toBe(true)
  })

  it('nameが空の場合、必須エラーになること', () => {
    const result = userFormSchema.safeParse({ ...validForm, name: '' })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('表示名を入力してください')
  })

  it('emailが空の場合、必須エラーになること', () => {
    const result = userFormSchema.safeParse({ ...validForm, email: '' })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('メールアドレスを入力してください')
  })

  it('emailが不正な形式の場合、形式エラーになること', () => {
    const result = userFormSchema.safeParse({ ...validForm, email: 'invalid-email' })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('メールアドレスの形式が正しくありません')
  })

  it('passwordが空の場合、必須エラーになること', () => {
    const result = userFormSchema.safeParse({ ...validForm, password: '' })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('パスワードを入力してください')
  })

  it('roleが不正な値の場合、エラーになること', () => {
    const result = userFormSchema.safeParse({ ...validForm, role: 'invalid-role' })

    expect(result.success).toBe(false)
  })
})
