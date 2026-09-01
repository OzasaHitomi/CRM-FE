import { z } from 'zod'

// crm_be/handlers配下が付与するtype。422はVALIDATION_ERROR/BUSINESS_RULE_ERRORの両方があり得るため、
// ステータスコードだけでは区別できず、この値での判定が必要になる。
export const ERROR_TYPE = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  BUSINESS_RULE_ERROR: 'BUSINESS_RULE_ERROR',
} as const

// VALIDATION_ERROR時、BEはメッセージ文字列ではなくpydanticのerrors()形式（loc/type/msg）を配列で返す。
export const validationErrorItemSchema = z.object({
  loc: z.array(z.union([z.string(), z.number()])),
  type: z.string(),
  msg: z.string(),
})

export const errorResponseSchema = z.object({
  type: z.string().optional(),
  detail: z.union([z.string().min(1), z.array(validationErrorItemSchema).min(1)]),
})

export type ValidationErrorItem = z.infer<typeof validationErrorItemSchema>
export type ErrorResponse = z.infer<typeof errorResponseSchema>
