import { beforeEach, describe, expect, it, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'

import { createActivityLog } from '@/services/internal/backend/v1/deals'
import type { CreateActivityLogRequest } from '@/services/internal/backend/v1/types/request/activityLog'
import type { CreateActivityLogResponse } from '@/services/internal/backend/v1/types/response/activityLog'

import { useCreateActivityLogMutation } from '../useCreateActivityLogMutation'

vi.mock('@/services/internal/backend/v1/deals', () => ({
  createActivityLog: vi.fn(),
}))

const mockCreateActivityLog = vi.mocked(createActivityLog)

const body: CreateActivityLogRequest = {
  type: 'call',
  activityDate: new Date(2026, 0, 10),
  note: 'Discovery call',
}

const mockResponse: CreateActivityLogResponse = {
  activityLogId: 'log-1',
  type: 'call',
  activityDate: '2026-01-10',
  note: 'Discovery call',
}

describe('useCreateActivityLogMutation', () => {
  let queryClient: QueryClient

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  beforeEach(() => {
    vi.clearAllMocks()
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  })

  it('mutateAsyncに渡した引数がdealIdとdataに分けてcreateActivityLogに渡ること', async () => {
    mockCreateActivityLog.mockResolvedValueOnce(mockResponse)
    const { result } = renderHook(() => useCreateActivityLogMutation('customer-1'), { wrapper })

    await result.current.mutateAsync({ dealId: 'deal-1', data: body })

    expect(mockCreateActivityLog).toHaveBeenCalledWith('deal-1', body)
  })

  it('createActivityLogが成功した場合、isSuccessになること', async () => {
    mockCreateActivityLog.mockResolvedValueOnce(mockResponse)
    const { result } = renderHook(() => useCreateActivityLogMutation('customer-1'), { wrapper })

    await result.current.mutateAsync({ dealId: 'deal-1', data: body })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('成功時、該当customerの詳細クエリがinvalidateされること', async () => {
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    mockCreateActivityLog.mockResolvedValueOnce(mockResponse)
    const { result } = renderHook(() => useCreateActivityLogMutation('customer-1'), { wrapper })

    await result.current.mutateAsync({ dealId: 'deal-1', data: body })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['customers', 'customer-1'] })
  })

  it('createActivityLogが失敗した場合、isErrorになること', async () => {
    mockCreateActivityLog.mockRejectedValueOnce(new Error('failed'))
    const { result } = renderHook(() => useCreateActivityLogMutation('customer-1'), { wrapper })

    await expect(result.current.mutateAsync({ dealId: 'deal-1', data: body })).rejects.toThrow(
      'failed',
    )

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
