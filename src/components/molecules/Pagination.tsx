import { ButtonGroup, Flex, IconButton, Pagination as ChakraPagination } from '@chakra-ui/react'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'

import type { PaginationResponseItem } from '@/services/internal/backend/v1/types/response/customer'

// 一覧系の画面で使い回せる、汎用的なページ切り替え部品
type PaginationProps = {
  pagination: PaginationResponseItem
  onPageChange: (page: number) => void
}

export const Pagination = ({ pagination, onPageChange }: PaginationProps) => {
  const { page, pageSize, totalCount } = pagination

  return (
    // 表の幅いっぱいに広げたうえで、中身(ButtonGroup)を中央寄せにする
    <Flex justify='center' mt='4'>
      <ChakraPagination.Root
        count={totalCount}
        pageSize={pageSize}
        page={page}
        // Chakraは{page, pageSize}を渡してくるので、page番号だけ取り出して呼び出し元に伝える
        onPageChange={(details) => onPageChange(details.page)}
      >
        <ButtonGroup variant='ghost' size='sm'>
          <ChakraPagination.PrevTrigger asChild>
            <IconButton aria-label='Previous page'>
              <LuChevronLeft />
            </IconButton>
          </ChakraPagination.PrevTrigger>

          {/* ChakraPagination.Itemsは総ページ数分のページ番号ボタンを自動的に並べてくれる部品で、
          render関数は「そのボタン1個をどう見せるか」を指定している。
          item.valueが各ボタンのページ番号、
          _selectedは今表示中のページと一致したボタンにだけ適用されるスタイル(枠線付きのoutline) */}
          <ChakraPagination.Items
            render={(item) => (
              <IconButton aria-label={`Page ${item.value}`} variant={{ base: 'ghost', _selected: 'outline' }}>
                {item.value}
              </IconButton>
            )}
          />

          <ChakraPagination.NextTrigger asChild>
            <IconButton aria-label='Next page'>
              <LuChevronRight />
            </IconButton>
          </ChakraPagination.NextTrigger>
        </ButtonGroup>
      </ChakraPagination.Root>
    </Flex>
  )
}
