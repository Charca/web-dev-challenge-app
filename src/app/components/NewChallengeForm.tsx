import React from 'react'
import { Button, Image, Stack, Text, TextInput } from '@mantine/core'
import type { Place } from '../types'
import { v4 as uuidv4 } from 'uuid'

/**
 * Form with Places autocomplete to create new Challenge.
 */
function NewChallengeForm({
  onSubmit,
}: {
  onSubmit: (place: Place, name: string) => void
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [place, setPlace] = React.useState<Place>()
  const [name, setName] = React.useState<string>('')

  React.useEffect(() => {
    if (inputRef.current) {
      const options = {
        fields: ['place_id', 'formatted_address', 'geometry', 'name', 'photo'],
        strictBounds: false,
        types: ['(cities)'],
      }

      // Creates a Google Places Autocomplete object, restricting the search
      // to cities only.
      const autocomplete = new google.maps.places.Autocomplete(
        inputRef.current,
        options
      )

      // When a place is selected, set it as the active place.
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()

        setPlace({
          id: place.place_id || uuidv4(),
          name: place.name || '',
          address: place.formatted_address || '',
          location: place.geometry?.location?.toJSON() || {},
          photo: place.photos ? place.photos[0]?.getUrl({ maxWidth: 400 }) : '',
        })
      })
    }
  }, [])

  return (
    <Stack>
      <TextInput
        data-autofocus
        placeholder="(e.g. 'Best Burgers in Paris')"
        label="Challenge Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextInput
        placeholder="Enter a city name (e.g. 'Paris')"
        label="Search Cities"
        ref={inputRef}
      />
      {place && (
        <Stack>
          <Text weight={700}>{place.name}</Text>
          <Image src={place.photo} height={160} alt={place.name} />
          <Button onClick={() => onSubmit(place, name)}>
            Create Challenge
          </Button>
        </Stack>
      )}
    </Stack>
  )
}

export default NewChallengeForm
