import { Box, Stack, Text } from '@chakra-ui/react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { HiOutlineCog6Tooth, HiOutlineUsers } from 'react-icons/hi2'

import type { AccountType } from '@/share/types/accountType'

type SidebarProps = {
  role: AccountType
}

const NAV_ITEMS: {
  path: string
  label: string
  icon: typeof HiOutlineUsers
  allowedRoles?: AccountType[]
}[] = [
  { path: '/customers', label: 'Customers', icon: HiOutlineUsers },
  {
    path: '/admin/users',
    label: 'Account Management',
    icon: HiOutlineCog6Tooth,
    allowedRoles: ['admin'],
  },
]

export const Sidebar = ({ role }: SidebarProps) => {
  const location = useLocation()

  return (
    <Box as='nav' w='260px' px='4' py='6' borderRight='1px solid' borderColor='border'>
      <Text fontSize='xs' fontWeight='bold' color='fg.muted' mb='2' letterSpacing='wide'>
        WORKSPACE
      </Text>
      <Stack gap='1'>
        {NAV_ITEMS.filter((item) => !item.allowedRoles || item.allowedRoles.includes(role)).map(
          (item) => {
            const isActive = location.pathname.startsWith(item.path)
            const Icon = item.icon

            return (
              <Box
                key={item.path}
                asChild
                display='flex'
                alignItems='center'
                gap='2'
                px='3'
                py='2'
                borderRadius='md'
                whiteSpace='nowrap'
                aria-current={isActive ? 'page' : undefined}
                bg={isActive ? 'blue.50' : 'transparent'}
                color={isActive ? 'blue.700' : 'fg.muted'}
                fontWeight={isActive ? 'semibold' : 'normal'}
              >
                <RouterLink to={item.path}>
                  <Icon />
                  {item.label}
                </RouterLink>
              </Box>
            )
          },
        )}
      </Stack>
    </Box>
  )
}
