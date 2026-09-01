import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act } from '@testing-library/react'
import { useQueryClient } from '@tanstack/react-query'

import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { useLoginMutation } from '@/features/Login/Root/hooks/mutations/useLoginMutation'

import { useLoginMutationHandler } from '../useLoginMutationHandler'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('@/features/Login/Root/hooks/mutations/useLoginMutation', () => ({
  useLoginMutation: vi.fn(),
}))

const mockUseLoginMutation = vi.mocked(useLoginMutation)
const mockMutateAsync = vi.fn()
const mockClear = vi.fn()

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>()
  return {
    ...actual,
    useQueryClient: vi.fn(() => ({ clear: mockClear })),
  }
})

const setupMutation = (isPending = false) => {
  mockUseLoginMutation.mockReturnValue({
    mutateAsync: mockMutateAsync,
    isPending,
  } as unknown as ReturnType<typeof useLoginMutation>)
}

const fillValidForm = (result: { current: ReturnType<typeof useLoginMutationHandler> }) => {
  act(() => {
    result.current.handlers.onChangeLoginFormField('email', 'test@example.com')
    result.current.handlers.onChangeLoginFormField('password', 'password')
  })
}

describe('useLoginMutationHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useQueryClient).mockReturnValue({ clear: mockClear } as unknown as ReturnType<
      typeof useQueryClient
    >)
    setupMutation()
  })

  describe('onChangeLoginFormField', () => {
    it('emailを変更するとloginForm.emailだけが更新されること', () => {
      const { result } = customRenderHook(() => useLoginMutationHandler())

      act(() => {
        result.current.handlers.onChangeLoginFormField('email', 'test@example.com')
      })

      expect(result.current.data.loginForm).toEqual({ email: 'test@example.com', password: '' })
    })

    it('passwordを変更するとloginForm.passwordだけが更新されること', () => {
      const { result } = customRenderHook(() => useLoginMutationHandler())

      act(() => {
        result.current.handlers.onChangeLoginFormField('password', 'secret')
      })

      expect(result.current.data.loginForm).toEqual({ email: '', password: 'secret' })
    })
  })

  describe('onSubmitLogin - バリデーション失敗時', () => {
    it('emailが空の場合、必須エラーを表示しmutationを呼ばないこと', async () => {
      const { result } = customRenderHook(() => useLoginMutationHandler())

      act(() => {
        result.current.handlers.onChangeLoginFormField('password', 'password')
      })
      await act(async () => {
        await result.current.handlers.onSubmitLogin()
      })

      expect(result.current.data.errors.email).toBe('メールアドレスを入力してください')
      expect(mockMutateAsync).not.toHaveBeenCalled()
    })

    it('emailが不正な形式の場合、形式エラーを表示すること', async () => {
      const { result } = customRenderHook(() => useLoginMutationHandler())

      act(() => {
        result.current.handlers.onChangeLoginFormField('email', 'invalid-email')
        result.current.handlers.onChangeLoginFormField('password', 'password')
      })
      await act(async () => {
        await result.current.handlers.onSubmitLogin()
      })

      expect(result.current.data.errors.email).toBe('メールアドレスの形式が正しくありません')
    })

    it('passwordが空の場合、必須エラーを表示すること', async () => {
      const { result } = customRenderHook(() => useLoginMutationHandler())

      act(() => {
        result.current.handlers.onChangeLoginFormField('email', 'test@example.com')
      })
      await act(async () => {
        await result.current.handlers.onSubmitLogin()
      })

      expect(result.current.data.errors.password).toBe('パスワードを入力してください')
    })

    it('バリデーション失敗時はnavigateが呼ばれないこと', async () => {
      const { result } = customRenderHook(() => useLoginMutationHandler())

      await act(async () => {
        await result.current.handlers.onSubmitLogin()
      })

      expect(mockNavigate).not.toHaveBeenCalled()
    })
  })

  describe('onSubmitLogin - バリデーション成功・API成功時', () => {
    it('mutateAsyncが{ email, password }で呼ばれること', async () => {
      mockMutateAsync.mockResolvedValueOnce(undefined)
      const { result } = customRenderHook(() => useLoginMutationHandler())

      fillValidForm(result)
      await act(async () => {
        await result.current.handlers.onSubmitLogin()
      })

      expect(mockMutateAsync).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
      })
    })

    it('成功後、navigateが"/customers"で呼ばれること', async () => {
      mockMutateAsync.mockResolvedValueOnce(undefined)
      const { result } = customRenderHook(() => useLoginMutationHandler())

      fillValidForm(result)
      await act(async () => {
        await result.current.handlers.onSubmitLogin()
      })

      expect(mockNavigate).toHaveBeenCalledWith('/customers')
    })

    it('成功後、前ユーザーのキャッシュをすべて削除してから画面遷移すること', async () => {
      mockMutateAsync.mockResolvedValueOnce(undefined)
      const { result } = customRenderHook(() => useLoginMutationHandler())

      fillValidForm(result)
      await act(async () => {
        await result.current.handlers.onSubmitLogin()
      })

      expect(mockClear).toHaveBeenCalledOnce()
      expect(mockClear.mock.invocationCallOrder[0]).toBeLessThan(
        mockNavigate.mock.invocationCallOrder[0],
      )
    })

    it('直前のerrorsが事前にクリアされること', async () => {
      const { result } = customRenderHook(() => useLoginMutationHandler())

      // 1回目：バリデーション失敗させて errors をセットする
      await act(async () => {
        await result.current.handlers.onSubmitLogin()
      })
      expect(result.current.data.errors.email).toBeDefined()

      // 2回目：正しい値を入れて再送信する
      mockMutateAsync.mockResolvedValueOnce(undefined)
      fillValidForm(result)
      await act(async () => {
        await result.current.handlers.onSubmitLogin()
      })

      expect(result.current.data.errors).toEqual({})
    })
  })

  describe('onSubmitLogin - バリデーション成功・API失敗時', () => {
    it('Errorがthrowされた場合、errors.commonにそのメッセージが反映されること', async () => {
      mockMutateAsync.mockRejectedValueOnce(
        new Error('メールアドレスまたはパスワードが正しくありません'),
      )
      const { result } = customRenderHook(() => useLoginMutationHandler())

      fillValidForm(result)
      await act(async () => {
        await result.current.handlers.onSubmitLogin()
      })

      expect(result.current.data.errors.common).toBe(
        'メールアドレスまたはパスワードが正しくありません',
      )
    })

    it('非Errorオブジェクトがthrowされた場合、フォールバックメッセージが入ること', async () => {
      mockMutateAsync.mockRejectedValueOnce('unexpected string error')
      const { result } = customRenderHook(() => useLoginMutationHandler())

      fillValidForm(result)
      await act(async () => {
        await result.current.handlers.onSubmitLogin()
      })

      expect(result.current.data.errors.common).toBe('ログインに失敗しました')
    })

    it('失敗時はnavigateが呼ばれないこと', async () => {
      mockMutateAsync.mockRejectedValueOnce(new Error('failed'))
      const { result } = customRenderHook(() => useLoginMutationHandler())

      fillValidForm(result)
      await act(async () => {
        await result.current.handlers.onSubmitLogin()
      })

      expect(mockNavigate).not.toHaveBeenCalled()
    })
  })

  describe('uiState.isPending', () => {
    it('useLoginMutationがisPending: trueを返す場合、uiState.isPendingもtrueになること', () => {
      setupMutation(true)
      const { result } = customRenderHook(() => useLoginMutationHandler())

      expect(result.current.uiState.isPending).toBe(true)
    })
  })
})
