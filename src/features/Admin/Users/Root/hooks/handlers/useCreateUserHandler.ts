import { useState } from 'react'
import { flattenError } from 'zod'

import { toaster } from '@/components/ui/toaster'
import { extractErrorMessage } from '@/share/logic/extractErrorMessage'

import { useCreateUserMutation } from '@/features/Admin/Users/Root/hooks/mutations/useCreateUserMutation'
import {
  userFormSchema,
  type UserForm,
  type UserFormErrors,
} from '@/features/Admin/Users/Root/types/userForm'
import type { CreateUserRequest } from '@/services/internal/backend/v1/types/request/admin/user'

const INITIAL_USER_FORM: UserForm = {
  name: '',
  email: '',
  password: '',
  role: 'sales',
}

export const useCreateUserHandler = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [userForm, setUserForm] = useState<UserForm>(INITIAL_USER_FORM)
  const [errors, setErrors] = useState<UserFormErrors>({})

  const createUserMutation = useCreateUserMutation()

  const onOpenCreateUserDialog = () => {
    setIsDialogOpen(true)
  }

  const onCloseCreateUserDialog = () => {
    setIsDialogOpen(false)
    setUserForm(INITIAL_USER_FORM)
    setErrors({})
  }

  const onChangeUserFormField = <K extends keyof UserForm>(key: K, value: UserForm[K]) => {
    setUserForm((prev) => ({ ...prev, [key]: value }))
  }

  const onSubmitCreateUser = async () => {
    const result = userFormSchema.safeParse(userForm)
    if (!result.success) {
      const fieldErrors = flattenError(result.error).fieldErrors
      setErrors({
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
        role: fieldErrors.role?.[0],
      })
      return
    }
    setErrors({})

    const request: CreateUserRequest = result.data

    try {
      await createUserMutation.mutateAsync(request)
      onCloseCreateUserDialog()
      toaster.create({
        type: 'success',
        description: 'ユーザーを登録しました',
      })
    } catch (e) {
      setErrors({ common: extractErrorMessage(e, 'ユーザーの登録に失敗しました') })
    }
  }

  return {
    data: { userForm, errors },
    uiState: { isDialogOpen, isCreatingUser: createUserMutation.isPending },
    handlers: {
      onOpenCreateUserDialog,
      onCloseCreateUserDialog,
      onChangeUserFormField,
      onSubmitCreateUser,
    },
  }
}
