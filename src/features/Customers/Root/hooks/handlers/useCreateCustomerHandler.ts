import { useState } from 'react'
import { flattenError } from 'zod'

import { toaster } from '@/components/ui/toaster'
import { resolveFormErrors } from '@/share/logic/translateValidationError'

import { useCreateCustomerMutation } from '@/features/Customers/Root/hooks/mutations/useCreateCustomerMutation'
import {
  CUSTOMER_FORM_FIELD_KEYS,
  customerFormSchema,
  type CustomerForm,
  type CustomerFormErrors,
} from '@/features/Customers/types/customerForm'
import type { CreateCustomerRequest } from '@/services/internal/backend/v1/types/request/customer'

const INITIAL_CUSTOMER_FORM: CustomerForm = {
  companyName: '',
  industry: 'manufacturing',
  companySize: 0,
  contactName: '',
  phone: '',
  email: '',
}

export const useCreateCustomerHandler = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [customerForm, setCustomerForm] = useState<CustomerForm>(INITIAL_CUSTOMER_FORM)
  const [errors, setErrors] = useState<CustomerFormErrors>({})

  const createCustomerMutation = useCreateCustomerMutation()

  const onOpenCreateCustomerDialog = () => {
    setIsDialogOpen(true)
  }

  const onCloseCreateCustomerDialog = () => {
    setIsDialogOpen(false)
    setCustomerForm(INITIAL_CUSTOMER_FORM)
    setErrors({})
  }

  const onChangeCustomerFormField = <K extends keyof CustomerForm>(
    key: K,
    value: CustomerForm[K],
  ) => {
    setCustomerForm((prev) => ({ ...prev, [key]: value }))
  }

  const onSubmitCreateCustomer = async () => {
    const result = customerFormSchema.safeParse(customerForm)
    if (!result.success) {
      const fieldErrors = flattenError(result.error).fieldErrors
      setErrors({
        companyName: fieldErrors.companyName?.[0],
        industry: fieldErrors.industry?.[0],
        companySize: fieldErrors.companySize?.[0],
        contactName: fieldErrors.contactName?.[0],
        phone: fieldErrors.phone?.[0],
        email: fieldErrors.email?.[0],
      })
      return
    }
    setErrors({})

    const request: CreateCustomerRequest = result.data

    try {
      await createCustomerMutation.mutateAsync(request)
      onCloseCreateCustomerDialog()
      toaster.create({
        type: 'success',
        description: '顧客を登録しました',
      })
    } catch (e) {
      setErrors(resolveFormErrors(e, CUSTOMER_FORM_FIELD_KEYS, '顧客の登録に失敗しました'))
    }
  }

  return {
    data: { customerForm, errors },
    uiState: { isDialogOpen, isPending: createCustomerMutation.isPending },
    handlers: {
      onOpenCreateCustomerDialog,
      onCloseCreateCustomerDialog,
      onChangeCustomerFormField,
      onSubmitCreateCustomer,
    },
  }
}
