import { beforeEach, describe, expect, it, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'

import { updateDealStatus } from '@/services/internal/backend/v1/deals'
import type { UpdateDealStatusResponse } from '@/services/internal/backend/v1/types/response/deal'

import { useUpdateDealStatusMutation } from '../useUpdateDealStatusMutation'

vi.mock('@/services/internal/backend/v1/deals', () => ({
  updateDealStatus: vi.fn(),
}))

const mockUpdateDealStatus = vi.mocked(updateDealStatus)

const mockResponse: UpdateDealStatusResponse = { dealId: 'deal-1', status: 'closed_won' }

describe('useUpdateDealStatusMutation', () => {
  let queryClient: QueryClient

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  beforeEach(() => {
    vi.clearAllMocks()
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  })

  it('mutateAsyncに渡した引数がdealIdとstatusに分けてupdateDealStatusに渡ること', async () => {
    mockUpdateDealStatus.mockResolvedValueOnce(mockResponse)
    const { result } = renderHook(() => useUpdateDealStatusMutation('customer-1'), { wrapper })

    await result.current.mutateAsync({ dealId: 'deal-1', status: 'closed_won' })

    expect(mockUpdateDealStatus).toHaveBeenCalledWith('deal-1', { status: 'closed_won' })
  })

  it('updateDealStatusが成功した場合、isSuccessになること', async () => {
    mockUpdateDealStatus.mockResolvedValueOnce(mockResponse)
    const { result } = renderHook(() => useUpdateDealStatusMutation('customer-1'), { wrapper })

    await result.current.mutateAsync({ dealId: 'deal-1', status: 'closed_won' })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('成功時、該当customerの詳細クエリがinvalidateされること', async () => {
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    mockUpdateDealStatus.mockResolvedValueOnce(mockResponse)
    const { result } = renderHook(() => useUpdateDealStatusMutation('customer-1'), { wrapper })

    await result.current.mutateAsync({ dealId: 'deal-1', status: 'closed_won' })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['customers', 'customer-1'] })
  })

  it('updateDealStatusが失敗した場合、isErrorになること', async () => {
    mockUpdateDealStatus.mockRejectedValueOnce(new Error('failed'))
    const { result } = renderHook(() => useUpdateDealStatusMutation('customer-1'), { wrapper })

    await expect(
      result.current.mutateAsync({ dealId: 'deal-1', status: 'closed_won' }),
    ).rejects.toThrow('failed')

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
