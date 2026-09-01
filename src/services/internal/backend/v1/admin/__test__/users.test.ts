import { beforeEach, describe, expect, it, vi } from 'vitest'

import { internalBackendV1Client } from '../../client'
import { createUser, getUsers, updateUserStatus } from '../users'
import type { CreateUserRequest, UpdateUserStatusRequest } from '../../types/request/admin/user'
import type {
  CreateUserResponse,
  GetUsersResponseItem,
  UpdateUserStatusResponse,
} from '../../types/response/admin/user'

vi.mock('../../client', () => ({
  internalBackendV1Client: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}))

const mockClient = vi.mocked(internalBackendV1Client)

describe('admin users service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getUsers', () => {
    const mockResponse: GetUsersResponseItem[] = [
      {
        userId: 'user-1',
        name: 'Emily Chen',
        email: 'emily.chen@novel.co',
        role: 'sales',
        isActive: true,
      },
    ]

    it('正しいエンドポイントを呼ぶこと', async () => {
      mockClient.get.mockResolvedValueOnce({ data: mockResponse })

      await getUsers()

      expect(mockClient.get).toHaveBeenCalledWith('/admin/users')
    })

    it('パース済みのレスポンスを返すこと', async () => {
      mockClient.get.mockResolvedValueOnce({ data: mockResponse })

      const result = await getUsers()

      expect(result).toEqual(mockResponse)
    })
  })

  describe('createUser', () => {
    const body: CreateUserRequest = {
      name: 'Priya Nair',
      email: 'priya.nair@novel.co',
      password: 'password',
      role: 'sales',
    }
    const mockResponse: CreateUserResponse = {
      userId: 'user-2',
      name: body.name,
      email: body.email,
      role: body.role,
    }

    it('正しいエンドポイントとボディで呼ぶこと', async () => {
      mockClient.post.mockResolvedValueOnce({ data: mockResponse })

      await createUser(body)

      expect(mockClient.post).toHaveBeenCalledWith('/admin/users', body)
    })

    it('パース済みのレスポンスを返すこと', async () => {
      mockClient.post.mockResolvedValueOnce({ data: mockResponse })

      const result = await createUser(body)

      expect(result).toEqual(mockResponse)
    })
  })

  describe('updateUserStatus', () => {
    const body: UpdateUserStatusRequest = { isActive: false }
    const mockResponse: UpdateUserStatusResponse = { userId: 'user-2', isActive: false }

    it('正しいエンドポイントとボディで呼ぶこと', async () => {
      mockClient.put.mockResolvedValueOnce({ data: mockResponse })

      await updateUserStatus('user-2', body)

      expect(mockClient.put).toHaveBeenCalledWith('/admin/users/status/user-2', body)
    })

    it('パース済みのレスポンスを返すこと', async () => {
      mockClient.put.mockResolvedValueOnce({ data: mockResponse })

      const result = await updateUserStatus('user-2', body)

      expect(result).toEqual(mockResponse)
    })
  })
})
