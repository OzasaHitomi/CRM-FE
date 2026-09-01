import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act } from '@testing-library/react'

import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { useCreateDealMutation } from '@/features/Customers/[id]/Root/hooks/mutations/useCreateDealMutation'
import { toaster } from '@/components/ui/toaster'

import { useCreateDealHandler } from '../useCreateDealHandler'

vi.mock('@/features/Customers/[id]/Root/hooks/mutations/useCreateDealMutation', () => ({
  useCreateDealMutation: vi.fn(),
}))
vi.mock('@/components/ui/toaster', () => ({
  toaster: { create: vi.fn() },
}))

const mockUseCreateDealMutation = vi.mocked(useCreateDealMutation)
const mockToasterCreate = vi.mocked(toaster.create)
const mockMutateAsync = vi.fn()

const setupMutation = (isPending = false) => {
  mockUseCreateDealMutation.mockReturnValue({
    mutateAsync: mockMutateAsync,
    isPending,
  } as unknown as ReturnType<typeof useCreateDealMutation>)
}

const validForm = {
  title: 'Warehouse analytics add-on',
  amount: 18000,
  plan: 'professional' as const,
  licenseCount: 40,
  contractPeriod: 12,
}

const fillValidForm = (result: { current: ReturnType<typeof useCreateDealHandler> }) => {
  act(() => {
    Object.entries(validForm).forEach(([key, value]) => {
      result.current.handlers.onChangeDealFormField(key as keyof typeof validForm, value)
    })
  })
}

describe('useCreateDealHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setupMutation()
  })

  it('customerIdをuseCreateDealMutationにそのまま渡すこと', () => {
    customRenderHook(() => useCreateDealHandler('customer-1'))

    expect(mockUseCreateDealMutation).toHaveBeenCalledWith('customer-1')
  })

  it('onOpenCreateDealDialogを呼ぶとisDialogOpenがtrueになること', () => {
    const { result } = customRenderHook(() => useCreateDealHandler('customer-1'))

    act(() => {
      result.current.handlers.onOpenCreateDealDialog()
    })

    expect(result.current.uiState.isAddDealDialogOpen).toBe(true)
  })

  it('onChangeDealFormFieldで指定したフィールドだけが更新されること', () => {
    const { result } = customRenderHook(() => useCreateDealHandler('customer-1'))

    act(() => {
      result.current.handlers.onChangeDealFormField('title', 'Pilot program')
    })

    expect(result.current.data.dealForm.title).toBe('Pilot program')
    expect(result.current.data.dealForm.amount).toBe(0)
  })

  it('バリデーション失敗時、errorsがセットされmutationが呼ばれないこと', async () => {
    const { result } = customRenderHook(() => useCreateDealHandler('customer-1'))

    await act(async () => {
      await result.current.handlers.onSubmitCreateDeal()
    })

    expect(result.current.data.dealFormErrors.title).toBe('商談名を入力してください')
    expect(mockMutateAsync).not.toHaveBeenCalled()
  })

  it('バリデーション成功時、mutateAsyncが入力値でそのまま呼ばれること', async () => {
    mockMutateAsync.mockResolvedValueOnce(undefined)
    const { result } = customRenderHook(() => useCreateDealHandler('customer-1'))

    fillValidForm(result)

    await act(async () => {
      await result.current.handlers.onSubmitCreateDeal()
    })

    expect(mockMutateAsync).toHaveBeenCalledWith(validForm)
  })

  it('送信成功後、ダイアログが閉じてフォームがリセットされること', async () => {
    mockMutateAsync.mockResolvedValueOnce(undefined)
    const { result } = customRenderHook(() => useCreateDealHandler('customer-1'))

    act(() => {
      result.current.handlers.onOpenCreateDealDialog()
    })
    fillValidForm(result)

    await act(async () => {
      await result.current.handlers.onSubmitCreateDeal()
    })

    expect(result.current.uiState.isAddDealDialogOpen).toBe(false)
    expect(result.current.data.dealForm.title).toBe('')
    expect(mockToasterCreate).toHaveBeenCalledWith({
      type: 'success',
      description: '商談を登録しました',
    })
  })

  it('送信失敗時（Error）、errors.commonにそのメッセージが反映され、ダイアログは開いたままであること', async () => {
    mockMutateAsync.mockRejectedValueOnce(new Error('商談数の上限に達しています'))
    const { result } = customRenderHook(() => useCreateDealHandler('customer-1'))

    act(() => {
      result.current.handlers.onOpenCreateDealDialog()
    })
    fillValidForm(result)

    await act(async () => {
      await result.current.handlers.onSubmitCreateDeal()
    })

    expect(result.current.data.dealFormErrors.common).toBe('商談数の上限に達しています')
    expect(result.current.uiState.isAddDealDialogOpen).toBe(true)
  })

  it('送信失敗時（非Error）、errors.commonにフォールバックメッセージが入ること', async () => {
    mockMutateAsync.mockRejectedValueOnce('unexpected error')
    const { result } = customRenderHook(() => useCreateDealHandler('customer-1'))

    fillValidForm(result)

    await act(async () => {
      await result.current.handlers.onSubmitCreateDeal()
    })

    expect(result.current.data.dealFormErrors.common).toBe('商談の登録に失敗しました')
  })

  it('isCreatingDealがcreateDealMutation.isPendingを反映すること', () => {
    setupMutation(true)
    const { result } = customRenderHook(() => useCreateDealHandler('customer-1'))

    expect(result.current.uiState.isCreatingDeal).toBe(true)
  })

  it('onCloseCreateDealDialogを呼ぶと、isDialogOpenがfalseになりフォーム値・エラーがリセットされること', () => {
    const { result } = customRenderHook(() => useCreateDealHandler('customer-1'))

    act(() => {
      result.current.handlers.onOpenCreateDealDialog()
      result.current.handlers.onChangeDealFormField('title', 'Test Deal')
    })

    act(() => {
      result.current.handlers.onCloseCreateDealDialog()
    })

    expect(result.current.uiState.isAddDealDialogOpen).toBe(false)
    expect(result.current.data.dealForm.title).toBe('')
  })
})
