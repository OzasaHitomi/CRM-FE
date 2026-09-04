import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { customRender } from '@/tests/helpers/customRender'
import type { MeResponse } from '@/services/internal/backend/v1/types/response/auth'
import type {
  GetCustomersResponseItem,
  PaginationResponseItem,
} from '@/services/internal/backend/v1/types/response/customer'

import { CustomerTable } from '../CustomerTable'
import { Pagination } from '@/components/molecules/Pagination'

vi.mock('@/components/molecules/Pagination', () => ({
  Pagination: vi.fn(() => null),
}))

const mockPagination = vi.mocked(Pagination)

const mockCustomers: GetCustomersResponseItem[] = [
  {
    customerId: 'customer-1',
    companyName: 'Northwind Logistics',
    industry: 'manufacturing',
    assignedUser: { userId: 'user-1', name: 'Emily Chen' },
  },
  {
    customerId: 'customer-2',
    companyName: 'Cedar & Vine Retail',
    industry: 'retail',
    assignedUser: null,
  },
]

const mockPaginationData: PaginationResponseItem = {
  page: 1,
  pageSize: 10,
  totalCount: 2,
  totalPages: 1,
}

const renderTable = (overrides?: {
  customers?: GetCustomersResponseItem[]
  pagination?: PaginationResponseItem
  me?: MeResponse | undefined
  isAssigningCustomer?: boolean
  isUnassigningCustomer?: boolean
}) => {
  const onAssignToMe = vi.fn()
  const onUnassign = vi.fn()
  const onPageChange = vi.fn()

  customRender(
    <CustomerTable
      customers={overrides?.customers ?? mockCustomers}
      pagination={overrides?.pagination ?? mockPaginationData}
      me={overrides?.me}
      isAssigningCustomer={overrides?.isAssigningCustomer ?? false}
      isUnassigningCustomer={overrides?.isUnassigningCustomer ?? false}
      onAssignToMe={onAssignToMe}
      onUnassign={onUnassign}
      onPageChange={onPageChange}
    />,
  )

  return { onAssignToMe, onUnassign, onPageChange }
}

describe('CustomerTable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('各顧客の会社名・業種を表示すること', () => {
    renderTable()

    expect(screen.getByText('Northwind Logistics')).toBeInTheDocument()
    expect(screen.getByText('manufacturing')).toBeInTheDocument()
  })

  it('assignedUserがnullの場合、Unassignedと表示すること', () => {
    renderTable()

    expect(screen.getByText('Unassigned')).toBeInTheDocument()
  })

  it('managerの場合、会社名が顧客詳細ページへのリンクになっていること', () => {
    renderTable({ me: { userId: 'user-9', role: 'manager', name: 'Alex Morgan' } })

    expect(screen.getByRole('link', { name: 'Northwind Logistics' })).toHaveAttribute(
      'href',
      '/customers/customer-1',
    )
  })

  it('adminの場合、未アサインの顧客でも会社名がリンクになっていること', () => {
    renderTable({ me: { userId: 'user-9', role: 'admin', name: 'Alex Morgan' } })

    expect(screen.getByRole('link', { name: 'Cedar & Vine Retail' })).toHaveAttribute(
      'href',
      '/customers/customer-2',
    )
  })

  it('salesが自分の担当顧客の場合、会社名がリンクになっていること', () => {
    renderTable({ me: { userId: 'user-1', role: 'sales', name: 'Emily Chen' } })

    expect(screen.getByRole('link', { name: 'Northwind Logistics' })).toHaveAttribute(
      'href',
      '/customers/customer-1',
    )
  })

  it('salesが未アサインの顧客を見る場合、会社名はリンクにならないこと', () => {
    renderTable({ me: { userId: 'user-9', role: 'sales', name: 'Jamie Lee' } })

    expect(screen.queryByRole('link', { name: 'Cedar & Vine Retail' })).not.toBeInTheDocument()
    expect(screen.getByText('Cedar & Vine Retail')).toBeInTheDocument()
  })

  it('meがundefinedの場合、会社名はリンクにならないこと', () => {
    renderTable({ me: undefined })

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('assignedUserがある場合、その名前を表示すること', () => {
    renderTable()

    expect(screen.getByText('Emily Chen')).toBeInTheDocument()
  })

  it('customersが空配列の場合、EmptyStateが表示されテーブルが表示されないこと', () => {
    renderTable({ customers: [] })

    expect(screen.getByText('No customers found')).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('customersが空配列の場合、Paginationが表示されないこと', () => {
    renderTable({ customers: [] })

    expect(mockPagination).not.toHaveBeenCalled()
  })

  it('Paginationへ正しいpropsが渡されること', () => {
    const pagination: PaginationResponseItem = {
      page: 2,
      pageSize: 10,
      totalCount: 15,
      totalPages: 2,
    }
    const { onPageChange } = renderTable({ pagination })

    expect(mockPagination).toHaveBeenCalledWith(
      expect.objectContaining({ pagination, onPageChange }),
      undefined,
    )
  })

  it('meがundefinedの場合、Action列にボタンが表示されないこと', () => {
    renderTable({ me: undefined })

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('未アサインの顧客に対して、sales/managerには"Assign to me"ボタンが表示されること', () => {
    renderTable({ me: { userId: 'user-9', role: 'sales', name: 'Jamie Lee' } })

    expect(screen.getByRole('button', { name: 'Assign to me' })).toBeInTheDocument()
  })

  it('未アサインの顧客に対して、adminには"Assign to me"ボタンが表示されないこと', () => {
    renderTable({ me: { userId: 'user-9', role: 'admin', name: 'Alex Morgan' } })

    expect(screen.queryByRole('button', { name: 'Assign to me' })).not.toBeInTheDocument()
  })

  it('"Assign to me"をクリックすると、onAssignToMeがcustomerIdで呼ばれること', async () => {
    const user = userEvent.setup()
    const { onAssignToMe } = renderTable({
      me: { userId: 'user-9', role: 'sales', name: 'Jamie Lee' },
    })

    await user.click(screen.getByRole('button', { name: 'Assign to me' }))

    expect(onAssignToMe).toHaveBeenCalledWith('customer-2')
  })

  it('自分がアサイン中の顧客には"Unassign"ボタンが表示されること', () => {
    renderTable({ me: { userId: 'user-1', role: 'sales', name: 'Emily Chen' } })

    expect(screen.getByRole('button', { name: 'Unassign' })).toBeInTheDocument()
  })

  it('"Unassign"をクリックすると、onUnassignがcustomerIdで呼ばれること', async () => {
    const user = userEvent.setup()
    const { onUnassign } = renderTable({
      me: { userId: 'user-1', role: 'sales', name: 'Emily Chen' },
    })

    await user.click(screen.getByRole('button', { name: 'Unassign' }))

    expect(onUnassign).toHaveBeenCalledWith('customer-1')
  })

  it('他人がアサイン中の顧客に対して、managerには"Unassign"ボタンが表示されること', () => {
    renderTable({ me: { userId: 'user-9', role: 'manager', name: 'Alex Morgan' } })

    expect(screen.getByRole('button', { name: 'Unassign' })).toBeInTheDocument()
  })

  it('他人がアサイン中の顧客に対して、salesには"Unassign"ボタンが表示されないこと', () => {
    renderTable({ me: { userId: 'user-9', role: 'sales', name: 'Jamie Lee' } })

    expect(screen.queryByRole('button', { name: 'Unassign' })).not.toBeInTheDocument()
  })

  it('isAssigningCustomerがtrueの場合、"Assign to me"ボタンがloading状態になること', () => {
    renderTable({
      customers: [mockCustomers[1]], // 未アサインの顧客のみ
      me: { userId: 'user-9', role: 'sales', name: 'Jamie Lee' },
      isAssigningCustomer: true,
    })

    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('isUnassigningCustomerがtrueの場合、"Unassign"ボタンがloading状態になること', () => {
    renderTable({
      customers: [mockCustomers[0]], // 自分がアサイン中の顧客のみ
      me: { userId: 'user-1', role: 'sales', name: 'Emily Chen' },
      isUnassigningCustomer: true,
    })

    expect(screen.getByRole('button')).toBeDisabled()
  })
})
