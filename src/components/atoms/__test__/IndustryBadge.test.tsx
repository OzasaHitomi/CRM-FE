import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'

import { customRender } from '@/tests/helpers/customRender'

import { IndustryBadge } from '../IndustryBadge'

describe('IndustryBadge', () => {
  it('manufacturingの場合、manufacturingと表示すること', () => {
    customRender(<IndustryBadge industry='manufacturing' />)

    expect(screen.getByText('manufacturing')).toBeInTheDocument()
  })

  it('retailの場合、retailと表示すること', () => {
    customRender(<IndustryBadge industry='retail' />)

    expect(screen.getByText('retail')).toBeInTheDocument()
  })

  it('financeの場合、financeと表示すること', () => {
    customRender(<IndustryBadge industry='finance' />)

    expect(screen.getByText('finance')).toBeInTheDocument()
  })

  it('technologyの場合、technologyと表示すること', () => {
    customRender(<IndustryBadge industry='technology' />)

    expect(screen.getByText('technology')).toBeInTheDocument()
  })

  it('otherの場合、otherと表示すること', () => {
    customRender(<IndustryBadge industry='other' />)

    expect(screen.getByText('other')).toBeInTheDocument()
  })
})
