import { useParams } from 'react-router-dom'

import { CustomerIdPresentational } from '@/features/Customers/[id]/Root/CustomerIdPresentational'
import { useGetCustomerHandler } from '@/features/Customers/[id]/Root/hooks/handlers/useGetCustomerHandler'
import { useUpdateCustomerHandler } from '@/features/Customers/[id]/Root/hooks/handlers/useUpdateCustomerHandler'
import { useCreateDealHandler } from '@/features/Customers/[id]/Root/hooks/handlers/useCreateDealHandler'
import { useUpdateDealHandler } from '@/features/Customers/[id]/Root/hooks/handlers/useUpdateDealHandler'
import { useDealListHandler } from '@/features/Customers/[id]/Root/hooks/handlers/useDealListHandler'
import { useUpdateDealStatusHandler } from '@/features/Customers/[id]/Root/hooks/handlers/useUpdateDealStatusHandler'
import { useCreateActivityLogHandler } from '@/features/Customers/[id]/Root/hooks/handlers/useCreateActivityLogHandler'
import { useUpdateActivityLogHandler } from '@/features/Customers/[id]/Root/hooks/handlers/useUpdateActivityLogHandler'
import { useAssignCustomerHandler } from '@/features/Customers/hooks/handlers/useAssignCustomerHandler'

export const CustomerIdContainer = () => {
  const { id } = useParams<{ id: string }>()
  const getCustomerHandler = useGetCustomerHandler(id as string)
  const updateCustomerHandler = useUpdateCustomerHandler(id as string)
  const createDealHandler = useCreateDealHandler(id as string)
  const updateDealHandler = useUpdateDealHandler(id as string)
  const dealListHandler = useDealListHandler()
  const updateDealStatusHandler = useUpdateDealStatusHandler(id as string)
  const createActivityLogHandler = useCreateActivityLogHandler(id as string)
  const updateActivityLogHandler = useUpdateActivityLogHandler(id as string)
  const assignCustomerHandler = useAssignCustomerHandler({ redirectToListOnUnassign: true })

  return (
    <>
      <CustomerIdPresentational
        data={{
          ...getCustomerHandler.data,
          ...updateCustomerHandler.data,
          ...createDealHandler.data,
          ...updateDealHandler.data,
          ...createActivityLogHandler.data,
          ...updateActivityLogHandler.data,
          ...assignCustomerHandler.data,
        }}
        uiState={{
          ...getCustomerHandler.uiState,
          ...updateCustomerHandler.uiState,
          ...createDealHandler.uiState,
          ...updateDealHandler.uiState,
          ...dealListHandler.uiState,
          ...updateDealStatusHandler.uiState,
          ...createActivityLogHandler.uiState,
          ...updateActivityLogHandler.uiState,
          ...assignCustomerHandler.uiState,
        }}
        handlers={{
          ...updateCustomerHandler.handlers,
          ...createDealHandler.handlers,
          ...updateDealHandler.handlers,
          ...dealListHandler.handlers,
          ...updateDealStatusHandler.handlers,
          ...createActivityLogHandler.handlers,
          ...updateActivityLogHandler.handlers,
          ...assignCustomerHandler.handlers,
        }}
      />
    </>
  )
}
