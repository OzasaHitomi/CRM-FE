import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, screen } from '@testing-library/react'

import { customRender } from '@/tests/helpers/customRender'
import { FormField } from '@/components/molecules/FormField'

import { LoginPresentational } from '../LoginPresentational'
import type { LoginErrors, LoginForm } from '../types/loginForm'

vi.mock('@/components/molecules/FormField', () => ({
  FormField: vi.fn(() => null),
}))

const mockFormField = vi.mocked(FormField)

beforeEach(() => {
  vi.clearAllMocks()
})

const renderPresentational = (overrides?: {
  loginForm?: LoginForm
  errors?: LoginErrors
  isPending?: boolean
}) => {
  const onSubmitLogin = vi.fn()
  const onChangeLoginFormField = vi.fn()

  customRender(
    <LoginPresentational
      data={{
        loginForm: overrides?.loginForm ?? { email: '', password: '' },
        errors: overrides?.errors ?? {},
      }}
      uiState={{ isPending: overrides?.isPending ?? false }}
      handlers={{ onSubmitLogin, onChangeLoginFormField }}
    />,
  )

  return { onSubmitLogin, onChangeLoginFormField }
}

const getFormFieldProps = (label: 'Email' | 'Password') => {
  const call = mockFormField.mock.calls.find(([props]) => props.label === label)
  if (!call) throw new Error(`FormField(label="${label}") is not rendered`)
  return call[0]
}

describe('LoginPresentational', () => {
  it('EmailのFormFieldに正しいpropsが渡されること', () => {
    renderPresentational({
      loginForm: { email: 'test@example.com', password: '' },
      errors: { email: 'メールアドレスを入力してください' },
    })

    expect(getFormFieldProps('Email')).toEqual(
      expect.objectContaining({
        type: 'email',
        value: 'test@example.com',
        errorMessage: 'メールアドレスを入力してください',
      }),
    )
  })

  it('PasswordのFormFieldに正しいpropsが渡されること', () => {
    renderPresentational({
      loginForm: { email: '', password: 'password' },
      errors: { password: 'パスワードを入力してください' },
    })

    expect(getFormFieldProps('Password')).toEqual(
      expect.objectContaining({
        type: 'password',
        value: 'password',
        errorMessage: 'パスワードを入力してください',
      }),
    )
  })

  it('EmailのFormFieldのonChangeを呼ぶと、onChangeLoginFormFieldが("email", 値)で呼ばれること', () => {
    const { onChangeLoginFormField } = renderPresentational()

    getFormFieldProps('Email').onChange('a')

    expect(onChangeLoginFormField).toHaveBeenCalledWith('email', 'a')
  })

  it('PasswordのFormFieldのonChangeを呼ぶと、onChangeLoginFormFieldが("password", 値)で呼ばれること', () => {
    const { onChangeLoginFormField } = renderPresentational()

    getFormFieldProps('Password').onChange('b')

    expect(onChangeLoginFormField).toHaveBeenCalledWith('password', 'b')
  })

  it('errors.commonが指定されている場合、共通エラーメッセージを表示すること', () => {
    renderPresentational({ errors: { common: 'ログインに失敗しました' } })

    expect(screen.getByText('ログインに失敗しました')).toBeInTheDocument()
  })

  it('errors.commonが未指定の場合、共通エラーメッセージを表示しないこと', () => {
    renderPresentational()

    expect(screen.queryByText('ログインに失敗しました')).not.toBeInTheDocument()
  })

  it('isPendingがtrueの場合、送信ボタンがloading状態になること', () => {
    renderPresentational({ isPending: true })

    // ローディング中はChakraのButtonがラベルをアクセシビリティツリーから隠すため、
    // name指定ではなく唯一のbuttonとして取得する
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('フォームをsubmitするとonSubmitLoginが呼ばれること', () => {
    const { onSubmitLogin } = renderPresentational()

    const form = screen.getByRole('button', { name: 'Log in' }).closest('form')

    fireEvent.submit(form!)

    expect(onSubmitLogin).toHaveBeenCalled()
  })
})
