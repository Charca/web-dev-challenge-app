import {
  BackgroundImage,
  Button,
  Checkbox,
  Group,
  Stack,
  Text,
  Tooltip,
  Progress,
} from '@mantine/core'
import { useContext, useEffect, useState } from 'react'
import { InfoCircle } from 'tabler-icons-react'
import { AppContext } from '../AppContext'
import Weather from './Weather'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import JSConfetti from 'js-confetti'

const jsConfetti = new JSConfetti()

/**
 * Shows a Header for a Challenge with map and route controls.
 */
export default function PlacesHeader({
  directionsService,
  directionsDisplay,
  clearRoute,
}: {
  directionsService: google.maps.DirectionsService
  directionsDisplay: google.maps.DirectionsRenderer
  clearRoute: () => void
}) {
  const [optimizeRoute, setOptimizeRoute] = useState(false)
  const { map, places, challenge, isUserChallenge } = useContext(AppContext)
  const joinChallenge = useMutation(api.users.joinChallenge)

  const completedLocations = challenge?.completedLocations || []
  const completedCount = completedLocations.length
  const totalLocations = challenge?.locations.length || 0
  const progress = Math.round((completedCount / totalLocations) * 100)

  useEffect(() => {
    console.log('progress', progress)
    if (progress >= 100) {
      jsConfetti.addConfetti()
    }
  }, [progress])

  // Resets the map to the original zoom level and location.
  function resetMap() {
    if (!challenge?.place.location) {
      return
    }

    map?.setCenter(challenge.place.location)
    map?.setZoom(11)
  }

  // Uses the directionsService to calculate a route between all places.
  function generateRoute() {
    if (!map || !places || places.length < 2) {
      return
    }

    if (places.length > 27) {
      window.alert('Can only generate a route for up to 27 places.')
      return
    }

    directionsDisplay.setMap(map)

    // Calls the directions service, passing the first place as the origin,
    // the last place as the destination, and the places in between as the waypoints.
    directionsService.route(
      {
        origin: places[0].location,
        destination: places[places.length - 1].location,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: optimizeRoute,
        waypoints: places.slice(1, places.length - 1).map((place) => ({
          location: place.location,
          stopover: true,
        })),
      },
      (response, status) => {
        if (status === 'OK') {
          // Clears the existing route and shows the new one on the map.
          clearRoute()
          directionsDisplay.setDirections(response)
        } else {
          window.alert('Directions request failed due to ' + status)
        }
      }
    )
  }

  async function doJoinChallenge() {
    if (!challenge) {
      return
    }

    const { _creationTime, _id, ...challengeWithoutConvexData } = challenge

    await joinChallenge({
      challenge: {
        ...challengeWithoutConvexData,
        id: _id,
      },
    })

    window.location.href = `/user-challenge/${challenge._id}`
  }

  if (!challenge) {
    return null
  }

  return (
    <>
      <BackgroundImage
        src={challenge.place.photo || ''}
        radius={4}
        className="challenge-header"
      >
        <Stack spacing={0} style={{ padding: '10px 12px' }}>
          <Text size="xl" weight={700} style={{ color: 'white', zIndex: 1 }}>
            {challenge?.name}
          </Text>
          <Text size="md" style={{ color: 'white', zIndex: 1 }}>
            {challenge?.place.address}
          </Text>
        </Stack>
        <div className="challenge-header-overlay" />
      </BackgroundImage>
      <Group style={{ marginTop: 12 }} position="apart" align={'flex-start'}>
        <div>
          <Text
            transform="uppercase"
            weight={700}
            size="xs"
            style={{ marginBottom: 8 }}
          >
            Map Controls
          </Text>

          <Stack spacing={'xs'}>
            <Button onClick={resetMap}>Reset Map Zoom</Button>
          </Stack>

          <Group spacing={'xs'}>
            <Text
              transform="uppercase"
              weight={700}
              size="xs"
              style={{ marginBottom: 8, marginTop: 8 }}
            >
              Route Controls
            </Text>
            <Tooltip
              withArrow
              wrapLines
              width={220}
              position="right"
              label="You need to add at least two places to generate a route"
            >
              <InfoCircle size={14} />
            </Tooltip>
          </Group>
          <Stack spacing={'xs'}>
            <Button
              disabled={places && places.length < 2}
              onClick={generateRoute}
            >
              Generate Route
            </Button>
            <Button disabled={places && places.length < 2} onClick={clearRoute}>
              Clear Route
            </Button>
            {/* <Checkbox
              checked={optimizeRoute}
              disabled={places && places.length < 2}
              onChange={() => {
                clearRoute()
                setOptimizeRoute(!optimizeRoute)
              }}
              label="Optimize Route"
            /> */}
          </Stack>
        </div>

        <Stack>
          <Weather place={challenge.place} />
          {!isUserChallenge ? (
            <Button onClick={doJoinChallenge}>Join Challenge</Button>
          ) : (
            <>
              <Text
                transform="uppercase"
                weight={700}
                size="xs"
                style={{ marginBottom: 0, marginTop: 8 }}
              >
                Challenge Progress: {progress}%
              </Text>
              <Progress value={progress} />
            </>
          )}
        </Stack>
      </Group>
    </>
  )
}
