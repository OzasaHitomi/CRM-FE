import { beforeEach, describe, expect, it, vi } from 'vitest'

import { internalBackendV1Client } from '../client'
import { getHealthcheck } from '../healthcheck'
import type { HealthcheckResponse } from '../types/response/healthcheck'

vi.mock('../client', () => ({
  internalBackendV1Client: {
    get: vi.fn(),
  },
}))

const mockClient = vi.mocked(internalBackendV1Client)

describe('healthcheck service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getHealthcheck', () => {
    const mockResponse: HealthcheckResponse = { status: 'ok' }

    it('正しいエンドポイントを呼ぶこと', async () => {
      mockClient.get.mockResolvedValueOnce({ data: mockResponse })

      await getHealthcheck()

      expect(mockClient.get).toHaveBeenCalledWith('/healthcheck')
    })

    it('パース済みのレスポンスを返すこと', async () => {
      mockClient.get.mockResolvedValueOnce({ data: mockResponse })

      const result = await getHealthcheck()

      expect(result).toEqual(mockResponse)
    })
  })
})
