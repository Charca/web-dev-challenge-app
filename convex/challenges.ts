import { query, mutation } from './_generated/server'
import { v } from 'convex/values'
import { challenge, place } from './schema'

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('challenges').collect()
  },
})

export const getById = query({
  args: {
    id: v.id('challenges'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const create = mutation({
  args: challenge,
  handler: async (ctx, args) => {
    const challengeId = await ctx.db.insert('challenges', {
      name: args.name,
      place: args.place,
      locations: [],
    })

    return challengeId
  },
})

export const remove = mutation({
  args: {
    id: v.id('challenges'),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})

export const update = mutation({
  args: {
    id: v.id('challenges'),
    locations: v.array(place),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      locations: args.locations,
    })
  },
})

export const addLocation = mutation({
  args: {
    id: v.id('challenges'),
    location: place,
  },
  handler: async (ctx, args) => {
    const challenge = await ctx.db.get(args.id)

    if (!challenge) {
      throw new Error('Challenge not found')
    }

    await ctx.db.patch(args.id, {
      locations: [...challenge.locations, args.location],
    })
  },
})

export const removeLocation = mutation({
  args: {
    id: v.id('challenges'),
    locationId: v.string(),
  },
  handler: async (ctx, args) => {
    const challenge = await ctx.db.get(args.id)

    if (!challenge) {
      throw new Error('Challenge not found')
    }

    await ctx.db.patch(args.id, {
      locations: challenge.locations.filter(
        (location) => location.id !== args.locationId
      ),
    })
  },
})
