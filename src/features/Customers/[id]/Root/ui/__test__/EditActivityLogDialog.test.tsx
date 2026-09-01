import { describe, expect, it, vi } from 'vitest'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { customRender } from '@/tests/helpers/customRender'
import type {
  ActivityLogForm,
  ActivityLogFormErrors,
} from '@/features/Customers/[id]/Root/types/activityLogForm'

import { EditActivityLogDialog } from '../EditActivityLogDialog'

const mockActivityLogForm: ActivityLogForm = {
  type: 'email',
  activityDate: '2026-01-20',
  note: 'Sent proposal',
}

const renderDialog = (overrides?: {
  isOpen?: boolean
  errors?: ActivityLogFormErrors
  isUpdatingActivityLog?: boolean
}) => {
  const onClose = vi.fn()
  const onChangeField = vi.fn()
  const onSubmit = vi.fn()

  customRender(
    <EditActivityLogDialog
      isOpen={overrides?.isOpen ?? true}
      activityLogForm={mockActivityLogForm}
      errors={overrides?.errors ?? {}}
      isUpdatingActivityLog={overrides?.isUpdatingActivityLog ?? false}
      onClose={onClose}
      onChangeField={onChangeField}
      onSubmit={onSubmit}
    />,
  )

  return { onClose, onChangeField, onSubmit }
}

describe('EditActivityLogDialog', () => {
  it('isOpenがtrueの場合、フォーム内容が表示されること', () => {
    renderDialog({ isOpen: true })

    expect(screen.getByLabelText('Activity Date')).toBeInTheDocument()
  })

  it('isOpenがfalseの場合、フォーム内容が表示されないこと', () => {
    renderDialog({ isOpen: false })

    expect(screen.queryByLabelText('Activity Date')).not.toBeInTheDocument()
  })

  it('activityLogFormの各値が入力欄に反映されていること', () => {
    renderDialog()

    expect(screen.getByLabelText('Activity Date')).toHaveValue('2026-01-20')
    expect(screen.getByLabelText('Note')).toHaveValue('Sent proposal')
    expect(screen.getByLabelText('Type')).toHaveValue('email')
  })

  it('Noteを変更すると、onChangeFieldが("note", 値)で呼ばれること', async () => {
    const user = userEvent.setup()
    const { onChangeField } = renderDialog()

    await user.type(screen.getByLabelText('Note'), 'X')

    expect(onChangeField).toHaveBeenCalledWith('note', expect.any(String))
  })

  it('Typeのselectを変更すると、onChangeFieldが("type", 値)で呼ばれること', async () => {
    const user = userEvent.setup()
    const { onChangeField } = renderDialog()

    await user.selectOptions(screen.getByLabelText('Type'), 'visit')

    expect(onChangeField).toHaveBeenCalledWith('type', 'visit')
  })

  it('Activity Dateを変更すると、onChangeFieldが("activityDate", 値)で呼ばれること', () => {
    const { onChangeField } = renderDialog()

    fireEvent.change(screen.getByLabelText('Activity Date'), { target: { value: '2026-02-01' } })

    expect(onChangeField).toHaveBeenCalledWith('activityDate', '2026-02-01')
  })

  it('Escapeキーを押すとonCloseが呼ばれること', async () => {
    const { onClose } = renderDialog()

    await new Promise((r) => setTimeout(r, 100))
    fireEvent.keyDown(document, { key: 'Escape' })

    await waitFor(() => expect(onClose).toHaveBeenCalled())
  })

  it('errorsの各メッセージが表示されること', () => {
    renderDialog({ errors: { activityDate: '活動日を入力してください' } })

    expect(screen.getByText('活動日を入力してください')).toBeInTheDocument()
  })

  it('errors.commonが表示されること', () => {
    renderDialog({ errors: { common: '活動履歴の更新に失敗しました' } })

    expect(screen.getByText('活動履歴の更新に失敗しました')).toBeInTheDocument()
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

  it('isUpdatingActivityLogがtrueの場合、Saveボタンがloading状態になること', () => {
    renderDialog({ isUpdatingActivityLog: true })

    const buttons = screen.getAllByRole('button')
    expect(buttons[1]).toBeDisabled()
  })
})
