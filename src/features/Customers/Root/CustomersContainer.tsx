import { CustomersPresentational } from '@/features/Customers/Root/CustomersPresentational'
import { useGetCustomersHandler } from '@/features/Customers/Root/hooks/handlers/useGetCustomersHandler'
import { useCreateCustomerHandler } from '@/features/Customers/Root/hooks/handlers/useCreateCustomerHandler'
import { useAssignCustomerHandler } from '@/features/Customers/hooks/handlers/useAssignCustomerHandler'

export const CustomersContainer = () => {
  const getCustomersHandler = useGetCustomersHandler()
  const createCustomerHandler = useCreateCustomerHandler()
  const assignCustomerHandler = useAssignCustomerHandler()

  return (
    <>
      <CustomersPresentational
        data={{
          ...getCustomersHandler.data,
          ...createCustomerHandler.data,
          ...assignCustomerHandler.data,
        }}
        uiState={{
          ...getCustomersHandler.uiState,
          ...createCustomerHandler.uiState,
          ...assignCustomerHandler.uiState,
        }}
        handlers={{ ...createCustomerHandler.handlers, ...assignCustomerHandler.handlers }}
      />
    </>
  )
}
