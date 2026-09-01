import { Button, Center, Heading, Stack, Text } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

export const ForbiddenPresentational = () => {
  const navigate = useNavigate()

  return (
    <Center minH='100vh'>
      <Stack gap='4' align='center' textAlign='center'>
        <Heading size='2xl'>403</Heading>
        <Text color='fg.muted'>このページを表示する権限がありません。</Text>
        <Button colorPalette='blue' onClick={() => void navigate('/customers')}>
          Customersへ戻る
        </Button>
      </Stack>
    </Center>
  )
}
