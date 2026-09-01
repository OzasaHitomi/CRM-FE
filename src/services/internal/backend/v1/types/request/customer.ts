import { type IndustryType } from '@/share/types/industryType'

export type CreateCustomerRequest = {
  companyName: string
  industry: IndustryType
  companySize: number
  contactName: string
  phone: string
  email: string
}

export type UpdateCustomerRequest = {
  companyName: string
  industry: IndustryType
  companySize: number
  contactName: string
  phone: string
  email: string
}
