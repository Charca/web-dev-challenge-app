import { Button, Card, Stack, Image, Text, Group } from '@mantine/core'
import { useContext, useEffect, useRef } from 'react'
import { MapPin, Check, X } from 'tabler-icons-react'
import { AppContext } from '../AppContext'
import type { Place as PlaceType } from '../types'
import PlaceControls from './PlaceControls'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'

/**
 * Shows a Place information as a Card.
 */
export default function Place({
  place,
  num,
  onDelete,
  onUp,
  onDown,
  isActive = false,
}: {
  place: PlaceType
  num: number
  onDelete?: (placeId: string) => void
  onUp: (placeId: string) => void
  onDown: (placeId: string) => void
  isActive?: boolean
}) {
  const { map, isUserChallenge, challenge } = useContext(AppContext)
  const cardRef = useRef<HTMLDivElement>(null)
  const markLocationComplete = useMutation(api.users.markLocationComplete)
  const markLocationIncomplete = useMutation(api.users.markLocationIncomplete)

  const completedLocations = challenge?.completedLocations || []
  const isCompleted = completedLocations.includes(place.id)

  // Center the map on the place location and zoon in.
  function onClick() {
    if (map) {
      map.setCenter(place.location)
      map.setZoom(17)
    }
  }

  function onMarkComplete() {
    if (!challenge || !challenge.id) {
      return
    }

    markLocationComplete({
      id: challenge.id,
      locationId: place.id,
    })
  }

  function onMarkIncomplete() {
    if (!challenge || !challenge.id) {
      return
    }

    markLocationIncomplete({
      id: challenge.id,
      locationId: place.id,
    })
  }

  // If this Place becomes the active place, scroll to it.
  useEffect(() => {
    if (isActive && cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [isActive])

  return (
    <Card
      p="lg"
      shadow="md"
      ref={cardRef}
      className={isActive ? 'highlighted' : ''}
    >
      <Card.Section className="place-card-section">
        <div className="place-card-left">
          <Image
            alt={place.name}
            src={place.photo}
            width={160}
            height={110}
            radius={4}
          />
          <div className="place-card-controls">
            <PlaceControls
              onDelete={onDelete ? () => onDelete(place.id) : undefined}
              onUp={() => onUp(place.id)}
              onDown={() => onDown(place.id)}
            />
          </div>
        </div>
        <Stack style={{ marginLeft: 12, minHeight: 150, flex: 1 }}>
          <Text weight={500}>
            {num}. {place.name}
          </Text>
          <Text size="sm">{place.address}</Text>

          <Stack style={{ gap: 0 }}>
            <Button
              leftIcon={<MapPin size={14} />}
              variant="light"
              color="blue"
              fullWidth
              style={{ marginTop: 14 }}
              onClick={onClick}
            >
              Show on map
            </Button>
            {isUserChallenge && (
              <Button
                leftIcon={isCompleted ? <X size={14} /> : <Check size={14} />}
                variant="light"
                color={isCompleted ? 'green' : 'gray'}
                fullWidth
                style={{ marginTop: 14 }}
                onClick={isCompleted ? onMarkIncomplete : onMarkComplete}
              >
                {isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
              </Button>
            )}
          </Stack>
        </Stack>
      </Card.Section>
    </Card>
  )
}
