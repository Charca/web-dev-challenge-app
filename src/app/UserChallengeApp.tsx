import { Wrapper } from '@googlemaps/react-wrapper'
import UserChallengeScreen from './screens/UserChallengeScreen'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { ClerkProvider, useAuth } from '@clerk/clerk-react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import type { Id } from '../../convex/_generated/dataModel'
const convex = new ConvexReactClient(
  import.meta.env.PUBLIC_CONVEX_URL as string
)

function App({ challengeId }: { challengeId: Id<'challenges'> }) {
  return (
    <Wrapper
      apiKey={import.meta.env.PUBLIC_GOOGLE_MAPS_API_KEY}
      libraries={['places']}
    >
      <ClerkProvider
        publishableKey={import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY}
      >
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <UserChallengeScreen challengeId={challengeId} />
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </Wrapper>
  )
}

export default App
