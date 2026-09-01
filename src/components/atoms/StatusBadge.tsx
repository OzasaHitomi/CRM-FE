import { Badge, HStack } from '@chakra-ui/react'
import { HiOutlineArrowsRightLeft } from 'react-icons/hi2'

type StatusBadgeProps = {
  isActive: boolean
  onClick: () => void
  disabled: boolean
}

export const StatusBadge = ({ isActive, onClick, disabled }: StatusBadgeProps) => {
  return (
    <Badge
      asChild
      colorPalette={isActive ? 'green' : 'gray'}
      cursor='pointer'
      _hover={{ opacity: 0.8 }}
    >
      <button
        type='button'
        onClick={onClick}
        disabled={disabled}
        title='クリックしてステータスを切り替え'
      >
        <HStack gap='1'>
          <span>{isActive ? 'Active' : 'Inactive'}</span>
          <HiOutlineArrowsRightLeft size={12} />
        </HStack>
      </button>
    </Badge>
  )
}
