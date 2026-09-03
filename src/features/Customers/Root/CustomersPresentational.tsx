import { Flex, Heading, Text } from '@chakra-ui/react'

import { LoadingPage } from '@/components/pages/LoadingPage'
import { ErrorPage } from '@/components/pages/ErrorPage'
import { Pagination } from '@/components/molecules/Pagination'
import type { MeResponse } from '@/services/internal/backend/v1/types/response/auth'
import type {
  GetCustomersResponseItem,
  PaginationResponseItem,
} from '@/services/internal/backend/v1/types/response/customer'

import { CustomerTable } from '@/features/Customers/Root/ui/CustomerTable'
import { CreateCustomerDialog } from '@/features/Customers/Root/ui/CreateCustomerDialog'
import type { CustomerForm, CustomerFormErrors } from '@/features/Customers/types/customerForm'

type Props = {
  data: {
    customers: GetCustomersResponseItem[]
    pagination: PaginationResponseItem
    customerForm: CustomerForm
    errors: CustomerFormErrors
    me: MeResponse | undefined
  }
  uiState: {
    isLoading: boolean
    isError: boolean
    isDialogOpen: boolean
    isPending: boolean
    isAssigningCustomer: boolean
    isUnassigningCustomer: boolean
  }
  handlers: {
    onOpenCreateCustomerDialog: () => void
    onCloseCreateCustomerDialog: () => void
    onChangeCustomerFormField: <K extends keyof CustomerForm>(
      key: K,
      value: CustomerForm[K],
    ) => void
    onSubmitCreateCustomer: () => void
    onAssignToMe: (customerId: string) => void
    onUnassign: (customerId: string) => void
    onPageChange: (page: number) => void
  }
}

export const CustomersPresentational = ({ data, uiState, handlers }: Props) => {
  const { customers, pagination, customerForm, errors, me } = data
  const {
    isLoading,
    isError,
    isDialogOpen,
    isPending,
    isAssigningCustomer,
    isUnassigningCustomer,
  } = uiState

  if (isLoading) return <LoadingPage />
  if (isError) return <ErrorPage message='顧客情報の取得に失敗しました。' />

  return (
    <>
      <Flex justify='space-between' align='center' mb='1'>
        <Heading size='lg'>Customers</Heading>
        {me?.role !== 'admin' && (
          <CreateCustomerDialog
            isOpen={isDialogOpen}
            customerForm={customerForm}
            errors={errors}
            isPending={isPending}
            onOpen={handlers.onOpenCreateCustomerDialog}
            onClose={handlers.onCloseCreateCustomerDialog}
            onChangeField={handlers.onChangeCustomerFormField}
            onSubmit={handlers.onSubmitCreateCustomer}
          />
        )}
      </Flex>
      {/* customers.lengthは今のページの件数なので使わず、全体件数(pagination.totalCount)を表示する */}
      <Text color='fg.muted' mb='4'>
        {pagination.totalCount} customers
      </Text>

      <CustomerTable
        customers={customers}
        me={me}
        isAssigningCustomer={isAssigningCustomer}
        isUnassigningCustomer={isUnassigningCustomer}
        onAssignToMe={handlers.onAssignToMe}
        onUnassign={handlers.onUnassign}
      />

      {/* 表の下にページ切り替えボタンを表示する */}
      <Pagination pagination={pagination} onPageChange={handlers.onPageChange} />
    </>
  )
}
