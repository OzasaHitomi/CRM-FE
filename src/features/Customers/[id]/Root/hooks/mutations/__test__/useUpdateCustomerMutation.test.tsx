import { beforeEach, describe, expect, it, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'

import { updateCustomer } from '@/services/internal/backend/v1/customers'
import type { UpdateCustomerRequest } from '@/services/internal/backend/v1/types/request/customer'
import type { UpdateCustomerResponse } from '@/services/internal/backend/v1/types/response/customer'

import { useUpdateCustomerMutation } from '../useUpdateCustomerMutation'

vi.mock('@/services/internal/backend/v1/customers', () => ({
  updateCustomer: vi.fn(),
}))

const mockUpdateCustomer = vi.mocked(updateCustomer)

const body: UpdateCustomerRequest = {
  companyName: 'Cedar & Vine Retail',
  industry: 'retail',
  companySize: 130,
  contactName: 'Jamie Lee',
  phone: '+1 (415) 555-0100',
  email: 'jamie.lee@cedarvine.com',
}

const mockResponse: UpdateCustomerResponse = {
  customerId: 'customer-1',
  ...body,
  assignedUser: null,
}

describe('useUpdateCustomerMutation', () => {
  let queryClient: QueryClient

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  beforeEach(() => {
    vi.clearAllMocks()
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  })

  it('mutateAsyncに渡した引数がそのままupdateCustomerに渡ること', async () => {
    mockUpdateCustomer.mockResolvedValueOnce(mockResponse)
    const { result } = renderHook(() => useUpdateCustomerMutation(), { wrapper })

    await result.current.mutateAsync({ customerId: 'customer-1', data: body })

    expect(mockUpdateCustomer).toHaveBeenCalledWith('customer-1', body)
  })

  it('updateCustomerが成功した場合、isSuccessになること', async () => {
    mockUpdateCustomer.mockResolvedValueOnce(mockResponse)
    const { result } = renderHook(() => useUpdateCustomerMutation(), { wrapper })

    await result.current.mutateAsync({ customerId: 'customer-1', data: body })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('成功時、customers関連クエリがinvalidateされること', async () => {
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    mockUpdateCustomer.mockResolvedValueOnce(mockResponse)
    const { result } = renderHook(() => useUpdateCustomerMutation(), { wrapper })

    await result.current.mutateAsync({ customerId: 'customer-1', data: body })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['customers'] })
  })

  it('updateCustomerが失敗した場合、isErrorになること', async () => {
    mockUpdateCustomer.mockRejectedValueOnce(new Error('failed'))
    const { result } = renderHook(() => useUpdateCustomerMutation(), { wrapper })

    await expect(
      result.current.mutateAsync({ customerId: 'customer-1', data: body }),
    ).rejects.toThrow('failed')

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
