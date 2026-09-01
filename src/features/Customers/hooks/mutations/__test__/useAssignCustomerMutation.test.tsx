import { beforeEach, describe, expect, it, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'

import { assignCustomerUser } from '@/services/internal/backend/v1/customers'
import type { AssignCustomerUserResponse } from '@/services/internal/backend/v1/types/response/customer'

import { useAssignCustomerMutation } from '../useAssignCustomerMutation'

vi.mock('@/services/internal/backend/v1/customers', () => ({
  assignCustomerUser: vi.fn(),
}))

const mockAssignCustomerUser = vi.mocked(assignCustomerUser)

const mockResponse: AssignCustomerUserResponse = {
  customerId: 'customer-1',
  assignedUser: { userId: 'user-1', name: 'Emily Chen' },
}

describe('useAssignCustomerMutation', () => {
  let queryClient: QueryClient

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  beforeEach(() => {
    vi.clearAllMocks()
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  })

  it('mutateAsyncに渡した引数がそのままassignCustomerUserに渡ること', async () => {
    mockAssignCustomerUser.mockResolvedValueOnce(mockResponse)
    const { result } = renderHook(() => useAssignCustomerMutation(), { wrapper })

    await result.current.mutateAsync('customer-1')

    expect(mockAssignCustomerUser).toHaveBeenCalledWith('customer-1', expect.anything())
  })

  it('assignCustomerUserが成功した場合、isSuccessになること', async () => {
    mockAssignCustomerUser.mockResolvedValueOnce(mockResponse)
    const { result } = renderHook(() => useAssignCustomerMutation(), { wrapper })

    await result.current.mutateAsync('customer-1')

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('成功時、customers一覧クエリがinvalidateされること', async () => {
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    mockAssignCustomerUser.mockResolvedValueOnce(mockResponse)
    const { result } = renderHook(() => useAssignCustomerMutation(), { wrapper })

    await result.current.mutateAsync('customer-1')

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['customers'] })
  })

  it('assignCustomerUserが失敗した場合、isErrorになること', async () => {
    mockAssignCustomerUser.mockRejectedValueOnce(new Error('failed'))
    const { result } = renderHook(() => useAssignCustomerMutation(), { wrapper })

    await expect(result.current.mutateAsync('customer-1')).rejects.toThrow('failed')

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
