import { beforeEach, describe, expect, it, vi } from 'vitest'

import { customRender } from '@/tests/helpers/customRender'
import { useGetUsersHandler } from '@/features/Admin/Users/Root/hooks/handlers/useGetUsersHandler'
import { useCreateUserHandler } from '@/features/Admin/Users/Root/hooks/handlers/useCreateUserHandler'
import { useUpdateUserStatusHandler } from '@/features/Admin/Users/Root/hooks/handlers/useUpdateUserStatusHandler'
import type { UserForm } from '@/features/Admin/Users/Root/types/userForm'

import { AdminUsersContainer } from '../AdminUsersContainer'

vi.mock('@/features/Admin/Users/Root/AdminUsersPresentational', () => ({
  AdminUsersPresentational: vi.fn(() => null),
}))
vi.mock('@/features/Admin/Users/Root/hooks/handlers/useGetUsersHandler', () => ({
  useGetUsersHandler: vi.fn(),
}))
vi.mock('@/features/Admin/Users/Root/hooks/handlers/useCreateUserHandler', () => ({
  useCreateUserHandler: vi.fn(),
}))
vi.mock('@/features/Admin/Users/Root/hooks/handlers/useUpdateUserStatusHandler', () => ({
  useUpdateUserStatusHandler: vi.fn(),
}))

import { AdminUsersPresentational } from '@/features/Admin/Users/Root/AdminUsersPresentational'

const mockUseGetUsersHandler = vi.mocked(useGetUsersHandler)
const mockUseCreateUserHandler = vi.mocked(useCreateUserHandler)
const mockUseUpdateUserStatusHandler = vi.mocked(useUpdateUserStatusHandler)
const mockAdminUsersPresentational = vi.mocked(AdminUsersPresentational)

const mockUserForm: UserForm = {
  name: '',
  email: '',
  password: '',
  role: 'sales',
}

const mockGetData = { users: [] }
const mockGetUiState = { isLoading: false, isError: false }
const mockCreateData = { userForm: mockUserForm, errors: {} }
const mockCreateUiState = { isDialogOpen: false, isCreatingUser: false }
const mockCreateHandlers = {
  onOpenCreateUserDialog: vi.fn(),
  onCloseCreateUserDialog: vi.fn(),
  onChangeUserFormField: vi.fn(),
  onSubmitCreateUser: vi.fn(),
}
const mockUpdateStatusUiState = { isUpdatingUserStatus: false }
const mockUpdateStatusHandlers = { onToggleUserStatus: vi.fn() }

describe('AdminUsersContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseGetUsersHandler.mockReturnValue({ data: mockGetData, uiState: mockGetUiState })
    mockUseCreateUserHandler.mockReturnValue({
      data: mockCreateData,
      uiState: mockCreateUiState,
      handlers: mockCreateHandlers,
    })
    mockUseUpdateUserStatusHandler.mockReturnValue({
      uiState: mockUpdateStatusUiState,
      handlers: mockUpdateStatusHandlers,
    })
  })

  it('3つのhandlerのdataがマージされて渡されること', () => {
    customRender(<AdminUsersContainer />)

    expect(mockAdminUsersPresentational).toHaveBeenCalledWith(
      expect.objectContaining({ data: { ...mockGetData, ...mockCreateData } }),
      undefined,
    )
  })

  it('3つのhandlerのuiStateがマージされて渡されること', () => {
    customRender(<AdminUsersContainer />)

    expect(mockAdminUsersPresentational).toHaveBeenCalledWith(
      expect.objectContaining({
        uiState: { ...mockGetUiState, ...mockCreateUiState, ...mockUpdateStatusUiState },
      }),
      undefined,
    )
  })

  it('createUserHandlerとupdateUserStatusHandlerのhandlersがマージされて渡されること', () => {
    customRender(<AdminUsersContainer />)

    expect(mockAdminUsersPresentational).toHaveBeenCalledWith(
      expect.objectContaining({
        handlers: { ...mockCreateHandlers, ...mockUpdateStatusHandlers },
      }),
      undefined,
    )
  })
})
