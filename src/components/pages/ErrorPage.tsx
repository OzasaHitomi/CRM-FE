import { Center, Text } from '@chakra-ui/react'

type ErrorPageProps = {
  message: string
}

export const ErrorPage = ({ message }: ErrorPageProps) => (
  <Center minH='100vh'>
    <Text color='fg.error'>{message}</Text>
  </Center>
)
