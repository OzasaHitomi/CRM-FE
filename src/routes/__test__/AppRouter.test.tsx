import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Outlet } from 'react-router-dom'

import { LoginContainer } from '@/features/Login/Root/LoginContainer'
import { ForbiddenContainer } from '@/features/Error/403/Root/ForbiddenContainer'
import { NotFoundContainer } from '@/features/Error/404/Root/NotFoundContainer'
import { AppLayout } from '@/components/templates/AppLayout'
import { RequireAuth } from '@/routes/RequireAuth'

import { AppRouter } from '../AppRouter'

vi.mock('@/features/Login/Root/LoginContainer', () => ({
  LoginContainer: vi.fn(() => <div data-testid='login-container' />),
}))
vi.mock('@/features/Error/403/Root/ForbiddenContainer', () => ({
  ForbiddenContainer: vi.fn(() => <div data-testid='forbidden-container' />),
}))
vi.mock('@/features/Error/404/Root/NotFoundContainer', () => ({
  NotFoundContainer: vi.fn(() => <div data-testid='not-found-container' />),
}))
vi.mock('@/components/templates/AppLayout', () => ({
  AppLayout: vi.fn(() => <Outlet />),
}))
vi.mock('@/routes/customers/CustomersRoute', () => ({
  CustomersRoute: vi.fn(() => <div data-testid='customers-route' />),
}))
vi.mock('@/routes/admin/AdminRoute', () => ({
  AdminRoute: vi.fn(() => <div data-testid='admin-route' />),
}))
vi.mock('@/routes/RequireAuth', () => ({
  RequireAuth: vi.fn(() => <Outlet />),
}))

const mockLoginContainer = vi.mocked(LoginContainer)
const mockForbiddenContainer = vi.mocked(ForbiddenContainer)
const mockNotFoundContainer = vi.mocked(NotFoundContainer)
const mockAppLayout = vi.mocked(AppLayout)
const mockRequireAuth = vi.mocked(RequireAuth)

const renderAppRouter = (initialPath: string) => {
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AppRouter />
    </MemoryRouter>,
  )
}

describe('AppRouter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('/loginパスに、LoginContainerが表示されること', () => {
    renderAppRouter('/login')

    expect(screen.getByTestId('login-container')).toBeInTheDocument()
    expect(mockLoginContainer).toHaveBeenCalled()
  })

  it('/403パスに、ForbiddenContainerが表示されること', () => {
    renderAppRouter('/403')

    expect(screen.getByTestId('forbidden-container')).toBeInTheDocument()
    expect(mockForbiddenContainer).toHaveBeenCalled()
  })

  it('/404パスに、NotFoundContainerが表示されること', () => {
    renderAppRouter('/404')

    expect(screen.getByTestId('not-found-container')).toBeInTheDocument()
    expect(mockNotFoundContainer).toHaveBeenCalled()
  })

  it('どのルートにも一致しないパスは、/404へreplaceでリダイレクトされること', () => {
    renderAppRouter('/this-page-does-not-exist')

    expect(screen.getByTestId('not-found-container')).toBeInTheDocument()
  })

  it('/パスは、/customersへreplaceでリダイレクトされること', () => {
    renderAppRouter('/')

    expect(screen.getByTestId('customers-route')).toBeInTheDocument()
  })

  it('/customers配下は、RequireAuth（expectedRolesなし）→AppLayoutの入れ子で保護されていること', () => {
    renderAppRouter('/customers')

    expect(mockRequireAuth).toHaveBeenCalledWith(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- expect.not.objectContaining's型がanyになるため
      expect.not.objectContaining({ expectedRoles: expect.anything() }),
      undefined,
    )
    expect(mockAppLayout).toHaveBeenCalled()
    expect(screen.getByTestId('customers-route')).toBeInTheDocument()
  })

  it("/admin配下は、RequireAuth（expectedRoles=['admin']）→AppLayoutの入れ子で保護されていること", () => {
    renderAppRouter('/admin/users')

    expect(mockRequireAuth).toHaveBeenCalledWith(
      expect.objectContaining({ expectedRoles: ['admin'] }),
      undefined,
    )
    expect(mockAppLayout).toHaveBeenCalled()
    expect(screen.getByTestId('admin-route')).toBeInTheDocument()
  })
})
