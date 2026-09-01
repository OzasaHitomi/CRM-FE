import { type ActivityType } from '@/share/types/activityType'

export type CreateActivityLogRequest = {
  type: ActivityType
  activityDate: Date
  note?: string | null
}

export type CreateActivityLogRequestFormatted = Omit<CreateActivityLogRequest, 'activityDate'> & {
  activityDate: string
}

export type UpdateActivityLogRequest = {
  type: ActivityType
  activityDate: Date
  note?: string | null
}

export type UpdateActivityLogRequestFormatted = Omit<UpdateActivityLogRequest, 'activityDate'> & {
  activityDate: string
}
