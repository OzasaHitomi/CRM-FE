import { internalBackendV1Client } from './client'

import {
  type CreateCustomerRequest,
  type GetCustomersRequestQueryParams,
  type UpdateCustomerRequest,
} from './types/request/customer'
import { type CreateDealRequest } from './types/request/deal'
import {
  assignCustomerUserResponseSchema,
  createCustomerResponseSchema,
  dealResponseItemSchema,
  getCustomerResponseSchema,
  getCustomersResponseSchema,
  updateCustomerResponseSchema,
  type AssignCustomerUserResponse,
  type CreateCustomerResponse,
  type DealResponseItem,
  type GetCustomerResponse,
  type GetCustomersResponse,
  type UpdateCustomerResponse,
} from './types/response/customer'

const BASE_URL = '/customers'

// pageは「何ページ目が欲しいか」をクエリパラメータとして送るだけ。
// 1ページの件数(pageSize)はサーバー側で固定されているのでFEからは渡さない。
export const getCustomers = async (
  params?: GetCustomersRequestQueryParams,
): Promise<GetCustomersResponse> => {
  const response = await internalBackendV1Client.get<unknown>(BASE_URL, { params })
  return getCustomersResponseSchema.parse(response.data)
}

export const getCustomer = async (customerId: string): Promise<GetCustomerResponse> => {
  const response = await internalBackendV1Client.get<unknown>(`${BASE_URL}/${customerId}`)
  return getCustomerResponseSchema.parse(response.data)
}

export const createCustomer = async (
  data: CreateCustomerRequest,
): Promise<CreateCustomerResponse> => {
  const response = await internalBackendV1Client.post<unknown>(BASE_URL, data)
  return createCustomerResponseSchema.parse(response.data)
}

export const updateCustomer = async (
  customerId: string,
  data: UpdateCustomerRequest,
): Promise<UpdateCustomerResponse> => {
  const response = await internalBackendV1Client.put<unknown>(`${BASE_URL}/${customerId}`, data)
  return updateCustomerResponseSchema.parse(response.data)
}

export const createDeal = async (
  customerId: string,
  data: CreateDealRequest,
): Promise<DealResponseItem> => {
  const response = await internalBackendV1Client.post<unknown>(
    `${BASE_URL}/${customerId}/deals`,
    data,
  )
  return dealResponseItemSchema.parse(response.data)
}

export const assignCustomerUser = async (
  customerId: string,
): Promise<AssignCustomerUserResponse> => {
  const response = await internalBackendV1Client.put<unknown>(
    `${BASE_URL}/${customerId}/assigned-user`,
  )
  return assignCustomerUserResponseSchema.parse(response.data)
}

export const unassignCustomerUser = async (customerId: string): Promise<void> => {
  await internalBackendV1Client.delete(`${BASE_URL}/${customerId}/assigned-user`)
}
