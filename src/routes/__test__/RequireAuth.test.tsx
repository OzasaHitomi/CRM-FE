import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { Navigate } from 'react-router-dom'

import { customRender } from '@/tests/helpers/customRender'
import { useGetMeQuery } from '@/share/hooks/queries/useGetMeQuery'
import type { MeResponse } from '@/services/internal/backend/v1/types/response/auth'

import { RequireAuth } from '../RequireAuth'

vi.mock('@/share/hooks/queries/useGetMeQuery', () => ({
  useGetMeQuery: vi.fn(),
}))

vi.mock('@/components/pages/LoadingPage', () => ({
  LoadingPage: () => <div data-testid='loading-page'>Loading</div>,
}))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return {
    ...actual,
    Navigate: vi.fn(() => <div data-testid='navigate' />),
    Outlet: vi.fn(() => <div data-testid='outlet' />),
  }
})

const mockUseGetMeQuery = vi.mocked(useGetMeQuery)
const mockNavigate = vi.mocked(Navigate)

const setupGetMeQuery = (overrides: {
  isLoading?: boolean
  isError?: boolean
  data?: MeResponse
}) => {
  mockUseGetMeQuery.mockReturnValue({
    isLoading: false,
    isError: false,
    data: undefined,
    ...overrides,
  } as ReturnType<typeof useGetMeQuery>)
}

describe('RequireAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('isLoading中はLoadingPageを表示すること', () => {
    setupGetMeQuery({ isLoading: true })

    customRender(<RequireAuth />)

    expect(screen.getByTestId('loading-page')).toBeInTheDocument()
  })

  it('未ログイン（isError）の場合、/loginへNavigateすること', () => {
    setupGetMeQuery({ isError: true })

    customRender(<RequireAuth />)

    expect(mockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({ to: '/login', replace: true }),
      undefined,
    )
  })

  it('ログイン済みでexpectedRolesが未指定の場合、Outletを表示すること', () => {
    setupGetMeQuery({ data: { userId: 'user-1', role: 'sales', name: 'Emily Chen' } })

    customRender(<RequireAuth />)

    expect(screen.getByTestId('outlet')).toBeInTheDocument()
  })

  it('ログイン済みだがexpectedRolesに含まれないroleの場合、/403へNavigateすること', () => {
    setupGetMeQuery({ data: { userId: 'user-1', role: 'sales', name: 'Emily Chen' } })

    customRender(<RequireAuth expectedRoles={['admin']} />)

    expect(mockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({ to: '/403', replace: true }),
      undefined,
    )
  })

  it('ログイン済みでexpectedRolesに含まれるroleの場合、Outletを表示すること', () => {
    setupGetMeQuery({ data: { userId: 'user-1', role: 'admin', name: 'Alex Morgan' } })

    customRender(<RequireAuth expectedRoles={['admin']} />)

    expect(screen.getByTestId('outlet')).toBeInTheDocument()
  })
})
