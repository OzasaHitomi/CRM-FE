import { beforeEach, describe, expect, it, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'

import { createCustomer } from '@/services/internal/backend/v1/customers'
import type { CreateCustomerRequest } from '@/services/internal/backend/v1/types/request/customer'
import type { CreateCustomerResponse } from '@/services/internal/backend/v1/types/response/customer'

import { useCreateCustomerMutation } from '../useCreateCustomerMutation'

vi.mock('@/services/internal/backend/v1/customers', () => ({
  createCustomer: vi.fn(),
}))

const mockCreateCustomer = vi.mocked(createCustomer)

const body: CreateCustomerRequest = {
  companyName: 'Cedar & Vine Retail',
  industry: 'retail',
  companySize: 120,
  contactName: 'Jamie Lee',
  phone: '+1 (415) 555-0100',
  email: 'jamie.lee@cedarvine.com',
}

const mockResponse: CreateCustomerResponse = {
  customerId: 'customer-2',
  ...body,
  assignedUser: null,
}

describe('useCreateCustomerMutation', () => {
  let queryClient: QueryClient

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  beforeEach(() => {
    vi.clearAllMocks()
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  })

  it('mutateAsyncに渡した引数がそのままcreateCustomerに渡ること', async () => {
    mockCreateCustomer.mockResolvedValueOnce(mockResponse)
    const { result } = renderHook(() => useCreateCustomerMutation(), { wrapper })

    await result.current.mutateAsync(body)

    // react-query は mutationFn に (variables, context) の2引数を渡すため、第2引数は問わない
    expect(mockCreateCustomer).toHaveBeenCalledWith(body, expect.anything())
  })

  it('createCustomerが成功した場合、isSuccessになること', async () => {
    mockCreateCustomer.mockResolvedValueOnce(mockResponse)
    const { result } = renderHook(() => useCreateCustomerMutation(), { wrapper })

    await result.current.mutateAsync(body)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('成功時、customers一覧クエリがinvalidateされること', async () => {
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    mockCreateCustomer.mockResolvedValueOnce(mockResponse)
    const { result } = renderHook(() => useCreateCustomerMutation(), { wrapper })

    await result.current.mutateAsync(body)

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['customers'] })
  })

  it('createCustomerが失敗した場合、isErrorになること', async () => {
    mockCreateCustomer.mockRejectedValueOnce(new Error('failed'))
    const { result } = renderHook(() => useCreateCustomerMutation(), { wrapper })

    await expect(result.current.mutateAsync(body)).rejects.toThrow('failed')

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
