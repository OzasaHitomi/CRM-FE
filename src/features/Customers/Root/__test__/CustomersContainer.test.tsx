import { beforeEach, describe, expect, it, vi } from 'vitest'

import { customRender } from '@/tests/helpers/customRender'
import { useGetCustomersHandler } from '@/features/Customers/Root/hooks/handlers/useGetCustomersHandler'
import { useCreateCustomerHandler } from '@/features/Customers/Root/hooks/handlers/useCreateCustomerHandler'
import { useAssignCustomerHandler } from '@/features/Customers/hooks/handlers/useAssignCustomerHandler'
import type { CustomerForm } from '@/features/Customers/types/customerForm'
import type { MeResponse } from '@/services/internal/backend/v1/types/response/auth'

import { CustomersContainer } from '../CustomersContainer'

vi.mock('@/features/Customers/Root/CustomersPresentational', () => ({
  CustomersPresentational: vi.fn(() => null),
}))
vi.mock('@/features/Customers/Root/hooks/handlers/useGetCustomersHandler', () => ({
  useGetCustomersHandler: vi.fn(),
}))
vi.mock('@/features/Customers/Root/hooks/handlers/useCreateCustomerHandler', () => ({
  useCreateCustomerHandler: vi.fn(),
}))
vi.mock('@/features/Customers/hooks/handlers/useAssignCustomerHandler', () => ({
  useAssignCustomerHandler: vi.fn(),
}))

import { CustomersPresentational } from '@/features/Customers/Root/CustomersPresentational'

const mockUseGetCustomersHandler = vi.mocked(useGetCustomersHandler)
const mockUseCreateCustomerHandler = vi.mocked(useCreateCustomerHandler)
const mockUseAssignCustomerHandler = vi.mocked(useAssignCustomerHandler)
const mockCustomersPresentational = vi.mocked(CustomersPresentational)

const mockCustomerForm: CustomerForm = {
  companyName: '',
  industry: 'manufacturing',
  companySize: 0,
  contactName: '',
  phone: '',
  email: '',
}

const mockMe: MeResponse = { userId: 'user-1', role: 'sales', name: 'Emily Chen' }

const mockGetData = { customers: [], pagination: { page: 1, pageSize: 10, totalCount: 0, totalPages: 0 } }
const mockGetUiState = { isLoading: false, isError: false }
const mockGetHandlers = { onPageChange: vi.fn() }
const mockCreateData = { customerForm: mockCustomerForm, errors: {} }
const mockCreateUiState = { isDialogOpen: false, isPending: false }
const mockCreateHandlers = {
  onOpenCreateCustomerDialog: vi.fn(),
  onCloseCreateCustomerDialog: vi.fn(),
  onChangeCustomerFormField: vi.fn(),
  onSubmitCreateCustomer: vi.fn(),
}
const mockAssignData = { me: mockMe }
const mockAssignUiState = { isAssigningCustomer: false, isUnassigningCustomer: false }
const mockAssignHandlers = { onAssignToMe: vi.fn(), onUnassign: vi.fn() }

describe('CustomersContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseGetCustomersHandler.mockReturnValue({
      data: mockGetData,
      uiState: mockGetUiState,
      handlers: mockGetHandlers,
    })
    mockUseCreateCustomerHandler.mockReturnValue({
      data: mockCreateData,
      uiState: mockCreateUiState,
      handlers: mockCreateHandlers,
    })
    mockUseAssignCustomerHandler.mockReturnValue({
      data: mockAssignData,
      uiState: mockAssignUiState,
      handlers: mockAssignHandlers,
    })
  })

  it('3つのhandlerのdataがマージされて渡されること', () => {
    customRender(<CustomersContainer />)

    expect(mockCustomersPresentational).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { ...mockGetData, ...mockCreateData, ...mockAssignData },
      }),
      undefined,
    )
  })

  it('3つのhandlerのuiStateがマージされて渡されること', () => {
    customRender(<CustomersContainer />)

    expect(mockCustomersPresentational).toHaveBeenCalledWith(
      expect.objectContaining({
        uiState: { ...mockGetUiState, ...mockCreateUiState, ...mockAssignUiState },
      }),
      undefined,
    )
  })

  it('3つのhandlerのhandlersがマージされて渡されること', () => {
    customRender(<CustomersContainer />)

    expect(mockCustomersPresentational).toHaveBeenCalledWith(
      expect.objectContaining({
        handlers: { ...mockGetHandlers, ...mockCreateHandlers, ...mockAssignHandlers },
      }),
      undefined,
    )
  })
})
