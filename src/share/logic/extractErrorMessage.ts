import axios from 'axios'

import {
  errorResponseSchema,
  type ErrorResponse,
} from '@/services/internal/backend/v1/types/response/error'

/**
 * BEのErrorResponse契約に沿ったレスポンスであれば type/detail をそのまま返す。
 * 422はVALIDATION_ERROR/BUSINESS_RULE_ERRORの両方があり得るため、typeで区別したい場合に使う。
 */
export const parseErrorResponse = (e: unknown): ErrorResponse | undefined => {
  if (!axios.isAxiosError(e)) return undefined
  const result = errorResponseSchema.safeParse(e.response?.data)
  return result.success ? result.data : undefined
}

export const extractErrorMessage = (e: unknown, fallback: string): string => {
  const parsed = parseErrorResponse(e)
  if (parsed) return typeof parsed.detail === 'string' ? parsed.detail : fallback
  if (axios.isAxiosError(e)) return e.message
  if (e instanceof Error) return e.message
  return fallback
}
