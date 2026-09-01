import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { customRender } from '@/tests/helpers/customRender'

import { StatusBadge } from '../StatusBadge'

describe('StatusBadge', () => {
  it('isActiveがtrueの場合、Activeと表示すること', () => {
    customRender(<StatusBadge isActive={true} onClick={vi.fn()} disabled={false} />)

    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('isActiveがfalseの場合、Inactiveと表示すること', () => {
    customRender(<StatusBadge isActive={false} onClick={vi.fn()} disabled={false} />)

    expect(screen.getByText('Inactive')).toBeInTheDocument()
  })

  it('クリックするとonClickが呼ばれること', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    customRender(<StatusBadge isActive={true} onClick={onClick} disabled={false} />)

    await user.click(screen.getByRole('button'))

    expect(onClick).toHaveBeenCalled()
  })

  it('disabledがtrueの場合、ボタンがdisabledになること', () => {
    customRender(<StatusBadge isActive={true} onClick={vi.fn()} disabled={true} />)

    expect(screen.getByRole('button')).toBeDisabled()
  })
})
