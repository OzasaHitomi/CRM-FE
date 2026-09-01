import { beforeEach, describe, expect, it, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'

import { createDeal } from '@/services/internal/backend/v1/customers'
import type { CreateDealRequest } from '@/services/internal/backend/v1/types/request/deal'
import type { DealResponseItem } from '@/services/internal/backend/v1/types/response/customer'

import { useCreateDealMutation } from '../useCreateDealMutation'

vi.mock('@/services/internal/backend/v1/customers', () => ({
  createDeal: vi.fn(),
}))

const mockCreateDeal = vi.mocked(createDeal)

const body: CreateDealRequest = {
  title: 'Warehouse analytics add-on',
  amount: 18000,
  plan: 'professional',
  licenseCount: 40,
  contractPeriod: 12,
}

const mockResponse: DealResponseItem = {
  dealId: 'deal-1',
  ...body,
  status: 'lead',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  activityLogs: [],
}

describe('useCreateDealMutation', () => {
  let queryClient: QueryClient

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  beforeEach(() => {
    vi.clearAllMocks()
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  })

  it('mutateAsyncに渡した引数がcustomerIdとともにcreateDealに渡ること', async () => {
    mockCreateDeal.mockResolvedValueOnce(mockResponse)
    const { result } = renderHook(() => useCreateDealMutation('customer-1'), { wrapper })

    await result.current.mutateAsync(body)

    expect(mockCreateDeal).toHaveBeenCalledWith('customer-1', body)
  })

  it('createDealが成功した場合、isSuccessになること', async () => {
    mockCreateDeal.mockResolvedValueOnce(mockResponse)
    const { result } = renderHook(() => useCreateDealMutation('customer-1'), { wrapper })

    await result.current.mutateAsync(body)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('成功時、該当customerの詳細クエリがinvalidateされること', async () => {
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    mockCreateDeal.mockResolvedValueOnce(mockResponse)
    const { result } = renderHook(() => useCreateDealMutation('customer-1'), { wrapper })

    await result.current.mutateAsync(body)

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['customers', 'customer-1'] })
  })

  it('createDealが失敗した場合、isErrorになること', async () => {
    mockCreateDeal.mockRejectedValueOnce(new Error('failed'))
    const { result } = renderHook(() => useCreateDealMutation('customer-1'), { wrapper })

    await expect(result.current.mutateAsync(body)).rejects.toThrow('failed')

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
