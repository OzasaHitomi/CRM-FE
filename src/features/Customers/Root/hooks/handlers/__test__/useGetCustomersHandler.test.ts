import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act } from '@testing-library/react'

import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { useGetCustomersQuery } from '@/features/Customers/Root/hooks/queries/useGetCustomersQuery'
import type { GetCustomersResponse } from '@/services/internal/backend/v1/types/response/customer'

import { useGetCustomersHandler } from '../useGetCustomersHandler'

vi.mock('@/features/Customers/Root/hooks/queries/useGetCustomersQuery', () => ({
  useGetCustomersQuery: vi.fn(),
}))

const mockUseGetCustomersQuery = vi.mocked(useGetCustomersQuery)

const setup = (overrides: {
  data?: GetCustomersResponse
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

  it('useGetCustomersQueryのdataがdata.customers/data.paginationにそのまま反映されること', () => {
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
    setup({ data: mockResponse })

    const { result } = customRenderHook(() => useGetCustomersHandler())

    expect(result.current.data.customers).toEqual(mockResponse.customers)
    expect(result.current.data.pagination).toEqual(mockResponse.pagination)
  })

  it('dataがundefinedの場合、customersは空配列、paginationはデフォルト値になること', () => {
    setup({ data: undefined })

    const { result } = customRenderHook(() => useGetCustomersHandler())

    expect(result.current.data.customers).toEqual([])
    expect(result.current.data.pagination).toEqual({
      page: 1,
      pageSize: 10,
      totalCount: 0,
      totalPages: 0,
    })
  })

  it('isLoading/isErrorがそのままuiStateに反映されること', () => {
    setup({ isLoading: true, isError: true })

    const { result } = customRenderHook(() => useGetCustomersHandler())

    expect(result.current.uiState).toEqual({ isLoading: true, isError: true })
  })

  it('初期状態でuseGetCustomersQueryが1ページ目で呼ばれること', () => {
    setup({})

    customRenderHook(() => useGetCustomersHandler())

    expect(mockUseGetCustomersQuery).toHaveBeenCalledWith(1)
  })

  it('onPageChangeを呼ぶと、useGetCustomersQueryへ渡るpageが変わること', () => {
    setup({})
    const { result } = customRenderHook(() => useGetCustomersHandler())

    act(() => {
      result.current.handlers.onPageChange(2)
    })

    expect(mockUseGetCustomersQuery).toHaveBeenLastCalledWith(2)
  })
})
