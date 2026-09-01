import { Avatar, Button, Flex, Stack, Text } from '@chakra-ui/react'
import { HiArrowRightOnRectangle } from 'react-icons/hi2'

import { Logo } from '@/components/molecules/Logo'

type AppHeaderProps = {
  userName: string
  roleLabel: string
  onLogout: () => void
}

export const AppHeader = ({ userName, roleLabel, onLogout }: AppHeaderProps) => {
  return (
    <Flex
      as='header'
      justify='space-between'
      align='center'
      px='6'
      py='3'
      bg='bg'
      borderBottom='1px solid'
      borderColor='border'
    >
      <Logo textColor='black' />
      <Flex align='center' gap='4'>
        <Flex align='center' gap='2'>
          <Avatar.Root size='sm'>
            <Avatar.Fallback name={userName} />
          </Avatar.Root>
          <Stack gap='0'>
            <Text fontWeight='medium'>{userName}</Text>
            <Text fontSize='sm' color='fg.muted'>
              {roleLabel}
            </Text>
          </Stack>
        </Flex>
        <Button variant='outline' size='sm' onClick={onLogout}>
          <HiArrowRightOnRectangle />
          Log out
        </Button>
      </Flex>
    </Flex>
  )
}
