import { internalBackendV1Client } from './client'

import { type LoginRequest } from './types/request/auth'
import { meResponseSchema, type MeResponse } from './types/response/auth'

const BASE_URL = '/auth'

export const getMe = async (): Promise<MeResponse> => {
  const response = await internalBackendV1Client.get<unknown>(`${BASE_URL}/me`)
  return meResponseSchema.parse(response.data)
}

export const login = async (data: LoginRequest): Promise<void> => {
  await internalBackendV1Client.post(`${BASE_URL}/login`, data)
}

export const logout = async (): Promise<void> => {
  await internalBackendV1Client.post(`${BASE_URL}/logout`)
}
