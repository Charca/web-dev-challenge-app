import {
  Card,
  Image,
  Text,
  Button,
  Group,
  useMantineTheme,
} from '@mantine/core'
import type { Challenge } from '../types'
import PlaceControls from './PlaceControls'
import { useStore } from '@nanostores/react'
import { $authStore } from '@clerk/astro/client'

function ChallengeCard({
  challenge,
  onDelete,
}: {
  challenge: Challenge
  onDelete: () => void
}) {
  const theme = useMantineTheme()
  const { userId } = useStore($authStore)
  const isLoggedIn = !!userId

  return (
    <div style={{ margin: 'auto', width: '100%' }}>
      <Card shadow="sm" p="lg">
        <Card.Section>
          <Image
            src={challenge.place.photo}
            height={160}
            alt={challenge.place.name}
          />
        </Card.Section>

        <Group
          position="apart"
          style={{ marginBottom: 5, marginTop: theme.spacing.sm, gap: 0 }}
        >
          <div>
            <Text weight={500}>{challenge.name}</Text>
            <Text weight={400}>{challenge.place.address}</Text>
          </div>

          {isLoggedIn && (
            <div style={{ display: 'flex' }}>
              <PlaceControls isChallenge onDelete={onDelete} />
            </div>
          )}
        </Group>

        {isLoggedIn && (
          <Button
            variant="light"
            color="blue"
            fullWidth
            style={{ marginTop: 14 }}
            onClick={() =>
              (window.location.href = `/challenge/${challenge._id}`)
            }
          >
            Open challenge
          </Button>
        )}
      </Card>
    </div>
  )
}

export default ChallengeCard
