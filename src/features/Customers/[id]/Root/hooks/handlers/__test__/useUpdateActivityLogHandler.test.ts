import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act } from '@testing-library/react'

import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { useUpdateActivityLogMutation } from '@/features/Customers/[id]/Root/hooks/mutations/useUpdateActivityLogMutation'
import { toaster } from '@/components/ui/toaster'
import type { ActivityLogResponseItem } from '@/services/internal/backend/v1/types/response/customer'

import { useUpdateActivityLogHandler } from '../useUpdateActivityLogHandler'

vi.mock('@/features/Customers/[id]/Root/hooks/mutations/useUpdateActivityLogMutation', () => ({
  useUpdateActivityLogMutation: vi.fn(),
}))
vi.mock('@/components/ui/toaster', () => ({
  toaster: { create: vi.fn() },
}))

const mockUseUpdateActivityLogMutation = vi.mocked(useUpdateActivityLogMutation)
const mockToasterCreate = vi.mocked(toaster.create)
const mockMutateAsync = vi.fn()

const setupMutation = (isPending = false) => {
  mockUseUpdateActivityLogMutation.mockReturnValue({
    mutateAsync: mockMutateAsync,
    isPending,
  } as unknown as ReturnType<typeof useUpdateActivityLogMutation>)
}

const existingLog: ActivityLogResponseItem = {
  activityLogId: 'log-1',
  type: 'email',
  activityDate: '2026-01-20',
  note: 'Sent proposal',
}

describe('useUpdateActivityLogHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setupMutation()
  })

  it('customerIdをuseUpdateActivityLogMutationにそのまま渡すこと', () => {
    customRenderHook(() => useUpdateActivityLogHandler('customer-1'))

    expect(mockUseUpdateActivityLogMutation).toHaveBeenCalledWith('customer-1')
  })

  it('onOpenEditActivityLogDialogを呼ぶとisEditActivityLogDialogOpenがtrueになり、既存値でフォームが初期化されること', () => {
    const { result } = customRenderHook(() => useUpdateActivityLogHandler('customer-1'))

    act(() => {
      result.current.handlers.onOpenEditActivityLogDialog('deal-1', existingLog)
    })

    expect(result.current.uiState.isEditActivityLogDialogOpen).toBe(true)
    expect(result.current.data.editActivityLogForm).toEqual({
      type: 'email',
      activityDate: '2026-01-20',
      note: 'Sent proposal',
    })
  })

  it('noteがnullの場合、空文字でフォームが初期化されること', () => {
    const { result } = customRenderHook(() => useUpdateActivityLogHandler('customer-1'))

    act(() => {
      result.current.handlers.onOpenEditActivityLogDialog('deal-1', { ...existingLog, note: null })
    })

    expect(result.current.data.editActivityLogForm.note).toBe('')
  })

  it('onChangeEditActivityLogFormFieldで指定したフィールドだけが更新されること', () => {
    const { result } = customRenderHook(() => useUpdateActivityLogHandler('customer-1'))

    act(() => {
      result.current.handlers.onOpenEditActivityLogDialog('deal-1', existingLog)
      result.current.handlers.onChangeEditActivityLogFormField('note', 'Updated note')
    })

    expect(result.current.data.editActivityLogForm.note).toBe('Updated note')
    expect(result.current.data.editActivityLogForm.type).toBe('email')
  })

  it('バリデーション失敗時、errorsがセットされmutationが呼ばれないこと', async () => {
    const { result } = customRenderHook(() => useUpdateActivityLogHandler('customer-1'))

    act(() => {
      result.current.handlers.onOpenEditActivityLogDialog('deal-1', existingLog)
      result.current.handlers.onChangeEditActivityLogFormField('activityDate', '')
    })

    await act(async () => {
      await result.current.handlers.onSubmitEditActivityLog()
    })

    expect(result.current.data.editActivityLogFormErrors.activityDate).toBe(
      '活動日を入力してください',
    )
    expect(mockMutateAsync).not.toHaveBeenCalled()
  })

  it('ダイアログが開いていない場合、送信してもmutationが呼ばれないこと', async () => {
    const { result } = customRenderHook(() => useUpdateActivityLogHandler('customer-1'))

    await act(async () => {
      await result.current.handlers.onSubmitEditActivityLog()
    })

    expect(mockMutateAsync).not.toHaveBeenCalled()
  })

  it('バリデーション成功時、mutateAsyncが対象deal・activityLogIdと入力値で呼ばれること', async () => {
    mockMutateAsync.mockResolvedValueOnce(undefined)
    const { result } = customRenderHook(() => useUpdateActivityLogHandler('customer-1'))

    act(() => {
      result.current.handlers.onOpenEditActivityLogDialog('deal-1', existingLog)
      result.current.handlers.onChangeEditActivityLogFormField('note', 'Updated note')
    })

    await act(async () => {
      await result.current.handlers.onSubmitEditActivityLog()
    })

    expect(mockMutateAsync).toHaveBeenCalledWith({
      dealId: 'deal-1',
      activityLogId: 'log-1',
      data: { type: 'email', activityDate: new Date('2026-01-20'), note: 'Updated note' },
    })
  })

  it('送信成功後、ダイアログが閉じること', async () => {
    mockMutateAsync.mockResolvedValueOnce(undefined)
    const { result } = customRenderHook(() => useUpdateActivityLogHandler('customer-1'))

    act(() => {
      result.current.handlers.onOpenEditActivityLogDialog('deal-1', existingLog)
    })

    await act(async () => {
      await result.current.handlers.onSubmitEditActivityLog()
    })

    expect(result.current.uiState.isEditActivityLogDialogOpen).toBe(false)
    expect(mockToasterCreate).toHaveBeenCalledWith({
      type: 'success',
      description: '活動履歴を更新しました',
    })
  })

  it('送信失敗時（Error）、errors.commonにそのメッセージが反映され、ダイアログは開いたままであること', async () => {
    mockMutateAsync.mockRejectedValueOnce(new Error('活動履歴の更新に失敗しました（重複）'))
    const { result } = customRenderHook(() => useUpdateActivityLogHandler('customer-1'))

    act(() => {
      result.current.handlers.onOpenEditActivityLogDialog('deal-1', existingLog)
    })

    await act(async () => {
      await result.current.handlers.onSubmitEditActivityLog()
    })

    expect(result.current.data.editActivityLogFormErrors.common).toBe(
      '活動履歴の更新に失敗しました（重複）',
    )
    expect(result.current.uiState.isEditActivityLogDialogOpen).toBe(true)
  })

  it('送信失敗時（非Error）、errors.commonにフォールバックメッセージが入ること', async () => {
    mockMutateAsync.mockRejectedValueOnce('unexpected error')
    const { result } = customRenderHook(() => useUpdateActivityLogHandler('customer-1'))

    act(() => {
      result.current.handlers.onOpenEditActivityLogDialog('deal-1', existingLog)
    })

    await act(async () => {
      await result.current.handlers.onSubmitEditActivityLog()
    })

    expect(result.current.data.editActivityLogFormErrors.common).toBe(
      '活動履歴の更新に失敗しました',
    )
  })

  it('isUpdatingActivityLogがupdateActivityLogMutation.isPendingを反映すること', () => {
    setupMutation(true)
    const { result } = customRenderHook(() => useUpdateActivityLogHandler('customer-1'))

    expect(result.current.uiState.isUpdatingActivityLog).toBe(true)
  })

  it('onCloseEditActivityLogDialogを呼ぶと、isEditActivityLogDialogOpenがfalseになること', () => {
    const { result } = customRenderHook(() => useUpdateActivityLogHandler('customer-1'))

    act(() => {
      result.current.handlers.onOpenEditActivityLogDialog('deal-1', existingLog)
    })

    act(() => {
      result.current.handlers.onCloseEditActivityLogDialog()
    })

    expect(result.current.uiState.isEditActivityLogDialogOpen).toBe(false)
  })
})
