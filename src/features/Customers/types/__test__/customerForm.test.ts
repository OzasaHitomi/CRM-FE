import { describe, expect, it } from 'vitest'

import { customerFormSchema } from '../customerForm'

const validForm = {
  companyName: 'Cedar & Vine Retail',
  industry: 'retail' as const,
  companySize: 120,
  contactName: 'Jamie Lee',
  phone: '+1 (415) 555-0100',
  email: 'jamie.lee@cedarvine.com',
}

describe('customerFormSchema', () => {
  it('全て正しい値の場合、successになること', () => {
    const result = customerFormSchema.safeParse(validForm)

    expect(result.success).toBe(true)
  })

  it('companyNameが空の場合、必須エラーになること', () => {
    const result = customerFormSchema.safeParse({ ...validForm, companyName: '' })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('会社名を入力してください')
  })

  it('companySizeが0以下の場合、エラーになること', () => {
    const result = customerFormSchema.safeParse({ ...validForm, companySize: 0 })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('従業員数は1以上で入力してください')
  })

  it('companySizeが整数でない場合、エラーになること', () => {
    const result = customerFormSchema.safeParse({ ...validForm, companySize: 1.5 })

    expect(result.success).toBe(false)
  })

  it('contactNameが空の場合、必須エラーになること', () => {
    const result = customerFormSchema.safeParse({ ...validForm, contactName: '' })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('担当者名を入力してください')
  })

  it('phoneが空の場合、必須エラーになること', () => {
    const result = customerFormSchema.safeParse({ ...validForm, phone: '' })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('電話番号を入力してください')
  })

  it('emailが空の場合、必須エラーになること', () => {
    const result = customerFormSchema.safeParse({ ...validForm, email: '' })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('メールアドレスを入力してください')
  })

  it('emailが不正な形式の場合、形式エラーになること', () => {
    const result = customerFormSchema.safeParse({ ...validForm, email: 'invalid-email' })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('メールアドレスの形式が正しくありません')
  })
})
