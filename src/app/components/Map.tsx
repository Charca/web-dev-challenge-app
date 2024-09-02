import { useContext, useEffect, useRef, useState } from 'react'
import { AppContext } from '../AppContext'
import Marker from './Marker'

/**
 * Shows a Google Map originally centered and zoomed in using the
 * given `center` and `zoom` props.
 * Also renders a list of places as Markers on the map.
 */
function Map({
  center,
  zoom,
}: {
  center: google.maps.LatLngLiteral
  zoom: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { map, setMap, places, setActivePlaceId } = useContext(AppContext)

  // Create the Google Map instance
  useEffect(() => {
    if (ref.current && !map) {
      setMap(
        new window.google.maps.Map(ref.current, {
          center,
          zoom,
        })
      )
    }
  }, [ref, map])

  // When a Marker is clicked, set it as the active Place ID
  function handleMarkerClick(placeId: string) {
    setActivePlaceId(placeId)
  }

  return (
    <>
      <div ref={ref} className="map-container" />
      {places?.map((place, index) => (
        <Marker
          key={place.id}
          place={place}
          onClick={() => handleMarkerClick(place.id)}
          position={place.location}
          map={map}
          label={{
            text: `${index + 1}`,
            color: '#FFFFFF',
            fontWeight: 'bold',
          }}
        />
      ))}
    </>
  )
}

export default Map
