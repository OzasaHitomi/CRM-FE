import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { customRender } from '@/tests/helpers/customRender'
import { EditCustomerDialog } from '@/features/Customers/[id]/Root/ui/EditCustomerDialog'
import type { MeResponse } from '@/services/internal/backend/v1/types/response/auth'
import type { GetCustomerResponse } from '@/services/internal/backend/v1/types/response/customer'
import type { CustomerForm, CustomerFormErrors } from '@/features/Customers/types/customerForm'

import { CustomerDetailCard } from '../CustomerDetailCard'

vi.mock('@/features/Customers/[id]/Root/ui/EditCustomerDialog', () => ({
  EditCustomerDialog: vi.fn(() => null),
}))

const mockEditCustomerDialog = vi.mocked(EditCustomerDialog)

const mockCustomer: GetCustomerResponse = {
  customerId: 'customer-1',
  companyName: 'Northwind Logistics',
  industry: 'manufacturing',
  companySize: 850,
  contactName: 'Grace Halvorsen',
  phone: '+1 (415) 555-0182',
  email: 'grace.h@northwind.com',
  assignedUser: { userId: 'user-1', name: 'Emily Chen' },
  deals: [],
}

const mockCustomerForm: CustomerForm = {
  companyName: 'Northwind Logistics',
  industry: 'manufacturing',
  companySize: 850,
  contactName: 'Grace Halvorsen',
  phone: '+1 (415) 555-0182',
  email: 'grace.h@northwind.com',
}
const mockErrors: CustomerFormErrors = {}

const renderCard = (overrides?: {
  customer?: GetCustomerResponse
  me?: MeResponse | undefined
  isAssigningCustomer?: boolean
  isUnassigningCustomer?: boolean
  isDialogOpen?: boolean
  isUpdatingCustomer?: boolean
}) => {
  const onAssignToMe = vi.fn()
  const onUnassign = vi.fn()
  const onOpenEditCustomerDialog = vi.fn()
  const onCloseEditCustomerDialog = vi.fn()
  const onChangeCustomerFormField = vi.fn()
  const onSubmitEditCustomer = vi.fn()

  customRender(
    <CustomerDetailCard
      customer={overrides?.customer ?? mockCustomer}
      me={overrides?.me}
      customerForm={mockCustomerForm}
      errors={mockErrors}
      isAssigningCustomer={overrides?.isAssigningCustomer ?? false}
      isUnassigningCustomer={overrides?.isUnassigningCustomer ?? false}
      isDialogOpen={overrides?.isDialogOpen ?? false}
      isUpdatingCustomer={overrides?.isUpdatingCustomer ?? false}
      onAssignToMe={onAssignToMe}
      onUnassign={onUnassign}
      onOpenEditCustomerDialog={onOpenEditCustomerDialog}
      onCloseEditCustomerDialog={onCloseEditCustomerDialog}
      onChangeCustomerFormField={onChangeCustomerFormField}
      onSubmitEditCustomer={onSubmitEditCustomer}
    />,
  )

  return {
    onAssignToMe,
    onUnassign,
    onOpenEditCustomerDialog,
    onCloseEditCustomerDialog,
    onChangeCustomerFormField,
    onSubmitEditCustomer,
  }
}

describe('CustomerDetailCard', () => {
  it('会社名を見出しとして表示すること', () => {
    renderCard()

    expect(screen.getByRole('heading', { name: 'Northwind Logistics' })).toBeInTheDocument()
  })

  it('業種をバッジと詳細項目の両方に表示すること', () => {
    renderCard()

    expect(screen.getAllByText('manufacturing')).toHaveLength(2)
  })

  it('規模・担当者名・電話・メールを表示すること', () => {
    renderCard()

    expect(screen.getByText('850 employees')).toBeInTheDocument()
    expect(screen.getByText('Grace Halvorsen')).toBeInTheDocument()
    expect(screen.getByText('+1 (415) 555-0182')).toBeInTheDocument()
    expect(screen.getByText('grace.h@northwind.com')).toBeInTheDocument()
  })

  it('assignedUserがある場合、担当者名を表示すること', () => {
    renderCard()

    expect(screen.getByText('Assigned to Emily Chen')).toBeInTheDocument()
  })

  it('assignedUserがnullの場合、Unassignedと表示すること', () => {
    renderCard({ customer: { ...mockCustomer, assignedUser: null } })

    expect(screen.getByText('Unassigned')).toBeInTheDocument()
  })

  it('meがundefinedの場合、ボタンが表示されないこと', () => {
    renderCard({ me: undefined })

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('sales/managerにはEditボタンが表示されること', () => {
    renderCard({ me: { userId: 'user-1', role: 'sales', name: 'Emily Chen' } })

    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
  })

  it('adminにはEditボタンが表示されないこと', () => {
    renderCard({ me: { userId: 'user-9', role: 'admin', name: 'Alex Morgan' } })

    expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument()
  })

  it('EditボタンをクリックするとonOpenEditCustomerDialogがcustomerで呼ばれること', async () => {
    const user = userEvent.setup()
    const { onOpenEditCustomerDialog } = renderCard({
      me: { userId: 'user-1', role: 'sales', name: 'Emily Chen' },
    })

    await user.click(screen.getByRole('button', { name: 'Edit' }))

    expect(onOpenEditCustomerDialog).toHaveBeenCalledWith(mockCustomer)
  })

  it('EditCustomerDialogへ正しいpropsが渡されること', () => {
    const { onCloseEditCustomerDialog, onChangeCustomerFormField, onSubmitEditCustomer } =
      renderCard({
        me: { userId: 'user-1', role: 'sales', name: 'Emily Chen' },
        isDialogOpen: true,
        isUpdatingCustomer: true,
      })

    expect(mockEditCustomerDialog).toHaveBeenCalledWith(
      expect.objectContaining({
        isOpen: true,
        customerForm: mockCustomerForm,
        errors: mockErrors,
        isUpdatingCustomer: true,
        onClose: onCloseEditCustomerDialog,
        onChangeField: onChangeCustomerFormField,
        onSubmit: onSubmitEditCustomer,
      }),
      undefined,
    )
  })

  it('未アサインの顧客に対して、sales/managerには"Assign to me"ボタンが表示されること', () => {
    renderCard({
      customer: { ...mockCustomer, assignedUser: null },
      me: { userId: 'user-9', role: 'sales', name: 'Jamie Lee' },
    })

    expect(screen.getByRole('button', { name: 'Assign to me' })).toBeInTheDocument()
  })

  it('"Assign to me"をクリックすると、onAssignToMeがcustomerIdで呼ばれること', async () => {
    const user = userEvent.setup()
    const { onAssignToMe } = renderCard({
      customer: { ...mockCustomer, assignedUser: null },
      me: { userId: 'user-9', role: 'sales', name: 'Jamie Lee' },
    })

    await user.click(screen.getByRole('button', { name: 'Assign to me' }))

    expect(onAssignToMe).toHaveBeenCalledWith('customer-1')
  })

  it('自分がアサイン中の場合、"Unassign"ボタンが表示されること', () => {
    renderCard({ me: { userId: 'user-1', role: 'sales', name: 'Emily Chen' } })

    expect(screen.getByRole('button', { name: 'Unassign' })).toBeInTheDocument()
  })

  it('"Unassign"をクリックすると、onUnassignがcustomerIdで呼ばれること', async () => {
    const user = userEvent.setup()
    const { onUnassign } = renderCard({
      me: { userId: 'user-1', role: 'sales', name: 'Emily Chen' },
    })

    await user.click(screen.getByRole('button', { name: 'Unassign' }))

    expect(onUnassign).toHaveBeenCalledWith('customer-1')
  })

  it('他人がアサイン中の顧客に対して、salesには"Unassign"ボタンが表示されないこと', () => {
    renderCard({ me: { userId: 'user-9', role: 'sales', name: 'Jamie Lee' } })

    expect(screen.queryByRole('button', { name: 'Unassign' })).not.toBeInTheDocument()
  })

  it('他人がアサイン中の顧客に対して、managerには"Unassign"ボタンが表示されること', () => {
    renderCard({ me: { userId: 'user-9', role: 'manager', name: 'Alex Morgan' } })

    expect(screen.getByRole('button', { name: 'Unassign' })).toBeInTheDocument()
  })
})
