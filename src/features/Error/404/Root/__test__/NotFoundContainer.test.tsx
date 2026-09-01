import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'

import { customRender } from '@/tests/helpers/customRender'

import { NotFoundContainer } from '../NotFoundContainer'

vi.mock('@/features/Error/404/Root/NotFoundPresentational', () => ({
  NotFoundPresentational: () => <div data-testid='not-found-presentational' />,
}))

describe('NotFoundContainer', () => {
  it('NotFoundPresentationalが描画されること', () => {
    customRender(<NotFoundContainer />)

    expect(screen.getByTestId('not-found-presentational')).toBeInTheDocument()
  })
})
