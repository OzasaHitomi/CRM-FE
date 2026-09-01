import {
  Button,
  Dialog,
  Field,
  NativeSelect,
  Portal,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react'

import { FormField } from '@/components/molecules/FormField'
import { activityTypeSchema } from '@/share/types/activityType'
import type {
  ActivityLogForm,
  ActivityLogFormErrors,
} from '@/features/Customers/[id]/Root/types/activityLogForm'

type EditActivityLogDialogProps = {
  isOpen: boolean
  activityLogForm: ActivityLogForm
  errors: ActivityLogFormErrors
  isUpdatingActivityLog: boolean
  onClose: () => void
  onChangeField: <K extends keyof ActivityLogForm>(key: K, value: ActivityLogForm[K]) => void
  onSubmit: () => void
}

const ACTIVITY_TYPE_OPTIONS = activityTypeSchema.options

export const EditActivityLogDialog = ({
  isOpen,
  activityLogForm,
  errors,
  isUpdatingActivityLog,
  onClose,
  onChangeField,
  onSubmit,
}: EditActivityLogDialogProps) => {
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
              <Dialog.Title>Edit Activity</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Stack gap='4'>
                <Field.Root invalid={!!errors.type}>
                  <Field.Label>Type</Field.Label>
                  <NativeSelect.Root>
                    <NativeSelect.Field
                      value={activityLogForm.type}
                      onChange={(e) =>
                        onChangeField('type', e.target.value as ActivityLogForm['type'])
                      }
                    >
                      {ACTIVITY_TYPE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                  {errors.type && <Field.ErrorText>{errors.type}</Field.ErrorText>}
                </Field.Root>
                <FormField
                  label='Activity Date'
                  type='date'
                  value={activityLogForm.activityDate}
                  onChange={(value) => onChangeField('activityDate', value)}
                  errorMessage={errors.activityDate}
                />
                <Field.Root invalid={!!errors.note}>
                  <Field.Label>Note</Field.Label>
                  <Textarea
                    value={activityLogForm.note}
                    onChange={(e) => onChangeField('note', e.target.value)}
                    rows={4}
                  />
                  {errors.note && <Field.ErrorText>{errors.note}</Field.ErrorText>}
                </Field.Root>
                {errors.common && <Text color='fg.error'>{errors.common}</Text>}
              </Stack>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant='outline' onClick={onClose}>
                Cancel
              </Button>
              <Button colorPalette='blue' loading={isUpdatingActivityLog} onClick={onSubmit}>
                Save
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
