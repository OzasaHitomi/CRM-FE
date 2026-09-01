import { extractErrorMessage, parseErrorResponse } from '@/share/logic/extractErrorMessage'

import type { ValidationErrorItem } from '@/services/internal/backend/v1/types/response/error'

// pydanticのerrors()が返すtype一覧に対応。未知のtypeはBEの実装詳細（EmailStrの内部エラー文言等）を
// そのまま画面に出さず、FALLBACK_MESSAGEに寄せる。
const VALIDATION_ERROR_MESSAGES: Record<string, string> = {
  missing: '入力してください',
  string_too_short: '文字数が足りません',
  string_too_long: '文字数が多すぎます',
  greater_than: '値が小さすぎます',
  greater_than_equal: '値が小さすぎます',
  less_than: '値が大きすぎます',
  less_than_equal: '値が大きすぎます',
  int_parsing: '数値で入力してください',
  float_parsing: '数値で入力してください',
  bool_parsing: '正しい値を選択してください',
  enum: '選択した値が正しくありません',
  password_byte_length: 'パスワードが長すぎます',
}

const FALLBACK_MESSAGE = '入力内容を確認してください'

export const translateValidationErrorType = (type: string): string =>
  VALIDATION_ERROR_MESSAGES[type] ?? FALLBACK_MESSAGE

// FastAPIのlocは ['body', 'companyName'] のように位置情報+フィールド名の形になるため、末尾を取る
const getFieldKeyFromLoc = (loc: ValidationErrorItem['loc']): string | undefined => {
  const last = loc[loc.length - 1]
  return typeof last === 'string' ? last : undefined
}

export const mapValidationErrorsToFieldMessages = <K extends string>(
  items: ValidationErrorItem[],
  fieldKeys: readonly K[],
): Partial<Record<K, string>> => {
  const messages: Partial<Record<K, string>> = {}
  for (const item of items) {
    const key = getFieldKeyFromLoc(item.loc)
    if (key !== undefined && (fieldKeys as readonly string[]).includes(key)) {
      messages[key as K] = translateValidationErrorType(item.type)
    }
  }
  return messages
}

/**
 * フォーム送信失敗時のエラーを解決する。
 * BEのVALIDATION_ERRORでフィールドが特定できた場合はフィールド単位のエラーに、
 * それ以外（BUSINESS_RULE_ERRORや未知のtype、ネットワークエラー等）はcommonにフォールバックする。
 */
export const resolveFormErrors = <K extends string>(
  e: unknown,
  fieldKeys: readonly K[],
  fallback: string,
): Partial<Record<K, string>> & { common?: string } => {
  const parsed = parseErrorResponse(e)
  if (parsed && Array.isArray(parsed.detail)) {
    const fieldErrors = mapValidationErrorsToFieldMessages(parsed.detail, fieldKeys)
    if (Object.keys(fieldErrors).length > 0) return fieldErrors
  }
  return { common: extractErrorMessage(e, fallback) } as Partial<Record<K, string>> & {
    common?: string
  }
}
