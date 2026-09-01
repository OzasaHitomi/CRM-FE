import { Button, Dialog, Field, NativeSelect, Portal, Stack, Text } from '@chakra-ui/react'

import { FormField } from '@/components/molecules/FormField'
import { industryTypeSchema } from '@/share/types/industryType'
import type { CustomerForm, CustomerFormErrors } from '@/features/Customers/types/customerForm'

type EditCustomerDialogProps = {
  isOpen: boolean
  customerForm: CustomerForm
  errors: CustomerFormErrors
  isUpdatingCustomer: boolean
  onClose: () => void
  onChangeField: <K extends keyof CustomerForm>(key: K, value: CustomerForm[K]) => void
  onSubmit: () => void
}

const INDUSTRY_OPTIONS = industryTypeSchema.options

export const EditCustomerDialog = ({
  isOpen,
  customerForm,
  errors,
  isUpdatingCustomer,
  onClose,
  onChangeField,
  onSubmit,
}: EditCustomerDialogProps) => {
  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => {
        if (!details.open) onClose()
      }}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Edit Customer</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Stack gap='4'>
                <FormField
                  label='Company Name'
                  value={customerForm.companyName}
                  onChange={(value) => onChangeField('companyName', value)}
                  errorMessage={errors.companyName}
                />
                <Field.Root invalid={!!errors.industry}>
                  <Field.Label>Industry</Field.Label>
                  <NativeSelect.Root>
                    <NativeSelect.Field
                      value={customerForm.industry}
                      onChange={(e) =>
                        onChangeField('industry', e.target.value as CustomerForm['industry'])
                      }
                    >
                      {INDUSTRY_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                  {errors.industry && <Field.ErrorText>{errors.industry}</Field.ErrorText>}
                </Field.Root>
                <FormField
                  label='Company Size'
                  type='number'
                  value={String(customerForm.companySize)}
                  onChange={(value) => onChangeField('companySize', Number(value))}
                  errorMessage={errors.companySize}
                />
                <FormField
                  label='Contact Name'
                  value={customerForm.contactName}
                  onChange={(value) => onChangeField('contactName', value)}
                  errorMessage={errors.contactName}
                />
                <FormField
                  label='Phone'
                  value={customerForm.phone}
                  onChange={(value) => onChangeField('phone', value)}
                  errorMessage={errors.phone}
                />
                <FormField
                  label='Email'
                  type='email'
                  value={customerForm.email}
                  onChange={(value) => onChangeField('email', value)}
                  errorMessage={errors.email}
                />
                {errors.common && <Text color='fg.error'>{errors.common}</Text>}
              </Stack>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant='outline' onClick={onClose}>
                Cancel
              </Button>
              <Button colorPalette='blue' loading={isUpdatingCustomer} onClick={onSubmit}>
                Save
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
