import { beforeEach, describe, expect, it, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'

import { updateActivityLog } from '@/services/internal/backend/v1/deals'
import type { UpdateActivityLogRequest } from '@/services/internal/backend/v1/types/request/activityLog'
import type { UpdateActivityLogResponse } from '@/services/internal/backend/v1/types/response/activityLog'

import { useUpdateActivityLogMutation } from '../useUpdateActivityLogMutation'

vi.mock('@/services/internal/backend/v1/deals', () => ({
  updateActivityLog: vi.fn(),
}))

const mockUpdateActivityLog = vi.mocked(updateActivityLog)

const body: UpdateActivityLogRequest = {
  type: 'email',
  activityDate: new Date(2026, 0, 20),
  note: null,
}

const mockResponse: UpdateActivityLogResponse = {
  activityLogId: 'log-1',
  type: 'email',
  activityDate: '2026-01-20',
  note: null,
}

describe('useUpdateActivityLogMutation', () => {
  let queryClient: QueryClient

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  beforeEach(() => {
    vi.clearAllMocks()
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  })

  it('mutateAsyncに渡した引数がdealId・activityLogId・dataに分けてupdateActivityLogに渡ること', async () => {
    mockUpdateActivityLog.mockResolvedValueOnce(mockResponse)
    const { result } = renderHook(() => useUpdateActivityLogMutation('customer-1'), { wrapper })

    await result.current.mutateAsync({ dealId: 'deal-1', activityLogId: 'log-1', data: body })

    expect(mockUpdateActivityLog).toHaveBeenCalledWith('deal-1', 'log-1', body)
  })

  it('updateActivityLogが成功した場合、isSuccessになること', async () => {
    mockUpdateActivityLog.mockResolvedValueOnce(mockResponse)
    const { result } = renderHook(() => useUpdateActivityLogMutation('customer-1'), { wrapper })

    await result.current.mutateAsync({ dealId: 'deal-1', activityLogId: 'log-1', data: body })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('成功時、該当customerの詳細クエリがinvalidateされること', async () => {
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    mockUpdateActivityLog.mockResolvedValueOnce(mockResponse)
    const { result } = renderHook(() => useUpdateActivityLogMutation('customer-1'), { wrapper })

    await result.current.mutateAsync({ dealId: 'deal-1', activityLogId: 'log-1', data: body })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['customers', 'customer-1'] })
  })

  it('updateActivityLogが失敗した場合、isErrorになること', async () => {
    mockUpdateActivityLog.mockRejectedValueOnce(new Error('failed'))
    const { result } = renderHook(() => useUpdateActivityLogMutation('customer-1'), { wrapper })

    await expect(
      result.current.mutateAsync({ dealId: 'deal-1', activityLogId: 'log-1', data: body }),
    ).rejects.toThrow('failed')

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
