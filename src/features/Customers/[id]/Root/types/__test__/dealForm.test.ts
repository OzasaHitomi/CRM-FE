import { describe, expect, it } from 'vitest'

import { dealFormSchema } from '../dealForm'

const validForm = {
  title: 'Warehouse analytics add-on',
  amount: 18000,
  plan: 'professional' as const,
  licenseCount: 40,
  contractPeriod: 12,
}

describe('dealFormSchema', () => {
  it('全て正しい値の場合、successになること', () => {
    const result = dealFormSchema.safeParse(validForm)

    expect(result.success).toBe(true)
  })

  it('titleが空の場合、必須エラーになること', () => {
    const result = dealFormSchema.safeParse({ ...validForm, title: '' })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('商談名を入力してください')
  })

  it('amountが0以下の場合、エラーになること', () => {
    const result = dealFormSchema.safeParse({ ...validForm, amount: 0 })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('金額は1以上で入力してください')
  })

  it('amountが整数でない場合、エラーになること', () => {
    const result = dealFormSchema.safeParse({ ...validForm, amount: 1.5 })

    expect(result.success).toBe(false)
  })

  it('licenseCountが0以下の場合、エラーになること', () => {
    const result = dealFormSchema.safeParse({ ...validForm, licenseCount: 0 })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('ライセンス数は1以上で入力してください')
  })

  it('contractPeriodが0以下の場合、エラーになること', () => {
    const result = dealFormSchema.safeParse({ ...validForm, contractPeriod: 0 })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('契約期間は1以上で入力してください')
  })
})
