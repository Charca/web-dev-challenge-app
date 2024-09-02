import { useLocalStorage } from '@mantine/hooks'
import React from 'react'
import type { Place, Challenge, UserChallenge } from './types'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'

type ContextType = {
  map: google.maps.Map | undefined
  setMap: (map: google.maps.Map | undefined) => void
  places: Place[] | undefined
  setPlaces: (callback: (prevPlaces: Place[]) => Place[]) => void
  challenge?: Challenge
  activePlaceId: string | undefined
  setActivePlaceId: React.Dispatch<React.SetStateAction<string | undefined>>
  isUserChallenge: boolean
}

const AppContext = React.createContext<ContextType>({
  map: undefined,
  setMap: () => {},
  places: [],
  setPlaces: () => {},
  activePlaceId: undefined,
  setActivePlaceId: () => {},
  isUserChallenge: false,
})

/**
 * This Context Provider is used to share data between components
 * at different levels of the application.
 */
function AppContextProvider({
  children,
  challenge,
  isUserChallenge,
}: {
  children: React.ReactNode
  challenge: Challenge
  isUserChallenge: boolean
}) {
  const [activePlaceId, setActivePlaceId] = React.useState<string | undefined>()
  const [map, setMap] = React.useState<google.maps.Map>()
  const updateChallenge = useMutation(api.challenges.update)
  // const [places, setPlaces] = useLocalStorage<Place[]>({
  //   key: `travel-planner-places-${challenge?._id}`,
  //   defaultValue: [],
  // })

  let places = challenge?.locations || []
  const setPlaces = (callback: (prevPlaces: Place[]) => Place[]) => {
    const updatedPlaces = callback(places)
    places = updatedPlaces

    updateChallenge({
      id: challenge?._id,
      locations: updatedPlaces,
    })
  }

  const contextValue = {
    map,
    setMap,
    places,
    setPlaces,
    activePlaceId,
    setActivePlaceId,
    challenge,
    isUserChallenge,
  }

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  )
}

export { AppContext, AppContextProvider }
