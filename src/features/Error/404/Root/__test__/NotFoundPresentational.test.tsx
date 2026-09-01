import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { customRender } from '@/tests/helpers/customRender'

import { NotFoundPresentational } from '../NotFoundPresentational'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => mockNavigate }
})

describe('NotFoundPresentational', () => {
  it('"404"の見出しを表示すること', () => {
    customRender(<NotFoundPresentational />)

    expect(screen.getByRole('heading', { name: '404' })).toBeInTheDocument()
  })

  it('ページが見つからないメッセージを表示すること', () => {
    customRender(<NotFoundPresentational />)

    expect(screen.getByText('お探しのページが見つかりません。')).toBeInTheDocument()
  })

  it('ボタンをクリックすると/customersへnavigateすること', async () => {
    const user = userEvent.setup()
    customRender(<NotFoundPresentational />)

    await user.click(screen.getByRole('button', { name: 'Customersへ戻る' }))

    expect(mockNavigate).toHaveBeenCalledWith('/customers')
  })
})
