import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { customRender } from '@/tests/helpers/customRender'

import { ForbiddenPresentational } from '../ForbiddenPresentational'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => mockNavigate }
})

describe('ForbiddenPresentational', () => {
  it('"403"の見出しを表示すること', () => {
    customRender(<ForbiddenPresentational />)

    expect(screen.getByRole('heading', { name: '403' })).toBeInTheDocument()
  })

  it('権限エラーメッセージを表示すること', () => {
    customRender(<ForbiddenPresentational />)

    expect(screen.getByText('このページを表示する権限がありません。')).toBeInTheDocument()
  })

  it('ボタンをクリックすると/customersへnavigateすること', async () => {
    const user = userEvent.setup()
    customRender(<ForbiddenPresentational />)

    await user.click(screen.getByRole('button', { name: 'Customersへ戻る' }))

    expect(mockNavigate).toHaveBeenCalledWith('/customers')
  })
})
