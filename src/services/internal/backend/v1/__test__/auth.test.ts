import { beforeEach, describe, expect, it, vi } from 'vitest'

import { internalBackendV1Client } from '../client'
import { getMe, login, logout } from '../auth'
import type { LoginRequest } from '../types/request/auth'
import type { MeResponse } from '../types/response/auth'

vi.mock('../client', () => ({
  internalBackendV1Client: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

const mockClient = vi.mocked(internalBackendV1Client)

describe('auth service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getMe', () => {
    const mockResponse: MeResponse = { userId: 'user-1', role: 'admin', name: 'Alex Morgan' }

    it('正しいエンドポイントを呼ぶこと', async () => {
      mockClient.get.mockResolvedValueOnce({ data: mockResponse })

      await getMe()

      expect(mockClient.get).toHaveBeenCalledWith('/auth/me')
    })

    it('パース済みのレスポンスを返すこと', async () => {
      mockClient.get.mockResolvedValueOnce({ data: mockResponse })

      const result = await getMe()

      expect(result).toEqual(mockResponse)
    })
  })

  describe('login', () => {
    const body: LoginRequest = { email: 'test@example.com', password: 'password' }

    it('正しいエンドポイントとボディで呼ぶこと', async () => {
      mockClient.post.mockResolvedValueOnce({ data: undefined })

      await login(body)

      expect(mockClient.post).toHaveBeenCalledWith('/auth/login', body)
    })
  })

  describe('logout', () => {
    it('正しいエンドポイントを呼ぶこと', async () => {
      mockClient.post.mockResolvedValueOnce({ data: undefined })

      await logout()

      expect(mockClient.post).toHaveBeenCalledWith('/auth/logout')
    })
  })
})
