import { Button, Center, Heading, Stack, Text } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

export const NotFoundPresentational = () => {
  const navigate = useNavigate()

  return (
    <Center minH='100vh'>
      <Stack gap='4' align='center' textAlign='center'>
        <Heading size='2xl'>404</Heading>
        <Text color='fg.muted'>お探しのページが見つかりません。</Text>
        <Button colorPalette='blue' onClick={() => void navigate('/customers')}>
          Customersへ戻る
        </Button>
      </Stack>
    </Center>
  )
}
