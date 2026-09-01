import { type DealPlan } from '@/share/types/dealPlan'
import { type DealStatus } from '@/share/types/dealStatus'

export type CreateDealRequest = {
  title: string
  amount: number
  plan: DealPlan
  licenseCount: number
  contractPeriod: number
}

export type UpdateDealRequest = {
  title: string
  amount: number
  plan: DealPlan
  licenseCount: number
  contractPeriod: number
}

export type UpdateDealStatusRequest = {
  status: DealStatus
}
