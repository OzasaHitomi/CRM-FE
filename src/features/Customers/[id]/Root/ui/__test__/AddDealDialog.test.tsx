import { describe, expect, it, vi } from 'vitest'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { customRender } from '@/tests/helpers/customRender'
import type { DealForm, DealFormErrors } from '@/features/Customers/[id]/Root/types/dealForm'

import { AddDealDialog } from '../AddDealDialog'

const mockDealForm: DealForm = {
  title: 'Warehouse analytics add-on',
  amount: 18000,
  plan: 'professional',
  licenseCount: 40,
  contractPeriod: 12,
}

const renderDialog = (overrides?: {
  isOpen?: boolean
  errors?: DealFormErrors
  isCreatingDeal?: boolean
}) => {
  const onOpen = vi.fn()
  const onClose = vi.fn()
  const onChangeField = vi.fn()
  const onSubmit = vi.fn()

  customRender(
    <AddDealDialog
      isOpen={overrides?.isOpen ?? true}
      dealForm={mockDealForm}
      errors={overrides?.errors ?? {}}
      isCreatingDeal={overrides?.isCreatingDeal ?? false}
      onOpen={onOpen}
      onClose={onClose}
      onChangeField={onChangeField}
      onSubmit={onSubmit}
    />,
  )

  return { onOpen, onClose, onChangeField, onSubmit }
}

describe('AddDealDialog', () => {
  it('+ Add DealボタンをクリックするとonOpenが呼ばれること', async () => {
    const user = userEvent.setup()
    const { onOpen } = renderDialog({ isOpen: false })

    await user.click(screen.getByRole('button', { name: '+ Add Deal' }))

    expect(onOpen).toHaveBeenCalled()
  })

  it('isOpenがtrueの場合、フォーム内容が表示されること', () => {
    renderDialog({ isOpen: true })

    expect(screen.getByLabelText('Title')).toBeInTheDocument()
  })

  it('isOpenがfalseの場合、フォーム内容が表示されないこと', () => {
    renderDialog({ isOpen: false })

    expect(screen.queryByLabelText('Title')).not.toBeInTheDocument()
  })

  it('dealFormの各値が入力欄に反映されていること', () => {
    renderDialog()

    expect(screen.getByLabelText('Title')).toHaveValue('Warehouse analytics add-on')
    expect(screen.getByLabelText('Amount')).toHaveValue(18000)
    expect(screen.getByLabelText('License Count')).toHaveValue(40)
    expect(screen.getByLabelText('Contract Period')).toHaveValue(12)
  })

  it('Titleを変更すると、onChangeFieldが("title", 値)で呼ばれること', async () => {
    const user = userEvent.setup()
    const { onChangeField } = renderDialog()

    await user.type(screen.getByLabelText('Title'), 'X')

    expect(onChangeField).toHaveBeenCalledWith('title', expect.any(String))
  })

  it('Amountを変更すると、数値に変換されてonChangeFieldが呼ばれること', () => {
    const { onChangeField } = renderDialog()

    fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '5000' } })

    expect(onChangeField).toHaveBeenCalledWith('amount', 5000)
  })

  it('Planのselectを変更すると、onChangeFieldが("plan", 値)で呼ばれること', async () => {
    const user = userEvent.setup()
    const { onChangeField } = renderDialog()

    await user.selectOptions(screen.getByLabelText('Plan'), 'enterprise')

    expect(onChangeField).toHaveBeenCalledWith('plan', 'enterprise')
  })

  it('License Countを変更すると、数値に変換されてonChangeFieldが呼ばれること', () => {
    const { onChangeField } = renderDialog()

    fireEvent.change(screen.getByLabelText('License Count'), { target: { value: '10' } })

    expect(onChangeField).toHaveBeenCalledWith('licenseCount', 10)
  })

  it('Contract Periodを変更すると、数値に変換されてonChangeFieldが呼ばれること', () => {
    const { onChangeField } = renderDialog()

    fireEvent.change(screen.getByLabelText('Contract Period'), { target: { value: '24' } })

    expect(onChangeField).toHaveBeenCalledWith('contractPeriod', 24)
  })

  it('Escapeキーを押すとonCloseが呼ばれること', async () => {
    const { onClose } = renderDialog()

    await new Promise((r) => setTimeout(r, 100))
    fireEvent.keyDown(document, { key: 'Escape' })

    await waitFor(() => expect(onClose).toHaveBeenCalled())
  })

  it('errorsの各メッセージが表示されること', () => {
    renderDialog({ errors: { title: '商談名を入力してください' } })

    expect(screen.getByText('商談名を入力してください')).toBeInTheDocument()
  })

  it('errors.commonが表示されること', () => {
    renderDialog({ errors: { common: '商談の登録に失敗しました' } })

    expect(screen.getByText('商談の登録に失敗しました')).toBeInTheDocument()
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

  it('isCreatingDealがtrueの場合、Saveボタンがloading状態になること', () => {
    renderDialog({ isCreatingDeal: true })

    // ローディング中はラベルが隠れるため、DOM順（+Add Deal, Cancel, Save）で判定する
    const buttons = screen.getAllByRole('button')
    expect(buttons[2]).toBeDisabled()
  })
})
