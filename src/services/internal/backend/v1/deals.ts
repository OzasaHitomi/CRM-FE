import { internalBackendV1Client } from './client'

import {
  type CreateActivityLogRequest,
  type CreateActivityLogRequestFormatted,
  type UpdateActivityLogRequest,
  type UpdateActivityLogRequestFormatted,
} from './types/request/activityLog'
import { type UpdateDealRequest, type UpdateDealStatusRequest } from './types/request/deal'
import {
  createActivityLogResponseSchema,
  updateActivityLogResponseSchema,
  type CreateActivityLogResponse,
  type UpdateActivityLogResponse,
} from './types/response/activityLog'
import {
  updateDealResponseSchema,
  updateDealStatusResponseSchema,
  type UpdateDealResponse,
  type UpdateDealStatusResponse,
} from './types/response/deal'

const BASE_URL = '/deals'

export const updateDeal = async (
  dealId: string,
  data: UpdateDealRequest,
): Promise<UpdateDealResponse> => {
  const response = await internalBackendV1Client.put<unknown>(`${BASE_URL}/${dealId}`, data)
  return updateDealResponseSchema.parse(response.data)
}

export const updateDealStatus = async (
  dealId: string,
  data: UpdateDealStatusRequest,
): Promise<UpdateDealStatusResponse> => {
  const response = await internalBackendV1Client.put<unknown>(`${BASE_URL}/${dealId}/status`, data)
  return updateDealStatusResponseSchema.parse(response.data)
}

export const createActivityLog = async (
  dealId: string,
  data: CreateActivityLogRequest,
): Promise<CreateActivityLogResponse> => {
  const dataFormatted: CreateActivityLogRequestFormatted = {
    ...data,
    activityDate: data.activityDate.toLocaleDateString('sv-SE'),
  }

  const response = await internalBackendV1Client.post<unknown>(
    `${BASE_URL}/${dealId}/activity-logs`,
    dataFormatted,
  )
  return createActivityLogResponseSchema.parse(response.data)
}

export const updateActivityLog = async (
  dealId: string,
  activityLogId: string,
  data: UpdateActivityLogRequest,
): Promise<UpdateActivityLogResponse> => {
  const dataFormatted: UpdateActivityLogRequestFormatted = {
    ...data,
    activityDate: data.activityDate.toLocaleDateString('sv-SE'),
  }

  const response = await internalBackendV1Client.put<unknown>(
    `${BASE_URL}/${dealId}/activity-logs/${activityLogId}`,
    dataFormatted,
  )
  return updateActivityLogResponseSchema.parse(response.data)
}
