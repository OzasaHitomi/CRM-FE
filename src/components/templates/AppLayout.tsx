import { Flex, Container } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'

import { AppHeader } from '@/components/organisms/AppHeader'
import { Sidebar } from '@/components/organisms/Sidebar'

import { useGetMeHandler } from './hooks/handlers/useGetMeHandler'
import { useLogoutHandler } from './hooks/handlers/useLogoutHandler'

export const AppLayout = () => {
  const { data } = useGetMeHandler()
  const { handlers } = useLogoutHandler()

  return (
    <Flex direction='column' minH='100vh' bg='bg.muted'>
      <AppHeader
        userName={data.userName}
        roleLabel={data.roleLabel}
        onLogout={() => void handlers.onLogout()}
      />
      <Flex flex='1'>
        <Sidebar role={data.role} />
        <Container as='main' px='48' py='6'>
          <Outlet />
        </Container>
      </Flex>
    </Flex>
  )
}
