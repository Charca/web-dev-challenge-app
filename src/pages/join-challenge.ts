import { createClerkClient } from '@clerk/backend'

const clerkClient = createClerkClient({
  secretKey: import.meta.env.CLERK_SECRET_KEY,
})

export async function POST({
  locals,
  request,
}: {
  locals: any
  request: Request
}) {
  const { userId } = await locals.auth()
  const challenge = await request.json()

  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const user = await locals.currentUser()
  const existingChallenges = user.publicMetadata.challenges || []

  const response = await clerkClient.users.updateUserMetadata(userId, {
    publicMetadata: {
      challenges: [...existingChallenges, challenge],
    },
  })

  return new Response(JSON.stringify(response))
}
