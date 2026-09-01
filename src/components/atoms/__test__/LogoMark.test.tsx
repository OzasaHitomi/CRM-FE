import { describe, expect, it } from 'vitest'

import { customRender } from '@/tests/helpers/customRender'

import { LogoMark } from '../LogoMark'

describe('LogoMark', () => {
  it('アイコンを表示すること', () => {
    const { container } = customRender(<LogoMark />)

    expect(container.querySelector('svg')).toBeInTheDocument()
  })
})
