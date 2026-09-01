import { beforeEach, describe, expect, it, vi } from 'vitest'
import { waitFor } from '@testing-library/react'

import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { getUsers } from '@/services/internal/backend/v1/admin/users'
import type { GetUsersResponseItem } from '@/services/internal/backend/v1/types/response/admin/user'

import { useGetUsersQuery } from '../useGetUsersQuery'

vi.mock('@/services/internal/backend/v1/admin/users', () => ({
  getUsers: vi.fn(),
}))

const mockGetUsers = vi.mocked(getUsers)

describe('useGetUsersQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getUsersが成功した場合、dataに反映されること', async () => {
    const mockResponse: GetUsersResponseItem[] = [
      {
        userId: 'user-1',
        name: 'Emily Chen',
        email: 'emily.chen@novel.co',
        role: 'sales',
        isActive: true,
      },
    ]
    mockGetUsers.mockResolvedValueOnce(mockResponse)

    const { result } = customRenderHook(() => useGetUsersQuery())

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockResponse)
  })

  it('getUsersが失敗した場合、isErrorになること', async () => {
    mockGetUsers.mockRejectedValueOnce(new Error('failed'))

    const { result } = customRenderHook(() => useGetUsersQuery())

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
