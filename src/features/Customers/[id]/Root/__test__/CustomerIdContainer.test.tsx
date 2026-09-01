import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useParams } from 'react-router-dom'

import { customRender } from '@/tests/helpers/customRender'
import { useGetCustomerHandler } from '@/features/Customers/[id]/Root/hooks/handlers/useGetCustomerHandler'
import { useUpdateCustomerHandler } from '@/features/Customers/[id]/Root/hooks/handlers/useUpdateCustomerHandler'
import { useCreateDealHandler } from '@/features/Customers/[id]/Root/hooks/handlers/useCreateDealHandler'
import { useUpdateDealHandler } from '@/features/Customers/[id]/Root/hooks/handlers/useUpdateDealHandler'
import { useDealListHandler } from '@/features/Customers/[id]/Root/hooks/handlers/useDealListHandler'
import { useUpdateDealStatusHandler } from '@/features/Customers/[id]/Root/hooks/handlers/useUpdateDealStatusHandler'
import { useCreateActivityLogHandler } from '@/features/Customers/[id]/Root/hooks/handlers/useCreateActivityLogHandler'
import { useUpdateActivityLogHandler } from '@/features/Customers/[id]/Root/hooks/handlers/useUpdateActivityLogHandler'
import { useAssignCustomerHandler } from '@/features/Customers/hooks/handlers/useAssignCustomerHandler'
import type { GetCustomerResponse } from '@/services/internal/backend/v1/types/response/customer'
import type { MeResponse } from '@/services/internal/backend/v1/types/response/auth'
import type { CustomerForm } from '@/features/Customers/types/customerForm'
import type { DealForm } from '@/features/Customers/[id]/Root/types/dealForm'
import type { ActivityLogForm } from '@/features/Customers/[id]/Root/types/activityLogForm'

import { CustomerIdContainer } from '../CustomerIdContainer'

vi.mock('@/features/Customers/[id]/Root/CustomerIdPresentational', () => ({
  CustomerIdPresentational: vi.fn(() => null),
}))
vi.mock('@/features/Customers/[id]/Root/hooks/handlers/useGetCustomerHandler', () => ({
  useGetCustomerHandler: vi.fn(),
}))
vi.mock('@/features/Customers/[id]/Root/hooks/handlers/useUpdateCustomerHandler', () => ({
  useUpdateCustomerHandler: vi.fn(),
}))
vi.mock('@/features/Customers/[id]/Root/hooks/handlers/useCreateDealHandler', () => ({
  useCreateDealHandler: vi.fn(),
}))
vi.mock('@/features/Customers/[id]/Root/hooks/handlers/useUpdateDealHandler', () => ({
  useUpdateDealHandler: vi.fn(),
}))
vi.mock('@/features/Customers/[id]/Root/hooks/handlers/useDealListHandler', () => ({
  useDealListHandler: vi.fn(),
}))
vi.mock('@/features/Customers/[id]/Root/hooks/handlers/useUpdateDealStatusHandler', () => ({
  useUpdateDealStatusHandler: vi.fn(),
}))
vi.mock('@/features/Customers/[id]/Root/hooks/handlers/useCreateActivityLogHandler', () => ({
  useCreateActivityLogHandler: vi.fn(),
}))
vi.mock('@/features/Customers/[id]/Root/hooks/handlers/useUpdateActivityLogHandler', () => ({
  useUpdateActivityLogHandler: vi.fn(),
}))
vi.mock('@/features/Customers/hooks/handlers/useAssignCustomerHandler', () => ({
  useAssignCustomerHandler: vi.fn(),
}))
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useParams: vi.fn() }
})

import { CustomerIdPresentational } from '@/features/Customers/[id]/Root/CustomerIdPresentational'

const mockUseParams = vi.mocked(useParams)
const mockUseGetCustomerHandler = vi.mocked(useGetCustomerHandler)
const mockUseUpdateCustomerHandler = vi.mocked(useUpdateCustomerHandler)
const mockUseCreateDealHandler = vi.mocked(useCreateDealHandler)
const mockUseUpdateDealHandler = vi.mocked(useUpdateDealHandler)
const mockUseDealListHandler = vi.mocked(useDealListHandler)
const mockUseUpdateDealStatusHandler = vi.mocked(useUpdateDealStatusHandler)
const mockUseCreateActivityLogHandler = vi.mocked(useCreateActivityLogHandler)
const mockUseUpdateActivityLogHandler = vi.mocked(useUpdateActivityLogHandler)
const mockUseAssignCustomerHandler = vi.mocked(useAssignCustomerHandler)
const mockCustomerIdPresentational = vi.mocked(CustomerIdPresentational)

const mockCustomer: GetCustomerResponse = {
  customerId: 'customer-1',
  companyName: 'Northwind Logistics',
  industry: 'manufacturing',
  companySize: 850,
  contactName: 'Grace Halvorsen',
  phone: '+1 (415) 555-0182',
  email: 'grace.h@northwind.com',
  assignedUser: null,
  deals: [],
}

const mockMe: MeResponse = { userId: 'user-1', role: 'sales', name: 'Emily Chen' }
const mockCustomerForm: CustomerForm = {
  companyName: '',
  industry: 'manufacturing',
  companySize: 0,
  contactName: '',
  phone: '',
  email: '',
}
const mockDealForm: DealForm = {
  title: '',
  amount: 0,
  plan: 'starter',
  licenseCount: 0,
  contractPeriod: 0,
}

const mockGetData = { customer: mockCustomer }
const mockGetUiState = { isLoading: false, isError: false }
const mockUpdateData = { customerForm: mockCustomerForm, customerFormErrors: {} }
const mockUpdateUiState = { isEditCustomerDialogOpen: false, isUpdatingCustomer: false }
const mockUpdateHandlers = {
  onOpenEditCustomerDialog: vi.fn(),
  onCloseEditCustomerDialog: vi.fn(),
  onChangeCustomerFormField: vi.fn(),
  onSubmitEditCustomer: vi.fn(),
}
const mockDealData = { dealForm: mockDealForm, dealFormErrors: {} }
const mockDealUiState = { isAddDealDialogOpen: false, isCreatingDeal: false }
const mockDealHandlers = {
  onOpenCreateDealDialog: vi.fn(),
  onCloseCreateDealDialog: vi.fn(),
  onChangeDealFormField: vi.fn(),
  onSubmitCreateDeal: vi.fn(),
}
const mockUpdateDealData = { editDealForm: mockDealForm, editDealFormErrors: {} }
const mockUpdateDealUiState = { isEditDealDialogOpen: false, isUpdatingDeal: false }
const mockUpdateDealHandlers = {
  onOpenEditDealDialog: vi.fn(),
  onCloseEditDealDialog: vi.fn(),
  onChangeEditDealFormField: vi.fn(),
  onSubmitEditDeal: vi.fn(),
}
const mockDealListUiState = { expandedDealId: null }
const mockDealListHandlers = { onToggleDealExpand: vi.fn() }
const mockDealStatusUiState = { isConfirmDealStatusDialogOpen: false, isUpdatingDealStatus: false }
const mockDealStatusHandlers = {
  onSelectDealStatus: vi.fn(),
  onConfirmDealStatusChange: vi.fn(),
  onCancelDealStatusChange: vi.fn(),
}
const mockActivityLogForm: ActivityLogForm = { type: 'call', activityDate: '', note: '' }
const mockCreateActivityLogData = {
  activityLogForm: mockActivityLogForm,
  activityLogFormErrors: {},
}
const mockCreateActivityLogUiState = {
  isAddActivityLogDialogOpen: false,
  isCreatingActivityLog: false,
}
const mockCreateActivityLogHandlers = {
  onOpenAddActivityLogDialog: vi.fn(),
  onCloseAddActivityLogDialog: vi.fn(),
  onChangeActivityLogFormField: vi.fn(),
  onSubmitAddActivityLog: vi.fn(),
}
const mockUpdateActivityLogData = {
  editActivityLogForm: mockActivityLogForm,
  editActivityLogFormErrors: {},
}
const mockUpdateActivityLogUiState = {
  isEditActivityLogDialogOpen: false,
  isUpdatingActivityLog: false,
}
const mockUpdateActivityLogHandlers = {
  onOpenEditActivityLogDialog: vi.fn(),
  onCloseEditActivityLogDialog: vi.fn(),
  onChangeEditActivityLogFormField: vi.fn(),
  onSubmitEditActivityLog: vi.fn(),
}
const mockAssignData = { me: mockMe }
const mockAssignUiState = { isAssigningCustomer: false, isUnassigningCustomer: false }
const mockAssignHandlers = { onAssignToMe: vi.fn(), onUnassign: vi.fn() }

describe('CustomerIdContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseParams.mockReturnValue({ id: 'customer-1' })
    mockUseGetCustomerHandler.mockReturnValue({ data: mockGetData, uiState: mockGetUiState })
    mockUseUpdateCustomerHandler.mockReturnValue({
      data: mockUpdateData,
      uiState: mockUpdateUiState,
      handlers: mockUpdateHandlers,
    })
    mockUseCreateDealHandler.mockReturnValue({
      data: mockDealData,
      uiState: mockDealUiState,
      handlers: mockDealHandlers,
    })
    mockUseUpdateDealHandler.mockReturnValue({
      data: mockUpdateDealData,
      uiState: mockUpdateDealUiState,
      handlers: mockUpdateDealHandlers,
    })
    mockUseDealListHandler.mockReturnValue({
      uiState: mockDealListUiState,
      handlers: mockDealListHandlers,
    })
    mockUseUpdateDealStatusHandler.mockReturnValue({
      uiState: mockDealStatusUiState,
      handlers: mockDealStatusHandlers,
    })
    mockUseCreateActivityLogHandler.mockReturnValue({
      data: mockCreateActivityLogData,
      uiState: mockCreateActivityLogUiState,
      handlers: mockCreateActivityLogHandlers,
    })
    mockUseUpdateActivityLogHandler.mockReturnValue({
      data: mockUpdateActivityLogData,
      uiState: mockUpdateActivityLogUiState,
      handlers: mockUpdateActivityLogHandlers,
    })
    mockUseAssignCustomerHandler.mockReturnValue({
      data: mockAssignData,
      uiState: mockAssignUiState,
      handlers: mockAssignHandlers,
    })
  })

  it('URLパラメータのidを各handlerにそのまま渡すこと', () => {
    customRender(<CustomerIdContainer />)

    expect(mockUseGetCustomerHandler).toHaveBeenCalledWith('customer-1')
    expect(mockUseUpdateCustomerHandler).toHaveBeenCalledWith('customer-1')
    expect(mockUseCreateDealHandler).toHaveBeenCalledWith('customer-1')
    expect(mockUseUpdateDealHandler).toHaveBeenCalledWith('customer-1')
    expect(mockUseUpdateDealStatusHandler).toHaveBeenCalledWith('customer-1')
  })

  it('6つのhandlerのdataがマージされて渡されること', () => {
    customRender(<CustomerIdContainer />)

    expect(mockCustomerIdPresentational).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          ...mockGetData,
          ...mockUpdateData,
          ...mockDealData,
          ...mockUpdateDealData,
          ...mockCreateActivityLogData,
          ...mockUpdateActivityLogData,
          ...mockAssignData,
        },
      }),
      undefined,
    )
  })

  it('8つのhandlerのuiStateがマージされて渡されること', () => {
    customRender(<CustomerIdContainer />)

    expect(mockCustomerIdPresentational).toHaveBeenCalledWith(
      expect.objectContaining({
        uiState: {
          ...mockGetUiState,
          ...mockUpdateUiState,
          ...mockDealUiState,
          ...mockUpdateDealUiState,
          ...mockDealListUiState,
          ...mockDealStatusUiState,
          ...mockCreateActivityLogUiState,
          ...mockUpdateActivityLogUiState,
          ...mockAssignUiState,
        },
      }),
      undefined,
    )
  })

  it('updateCustomerHandler・createDealHandler・updateDealHandler・dealListHandler・updateDealStatusHandler・createActivityLogHandler・updateActivityLogHandler・assignCustomerHandlerのhandlersがマージされて渡されること', () => {
    customRender(<CustomerIdContainer />)

    expect(mockCustomerIdPresentational).toHaveBeenCalledWith(
      expect.objectContaining({
        handlers: {
          ...mockUpdateHandlers,
          ...mockDealHandlers,
          ...mockUpdateDealHandlers,
          ...mockDealListHandlers,
          ...mockDealStatusHandlers,
          ...mockCreateActivityLogHandlers,
          ...mockUpdateActivityLogHandlers,
          ...mockAssignHandlers,
        },
      }),
      undefined,
    )
  })
})
