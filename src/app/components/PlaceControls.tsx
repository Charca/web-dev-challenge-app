import React from 'react'
import { ActionIcon, Button, Group, Modal } from '@mantine/core'
import { ArrowDown, ArrowUp, Trash } from 'tabler-icons-react'

/**
 * Shows controls to delete or re-order a Place.
 * Can also be used to delete a Challenge if the isChallenge flag is set.
 */
export default function PlaceControls({
  onDelete,
  onUp,
  onDown,
  isChallenge = false,
}: {
  onDelete?: () => void
  onUp?: () => void
  onDown?: () => void
  isChallenge?: boolean
}) {
  const [showDelete, setShowDelete] = React.useState(false)

  function onDeleteClick() {
    setShowDelete(true)
  }

  return (
    <>
      <Modal
        opened={showDelete}
        onClose={() => setShowDelete(false)}
        title={`Delete ${isChallenge ? 'Challenge' : 'Place'}`}
      >
        <p>{`Are you sure you want to delete this ${
          isChallenge ? 'challenge' : 'place'
        }?`}</p>
        <Group position="center">
          <Button color="gray" onClick={() => setShowDelete(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              setShowDelete(false)
              onDelete && onDelete()
            }}
            color="red"
          >
            Delete
          </Button>
        </Group>
      </Modal>
      {onDelete && (
        <ActionIcon onClick={onDeleteClick}>
          <Trash size={20} />
        </ActionIcon>
      )}
      {!isChallenge && (
        <>
          <ActionIcon onClick={onUp}>
            <ArrowUp size={20} />
          </ActionIcon>
          <ActionIcon onClick={onDown}>
            <ArrowDown size={20} />
          </ActionIcon>
        </>
      )}
    </>
  )
}
