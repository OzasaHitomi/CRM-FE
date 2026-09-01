import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { customRender } from '@/tests/helpers/customRender'
import { Logo } from '@/components/molecules/Logo'

import { AppHeader } from '../AppHeader'

vi.mock('@/components/molecules/Logo', () => ({
  Logo: vi.fn(() => null),
}))

const mockLogo = vi.mocked(Logo)

describe('AppHeader', () => {
  it('userNameを表示すること', () => {
    customRender(<AppHeader userName='Alex Morgan' roleLabel='Admin' onLogout={vi.fn()} />)

    expect(screen.getByText('Alex Morgan')).toBeInTheDocument()
  })

  it('roleLabelを表示すること', () => {
    customRender(<AppHeader userName='Alex Morgan' roleLabel='Admin' onLogout={vi.fn()} />)

    expect(screen.getByText('Admin')).toBeInTheDocument()
  })

  it("Logoにtextcolor='black'が渡されること", () => {
    customRender(<AppHeader userName='Alex Morgan' roleLabel='Admin' onLogout={vi.fn()} />)

    expect(mockLogo).toHaveBeenCalledWith(
      expect.objectContaining({ textColor: 'black' }),
      undefined,
    )
  })

  it('Log outボタンをクリックするとonLogoutが呼ばれること', async () => {
    const onLogout = vi.fn()
    const user = userEvent.setup()
    customRender(<AppHeader userName='Alex Morgan' roleLabel='Admin' onLogout={onLogout} />)

    await user.click(screen.getByRole('button', { name: /Log out/i }))

    expect(onLogout).toHaveBeenCalled()
  })
})
