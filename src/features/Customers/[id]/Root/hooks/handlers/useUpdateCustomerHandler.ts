import { useState } from 'react'
import { flattenError } from 'zod'

import { toaster } from '@/components/ui/toaster'
import { resolveFormErrors } from '@/share/logic/translateValidationError'

import { useUpdateCustomerMutation } from '@/features/Customers/[id]/Root/hooks/mutations/useUpdateCustomerMutation'
import {
  CUSTOMER_FORM_FIELD_KEYS,
  customerFormSchema,
  type CustomerForm,
  type CustomerFormErrors,
} from '@/features/Customers/types/customerForm'
import type { UpdateCustomerRequest } from '@/services/internal/backend/v1/types/request/customer'
import type { GetCustomerResponse } from '@/services/internal/backend/v1/types/response/customer'

const EMPTY_CUSTOMER_FORM: CustomerForm = {
  companyName: '',
  industry: 'manufacturing',
  companySize: 0,
  contactName: '',
  phone: '',
  email: '',
}

export const useUpdateCustomerHandler = (customerId: string) => {
  const [isEditCustomerDialogOpen, setIsEditCustomerDialogOpen] = useState(false)
  const [customerForm, setCustomerForm] = useState<CustomerForm>(EMPTY_CUSTOMER_FORM)
  const [errors, setErrors] = useState<CustomerFormErrors>({})

  const updateCustomerMutation = useUpdateCustomerMutation()

  const onOpenEditCustomerDialog = (customer: GetCustomerResponse) => {
    setCustomerForm({
      companyName: customer.companyName,
      industry: customer.industry,
      companySize: customer.companySize,
      contactName: customer.contactName,
      phone: customer.phone,
      email: customer.email,
    })
    setIsEditCustomerDialogOpen(true)
  }

  const onCloseEditCustomerDialog = () => {
    setIsEditCustomerDialogOpen(false)
    setErrors({})
  }

  const onChangeCustomerFormField = <K extends keyof CustomerForm>(
    key: K,
    value: CustomerForm[K],
  ) => {
    setCustomerForm((prev) => ({ ...prev, [key]: value }))
  }

  const onSubmitEditCustomer = async () => {
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

    const request: UpdateCustomerRequest = result.data

    try {
      await updateCustomerMutation.mutateAsync({ customerId, data: request })
      onCloseEditCustomerDialog()
      toaster.create({
        type: 'success',
        description: '顧客情報を更新しました',
      })
    } catch (e) {
      setErrors(resolveFormErrors(e, CUSTOMER_FORM_FIELD_KEYS, '顧客情報の更新に失敗しました'))
    }
  }

  return {
    data: { customerForm, customerFormErrors: errors },
    uiState: {
      isEditCustomerDialogOpen,
      isUpdatingCustomer: updateCustomerMutation.isPending,
    },
    handlers: {
      onOpenEditCustomerDialog,
      onCloseEditCustomerDialog,
      onChangeCustomerFormField,
      onSubmitEditCustomer,
    },
  }
}
