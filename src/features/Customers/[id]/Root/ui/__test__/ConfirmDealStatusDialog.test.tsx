import { describe, expect, it, vi } from 'vitest'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { customRender } from '@/tests/helpers/customRender'

import { ConfirmDealStatusDialog } from '../ConfirmDealStatusDialog'

const renderDialog = (overrides?: { isOpen?: boolean; isUpdatingDealStatus?: boolean }) => {
  const onCancel = vi.fn()
  const onConfirm = vi.fn()

  customRender(
    <ConfirmDealStatusDialog
      isOpen={overrides?.isOpen ?? true}
      isUpdatingDealStatus={overrides?.isUpdatingDealStatus ?? false}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />,
  )

  return { onCancel, onConfirm }
}

describe('ConfirmDealStatusDialog', () => {
  it('isOpenがtrueの場合、確認メッセージが表示されること', () => {
    renderDialog({ isOpen: true })

    expect(screen.getByText('この操作は取り消せません。よろしいですか？')).toBeInTheDocument()
  })

  it('isOpenがfalseの場合、確認メッセージが表示されないこと', () => {
    renderDialog({ isOpen: false })

    expect(screen.queryByText('この操作は取り消せません。よろしいですか？')).not.toBeInTheDocument()
  })

  it('CancelボタンをクリックするとonCancelが呼ばれること', async () => {
    const user = userEvent.setup()
    const { onCancel } = renderDialog()

    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onCancel).toHaveBeenCalled()
  })

  it('ConfirmボタンをクリックするとonConfirmが呼ばれること', async () => {
    const user = userEvent.setup()
    const { onConfirm } = renderDialog()

    await user.click(screen.getByRole('button', { name: 'Confirm' }))

    expect(onConfirm).toHaveBeenCalled()
  })

  it('Escapeキーを押すとonCancelが呼ばれること', async () => {
    const { onCancel } = renderDialog()

    await new Promise((r) => setTimeout(r, 100))
    fireEvent.keyDown(document, { key: 'Escape' })

    await waitFor(() => expect(onCancel).toHaveBeenCalled())
  })

  it('isUpdatingDealStatusがtrueの場合、Confirmボタンがloading状態になること', () => {
    renderDialog({ isUpdatingDealStatus: true })

    // ローディング中はラベルが隠れるため、DOM順（Cancel, Confirm）で判定する
    const buttons = screen.getAllByRole('button')
    expect(buttons[1]).toBeDisabled()
  })
})
