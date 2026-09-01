import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

import { AdminUsersContainer } from '@/features/Admin/Users/Root/AdminUsersContainer'
import { NotFoundContainer } from '@/features/Error/404/Root/NotFoundContainer'

import { AdminRoute } from '../AdminRoute'

vi.mock('@/features/Admin/Users/Root/AdminUsersContainer', () => ({
  AdminUsersContainer: vi.fn(() => <div data-testid='admin-users-container' />),
}))
vi.mock('@/features/Error/404/Root/NotFoundContainer', () => ({
  NotFoundContainer: vi.fn(() => <div data-testid='not-found-container' />),
}))

const mockAdminUsersContainer = vi.mocked(AdminUsersContainer)
const mockNotFoundContainer = vi.mocked(NotFoundContainer)

const renderAdminRoute = (initialPath: string) => {
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path='/admin/*' element={<AdminRoute />} />
        <Route path='/404' element={<NotFoundContainer />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('AdminRoute', () => {
  it('/admin/usersに、AdminUsersContainerが表示されること', () => {
    renderAdminRoute('/admin/users')

    expect(screen.getByTestId('admin-users-container')).toBeInTheDocument()
    expect(mockAdminUsersContainer).toHaveBeenCalled()
  })

  it('一致しないネストパスは、NotFoundContainerが表示されること', () => {
    renderAdminRoute('/admin/foobar')

    expect(screen.getByTestId('not-found-container')).toBeInTheDocument()
    expect(mockNotFoundContainer).toHaveBeenCalled()
  })
})
