import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { flattenError } from 'zod'

import { extractErrorMessage } from '@/share/logic/extractErrorMessage'

import { useLoginMutation } from '@/features/Login/Root/hooks/mutations/useLoginMutation'
import {
  loginFormSchema,
  type LoginErrors,
  type LoginForm,
} from '@/features/Login/Root/types/loginForm'
import type { LoginRequest } from '@/services/internal/backend/v1/types/request/auth'

const INITIAL_LOGIN_FORM: LoginForm = {
  email: '',
  password: '',
}

export const useLoginMutationHandler = () => {
  const [loginForm, setLoginForm] = useState<LoginForm>(INITIAL_LOGIN_FORM)
  const [errors, setErrors] = useState<LoginErrors>({})

  const loginMutation = useLoginMutation()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const onChangeLoginFormField = <K extends keyof LoginForm>(key: K, value: LoginForm[K]) => {
    setLoginForm((prev) => ({ ...prev, [key]: value }))
  }

  const onSubmitLogin = async () => {
    const result = loginFormSchema.safeParse(loginForm)
    if (!result.success) {
      const fieldErrors = flattenError(result.error).fieldErrors
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      })
      return
    }
    setErrors({})

    const loginRequest: LoginRequest = {
      email: result.data.email,
      password: result.data.password,
    }

    try {
      await loginMutation.mutateAsync(loginRequest)
      queryClient.clear()
      void navigate('/customers')
    } catch (e) {
      setErrors({ common: extractErrorMessage(e, 'ログインに失敗しました') })
    }
  }

  return {
    data: { loginForm, errors },
    uiState: { isPending: loginMutation.isPending },
    handlers: { onSubmitLogin, onChangeLoginFormField },
  }
}
