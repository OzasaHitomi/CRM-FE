import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act } from '@testing-library/react'

import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { useUpdateCustomerMutation } from '@/features/Customers/[id]/Root/hooks/mutations/useUpdateCustomerMutation'
import { toaster } from '@/components/ui/toaster'
import type { GetCustomerResponse } from '@/services/internal/backend/v1/types/response/customer'

import { useUpdateCustomerHandler } from '../useUpdateCustomerHandler'

vi.mock('@/features/Customers/[id]/Root/hooks/mutations/useUpdateCustomerMutation', () => ({
  useUpdateCustomerMutation: vi.fn(),
}))
vi.mock('@/components/ui/toaster', () => ({
  toaster: { create: vi.fn() },
}))

const mockUseUpdateCustomerMutation = vi.mocked(useUpdateCustomerMutation)
const mockToasterCreate = vi.mocked(toaster.create)
const mockMutateAsync = vi.fn()

const setupMutation = (isPending = false) => {
  mockUseUpdateCustomerMutation.mockReturnValue({
    mutateAsync: mockMutateAsync,
    isPending,
  } as unknown as ReturnType<typeof useUpdateCustomerMutation>)
}

const mockCustomer: GetCustomerResponse = {
  customerId: 'customer-1',
  companyName: 'Northwind Logistics',
  industry: 'manufacturing',
  companySize: 850,
  contactName: 'Grace Halvorsen',
  phone: '+1 (415) 555-0182',
  email: 'grace.h@northwind.com',
  assignedUser: null,
  deals: [],
}

describe('useUpdateCustomerHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setupMutation()
  })

  it('onOpenEditCustomerDialogを呼ぶと、customerの値でcustomerFormが初期化されisDialogOpenがtrueになること', () => {
    const { result } = customRenderHook(() => useUpdateCustomerHandler('customer-1'))

    act(() => {
      result.current.handlers.onOpenEditCustomerDialog(mockCustomer)
    })

    expect(result.current.data.customerForm).toEqual({
      companyName: 'Northwind Logistics',
      industry: 'manufacturing',
      companySize: 850,
      contactName: 'Grace Halvorsen',
      phone: '+1 (415) 555-0182',
      email: 'grace.h@northwind.com',
    })
    expect(result.current.uiState.isEditCustomerDialogOpen).toBe(true)
  })

  it('onChangeCustomerFormFieldで指定したフィールドだけが更新されること', () => {
    const { result } = customRenderHook(() => useUpdateCustomerHandler('customer-1'))

    act(() => {
      result.current.handlers.onOpenEditCustomerDialog(mockCustomer)
      result.current.handlers.onChangeCustomerFormField('companyName', 'Updated Name')
    })

    expect(result.current.data.customerForm.companyName).toBe('Updated Name')
    expect(result.current.data.customerForm.contactName).toBe('Grace Halvorsen')
  })

  it('バリデーション失敗時、errorsがセットされmutationが呼ばれないこと', async () => {
    const { result } = customRenderHook(() => useUpdateCustomerHandler('customer-1'))

    act(() => {
      result.current.handlers.onOpenEditCustomerDialog(mockCustomer)
      result.current.handlers.onChangeCustomerFormField('companyName', '')
    })

    await act(async () => {
      await result.current.handlers.onSubmitEditCustomer()
    })

    expect(result.current.data.customerFormErrors.companyName).toBe('会社名を入力してください')
    expect(mockMutateAsync).not.toHaveBeenCalled()
  })

  it('バリデーション成功時、mutateAsyncがcustomerIdと入力値で呼ばれること', async () => {
    mockMutateAsync.mockResolvedValueOnce(undefined)
    const { result } = customRenderHook(() => useUpdateCustomerHandler('customer-1'))

    act(() => {
      result.current.handlers.onOpenEditCustomerDialog(mockCustomer)
    })

    await act(async () => {
      await result.current.handlers.onSubmitEditCustomer()
    })

    expect(mockMutateAsync).toHaveBeenCalledWith({
      customerId: 'customer-1',
      data: {
        companyName: 'Northwind Logistics',
        industry: 'manufacturing',
        companySize: 850,
        contactName: 'Grace Halvorsen',
        phone: '+1 (415) 555-0182',
        email: 'grace.h@northwind.com',
      },
    })
  })

  it('送信成功後、ダイアログが閉じること', async () => {
    mockMutateAsync.mockResolvedValueOnce(undefined)
    const { result } = customRenderHook(() => useUpdateCustomerHandler('customer-1'))

    act(() => {
      result.current.handlers.onOpenEditCustomerDialog(mockCustomer)
    })

    await act(async () => {
      await result.current.handlers.onSubmitEditCustomer()
    })

    expect(result.current.uiState.isEditCustomerDialogOpen).toBe(false)
    expect(mockToasterCreate).toHaveBeenCalledWith({
      type: 'success',
      description: '顧客情報を更新しました',
    })
  })

  it('送信失敗時（Error）、errors.commonにそのメッセージが反映され、ダイアログは開いたままであること', async () => {
    mockMutateAsync.mockRejectedValueOnce(new Error('顧客が見つかりません'))
    const { result } = customRenderHook(() => useUpdateCustomerHandler('customer-1'))

    act(() => {
      result.current.handlers.onOpenEditCustomerDialog(mockCustomer)
    })

    await act(async () => {
      await result.current.handlers.onSubmitEditCustomer()
    })

    expect(result.current.data.customerFormErrors.common).toBe('顧客が見つかりません')
    expect(result.current.uiState.isEditCustomerDialogOpen).toBe(true)
  })

  it('送信失敗時（非Error）、errors.commonにフォールバックメッセージが入ること', async () => {
    mockMutateAsync.mockRejectedValueOnce('unexpected error')
    const { result } = customRenderHook(() => useUpdateCustomerHandler('customer-1'))

    act(() => {
      result.current.handlers.onOpenEditCustomerDialog(mockCustomer)
    })

    await act(async () => {
      await result.current.handlers.onSubmitEditCustomer()
    })

    expect(result.current.data.customerFormErrors.common).toBe('顧客情報の更新に失敗しました')
  })

  it('isUpdatingCustomerがupdateCustomerMutation.isPendingを反映すること', () => {
    setupMutation(true)
    const { result } = customRenderHook(() => useUpdateCustomerHandler('customer-1'))

    expect(result.current.uiState.isUpdatingCustomer).toBe(true)
  })

  it('onCloseEditCustomerDialogを呼ぶと、isDialogOpenがfalseになりerrorsがリセットされること', async () => {
    const { result } = customRenderHook(() => useUpdateCustomerHandler('customer-1'))

    act(() => {
      result.current.handlers.onOpenEditCustomerDialog(mockCustomer)
      result.current.handlers.onChangeCustomerFormField('companyName', '')
    })
    await act(async () => {
      await result.current.handlers.onSubmitEditCustomer()
    })

    act(() => {
      result.current.handlers.onCloseEditCustomerDialog()
    })

    expect(result.current.uiState.isEditCustomerDialogOpen).toBe(false)
    expect(result.current.data.customerFormErrors).toEqual({})
  })
})
