import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

import { CustomersContainer } from '@/features/Customers/Root/CustomersContainer'
import { CustomerIdContainer } from '@/features/Customers/[id]/Root/CustomerIdContainer'
import { NotFoundContainer } from '@/features/Error/404/Root/NotFoundContainer'

import { CustomersRoute } from '../CustomersRoute'

vi.mock('@/features/Customers/Root/CustomersContainer', () => ({
  CustomersContainer: vi.fn(() => <div data-testid='customers-container' />),
}))
vi.mock('@/features/Customers/[id]/Root/CustomerIdContainer', () => ({
  CustomerIdContainer: vi.fn(() => <div data-testid='customer-id-container' />),
}))
vi.mock('@/features/Error/404/Root/NotFoundContainer', () => ({
  NotFoundContainer: vi.fn(() => <div data-testid='not-found-container' />),
}))

const mockCustomersContainer = vi.mocked(CustomersContainer)
const mockCustomerIdContainer = vi.mocked(CustomerIdContainer)
const mockNotFoundContainer = vi.mocked(NotFoundContainer)

const renderCustomersRoute = (initialPath: string) => {
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path='/customers/*' element={<CustomersRoute />} />
        <Route path='/404' element={<NotFoundContainer />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('CustomersRoute', () => {
  it('/customersに、CustomersContainerが表示されること', () => {
    renderCustomersRoute('/customers')

    expect(screen.getByTestId('customers-container')).toBeInTheDocument()
    expect(mockCustomersContainer).toHaveBeenCalled()
  })

  it('/customers/:idに、CustomerIdContainerが表示されること', () => {
    renderCustomersRoute('/customers/customer-1')

    expect(screen.getByTestId('customer-id-container')).toBeInTheDocument()
    expect(mockCustomerIdContainer).toHaveBeenCalled()
  })

  it('一致しないネストパスは、NotFoundContainerが表示されること', () => {
    renderCustomersRoute('/customers/foo/bar')

    expect(screen.getByTestId('not-found-container')).toBeInTheDocument()
    expect(mockNotFoundContainer).toHaveBeenCalled()
  })
})
