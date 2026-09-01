import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'

import { customRender } from '@/tests/helpers/customRender'
import { ErrorPage } from '@/components/pages/ErrorPage'
import { CustomerTable } from '@/features/Customers/Root/ui/CustomerTable'
import { CreateCustomerDialog } from '@/features/Customers/Root/ui/CreateCustomerDialog'
import type { MeResponse } from '@/services/internal/backend/v1/types/response/auth'
import type { GetCustomersResponseItem } from '@/services/internal/backend/v1/types/response/customer'
import type { CustomerForm, CustomerFormErrors } from '@/features/Customers/types/customerForm'

import { CustomersPresentational } from '../CustomersPresentational'

vi.mock('@/components/pages/LoadingPage', () => ({
  LoadingPage: () => <div data-testid='loading-page' />,
}))
vi.mock('@/components/pages/ErrorPage', () => ({
  ErrorPage: vi.fn(() => null),
}))
vi.mock('@/features/Customers/Root/ui/CustomerTable', () => ({
  CustomerTable: vi.fn(() => null),
}))
vi.mock('@/features/Customers/Root/ui/CreateCustomerDialog', () => ({
  CreateCustomerDialog: vi.fn(() => null),
}))

const mockErrorPage = vi.mocked(ErrorPage)
const mockCustomerTable = vi.mocked(CustomerTable)
const mockCreateCustomerDialog = vi.mocked(CreateCustomerDialog)

const mockCustomers: GetCustomersResponseItem[] = [
  {
    customerId: 'customer-1',
    companyName: 'Northwind Logistics',
    industry: 'manufacturing',
    assignedUser: { userId: 'user-1', name: 'Emily Chen' },
  },
]

const mockMe: MeResponse = { userId: 'user-1', role: 'sales', name: 'Emily Chen' }
const mockCustomerForm: CustomerForm = {
  companyName: '',
  industry: 'manufacturing',
  companySize: 0,
  contactName: '',
  phone: '',
  email: '',
}
const mockErrors: CustomerFormErrors = {}
const onOpenCreateCustomerDialog = vi.fn()
const onCloseCreateCustomerDialog = vi.fn()
const onChangeCustomerFormField = vi.fn()
const onSubmitCreateCustomer = vi.fn()
const onAssignToMe = vi.fn()
const onUnassign = vi.fn()

const renderPresentational = (overrides?: {
  customers?: GetCustomersResponseItem[]
  isLoading?: boolean
  isError?: boolean
  isDialogOpen?: boolean
  isPending?: boolean
  isAssigningCustomer?: boolean
  isUnassigningCustomer?: boolean
}) => {
  customRender(
    <CustomersPresentational
      data={{
        customers: overrides?.customers ?? mockCustomers,
        customerForm: mockCustomerForm,
        errors: mockErrors,
        me: mockMe,
      }}
      uiState={{
        isLoading: overrides?.isLoading ?? false,
        isError: overrides?.isError ?? false,
        isDialogOpen: overrides?.isDialogOpen ?? false,
        isPending: overrides?.isPending ?? false,
        isAssigningCustomer: overrides?.isAssigningCustomer ?? false,
        isUnassigningCustomer: overrides?.isUnassigningCustomer ?? false,
      }}
      handlers={{
        onOpenCreateCustomerDialog,
        onCloseCreateCustomerDialog,
        onChangeCustomerFormField,
        onSubmitCreateCustomer,
        onAssignToMe,
        onUnassign,
      }}
    />,
  )
}

describe('CustomersPresentational', () => {
  it('isLoadingがtrueの場合、LoadingPageを表示すること', () => {
    renderPresentational({ isLoading: true })

    expect(screen.getByTestId('loading-page')).toBeInTheDocument()
  })

  it('isErrorがtrueの場合、ErrorPageにメッセージが渡されること', () => {
    renderPresentational({ isError: true })

    expect(mockErrorPage).toHaveBeenCalledWith(
      expect.objectContaining({ message: '顧客情報の取得に失敗しました。' }),
      undefined,
    )
  })

  it('customersの件数を表示すること', () => {
    renderPresentational({ customers: mockCustomers })

    expect(screen.getByText('1 customers')).toBeInTheDocument()
  })

  it('CustomerTableへ正しいpropsが渡されること', () => {
    renderPresentational({
      customers: mockCustomers,
      isAssigningCustomer: true,
      isUnassigningCustomer: true,
    })

    expect(mockCustomerTable).toHaveBeenCalledWith(
      expect.objectContaining({
        customers: mockCustomers,
        me: mockMe,
        isAssigningCustomer: true,
        isUnassigningCustomer: true,
        onAssignToMe,
        onUnassign,
      }),
      undefined,
    )
  })

  it('CreateCustomerDialogへ正しいpropsが渡されること', () => {
    renderPresentational({ isDialogOpen: true, isPending: true })

    expect(mockCreateCustomerDialog).toHaveBeenCalledWith(
      expect.objectContaining({
        isOpen: true,
        customerForm: mockCustomerForm,
        errors: mockErrors,
        isPending: true,
        onOpen: onOpenCreateCustomerDialog,
        onClose: onCloseCreateCustomerDialog,
        onChangeField: onChangeCustomerFormField,
        onSubmit: onSubmitCreateCustomer,
      }),
      undefined,
    )
  })
})
