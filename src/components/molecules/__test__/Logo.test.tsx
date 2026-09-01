import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'

import { customRender } from '@/tests/helpers/customRender'
import { APP_NAME } from '@/share/constants/appName'

import { Logo } from '../Logo'

vi.mock('@/components/atoms/LogoMark', () => ({
  LogoMark: () => <div data-testid='logo-mark' />,
}))

describe('Logo', () => {
  it('APP_NAMEの文言を表示すること', () => {
    customRender(<Logo />)

    expect(screen.getByText(APP_NAME)).toBeInTheDocument()
  })

  it('LogoMarkを表示すること', () => {
    customRender(<Logo />)

    expect(screen.getByTestId('logo-mark')).toBeInTheDocument()
  })
})
