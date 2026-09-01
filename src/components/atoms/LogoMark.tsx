import { Square } from '@chakra-ui/react'
import { HiCube } from 'react-icons/hi2'

export const LogoMark = () => {
  return (
    <Square size='8' bg='blue.600' color='white' borderRadius='md'>
      <HiCube size='20' />
    </Square>
  )
}
