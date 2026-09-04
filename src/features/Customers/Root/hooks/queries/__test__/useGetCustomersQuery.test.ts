import { beforeEach, describe, expect, it, vi } from 'vitest'
import { waitFor } from '@testing-library/react'

import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { getCustomers } from '@/services/internal/backend/v1/customers'
import type { GetCustomersResponse } from '@/services/internal/backend/v1/types/response/customer'

import { useGetCustomersQuery } from '../useGetCustomersQuery'

vi.mock('@/services/internal/backend/v1/customers', () => ({
  getCustomers: vi.fn(),
}))

const mockGetCustomers = vi.mocked(getCustomers)

describe('useGetCustomersQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getCustomersが成功した場合、dataに反映されること', async () => {
    const mockResponse: GetCustomersResponse = {
      customers: [
        {
          customerId: 'customer-1',
          companyName: 'Northwind Logistics',
          industry: 'manufacturing',
          assignedUser: null,
        },
      ],
      pagination: { page: 1, pageSize: 10, totalCount: 1, totalPages: 1 },
    }
    mockGetCustomers.mockResolvedValueOnce(mockResponse)

    const { result } = customRenderHook(() => useGetCustomersQuery({ page: 1 }))

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockResponse)
  })

  it('paramsを渡すと、getCustomersへそのまま渡ること', async () => {
    const mockResponse: GetCustomersResponse = {
      customers: [],
      pagination: { page: 2, pageSize: 10, totalCount: 0, totalPages: 0 },
    }
    mockGetCustomers.mockResolvedValueOnce(mockResponse)

    const { result } = customRenderHook(() =>
      useGetCustomersQuery({ page: 2, industry: 'finance' }),
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockGetCustomers).toHaveBeenCalledWith({ page: 2, industry: 'finance' })
  })

  it('getCustomersが失敗した場合、isErrorになること', async () => {
    mockGetCustomers.mockRejectedValueOnce(new Error('failed'))

    const { result } = customRenderHook(() => useGetCustomersQuery({ page: 1 }))

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
