import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act } from '@testing-library/react'

import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { useCreateUserMutation } from '@/features/Admin/Users/Root/hooks/mutations/useCreateUserMutation'
import { toaster } from '@/components/ui/toaster'

import { useCreateUserHandler } from '../useCreateUserHandler'

vi.mock('@/features/Admin/Users/Root/hooks/mutations/useCreateUserMutation', () => ({
  useCreateUserMutation: vi.fn(),
}))
vi.mock('@/components/ui/toaster', () => ({
  toaster: { create: vi.fn() },
}))

const mockUseCreateUserMutation = vi.mocked(useCreateUserMutation)
const mockToasterCreate = vi.mocked(toaster.create)
const mockMutateAsync = vi.fn()

const setupMutation = (isPending = false) => {
  mockUseCreateUserMutation.mockReturnValue({
    mutateAsync: mockMutateAsync,
    isPending,
  } as unknown as ReturnType<typeof useCreateUserMutation>)
}

const validForm = {
  name: 'Priya Nair',
  email: 'priya.nair@novel.co',
  password: 'password',
  role: 'sales' as const,
}

const fillValidForm = (result: { current: ReturnType<typeof useCreateUserHandler> }) => {
  act(() => {
    Object.entries(validForm).forEach(([key, value]) => {
      result.current.handlers.onChangeUserFormField(key as keyof typeof validForm, value)
    })
  })
}

describe('useCreateUserHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setupMutation()
  })

  it('onOpenCreateUserDialogを呼ぶとisDialogOpenがtrueになること', () => {
    const { result } = customRenderHook(() => useCreateUserHandler())

    act(() => {
      result.current.handlers.onOpenCreateUserDialog()
    })

    expect(result.current.uiState.isDialogOpen).toBe(true)
  })

  it('onChangeUserFormFieldで指定したフィールドだけが更新されること', () => {
    const { result } = customRenderHook(() => useCreateUserHandler())

    act(() => {
      result.current.handlers.onChangeUserFormField('name', 'Priya Nair')
    })

    expect(result.current.data.userForm.name).toBe('Priya Nair')
    expect(result.current.data.userForm.email).toBe('')
  })

  it('バリデーション失敗時、errorsがセットされmutationが呼ばれないこと', async () => {
    const { result } = customRenderHook(() => useCreateUserHandler())

    await act(async () => {
      await result.current.handlers.onSubmitCreateUser()
    })

    expect(result.current.data.errors.name).toBe('表示名を入力してください')
    expect(mockMutateAsync).not.toHaveBeenCalled()
  })

  it('バリデーション成功時、mutateAsyncが入力値でそのまま呼ばれること', async () => {
    mockMutateAsync.mockResolvedValueOnce(undefined)
    const { result } = customRenderHook(() => useCreateUserHandler())

    fillValidForm(result)

    await act(async () => {
      await result.current.handlers.onSubmitCreateUser()
    })

    expect(mockMutateAsync).toHaveBeenCalledWith(validForm)
  })

  it('送信成功後、ダイアログが閉じてフォームがリセットされること', async () => {
    mockMutateAsync.mockResolvedValueOnce(undefined)
    const { result } = customRenderHook(() => useCreateUserHandler())

    act(() => {
      result.current.handlers.onOpenCreateUserDialog()
    })
    fillValidForm(result)

    await act(async () => {
      await result.current.handlers.onSubmitCreateUser()
    })

    expect(result.current.uiState.isDialogOpen).toBe(false)
    expect(result.current.data.userForm.name).toBe('')
    expect(mockToasterCreate).toHaveBeenCalledWith({
      type: 'success',
      description: 'ユーザーを登録しました',
    })
  })

  it('送信失敗時（Error）、errors.commonにそのメッセージが反映され、ダイアログは開いたままであること', async () => {
    mockMutateAsync.mockRejectedValueOnce(new Error('このメールアドレスは既に使用されています'))
    const { result } = customRenderHook(() => useCreateUserHandler())

    act(() => {
      result.current.handlers.onOpenCreateUserDialog()
    })
    fillValidForm(result)

    await act(async () => {
      await result.current.handlers.onSubmitCreateUser()
    })

    expect(result.current.data.errors.common).toBe('このメールアドレスは既に使用されています')
    expect(result.current.uiState.isDialogOpen).toBe(true)
  })

  it('送信失敗時（非Error）、errors.commonにフォールバックメッセージが入ること', async () => {
    mockMutateAsync.mockRejectedValueOnce('unexpected error')
    const { result } = customRenderHook(() => useCreateUserHandler())

    fillValidForm(result)

    await act(async () => {
      await result.current.handlers.onSubmitCreateUser()
    })

    expect(result.current.data.errors.common).toBe('ユーザーの登録に失敗しました')
  })

  it('isCreatingUserがcreateUserMutation.isPendingを反映すること', () => {
    setupMutation(true)
    const { result } = customRenderHook(() => useCreateUserHandler())

    expect(result.current.uiState.isCreatingUser).toBe(true)
  })

  it('onCloseCreateUserDialogを呼ぶと、isDialogOpenがfalseになりフォーム値・エラーがリセットされること', () => {
    const { result } = customRenderHook(() => useCreateUserHandler())

    act(() => {
      result.current.handlers.onOpenCreateUserDialog()
      result.current.handlers.onChangeUserFormField('name', 'Test User')
    })

    act(() => {
      result.current.handlers.onCloseCreateUserDialog()
    })

    expect(result.current.uiState.isDialogOpen).toBe(false)
    expect(result.current.data.userForm.name).toBe('')
  })
})
