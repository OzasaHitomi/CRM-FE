import { describe, expect, it, vi } from 'vitest'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { customRender } from '@/tests/helpers/customRender'
import type { UserForm, UserFormErrors } from '@/features/Admin/Users/Root/types/userForm'

import { CreateUserDialog } from '../CreateUserDialog'

const mockUserForm: UserForm = {
  name: 'Jamie Lee',
  email: 'jamie.lee@novel.co',
  password: 'password',
  role: 'sales',
}

const renderDialog = (overrides?: {
  isOpen?: boolean
  errors?: UserFormErrors
  isCreatingUser?: boolean
}) => {
  const onOpen = vi.fn()
  const onClose = vi.fn()
  const onChangeField = vi.fn()
  const onSubmit = vi.fn()

  customRender(
    <CreateUserDialog
      isOpen={overrides?.isOpen ?? true}
      userForm={mockUserForm}
      errors={overrides?.errors ?? {}}
      isCreatingUser={overrides?.isCreatingUser ?? false}
      onOpen={onOpen}
      onClose={onClose}
      onChangeField={onChangeField}
      onSubmit={onSubmit}
    />,
  )

  return { onOpen, onClose, onChangeField, onSubmit }
}

describe('CreateUserDialog', () => {
  it('+ Add UserボタンをクリックするとonOpenが呼ばれること', async () => {
    const user = userEvent.setup()
    const { onOpen } = renderDialog({ isOpen: false })

    await user.click(screen.getByRole('button', { name: '+ Add User' }))

    expect(onOpen).toHaveBeenCalled()
  })

  it('isOpenがtrueの場合、フォーム内容が表示されること', () => {
    renderDialog({ isOpen: true })

    expect(screen.getByLabelText('Name')).toBeInTheDocument()
  })

  it('isOpenがfalseの場合、フォーム内容が表示されないこと', () => {
    renderDialog({ isOpen: false })

    expect(screen.queryByLabelText('Name')).not.toBeInTheDocument()
  })

  it('userFormの各値が入力欄に反映されていること', () => {
    renderDialog()

    expect(screen.getByLabelText('Name')).toHaveValue('Jamie Lee')
    expect(screen.getByLabelText('Email')).toHaveValue('jamie.lee@novel.co')
    expect(screen.getByLabelText('Password')).toHaveValue('password')
    expect(screen.getByLabelText('Role')).toHaveValue('sales')
  })

  it('Nameを変更すると、onChangeFieldが("name", 値)で呼ばれること', async () => {
    const user = userEvent.setup()
    const { onChangeField } = renderDialog()

    await user.type(screen.getByLabelText('Name'), 'X')

    expect(onChangeField).toHaveBeenCalledWith('name', expect.any(String))
  })

  it('Roleのselectを変更すると、onChangeFieldが("role", 値)で呼ばれること', async () => {
    const user = userEvent.setup()
    const { onChangeField } = renderDialog()

    await user.selectOptions(screen.getByLabelText('Role'), 'admin')

    expect(onChangeField).toHaveBeenCalledWith('role', 'admin')
  })

  it('Emailを変更すると、onChangeFieldが("email", 値)で呼ばれること', async () => {
    const user = userEvent.setup()
    const { onChangeField } = renderDialog()

    await user.type(screen.getByLabelText('Email'), 'X')

    expect(onChangeField).toHaveBeenCalledWith('email', expect.any(String))
  })

  it('Passwordを変更すると、onChangeFieldが("password", 値)で呼ばれること', async () => {
    const user = userEvent.setup()
    const { onChangeField } = renderDialog()

    await user.type(screen.getByLabelText('Password'), 'X')

    expect(onChangeField).toHaveBeenCalledWith('password', expect.any(String))
  })

  it('Escapeキーを押すとonCloseが呼ばれること', async () => {
    const { onClose } = renderDialog()

    await new Promise((r) => setTimeout(r, 100))
    fireEvent.keyDown(document, { key: 'Escape' })

    await waitFor(() => expect(onClose).toHaveBeenCalled())
  })

  it('errorsの各メッセージが表示されること', () => {
    renderDialog({ errors: { name: '表示名を入力してください' } })

    expect(screen.getByText('表示名を入力してください')).toBeInTheDocument()
  })

  it('errors.commonが表示されること', () => {
    renderDialog({ errors: { common: 'ユーザーの登録に失敗しました' } })

    expect(screen.getByText('ユーザーの登録に失敗しました')).toBeInTheDocument()
  })

  it('CancelボタンをクリックするとonCloseが呼ばれること', async () => {
    const user = userEvent.setup()
    const { onClose } = renderDialog()

    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onClose).toHaveBeenCalled()
  })

  it('SaveボタンをクリックするとonSubmitが呼ばれること', async () => {
    const user = userEvent.setup()
    const { onSubmit } = renderDialog()

    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(onSubmit).toHaveBeenCalled()
  })

  it('isCreatingUserがtrueの場合、Saveボタンがloading状態になること', () => {
    renderDialog({ isCreatingUser: true })

    // ローディング中はラベルが隠れるため、DOM順（+Add User, Cancel, Save）で判定する
    const buttons = screen.getAllByRole('button')
    expect(buttons[2]).toBeDisabled()
  })
})
