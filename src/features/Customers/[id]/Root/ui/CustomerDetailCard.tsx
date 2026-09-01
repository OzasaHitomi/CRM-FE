import { Box, Button, Card, Heading, HStack, SimpleGrid, Text, Separator } from '@chakra-ui/react'
import { HiOutlinePencil } from 'react-icons/hi2'

import { IndustryBadge } from '@/components/atoms/IndustryBadge'
import type { MeResponse } from '@/services/internal/backend/v1/types/response/auth'
import type { GetCustomerResponse } from '@/services/internal/backend/v1/types/response/customer'
import type { CustomerForm, CustomerFormErrors } from '@/features/Customers/types/customerForm'

import { EditCustomerDialog } from '@/features/Customers/[id]/Root/ui/EditCustomerDialog'

type CustomerDetailCardProps = {
  customer: GetCustomerResponse
  me: MeResponse | undefined
  customerForm: CustomerForm
  errors: CustomerFormErrors
  isAssigningCustomer: boolean
  isUnassigningCustomer: boolean
  isDialogOpen: boolean
  isUpdatingCustomer: boolean
  onAssignToMe: (customerId: string) => void
  onUnassign: (customerId: string) => void
  onOpenEditCustomerDialog: (customer: GetCustomerResponse) => void
  onCloseEditCustomerDialog: () => void
  onChangeCustomerFormField: <K extends keyof CustomerForm>(key: K, value: CustomerForm[K]) => void
  onSubmitEditCustomer: () => void
}

const InfoField = ({ label, value }: { label: string; value: string }) => (
  <Text fontSize='sm'>
    <Text
      as='span'
      display='block'
      fontSize='xs'
      fontWeight='semibold'
      letterSpacing='wide'
      color='fg.subtle'
      textTransform='uppercase'
    >
      {label}
    </Text>
    {value}
  </Text>
)

export const CustomerDetailCard = ({
  customer,
  me,
  customerForm,
  errors,
  isAssigningCustomer,
  isUnassigningCustomer,
  isDialogOpen,
  isUpdatingCustomer,
  onAssignToMe,
  onUnassign,
  onOpenEditCustomerDialog,
  onCloseEditCustomerDialog,
  onChangeCustomerFormField,
  onSubmitEditCustomer,
}: CustomerDetailCardProps) => {
  const canManageAssignment = me !== undefined && me.role !== 'admin'
  const isAssignedToMe = customer.assignedUser?.userId === me?.userId

  return (
    <Card.Root>
      <Card.Body>
        <HStack justify='space-between' align='flex-start' gap='4' mb='4' wrap='wrap'>
          <Box>
            <HStack gap='3' mb='1'>
              <Heading size='3xl' fontWeight='bold'>
                {customer.companyName}
              </Heading>
              <IndustryBadge industry={customer.industry} />
            </HStack>
            <Text color='fg.subtle'>
              {customer.assignedUser ? `Assigned to ${customer.assignedUser.name}` : 'Unassigned'}
            </Text>
          </Box>

          <HStack gap='2' wrap='wrap'>
            {canManageAssignment && (
              <Button
                size='sm'
                variant='outline'
                onClick={() => onOpenEditCustomerDialog(customer)}
              >
                <HiOutlinePencil />
                Edit
              </Button>
            )}
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
          </HStack>
        </HStack>

        <Separator mb='6' />

        <SimpleGrid columns={5} gap='6'>
          <InfoField label='Industry' value={customer.industry} />
          <InfoField label='Company Size' value={`${customer.companySize} employees`} />
          <InfoField label='Contact' value={customer.contactName} />
          <InfoField label='Phone' value={customer.phone} />
          <InfoField label='Email' value={customer.email} />
        </SimpleGrid>
      </Card.Body>

      <EditCustomerDialog
        isOpen={isDialogOpen}
        customerForm={customerForm}
        errors={errors}
        isUpdatingCustomer={isUpdatingCustomer}
        onClose={onCloseEditCustomerDialog}
        onChangeField={onChangeCustomerFormField}
        onSubmit={onSubmitEditCustomer}
      />
    </Card.Root>
  )
}
