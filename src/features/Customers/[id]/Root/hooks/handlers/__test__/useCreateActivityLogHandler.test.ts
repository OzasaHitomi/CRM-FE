import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act } from '@testing-library/react'

import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { useCreateActivityLogMutation } from '@/features/Customers/[id]/Root/hooks/mutations/useCreateActivityLogMutation'
import { toaster } from '@/components/ui/toaster'

import { useCreateActivityLogHandler } from '../useCreateActivityLogHandler'

vi.mock('@/features/Customers/[id]/Root/hooks/mutations/useCreateActivityLogMutation', () => ({
  useCreateActivityLogMutation: vi.fn(),
}))
vi.mock('@/components/ui/toaster', () => ({
  toaster: { create: vi.fn() },
}))

const mockUseCreateActivityLogMutation = vi.mocked(useCreateActivityLogMutation)
const mockToasterCreate = vi.mocked(toaster.create)
const mockMutateAsync = vi.fn()

const setupMutation = (isPending = false) => {
  mockUseCreateActivityLogMutation.mockReturnValue({
    mutateAsync: mockMutateAsync,
    isPending,
  } as unknown as ReturnType<typeof useCreateActivityLogMutation>)
}

const fillValidForm = (result: { current: ReturnType<typeof useCreateActivityLogHandler> }) => {
  act(() => {
    result.current.handlers.onChangeActivityLogFormField('type', 'call')
    result.current.handlers.onChangeActivityLogFormField('activityDate', '2026-01-10')
    result.current.handlers.onChangeActivityLogFormField('note', 'Discovery call')
  })
}

describe('useCreateActivityLogHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setupMutation()
  })

  it('customerIdをuseCreateActivityLogMutationにそのまま渡すこと', () => {
    customRenderHook(() => useCreateActivityLogHandler('customer-1'))

    expect(mockUseCreateActivityLogMutation).toHaveBeenCalledWith('customer-1')
  })

  it('onOpenAddActivityLogDialogを呼ぶとisAddActivityLogDialogOpenがtrueになること', () => {
    const { result } = customRenderHook(() => useCreateActivityLogHandler('customer-1'))

    act(() => {
      result.current.handlers.onOpenAddActivityLogDialog('deal-1')
    })

    expect(result.current.uiState.isAddActivityLogDialogOpen).toBe(true)
  })

  it('onChangeActivityLogFormFieldで指定したフィールドだけが更新されること', () => {
    const { result } = customRenderHook(() => useCreateActivityLogHandler('customer-1'))

    act(() => {
      result.current.handlers.onChangeActivityLogFormField('note', 'Follow up email')
    })

    expect(result.current.data.activityLogForm.note).toBe('Follow up email')
    expect(result.current.data.activityLogForm.activityDate).toBe('')
  })

  it('バリデーション失敗時、errorsがセットされmutationが呼ばれないこと', async () => {
    const { result } = customRenderHook(() => useCreateActivityLogHandler('customer-1'))

    act(() => {
      result.current.handlers.onOpenAddActivityLogDialog('deal-1')
    })

    await act(async () => {
      await result.current.handlers.onSubmitAddActivityLog()
    })

    expect(result.current.data.activityLogFormErrors.activityDate).toBe('活動日を入力してください')
    expect(mockMutateAsync).not.toHaveBeenCalled()
  })

  it('ダイアログが開いていない場合、送信してもmutationが呼ばれないこと', async () => {
    const { result } = customRenderHook(() => useCreateActivityLogHandler('customer-1'))

    await act(async () => {
      await result.current.handlers.onSubmitAddActivityLog()
    })

    expect(mockMutateAsync).not.toHaveBeenCalled()
  })

  it('バリデーション成功時、mutateAsyncが対象dealIdと入力値で呼ばれること', async () => {
    mockMutateAsync.mockResolvedValueOnce(undefined)
    const { result } = customRenderHook(() => useCreateActivityLogHandler('customer-1'))

    act(() => {
      result.current.handlers.onOpenAddActivityLogDialog('deal-1')
    })
    fillValidForm(result)

    await act(async () => {
      await result.current.handlers.onSubmitAddActivityLog()
    })

    expect(mockMutateAsync).toHaveBeenCalledWith({
      dealId: 'deal-1',
      data: { type: 'call', activityDate: new Date('2026-01-10'), note: 'Discovery call' },
    })
  })

  it('送信成功後、ダイアログが閉じてフォームがリセットされること', async () => {
    mockMutateAsync.mockResolvedValueOnce(undefined)
    const { result } = customRenderHook(() => useCreateActivityLogHandler('customer-1'))

    act(() => {
      result.current.handlers.onOpenAddActivityLogDialog('deal-1')
    })
    fillValidForm(result)

    await act(async () => {
      await result.current.handlers.onSubmitAddActivityLog()
    })

    expect(result.current.uiState.isAddActivityLogDialogOpen).toBe(false)
    expect(result.current.data.activityLogForm.note).toBe('')
    expect(mockToasterCreate).toHaveBeenCalledWith({
      type: 'success',
      description: '活動履歴を登録しました',
    })
  })

  it('送信失敗時（Error）、errors.commonにそのメッセージが反映され、ダイアログは開いたままであること', async () => {
    mockMutateAsync.mockRejectedValueOnce(new Error('活動履歴の上限に達しています'))
    const { result } = customRenderHook(() => useCreateActivityLogHandler('customer-1'))

    act(() => {
      result.current.handlers.onOpenAddActivityLogDialog('deal-1')
    })
    fillValidForm(result)

    await act(async () => {
      await result.current.handlers.onSubmitAddActivityLog()
    })

    expect(result.current.data.activityLogFormErrors.common).toBe('活動履歴の上限に達しています')
    expect(result.current.uiState.isAddActivityLogDialogOpen).toBe(true)
  })

  it('送信失敗時（非Error）、errors.commonにフォールバックメッセージが入ること', async () => {
    mockMutateAsync.mockRejectedValueOnce('unexpected error')
    const { result } = customRenderHook(() => useCreateActivityLogHandler('customer-1'))

    act(() => {
      result.current.handlers.onOpenAddActivityLogDialog('deal-1')
    })
    fillValidForm(result)

    await act(async () => {
      await result.current.handlers.onSubmitAddActivityLog()
    })

    expect(result.current.data.activityLogFormErrors.common).toBe('活動履歴の登録に失敗しました')
  })

  it('isCreatingActivityLogがcreateActivityLogMutation.isPendingを反映すること', () => {
    setupMutation(true)
    const { result } = customRenderHook(() => useCreateActivityLogHandler('customer-1'))

    expect(result.current.uiState.isCreatingActivityLog).toBe(true)
  })

  it('onCloseAddActivityLogDialogを呼ぶと、isAddActivityLogDialogOpenがfalseになりフォーム値・エラーがリセットされること', () => {
    const { result } = customRenderHook(() => useCreateActivityLogHandler('customer-1'))

    act(() => {
      result.current.handlers.onOpenAddActivityLogDialog('deal-1')
      result.current.handlers.onChangeActivityLogFormField('note', 'Test note')
    })

    act(() => {
      result.current.handlers.onCloseAddActivityLogDialog()
    })

    expect(result.current.uiState.isAddActivityLogDialogOpen).toBe(false)
    expect(result.current.data.activityLogForm.note).toBe('')
  })
})
