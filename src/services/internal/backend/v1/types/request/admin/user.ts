import { type AccountType } from '@/share/types/accountType'

export type CreateUserRequest = {
  name: string
  email: string
  password: string
  role: AccountType
}

export type UpdateUserStatusRequest = {
  isActive: boolean
}
