import { beforeEach, describe, expect, it, vi } from 'vitest'
import { waitFor } from '@testing-library/react'

import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { getMe } from '@/services/internal/backend/v1/auth'
import type { MeResponse } from '@/services/internal/backend/v1/types/response/auth'

import { useGetMeQuery } from '../useGetMeQuery'

vi.mock('@/services/internal/backend/v1/auth', () => ({
  getMe: vi.fn(),
}))

const mockGetMe = vi.mocked(getMe)

describe('useGetMeQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getMeが成功した場合、dataに反映されること', async () => {
    const mockResponse: MeResponse = { userId: 'user-1', role: 'admin', name: 'Alex Morgan' }
    mockGetMe.mockResolvedValueOnce(mockResponse)

    const { result } = customRenderHook(() => useGetMeQuery())

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockResponse)
  })

  it('getMeが失敗した場合、isErrorになること', async () => {
    mockGetMe.mockRejectedValueOnce(new Error('Unauthorized'))

    const { result } = customRenderHook(() => useGetMeQuery())

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
