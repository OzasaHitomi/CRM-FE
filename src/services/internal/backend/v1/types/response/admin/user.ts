import { z } from 'zod'

export const createUserResponseSchema = z.object({
  userId: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.string(),
})

export type CreateUserResponse = z.infer<typeof createUserResponseSchema>

export const getUsersResponseItemSchema = z.object({
  userId: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.string(),
  isActive: z.boolean(),
})

export type GetUsersResponseItem = z.infer<typeof getUsersResponseItemSchema>

export const getUsersResponseSchema = z.array(getUsersResponseItemSchema)

export const updateUserStatusResponseSchema = z.object({
  userId: z.string(),
  isActive: z.boolean(),
})

export type UpdateUserStatusResponse = z.infer<typeof updateUserStatusResponseSchema>
