import { Wrapper } from '@googlemaps/react-wrapper'
import HomeScreen from './screens/HomeScreen'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { ClerkProvider, useAuth, useUser } from '@clerk/clerk-react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'

const convex = new ConvexReactClient(
  import.meta.env.PUBLIC_CONVEX_URL as string
)

function App() {
  return (
    <Wrapper
      apiKey={import.meta.env.PUBLIC_GOOGLE_MAPS_API_KEY}
      libraries={['places']}
    >
      <ClerkProvider
        publishableKey={import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY}
      >
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <HomeScreen />
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </Wrapper>
  )
}

export default App
