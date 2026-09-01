import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act } from '@testing-library/react'

import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { useCreateCustomerMutation } from '@/features/Customers/Root/hooks/mutations/useCreateCustomerMutation'
import { toaster } from '@/components/ui/toaster'

import { useCreateCustomerHandler } from '../useCreateCustomerHandler'

vi.mock('@/features/Customers/Root/hooks/mutations/useCreateCustomerMutation', () => ({
  useCreateCustomerMutation: vi.fn(),
}))
vi.mock('@/components/ui/toaster', () => ({
  toaster: { create: vi.fn() },
}))

const mockUseCreateCustomerMutation = vi.mocked(useCreateCustomerMutation)
const mockToasterCreate = vi.mocked(toaster.create)
const mockMutateAsync = vi.fn()

const setupMutation = (isPending = false) => {
  mockUseCreateCustomerMutation.mockReturnValue({
    mutateAsync: mockMutateAsync,
    isPending,
  } as unknown as ReturnType<typeof useCreateCustomerMutation>)
}

const validForm = {
  companyName: 'Cedar & Vine Retail',
  industry: 'retail' as const,
  companySize: 120,
  contactName: 'Jamie Lee',
  phone: '+1 (415) 555-0100',
  email: 'jamie.lee@cedarvine.com',
}

const fillValidForm = (result: { current: ReturnType<typeof useCreateCustomerHandler> }) => {
  act(() => {
    Object.entries(validForm).forEach(([key, value]) => {
      result.current.handlers.onChangeCustomerFormField(key as keyof typeof validForm, value)
    })
  })
}

describe('useCreateCustomerHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setupMutation()
  })

  it('onOpenCreateCustomerDialogを呼ぶとisDialogOpenがtrueになること', () => {
    const { result } = customRenderHook(() => useCreateCustomerHandler())

    act(() => {
      result.current.handlers.onOpenCreateCustomerDialog()
    })

    expect(result.current.uiState.isDialogOpen).toBe(true)
  })

  it('onChangeCustomerFormFieldで指定したフィールドだけが更新されること', () => {
    const { result } = customRenderHook(() => useCreateCustomerHandler())

    act(() => {
      result.current.handlers.onChangeCustomerFormField('companyName', 'Cedar & Vine Retail')
    })

    expect(result.current.data.customerForm.companyName).toBe('Cedar & Vine Retail')
    expect(result.current.data.customerForm.contactName).toBe('')
  })

  it('バリデーション失敗時、errorsがセットされmutationが呼ばれないこと', async () => {
    const { result } = customRenderHook(() => useCreateCustomerHandler())

    await act(async () => {
      await result.current.handlers.onSubmitCreateCustomer()
    })

    expect(result.current.data.errors.companyName).toBe('会社名を入力してください')
    expect(mockMutateAsync).not.toHaveBeenCalled()
  })

  it('バリデーション成功時、mutateAsyncが入力値でそのまま呼ばれること', async () => {
    mockMutateAsync.mockResolvedValueOnce(undefined)
    const { result } = customRenderHook(() => useCreateCustomerHandler())

    fillValidForm(result)

    await act(async () => {
      await result.current.handlers.onSubmitCreateCustomer()
    })

    expect(mockMutateAsync).toHaveBeenCalledWith(validForm)
  })

  it('送信成功後、ダイアログが閉じてフォームがリセットされること', async () => {
    mockMutateAsync.mockResolvedValueOnce(undefined)
    const { result } = customRenderHook(() => useCreateCustomerHandler())

    act(() => {
      result.current.handlers.onOpenCreateCustomerDialog()
    })
    fillValidForm(result)

    await act(async () => {
      await result.current.handlers.onSubmitCreateCustomer()
    })

    expect(result.current.uiState.isDialogOpen).toBe(false)
    expect(result.current.data.customerForm.companyName).toBe('')
    expect(mockToasterCreate).toHaveBeenCalledWith({
      type: 'success',
      description: '顧客を登録しました',
    })
  })

  it('送信失敗時（Error）、errors.commonにそのメッセージが反映され、ダイアログは開いたままであること', async () => {
    mockMutateAsync.mockRejectedValueOnce(new Error('既に登録済みの会社です'))
    const { result } = customRenderHook(() => useCreateCustomerHandler())

    act(() => {
      result.current.handlers.onOpenCreateCustomerDialog()
    })
    fillValidForm(result)

    await act(async () => {
      await result.current.handlers.onSubmitCreateCustomer()
    })

    expect(result.current.data.errors.common).toBe('既に登録済みの会社です')
    expect(result.current.uiState.isDialogOpen).toBe(true)
  })

  it('送信失敗時（非Error）、errors.commonにフォールバックメッセージが入ること', async () => {
    mockMutateAsync.mockRejectedValueOnce('unexpected error')
    const { result } = customRenderHook(() => useCreateCustomerHandler())

    fillValidForm(result)

    await act(async () => {
      await result.current.handlers.onSubmitCreateCustomer()
    })

    expect(result.current.data.errors.common).toBe('顧客の登録に失敗しました')
  })

  it('isPendingがcreateCustomerMutation.isPendingを反映すること', () => {
    setupMutation(true)
    const { result } = customRenderHook(() => useCreateCustomerHandler())

    expect(result.current.uiState.isPending).toBe(true)
  })

  it('onCloseCreateCustomerDialogを呼ぶと、isDialogOpenがfalseになりフォーム値・エラーがリセットされること', () => {
    const { result } = customRenderHook(() => useCreateCustomerHandler())

    act(() => {
      result.current.handlers.onOpenCreateCustomerDialog()
      result.current.handlers.onChangeCustomerFormField('companyName', 'Test Co')
    })

    act(() => {
      result.current.handlers.onCloseCreateCustomerDialog()
    })

    expect(result.current.uiState.isDialogOpen).toBe(false)
    expect(result.current.data.customerForm.companyName).toBe('')
  })
})
