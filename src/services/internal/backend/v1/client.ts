import { config } from '@/core/config'
import { createBaseClient } from '@/services/base/httpClientFactory'
const client = createBaseClient({
  baseURL: `${config.backendUrl}/api/v1`,
  withCredentials: true,
  timeout: 10000,
})

export const internalBackendV1Client = client
