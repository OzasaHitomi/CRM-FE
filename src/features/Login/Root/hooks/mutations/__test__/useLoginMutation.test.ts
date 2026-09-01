import { beforeEach, describe, expect, it, vi } from 'vitest'
import { waitFor } from '@testing-library/react'

import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { login } from '@/services/internal/backend/v1/auth'

import { useLoginMutation } from '../useLoginMutation'

vi.mock('@/services/internal/backend/v1/auth', () => ({
  login: vi.fn(),
}))

const mockLogin = vi.mocked(login)

describe('useLoginMutation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('mutateAsyncに渡した引数がそのままloginに渡ること', async () => {
    mockLogin.mockResolvedValueOnce(undefined)
    const { result } = customRenderHook(() => useLoginMutation())

    await result.current.mutateAsync({ email: 'test@example.com', password: 'password' })

    // react-query は mutationFn に (variables, context) の2引数を渡すため、第2引数は問わない
    expect(mockLogin).toHaveBeenCalledWith(
      { email: 'test@example.com', password: 'password' },
      expect.anything(),
    )
  })

  it('loginが成功した場合、isSuccessになること', async () => {
    mockLogin.mockResolvedValueOnce(undefined)
    const { result } = customRenderHook(() => useLoginMutation())

    await result.current.mutateAsync({ email: 'test@example.com', password: 'password' })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('loginが失敗した場合、isErrorになりerrorに反映されること', async () => {
    const error = new Error('Invalid credentials')
    mockLogin.mockRejectedValueOnce(error)
    const { result } = customRenderHook(() => useLoginMutation())

    await expect(
      result.current.mutateAsync({ email: 'test@example.com', password: 'password' }),
    ).rejects.toThrow('Invalid credentials')

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error).toBe(error)
  })
})
