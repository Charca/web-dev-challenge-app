import { Divider, Stack, Text, TextInput } from '@mantine/core'
import { useContext, useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { AppContext } from '../AppContext'
import type { Place as PlaceType } from '../types'
import Place from './Place'
import PlacesHeader from './PlacesHeader'

/**
 * Shows a list of Places and a Header for the selected Challenge.
 */
export default function Places() {
  const inputRef = useRef<HTMLInputElement>(null)
  const {
    map,
    places,
    setPlaces,
    challenge,
    activePlaceId,
    setActivePlaceId,
    isUserChallenge,
  } = useContext(AppContext)
  const [init, setInit] = useState(false)

  const directionsService = new google.maps.DirectionsService()
  const directionsDisplay = new google.maps.DirectionsRenderer({
    suppressMarkers: true,
  })

  useEffect(() => {
    if (inputRef.current && map && !init) {
      const options = {
        fields: [
          'place_id',
          'formatted_address',
          'geometry',
          'name',
          'photo',
          'type',
          'icon',
          'url',
        ],
        strictBounds: false,
        types: [],
      }

      // Creates a Google Places Autocomplete object.
      const autocomplete = new google.maps.places.Autocomplete(
        inputRef.current,
        options
      )

      autocomplete.bindTo('bounds', map)

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()

        if (!place.geometry || !place.geometry.location) {
          // Invalid Place or failed request.
          window.alert("No details available for input: '" + place.name + "'")
          return
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport)
        } else {
          map.setCenter(place.geometry.location)
          map.setZoom(17)
        }

        setPlaces((prevPlaces: PlaceType[]) => {
          // If the place is already in the list, mark it as the active place
          // and don't add it again.
          if (prevPlaces.find((p) => p.id === place.place_id)) {
            setActivePlaceId(place.place_id)
            return prevPlaces
          }

          // Add the place to the list.
          return [
            ...prevPlaces,
            {
              id: place.place_id || uuidv4(),
              name: place.name || '',
              address: place.formatted_address || '',
              location: place.geometry?.location?.toJSON() || {},
              photo: place.photos
                ? place.photos[0]?.getUrl({ maxWidth: 200 })
                : '',
              icon: place.icon,
              url: place.url,
            },
          ]
        })
      })

      // Set the init flag to prevent creating multiple autocomplete instances.
      setInit(true)
    }
  }, [map])

  // Handles deleting a place.
  function onPlaceDelete(placeId: string) {
    setPlaces((prevPlaces: PlaceType[]) =>
      prevPlaces.filter((place: PlaceType) => place.id !== placeId)
    )
  }

  // Handles re-ordering a place lower in the list.
  function onPlaceDown(placeId: string) {
    // First clear the route in case there is one generated.
    clearRoute()

    setPlaces((prevPlaces: PlaceType[]) => {
      const index = prevPlaces.findIndex(
        (place: PlaceType) => place.id === placeId
      )

      // Check that the place exists and that is not the last one on the list.
      if (index === -1 || index === prevPlaces.length - 1) {
        return prevPlaces
      }

      return [
        ...prevPlaces.slice(0, index),
        prevPlaces[index + 1],
        prevPlaces[index],
        ...prevPlaces.slice(index + 2),
      ]
    })
  }

  // Handlers re-ordering a place higher in the list.
  function onPlaceUp(placeId: string) {
    // First clear the route in case there is one generated.
    clearRoute()

    setPlaces((prevPlaces: PlaceType[]) => {
      const index = prevPlaces.findIndex(
        (place: PlaceType) => place.id === placeId
      )

      // Check that the place exists and that is not the first one on the list.
      if (index === -1 || index === 0) {
        return prevPlaces
      }

      return [
        ...prevPlaces.slice(0, index - 1),
        prevPlaces[index],
        prevPlaces[index - 1],
        ...prevPlaces.slice(index + 1),
      ]
    })
  }

  // Clears the route from the map.
  function clearRoute() {
    if (!map) {
      return
    }

    // @ts-ignore
    directionsDisplay.setDirections({ routes: [] })
  }

  return (
    <div>
      <PlacesHeader
        directionsDisplay={directionsDisplay}
        directionsService={directionsService}
        clearRoute={clearRoute}
      />

      <Stack style={{ marginTop: 12 }}>
        <Text size="lg" weight={700}>
          Places
        </Text>
        <Divider />
        {!isUserChallenge && (
          <>
            <TextInput
              placeholder="Enter a location name (e.g. 'Honolulu Airport')"
              label="Search Places"
              ref={inputRef}
            />
          </>
        )}

        {places?.length === 0 && (
          <div style={{ padding: 20 }}>
            <Divider
              label="No places added yet"
              labelPosition="center"
              variant="dashed"
            />
          </div>
        )}

        <Stack>
          {places?.map((place, index) => (
            <Place
              key={place.id}
              place={place}
              num={index + 1}
              onDelete={isUserChallenge ? undefined : onPlaceDelete}
              onUp={onPlaceUp}
              onDown={onPlaceDown}
              isActive={place.id === activePlaceId}
            />
          ))}
        </Stack>
      </Stack>
    </div>
  )
}
