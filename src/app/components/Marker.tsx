import React from 'react'
import type { Place } from '../types'

type Props = google.maps.MarkerOptions & {
  place: Place
  onClick?: () => void
}

/**
 * Shows a Marker with an InfoWindow on the map.
 */
export default function Marker(props: Props) {
  const { place, onClick, ...options } = props
  const [marker, setMarker] = React.useState<google.maps.Marker>()
  const [infoWindow, setInfoWindow] = React.useState<google.maps.InfoWindow>()

  React.useEffect(() => {
    // Create the Marker and InfoWindow objects.
    if (!marker) {
      setMarker(new google.maps.Marker())
      setInfoWindow(
        new google.maps.InfoWindow({
          content: `
            <b>${place.name}</b>
            <p>${place.address}</p>
            ${
              place.url
                ? `<a href="${place.url}" target="_blank">View on Google Maps</a>`
                : ''
            }
          `,
        })
      )
    }

    // Close the info window and remove marker from the map on unmount.
    return () => {
      if (infoWindow) {
        infoWindow.close()
      }
      if (marker) {
        marker.setMap(null)
      }
    }
  }, [marker])

  // When the marker or its options change, update its config
  // and add a click event listener to open the info window.
  React.useEffect(() => {
    if (marker) {
      marker.setOptions(options)
      if (infoWindow) {
        marker.addListener('click', () => {
          infoWindow.open(marker.getMap(), marker)
          onClick && onClick()
        })
      }
    }
  }, [marker, options])

  return null
}
