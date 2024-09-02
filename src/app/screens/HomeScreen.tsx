import {
  Alert,
  AppShell,
  Button,
  Group,
  Modal,
  SimpleGrid,
} from '@mantine/core'
import React, { useEffect } from 'react'
import type { Challenge, Place } from '../types'
import Header from '../components/Header'
import NewChallengeForm from '../components/NewChallengeForm'
import ChallengeCard from '../components/ChallengeCard'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import type { Id } from '../../../convex/_generated/dataModel'
import { useUser } from '@clerk/clerk-react'
import { useStore } from '@nanostores/react'
import { $authStore } from '@clerk/astro/client'
import UserChallengeCard from '../components/UserChallengeCard'

export default function HomeScreen() {
  const [modalOpened, setModalOpened] = React.useState(false)
  const allChallenges = useQuery(api.challenges.get)
  const createChallenge = useMutation(api.challenges.create)
  const removeChallenge = useMutation(api.challenges.remove)
  const userChallenges = useQuery(api.users.getChallenges)
  const { userId } = useStore($authStore)
  const isLoggedIn = !!userId

  function onPlaceAdded(place: Place, name: string) {
    createChallenge({ name, place, locations: [] })
    setModalOpened(false)
  }

  function onChallengeDeleted(challengeId: Id<'challenges'>) {
    removeChallenge({ id: challengeId })
  }

  function renderChallanges(challenges: any[], isUserChallenges: boolean) {
    return (
      <div style={{ maxWidth: 980 }}>
        {!challenges || challenges.length === 0 ? (
          <Alert>
            {isUserChallenges
              ? `You haven't joined any challenges yet.`
              : `There are no challenges yet.`}
          </Alert>
        ) : (
          <SimpleGrid
            cols={3}
            spacing="lg"
            breakpoints={[
              { maxWidth: 980, cols: 3, spacing: 'md' },
              { maxWidth: 800, cols: 2, spacing: 'sm' },
              { maxWidth: 600, cols: 1, spacing: 'sm' },
            ]}
          >
            {challenges.map((challenge, i) => {
              const { _id, id } = challenge
              const key = _id || `user_challenge_${id}`
              const Component = isUserChallenges
                ? UserChallengeCard
                : ChallengeCard

              return (
                <Component
                  key={key}
                  challenge={challenge}
                  onDelete={() => onChallengeDeleted(challenge._id)}
                />
              )
            })}
          </SimpleGrid>
        )}
      </div>
    )
  }

  return (
    <AppShell
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      header={<Header noSidebar />}
    >
      {userId && (
        <>
          <Group>
            <h2>Your Challenges</h2>
          </Group>
          {renderChallanges(userChallenges ?? [], true)}
        </>
      )}

      <Group>
        <h2>All Challenges</h2>
        {isLoggedIn && (
          <Button onClick={() => setModalOpened(true)}>New Challenge</Button>
        )}
      </Group>
      <div style={{ maxWidth: 980 }}>
        {renderChallanges(allChallenges ?? [], false)}
      </div>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="New Challenge"
      >
        <NewChallengeForm onSubmit={onPlaceAdded} />
      </Modal>
    </AppShell>
  )
}
