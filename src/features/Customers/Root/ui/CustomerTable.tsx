import { Button, EmptyState, Table, Text, VStack } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { LuUsers } from 'react-icons/lu'

import { IndustryBadge } from '@/components/atoms/IndustryBadge'
import type { MeResponse } from '@/services/internal/backend/v1/types/response/auth'
import type {
  GetCustomersResponseItem,
  PaginationResponseItem,
} from '@/services/internal/backend/v1/types/response/customer'

import { Pagination } from '@/components/molecules/Pagination'

type CustomerTableProps = {
  customers: GetCustomersResponseItem[]
  pagination: PaginationResponseItem
  me: MeResponse | undefined
  isAssigningCustomer: boolean
  isUnassigningCustomer: boolean
  onAssignToMe: (customerId: string) => void
  onUnassign: (customerId: string) => void
  onPageChange: (page: number) => void
}

export const CustomerTable = ({
  customers,
  pagination,
  me,
  isAssigningCustomer,
  isUnassigningCustomer,
  onAssignToMe,
  onUnassign,
  onPageChange,
}: CustomerTableProps) => {
  if (customers.length === 0) {
    return (
      <EmptyState.Root>
        <EmptyState.Content>
          <EmptyState.Indicator>
            <LuUsers />
          </EmptyState.Indicator>
          <VStack textAlign='center'>
            <EmptyState.Title>No customers found</EmptyState.Title>
            <EmptyState.Description>There are no customers to display yet.</EmptyState.Description>
          </VStack>
        </EmptyState.Content>
      </EmptyState.Root>
    )
  }

  return (
    <>
      <Table.Root variant='outline' style={{ tableLayout: 'fixed' }} bg={'white'}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader w='40%' color={'gray'} fontWeight='bold' fontSize='xs'>
              CUSTOMER
            </Table.ColumnHeader>
            <Table.ColumnHeader w='15%' color={'gray'} fontWeight='bold' fontSize='xs'>
              INDUSTRY
            </Table.ColumnHeader>
            <Table.ColumnHeader w='20%' color={'gray'} fontWeight='bold' fontSize='xs'>
              ASSIGNED REP
            </Table.ColumnHeader>
            <Table.ColumnHeader w='25%' />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {customers.map((customer) => {
            const canManageAssignment = me !== undefined && me.role !== 'admin'
            const isAssignedToMe = customer.assignedUser?.userId === me?.userId
            const canViewDetail = me !== undefined && (me.role !== 'sales' || isAssignedToMe)

            return (
              <Table.Row key={customer.customerId}>
                <Table.Cell>
                  {canViewDetail ? (
                    <Text asChild color='blue.600' fontWeight='medium'>
                      <RouterLink to={`/customers/${customer.customerId}`}>
                        {customer.companyName}
                      </RouterLink>
                    </Text>
                  ) : (
                    <Text>{customer.companyName}</Text>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <IndustryBadge industry={customer.industry} />
                </Table.Cell>
                <Table.Cell>{customer.assignedUser?.name ?? 'Unassigned'}</Table.Cell>
                <Table.Cell>
                  {canManageAssignment && !customer.assignedUser && (
                    <Button
                      size='sm'
                      variant='outline'
                      colorPalette='blue'
                      loading={isAssigningCustomer}
                      onClick={() => onAssignToMe(customer.customerId)}
                    >
                      Assign to me
                    </Button>
                  )}
                  {canManageAssignment &&
                    customer.assignedUser &&
                    (isAssignedToMe || me?.role === 'manager') && (
                      <Button
                        size='sm'
                        variant='outline'
                        colorPalette='red'
                        loading={isUnassigningCustomer}
                        onClick={() => onUnassign(customer.customerId)}
                      >
                        Unassign
                      </Button>
                    )}
                </Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table.Root>
      <Pagination pagination={pagination} onPageChange={onPageChange} />
    </>
  )
}
