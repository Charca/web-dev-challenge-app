import { useState } from 'react'
import { AppShell } from '@mantine/core'
import Map from '../components/Map'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import { AppContextProvider } from '../AppContext'
import { useLocalStorage } from '@mantine/hooks'
import type { Challenge } from '../types'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import type { Id } from '../../../convex/_generated/dataModel'

export default function ChallengeScreen({
  challengeId,
}: {
  challengeId: Id<'challenges'>
}) {
  const [opened, setOpened] = useState(false)
  // const [challenges] = useLocalStorage<Challenge[]>({
  //   key: 'travel-planner-challenges',
  //   defaultValue: [],
  // })

  // // Find the challenge with the matching ID.
  // const challenge = challenges.find(({ _id }) => _id === challengeId)

  const challenge = useQuery(api.challenges.getById, { id: challengeId })

  if (!challenge) {
    return null
  }

  return (
    <AppContextProvider challenge={challenge} isUserChallenge={false}>
      <AppShell
        navbarOffsetBreakpoint="sm"
        asideOffsetBreakpoint="sm"
        fixed
        navbar={<Sidebar opened={opened} />}
        header={
          <Header
            sidebarOpen={opened}
            onBurgerClick={() => setOpened(!opened)}
          />
        }
      >
        <Map center={challenge?.place.location} zoom={11} />
      </AppShell>
    </AppContextProvider>
  )
}
