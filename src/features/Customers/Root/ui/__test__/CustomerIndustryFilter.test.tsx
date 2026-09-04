import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { customRender } from '@/tests/helpers/customRender'
import type { IndustryType } from '@/share/types/industryType'

import { CustomerIndustryFilter } from '../CustomerIndustryFilter'

const renderFilter = (industry?: IndustryType) => {
  const onIndustryChange = vi.fn()

  customRender(<CustomerIndustryFilter industry={industry} onIndustryChange={onIndustryChange} />)

  return { onIndustryChange }
}

describe('CustomerIndustryFilter', () => {
  it('industryがundefinedの場合、「All Industries」が選択されていること', () => {
    renderFilter(undefined)

    expect(screen.getByLabelText('Filter by Industry')).toHaveValue('all')
  })

  it('industryが指定されている場合、その業界が選択されていること', () => {
    renderFilter('finance')

    expect(screen.getByLabelText('Filter by Industry')).toHaveValue('finance')
  })

  it('業界を選択すると、onIndustryChangeが選択した業界名で呼ばれること', async () => {
    const user = userEvent.setup()
    const { onIndustryChange } = renderFilter(undefined)

    await user.selectOptions(screen.getByLabelText('Filter by Industry'), 'finance')

    expect(onIndustryChange).toHaveBeenCalledWith('finance')
  })

  it('「All Industries」を選択すると、onIndustryChangeがundefinedで呼ばれること', async () => {
    const user = userEvent.setup()
    const { onIndustryChange } = renderFilter('finance')

    await user.selectOptions(screen.getByLabelText('Filter by Industry'), 'All Industries')

    expect(onIndustryChange).toHaveBeenCalledWith(undefined)
  })
})
