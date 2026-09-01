import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act } from '@testing-library/react'

import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { useGetMeQuery } from '@/share/hooks/queries/useGetMeQuery'
import { useAssignCustomerMutation } from '@/features/Customers/hooks/mutations/useAssignCustomerMutation'
import { useUnassignCustomerMutation } from '@/features/Customers/hooks/mutations/useUnassignCustomerMutation'
import { toaster } from '@/components/ui/toaster'
import type { MeResponse } from '@/services/internal/backend/v1/types/response/auth'

import { useAssignCustomerHandler } from '../useAssignCustomerHandler'

vi.mock('@/share/hooks/queries/useGetMeQuery', () => ({
  useGetMeQuery: vi.fn(),
}))
vi.mock('@/features/Customers/hooks/mutations/useAssignCustomerMutation', () => ({
  useAssignCustomerMutation: vi.fn(),
}))
vi.mock('@/features/Customers/hooks/mutations/useUnassignCustomerMutation', () => ({
  useUnassignCustomerMutation: vi.fn(),
}))
vi.mock('@/components/ui/toaster', () => ({
  toaster: { create: vi.fn() },
}))

const mockUseGetMeQuery = vi.mocked(useGetMeQuery)
const mockUseAssignCustomerMutation = vi.mocked(useAssignCustomerMutation)
const mockUseUnassignCustomerMutation = vi.mocked(useUnassignCustomerMutation)
const mockToasterCreate = vi.mocked(toaster.create)

const mockAssignMutateAsync = vi.fn()
const mockUnassignMutateAsync = vi.fn()

const mockMe: MeResponse = { userId: 'user-1', role: 'sales', name: 'Emily Chen' }

const setupMutations = (overrides?: { isAssigning?: boolean; isUnassigning?: boolean }) => {
  mockUseAssignCustomerMutation.mockReturnValue({
    mutateAsync: mockAssignMutateAsync,
    isPending: overrides?.isAssigning ?? false,
  } as unknown as ReturnType<typeof useAssignCustomerMutation>)
  mockUseUnassignCustomerMutation.mockReturnValue({
    mutateAsync: mockUnassignMutateAsync,
    isPending: overrides?.isUnassigning ?? false,
  } as unknown as ReturnType<typeof useUnassignCustomerMutation>)
}

describe('useAssignCustomerHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseGetMeQuery.mockReturnValue({ data: mockMe } as ReturnType<typeof useGetMeQuery>)
    setupMutations()
  })

  it('useGetMeQueryのdataがdata.meにそのまま反映されること', () => {
    const { result } = customRenderHook(() => useAssignCustomerHandler())

    expect(result.current.data.me).toEqual(mockMe)
  })

  it('onAssignToMeを呼ぶと、customerIdでassignCustomerMutation.mutateAsyncが呼ばれること', async () => {
    mockAssignMutateAsync.mockResolvedValueOnce(undefined)
    const { result } = customRenderHook(() => useAssignCustomerHandler())

    await act(async () => {
      await result.current.handlers.onAssignToMe('customer-1')
    })

    expect(mockAssignMutateAsync).toHaveBeenCalledWith('customer-1')
    expect(mockToasterCreate).toHaveBeenCalledWith({
      type: 'success',
      description: '担当者を割り当てました',
    })
  })

  it('onAssignToMeが失敗した場合、エラートーストを表示すること', async () => {
    mockAssignMutateAsync.mockRejectedValueOnce(new Error('既に他の担当者にアサインされています'))
    const { result } = customRenderHook(() => useAssignCustomerHandler())

    await act(async () => {
      await result.current.handlers.onAssignToMe('customer-1')
    })

    expect(mockToasterCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'error',
        description: '既に他の担当者にアサインされています',
      }),
    )
  })

  it('onUnassignを呼ぶと、customerIdでunassignCustomerMutation.mutateAsyncが呼ばれること', async () => {
    mockUnassignMutateAsync.mockResolvedValueOnce(undefined)
    const { result } = customRenderHook(() => useAssignCustomerHandler())

    await act(async () => {
      await result.current.handlers.onUnassign('customer-1')
    })

    expect(mockUnassignMutateAsync).toHaveBeenCalledWith('customer-1')
    expect(mockToasterCreate).toHaveBeenCalledWith({
      type: 'success',
      description: '担当を解除しました',
    })
  })

  it('onUnassignが失敗した場合、エラートーストを表示すること', async () => {
    mockUnassignMutateAsync.mockRejectedValueOnce(new Error('権限がありません'))
    const { result } = customRenderHook(() => useAssignCustomerHandler())

    await act(async () => {
      await result.current.handlers.onUnassign('customer-1')
    })

    expect(mockToasterCreate).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'error', description: '権限がありません' }),
    )
  })

  it('isAssigningCustomer/isUnassigningCustomerが各mutationのisPendingを反映すること', () => {
    setupMutations({ isAssigning: true, isUnassigning: true })
    const { result } = customRenderHook(() => useAssignCustomerHandler())

    expect(result.current.uiState.isAssigningCustomer).toBe(true)
    expect(result.current.uiState.isUnassigningCustomer).toBe(true)
  })
})
