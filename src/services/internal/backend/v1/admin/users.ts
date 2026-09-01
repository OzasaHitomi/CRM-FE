import { internalBackendV1Client } from '../client'

import { type CreateUserRequest, type UpdateUserStatusRequest } from '../types/request/admin/user'
import {
  createUserResponseSchema,
  getUsersResponseSchema,
  updateUserStatusResponseSchema,
  type CreateUserResponse,
  type GetUsersResponseItem,
  type UpdateUserStatusResponse,
} from '../types/response/admin/user'

const BASE_URL = '/admin/users'

export const getUsers = async (): Promise<GetUsersResponseItem[]> => {
  const response = await internalBackendV1Client.get<unknown>(BASE_URL)
  return getUsersResponseSchema.parse(response.data)
}

export const createUser = async (data: CreateUserRequest): Promise<CreateUserResponse> => {
  const response = await internalBackendV1Client.post<unknown>(BASE_URL, data)
  return createUserResponseSchema.parse(response.data)
}

export const updateUserStatus = async (
  userId: string,
  data: UpdateUserStatusRequest,
): Promise<UpdateUserStatusResponse> => {
  const response = await internalBackendV1Client.put<unknown>(`${BASE_URL}/status/${userId}`, data)
  return updateUserStatusResponseSchema.parse(response.data)
}
