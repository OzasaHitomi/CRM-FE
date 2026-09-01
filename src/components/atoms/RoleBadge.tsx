import { Badge } from '@chakra-ui/react'

import { ACCOUNT_TYPE_LABEL } from '@/share/constants/accountTypeLabel'
import type { AccountType } from '@/share/types/accountType'

type RoleBadgeProps = {
  role: AccountType
}

const ROLE_COLOR_PALETTE: Record<AccountType, string> = {
  admin: 'purple',
  manager: 'blue',
  sales: 'gray',
}

export const RoleBadge = ({ role }: RoleBadgeProps) => {
  return <Badge colorPalette={ROLE_COLOR_PALETTE[role]}>{ACCOUNT_TYPE_LABEL[role]}</Badge>
}
