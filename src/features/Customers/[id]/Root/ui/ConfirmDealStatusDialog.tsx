import { Button, Dialog, Portal, Text } from '@chakra-ui/react'

type ConfirmDealStatusDialogProps = {
  isOpen: boolean
  isUpdatingDealStatus: boolean
  onCancel: () => void
  onConfirm: () => void
}

export const ConfirmDealStatusDialog = ({
  isOpen,
  isUpdatingDealStatus,
  onCancel,
  onConfirm,
}: ConfirmDealStatusDialogProps) => {
  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => {
        if (!details.open) onCancel()
      }}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Confirm Status Change</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text>この操作は取り消せません。よろしいですか？</Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant='outline' onClick={onCancel}>
                Cancel
              </Button>
              <Button colorPalette='red' loading={isUpdatingDealStatus} onClick={onConfirm}>
                Confirm
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
