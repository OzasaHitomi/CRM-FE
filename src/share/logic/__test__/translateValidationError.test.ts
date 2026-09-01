import { describe, expect, it } from 'vitest'

import {
  mapValidationErrorsToFieldMessages,
  resolveFormErrors,
  translateValidationErrorType,
} from '../translateValidationError'

describe('translateValidationErrorType', () => {
  it('既知のtypeの場合、対応する日本語メッセージを返すこと', () => {
    expect(translateValidationErrorType('string_too_long')).toBe('文字数が多すぎます')
  })

  it('未知のtypeの場合、フォールバックメッセージを返すこと', () => {
    expect(translateValidationErrorType('unknown_type')).toBe('入力内容を確認してください')
  })
})

describe('mapValidationErrorsToFieldMessages', () => {
  const FIELD_KEYS = ['companyName', 'contactName'] as const

  it('locの末尾がフィールドキーに一致する場合、フィールド単位のメッセージを返すこと', () => {
    const items = [
      { loc: ['body', 'companyName'], type: 'string_too_long', msg: 'too long' },
      { loc: ['body', 'contactName'], type: 'missing', msg: 'required' },
    ]

    expect(mapValidationErrorsToFieldMessages(items, FIELD_KEYS)).toEqual({
      companyName: '文字数が多すぎます',
      contactName: '入力してください',
    })
  })

  it('locの末尾がフィールドキーに一致しない場合、そのエラーは無視されること', () => {
    const items = [{ loc: ['body', 'unknownField'], type: 'missing', msg: 'required' }]

    expect(mapValidationErrorsToFieldMessages(items, FIELD_KEYS)).toEqual({})
  })
})

describe('resolveFormErrors', () => {
  const FIELD_KEYS = ['companyName', 'contactName'] as const
  const FALLBACK = '登録に失敗しました'

  const makeAxiosErrorWithDetail = (
    type: string,
    detail: unknown,
  ): Error & { isAxiosError: true; response: { data: { type: string; detail: unknown } } } => {
    return Object.assign(new Error('Request failed'), {
      isAxiosError: true as const,
      response: { data: { type, detail } },
    })
  }

  it('VALIDATION_ERRORでフィールドが特定できる場合、フィールド単位のエラーを返すこと', () => {
    const e = makeAxiosErrorWithDetail('VALIDATION_ERROR', [
      { loc: ['body', 'companyName'], type: 'string_too_long', msg: 'too long' },
    ])

    expect(resolveFormErrors(e, FIELD_KEYS, FALLBACK)).toEqual({
      companyName: '文字数が多すぎます',
    })
  })

  it('VALIDATION_ERRORだがフィールドが特定できない場合、fallbackをcommonとして返すこと', () => {
    const e = makeAxiosErrorWithDetail('VALIDATION_ERROR', [
      { loc: ['body', 'unknownField'], type: 'missing', msg: 'required' },
    ])

    expect(resolveFormErrors(e, FIELD_KEYS, FALLBACK)).toEqual({ common: FALLBACK })
  })

  it('BUSINESS_RULE_ERROR（detailが文字列）の場合、detailをcommonとして返すこと', () => {
    const e = makeAxiosErrorWithDetail('BUSINESS_RULE_ERROR', '既に登録済みの会社です')

    expect(resolveFormErrors(e, FIELD_KEYS, FALLBACK)).toEqual({
      common: '既に登録済みの会社です',
    })
  })
})
