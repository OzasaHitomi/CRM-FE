import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act } from '@testing-library/react'

import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { useUpdateUserStatusMutation } from '@/features/Admin/Users/Root/hooks/mutations/useUpdateUserStatusMutation'
import { toaster } from '@/components/ui/toaster'

import { useUpdateUserStatusHandler } from '../useUpdateUserStatusHandler'

vi.mock('@/features/Admin/Users/Root/hooks/mutations/useUpdateUserStatusMutation', () => ({
  useUpdateUserStatusMutation: vi.fn(),
}))
vi.mock('@/components/ui/toaster', () => ({
  toaster: { create: vi.fn() },
}))

const mockUseUpdateUserStatusMutation = vi.mocked(useUpdateUserStatusMutation)
const mockMutateAsync = vi.fn()
const mockToasterCreate = vi.mocked(toaster.create)

const setupMutation = (isPending = false) => {
  mockUseUpdateUserStatusMutation.mockReturnValue({
    mutateAsync: mockMutateAsync,
    isPending,
  } as unknown as ReturnType<typeof useUpdateUserStatusMutation>)
}

describe('useUpdateUserStatusHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setupMutation()
  })

  it('onToggleUserStatusを呼ぶと、現在のisActiveを反転した値でmutateAsyncが呼ばれること', async () => {
    mockMutateAsync.mockResolvedValueOnce(undefined)
    const { result } = customRenderHook(() => useUpdateUserStatusHandler())

    await act(async () => {
      await result.current.handlers.onToggleUserStatus('user-1', true)
    })

    expect(mockMutateAsync).toHaveBeenCalledWith({ userId: 'user-1', data: { isActive: false } })
    expect(mockToasterCreate).toHaveBeenCalledWith({
      type: 'success',
      description: 'ステータスを変更しました',
    })
  })

  it('現在isActive=falseの場合、trueに反転して呼ばれること', async () => {
    mockMutateAsync.mockResolvedValueOnce(undefined)
    const { result } = customRenderHook(() => useUpdateUserStatusHandler())

    await act(async () => {
      await result.current.handlers.onToggleUserStatus('user-1', false)
    })

    expect(mockMutateAsync).toHaveBeenCalledWith({ userId: 'user-1', data: { isActive: true } })
  })

  it('失敗した場合、エラートーストを表示すること', async () => {
    mockMutateAsync.mockRejectedValueOnce(new Error('権限がありません'))
    const { result } = customRenderHook(() => useUpdateUserStatusHandler())

    await act(async () => {
      await result.current.handlers.onToggleUserStatus('user-1', true)
    })

    expect(mockToasterCreate).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'error', description: '権限がありません' }),
    )
  })

  it('非Errorオブジェクトがthrowされた場合、フォールバックメッセージでトースト表示すること', async () => {
    mockMutateAsync.mockRejectedValueOnce('unexpected error')
    const { result } = customRenderHook(() => useUpdateUserStatusHandler())

    await act(async () => {
      await result.current.handlers.onToggleUserStatus('user-1', true)
    })

    expect(mockToasterCreate).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'error', description: 'ステータスの変更に失敗しました' }),
    )
  })

  it('isUpdatingUserStatusがupdateUserStatusMutation.isPendingを反映すること', () => {
    setupMutation(true)
    const { result } = customRenderHook(() => useUpdateUserStatusHandler())

    expect(result.current.uiState.isUpdatingUserStatus).toBe(true)
  })
})
