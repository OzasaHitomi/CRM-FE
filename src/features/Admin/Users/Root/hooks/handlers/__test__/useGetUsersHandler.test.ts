import { beforeEach, describe, expect, it, vi } from 'vitest'

import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { useGetUsersQuery } from '@/features/Admin/Users/Root/hooks/queries/useGetUsersQuery'
import type { GetUsersResponseItem } from '@/services/internal/backend/v1/types/response/admin/user'

import { useGetUsersHandler } from '../useGetUsersHandler'

vi.mock('@/features/Admin/Users/Root/hooks/queries/useGetUsersQuery', () => ({
  useGetUsersQuery: vi.fn(),
}))

const mockUseGetUsersQuery = vi.mocked(useGetUsersQuery)

const setup = (overrides: {
  data?: GetUsersResponseItem[]
  isLoading?: boolean
  isError?: boolean
}) => {
  mockUseGetUsersQuery.mockReturnValue({
    data: undefined,
    isLoading: false,
    isError: false,
    ...overrides,
  } as ReturnType<typeof useGetUsersQuery>)
}

describe('useGetUsersHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('useGetUsersQueryのdataがdata.usersにそのまま反映されること', () => {
    const mockUsers: GetUsersResponseItem[] = [
      {
        userId: 'user-1',
        name: 'Emily Chen',
        email: 'emily.chen@novel.co',
        role: 'sales',
        isActive: true,
      },
    ]
    setup({ data: mockUsers })

    const { result } = customRenderHook(() => useGetUsersHandler())

    expect(result.current.data.users).toEqual(mockUsers)
  })

  it('dataがundefinedの場合、data.usersは空配列になること', () => {
    setup({ data: undefined })

    const { result } = customRenderHook(() => useGetUsersHandler())

    expect(result.current.data.users).toEqual([])
  })

  it('isLoading/isErrorがそのままuiStateに反映されること', () => {
    setup({ isLoading: true, isError: true })

    const { result } = customRenderHook(() => useGetUsersHandler())

    expect(result.current.uiState).toEqual({ isLoading: true, isError: true })
  })
})
