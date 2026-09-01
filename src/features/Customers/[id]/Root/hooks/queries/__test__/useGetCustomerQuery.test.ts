import { beforeEach, describe, expect, it, vi } from 'vitest'
import { waitFor } from '@testing-library/react'

import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { getCustomer } from '@/services/internal/backend/v1/customers'
import type { GetCustomerResponse } from '@/services/internal/backend/v1/types/response/customer'

import { useGetCustomerQuery } from '../useGetCustomerQuery'

vi.mock('@/services/internal/backend/v1/customers', () => ({
  getCustomer: vi.fn(),
}))

const mockGetCustomer = vi.mocked(getCustomer)

const mockResponse: GetCustomerResponse = {
  customerId: 'customer-1',
  companyName: 'Northwind Logistics',
  industry: 'manufacturing',
  companySize: 850,
  contactName: 'Grace Halvorsen',
  phone: '+1 (415) 555-0182',
  email: 'grace.h@northwind.com',
  assignedUser: null,
  deals: [],
}

describe('useGetCustomerQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('customerIdを引数にgetCustomerが呼ばれること', async () => {
    mockGetCustomer.mockResolvedValueOnce(mockResponse)

    const { result } = customRenderHook(() => useGetCustomerQuery('customer-1'))

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockGetCustomer).toHaveBeenCalledWith('customer-1')
  })

  it('getCustomerが成功した場合、dataに反映されること', async () => {
    mockGetCustomer.mockResolvedValueOnce(mockResponse)

    const { result } = customRenderHook(() => useGetCustomerQuery('customer-1'))

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockResponse)
  })

  it('getCustomerが失敗した場合、isErrorになること', async () => {
    mockGetCustomer.mockRejectedValueOnce(new Error('failed'))

    const { result } = customRenderHook(() => useGetCustomerQuery('customer-1'))

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
