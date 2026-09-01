import { z } from 'zod'

import { activityTypeSchema } from '@/share/types/activityType'
import { dealPlanSchema } from '@/share/types/dealPlan'
import { dealStatusSchema } from '@/share/types/dealStatus'
import { industryTypeSchema } from '@/share/types/industryType'

export const assignedUserResponseItemSchema = z.object({
  userId: z.string(),
  name: z.string(),
})

export type AssignedUserResponseItem = z.infer<typeof assignedUserResponseItemSchema>

export const activityLogResponseItemSchema = z.object({
  activityLogId: z.string(),
  type: activityTypeSchema,
  activityDate: z.iso.date(),
  note: z.string().nullable(),
})

export type ActivityLogResponseItem = z.infer<typeof activityLogResponseItemSchema>

export const dealResponseItemSchema = z.object({
  dealId: z.string(),
  title: z.string(),
  status: dealStatusSchema,
  amount: z.number(),
  plan: dealPlanSchema,
  licenseCount: z.number(),
  contractPeriod: z.number(),
  createdAt: z.iso.datetime({ local: true }).transform((value) => new Date(value)),
  activityLogs: z.array(activityLogResponseItemSchema),
})

export type DealResponseItem = z.infer<typeof dealResponseItemSchema>

export const getCustomersResponseItemSchema = z.object({
  customerId: z.string(),
  companyName: z.string(),
  industry: industryTypeSchema,
  assignedUser: assignedUserResponseItemSchema.nullable(),
})

export type GetCustomersResponseItem = z.infer<typeof getCustomersResponseItemSchema>

export const getCustomersResponseSchema = z.array(getCustomersResponseItemSchema)

export const getCustomerResponseSchema = z.object({
  customerId: z.string(),
  companyName: z.string(),
  industry: industryTypeSchema,
  companySize: z.number(),
  contactName: z.string(),
  phone: z.string(),
  email: z.string(),
  assignedUser: assignedUserResponseItemSchema.nullable(),
  deals: z.array(dealResponseItemSchema),
})

export type GetCustomerResponse = z.infer<typeof getCustomerResponseSchema>

export const createCustomerResponseSchema = z.object({
  customerId: z.string(),
  companyName: z.string(),
  industry: industryTypeSchema,
  companySize: z.number(),
  contactName: z.string(),
  phone: z.string(),
  email: z.string(),
  assignedUser: assignedUserResponseItemSchema.nullable(),
})

export type CreateCustomerResponse = z.infer<typeof createCustomerResponseSchema>

export const updateCustomerResponseSchema = z.object({
  customerId: z.string(),
  companyName: z.string(),
  industry: industryTypeSchema,
  companySize: z.number(),
  contactName: z.string(),
  phone: z.string(),
  email: z.string(),
  assignedUser: assignedUserResponseItemSchema.nullable(),
})

export type UpdateCustomerResponse = z.infer<typeof updateCustomerResponseSchema>

export const assignCustomerUserResponseSchema = z.object({
  customerId: z.string(),
  assignedUser: assignedUserResponseItemSchema,
})

export type AssignCustomerUserResponse = z.infer<typeof assignCustomerUserResponseSchema>
