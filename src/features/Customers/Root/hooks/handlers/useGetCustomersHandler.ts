import { useState } from 'react'

import { useGetCustomersQuery } from '@/features/Customers/Root/hooks/queries/useGetCustomersQuery'
import type { PaginationResponseItem } from '@/services/internal/backend/v1/types/response/customer'

// データ取得前(ローディング中)に一瞬だけ使う仮のページ情報
const DEFAULT_PAGINATION: PaginationResponseItem = { page: 1, pageSize: 10, totalCount: 0, totalPages: 0 }

export const useGetCustomersHandler = () => {
  // 今何ページ目を見ているかを覚えておく状態
  const [page, setPage] = useState(1)
  const customersQuery = useGetCustomersQuery(page)

  return {
    // customersQuery.dataはローディング中はundefinedなので、
    // ?.で安全に取り出しつつ、??で未取得の間だけ空配列/DEFAULT_PAGINATIONにフォールバックする
    data: {
      customers: customersQuery.data?.customers ?? [],
      pagination: customersQuery.data?.pagination ?? DEFAULT_PAGINATION,
    },
    uiState: { isLoading: customersQuery.isLoading, isError: customersQuery.isError },
    // ページ切り替えボタンから呼ばれると、pageを更新して再取得させる
    handlers: { onPageChange: setPage },
  }
}
