import type { APIRoute } from 'astro'
import { createClerkClient } from '@clerk/backend'

const clerkClient = createClerkClient({
  secretKey: import.meta.env.CLERK_SECRET_KEY,
})

export async function GET({ locals }: { locals: any }) {
  if (!locals.auth().userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const currentUser = await locals.currentUser()

  return new Response(JSON.stringify(currentUser))
}

export async function POST({ locals }: { locals: any }) {
  const { userId } = await locals.auth()

  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const response = await clerkClient.users.updateUserMetadata(userId, {
    publicMetadata: {
      age: '22',
    },
  })

  return new Response(JSON.stringify(response))
}
