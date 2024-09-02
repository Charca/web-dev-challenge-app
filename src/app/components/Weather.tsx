import { Group, Paper, Text, Stack, Image, Badge } from '@mantine/core'
import { useEffect, useState } from 'react'
import type { Place } from '../types'

type PlaceWeather = {
  name: string
  temp: number
  main: string
  icon: string
  description: string
}

/**
 * Weather widget that shows current weather and temperature
 * for a Place.
 */
export default function Weather({ place }: { place: Place }) {
  const [weather, setWeather] = useState<PlaceWeather>()

  // When this component mounts, fetch the OpenWeatherMap API for
  // the current weather conditions for this location.
  useEffect(() => {
    const { lat, lng } = place.location

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?units=imperial&lat=${lat}&lon=${lng}&appid=${
        import.meta.env.PUBLIC_OPENWEATHER_API_KEY
      }`
    )
      .then((res) => res.json())
      .then((res) => {
        setWeather({
          name: res.name,
          temp: Math.round(res.main.temp),
          description: res.weather[0].description,
          main: res.weather[0].main,
          icon: res.weather[0].icon,
        })
      })
  }, [])

  if (!weather) {
    return null
  }

  return (
    <div>
      <Text
        transform="uppercase"
        weight={700}
        size="xs"
        style={{ marginBottom: 8 }}
      >
        Current weather
      </Text>
      <Paper
        shadow="xs"
        withBorder
        style={{ padding: 12, display: 'inline-block' }}
      >
        <Group>
          <div>
            <Badge>{weather.main}</Badge>
            <Text style={{ fontSize: 30 }} weight={700}>
              {weather.temp}°F
            </Text>
          </div>
          <Image
            src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.description}
            width={72}
            height={72}
          />
        </Group>
      </Paper>
    </div>
  )
}
