import { Flex, Heading, Text } from '@chakra-ui/react'

import { LoadingPage } from '@/components/pages/LoadingPage'
import { ErrorPage } from '@/components/pages/ErrorPage'
import type { MeResponse } from '@/services/internal/backend/v1/types/response/auth'
import type {
  GetCustomersResponseItem,
  PaginationResponseItem,
} from '@/services/internal/backend/v1/types/response/customer'
import type { IndustryType } from '@/share/types/industryType'

import { CustomerTable } from '@/features/Customers/Root/ui/CustomerTable'
import { CreateCustomerDialog } from '@/features/Customers/Root/ui/CreateCustomerDialog'
import { CustomerIndustryFilter } from '@/features/Customers/Root/ui/CustomerIndustryFilter'
import type { CustomerForm, CustomerFormErrors } from '@/features/Customers/types/customerForm'

type Props = {
  data: {
    customers: GetCustomersResponseItem[]
    pagination: PaginationResponseItem
    customerForm: CustomerForm
    errors: CustomerFormErrors
    me: MeResponse | undefined
    industry: IndustryType | undefined
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
    onIndustryChange: (industry: IndustryType | undefined) => void
  }
}

export const CustomersPresentational = ({ data, uiState, handlers }: Props) => {
  const { customers, pagination, customerForm, errors, me, industry } = data
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
      <Flex justify='space-between' align='center' mb='4'>
        {/* customers.lengthは今のページの件数なので使わず、全体件数(pagination.totalCount)を表示する */}
        <Text color='fg.muted'>{pagination.totalCount} customers</Text>
        <CustomerIndustryFilter industry={industry} onIndustryChange={handlers.onIndustryChange} />
      </Flex>

      <CustomerTable
        customers={customers}
        pagination={pagination}
        me={me}
        isAssigningCustomer={isAssigningCustomer}
        isUnassigningCustomer={isUnassigningCustomer}
        onAssignToMe={handlers.onAssignToMe}
        onUnassign={handlers.onUnassign}
        onPageChange={handlers.onPageChange}
      />
    </>
  )
}
