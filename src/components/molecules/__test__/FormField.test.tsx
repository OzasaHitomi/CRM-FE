import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { customRender } from '@/tests/helpers/customRender'

import { FormField } from '../FormField'

describe('FormField', () => {
  it('ラベルと入力値を表示すること', () => {
    customRender(<FormField label='Email' value='test@example.com' onChange={vi.fn()} />)

    expect(screen.getByLabelText('Email')).toHaveValue('test@example.com')
  })

  it('入力時にonChangeへ新しい値を渡すこと', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    customRender(<FormField label='Email' value='' onChange={onChange} />)

    await user.type(screen.getByLabelText('Email'), 'a')

    expect(onChange).toHaveBeenCalledWith('a')
  })

  it('typeで指定したinputのtypeが反映されること', () => {
    customRender(<FormField label='Password' type='password' value='' onChange={vi.fn()} />)

    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password')
  })

  it('errorMessageが指定されている場合、エラーメッセージを表示すること', () => {
    customRender(<FormField label='Email' value='' onChange={vi.fn()} errorMessage='必須です' />)

    expect(screen.getByText('必須です')).toBeInTheDocument()
  })

  it('errorMessageが未指定の場合、エラーメッセージを表示しないこと', () => {
    customRender(<FormField label='Email' value='' onChange={vi.fn()} />)

    expect(screen.queryByText('必須です')).not.toBeInTheDocument()
  })
})
