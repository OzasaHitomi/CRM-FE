import {
  Accordion,
  Badge,
  Button,
  EmptyState,
  HStack,
  Span,
  Stack,
  Text,
  Separator,
  VStack,
} from '@chakra-ui/react'
import { LuBriefcase, LuHistory } from 'react-icons/lu'
import { HiOutlinePencil } from 'react-icons/hi2'

import type { ActivityType } from '@/share/types/activityType'
import type { DealStatus } from '@/share/types/dealStatus'
import type {
  ActivityLogResponseItem,
  DealResponseItem,
} from '@/services/internal/backend/v1/types/response/customer'

type DealListProps = {
  deals: DealResponseItem[]
  expandedDealId: string | null
  canManageDeals: boolean
  isUpdatingDealStatus: boolean
  onToggleDealExpand: (dealId: string) => void
  onSelectDealStatus: (dealId: string, status: DealStatus) => void
  onOpenEditDealDialog: (deal: DealResponseItem) => void
  onOpenAddActivityLogDialog: (dealId: string) => void
  onOpenEditActivityLogDialog: (dealId: string, log: ActivityLogResponseItem) => void
}

const DEAL_STATUS_ORDER: DealStatus[] = [
  'lead',
  'hearing',
  'proposal',
  'negotiation',
  'closed_won',
  'closed_lost',
]

const DEAL_STATUS_COLOR_PALETTE: Record<DealStatus, string> = {
  lead: 'gray',
  hearing: 'blue',
  proposal: 'purple',
  negotiation: 'orange',
  closed_won: 'green',
  closed_lost: 'red',
}

const TERMINAL_DEAL_STATUSES: DealStatus[] = ['closed_won', 'closed_lost']

const ACTIVITY_TYPE_LABEL: Record<ActivityType, string> = {
  call: 'Call',
  email: 'Email',
  visit: 'Visit',
  online_meeting: 'Online Meeting',
  other: 'Other',
}

const ACTIVITY_TYPE_COLOR_PALETTE: Record<ActivityType, string> = {
  call: 'blue',
  email: 'purple',
  visit: 'green',
  online_meeting: 'orange',
  other: 'gray',
}

const DetailField = ({ label, value }: { label: string; value: string }) => (
  <Stack w='full' gap='0' fontSize='sm'>
    <Text fontSize='xs' fontWeight='semibold' color='fg.subtle' textTransform='uppercase'>
      {label}
    </Text>
    <Text>{value}</Text>
  </Stack>
)

export const DealList = ({
  deals,
  expandedDealId,
  canManageDeals,
  isUpdatingDealStatus,
  onToggleDealExpand,
  onSelectDealStatus,
  onOpenEditDealDialog,
  onOpenAddActivityLogDialog,
  onOpenEditActivityLogDialog,
}: DealListProps) => {
  if (deals.length === 0) {
    return (
      <EmptyState.Root>
        <EmptyState.Content>
          <EmptyState.Indicator>
            <LuBriefcase />
          </EmptyState.Indicator>
          <VStack textAlign='center'>
            <EmptyState.Title>No deals yet</EmptyState.Title>
            <EmptyState.Description>
              Add a deal to start tracking this customer&apos;s pipeline.
            </EmptyState.Description>
          </VStack>
        </EmptyState.Content>
      </EmptyState.Root>
    )
  }

  return (
    <Accordion.Root
      value={expandedDealId ? [expandedDealId] : []}
      onValueChange={(details) => {
        const nextId = details.value[0] ?? expandedDealId
        if (nextId) onToggleDealExpand(nextId)
      }}
      collapsible
    >
      <Stack gap='3'>
        {deals.map((deal) => {
          const isPipelineLocked = !canManageDeals || TERMINAL_DEAL_STATUSES.includes(deal.status)

          return (
            <Accordion.Item
              key={deal.dealId}
              value={deal.dealId}
              data-testid='deal-row'
              border='1px solid'
              borderColor='border'
              borderRadius='md'
              overflow='hidden'
              bg='white'
            >
              <Accordion.ItemTrigger justifyContent='space-between' px='4' py='3'>
                <HStack gap='3'>
                  <Accordion.ItemIndicator />
                  <Text fontWeight='medium'>{deal.title}</Text>
                </HStack>

                <HStack gap='3'>
                  <Badge
                    data-testid='deal-status-badge'
                    colorPalette={DEAL_STATUS_COLOR_PALETTE[deal.status]}
                    textTransform='capitalize'
                  >
                    {deal.status}
                  </Badge>
                  <Span fontWeight='semibold'>${deal.amount.toLocaleString()}</Span>
                </HStack>
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>
                <Accordion.ItemBody
                  px='4'
                  py='3'
                  borderTop='1px solid'
                  borderColor='border'
                  display='flex'
                  flexDirection='column'
                  gap='4'
                >
                  <HStack w={'full'}>
                    <HStack gap='6' w={'full'}>
                      <DetailField label='Plan' value={deal.plan} />
                      <DetailField label='License Count' value={String(deal.licenseCount)} />
                      <DetailField label='Contract Period' value={String(deal.contractPeriod)} />
                    </HStack>
                    {canManageDeals && (
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => onOpenEditDealDialog(deal)}
                      >
                        <HiOutlinePencil />
                        Edit
                      </Button>
                    )}
                  </HStack>

                  <Separator />

                  <Stack gap='2'>
                    <Text fontWeight='semibold' fontSize='sm'>
                      Pipeline Stage
                    </Text>
                    <HStack wrap='wrap' gap='2'>
                      {DEAL_STATUS_ORDER.map((status) => {
                        const isCurrent = status === deal.status

                        return (
                          <Badge
                            key={status}
                            asChild
                            size='lg'
                            colorPalette={isCurrent ? DEAL_STATUS_COLOR_PALETTE[status] : 'gray'}
                            variant={isCurrent ? 'solid' : 'outline'}
                            textTransform='capitalize'
                            cursor={isPipelineLocked ? 'not-allowed' : 'pointer'}
                          >
                            <button
                              type='button'
                              disabled={isPipelineLocked || isUpdatingDealStatus}
                              onClick={() => void onSelectDealStatus(deal.dealId, status)}
                            >
                              {status}
                            </button>
                          </Badge>
                        )
                      })}
                    </HStack>
                  </Stack>

                  <Separator />

                  <Stack gap='2'>
                    <HStack justifyContent='space-between'>
                      <Text fontWeight='semibold' fontSize='sm'>
                        Activity Log
                      </Text>
                      {canManageDeals && (
                        <Button
                          size='xs'
                          variant='outline'
                          onClick={() => onOpenAddActivityLogDialog(deal.dealId)}
                        >
                          + Add Activity
                        </Button>
                      )}
                    </HStack>
                    {deal.activityLogs.length === 0 ? (
                      <EmptyState.Root size='sm'>
                        <EmptyState.Content>
                          <EmptyState.Indicator>
                            <LuHistory />
                          </EmptyState.Indicator>
                          <EmptyState.Title>No activity yet</EmptyState.Title>
                        </EmptyState.Content>
                      </EmptyState.Root>
                    ) : (
                      deal.activityLogs.map((log) => (
                        <HStack
                          key={log.activityLogId}
                          role={canManageDeals ? 'button' : undefined}
                          tabIndex={canManageDeals ? 0 : undefined}
                          aria-label={canManageDeals ? 'Edit activity log' : undefined}
                          onClick={
                            canManageDeals
                              ? () => onOpenEditActivityLogDialog(deal.dealId, log)
                              : undefined
                          }
                          onKeyDown={
                            canManageDeals
                              ? (e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault()
                                    onOpenEditActivityLogDialog(deal.dealId, log)
                                  }
                                }
                              : undefined
                          }
                          gap='3'
                          align='start'
                          justifyContent='space-between'
                          bg='gray.100'
                          borderRadius='md'
                          px='3'
                          py='2'
                          cursor={canManageDeals ? 'pointer' : 'default'}
                          _hover={canManageDeals ? { bg: 'gray.200' } : undefined}
                        >
                          <HStack gap='3' align='start'>
                            <Badge colorPalette={ACTIVITY_TYPE_COLOR_PALETTE[log.type]}>
                              {ACTIVITY_TYPE_LABEL[log.type]}
                            </Badge>
                            <Text fontSize='sm'>{log.note ?? '-'}</Text>
                          </HStack>
                          <Text fontSize='xs' color='fg.subtle'>
                            {log.activityDate}
                          </Text>
                        </HStack>
                      ))
                    )}
                  </Stack>
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>
          )
        })}
      </Stack>
    </Accordion.Root>
  )
}
