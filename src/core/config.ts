import { z } from 'zod'

// 型作成
const envSchema = z.object({
  VITE_BACKEND_URL: z.url(),
})

// 環境変数の検証
const env = envSchema.parse(import.meta.env)

// 環境変数をエクスポート
export const config = {
  backendUrl: env.VITE_BACKEND_URL,
}
