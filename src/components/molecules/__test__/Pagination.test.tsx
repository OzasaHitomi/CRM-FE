import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { customRender } from '@/tests/helpers/customRender'

import { Pagination } from '../Pagination'

describe('Pagination', () => {
  it('ページ番号・Prev/Nextボタンが表示されること', () => {
    customRender(
      <Pagination
        pagination={{ page: 1, pageSize: 10, totalCount: 15, totalPages: 2 }}
        onPageChange={vi.fn()}
      />,
    )

    expect(screen.getByLabelText('Previous page')).toBeInTheDocument()
    expect(screen.getByLabelText('Next page')).toBeInTheDocument()
    expect(screen.getByLabelText('Page 2')).toBeInTheDocument()
  })

  it('ページ番号をクリックすると、onPageChangeが正しいページ番号で呼ばれること', async () => {
    const onPageChange = vi.fn()
    const user = userEvent.setup()
    customRender(
      <Pagination
        pagination={{ page: 1, pageSize: 10, totalCount: 15, totalPages: 2 }}
        onPageChange={onPageChange}
      />,
    )

    await user.click(screen.getByLabelText('Page 2'))

    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('Nextをクリックすると、onPageChangeが次のページ番号で呼ばれること', async () => {
    const onPageChange = vi.fn()
    const user = userEvent.setup()
    customRender(
      <Pagination
        pagination={{ page: 1, pageSize: 10, totalCount: 15, totalPages: 2 }}
        onPageChange={onPageChange}
      />,
    )

    await user.click(screen.getByLabelText('Next page'))

    expect(onPageChange).toHaveBeenCalledWith(2)
  })
})
