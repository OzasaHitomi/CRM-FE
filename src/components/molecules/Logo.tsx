import { Heading, HStack } from '@chakra-ui/react'

import { LogoMark } from '@/components/atoms/LogoMark'
import { APP_NAME } from '@/share/constants/appName'

type LogoProps = {
  textColor?: string
}

export const Logo = ({ textColor }: LogoProps) => {
  return (
    <HStack gap='2'>
      <LogoMark />
      <Heading size='lg' color={textColor}>
        {APP_NAME}
      </Heading>
    </HStack>
  )
}
