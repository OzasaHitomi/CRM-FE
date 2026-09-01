import { Center, Spinner } from '@chakra-ui/react'

export const LoadingPage = () => (
  <Center minH='100vh'>
    <Spinner role='status' aria-label='読み込み中' />
  </Center>
)
