import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'

import { customRender } from '@/tests/helpers/customRender'

import { RoleBadge } from '../RoleBadge'

describe('RoleBadge', () => {
  it('adminの場合、Adminと表示すること', () => {
    // roleはAccountTypeを表すpropであり、DOMのaria role属性ではない
    // eslint-disable-next-line jsx-a11y/aria-role
    customRender(<RoleBadge role='admin' />)

    expect(screen.getByText('Admin')).toBeInTheDocument()
  })

  it('managerの場合、Managerと表示すること', () => {
    // eslint-disable-next-line jsx-a11y/aria-role
    customRender(<RoleBadge role='manager' />)

    expect(screen.getByText('Manager')).toBeInTheDocument()
  })

  it('salesの場合、Sales Repと表示すること', () => {
    // eslint-disable-next-line jsx-a11y/aria-role
    customRender(<RoleBadge role='sales' />)

    expect(screen.getByText('Sales Rep')).toBeInTheDocument()
  })
})
