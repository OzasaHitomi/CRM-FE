import { AdminUsersPresentational } from '@/features/Admin/Users/Root/AdminUsersPresentational'
import { useGetUsersHandler } from '@/features/Admin/Users/Root/hooks/handlers/useGetUsersHandler'
import { useCreateUserHandler } from '@/features/Admin/Users/Root/hooks/handlers/useCreateUserHandler'
import { useUpdateUserStatusHandler } from '@/features/Admin/Users/Root/hooks/handlers/useUpdateUserStatusHandler'

export const AdminUsersContainer = () => {
  const getUsersHandler = useGetUsersHandler()
  const createUserHandler = useCreateUserHandler()
  const updateUserStatusHandler = useUpdateUserStatusHandler()

  return (
    <>
      <AdminUsersPresentational
        data={{ ...getUsersHandler.data, ...createUserHandler.data }}
        uiState={{
          ...getUsersHandler.uiState,
          ...createUserHandler.uiState,
          ...updateUserStatusHandler.uiState,
        }}
        handlers={{
          ...createUserHandler.handlers,
          ...updateUserStatusHandler.handlers,
        }}
      />
    </>
  )
}
