import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'

import { customRender } from '@/tests/helpers/customRender'
import { AppHeader } from '@/components/organisms/AppHeader'
import { Sidebar } from '@/components/organisms/Sidebar'

import { AppLayout } from '../AppLayout'
import { useGetMeHandler } from '../hooks/handlers/useGetMeHandler'
import { useLogoutHandler } from '../hooks/handlers/useLogoutHandler'

vi.mock('../hooks/handlers/useGetMeHandler', () => ({
  useGetMeHandler: vi.fn(),
}))
vi.mock('../hooks/handlers/useLogoutHandler', () => ({
  useLogoutHandler: vi.fn(),
}))
vi.mock('@/components/organisms/AppHeader', () => ({
  AppHeader: vi.fn(() => null),
}))
vi.mock('@/components/organisms/Sidebar', () => ({
  Sidebar: vi.fn(() => null),
}))
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, Outlet: () => <div data-testid='outlet' /> }
})

const mockUseGetMeHandler = vi.mocked(useGetMeHandler)
const mockUseLogoutHandler = vi.mocked(useLogoutHandler)
const mockAppHeader = vi.mocked(AppHeader)
const mockSidebar = vi.mocked(Sidebar)
const onLogout = vi.fn()

const setupHandler = (data: {
  userName: string
  roleLabel: string
  role: 'admin' | 'manager' | 'sales'
}) => {
  mockUseGetMeHandler.mockReturnValue({ data })
  mockUseLogoutHandler.mockReturnValue({
    handlers: { onLogout },
  })
}

describe('AppLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('useGetMeHandlerのuserName・roleLabelがAppHeaderへそのまま渡されること', () => {
    setupHandler({ userName: 'Alex Morgan', roleLabel: 'Admin', role: 'admin' })

    customRender(<AppLayout />)

    expect(mockAppHeader).toHaveBeenCalledWith(
      expect.objectContaining({ userName: 'Alex Morgan', roleLabel: 'Admin' }),
      undefined,
    )
  })

  it('AppHeaderのonLogoutを呼ぶと、handlers.onLogoutが呼ばれること', () => {
    setupHandler({ userName: 'Alex Morgan', roleLabel: 'Admin', role: 'admin' })

    customRender(<AppLayout />)

    const onLogoutProp = mockAppHeader.mock.calls[0]?.[0].onLogout
    onLogoutProp()

    expect(onLogout).toHaveBeenCalled()
  })

  it('useGetMeHandlerのroleがSidebarのroleへそのまま渡されること', () => {
    setupHandler({ userName: 'Jordan Blake', roleLabel: 'Manager', role: 'manager' })

    customRender(<AppLayout />)

    expect(mockSidebar).toHaveBeenCalledWith(
      expect.objectContaining({ role: 'manager' }),
      undefined,
    )
  })

  it('Outlet（子ルート）が描画されること', () => {
    setupHandler({ userName: '', roleLabel: '', role: 'sales' })

    customRender(<AppLayout />)

    expect(screen.getByTestId('outlet')).toBeInTheDocument()
  })
})
