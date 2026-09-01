import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act } from '@testing-library/react'

import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { useLogoutMutation } from '@/share/hooks/mutations/useLogoutMutation'
import { toaster } from '@/components/ui/toaster'

import { useLogoutHandler } from '../useLogoutHandler'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('@/share/hooks/mutations/useLogoutMutation', () => ({
  useLogoutMutation: vi.fn(),
}))
vi.mock('@/components/ui/toaster', () => ({
  toaster: { create: vi.fn() },
}))

const mockUseLogoutMutation = vi.mocked(useLogoutMutation)
const mockToasterCreate = vi.mocked(toaster.create)
const mockMutateAsync = vi.fn()

describe('useLogoutHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseLogoutMutation.mockReturnValue({
      mutateAsync: mockMutateAsync,
    } as unknown as ReturnType<typeof useLogoutMutation>)
  })

  it('onLogoutを呼ぶとlogoutMutation.mutateAsyncが呼ばれること', async () => {
    mockMutateAsync.mockResolvedValueOnce(undefined)
    const { result } = customRenderHook(() => useLogoutHandler())

    await act(async () => {
      await result.current.handlers.onLogout()
    })

    expect(mockMutateAsync).toHaveBeenCalled()
  })

  it('成功後、navigateが"/login"・{ replace: true }で呼ばれること', async () => {
    mockMutateAsync.mockResolvedValueOnce(undefined)
    const { result } = customRenderHook(() => useLogoutHandler())

    await act(async () => {
      await result.current.handlers.onLogout()
    })

    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true })
  })

  it('onLogoutが失敗した場合、エラートーストを表示しnavigateは呼ばれないこと', async () => {
    mockMutateAsync.mockRejectedValueOnce(new Error('セッションが無効です'))
    const { result } = customRenderHook(() => useLogoutHandler())

    await act(async () => {
      await result.current.handlers.onLogout()
    })

    expect(mockToasterCreate).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'error', description: 'セッションが無効です' }),
    )
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
