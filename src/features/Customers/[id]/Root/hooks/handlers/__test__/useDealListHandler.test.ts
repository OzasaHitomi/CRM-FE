import { describe, expect, it } from 'vitest'
import { act } from '@testing-library/react'

import { customRenderHook } from '@/tests/helpers/customRenderHook'

import { useDealListHandler } from '../useDealListHandler'

describe('useDealListHandler', () => {
  it('初期状態ではexpandedDealIdがnullであること', () => {
    const { result } = customRenderHook(() => useDealListHandler())

    expect(result.current.uiState.expandedDealId).toBeNull()
  })

  it('onToggleDealExpandを呼ぶと、そのdealIdがexpandedDealIdになること', () => {
    const { result } = customRenderHook(() => useDealListHandler())

    act(() => {
      result.current.handlers.onToggleDealExpand('deal-1')
    })

    expect(result.current.uiState.expandedDealId).toBe('deal-1')
  })

  it('展開中のdealで再度onToggleDealExpandを呼ぶと、閉じてnullに戻ること', () => {
    const { result } = customRenderHook(() => useDealListHandler())

    act(() => {
      result.current.handlers.onToggleDealExpand('deal-1')
    })
    act(() => {
      result.current.handlers.onToggleDealExpand('deal-1')
    })

    expect(result.current.uiState.expandedDealId).toBeNull()
  })

  it('展開中に別のdealでonToggleDealExpandを呼ぶと、そちらに切り替わること', () => {
    const { result } = customRenderHook(() => useDealListHandler())

    act(() => {
      result.current.handlers.onToggleDealExpand('deal-1')
    })
    act(() => {
      result.current.handlers.onToggleDealExpand('deal-2')
    })

    expect(result.current.uiState.expandedDealId).toBe('deal-2')
  })
})
