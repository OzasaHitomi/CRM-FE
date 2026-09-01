import { beforeEach, describe, expect, it, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'

import { unassignCustomerUser } from '@/services/internal/backend/v1/customers'

import { useUnassignCustomerMutation } from '../useUnassignCustomerMutation'

vi.mock('@/services/internal/backend/v1/customers', () => ({
  unassignCustomerUser: vi.fn(),
}))

const mockUnassignCustomerUser = vi.mocked(unassignCustomerUser)

describe('useUnassignCustomerMutation', () => {
  let queryClient: QueryClient

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  beforeEach(() => {
    vi.clearAllMocks()
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  })

  it('mutateAsyncに渡した引数がそのままunassignCustomerUserに渡ること', async () => {
    mockUnassignCustomerUser.mockResolvedValueOnce(undefined)
    const { result } = renderHook(() => useUnassignCustomerMutation(), { wrapper })

    await result.current.mutateAsync('customer-1')

    expect(mockUnassignCustomerUser).toHaveBeenCalledWith('customer-1', expect.anything())
  })

  it('unassignCustomerUserが成功した場合、isSuccessになること', async () => {
    mockUnassignCustomerUser.mockResolvedValueOnce(undefined)
    const { result } = renderHook(() => useUnassignCustomerMutation(), { wrapper })

    await result.current.mutateAsync('customer-1')

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('成功時、customers一覧クエリがinvalidateされること', async () => {
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    mockUnassignCustomerUser.mockResolvedValueOnce(undefined)
    const { result } = renderHook(() => useUnassignCustomerMutation(), { wrapper })

    await result.current.mutateAsync('customer-1')

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['customers'] })
  })

  it('unassignCustomerUserが失敗した場合、isErrorになること', async () => {
    mockUnassignCustomerUser.mockRejectedValueOnce(new Error('failed'))
    const { result } = renderHook(() => useUnassignCustomerMutation(), { wrapper })

    await expect(result.current.mutateAsync('customer-1')).rejects.toThrow('failed')

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
