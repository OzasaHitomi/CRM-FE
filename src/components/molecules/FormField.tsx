import { Field, Input } from '@chakra-ui/react'
import type { ChangeEvent, HTMLInputTypeAttribute } from 'react'

type FormFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  type?: HTMLInputTypeAttribute
  required?: boolean
  errorMessage?: string
}

export const FormField = ({
  label,
  value,
  onChange,
  type = 'text',
  required,
  errorMessage,
}: FormFieldProps) => {
  return (
    <Field.Root invalid={!!errorMessage} required={required}>
      <Field.Label>{label}</Field.Label>
      <Input
        type={type}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      />
      {errorMessage && <Field.ErrorText>{errorMessage}</Field.ErrorText>}
    </Field.Root>
  )
}
