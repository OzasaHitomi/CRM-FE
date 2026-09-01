import { beforeEach, describe, expect, it, vi } from 'vitest'

import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { useGetCustomerQuery } from '@/features/Customers/[id]/Root/hooks/queries/useGetCustomerQuery'
import type { GetCustomerResponse } from '@/services/internal/backend/v1/types/response/customer'

import { useGetCustomerHandler } from '../useGetCustomerHandler'

vi.mock('@/features/Customers/[id]/Root/hooks/queries/useGetCustomerQuery', () => ({
  useGetCustomerQuery: vi.fn(),
}))

const mockUseGetCustomerQuery = vi.mocked(useGetCustomerQuery)

const mockCustomer: GetCustomerResponse = {
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

const setup = (overrides: {
  data?: GetCustomerResponse
  isLoading?: boolean
  isError?: boolean
}) => {
  mockUseGetCustomerQuery.mockReturnValue({
    data: undefined,
    isLoading: false,
    isError: false,
    ...overrides,
  } as ReturnType<typeof useGetCustomerQuery>)
}

describe('useGetCustomerHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('customerIdをuseGetCustomerQueryにそのまま渡すこと', () => {
    setup({})

    customRenderHook(() => useGetCustomerHandler('customer-1'))

    expect(mockUseGetCustomerQuery).toHaveBeenCalledWith('customer-1')
  })

  it('useGetCustomerQueryのdataがdata.customerにそのまま反映されること', () => {
    setup({ data: mockCustomer })

    const { result } = customRenderHook(() => useGetCustomerHandler('customer-1'))

    expect(result.current.data.customer).toEqual(mockCustomer)
  })

  it('isLoading/isErrorがそのままuiStateに反映されること', () => {
    setup({ isLoading: true, isError: true })

    const { result } = customRenderHook(() => useGetCustomerHandler('customer-1'))

    expect(result.current.uiState).toEqual({ isLoading: true, isError: true })
  })
})
