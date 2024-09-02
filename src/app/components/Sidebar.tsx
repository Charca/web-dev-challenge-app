import { Navbar, Text } from '@mantine/core'
import Places from './Places'

/**
 * Sidebar component. Renders the Places for a given Challenge.
 */
export default function Sidebar({ opened }: { opened: boolean }) {
  return (
    <Navbar
      style={{ overflow: 'auto' }}
      p="md"
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{ sm: 500, lg: 500 }}
    >
      <Places />
    </Navbar>
  )
}
