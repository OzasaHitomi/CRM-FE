import { EmptyState, Table, VStack } from '@chakra-ui/react'
import { LuUsers } from 'react-icons/lu'

import { RoleBadge } from '@/components/atoms/RoleBadge'
import { StatusBadge } from '@/components/atoms/StatusBadge'
import type { AccountType } from '@/share/types/accountType'
import type { GetUsersResponseItem } from '@/services/internal/backend/v1/types/response/admin/user'

type UserTableProps = {
  users: GetUsersResponseItem[]
  isUpdatingUserStatus: boolean
  onToggleUserStatus: (userId: string, currentIsActive: boolean) => void
}

export const UserTable = ({ users, isUpdatingUserStatus, onToggleUserStatus }: UserTableProps) => {
  if (users.length === 0) {
    return (
      <EmptyState.Root>
        <EmptyState.Content>
          <EmptyState.Indicator>
            <LuUsers />
          </EmptyState.Indicator>
          <VStack textAlign='center'>
            <EmptyState.Title>No users found</EmptyState.Title>
            <EmptyState.Description>There are no users to display yet.</EmptyState.Description>
          </VStack>
        </EmptyState.Content>
      </EmptyState.Root>
    )
  }

  return (
    <Table.Root style={{ tableLayout: 'fixed' }}>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader w='30%'>Name</Table.ColumnHeader>
          <Table.ColumnHeader w='35%'>Email</Table.ColumnHeader>
          <Table.ColumnHeader w='17.5%'>Role</Table.ColumnHeader>
          <Table.ColumnHeader w='17.5%'>Status</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {users.map((user) => (
          <Table.Row key={user.userId}>
            <Table.Cell>{user.name}</Table.Cell>
            <Table.Cell>{user.email}</Table.Cell>
            <Table.Cell>
              <RoleBadge role={user.role as AccountType} />
            </Table.Cell>
            <Table.Cell>
              <StatusBadge
                isActive={user.isActive}
                disabled={isUpdatingUserStatus}
                onClick={() => onToggleUserStatus(user.userId, user.isActive)}
              />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  )
}
