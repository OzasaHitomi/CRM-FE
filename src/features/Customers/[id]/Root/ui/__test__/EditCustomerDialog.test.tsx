import { describe, expect, it, vi } from 'vitest'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { customRender } from '@/tests/helpers/customRender'
import type { CustomerForm, CustomerFormErrors } from '@/features/Customers/types/customerForm'

import { EditCustomerDialog } from '../EditCustomerDialog'

const mockCustomerForm: CustomerForm = {
  companyName: 'Cedar & Vine Retail',
  industry: 'retail',
  companySize: 120,
  contactName: 'Jamie Lee',
  phone: '+1 (415) 555-0100',
  email: 'jamie.lee@cedarvine.com',
}

const renderDialog = (overrides?: {
  isOpen?: boolean
  errors?: CustomerFormErrors
  isUpdatingCustomer?: boolean
}) => {
  const onClose = vi.fn()
  const onChangeField = vi.fn()
  const onSubmit = vi.fn()

  customRender(
    <EditCustomerDialog
      isOpen={overrides?.isOpen ?? true}
      customerForm={mockCustomerForm}
      errors={overrides?.errors ?? {}}
      isUpdatingCustomer={overrides?.isUpdatingCustomer ?? false}
      onClose={onClose}
      onChangeField={onChangeField}
      onSubmit={onSubmit}
    />,
  )

  return { onClose, onChangeField, onSubmit }
}

describe('EditCustomerDialog', () => {
  it('isOpenがtrueの場合、フォーム内容が表示されること', () => {
    renderDialog({ isOpen: true })

    expect(screen.getByLabelText('Company Name')).toBeInTheDocument()
  })

  it('isOpenがfalseの場合、フォーム内容が表示されないこと', () => {
    renderDialog({ isOpen: false })

    expect(screen.queryByLabelText('Company Name')).not.toBeInTheDocument()
  })

  it('customerFormの各値が入力欄に反映されていること', () => {
    renderDialog()

    expect(screen.getByLabelText('Company Name')).toHaveValue('Cedar & Vine Retail')
    expect(screen.getByLabelText('Contact Name')).toHaveValue('Jamie Lee')
    expect(screen.getByLabelText('Phone')).toHaveValue('+1 (415) 555-0100')
    expect(screen.getByLabelText('Email')).toHaveValue('jamie.lee@cedarvine.com')
    expect(screen.getByLabelText('Company Size')).toHaveValue(120)
  })

  it('Company Nameを変更すると、onChangeFieldが("companyName", 値)で呼ばれること', async () => {
    const user = userEvent.setup()
    const { onChangeField } = renderDialog()

    await user.type(screen.getByLabelText('Company Name'), 'X')

    expect(onChangeField).toHaveBeenCalledWith('companyName', expect.any(String))
  })

  it('Company Sizeを変更すると、数値に変換されてonChangeFieldが呼ばれること', () => {
    const { onChangeField } = renderDialog()

    fireEvent.change(screen.getByLabelText('Company Size'), { target: { value: '50' } })

    expect(onChangeField).toHaveBeenCalledWith('companySize', 50)
  })

  it('Industryのselectを変更すると、onChangeFieldが("industry", 値)で呼ばれること', async () => {
    const user = userEvent.setup()
    const { onChangeField } = renderDialog()

    await user.selectOptions(screen.getByLabelText('Industry'), 'finance')

    expect(onChangeField).toHaveBeenCalledWith('industry', 'finance')
  })

  it('Contact Nameを変更すると、onChangeFieldが("contactName", 値)で呼ばれること', async () => {
    const user = userEvent.setup()
    const { onChangeField } = renderDialog()

    await user.type(screen.getByLabelText('Contact Name'), 'X')

    expect(onChangeField).toHaveBeenCalledWith('contactName', expect.any(String))
  })

  it('Phoneを変更すると、onChangeFieldが("phone", 値)で呼ばれること', async () => {
    const user = userEvent.setup()
    const { onChangeField } = renderDialog()

    await user.type(screen.getByLabelText('Phone'), 'X')

    expect(onChangeField).toHaveBeenCalledWith('phone', expect.any(String))
  })

  it('Emailを変更すると、onChangeFieldが("email", 値)で呼ばれること', async () => {
    const user = userEvent.setup()
    const { onChangeField } = renderDialog()

    await user.type(screen.getByLabelText('Email'), 'X')

    expect(onChangeField).toHaveBeenCalledWith('email', expect.any(String))
  })

  it('Escapeキーを押すとonCloseが呼ばれること', async () => {
    const { onClose } = renderDialog()

    await new Promise((r) => setTimeout(r, 100))
    fireEvent.keyDown(document, { key: 'Escape' })

    await waitFor(() => expect(onClose).toHaveBeenCalled())
  })

  it('errorsの各メッセージが表示されること', () => {
    renderDialog({ errors: { companyName: '会社名を入力してください' } })

    expect(screen.getByText('会社名を入力してください')).toBeInTheDocument()
  })

  it('errors.commonが表示されること', () => {
    renderDialog({ errors: { common: '顧客情報の更新に失敗しました' } })

    expect(screen.getByText('顧客情報の更新に失敗しました')).toBeInTheDocument()
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

  it('isUpdatingCustomerがtrueの場合、Saveボタンがloading状態になること', () => {
    renderDialog({ isUpdatingCustomer: true })

    // ローディング中はラベルが隠れるため、DOM順（Cancel, Save）で判定する
    const buttons = screen.getAllByRole('button')
    expect(buttons[1]).toBeDisabled()
  })
})
