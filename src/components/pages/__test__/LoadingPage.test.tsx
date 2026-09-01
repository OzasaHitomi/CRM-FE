import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'

import { customRender } from '@/tests/helpers/customRender'

import { LoadingPage } from '../LoadingPage'

describe('LoadingPage', () => {
  it('読み込み中の状態を表示すること', () => {
    customRender(<LoadingPage />)

    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})
