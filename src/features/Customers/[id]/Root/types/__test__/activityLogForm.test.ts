import { describe, expect, it } from 'vitest'

import { activityLogFormSchema } from '../activityLogForm'

const validForm = {
  type: 'call' as const,
  activityDate: '2026-01-10',
  note: 'Discovery call',
}

describe('activityLogFormSchema', () => {
  it('全て正しい値の場合、successになること', () => {
    const result = activityLogFormSchema.safeParse(validForm)

    expect(result.success).toBe(true)
  })

  it('noteが空文字の場合でも、successになること', () => {
    const result = activityLogFormSchema.safeParse({ ...validForm, note: '' })

    expect(result.success).toBe(true)
  })

  it('activityDateが空の場合、必須エラーになること', () => {
    const result = activityLogFormSchema.safeParse({ ...validForm, activityDate: '' })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('活動日を入力してください')
  })

  it('typeが不正な値の場合、エラーになること', () => {
    const result = activityLogFormSchema.safeParse({ ...validForm, type: 'invalid' })

    expect(result.success).toBe(false)
  })
})
