import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act } from '@testing-library/react'

import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { useUpdateDealStatusMutation } from '@/features/Customers/[id]/Root/hooks/mutations/useUpdateDealStatusMutation'
import { toaster } from '@/components/ui/toaster'

import { useUpdateDealStatusHandler } from '../useUpdateDealStatusHandler'

vi.mock('@/features/Customers/[id]/Root/hooks/mutations/useUpdateDealStatusMutation', () => ({
  useUpdateDealStatusMutation: vi.fn(),
}))
vi.mock('@/components/ui/toaster', () => ({
  toaster: { create: vi.fn() },
}))

const mockUseUpdateDealStatusMutation = vi.mocked(useUpdateDealStatusMutation)
const mockToasterCreate = vi.mocked(toaster.create)
const mockMutateAsync = vi.fn()

const setupMutation = (isPending = false) => {
  mockUseUpdateDealStatusMutation.mockReturnValue({
    mutateAsync: mockMutateAsync,
    isPending,
  } as unknown as ReturnType<typeof useUpdateDealStatusMutation>)
}

describe('useUpdateDealStatusHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setupMutation()
  })

  it('非終端ステータスを選ぶと、確認無しで即座にmutateAsyncが呼ばれること', async () => {
    mockMutateAsync.mockResolvedValueOnce(undefined)
    const { result } = customRenderHook(() => useUpdateDealStatusHandler('customer-1'))

    await act(async () => {
      await result.current.handlers.onSelectDealStatus('deal-1', 'proposal')
    })

    expect(mockMutateAsync).toHaveBeenCalledWith({ dealId: 'deal-1', status: 'proposal' })
    expect(result.current.uiState.isConfirmDealStatusDialogOpen).toBe(false)
    expect(mockToasterCreate).toHaveBeenCalledWith({
      type: 'success',
      description: 'ステータスを変更しました',
    })
  })

  it('closed_wonを選ぶと、mutateAsyncは呼ばれず確認ダイアログが開くこと', async () => {
    const { result } = customRenderHook(() => useUpdateDealStatusHandler('customer-1'))

    await act(async () => {
      await result.current.handlers.onSelectDealStatus('deal-1', 'closed_won')
    })

    expect(mockMutateAsync).not.toHaveBeenCalled()
    expect(result.current.uiState.isConfirmDealStatusDialogOpen).toBe(true)
  })

  it('closed_lostを選ぶと、mutateAsyncは呼ばれず確認ダイアログが開くこと', async () => {
    const { result } = customRenderHook(() => useUpdateDealStatusHandler('customer-1'))

    await act(async () => {
      await result.current.handlers.onSelectDealStatus('deal-1', 'closed_lost')
    })

    expect(mockMutateAsync).not.toHaveBeenCalled()
    expect(result.current.uiState.isConfirmDealStatusDialogOpen).toBe(true)
  })

  it('onConfirmDealStatusChangeを呼ぶと、保留中のdealId/statusでmutateAsyncが呼ばれ、ダイアログが閉じること', async () => {
    mockMutateAsync.mockResolvedValueOnce(undefined)
    const { result } = customRenderHook(() => useUpdateDealStatusHandler('customer-1'))

    await act(async () => {
      await result.current.handlers.onSelectDealStatus('deal-1', 'closed_won')
    })

    await act(async () => {
      await result.current.handlers.onConfirmDealStatusChange()
    })

    expect(mockMutateAsync).toHaveBeenCalledWith({ dealId: 'deal-1', status: 'closed_won' })
    expect(result.current.uiState.isConfirmDealStatusDialogOpen).toBe(false)
  })

  it('onCancelDealStatusChangeを呼ぶと、mutateAsyncを呼ばずダイアログが閉じること', async () => {
    const { result } = customRenderHook(() => useUpdateDealStatusHandler('customer-1'))

    await act(async () => {
      await result.current.handlers.onSelectDealStatus('deal-1', 'closed_won')
    })
    act(() => {
      result.current.handlers.onCancelDealStatusChange()
    })

    expect(mockMutateAsync).not.toHaveBeenCalled()
    expect(result.current.uiState.isConfirmDealStatusDialogOpen).toBe(false)
  })

  it('失敗した場合、エラートーストを表示すること', async () => {
    mockMutateAsync.mockRejectedValueOnce(
      new Error('成約・失注済みのdealのステータスは変更できません'),
    )
    const { result } = customRenderHook(() => useUpdateDealStatusHandler('customer-1'))

    await act(async () => {
      await result.current.handlers.onSelectDealStatus('deal-1', 'proposal')
    })

    expect(mockToasterCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'error',
        description: '成約・失注済みのdealのステータスは変更できません',
      }),
    )
  })

  it('非Errorオブジェクトがthrowされた場合、フォールバックメッセージでトースト表示すること', async () => {
    mockMutateAsync.mockRejectedValueOnce('unexpected error')
    const { result } = customRenderHook(() => useUpdateDealStatusHandler('customer-1'))

    await act(async () => {
      await result.current.handlers.onSelectDealStatus('deal-1', 'proposal')
    })

    expect(mockToasterCreate).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'error', description: 'ステータスの変更に失敗しました' }),
    )
  })

  it('isUpdatingDealStatusがmutation.isPendingを反映すること', () => {
    setupMutation(true)
    const { result } = customRenderHook(() => useUpdateDealStatusHandler('customer-1'))

    expect(result.current.uiState.isUpdatingDealStatus).toBe(true)
  })
})
