import { beforeEach, describe, expect, it, vi } from 'vitest'

import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { useGetMeQuery } from '@/share/hooks/queries/useGetMeQuery'
import type { MeResponse } from '@/services/internal/backend/v1/types/response/auth'

import { useGetMeHandler } from '../useGetMeHandler'

vi.mock('@/share/hooks/queries/useGetMeQuery', () => ({
  useGetMeQuery: vi.fn(),
}))

const mockUseGetMeQuery = vi.mocked(useGetMeQuery)

describe('useGetMeHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('meがある場合、userName・roleLabel・roleがmeの内容から算出されること', () => {
    const mockMe: MeResponse = { userId: 'user-1', role: 'admin', name: 'Alex Morgan' }
    mockUseGetMeQuery.mockReturnValue({ data: mockMe } as ReturnType<typeof useGetMeQuery>)

    const { result } = customRenderHook(() => useGetMeHandler())

    expect(result.current.data).toEqual({
      userName: 'Alex Morgan',
      roleLabel: 'Admin',
      role: 'admin',
    })
  })

  it('meが未取得の場合、userName/roleLabelは空文字、roleは"sales"になること', () => {
    mockUseGetMeQuery.mockReturnValue({ data: undefined } as ReturnType<typeof useGetMeQuery>)

    const { result } = customRenderHook(() => useGetMeHandler())

    expect(result.current.data).toEqual({
      userName: '',
      roleLabel: '',
      role: 'sales',
    })
  })
})
