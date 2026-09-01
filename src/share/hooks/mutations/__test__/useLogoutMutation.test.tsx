import { beforeEach, describe, expect, it, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'

import { logout } from '@/services/internal/backend/v1/auth'
import { useLogoutMutation } from '../useLogoutMutation'

vi.mock('@/services/internal/backend/v1/auth', () => ({
  logout: vi.fn(),
}))

const mockLogout = vi.mocked(logout)

describe('useLogoutMutation', () => {
  let queryClient: QueryClient

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  beforeEach(() => {
    vi.clearAllMocks()
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  })

  it('mutateAsyncを呼ぶとlogoutが呼ばれること', async () => {
    mockLogout.mockResolvedValueOnce(undefined)
    const { result } = renderHook(() => useLogoutMutation(), { wrapper })

    await result.current.mutateAsync()

    expect(mockLogout).toHaveBeenCalled()
  })

  it('logoutが成功した場合、isSuccessになること', async () => {
    mockLogout.mockResolvedValueOnce(undefined)
    const { result } = renderHook(() => useLogoutMutation(), { wrapper })

    await result.current.mutateAsync()

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('logout成功後、ユーザー固有の全キャッシュが削除されること', async () => {
    queryClient.setQueryData(['me'], {
      userId: 'user-1',
      role: 'admin',
      name: 'Alex Morgan',
    })
    queryClient.setQueryData(['customers'], [{ customerId: 'customer-1' }])
    queryClient.setQueryData(['customers', 'customer-1'], { customerId: 'customer-1' })
    mockLogout.mockResolvedValueOnce(undefined)
    const { result } = renderHook(() => useLogoutMutation(), { wrapper })

    await result.current.mutateAsync()

    expect(queryClient.getQueryCache().getAll()).toHaveLength(0)
  })

  it('logoutが失敗した場合、isErrorになること', async () => {
    mockLogout.mockRejectedValueOnce(new Error('failed'))
    const { result } = renderHook(() => useLogoutMutation(), { wrapper })

    await expect(result.current.mutateAsync()).rejects.toThrow('failed')

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
