import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { challenge, place } from './schema'

export const getChallenges = query({
  args: {},
  handler: async (ctx) => {
    let identity
    try {
      identity = await ctx.auth.getUserIdentity()
    } catch (e) {
      return []
    }

    const existingUser = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('email'), identity?.email ?? ''))
      .unique()

    return existingUser?.challenges
  },
})

export const getChallengeById = query({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    let identity = await ctx.auth.getUserIdentity()

    const existingUser = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('email'), identity?.email ?? ''))
      .unique()

    const challenges = existingUser?.challenges

    return challenges?.find((challenge) => challenge.id === args.id) ?? null
  },
})

export const joinChallenge = mutation({
  args: {
    challenge: v.object({
      id: v.string(),
      name: v.string(),
      place: place,
      locations: v.array(place),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (identity === null) {
      throw new Error('Not authenticated')
    }

    const existingUser = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('email'), identity.email))
      .unique()

    let user = existingUser

    if (!user) {
      const userId = await ctx.db.insert('users', {
        email: identity.email ?? '',
        challenges: [],
      })

      user = (await ctx.db.get(userId))!
    }

    await ctx.db.patch(user._id, {
      challenges: [
        ...user.challenges,
        { ...args.challenge, completed: false, completedLocations: [] },
      ],
    })
  },
})

export const markLocationComplete = mutation({
  args: {
    id: v.string(),
    locationId: v.string(),
  },
  handler: async (ctx, args) => {
    let identity = await ctx.auth.getUserIdentity()

    const existingUser = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('email'), identity?.email ?? ''))
      .unique()

    if (!existingUser) {
      throw new Error('User not found')
    }

    const challenges = existingUser?.challenges

    const challenge =
      challenges?.find((challenge) => challenge.id === args.id) ?? null

    if (!challenge) {
      throw new Error('Challenge not found')
    }

    await ctx.db.patch(existingUser._id, {
      challenges: challenges?.map((challenge) => {
        if (challenge.id === args.id) {
          return {
            ...challenge,
            completedLocations: [
              ...challenge.completedLocations,
              args.locationId,
            ],
          }
        }
        return challenge
      }),
    })
  },
})

export const markLocationIncomplete = mutation({
  args: {
    id: v.string(),
    locationId: v.string(),
  },
  handler: async (ctx, args) => {
    let identity = await ctx.auth.getUserIdentity()

    const existingUser = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('email'), identity?.email ?? ''))
      .unique()

    if (!existingUser) {
      throw new Error('User not found')
    }

    const challenges = existingUser?.challenges

    const challenge =
      challenges?.find((challenge) => challenge.id === args.id) ?? null

    if (!challenge) {
      throw new Error('Challenge not found')
    }

    await ctx.db.patch(existingUser._id, {
      challenges: challenges?.map((challenge) => {
        if (challenge.id === args.id) {
          return {
            ...challenge,
            completedLocations: challenge.completedLocations.filter(
              (locationId) => locationId !== args.locationId
            ),
          }
        }
        return challenge
      }),
    })
  },
})
