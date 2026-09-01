import { internalBackendV1Client } from './client'

import { healthcheckResponseSchema, type HealthcheckResponse } from './types/response/healthcheck'

const BASE_URL = '/healthcheck'

export const getHealthcheck = async (): Promise<HealthcheckResponse> => {
  const response = await internalBackendV1Client.get<unknown>(BASE_URL)
  return healthcheckResponseSchema.parse(response.data)
}
