import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'

import { customRender } from '@/tests/helpers/customRender'
import { ErrorPage } from '@/components/pages/ErrorPage'
import { UserTable } from '@/features/Admin/Users/Root/ui/UserTable'
import { CreateUserDialog } from '@/features/Admin/Users/Root/ui/CreateUserDialog'
import type { GetUsersResponseItem } from '@/services/internal/backend/v1/types/response/admin/user'
import type { UserForm, UserFormErrors } from '@/features/Admin/Users/Root/types/userForm'

import { AdminUsersPresentational } from '../AdminUsersPresentational'

vi.mock('@/components/pages/LoadingPage', () => ({
  LoadingPage: () => <div data-testid='loading-page' />,
}))
vi.mock('@/components/pages/ErrorPage', () => ({
  ErrorPage: vi.fn(() => null),
}))
vi.mock('@/features/Admin/Users/Root/ui/UserTable', () => ({
  UserTable: vi.fn(() => null),
}))
vi.mock('@/features/Admin/Users/Root/ui/CreateUserDialog', () => ({
  CreateUserDialog: vi.fn(() => null),
}))

const mockErrorPage = vi.mocked(ErrorPage)
const mockUserTable = vi.mocked(UserTable)
const mockCreateUserDialog = vi.mocked(CreateUserDialog)

const mockUsers: GetUsersResponseItem[] = [
  {
    userId: 'user-1',
    name: 'Emily Chen',
    email: 'emily.chen@novel.co',
    role: 'admin',
    isActive: true,
  },
]

const mockUserForm: UserForm = {
  name: '',
  email: '',
  password: '',
  role: 'sales',
}
const mockErrors: UserFormErrors = {}
const onOpenCreateUserDialog = vi.fn()
const onCloseCreateUserDialog = vi.fn()
const onChangeUserFormField = vi.fn()
const onSubmitCreateUser = vi.fn()
const onToggleUserStatus = vi.fn()

const renderPresentational = (overrides?: {
  users?: GetUsersResponseItem[]
  isLoading?: boolean
  isError?: boolean
  isDialogOpen?: boolean
  isCreatingUser?: boolean
  isUpdatingUserStatus?: boolean
}) => {
  customRender(
    <AdminUsersPresentational
      data={{
        users: overrides?.users ?? mockUsers,
        userForm: mockUserForm,
        errors: mockErrors,
      }}
      uiState={{
        isLoading: overrides?.isLoading ?? false,
        isError: overrides?.isError ?? false,
        isDialogOpen: overrides?.isDialogOpen ?? false,
        isCreatingUser: overrides?.isCreatingUser ?? false,
        isUpdatingUserStatus: overrides?.isUpdatingUserStatus ?? false,
      }}
      handlers={{
        onOpenCreateUserDialog,
        onCloseCreateUserDialog,
        onChangeUserFormField,
        onSubmitCreateUser,
        onToggleUserStatus,
      }}
    />,
  )
}

describe('AdminUsersPresentational', () => {
  it('isLoadingがtrueの場合、LoadingPageを表示すること', () => {
    renderPresentational({ isLoading: true })

    expect(screen.getByTestId('loading-page')).toBeInTheDocument()
  })

  it('isErrorがtrueの場合、ErrorPageにメッセージが渡されること', () => {
    renderPresentational({ isError: true })

    expect(mockErrorPage).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'ユーザー情報の取得に失敗しました。' }),
      undefined,
    )
  })

  it('usersの件数を表示すること', () => {
    renderPresentational({ users: mockUsers })

    expect(screen.getByText('1 users')).toBeInTheDocument()
  })

  it('UserTableへ正しいpropsが渡されること', () => {
    renderPresentational({ users: mockUsers, isUpdatingUserStatus: true })

    expect(mockUserTable).toHaveBeenCalledWith(
      expect.objectContaining({
        users: mockUsers,
        isUpdatingUserStatus: true,
        onToggleUserStatus,
      }),
      undefined,
    )
  })

  it('CreateUserDialogへ正しいpropsが渡されること', () => {
    renderPresentational({ isDialogOpen: true, isCreatingUser: true })

    expect(mockCreateUserDialog).toHaveBeenCalledWith(
      expect.objectContaining({
        isOpen: true,
        userForm: mockUserForm,
        errors: mockErrors,
        isCreatingUser: true,
        onOpen: onOpenCreateUserDialog,
        onClose: onCloseCreateUserDialog,
        onChangeField: onChangeUserFormField,
        onSubmit: onSubmitCreateUser,
      }),
      undefined,
    )
  })
})
