import {
  Burger,
  Header as BaseHeader,
  MediaQuery,
  Title,
  useMantineTheme,
  Button,
} from '@mantine/core'

import { SignInButton, UserButton } from '@clerk/clerk-react'
import { Authenticated, Unauthenticated, useQuery } from 'convex/react'

/**
 * Application Header. Includes button to toggle the Sidebar on small screens.
 */
export default function Header({
  sidebarOpen = false,
  onBurgerClick,
  noSidebar = false,
}: {
  sidebarOpen?: boolean
  onBurgerClick?: () => void
  noSidebar?: boolean
}) {
  const theme = useMantineTheme()
  return (
    <BaseHeader height={70} p="md" style={{ viewTransitionName: 'header' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          justifyContent: 'space-between',
        }}
      >
        {!noSidebar && (
          <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
            <Burger
              opened={sidebarOpen}
              onClick={onBurgerClick}
              size="sm"
              color={theme.colors.gray[6]}
              mr="xl"
            />
          </MediaQuery>
        )}

        <a className="logo" href="/">
          <Title>🍔 Tasty Challenges</Title>
        </a>

        <Unauthenticated>
          <SignInButton>
            <Button>Sign In</Button>
          </SignInButton>
        </Unauthenticated>
        <Authenticated>
          <UserButton />
        </Authenticated>
      </div>
    </BaseHeader>
  )
}
