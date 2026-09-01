import { Button, Dialog, Field, NativeSelect, Portal, Stack, Text } from '@chakra-ui/react'

import { FormField } from '@/components/molecules/FormField'
import { dealPlanSchema } from '@/share/types/dealPlan'
import type { DealForm, DealFormErrors } from '@/features/Customers/[id]/Root/types/dealForm'

type AddDealDialogProps = {
  isOpen: boolean
  dealForm: DealForm
  errors: DealFormErrors
  isCreatingDeal: boolean
  onOpen: () => void
  onClose: () => void
  onChangeField: <K extends keyof DealForm>(key: K, value: DealForm[K]) => void
  onSubmit: () => void
}

const PLAN_OPTIONS = dealPlanSchema.options

export const AddDealDialog = ({
  isOpen,
  dealForm,
  errors,
  isCreatingDeal,
  onOpen,
  onClose,
  onChangeField,
  onSubmit,
}: AddDealDialogProps) => {
  return (
    <>
      <Button colorPalette='blue' onClick={onOpen}>
        + Add Deal
      </Button>

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
                <Dialog.Title>Add Deal</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Stack gap='4'>
                  <FormField
                    label='Title'
                    value={dealForm.title}
                    onChange={(value) => onChangeField('title', value)}
                    errorMessage={errors.title}
                  />
                  <FormField
                    label='Amount'
                    type='number'
                    value={String(dealForm.amount)}
                    onChange={(value) => onChangeField('amount', Number(value))}
                    errorMessage={errors.amount}
                  />
                  <Field.Root invalid={!!errors.plan}>
                    <Field.Label>Plan</Field.Label>
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        value={dealForm.plan}
                        onChange={(e) => onChangeField('plan', e.target.value as DealForm['plan'])}
                      >
                        {PLAN_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                    {errors.plan && <Field.ErrorText>{errors.plan}</Field.ErrorText>}
                  </Field.Root>
                  <FormField
                    label='License Count'
                    type='number'
                    value={String(dealForm.licenseCount)}
                    onChange={(value) => onChangeField('licenseCount', Number(value))}
                    errorMessage={errors.licenseCount}
                  />
                  <FormField
                    label='Contract Period'
                    type='number'
                    value={String(dealForm.contractPeriod)}
                    onChange={(value) => onChangeField('contractPeriod', Number(value))}
                    errorMessage={errors.contractPeriod}
                  />
                  {errors.common && <Text color='fg.error'>{errors.common}</Text>}
                </Stack>
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant='outline' onClick={onClose}>
                  Cancel
                </Button>
                <Button colorPalette='blue' loading={isCreatingDeal} onClick={onSubmit}>
                  Save
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  )
}
