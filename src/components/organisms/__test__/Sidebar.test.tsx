import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { Provider as ChakraUIProvider } from '@/components/ui/provider'
import type { AccountType } from '@/share/types/accountType'

import { Sidebar } from '../Sidebar'

const renderSidebar = (role: AccountType, initialPath = '/customers') => {
  return render(
    <ChakraUIProvider>
      <MemoryRouter initialEntries={[initialPath]}>
        <Sidebar role={role} />
      </MemoryRouter>
    </ChakraUIProvider>,
  )
}

describe('Sidebar', () => {
  it('roleがadminでない場合、Account Managementのリンクが表示されないこと', () => {
    renderSidebar('sales')

    expect(screen.queryByRole('link', { name: /Account Management/i })).not.toBeInTheDocument()
  })

  it('roleがadminの場合、Account Managementのリンクが表示されること', () => {
    renderSidebar('admin')

    expect(screen.getByRole('link', { name: /Account Management/i })).toBeInTheDocument()
  })

  it('Customersのリンクは常に表示されること', () => {
    renderSidebar('sales')

    expect(screen.getByRole('link', { name: /Customers/i })).toBeInTheDocument()
  })

  it('現在のパスに一致するリンクがアクティブになること', () => {
    renderSidebar('admin', '/customers')

    expect(screen.getByRole('link', { name: /Customers/i })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: /Account Management/i })).not.toHaveAttribute(
      'aria-current',
    )
  })
})
