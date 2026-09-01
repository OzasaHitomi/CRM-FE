import { beforeEach, describe, expect, it, vi } from 'vitest'

import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { useGetCustomersQuery } from '@/features/Customers/Root/hooks/queries/useGetCustomersQuery'
import type { GetCustomersResponseItem } from '@/services/internal/backend/v1/types/response/customer'

import { useGetCustomersHandler } from '../useGetCustomersHandler'

vi.mock('@/features/Customers/Root/hooks/queries/useGetCustomersQuery', () => ({
  useGetCustomersQuery: vi.fn(),
}))

const mockUseGetCustomersQuery = vi.mocked(useGetCustomersQuery)

const setup = (overrides: {
  data?: GetCustomersResponseItem[]
  isLoading?: boolean
  isError?: boolean
}) => {
  mockUseGetCustomersQuery.mockReturnValue({
    data: undefined,
    isLoading: false,
    isError: false,
    ...overrides,
  } as ReturnType<typeof useGetCustomersQuery>)
}

describe('useGetCustomersHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('useGetCustomersQueryのdataがdata.customersにそのまま反映されること', () => {
    const mockCustomers: GetCustomersResponseItem[] = [
      {
        customerId: 'customer-1',
        companyName: 'Northwind Logistics',
        industry: 'manufacturing',
        assignedUser: null,
      },
    ]
    setup({ data: mockCustomers })

    const { result } = customRenderHook(() => useGetCustomersHandler())

    expect(result.current.data.customers).toEqual(mockCustomers)
  })

  it('dataがundefinedの場合、data.customersは空配列になること', () => {
    setup({ data: undefined })

    const { result } = customRenderHook(() => useGetCustomersHandler())

    expect(result.current.data.customers).toEqual([])
  })

  it('isLoading/isErrorがそのままuiStateに反映されること', () => {
    setup({ isLoading: true, isError: true })

    const { result } = customRenderHook(() => useGetCustomersHandler())

    expect(result.current.uiState).toEqual({ isLoading: true, isError: true })
  })
})
