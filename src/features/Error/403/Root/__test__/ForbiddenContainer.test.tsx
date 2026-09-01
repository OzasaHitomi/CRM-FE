import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'

import { customRender } from '@/tests/helpers/customRender'

import { ForbiddenContainer } from '../ForbiddenContainer'

vi.mock('@/features/Error/403/Root/ForbiddenPresentational', () => ({
  ForbiddenPresentational: () => <div data-testid='forbidden-presentational' />,
}))

describe('ForbiddenContainer', () => {
  it('ForbiddenPresentationalが描画されること', () => {
    customRender(<ForbiddenContainer />)

    expect(screen.getByTestId('forbidden-presentational')).toBeInTheDocument()
  })
})
