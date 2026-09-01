import { describe, expect, it } from 'vitest'

import { ERROR_TYPE } from '@/services/internal/backend/v1/types/response/error'

import { extractErrorMessage, parseErrorResponse } from '../extractErrorMessage'

const FALLBACK = 'フォールバックメッセージ'

const makeAxiosError = (
  detail?: unknown,
  message = 'Request failed',
): Error & { isAxiosError: true; response: { data: { detail?: unknown } } } => {
  return Object.assign(new Error(message), {
    isAxiosError: true as const,
    response: { data: { detail } },
  })
}

const makeAxiosErrorWithType = (
  type: string,
  detail: string,
): Error & { isAxiosError: true; response: { data: { type: string; detail: string } } } => {
  return Object.assign(new Error('Request failed'), {
    isAxiosError: true as const,
    response: { data: { type, detail } },
  })
}

const VALIDATION_ERROR_DETAIL = [
  { loc: ['body', 'email'], type: 'string_type', msg: 'Input should be a valid string' },
]

const makeAxiosErrorWithValidationDetail = (
  detail: unknown,
): Error & { isAxiosError: true; response: { data: { type: string; detail: unknown } } } => {
  return Object.assign(new Error('Request failed'), {
    isAxiosError: true as const,
    response: { data: { type: 'VALIDATION_ERROR', detail } },
  })
}

describe('extractErrorMessage', () => {
  it('AxiosError かつ detail が文字列の場合、detail を返すこと', () => {
    const e = makeAxiosError('認証が必要です。')

    expect(extractErrorMessage(e, FALLBACK)).toBe('認証が必要です。')
  })

  it('AxiosError かつ detail がスキーマに一致しない場合、e.message を返すこと', () => {
    const e = makeAxiosError([{ field: 'email', message: 'Field required' }], 'Bad Request')

    expect(extractErrorMessage(e, FALLBACK)).toBe('Bad Request')
  })

  it('AxiosError かつ detail が空文字の場合、e.message を返すこと', () => {
    const e = makeAxiosError('', 'Request failed')

    expect(extractErrorMessage(e, FALLBACK)).toBe('Request failed')
  })

  it('AxiosError かつ type付きのレスポンス（BusinessException/ValidationError形式）の場合、detail を返すこと', () => {
    const e = makeAxiosErrorWithType('VALIDATION_ERROR', '不正なリクエストです。')

    expect(extractErrorMessage(e, FALLBACK)).toBe('不正なリクエストです。')
  })

  it('AxiosError かつ detail がバリデーションエラー配列（loc/type形式）の場合、fallback を返すこと', () => {
    const e = makeAxiosErrorWithValidationDetail(VALIDATION_ERROR_DETAIL)

    expect(extractErrorMessage(e, FALLBACK)).toBe(FALLBACK)
  })

  it('AxiosError かつ response が undefined の場合、e.message を返すこと', () => {
    const e = Object.assign(new Error('Network Error'), {
      isAxiosError: true as const,
      response: undefined,
    })

    expect(extractErrorMessage(e, FALLBACK)).toBe('Network Error')
  })

  it('通常の Error の場合、e.message を返すこと', () => {
    const e = new Error('通常エラー')

    expect(extractErrorMessage(e, FALLBACK)).toBe('通常エラー')
  })

  it('文字列が throw された場合、fallback を返すこと', () => {
    expect(extractErrorMessage('unexpected', FALLBACK)).toBe(FALLBACK)
  })

  it('null が throw された場合、fallback を返すこと', () => {
    expect(extractErrorMessage(null, FALLBACK)).toBe(FALLBACK)
  })

  it('undefined が throw された場合、fallback を返すこと', () => {
    expect(extractErrorMessage(undefined, FALLBACK)).toBe(FALLBACK)
  })
})

describe('parseErrorResponse', () => {
  it('422でtype=VALIDATION_ERRORの場合、typeとdetailをそのまま返すこと', () => {
    const e = makeAxiosErrorWithType('VALIDATION_ERROR', '不正なリクエストです。')

    expect(parseErrorResponse(e)).toEqual({
      type: ERROR_TYPE.VALIDATION_ERROR,
      detail: '不正なリクエストです。',
    })
  })

  it('422でtype=BUSINESS_RULE_ERRORの場合、typeとdetailをそのまま返すこと', () => {
    const e = makeAxiosErrorWithType('BUSINESS_RULE_ERROR', '既に登録済みの会社です')

    expect(parseErrorResponse(e)).toEqual({
      type: ERROR_TYPE.BUSINESS_RULE_ERROR,
      detail: '既に登録済みの会社です',
    })
  })

  it('typeが無い場合（404/403/401等）、typeはundefinedのままdetailを返すこと', () => {
    const e = makeAxiosError('customerが見つかりません')

    expect(parseErrorResponse(e)).toEqual({ type: undefined, detail: 'customerが見つかりません' })
  })

  it('AxiosErrorでない場合、undefinedを返すこと', () => {
    expect(parseErrorResponse(new Error('通常エラー'))).toBeUndefined()
  })

  it('スキーマに一致しない場合、undefinedを返すこと', () => {
    const e = makeAxiosError([{ field: 'email', message: 'Field required' }])

    expect(parseErrorResponse(e)).toBeUndefined()
  })

  it('422でtype=VALIDATION_ERRORかつdetailがloc/type配列の場合、配列をそのまま返すこと', () => {
    const e = makeAxiosErrorWithValidationDetail(VALIDATION_ERROR_DETAIL)

    expect(parseErrorResponse(e)).toEqual({
      type: ERROR_TYPE.VALIDATION_ERROR,
      detail: VALIDATION_ERROR_DETAIL,
    })
  })
})
