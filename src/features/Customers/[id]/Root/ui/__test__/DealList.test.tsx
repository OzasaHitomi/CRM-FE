import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { customRender } from '@/tests/helpers/customRender'
import type { DealResponseItem } from '@/services/internal/backend/v1/types/response/customer'

import { DealList } from '../DealList'

const mockDeals: DealResponseItem[] = [
  {
    dealId: 'deal-1',
    title: 'Enterprise rollout — 2026',
    status: 'negotiation',
    amount: 84000,
    plan: 'enterprise',
    licenseCount: 120,
    contractPeriod: 24,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    activityLogs: [
      {
        activityLogId: 'log-1',
        type: 'call',
        activityDate: '2026-01-10',
        note: 'Discovery call',
      },
    ],
  },
  {
    dealId: 'deal-2',
    title: 'Pilot program',
    status: 'closed_won',
    amount: 6500,
    plan: 'starter',
    licenseCount: 10,
    contractPeriod: 6,
    createdAt: new Date('2026-01-05T00:00:00.000Z'),
    activityLogs: [],
  },
]

const renderList = (overrides?: {
  deals?: DealResponseItem[]
  expandedDealId?: string | null
  canManageDeals?: boolean
  isUpdatingDealStatus?: boolean
}) => {
  const onToggleDealExpand = vi.fn()
  const onSelectDealStatus = vi.fn()
  const onOpenEditDealDialog = vi.fn()
  const onOpenAddActivityLogDialog = vi.fn()
  const onOpenEditActivityLogDialog = vi.fn()

  customRender(
    <DealList
      deals={overrides?.deals ?? mockDeals}
      expandedDealId={overrides?.expandedDealId ?? null}
      canManageDeals={overrides?.canManageDeals ?? true}
      isUpdatingDealStatus={overrides?.isUpdatingDealStatus ?? false}
      onToggleDealExpand={onToggleDealExpand}
      onSelectDealStatus={onSelectDealStatus}
      onOpenEditDealDialog={onOpenEditDealDialog}
      onOpenAddActivityLogDialog={onOpenAddActivityLogDialog}
      onOpenEditActivityLogDialog={onOpenEditActivityLogDialog}
    />,
  )

  return {
    onToggleDealExpand,
    onSelectDealStatus,
    onOpenEditDealDialog,
    onOpenAddActivityLogDialog,
    onOpenEditActivityLogDialog,
  }
}

describe('DealList', () => {
  it('各dealのタイトル・ステータスを表示すること', () => {
    renderList()

    expect(screen.getByText('Enterprise rollout — 2026')).toBeInTheDocument()
    // Pipeline Stageのピルも同じ文字列を持つため、複数ヒットを許容する
    expect(screen.getAllByText('negotiation').length).toBeGreaterThan(0)
  })

  it('金額をカンマ区切り・$付きで表示すること', () => {
    renderList()

    expect(screen.getByText('$84,000')).toBeInTheDocument()
  })

  it('dealsが空配列の場合、EmptyStateが表示され行が無いこと', () => {
    renderList({ deals: [] })

    expect(screen.getByText('No deals yet')).toBeInTheDocument()
    expect(screen.queryAllByTestId('deal-row')).toHaveLength(0)
  })

  it('未展開の場合、Plan等の詳細が表示されないこと', () => {
    renderList()

    // Accordionの仕様上、閉じていてもDOMからは消えないため、可視性で判定する
    expect(screen.getByText('enterprise')).not.toBeVisible()
  })

  it('行をクリックすると、onToggleDealExpandがdealIdで呼ばれること', async () => {
    const user = userEvent.setup()
    const { onToggleDealExpand } = renderList()

    await user.click(screen.getByText('Enterprise rollout — 2026'))

    expect(onToggleDealExpand).toHaveBeenCalledWith('deal-1')
  })

  it('expandedDealIdが一致するdealのPlan/License Count/Contract Periodが表示されること', () => {
    renderList({ expandedDealId: 'deal-1' })

    expect(screen.getByText('enterprise')).toBeInTheDocument()
    expect(screen.getByText('120')).toBeInTheDocument()
    expect(screen.getByText('24')).toBeInTheDocument()
  })

  it('activityLogsがある場合、種別ラベル・メモ・日付が表示されること', () => {
    renderList({ expandedDealId: 'deal-1' })

    expect(screen.getByText('Call')).toBeInTheDocument()
    expect(screen.getByText('Discovery call')).toBeInTheDocument()
    expect(screen.getByText('2026-01-10')).toBeInTheDocument()
  })

  it('activityLogsが空の場合、EmptyStateが表示されること', () => {
    renderList({ expandedDealId: 'deal-2' })

    expect(screen.getByText('No activity yet')).toBeInTheDocument()
  })

  it('Pipeline Stageに全ステータスのピルが表示されること', () => {
    renderList({ deals: [mockDeals[0]], expandedDealId: 'deal-1' })

    expect(screen.getByRole('button', { name: 'lead' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'hearing' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'proposal' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'negotiation' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'closed_won' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'closed_lost' })).toBeInTheDocument()
  })

  it('canManageDeals=trueかつ非終端dealの場合、ピルをクリックするとonSelectDealStatusが呼ばれること', async () => {
    const user = userEvent.setup()
    const { onSelectDealStatus } = renderList({
      deals: [mockDeals[0]],
      expandedDealId: 'deal-1',
    })

    await user.click(screen.getByRole('button', { name: 'proposal' }))

    expect(onSelectDealStatus).toHaveBeenCalledWith('deal-1', 'proposal')
  })

  it('canManageDeals=falseの場合、ピルが非活性になること', () => {
    renderList({ deals: [mockDeals[0]], expandedDealId: 'deal-1', canManageDeals: false })

    expect(screen.getByRole('button', { name: 'proposal' })).toBeDisabled()
  })

  it('終端ステータス(closed_won)のdealでは、ピルが非活性になること', () => {
    renderList({ deals: [mockDeals[1]], expandedDealId: 'deal-2' })

    expect(screen.getByRole('button', { name: 'proposal' })).toBeDisabled()
  })

  it('isUpdatingDealStatus=trueの場合、ピルが非活性になること', () => {
    renderList({ deals: [mockDeals[0]], expandedDealId: 'deal-1', isUpdatingDealStatus: true })

    expect(screen.getByRole('button', { name: 'proposal' })).toBeDisabled()
  })

  it('canManageDeals=trueの場合、+ Add Activityボタンをクリックするとdealidで呼ばれること', async () => {
    const user = userEvent.setup()
    const { onOpenAddActivityLogDialog } = renderList({
      deals: [mockDeals[0]],
      expandedDealId: 'deal-1',
    })

    await user.click(screen.getByRole('button', { name: '+ Add Activity' }))

    expect(onOpenAddActivityLogDialog).toHaveBeenCalledWith('deal-1')
  })

  it('canManageDeals=falseの場合、+ Add Activityボタンが表示されないこと', () => {
    renderList({ deals: [mockDeals[0]], expandedDealId: 'deal-1', canManageDeals: false })

    expect(screen.queryByRole('button', { name: '+ Add Activity' })).not.toBeInTheDocument()
  })

  it('activityLogの行をクリックすると、dealIdとログでonOpenEditActivityLogDialogが呼ばれること', async () => {
    const user = userEvent.setup()
    const { onOpenEditActivityLogDialog } = renderList({
      deals: [mockDeals[0]],
      expandedDealId: 'deal-1',
    })

    await user.click(screen.getByRole('button', { name: 'Edit activity log' }))

    expect(onOpenEditActivityLogDialog).toHaveBeenCalledWith('deal-1', mockDeals[0].activityLogs[0])
  })

  it('activityLogの行にフォーカスしてEnterキーを押すと、onOpenEditActivityLogDialogが呼ばれること', async () => {
    const user = userEvent.setup()
    const { onOpenEditActivityLogDialog } = renderList({
      deals: [mockDeals[0]],
      expandedDealId: 'deal-1',
    })

    screen.getByRole('button', { name: 'Edit activity log' }).focus()
    await user.keyboard('{Enter}')

    expect(onOpenEditActivityLogDialog).toHaveBeenCalledWith('deal-1', mockDeals[0].activityLogs[0])
  })

  it('canManageDeals=falseの場合、activityLogの行がクリック可能でなくなること', () => {
    renderList({ deals: [mockDeals[0]], expandedDealId: 'deal-1', canManageDeals: false })

    expect(screen.queryByRole('button', { name: 'Edit activity log' })).not.toBeInTheDocument()
  })

  it('終端ステータス(closed_won)のdealでも、+ Add Activityボタンは活性であること', () => {
    renderList({ deals: [mockDeals[1]], expandedDealId: 'deal-2' })

    expect(screen.getByRole('button', { name: '+ Add Activity' })).toBeEnabled()
  })
})
