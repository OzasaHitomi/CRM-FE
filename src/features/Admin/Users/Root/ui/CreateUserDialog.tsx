import { Button, Dialog, Field, NativeSelect, Portal, Stack, Text } from '@chakra-ui/react'

import { FormField } from '@/components/molecules/FormField'
import { ACCOUNT_TYPE_LABEL } from '@/share/constants/accountTypeLabel'
import { accountTypeSchema } from '@/share/types/accountType'
import type { UserForm, UserFormErrors } from '@/features/Admin/Users/Root/types/userForm'

type CreateUserDialogProps = {
  isOpen: boolean
  userForm: UserForm
  errors: UserFormErrors
  isCreatingUser: boolean
  onOpen: () => void
  onClose: () => void
  onChangeField: <K extends keyof UserForm>(key: K, value: UserForm[K]) => void
  onSubmit: () => void
}

const ROLE_OPTIONS = accountTypeSchema.options

export const CreateUserDialog = ({
  isOpen,
  userForm,
  errors,
  isCreatingUser,
  onOpen,
  onClose,
  onChangeField,
  onSubmit,
}: CreateUserDialogProps) => {
  return (
    <>
      <Button colorPalette='blue' onClick={onOpen}>
        + Add User
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
                <Dialog.Title>Add User</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Stack gap='4'>
                  <FormField
                    label='Name'
                    value={userForm.name}
                    onChange={(value) => onChangeField('name', value)}
                    errorMessage={errors.name}
                  />
                  <FormField
                    label='Email'
                    type='email'
                    value={userForm.email}
                    onChange={(value) => onChangeField('email', value)}
                    errorMessage={errors.email}
                  />
                  <FormField
                    label='Password'
                    type='password'
                    value={userForm.password}
                    onChange={(value) => onChangeField('password', value)}
                    errorMessage={errors.password}
                  />
                  <Field.Root invalid={!!errors.role}>
                    <Field.Label>Role</Field.Label>
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        value={userForm.role}
                        onChange={(e) => onChangeField('role', e.target.value as UserForm['role'])}
                      >
                        {ROLE_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {ACCOUNT_TYPE_LABEL[option]}
                          </option>
                        ))}
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                    {errors.role && <Field.ErrorText>{errors.role}</Field.ErrorText>}
                  </Field.Root>
                  {errors.common && <Text color='fg.error'>{errors.common}</Text>}
                </Stack>
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant='outline' onClick={onClose}>
                  Cancel
                </Button>
                <Button colorPalette='blue' loading={isCreatingUser} onClick={onSubmit}>
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
