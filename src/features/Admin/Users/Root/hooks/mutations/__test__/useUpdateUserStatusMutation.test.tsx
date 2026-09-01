import { beforeEach, describe, expect, it, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'

import { updateUserStatus } from '@/services/internal/backend/v1/admin/users'
import type { UpdateUserStatusResponse } from '@/services/internal/backend/v1/types/response/admin/user'

import { useUpdateUserStatusMutation } from '../useUpdateUserStatusMutation'

vi.mock('@/services/internal/backend/v1/admin/users', () => ({
  updateUserStatus: vi.fn(),
}))

const mockUpdateUserStatus = vi.mocked(updateUserStatus)

const mockResponse: UpdateUserStatusResponse = { userId: 'user-2', isActive: false }

describe('useUpdateUserStatusMutation', () => {
  let queryClient: QueryClient

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  beforeEach(() => {
    vi.clearAllMocks()
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  })

  it('mutateAsyncに渡した引数がそのままupdateUserStatusに渡ること', async () => {
    mockUpdateUserStatus.mockResolvedValueOnce(mockResponse)
    const { result } = renderHook(() => useUpdateUserStatusMutation(), { wrapper })

    await result.current.mutateAsync({ userId: 'user-2', data: { isActive: false } })

    expect(mockUpdateUserStatus).toHaveBeenCalledWith('user-2', { isActive: false })
  })

  it('updateUserStatusが成功した場合、isSuccessになること', async () => {
    mockUpdateUserStatus.mockResolvedValueOnce(mockResponse)
    const { result } = renderHook(() => useUpdateUserStatusMutation(), { wrapper })

    await result.current.mutateAsync({ userId: 'user-2', data: { isActive: false } })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('成功時、adminUsers一覧クエリがinvalidateされること', async () => {
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    mockUpdateUserStatus.mockResolvedValueOnce(mockResponse)
    const { result } = renderHook(() => useUpdateUserStatusMutation(), { wrapper })

    await result.current.mutateAsync({ userId: 'user-2', data: { isActive: false } })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['adminUsers'] })
  })

  it('updateUserStatusが失敗した場合、isErrorになること', async () => {
    mockUpdateUserStatus.mockRejectedValueOnce(new Error('failed'))
    const { result } = renderHook(() => useUpdateUserStatusMutation(), { wrapper })

    await expect(
      result.current.mutateAsync({ userId: 'user-2', data: { isActive: false } }),
    ).rejects.toThrow('failed')

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
