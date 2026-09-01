import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'

import { customRender } from '@/tests/helpers/customRender'
import { ErrorPage } from '@/components/pages/ErrorPage'
import { CustomerDetailCard } from '@/features/Customers/[id]/Root/ui/CustomerDetailCard'
import { DealList } from '@/features/Customers/[id]/Root/ui/DealList'
import { AddDealDialog } from '@/features/Customers/[id]/Root/ui/AddDealDialog'
import { EditDealDialog } from '@/features/Customers/[id]/Root/ui/EditDealDialog'
import { ConfirmDealStatusDialog } from '@/features/Customers/[id]/Root/ui/ConfirmDealStatusDialog'
import { AddActivityLogDialog } from '@/features/Customers/[id]/Root/ui/AddActivityLogDialog'
import { EditActivityLogDialog } from '@/features/Customers/[id]/Root/ui/EditActivityLogDialog'
import type { MeResponse } from '@/services/internal/backend/v1/types/response/auth'
import type { GetCustomerResponse } from '@/services/internal/backend/v1/types/response/customer'
import type { CustomerForm, CustomerFormErrors } from '@/features/Customers/types/customerForm'
import type { DealForm, DealFormErrors } from '@/features/Customers/[id]/Root/types/dealForm'
import type {
  ActivityLogForm,
  ActivityLogFormErrors,
} from '@/features/Customers/[id]/Root/types/activityLogForm'

import { CustomerIdPresentational } from '../CustomerIdPresentational'

vi.mock('@/components/pages/LoadingPage', () => ({
  LoadingPage: () => <div data-testid='loading-page' />,
}))
vi.mock('@/components/pages/ErrorPage', () => ({
  ErrorPage: vi.fn(() => null),
}))
vi.mock('@/features/Customers/[id]/Root/ui/CustomerDetailCard', () => ({
  CustomerDetailCard: vi.fn(() => null),
}))
vi.mock('@/features/Customers/[id]/Root/ui/DealList', () => ({
  DealList: vi.fn(() => null),
}))
vi.mock('@/features/Customers/[id]/Root/ui/AddDealDialog', () => ({
  AddDealDialog: vi.fn(() => null),
}))
vi.mock('@/features/Customers/[id]/Root/ui/EditDealDialog', () => ({
  EditDealDialog: vi.fn(() => null),
}))
vi.mock('@/features/Customers/[id]/Root/ui/ConfirmDealStatusDialog', () => ({
  ConfirmDealStatusDialog: vi.fn(() => null),
}))
vi.mock('@/features/Customers/[id]/Root/ui/AddActivityLogDialog', () => ({
  AddActivityLogDialog: vi.fn(() => null),
}))
vi.mock('@/features/Customers/[id]/Root/ui/EditActivityLogDialog', () => ({
  EditActivityLogDialog: vi.fn(() => null),
}))

const mockErrorPage = vi.mocked(ErrorPage)
const mockCustomerDetailCard = vi.mocked(CustomerDetailCard)
const mockDealList = vi.mocked(DealList)
const mockAddDealDialog = vi.mocked(AddDealDialog)
const mockEditDealDialog = vi.mocked(EditDealDialog)
const mockConfirmDealStatusDialog = vi.mocked(ConfirmDealStatusDialog)
const mockAddActivityLogDialog = vi.mocked(AddActivityLogDialog)
const mockEditActivityLogDialog = vi.mocked(EditActivityLogDialog)

const mockCustomer: GetCustomerResponse = {
  customerId: 'customer-1',
  companyName: 'Northwind Logistics',
  industry: 'manufacturing',
  companySize: 850,
  contactName: 'Grace Halvorsen',
  phone: '+1 (415) 555-0182',
  email: 'grace.h@northwind.com',
  assignedUser: null,
  deals: [
    {
      dealId: 'deal-1',
      title: 'Enterprise rollout — 2026',
      status: 'negotiation',
      amount: 84000,
      plan: 'enterprise',
      licenseCount: 120,
      contractPeriod: 24,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      activityLogs: [],
    },
  ],
}

const mockCustomerForm: CustomerForm = {
  companyName: 'Northwind Logistics',
  industry: 'manufacturing',
  companySize: 850,
  contactName: 'Grace Halvorsen',
  phone: '+1 (415) 555-0182',
  email: 'grace.h@northwind.com',
}
const mockCustomerFormErrors: CustomerFormErrors = {}
const mockDealForm: DealForm = {
  title: '',
  amount: 0,
  plan: 'starter',
  licenseCount: 0,
  contractPeriod: 0,
}
const mockDealFormErrors: DealFormErrors = {}
const mockEditDealForm: DealForm = {
  title: '',
  amount: 0,
  plan: 'starter',
  licenseCount: 0,
  contractPeriod: 0,
}
const mockEditDealFormErrors: DealFormErrors = {}
const mockActivityLogForm: ActivityLogForm = {
  type: 'call',
  activityDate: '',
  note: '',
}
const mockActivityLogFormErrors: ActivityLogFormErrors = {}
const mockEditActivityLogForm: ActivityLogForm = {
  type: 'call',
  activityDate: '',
  note: '',
}
const mockEditActivityLogFormErrors: ActivityLogFormErrors = {}

const onAssignToMe = vi.fn()
const onUnassign = vi.fn()
const onOpenEditCustomerDialog = vi.fn()
const onCloseEditCustomerDialog = vi.fn()
const onChangeCustomerFormField = vi.fn()
const onSubmitEditCustomer = vi.fn()
const onOpenCreateDealDialog = vi.fn()
const onCloseCreateDealDialog = vi.fn()
const onChangeDealFormField = vi.fn()
const onSubmitCreateDeal = vi.fn()
const onOpenEditDealDialog = vi.fn()
const onCloseEditDealDialog = vi.fn()
const onChangeEditDealFormField = vi.fn()
const onSubmitEditDeal = vi.fn()
const onToggleDealExpand = vi.fn()
const onSelectDealStatus = vi.fn()
const onConfirmDealStatusChange = vi.fn()
const onCancelDealStatusChange = vi.fn()
const onOpenAddActivityLogDialog = vi.fn()
const onCloseAddActivityLogDialog = vi.fn()
const onChangeActivityLogFormField = vi.fn()
const onSubmitAddActivityLog = vi.fn()
const onOpenEditActivityLogDialog = vi.fn()
const onCloseEditActivityLogDialog = vi.fn()
const onChangeEditActivityLogFormField = vi.fn()
const onSubmitEditActivityLog = vi.fn()

const renderPresentational = (overrides?: {
  noCustomer?: boolean
  me?: MeResponse | undefined
  isLoading?: boolean
  isError?: boolean
  isAssigningCustomer?: boolean
  isUnassigningCustomer?: boolean
  isEditCustomerDialogOpen?: boolean
  isUpdatingCustomer?: boolean
  isAddDealDialogOpen?: boolean
  isCreatingDeal?: boolean
  isEditDealDialogOpen?: boolean
  isUpdatingDeal?: boolean
  expandedDealId?: string | null
  isConfirmDealStatusDialogOpen?: boolean
  isUpdatingDealStatus?: boolean
  isAddActivityLogDialogOpen?: boolean
  isCreatingActivityLog?: boolean
  isEditActivityLogDialogOpen?: boolean
  isUpdatingActivityLog?: boolean
}) => {
  customRender(
    <CustomerIdPresentational
      data={{
        customer: overrides?.noCustomer ? undefined : mockCustomer,
        me: overrides?.me ?? { userId: 'user-1', role: 'sales', name: 'Emily Chen' },
        customerForm: mockCustomerForm,
        customerFormErrors: mockCustomerFormErrors,
        dealForm: mockDealForm,
        dealFormErrors: mockDealFormErrors,
        editDealForm: mockEditDealForm,
        editDealFormErrors: mockEditDealFormErrors,
        activityLogForm: mockActivityLogForm,
        activityLogFormErrors: mockActivityLogFormErrors,
        editActivityLogForm: mockEditActivityLogForm,
        editActivityLogFormErrors: mockEditActivityLogFormErrors,
      }}
      uiState={{
        isLoading: overrides?.isLoading ?? false,
        isError: overrides?.isError ?? false,
        isAssigningCustomer: overrides?.isAssigningCustomer ?? false,
        isUnassigningCustomer: overrides?.isUnassigningCustomer ?? false,
        isEditCustomerDialogOpen: overrides?.isEditCustomerDialogOpen ?? false,
        isUpdatingCustomer: overrides?.isUpdatingCustomer ?? false,
        isAddDealDialogOpen: overrides?.isAddDealDialogOpen ?? false,
        isCreatingDeal: overrides?.isCreatingDeal ?? false,
        isEditDealDialogOpen: overrides?.isEditDealDialogOpen ?? false,
        isUpdatingDeal: overrides?.isUpdatingDeal ?? false,
        expandedDealId: overrides?.expandedDealId ?? null,
        isConfirmDealStatusDialogOpen: overrides?.isConfirmDealStatusDialogOpen ?? false,
        isUpdatingDealStatus: overrides?.isUpdatingDealStatus ?? false,
        isAddActivityLogDialogOpen: overrides?.isAddActivityLogDialogOpen ?? false,
        isCreatingActivityLog: overrides?.isCreatingActivityLog ?? false,
        isEditActivityLogDialogOpen: overrides?.isEditActivityLogDialogOpen ?? false,
        isUpdatingActivityLog: overrides?.isUpdatingActivityLog ?? false,
      }}
      handlers={{
        onAssignToMe,
        onUnassign,
        onOpenEditCustomerDialog,
        onCloseEditCustomerDialog,
        onChangeCustomerFormField,
        onSubmitEditCustomer,
        onOpenCreateDealDialog,
        onCloseCreateDealDialog,
        onChangeDealFormField,
        onSubmitCreateDeal,
        onOpenEditDealDialog,
        onCloseEditDealDialog,
        onChangeEditDealFormField,
        onSubmitEditDeal,
        onToggleDealExpand,
        onSelectDealStatus,
        onConfirmDealStatusChange,
        onCancelDealStatusChange,
        onOpenAddActivityLogDialog,
        onCloseAddActivityLogDialog,
        onChangeActivityLogFormField,
        onSubmitAddActivityLog,
        onOpenEditActivityLogDialog,
        onCloseEditActivityLogDialog,
        onChangeEditActivityLogFormField,
        onSubmitEditActivityLog,
      }}
    />,
  )
}

describe('CustomerIdPresentational', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

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

  it('customerがundefinedの場合、ErrorPageにメッセージが渡されること', () => {
    renderPresentational({ noCustomer: true })

    expect(mockErrorPage).toHaveBeenCalledWith(
      expect.objectContaining({ message: '顧客情報の取得に失敗しました。' }),
      undefined,
    )
  })

  it('Back to Customersリンクが/customersへのリンクになっていること', () => {
    renderPresentational()

    expect(screen.getByRole('link', { name: /Back to Customers/ })).toHaveAttribute(
      'href',
      '/customers',
    )
  })

  it('Deals見出しにdeals件数が表示されること', () => {
    renderPresentational()

    expect(screen.getByText('Deals (1)')).toBeInTheDocument()
  })

  it('CustomerDetailCardへ正しいpropsが渡されること', () => {
    renderPresentational({
      isAssigningCustomer: true,
      isUnassigningCustomer: true,
      isEditCustomerDialogOpen: true,
      isUpdatingCustomer: true,
    })

    expect(mockCustomerDetailCard).toHaveBeenCalledWith(
      expect.objectContaining({
        customer: mockCustomer,
        me: { userId: 'user-1', role: 'sales', name: 'Emily Chen' },
        customerForm: mockCustomerForm,
        errors: mockCustomerFormErrors,
        isAssigningCustomer: true,
        isUnassigningCustomer: true,
        isDialogOpen: true,
        isUpdatingCustomer: true,
        onAssignToMe,
        onUnassign,
        onOpenEditCustomerDialog,
        onCloseEditCustomerDialog,
        onChangeCustomerFormField,
        onSubmitEditCustomer,
      }),
      undefined,
    )
  })

  it('DealListへ正しいpropsが渡されること', () => {
    renderPresentational({
      expandedDealId: 'deal-1',
      isUpdatingDealStatus: true,
    })

    expect(mockDealList).toHaveBeenCalledWith(
      expect.objectContaining({
        deals: mockCustomer.deals,
        expandedDealId: 'deal-1',
        canManageDeals: true,
        isUpdatingDealStatus: true,
        onToggleDealExpand,
        onSelectDealStatus,
        onOpenEditDealDialog,
        onOpenAddActivityLogDialog,
        onOpenEditActivityLogDialog,
      }),
      undefined,
    )
  })

  it('sales/managerにはAddDealDialogが表示されること', () => {
    renderPresentational({ me: { userId: 'user-1', role: 'sales', name: 'Emily Chen' } })

    expect(mockAddDealDialog).toHaveBeenCalled()
  })

  it('adminにはAddDealDialogが表示されないこと', () => {
    renderPresentational({ me: { userId: 'user-9', role: 'admin', name: 'Alex Morgan' } })

    expect(mockAddDealDialog).not.toHaveBeenCalled()
  })

  it('adminの場合、DealListへcanManageDeals=falseが渡されること', () => {
    renderPresentational({ me: { userId: 'user-9', role: 'admin', name: 'Alex Morgan' } })

    expect(mockDealList).toHaveBeenCalledWith(
      expect.objectContaining({ canManageDeals: false }),
      undefined,
    )
  })

  it('AddDealDialogへ正しいpropsが渡されること', () => {
    renderPresentational({ isAddDealDialogOpen: true, isCreatingDeal: true })

    expect(mockAddDealDialog).toHaveBeenCalledWith(
      expect.objectContaining({
        isOpen: true,
        dealForm: mockDealForm,
        errors: mockDealFormErrors,
        isCreatingDeal: true,
        onOpen: onOpenCreateDealDialog,
        onClose: onCloseCreateDealDialog,
        onChangeField: onChangeDealFormField,
        onSubmit: onSubmitCreateDeal,
      }),
      undefined,
    )
  })

  it('EditDealDialogへ正しいpropsが渡されること', () => {
    renderPresentational({ isEditDealDialogOpen: true, isUpdatingDeal: true })

    expect(mockEditDealDialog).toHaveBeenCalledWith(
      expect.objectContaining({
        isOpen: true,
        dealForm: mockEditDealForm,
        errors: mockEditDealFormErrors,
        isUpdatingDeal: true,
        onClose: onCloseEditDealDialog,
        onChangeField: onChangeEditDealFormField,
        onSubmit: onSubmitEditDeal,
      }),
      undefined,
    )
  })

  it('ConfirmDealStatusDialogへ正しいpropsが渡されること', () => {
    renderPresentational({ isConfirmDealStatusDialogOpen: true, isUpdatingDealStatus: true })

    expect(mockConfirmDealStatusDialog).toHaveBeenCalledWith(
      expect.objectContaining({
        isOpen: true,
        isUpdatingDealStatus: true,
        onCancel: onCancelDealStatusChange,
        onConfirm: onConfirmDealStatusChange,
      }),
      undefined,
    )
  })

  it('AddActivityLogDialogへ正しいpropsが渡されること', () => {
    renderPresentational({ isAddActivityLogDialogOpen: true, isCreatingActivityLog: true })

    expect(mockAddActivityLogDialog).toHaveBeenCalledWith(
      expect.objectContaining({
        isOpen: true,
        activityLogForm: mockActivityLogForm,
        errors: mockActivityLogFormErrors,
        isCreatingActivityLog: true,
        onClose: onCloseAddActivityLogDialog,
        onChangeField: onChangeActivityLogFormField,
        onSubmit: onSubmitAddActivityLog,
      }),
      undefined,
    )
  })

  it('EditActivityLogDialogへ正しいpropsが渡されること', () => {
    renderPresentational({ isEditActivityLogDialogOpen: true, isUpdatingActivityLog: true })

    expect(mockEditActivityLogDialog).toHaveBeenCalledWith(
      expect.objectContaining({
        isOpen: true,
        activityLogForm: mockEditActivityLogForm,
        errors: mockEditActivityLogFormErrors,
        isUpdatingActivityLog: true,
        onClose: onCloseEditActivityLogDialog,
        onChangeField: onChangeEditActivityLogFormField,
        onSubmit: onSubmitEditActivityLog,
      }),
      undefined,
    )
  })
})
