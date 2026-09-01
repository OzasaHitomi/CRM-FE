import { beforeEach, describe, expect, it, vi } from 'vitest'

import { internalBackendV1Client } from '../client'
import { createActivityLog, updateActivityLog, updateDeal, updateDealStatus } from '../deals'
import type {
  CreateActivityLogRequest,
  UpdateActivityLogRequest,
} from '../types/request/activityLog'
import type { UpdateDealRequest, UpdateDealStatusRequest } from '../types/request/deal'
import type {
  CreateActivityLogResponse,
  UpdateActivityLogResponse,
} from '../types/response/activityLog'
import type { UpdateDealResponse, UpdateDealStatusResponse } from '../types/response/deal'

vi.mock('../client', () => ({
  internalBackendV1Client: {
    post: vi.fn(),
    put: vi.fn(),
  },
}))

const mockClient = vi.mocked(internalBackendV1Client)

describe('deals service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('updateDeal', () => {
    const body: UpdateDealRequest = {
      title: 'Enterprise rollout — 2026',
      amount: 90000,
      plan: 'enterprise',
      licenseCount: 130,
      contractPeriod: 24,
    }
    const mockResponse: UpdateDealResponse = { dealId: 'deal-1', ...body }

    it('正しいエンドポイントとボディで呼ぶこと', async () => {
      mockClient.put.mockResolvedValueOnce({ data: mockResponse })

      await updateDeal('deal-1', body)

      expect(mockClient.put).toHaveBeenCalledWith('/deals/deal-1', body)
    })

    it('パース済みのレスポンスを返すこと', async () => {
      mockClient.put.mockResolvedValueOnce({ data: mockResponse })

      const result = await updateDeal('deal-1', body)

      expect(result).toEqual(mockResponse)
    })
  })

  describe('updateDealStatus', () => {
    const body: UpdateDealStatusRequest = { status: 'closed_won' }
    const mockResponse: UpdateDealStatusResponse = { dealId: 'deal-1', status: 'closed_won' }

    it('正しいエンドポイントとボディで呼ぶこと', async () => {
      mockClient.put.mockResolvedValueOnce({ data: mockResponse })

      await updateDealStatus('deal-1', body)

      expect(mockClient.put).toHaveBeenCalledWith('/deals/deal-1/status', body)
    })

    it('パース済みのレスポンスを返すこと', async () => {
      mockClient.put.mockResolvedValueOnce({ data: mockResponse })

      const result = await updateDealStatus('deal-1', body)

      expect(result).toEqual(mockResponse)
    })
  })

  describe('createActivityLog', () => {
    const body: CreateActivityLogRequest = {
      type: 'call',
      activityDate: new Date(2026, 0, 15),
      note: 'Discovery call',
    }
    const mockResponse: CreateActivityLogResponse = {
      activityLogId: 'log-1',
      type: 'call',
      activityDate: '2026-01-15',
      note: 'Discovery call',
    }

    it('activityDateをYYYY-MM-DD形式に変換してボディに含めること', async () => {
      mockClient.post.mockResolvedValueOnce({ data: mockResponse })

      await createActivityLog('deal-1', body)

      expect(mockClient.post).toHaveBeenCalledWith('/deals/deal-1/activity-logs', {
        type: 'call',
        note: 'Discovery call',
        activityDate: '2026-01-15',
      })
    })

    it('パース済みのレスポンスを返すこと', async () => {
      mockClient.post.mockResolvedValueOnce({ data: mockResponse })

      const result = await createActivityLog('deal-1', body)

      expect(result).toEqual(mockResponse)
    })
  })

  describe('updateActivityLog', () => {
    const body: UpdateActivityLogRequest = {
      type: 'email',
      activityDate: new Date(2026, 0, 20),
      note: null,
    }
    const mockResponse: UpdateActivityLogResponse = {
      activityLogId: 'log-1',
      type: 'email',
      activityDate: '2026-01-20',
      note: null,
    }

    it('activityDateをYYYY-MM-DD形式に変換してボディに含めること', async () => {
      mockClient.put.mockResolvedValueOnce({ data: mockResponse })

      await updateActivityLog('deal-1', 'log-1', body)

      expect(mockClient.put).toHaveBeenCalledWith('/deals/deal-1/activity-logs/log-1', {
        type: 'email',
        note: null,
        activityDate: '2026-01-20',
      })
    })

    it('パース済みのレスポンスを返すこと', async () => {
      mockClient.put.mockResolvedValueOnce({ data: mockResponse })

      const result = await updateActivityLog('deal-1', 'log-1', body)

      expect(result).toEqual(mockResponse)
    })
  })
})
