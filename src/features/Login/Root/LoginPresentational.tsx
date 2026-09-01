import { Button, Card, Center, Heading, Stack, Text } from '@chakra-ui/react'

import { FormField } from '@/components/molecules/FormField'
import { Logo } from '@/components/molecules/Logo'
import type { LoginErrors, LoginForm } from '@/features/Login/Root/types/loginForm'

type Props = {
  data: {
    loginForm: LoginForm
    errors: LoginErrors
  }
  uiState: {
    isPending: boolean
  }
  handlers: {
    onSubmitLogin: () => void
    onChangeLoginFormField: <K extends keyof LoginForm>(key: K, value: LoginForm[K]) => void
  }
}

export const LoginPresentational = ({ data, uiState, handlers }: Props) => {
  const { loginForm, errors } = data
  const { isPending } = uiState
  const { onSubmitLogin, onChangeLoginFormField } = handlers

  return (
    <Center minH='100vh' backgroundGradient='to-br' gradientFrom='gray.900' gradientTo='gray.700'>
      <Stack gap='6' align='center' w='sm'>
        <Logo textColor='white' />
        <Card.Root w='full'>
          <Card.Body gap='4'>
            <Stack gap='1'>
              <Heading size='lg'>Sign in</Heading>
              <Text textStyle='sm' color='fg.muted'>
                Access your ProjSight sales workspace.
              </Text>
            </Stack>
            <Stack
              as='form'
              gap='4'
              onSubmit={(e) => {
                e.preventDefault()
                onSubmitLogin()
              }}
            >
              <FormField
                label='Email'
                type='email'
                value={loginForm.email}
                onChange={(value) => onChangeLoginFormField('email', value)}
                errorMessage={errors.email}
              />
              <FormField
                label='Password'
                type='password'
                value={loginForm.password}
                onChange={(value) => onChangeLoginFormField('password', value)}
                errorMessage={errors.password}
              />
              {errors.common && <Text color='fg.error'>{errors.common}</Text>}
              <Button type='submit' colorPalette='blue' loading={isPending}>
                Log in
              </Button>
            </Stack>
          </Card.Body>
        </Card.Root>
        <Text color='whiteAlpha.700' fontSize='sm'>
          Accounts are provisioned by your administrator.
        </Text>
      </Stack>
    </Center>
  )
}
