import { beforeEach, describe, expect, it, vi } from 'vitest'

import { customRender } from '@/tests/helpers/customRender'
import { useLoginMutationHandler } from '@/features/Login/Root/hooks/handlers/useLoginMutationHandler'

import { LoginContainer } from '../LoginContainer'

vi.mock('@/features/Login/Root/LoginPresentational', () => ({
  LoginPresentational: vi.fn(() => null),
}))
vi.mock('@/features/Login/Root/hooks/handlers/useLoginMutationHandler', () => ({
  useLoginMutationHandler: vi.fn(),
}))

import { LoginPresentational } from '@/features/Login/Root/LoginPresentational'

const mockData = { loginForm: { email: 'test@example.com', password: 'password' }, errors: {} }
const mockUiState = { isPending: false }
const mockHandlers = { onSubmitLogin: vi.fn(), onChangeLoginFormField: vi.fn() }

describe('LoginContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useLoginMutationHandler).mockReturnValue({
      data: mockData,
      uiState: mockUiState,
      handlers: mockHandlers,
    })
  })

  it('dataがそのままLoginPresentationalに渡されること', () => {
    customRender(<LoginContainer />)

    expect(vi.mocked(LoginPresentational)).toHaveBeenCalledWith(
      expect.objectContaining({ data: mockData }),
      undefined,
    )
  })

  it('uiStateがそのままLoginPresentationalに渡されること', () => {
    customRender(<LoginContainer />)

    expect(vi.mocked(LoginPresentational)).toHaveBeenCalledWith(
      expect.objectContaining({ uiState: mockUiState }),
      undefined,
    )
  })

  it('handlersがそのままLoginPresentationalに渡されること', () => {
    customRender(<LoginContainer />)

    expect(vi.mocked(LoginPresentational)).toHaveBeenCalledWith(
      expect.objectContaining({ handlers: mockHandlers }),
      undefined,
    )
  })
})
