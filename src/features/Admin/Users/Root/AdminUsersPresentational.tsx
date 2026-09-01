import { Flex, Heading, Text } from '@chakra-ui/react'

import { LoadingPage } from '@/components/pages/LoadingPage'
import { ErrorPage } from '@/components/pages/ErrorPage'
import type { GetUsersResponseItem } from '@/services/internal/backend/v1/types/response/admin/user'

import { UserTable } from '@/features/Admin/Users/Root/ui/UserTable'
import { CreateUserDialog } from '@/features/Admin/Users/Root/ui/CreateUserDialog'
import type { UserForm, UserFormErrors } from '@/features/Admin/Users/Root/types/userForm'

type Props = {
  data: {
    users: GetUsersResponseItem[]
    userForm: UserForm
    errors: UserFormErrors
  }
  uiState: {
    isLoading: boolean
    isError: boolean
    isDialogOpen: boolean
    isCreatingUser: boolean
    isUpdatingUserStatus: boolean
  }
  handlers: {
    onOpenCreateUserDialog: () => void
    onCloseCreateUserDialog: () => void
    onChangeUserFormField: <K extends keyof UserForm>(key: K, value: UserForm[K]) => void
    onSubmitCreateUser: () => void
    onToggleUserStatus: (userId: string, currentIsActive: boolean) => void
  }
}

export const AdminUsersPresentational = ({ data, uiState, handlers }: Props) => {
  const { users, userForm, errors } = data
  const { isLoading, isError, isDialogOpen, isCreatingUser, isUpdatingUserStatus } = uiState

  if (isLoading) return <LoadingPage />
  if (isError) return <ErrorPage message='ユーザー情報の取得に失敗しました。' />

  return (
    <>
      <Flex justify='space-between' align='center' mb='1'>
        <Heading size='lg'>Users</Heading>
        <CreateUserDialog
          isOpen={isDialogOpen}
          userForm={userForm}
          errors={errors}
          isCreatingUser={isCreatingUser}
          onOpen={handlers.onOpenCreateUserDialog}
          onClose={handlers.onCloseCreateUserDialog}
          onChangeField={handlers.onChangeUserFormField}
          onSubmit={handlers.onSubmitCreateUser}
        />
      </Flex>
      <Text color='fg.muted' mb='4'>
        {users.length} users
      </Text>

      <UserTable
        users={users}
        isUpdatingUserStatus={isUpdatingUserStatus}
        onToggleUserStatus={handlers.onToggleUserStatus}
      />
    </>
  )
}
