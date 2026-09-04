import { useState } from 'react'

import { useGetCustomersQuery } from '@/features/Customers/Root/hooks/queries/useGetCustomersQuery'
import type { PaginationResponseItem } from '@/services/internal/backend/v1/types/response/customer'
import type { IndustryType } from '@/share/types/industryType'

// データ取得前(ローディング中)に一瞬だけ使う仮のページ情報
const DEFAULT_PAGINATION: PaginationResponseItem = {
  page: 1,
  pageSize: 10,
  totalCount: 0,
  totalPages: 0,
}

export const useGetCustomersHandler = () => {
  // 今何ページ目を見ているかを覚えておく状態
  const [page, setPage] = useState(1)
  // 業界フィルタの選択状態。undefinedは「全て表示」を意味する
  const [industry, setIndustry] = useState<IndustryType | undefined>(undefined)
  const customersQuery = useGetCustomersQuery({ page, industry })

  const onIndustryChange = (nextIndustry: IndustryType | undefined) => {
    // 絞り込み条件を変えたら1ページ目に戻す(前のページ番号のままだと該当件数が減って表示が空になりうるため)
    setPage(1)
    setIndustry(nextIndustry)
  }

  return {
    // customersQuery.dataはローディング中はundefinedなので、
    // ?.で安全に取り出しつつ、??で未取得の間だけ空配列/DEFAULT_PAGINATIONにフォールバックする
    data: {
      customers: customersQuery.data?.customers ?? [],
      pagination: customersQuery.data?.pagination ?? DEFAULT_PAGINATION,
      industry,
    },
    uiState: { isLoading: customersQuery.isLoading, isError: customersQuery.isError },
    // ページ切り替えボタンから呼ばれると、pageを更新して再取得させる
    handlers: { onPageChange: setPage, onIndustryChange },
  }
}
