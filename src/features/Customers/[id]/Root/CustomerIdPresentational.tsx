import { Heading, HStack, Stack, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { HiOutlineChevronLeft } from 'react-icons/hi2'

import { LoadingPage } from '@/components/pages/LoadingPage'
import { ErrorPage } from '@/components/pages/ErrorPage'
import type { MeResponse } from '@/services/internal/backend/v1/types/response/auth'
import type {
  ActivityLogResponseItem,
  GetCustomerResponse,
  DealResponseItem,
} from '@/services/internal/backend/v1/types/response/customer'
import type { CustomerForm, CustomerFormErrors } from '@/features/Customers/types/customerForm'
import type { DealStatus } from '@/share/types/dealStatus'

import { CustomerDetailCard } from '@/features/Customers/[id]/Root/ui/CustomerDetailCard'
import { DealList } from '@/features/Customers/[id]/Root/ui/DealList'
import { AddDealDialog } from '@/features/Customers/[id]/Root/ui/AddDealDialog'
import { EditDealDialog } from '@/features/Customers/[id]/Root/ui/EditDealDialog'
import { ConfirmDealStatusDialog } from '@/features/Customers/[id]/Root/ui/ConfirmDealStatusDialog'
import { AddActivityLogDialog } from '@/features/Customers/[id]/Root/ui/AddActivityLogDialog'
import { EditActivityLogDialog } from '@/features/Customers/[id]/Root/ui/EditActivityLogDialog'
import type { DealForm, DealFormErrors } from '@/features/Customers/[id]/Root/types/dealForm'
import type {
  ActivityLogForm,
  ActivityLogFormErrors,
} from '@/features/Customers/[id]/Root/types/activityLogForm'

type Props = {
  data: {
    customer: GetCustomerResponse | undefined
    me: MeResponse | undefined
    customerForm: CustomerForm
    customerFormErrors: CustomerFormErrors
    dealForm: DealForm
    dealFormErrors: DealFormErrors
    editDealForm: DealForm
    editDealFormErrors: DealFormErrors
    activityLogForm: ActivityLogForm
    activityLogFormErrors: ActivityLogFormErrors
    editActivityLogForm: ActivityLogForm
    editActivityLogFormErrors: ActivityLogFormErrors
  }
  uiState: {
    isLoading: boolean
    isError: boolean
    isAssigningCustomer: boolean
    isUnassigningCustomer: boolean
    isEditCustomerDialogOpen: boolean
    isUpdatingCustomer: boolean
    isAddDealDialogOpen: boolean
    isCreatingDeal: boolean
    isEditDealDialogOpen: boolean
    isUpdatingDeal: boolean
    expandedDealId: string | null
    isConfirmDealStatusDialogOpen: boolean
    isUpdatingDealStatus: boolean
    isAddActivityLogDialogOpen: boolean
    isCreatingActivityLog: boolean
    isEditActivityLogDialogOpen: boolean
    isUpdatingActivityLog: boolean
  }
  handlers: {
    onAssignToMe: (customerId: string) => void
    onUnassign: (customerId: string) => void
    onOpenEditCustomerDialog: (customer: GetCustomerResponse) => void
    onCloseEditCustomerDialog: () => void
    onChangeCustomerFormField: <K extends keyof CustomerForm>(
      key: K,
      value: CustomerForm[K],
    ) => void
    onSubmitEditCustomer: () => void
    onOpenCreateDealDialog: () => void
    onCloseCreateDealDialog: () => void
    onChangeDealFormField: <K extends keyof DealForm>(key: K, value: DealForm[K]) => void
    onSubmitCreateDeal: () => void
    onOpenEditDealDialog: (deal: DealResponseItem) => void
    onCloseEditDealDialog: () => void
    onChangeEditDealFormField: <K extends keyof DealForm>(key: K, value: DealForm[K]) => void
    onSubmitEditDeal: () => void
    onToggleDealExpand: (dealId: string) => void
    onSelectDealStatus: (dealId: string, status: DealStatus) => void
    onConfirmDealStatusChange: () => void
    onCancelDealStatusChange: () => void
    onOpenAddActivityLogDialog: (dealId: string) => void
    onCloseAddActivityLogDialog: () => void
    onChangeActivityLogFormField: <K extends keyof ActivityLogForm>(
      key: K,
      value: ActivityLogForm[K],
    ) => void
    onSubmitAddActivityLog: () => void
    onOpenEditActivityLogDialog: (dealId: string, log: ActivityLogResponseItem) => void
    onCloseEditActivityLogDialog: () => void
    onChangeEditActivityLogFormField: <K extends keyof ActivityLogForm>(
      key: K,
      value: ActivityLogForm[K],
    ) => void
    onSubmitEditActivityLog: () => void
  }
}

export const CustomerIdPresentational = ({ data, uiState, handlers }: Props) => {
  const {
    customer,
    me,
    customerForm,
    customerFormErrors,
    dealForm,
    dealFormErrors,
    editDealForm,
    editDealFormErrors,
    activityLogForm,
    activityLogFormErrors,
    editActivityLogForm,
    editActivityLogFormErrors,
  } = data
  const {
    isLoading,
    isError,
    isAssigningCustomer,
    isUnassigningCustomer,
    isEditCustomerDialogOpen,
    isUpdatingCustomer,
    isAddDealDialogOpen,
    isCreatingDeal,
    isEditDealDialogOpen,
    isUpdatingDeal,
    expandedDealId,
    isConfirmDealStatusDialogOpen,
    isUpdatingDealStatus,
    isAddActivityLogDialogOpen,
    isCreatingActivityLog,
    isEditActivityLogDialogOpen,
    isUpdatingActivityLog,
  } = uiState

  if (isLoading) return <LoadingPage />
  if (isError || !customer) return <ErrorPage message='顧客情報の取得に失敗しました。' />

  const canManageDeals = me !== undefined && me.role !== 'admin'

  return (
    <Stack gap='6'>
      <Text asChild color='fg.muted' fontSize='sm'>
        <RouterLink to='/customers'>
          <HStack gap='1'>
            <HiOutlineChevronLeft />
            Back to Customers
          </HStack>
        </RouterLink>
      </Text>

      <CustomerDetailCard
        customer={customer}
        me={me}
        customerForm={customerForm}
        errors={customerFormErrors}
        isAssigningCustomer={isAssigningCustomer}
        isUnassigningCustomer={isUnassigningCustomer}
        isDialogOpen={isEditCustomerDialogOpen}
        isUpdatingCustomer={isUpdatingCustomer}
        onAssignToMe={handlers.onAssignToMe}
        onUnassign={handlers.onUnassign}
        onOpenEditCustomerDialog={handlers.onOpenEditCustomerDialog}
        onCloseEditCustomerDialog={handlers.onCloseEditCustomerDialog}
        onChangeCustomerFormField={handlers.onChangeCustomerFormField}
        onSubmitEditCustomer={handlers.onSubmitEditCustomer}
      />

      <HStack justify='space-between'>
        <Heading size='md'>Deals ({customer.deals.length})</Heading>
        {canManageDeals && (
          <AddDealDialog
            isOpen={isAddDealDialogOpen}
            dealForm={dealForm}
            errors={dealFormErrors}
            isCreatingDeal={isCreatingDeal}
            onOpen={handlers.onOpenCreateDealDialog}
            onClose={handlers.onCloseCreateDealDialog}
            onChangeField={handlers.onChangeDealFormField}
            onSubmit={handlers.onSubmitCreateDeal}
          />
        )}
      </HStack>
      <DealList
        deals={customer.deals}
        expandedDealId={expandedDealId}
        canManageDeals={canManageDeals}
        isUpdatingDealStatus={isUpdatingDealStatus}
        onToggleDealExpand={handlers.onToggleDealExpand}
        onSelectDealStatus={handlers.onSelectDealStatus}
        onOpenEditDealDialog={handlers.onOpenEditDealDialog}
        onOpenAddActivityLogDialog={handlers.onOpenAddActivityLogDialog}
        onOpenEditActivityLogDialog={handlers.onOpenEditActivityLogDialog}
      />

      <EditDealDialog
        isOpen={isEditDealDialogOpen}
        dealForm={editDealForm}
        errors={editDealFormErrors}
        isUpdatingDeal={isUpdatingDeal}
        onClose={handlers.onCloseEditDealDialog}
        onChangeField={handlers.onChangeEditDealFormField}
        onSubmit={handlers.onSubmitEditDeal}
      />

      <ConfirmDealStatusDialog
        isOpen={isConfirmDealStatusDialogOpen}
        isUpdatingDealStatus={isUpdatingDealStatus}
        onCancel={handlers.onCancelDealStatusChange}
        onConfirm={handlers.onConfirmDealStatusChange}
      />

      <AddActivityLogDialog
        isOpen={isAddActivityLogDialogOpen}
        activityLogForm={activityLogForm}
        errors={activityLogFormErrors}
        isCreatingActivityLog={isCreatingActivityLog}
        onClose={handlers.onCloseAddActivityLogDialog}
        onChangeField={handlers.onChangeActivityLogFormField}
        onSubmit={handlers.onSubmitAddActivityLog}
      />

      <EditActivityLogDialog
        isOpen={isEditActivityLogDialogOpen}
        activityLogForm={editActivityLogForm}
        errors={editActivityLogFormErrors}
        isUpdatingActivityLog={isUpdatingActivityLog}
        onClose={handlers.onCloseEditActivityLogDialog}
        onChangeField={handlers.onChangeEditActivityLogFormField}
        onSubmit={handlers.onSubmitEditActivityLog}
      />
    </Stack>
  )
}
