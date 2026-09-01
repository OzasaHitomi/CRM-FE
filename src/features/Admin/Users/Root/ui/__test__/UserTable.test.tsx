import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { customRender } from '@/tests/helpers/customRender'
import type { GetUsersResponseItem } from '@/services/internal/backend/v1/types/response/admin/user'

import { UserTable } from '../UserTable'

const mockUsers: GetUsersResponseItem[] = [
  {
    userId: 'user-1',
    name: 'Emily Chen',
    email: 'emily.chen@novel.co',
    role: 'admin',
    isActive: true,
  },
  {
    userId: 'user-2',
    name: 'Jamie Lee',
    email: 'jamie.lee@novel.co',
    role: 'sales',
    isActive: false,
  },
]

const renderTable = (overrides?: {
  users?: GetUsersResponseItem[]
  isUpdatingUserStatus?: boolean
}) => {
  const onToggleUserStatus = vi.fn()

  customRender(
    <UserTable
      users={overrides?.users ?? mockUsers}
      isUpdatingUserStatus={overrides?.isUpdatingUserStatus ?? false}
      onToggleUserStatus={onToggleUserStatus}
    />,
  )

  return { onToggleUserStatus }
}

describe('UserTable', () => {
  it('各ユーザーのname/emailを表示すること', () => {
    renderTable()

    expect(screen.getByText('Emily Chen')).toBeInTheDocument()
    expect(screen.getByText('emily.chen@novel.co')).toBeInTheDocument()
    expect(screen.getByText('Jamie Lee')).toBeInTheDocument()
  })

  it('isActive=trueのユーザーはActiveバッジで表示されること', () => {
    renderTable()

    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('isActive=falseのユーザーはInactiveバッジで表示されること', () => {
    renderTable()

    expect(screen.getByText('Inactive')).toBeInTheDocument()
  })

  it('ステータスバッジをクリックすると、onToggleUserStatusがuserIdと現在のisActiveで呼ばれること', async () => {
    const user = userEvent.setup()
    const { onToggleUserStatus } = renderTable()

    await user.click(screen.getByRole('button', { name: 'Active' }))

    expect(onToggleUserStatus).toHaveBeenCalledWith('user-1', true)
  })

  it('isUpdatingUserStatusがtrueの場合、ステータスバッジがdisabledになること', () => {
    renderTable({ isUpdatingUserStatus: true })

    expect(screen.getByRole('button', { name: 'Active' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Inactive' })).toBeDisabled()
  })

  it('usersが空配列の場合、EmptyStateが表示されテーブルが表示されないこと', () => {
    renderTable({ users: [] })

    expect(screen.getByText('No users found')).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })
})
