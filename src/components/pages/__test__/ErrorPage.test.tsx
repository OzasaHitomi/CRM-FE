import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'

import { customRender } from '@/tests/helpers/customRender'

import { ErrorPage } from '../ErrorPage'

describe('ErrorPage', () => {
  it('渡されたmessageを表示すること', () => {
    customRender(<ErrorPage message='エラーが発生しました' />)

    expect(screen.getByText('エラーが発生しました')).toBeInTheDocument()
  })
})
